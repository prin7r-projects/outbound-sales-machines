// Circuit-breaker for deliverability protection
// Per-domain pause, per-channel kill-switch, tenant-level escalation

export interface CircuitBreakerConfig {
  bounceRateThreshold: number;      // 2.0% default
  spamComplaintThreshold: number;   // 0.1% default
  bouncePauseDurationMs: number;    // 6 hours default
  spamPauseDurationMs: number;      // 24 hours default
  tenantTripThreshold: number;      // 3 pools in 24h
  checkIntervalMs: number;          // 60 seconds default
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  bounceRateThreshold: 2.0,
  spamComplaintThreshold: 0.1,
  bouncePauseDurationMs: 6 * 60 * 60 * 1000,
  spamPauseDurationMs: 24 * 60 * 60 * 1000,
  tenantTripThreshold: 3,
  checkIntervalMs: 60 * 1000,
};

export type CircuitBreakerChannel = 'email' | 'linkedin' | 'voice';
export type CircuitBreakerTrigger = 'bounce_rate' | 'spam_complaint' | 'li_restriction' | 'manual';
export type CircuitBreakerAction = 'pause_domain' | 'pause_channel' | 'pause_tenant' | 'resume';

export interface CircuitBreakerState {
  domainId: string;
  channel: CircuitBreakerChannel;
  isTripped: boolean;
  trigger?: CircuitBreakerTrigger;
  trippedAt?: Date;
  resumeAt?: Date;
  actualValue?: number;
  threshold?: number;
}

export interface CircuitBreakerEvent {
  id: string;
  tenantId: string;
  domainId?: string;
  channel: CircuitBreakerChannel;
  trigger: CircuitBreakerTrigger;
  threshold: number;
  actualValue: number;
  action: CircuitBreakerAction;
  resumeAt?: Date;
  resolvedAt?: Date;
  createdAt: Date;
}

export interface TenantCircuitState {
  tenantId: string;
  isPaused: boolean;
  pausedAt?: Date;
  resumeAt?: Date;
  tripsInLast24h: number;
  events: CircuitBreakerEvent[];
}

// In-memory circuit breaker state (production would use Redis)
const domainStates = new Map<string, CircuitBreakerState>();
const tenantStates = new Map<string, TenantCircuitState>();
const eventLog: CircuitBreakerEvent[] = [];

export class CircuitBreaker {
  private config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Check if a domain+channel is allowed to send
  isAllowed(domainId: string, channel: CircuitBreakerChannel): {
    allowed: boolean;
    reason?: string;
    resumeAt?: Date;
  } {
    // Check domain-level circuit breaker
    const domainKey = `${domainId}:${channel}`;
    const domainState = domainStates.get(domainKey);

    if (domainState?.isTripped) {
      // Check if pause has expired
      if (domainState.resumeAt && new Date() >= domainState.resumeAt) {
        this.resumeDomain(domainId, channel);
        return { allowed: true };
      }

      return {
        allowed: false,
        reason: `Circuit breaker tripped: ${domainState.trigger} (${domainState.actualValue?.toFixed(2)}% > ${domainState.threshold}%)`,
        resumeAt: domainState.resumeAt,
      };
    }

    // Check tenant-level circuit breaker
    const tenantId = this.getTenantForDomain(domainId);
    if (tenantId) {
      const tenantState = tenantStates.get(tenantId);
      if (tenantState?.isPaused) {
        if (tenantState.resumeAt && new Date() >= tenantState.resumeAt) {
          this.resumeTenant(tenantId);
          return { allowed: true };
        }

        return {
          allowed: false,
          reason: 'Tenant paused: too many circuit breaker trips in 24h',
          resumeAt: tenantState.resumeAt,
        };
      }
    }

    return { allowed: true };
  }

  // Evaluate metrics and potentially trip the breaker
  evaluate(
    tenantId: string,
    domainId: string,
    channel: CircuitBreakerChannel,
    metrics: {
      bounceRate?: number;
      spamComplaintRate?: number;
      isRestricted?: boolean;
    }
  ): CircuitBreakerEvent | null {
    // Check bounce rate
    if (metrics.bounceRate !== undefined && metrics.bounceRate > this.config.bounceRateThreshold) {
      return this.tripBreaker(tenantId, domainId, channel, {
        trigger: 'bounce_rate',
        threshold: this.config.bounceRateThreshold,
        actualValue: metrics.bounceRate,
        action: 'pause_domain',
        durationMs: this.config.bouncePauseDurationMs,
      });
    }

    // Check spam complaint rate
    if (metrics.spamComplaintRate !== undefined && metrics.spamComplaintRate > this.config.spamComplaintThreshold) {
      return this.tripBreaker(tenantId, domainId, channel, {
        trigger: 'spam_complaint',
        threshold: this.config.spamComplaintThreshold,
        actualValue: metrics.spamComplaintRate,
        action: 'pause_domain',
        durationMs: this.config.spamPauseDurationMs,
      });
    }

    // Check LinkedIn restriction
    if (metrics.isRestricted) {
      return this.tripBreaker(tenantId, domainId, channel, {
        trigger: 'li_restriction',
        threshold: 0,
        actualValue: 1,
        action: 'pause_channel',
        durationMs: this.config.spamPauseDurationMs, // 24h for LI restriction
      });
    }

    return null;
  }

