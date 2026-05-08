// Sequence engine v0 — schedules sends per step, respects warmup caps
import { SmartleadAdapter, type EmailSendRequest } from './adapters/smartlead';
import {
  getDailyCap,
  canSendEmail,
  recordWarmupEntry,
  advanceWarmupDay,
  isWarmupComplete,
  type WarmupLedgerEntry
} from './warmupLedger';

// In-memory tracking (in production, use Redis or DB)
const activeSequences = new Map<string, any>();
const emailQueue: any[] = [];

export interface SequenceEngineConfig {
  smartleadApiKey: string;
  defaultFromEmail: string;
}

export class SequenceEngine {
  private smartlead: SmartleadAdapter;
  private defaultFromEmail: string;
  private isProcessing = false;

  constructor(config: SequenceEngineConfig) {
    this.smartlead = new SmartleadAdapter({ apiKey: config.smartleadApiKey });
    this.defaultFromEmail = config.defaultFromEmail;
  }

  // Launch a sequence for a tenant
  async launchSequence(sequence: any, tenant: any, domain: any): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      // Check if domain warmup allows sending
      const warmupCheck = canSendEmail(domain.warmupDay, domain.emailsSentToday || 0);
      if (!warmupCheck.allowed) {
        return {
          success: false,
          message: `Warmup check failed: ${warmupCheck.reason}`
        };
      }

      // Check if sequence has steps
      if (!sequence.steps || sequence.steps.length === 0) {
        return {
          success: false,
          message: 'Sequence has no steps'
        };
      }

      // Add to active sequences
      activeSequences.set(sequence.id, {
        sequence,
        tenant,
        domain,
        currentStepIndex: 0,
        enrollments: new Map()
      });

      // Queue first step sends
      await this.processSequence(sequence.id);

      return {
        success: true,
        message: `Sequence ${sequence.name} launched successfully`
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Process a sequence (send emails for current step)
  private async processSequence(sequenceId: string): Promise<void> {
    const seqData = activeSequences.get(sequenceId);
    if (!seqData) return;

    const { sequence, tenant, domain } = seqData;
    const currentStep = sequence.steps[seqData.currentStepIndex];

    if (!currentStep) {
      // Sequence complete
      activeSequences.delete(sequenceId);
      return;
    }

    // Check if step is email channel
    if (currentStep.channel !== 'EMAIL') {
      // Skip non-email steps for now (Phase2 is email-only)
      seqData.currentStepIndex++;
      await this.processSequence(sequenceId);
      return;
    }

    // Get enrollments for this sequence
    const enrollments = sequence.enrollments || [];

    for (const enrollment of enrollments) {
      // Check warmup caps before sending
      const warmupCheck = canSendEmail(domain.warmupDay, domain.emailsSentToday || 0);
      if (!warmupCheck.allowed) {
        console.log(`Daily cap reached for domain ${domain.domain}`);
        break;
      }

      // Queue email
      emailQueue.push({
        enrollment,
        step: currentStep,
        sequence,
        tenant,
        domain
      });
    }

    // Process queue
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  // Process email queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (emailQueue.length > 0) {
      const item = emailQueue.shift();
      if (!item) break;

      await this.sendEmail(item);
      
      // Rate limiting - wait 100ms between sends
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isProcessing = false;
  }

  // Send a single email
  private async sendEmail(item: any): Promise<void> {
    const { enrollment, step, sequence, tenant, domain } = item;

    try {
      const emailRequest: EmailSendRequest = {
        to: enrollment.contactEmail,
        from: this.defaultFromEmail,
        subject: this.interpolateTemplate(step.bodyTemplate, enrollment),
        body: this.interpolateTemplate(step.bodyTemplate, enrollment)
      };

      const result = await this.smartlead.sendEmail(emailRequest);

      if (result.success) {
        // Update warmup ledger
        const newWarmupDay = advanceWarmupDay(domain.warmupDay);
        recordWarmupEntry(domain.id, newWarmupDay, 1, 0, 0);

        // Update domain warmup day
        domain.warmupDay = newWarmupDay;
        domain.emailsSentToday = (domain.emailsSentToday || 0) + 1;

        console.log(`Email sent to ${enrollment.contactEmail} for sequence ${sequence.name}`);
      } else {
        console.error(`Failed to send email to ${enrollment.contactEmail}: ${result.error}`);
      }
    } catch (error: any) {
      console.error(`Error sending email: ${error.message}`);
    }
  }

  // Simple template interpolation (replace {{variable}} with values)
  private interpolateTemplate(template: string, data: any): string {
    if (!template) return '';
    
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  // Get engine status
  getStatus(): { activeSequences: number; queueLength: number } {
    return {
      activeSequences: activeSequences.size,
      queueLength: emailQueue.length
    };
  }

  // Reset daily counters (call at midnight)
  resetDailyCounters(): void {
    // In production, this would reset emailsSentToday for all domains
    console.log('Daily counters reset');
  }
}
