// Phase 5 tests — Deliverability watcher + circuit-breakers + pod queue
// Run with: npx vitest run apps/app/src/server/src/__tests__/phase5-deliverability.test.ts

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CircuitBreaker, type CircuitBreakerChannel } from '../circuitBreaker';
import { PodQueue, type PodPriority, type PodInterventionType } from '../podQueue';

describe('CircuitBreaker', () => {
  let breaker: CircuitBreaker;

  beforeEach(() => {
    breaker = new CircuitBreaker({
      bounceRateThreshold: 2.0,
      spamComplaintThreshold: 0.1,
      bouncePauseDurationMs: 6 * 60 * 60 * 1000,
      spamPauseDurationMs: 24 * 60 * 60 * 1000,
      tenantTripThreshold: 3,
      checkIntervalMs: 60 * 1000,
    });
    breaker.reset();
  });

  it('should allow sending when no circuit breaker is tripped', () => {
    const result = breaker.isAllowed('domain-1', 'email');
    expect(result.allowed).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('should trip on bounce rate above threshold', () => {
    const event = breaker.evaluate('tenant-1', 'domain-1', 'email', {
      bounceRate: 3.2, // Above 2.0% threshold
    });

    expect(event).not.toBeNull();
    expect(event!.trigger).toBe('bounce_rate');
    expect(event!.actualValue).toBe(3.2);
    expect(event!.threshold).toBe(2.0);
    expect(event!.action).toBe('pause_domain');

    // Should now be blocked
    const check = breaker.isAllowed('domain-1', 'email');
    expect(check.allowed).toBe(false);
    expect(check.reason).toContain('bounce_rate');
  });

  it('should trip on spam complaint rate above threshold', () => {
    const event = breaker.evaluate('tenant-1', 'domain-1', 'email', {
      spamComplaintRate: 0.15, // Above 0.1% threshold
    });

    expect(event).not.toBeNull();
    expect(event!.trigger).toBe('spam_complaint');
    expect(event!.actualValue).toBe(0.15);
    expect(event!.threshold).toBe(0.1);

    // Should now be blocked
    const check = breaker.isAllowed('domain-1', 'email');
    expect(check.allowed).toBe(false);
  });

  it('should trip on LinkedIn restriction', () => {
    const event = breaker.evaluate('tenant-1', 'domain-1', 'linkedin', {
      isRestricted: true,
    });

    expect(event).not.toBeNull();
    expect(event!.trigger).toBe('li_restriction');
    expect(event!.action).toBe('pause_channel');

    // LinkedIn should be blocked
    const liCheck = breaker.isAllowed('domain-1', 'linkedin');
    expect(liCheck.allowed).toBe(false);

    // Email should still be allowed
    const emailCheck = breaker.isAllowed('domain-1', 'email');
    expect(emailCheck.allowed).toBe(true);
  });

  it('should not trip when metrics are within threshold', () => {
    const event = breaker.evaluate('tenant-1', 'domain-1', 'email', {
      bounceRate: 1.5, // Below 2.0% threshold
      spamComplaintRate: 0.05, // Below 0.1% threshold
    });

    expect(event).toBeNull();

    const check = breaker.isAllowed('domain-1', 'email');
    expect(check.allowed).toBe(true);
  });

  it('should resume domain after manual resume', () => {
    // Trip the breaker
    breaker.evaluate('tenant-1', 'domain-1', 'email', { bounceRate: 3.0 });

    // Verify it's tripped
    expect(breaker.isAllowed('domain-1', 'email').allowed).toBe(false);

    // Manual resume
    breaker.manualResume('tenant-1', 'domain-1', 'email');

    // Should be allowed again
    expect(breaker.isAllowed('domain-1', 'email').allowed).toBe(true);
  });

  it('should escalate to tenant pause after 3 domain trips in 24h', () => {
    // Trip 3 different domains
    breaker.evaluate('tenant-1', 'domain-1', 'email', { bounceRate: 3.0 });
    breaker.evaluate('tenant-1', 'domain-2', 'email', { bounceRate: 3.0 });
    breaker.evaluate('tenant-1', 'domain-3', 'email', { bounceRate: 3.0 });

    // Tenant should now be paused
    const tenantState = breaker.getTenantState('tenant-1');
    expect(tenantState?.isPaused).toBe(true);

    // domain-1 is tripped at domain level, so it returns domain-level reason
    const check1 = breaker.isAllowed('domain-1', 'email');
    expect(check1.allowed).toBe(false);
    expect(check1.reason).toContain('bounce_rate');

    // Evaluate a 4th domain (won't trip because metrics are OK)
    // but tenant is paused, so it should be blocked
    breaker.evaluate('tenant-1', 'domain-4', 'email', { bounceRate: 1.0 });

    // Now domain-4 should be blocked by tenant-level pause
    const check4 = breaker.isAllowed('domain-4', 'email');
    expect(check4.allowed).toBe(false);
    expect(check4.reason).toContain('Tenant paused');
  });

  it('Scenario C: bounce rate hits 3.2% → email lane paused within 60s', () => {
    // Simulate the exact scenario from acceptance criteria
    const startTime = Date.now();

    const event = breaker.evaluate('tenant-1', 'domain-1', 'email', {
      bounceRate: 3.2,
    });

    const elapsed = Date.now() - startTime;

    expect(event).not.toBeNull();
    expect(event!.trigger).toBe('bounce_rate');
    expect(event!.actualValue).toBe(3.2);
    expect(breaker.isAllowed('domain-1', 'email').allowed).toBe(false);
    expect(elapsed).toBeLessThan(60 * 1000); // Within 60 seconds
  });

  it('should get tripped breakers for a tenant', () => {
    breaker.evaluate('tenant-1', 'domain-1', 'email', { bounceRate: 3.0 });
    breaker.evaluate('tenant-1', 'domain-2', 'linkedin', { isRestricted: true });

    const tripped = breaker.getTrippedBreakers('tenant-1');
    expect(tripped.length).toBe(2);
  });

  it('should get recent events for a tenant', () => {
    breaker.evaluate('tenant-1', 'domain-1', 'email', { bounceRate: 3.0 });
    breaker.evaluate('tenant-1', 'domain-2', 'email', { spamComplaintRate: 0.2 });

    const events = breaker.getEvents('tenant-1');
    expect(events.length).toBe(2);
    expect(events[0].createdAt.getTime()).toBeGreaterThanOrEqual(events[1].createdAt.getTime());
  });
});

describe('PodQueue', () => {
  let queue: PodQueue;

  beforeEach(() => {
    queue = new PodQueue();
    queue.reset();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should auto-assign managed-tier tenant to operator', () => {
    const assignment = queue.autoAssign('tenant-1', 'Acme Corp');

    expect(assignment).not.toBeNull();
    expect(assignment!.tenantId).toBe('tenant-1');
    expect(assignment!.tenantName).toBe('Acme Corp');
    expect(assignment!.tenantPlan).toBe('MANAGED');
    expect(assignment!.operatorId).toBeDefined();
    expect(assignment!.operatorName).toBeDefined();
    expect(assignment!.status).toBe('ACTIVE');
  });

  it('should distribute tenants evenly across operators', () => {
    const a1 = queue.autoAssign('tenant-1', 'Acme Corp');
    const a2 = queue.autoAssign('tenant-2', 'Beta Inc');

    // Should be assigned to different operators
    expect(a1!.operatorId).not.toBe(a2!.operatorId);
  });

  it('should create intervention with correct priority', () => {
    // First assign the tenant
    queue.autoAssign('tenant-1', 'Acme Corp');

    const intervention = queue.createIntervention({
      tenantId: 'tenant-1',
      tenantName: 'Acme Corp',
      domainId: 'domain-1',
      domainName: 'acme.com',
      type: 'circuit_breaker',
      priority: 'HIGH',
      notes: 'Bounce rate exceeded 3.2%',
    });

    expect(intervention.tenantId).toBe('tenant-1');
    expect(intervention.type).toBe('circuit_breaker');
    expect(intervention.priority).toBe('HIGH');
    expect(intervention.status).toBe('OPEN');
  });

  it('should return queue sorted by priority and age', () => {
    queue.autoAssign('tenant-1', 'Acme Corp');
    queue.autoAssign('tenant-2', 'Beta Inc');

    // Create interventions with different priorities
    queue.createIntervention({
      tenantId: 'tenant-1',
      tenantName: 'Acme Corp',
      type: 'warmup_stall',
      priority: 'LOW',
    });

    queue.createIntervention({
      tenantId: 'tenant-2',
      tenantName: 'Beta Inc',
      type: 'circuit_breaker',
      priority: 'CRITICAL',
    });

    queue.createIntervention({
      tenantId: 'tenant-1',
      tenantName: 'Acme Corp',
      type: 'sequence_tuning',
      priority: 'NORMAL',
    });

    const items = queue.getQueue();

    expect(items.length).toBe(3);
    // Should be sorted: CRITICAL first, then NORMAL, then LOW
    expect(items[0].intervention.priority).toBe('CRITICAL');
    expect(items[1].intervention.priority).toBe('NORMAL');
    expect(items[2].intervention.priority).toBe('LOW');
  });

  it('should update intervention status', () => {
    queue.autoAssign('tenant-1', 'Acme Corp');

    const intervention = queue.createIntervention({
      tenantId: 'tenant-1',
      tenantName: 'Acme Corp',
      type: 'circuit_breaker',
      priority: 'HIGH',
    });

    const updated = queue.updateIntervention(intervention.id, {
      status: 'IN_PROGRESS',
      notes: 'Investigating bounce source',
    });

    expect(updated).not.toBeNull();
    expect(updated!.status).toBe('IN_PROGRESS');
    expect(updated!.notes).toBe('Investigating bounce source');
  });

  it('should resolve intervention and set resolvedAt', () => {
    queue.autoAssign('tenant-1', 'Acme Corp');

    const intervention = queue.createIntervention({
      tenantId: 'tenant-1',
      tenantName: 'Acme Corp',
      type: 'circuit_breaker',
      priority: 'HIGH',
    });

    const resolved = queue.updateIntervention(intervention.id, {
      status: 'RESOLVED',
    });

    expect(resolved).not.toBeNull();
    expect(resolved!.status).toBe('RESOLVED');
    expect(resolved!.resolvedAt).toBeDefined();
  });

  it('should exclude resolved interventions from queue', () => {
    queue.autoAssign('tenant-1', 'Acme Corp');

    const intervention = queue.createIntervention({
      tenantId: 'tenant-1',
      tenantName: 'Acme Corp',
      type: 'circuit_breaker',
      priority: 'HIGH',
    });

    expect(queue.getQueue().length).toBe(1);

    queue.updateIntervention(intervention.id, { status: 'RESOLVED' });

    expect(queue.getQueue().length).toBe(0);
  });

  it('should escalate NORMAL interventions after 2h', () => {
    queue.autoAssign('tenant-1', 'Acme Corp');

    // Create intervention with a timestamp 2h+ in the past
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000 - 1000);
    const intervention = queue.createIntervention({
      tenantId: 'tenant-1',
      tenantName: 'Acme Corp',
      type: 'warmup_stall',
      priority: 'NORMAL',
    });

    // Set createdAt to 2h ago to simulate age
    queue.setInterventionCreatedAt(intervention.id, twoHoursAgo);

    const escalated = queue.checkEscalations();

    expect(escalated.length).toBe(1);
    expect(escalated[0].priority).toBe('HIGH');
  });

  it('should get operator workload', () => {
    queue.autoAssign('tenant-1', 'Acme Corp');
    queue.autoAssign('tenant-2', 'Beta Inc');

    const operators = queue.getOperators();
    const workload = queue.getOperatorWorkload(operators[0].id);

    expect(workload).not.toBeNull();
    expect(workload!.operator.id).toBe(operators[0].id);
  });

  it('should provide queue statistics', () => {
    queue.autoAssign('tenant-1', 'Acme Corp');

    queue.createIntervention({
      tenantId: 'tenant-1',
      tenantName: 'Acme Corp',
      type: 'circuit_breaker',
      priority: 'CRITICAL',
    });

    queue.createIntervention({
      tenantId: 'tenant-1',
      tenantName: 'Acme Corp',
      type: 'warmup_stall',
      priority: 'NORMAL',
    });

    const stats = queue.getStats();

    expect(stats.totalAssignments).toBe(1);
    expect(stats.activeAssignments).toBe(1);
    expect(stats.totalInterventions).toBe(2);
    expect(stats.openInterventions).toBe(2);
    expect(stats.criticalInterventions).toBe(1);
  });
});

describe('Phase 5 integration: Scenario C end-to-end', () => {
  it('bounce rate hits 3.2% → email lane paused → pod intervention created', () => {
    const breaker = new CircuitBreaker();
    const queue = new PodQueue();
    breaker.reset();
    queue.reset();

    // Setup: assign tenant to operator
    queue.autoAssign('tenant-1', 'Acme Corp');

    // Step 1: Deliverability watcher detects high bounce rate
    const bounceRate = 3.2;
    const event = breaker.evaluate('tenant-1', 'domain-1', 'email', { bounceRate });

    expect(event).not.toBeNull();
    expect(event!.trigger).toBe('bounce_rate');

    // Step 2: Circuit breaker pauses the domain
    const check = breaker.isAllowed('domain-1', 'email');
    expect(check.allowed).toBe(false);

    // Step 3: Create pod intervention for operator
    const intervention = queue.createIntervention({
      tenantId: 'tenant-1',
      tenantName: 'Acme Corp',
      domainId: 'domain-1',
      domainName: 'acme.com',
      type: 'circuit_breaker',
      priority: 'CRITICAL',
      notes: `Bounce rate ${bounceRate}% exceeded threshold ${event!.threshold}%`,
    });

    expect(intervention.status).toBe('OPEN');
    expect(intervention.priority).toBe('CRITICAL');

    // Step 4: Verify operator sees the intervention in queue
    const items = queue.getQueue();
    expect(items.length).toBe(1);
    expect(items[0].intervention.type).toBe('circuit_breaker');
    expect(items[0].intervention.priority).toBe('CRITICAL');

    // Step 5: Operator resolves the intervention
    queue.updateIntervention(intervention.id, {
      status: 'RESOLVED',
      notes: 'Paused email sending, investigating bounce source',
    });

    // Queue should be empty after resolution
    expect(queue.getQueue().length).toBe(0);
  });
});