  // Trip a circuit breaker
  private tripBreaker(
    tenantId: string,
    domainId: string,
    channel: CircuitBreakerChannel,
    params: {
      trigger: CircuitBreakerTrigger;
      threshold: number;
      actualValue: number;
      action: CircuitBreakerAction;
      durationMs: number;
    }
  ): CircuitBreakerEvent {
    const now = new Date();
    const resumeAt = new Date(now.getTime() + params.durationMs);
    const domainKey = `${domainId}:${channel}`;

    // Update domain state
    domainStates.set(domainKey, {
      domainId,
      channel,
      isTripped: true,
      trigger: params.trigger,
      trippedAt: now,
      resumeAt,
      actualValue: params.actualValue,
      threshold: params.threshold,
    });

    // Create event
    const event: CircuitBreakerEvent = {
      id: `cbe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      tenantId,
      domainId,
      channel,
      trigger: params.trigger,
      threshold: params.threshold,
      actualValue: params.actualValue,
      action: params.action,
      resumeAt,
      createdAt: now,
    };

    eventLog.push(event);

    // Check tenant-level escalation
    this.checkTenantEscalation(tenantId);

    console.log(`[CircuitBreaker] TRIPPED: ${domainId}/${channel} — ${params.trigger}=${params.action} until ${resumeAt.toISOString()}`);

    return event;
  }

  // Check if tenant should be paused (3+ trips in 24h)
  private checkTenantEscalation(tenantId: string): void {
    const now = new Date();
    const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentTrips = eventLog.filter(
      e => e.tenantId === tenantId &&
        e.createdAt >= windowStart &&
        e.action !== 'resume'
    );

    const uniqueDomains = new Set(recentTrips.map(e => e.domainId));

    if (uniqueDomains.size >= this.config.tenantTripThreshold) {
      const tenantState = tenantStates.get(tenantId) || {
        tenantId,
        isPaused: false,
        tripsInLast24h: 0,
        events: [],
      };

      if (!tenantState.isPaused) {
        tenantState.isPaused = true;
        tenantState.pausedAt = now;
        tenantState.resumeAt = new Date(now.getTime() + this.config.spamPauseDurationMs);
        tenantStates.set(tenantId, tenantState);

        // Log tenant-level event
        const tenantEvent: CircuitBreakerEvent = {
          id: `cbe_tenant_${Date.now()}`,
          tenantId,
          channel: 'email', // All channels
          trigger: 'bounce_rate', // Aggregate trigger
          threshold: this.config.tenantTripThreshold,
          actualValue: uniqueDomains.size,
          action: 'pause_tenant',
          resumeAt: tenantState.resumeAt,
          createdAt: now,
        };
        eventLog.push(tenantEvent);

        console.log(`[CircuitBreaker] TENANT PAUSED: ${tenantId} — ${uniqueDomains.size} domains tripped in 24h`);
      }
    }
  }

  // Resume a domain circuit breaker
  resumeDomain(domainId: string, channel: CircuitBreakerChannel): void {
    const domainKey = `${domainId}:${channel}`;
    const state = domainStates.get(domainKey);

    if (state?.isTripped) {
      state.isTripped = false;
      state.resumeAt = undefined;
      domainStates.set(domainKey, state);

      console.log(`[CircuitBreaker] RESUMED: ${domainId}/${channel}`);
    }
  }

  // Resume a tenant
  resumeTenant(tenantId: string): void {
    const state = tenantStates.get(tenantId);
    if (state?.isPaused) {
      state.isPaused = false;
      state.pausedAt = undefined;
      state.resumeAt = undefined;
      tenantStates.set(tenantId, state);

      console.log(`[CircuitBreaker] TENANT RESUMED: ${tenantId}`);
    }
  }

  // Manual pause (operator action)
  manualPause(
    tenantId: string,
    domainId: string,
    channel: CircuitBreakerChannel,
    durationMs: number
  ): CircuitBreakerEvent {
    return this.tripBreaker(tenantId, domainId, channel, {
      trigger: 'manual',
      threshold: 0,
      actualValue: 0,
      action: 'pause_domain',
      durationMs,
    });
  }

  // Manual resume (operator action)
  manualResume(tenantId: string, domainId: string, channel: CircuitBreakerChannel): void {
    this.resumeDomain(domainId, channel);

    const event: CircuitBreakerEvent = {
      id: `cbe_manual_${Date.now()}`,
      tenantId,
      domainId,
      channel,
      trigger: 'manual',
      threshold: 0,
      actualValue: 0,
      action: 'resume',
      createdAt: new Date(),
    };
    eventLog.push(event);
  }

  // Get all tripped breakers for a tenant
  getTrippedBreakers(tenantId: string): CircuitBreakerState[] {
    const tripped: CircuitBreakerState[] = [];
    for (const [key, state] of domainStates.entries()) {
      if (key.startsWith(tenantId) && state.isTripped) {
        tripped.push(state);
      }
    }
    return tripped;
  }

  // Get tenant circuit state
  getTenantState(tenantId: string): TenantCircuitState | undefined {
    return tenantStates.get(tenantId);
  }

  // Get recent events for a tenant
  getEvents(tenantId: string, limit: number = 50): CircuitBreakerEvent[] {
    return eventLog
      .filter(e => e.tenantId === tenantId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Helper: get tenant for domain (in production, would query DB)
  private getTenantForDomain(domainId: string): string | undefined {
    // Extract tenant from domainId pattern or look up in state
    // For in-memory, we check event log
    const event = eventLog.find(e => e.domainId === domainId);
    return event?.tenantId;
  }
}

export const circuitBreaker = new CircuitBreaker();
