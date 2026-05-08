// Reply triage orchestrator — inbound webhook → classify → CRM → Slack → DB
import { ReplyClassifier, type ClassifierConfig, type ClassifierInput } from './classifier';
import { CRMAdapter, type CRMConfig, type CRMUpsertRequest } from './adapters/crm';
import { SlackAdapter, type SlackConfig } from './adapters/slack';

export interface TriageConfig {
  classifier: ClassifierConfig;
  crm: CRMConfig;
  slack: SlackConfig;
}

export interface InboundReply {
  channel: 'EMAIL' | 'LINKEDIN';
  messageId: string; // Smartlead or HeyReach message ID
  replyBody: string;
  replySubject?: string;
  contactEmail?: string;
  contactName?: string;
  companyName?: string;
  enrollmentId?: string;
  tenantId?: string;
  tenantName?: string;
  sequenceName?: string;
  originalMessageSentAt?: string;
  rawPayload?: any; // Original webhook payload for audit
}

export interface TriageResult {
  success: boolean;
  replyId?: string;
  bucket?: string;
  meetingRequested?: boolean;
  crmUpdated?: boolean;
  slackSent?: boolean;
  modelUsed?: string;
  error?: string;
  elapsedMs?: number;
}

export class ReplyTriage {
  private classifier: ReplyClassifier;
  private crm: CRMAdapter;
  private slack: SlackAdapter;
  private config: TriageConfig;

  constructor(config: TriageConfig) {
    this.config = config;
    this.classifier = new ReplyClassifier(config.classifier);
    this.crm = new CRMAdapter(config.crm);
    this.slack = new SlackAdapter(config.slack);
  }

  async triage(reply: InboundReply, dbEntities?: any): Promise<TriageResult> {
    const start = Date.now();
    const result: TriageResult = { success: false };

    try {
      // Step 1: Classify
      const classifierInput: ClassifierInput = {
        replyBody: reply.replyBody,
        replySubject: reply.replySubject,
        originalMessageSentAt: reply.originalMessageSentAt,
        contactEmail: reply.contactEmail,
        contactName: reply.contactName,
        companyName: reply.companyName,
      };

      const classification = await this.classifier.classify(classifierInput);
      result.bucket = classification.bucket;
      result.meetingRequested = classification.meetingRequested;
      result.modelUsed = classification.modelUsed;

      // Step 2: Persist reply to DB
      if (dbEntities) {
        try {
          // Find the message by external message ID
          const message = await dbEntities.Message.findFirst({
            where: { id: reply.messageId },
          });

          if (message) {
            const dbReply = await dbEntities.Reply.create({
              data: {
                body: reply.replyBody,
                bucket: classification.bucket,
                messageId: message.id,
              },
            });
            result.replyId = dbReply.id;

            // Update enrollment status
            await dbEntities.Enrollment.update({
              where: { id: message.enrollmentId },
              data: { status: 'REPLIED' },
            });
          }
        } catch (dbError: any) {
          console.error('Reply DB persistence failed:', dbError.message);
          // Non-fatal — continue with CRM/Slack
        }
      }

      // Step 3: CRM upsert
      if (reply.contactEmail && this.config.crm.type !== 'NONE') {
        try {
          const crmRequest: CRMUpsertRequest = {
            contactEmail: reply.contactEmail,
            contactName: reply.contactName,
            companyName: reply.companyName,
            meetingRequested: classification.meetingRequested,
            bucket: classification.bucket,
            lastReplyAt: new Date().toISOString(),
            replyBody: reply.replyBody,
            sequenceName: reply.sequenceName,
          };

          const crmResult = await this.crm.upsertContact(crmRequest);
          result.crmUpdated = crmResult.success;
        } catch (crmError: any) {
          console.error('CRM upsert failed:', crmError.message);
          result.crmUpdated = false;
        }
      }

      // Step 4: Slack ping on HOT
      if (classification.bucket === 'HOT') {
        try {
          const slackResult = await this.slack.notifyHotReply({
            contactEmail: reply.contactEmail || 'unknown',
            contactName: reply.contactName,
            replyBody: reply.replyBody,
            bucket: classification.bucket,
            sequenceName: reply.sequenceName,
            tenantName: reply.tenantName,
          });
          result.slackSent = slackResult.success;
        } catch (slackError: any) {
          console.error('Slack notification failed:', slackError.message);
          result.slackSent = false;
        }
      }

      result.success = true;
    } catch (error: any) {
      result.error = error.message;
    }

    result.elapsedMs = Date.now() - start;
    return result;
  }
}

// Singleton instance (initialized lazily)
let triageInstance: ReplyTriage | null = null;

export function getTriage(): ReplyTriage {
  if (!triageInstance) {
    triageInstance = new ReplyTriage({
      classifier: {
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        zaiApiKey: process.env.ZAI_API_KEY,
        timeoutMs: 3000,
      },
      crm: {
        type: (process.env.CRM_TYPE as 'SALESFORCE' | 'HUBSPOT' | 'NONE') || 'NONE',
        salesforceInstanceUrl: process.env.SALESFORCE_INSTANCE_URL,
        salesforceAccessToken: process.env.SALESFORCE_ACCESS_TOKEN,
        hubspotAccessToken: process.env.HUBSPOT_ACCESS_TOKEN,
      },
      slack: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
      },
    });
  }
  return triageInstance;
}
