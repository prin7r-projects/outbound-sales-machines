// Deliverability watcher — monitors bounce/complaint rates per domain
// Polls Smartlead/Instantly APIs, evaluates thresholds, triggers circuit breaker

import { SmartleadAdapter } from './adapters/smartlead';
import { HeyReachAdapter } from './adapters/heyreach';
import { circuitBreaker, type CircuitBreakerChannel } from './circuitBreaker';

export interface DomainMetrics {
  domainId: string;
  tenantId: string;
  domain: string;
  channel: CircuitBreakerChannel;
  emailsSent: number;
  bounces: number;
  complaints: number;
  bounceRate: number;
  spamComplaintRate: number;
  openRate: number;
  lastChecked: Date;
}

export interface WatcherConfig {
  checkIntervalMs: number;       // 60s default
  smartleadApiKey?: string;
  heyreachApiKey?: string;
  slackWebhookUrl?: string;
}

const DEFAULT_WATCHER_CONFIG: WatcherConfig = {
  checkIntervalMs: 60 * 1000,
};

// In-memory domain registry (production would be DB-backed)
interface DomainRegistration {
  domainId: string;
  tenantId: string;
  domain: string;
  campaignId?: string;
  liAccountId?: string;
  lastMetrics?: DomainMetrics;
}

const registeredDomains = new Map<string, DomainRegistration>();
const metricsHistory = new Map<string, DomainMetrics[]>();

export class DeliverabilityWatcher {
  private config: WatcherConfig;
  private smartlead: SmartleadAdapter | null = null;
  private heyreach: HeyReachAdapter | null = null;
  private intervalHandle: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;

  constructor(config: Partial<WatcherConfig> = {}) {
    this.config = { ...DEFAULT_WATCHER_CONFIG, ...config };

    if (config.smartleadApiKey) {
      this.smartlead = new SmartleadAdapter({ apiKey: config.smartleadApiKey });
    }
    if (config.heyreachApiKey) {
      this.heyreach = new HeyReachAdapter({ apiKey: config.heyreachApiKey });
    }
  }

  // Register a domain for monitoring
  registerDomain(registration: DomainRegistration): void {
    const key = `${registration.tenantId}:${registration.domainId}`;
    registeredDomains.set(key, registration);
    console.log(`[DeliverabilityWatcher] Registered domain: ${registration.domain} (${registration.tenantId})`);
  }

  // Unregister a domain
  unregisterDomain(tenantId: string, domainId: string): void {
    const key = `${tenantId}:${domainId}`;
    registeredDomains.delete(key);
    metricsHistory.delete(key);
  }

