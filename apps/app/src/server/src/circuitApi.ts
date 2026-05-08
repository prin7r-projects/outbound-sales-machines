// API handler for POST /api/internal/circuit/email/:domain
// Pauses or resumes email sending for a domain via circuit breaker
import { circuitBreaker, type CircuitBreakerChannel } from './circuitBreaker';
import { deliverabilityWatcher } from './deliverabilityWatcher';

// System auth key for internal endpoints
const SYSTEM_API_KEY = process.env.SYSTEM_API_KEY || 'saltrun-internal';

export const circuitAction = async (req: any, res: any, context: any) => {
  // Verify system auth
  const authHeader = req.headers?.authorization || '';
  if (authHeader !== `Bearer ${SYSTEM_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { domain } = req.params;
    const { action, tenantId, channel = 'email' } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain parameter is required' });
    }

    if (!action || !['pause', 'resume'].includes(action)) {
      return res.status(400).json({ error: 'Action must be "pause" or "resume"' });
    }

    const validChannels: CircuitBreakerChannel[] = ['email', 'linkedin', 'voice'];
    if (!validChannels.includes(channel)) {
      return res.status(400).json({ error: `Channel must be one of: ${validChannels.join(', ')}` });
    }

    // Look up domain registration from deliverability watcher
    const allDomains = deliverabilityWatcher.getAllDomains();
    const registration = allDomains.find(d => d.domain === domain);

    if (!registration && !tenantId) {
      return res.status(404).json({ error: `Domain "${domain}" not found. Provide tenantId for manual action.` });
    }

    const resolvedTenantId = registration?.tenantId || tenantId;
    const resolvedDomainId = registration?.domainId || domain;

    if (action === 'pause') {
      const durationMs = req.body.durationMs || 6 * 60 * 60 * 1000; // Default 6 hours
      const event = circuitBreaker.manualPause(resolvedTenantId, resolvedDomainId, channel, durationMs);

      console.log(`[CircuitAPI] Manual pause: ${domain}/${channel} for ${durationMs / 1000}s`);

      return res.status(200).json({
        ok: true,
        action: 'paused',
        domain,
        channel,
        eventId: event.id,
        resumeAt: event.resumeAt?.toISOString(),
      });
    } else {
      circuitBreaker.manualResume(resolvedTenantId, resolvedDomainId, channel);

      console.log(`[CircuitAPI] Manual resume: ${domain}/${channel}`);

      return res.status(200).json({
        ok: true,
        action: 'resumed',
        domain,
        channel,
      });
    }
  } catch (error: any) {
    console.error('[CircuitAPI] Unhandled error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

// GET handler to check circuit breaker status for a domain
export const circuitStatus = async (req: any, res: any, context: any) => {
  // Verify system auth
  const authHeader = req.headers?.authorization || '';
  if (authHeader !== `Bearer ${SYSTEM_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { domain } = req.params;
    const { tenantId, channel = 'email' } = req.query;

    if (!domain) {
      return res.status(400).json({ error: 'Domain parameter is required' });
    }

    // Look up domain
    const allDomains = deliverabilityWatcher.getAllDomains();
    const registration = allDomains.find(d => d.domain === domain);

    const resolvedTenantId = registration?.tenantId || tenantId;
    const resolvedDomainId = registration?.domainId || domain;

    if (!resolvedTenantId) {
      return res.status(404).json({ error: 'Domain not found and no tenantId provided' });
    }

    // Check if allowed
    const check = circuitBreaker.isAllowed(resolvedDomainId, channel);
    const tenantState = circuitBreaker.getTenantState(resolvedTenantId);
    const events = circuitBreaker.getEvents(resolvedTenantId, 10);

    return res.status(200).json({
      domain,
      channel,
      allowed: check.allowed,
      reason: check.reason,
      resumeAt: check.resumeAt?.toISOString(),
      tenantPaused: tenantState?.isPaused || false,
      tenantResumeAt: tenantState?.resumeAt?.toISOString(),
      recentEvents: events.map(e => ({
        id: e.id,
        trigger: e.trigger,
        action: e.action,
        actualValue: e.actualValue,
        threshold: e.threshold,
        createdAt: e.createdAt.toISOString(),
        resumeAt: e.resumeAt?.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('[CircuitAPI] Status check error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