  // Start the watcher
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalHandle = setInterval(() => this.checkAllDomains(), this.config.checkIntervalMs);
    console.log(`[DeliverabilityWatcher] Started — checking every ${this.config.checkIntervalMs / 1000}s`);
  }

  // Stop the watcher
  stop(): void {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
    this.isRunning = false;
    console.log('[DeliverabilityWatcher] Stopped');
  }

  // Check all registered domains
  async checkAllDomains(): Promise<void> {
    const domains = Array.from(registeredDomains.values());
    console.log(`[DeliverabilityWatcher] Checking ${domains.length} domains...`);

    for (const domain of domains) {
      try {
        await this.checkDomain(domain);
      } catch (error: any) {
        console.error(`[DeliverabilityWatcher] Error checking ${domain.domain}: ${error.message}`);
      }
    }
  }

  // Check a single domain
  async checkDomain(registration: DomainRegistration): Promise<DomainMetrics | null> {
    const metrics = await this.fetchMetrics(registration);
    if (!metrics) return null;

    // Store metrics
    const key = `${registration.tenantId}:${registration.domainId}`;
    registration.lastMetrics = metrics;
    registeredDomains.set(key, registration);

    // Append to history (keep last 24h)
    const history = metricsHistory.get(key) || [];
    history.push(metrics);
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const filtered = history.filter(m => m.lastChecked >= cutoff);
    metricsHistory.set(key, filtered);

    // Evaluate circuit breaker
    const event = circuitBreaker.evaluate(
      registration.tenantId,
      registration.domainId,
      metrics.channel,
      {
        bounceRate: metrics.bounceRate,
        spamComplaintRate: metrics.spamComplaintRate,
        isRestricted: false, // Will be set by LI check
      }
    );

    if (event) {
      console.log(`[DeliverabilityWatcher] Circuit breaker tripped for ${registration.domain}: ${event.trigger}`);
      await this.alertOps(registration, event);
    }

    return metrics;
  }

  // Fetch metrics from channel APIs
  private async fetchMetrics(registration: DomainRegistration): Promise<DomainMetrics | null> {
    // Email metrics via Smartlead
    if (this.smartlead && registration.campaignId) {
      try {
        const stats = await this.smartlead.getCampaignStats(registration.campaignId);

        return {
          domainId: registration.domainId,
          tenantId: registration.tenantId,
          domain: registration.domain,
          channel: 'email',
          emailsSent: stats.totalSent || 0,
          bounces: stats.bounces || 0,
          complaints: stats.complaints || 0,
          bounceRate: stats.bounceRate || 0,
          spamComplaintRate: stats.complaintRate || 0,
          openRate: stats.openRate || 0,
          lastChecked: new Date(),
        };
      } catch (error: any) {
        console.error(`[DeliverabilityWatcher] Smartlead error for ${registration.domain}: ${error.message}`);
      }
    }

    // LinkedIn metrics via HeyReach
    if (this.heyreach && registration.liAccountId) {
      try {
        const accountStatus = await this.heyreach.checkAccountStatus(registration.liAccountId);

        if (accountStatus.isRestricted) {
          // Trip circuit breaker for LI restriction
          circuitBreaker.evaluate(
            registration.tenantId,
            registration.domainId,
            'linkedin',
            { isRestricted: true }
          );
        }

        const usage = this.heyreach.getDailyUsage();

        return {
          domainId: registration.domainId,
          tenantId: registration.tenantId,
          domain: registration.domain,
          channel: 'linkedin',
          emailsSent: usage.sent,
          bounces: 0,
          complaints: 0,
          bounceRate: 0,
          spamComplaintRate: 0,
          openRate: 0,
          lastChecked: new Date(),
        };
      } catch (error: any) {
        console.error(`[DeliverabilityWatcher] HeyReach error for ${registration.domain}: ${error.message}`);
      }
    }

    return null;
  }

  // Alert ops via Slack webhook
  private async alertOps(
    registration: DomainRegistration,
    event: { trigger: string; actualValue: number; threshold: number; action: string }
  ): Promise<void> {
    if (!this.config.slackWebhookUrl) return;

    const message = {
      text: `🚨 *Circuit Breaker Tripped*\n*Domain:* ${registration.domain}\n*Trigger:* ${event.trigger}\n*Value:* ${event.actualValue.toFixed(2)}% (threshold: ${event.threshold}%)\n*Action:* ${event.action}\n*Tenant:* ${registration.tenantId}`,
    };

    try {
      await fetch(this.config.slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
    } catch (error: any) {
      console.error(`[DeliverabilityWatcher] Failed to send Slack alert: ${error.message}`);
    }
  }

  // Get metrics for a domain
  getDomainMetrics(tenantId: string, domainId: string): DomainMetrics | undefined {
    const key = `${tenantId}:${domainId}`;
    return registeredDomains.get(key)?.lastMetrics;
  }

  // Get metrics history for a domain
  getMetricsHistory(tenantId: string, domainId: string): DomainMetrics[] {
    const key = `${tenantId}:${domainId}`;
    return metricsHistory.get(key) || [];
  }

  // Get all domains with their current metrics
  getAllDomains(): Array<DomainRegistration & { metrics?: DomainMetrics }> {
    return Array.from(registeredDomains.values());
  }

  // Force a check on a specific domain
  async forceCheck(tenantId: string, domainId: string): Promise<DomainMetrics | null> {
    const key = `${tenantId}:${domainId}`;
    const registration = registeredDomains.get(key);
    if (!registration) return null;
    return this.checkDomain(registration);
  }
}

export const deliverabilityWatcher = new DeliverabilityWatcher({
  checkIntervalMs: 60 * 1000,
});
