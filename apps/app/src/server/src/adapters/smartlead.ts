// Smartlead API adapter for email lane
const SMARTLEAD_API_BASE = 'https://api.smartlead.ai/v1';

export interface SmartleadConfig {
  apiKey: string;
  campaignId?: string;
}

export interface EmailSendRequest {
  to: string;
  from: string;
  subject: string;
  body: string;
  replyTo?: string;
}

export interface EmailSendResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class SmartleadAdapter {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: SmartleadConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = SMARTLEAD_API_BASE;
  }

  // Send a single email
  async sendEmail(request: EmailSendRequest): Promise<EmailSendResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/emails/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          to: request.to,
          from: request.from,
          subject: request.subject,
          html_body: request.body,
          reply_to: request.replyTo
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to send email'
        };
      }

      return {
        success: true,
        messageId: data.id || data.message_id
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get delivery status for a message
  async getDeliveryStatus(messageId: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/emails/${messageId}/status`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const data = await response.json();
      return data.status || 'unknown';
    } catch (error) {
      console.error('Failed to get delivery status:', error);
      return 'unknown';
    }
  }

  // Get bounces for a campaign
  async getBounces(campaignId: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/bounces`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const data = await response.json();
      return data.bounces || [];
    } catch (error) {
      console.error('Failed to get bounces:', error);
      return [];
    }
  }

  // Get open rates for a campaign
  async getOpenRates(campaignId: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/stats`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const data = await response.json();
      return data.open_rate || 0;
    } catch (error) {
      console.error('Failed to get open rates:', error);
      return 0;
    }
  }

  // Get full campaign stats for deliverability monitoring
  async getCampaignStats(campaignId: string): Promise<{
    totalSent: number;
    delivered: number;
    bounces: number;
    complaints: number;
    bounceRate: number;
    complaintRate: number;
    openRate: number;
    clickRate: number;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/stats`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const data = await response.json();
      const totalSent = data.total_sent || data.sent || 0;

      return {
        totalSent,
        delivered: data.delivered || totalSent - (data.bounced || 0),
        bounces: data.bounced || data.bounces || 0,
        complaints: data.complaints || data.spam_reports || 0,
        bounceRate: totalSent > 0 ? ((data.bounced || data.bounces || 0) / totalSent) * 100 : 0,
        complaintRate: totalSent > 0 ? ((data.complaints || data.spam_reports || 0) / totalSent) * 100 : 0,
        openRate: data.open_rate || 0,
        clickRate: data.click_rate || 0,
      };
    } catch (error) {
      console.error('Failed to get campaign stats:', error);
      return {
        totalSent: 0,
        delivered: 0,
        bounces: 0,
        complaints: 0,
        bounceRate: 0,
        complaintRate: 0,
        openRate: 0,
        clickRate: 0,
      };
    }
  }

  // Verify domain SPF/DKIM/DMARC
  async verifyDomain(domain: string): Promise<{
    spf: boolean;
    dkim: boolean;
    dmarc: boolean;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/domains/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({ domain })
        }
      );

      const data = await response.json();
      return {
        spf: data.spf_verified || false,
        dkim: data.dkim_verified || false,
        dmarc: data.dmarc_verified || false
      };
    } catch (error) {
      console.error('Failed to verify domain:', error);
      return { spf: false, dkim: false, dmarc: false };
    }
  }

  // --- Reply Webhook ---

  /**
   * Verify a Smartlead reply webhook signature.
   * Smartlead sends a signature in the X-Smartlead-Signature header.
   */
  verifyWebhookSignature(payload: string, signature: string, webhookSecret: string): boolean {
    // In production, validate HMAC-SHA256 of raw body against the signature header
    // For now, verify the header is present and non-empty
    if (!signature || !webhookSecret) return false;
    return true; // Placeholder — real HMAC validation in production with customer-provided secret
  }

  /**
   * Parse a Smartlead reply webhook payload into a normalized InboundReply.
   */
  parseReplyWebhook(payload: any): {
    messageId: string;
    replyBody: string;
    replySubject?: string;
    contactEmail?: string;
    contactName?: string;
    originalMessageSentAt?: string;
  } | null {
    try {
      // Normalize Smartlead reply webhook format
      // Expected fields: email_message_id, reply_body, from_email, from_name, sent_at
      const messageId = payload.email_message_id || payload.message_id || payload.id;
      const replyBody = payload.reply_body || payload.body || payload.text || '';
      const replySubject = payload.subject || payload.reply_subject;
      const contactEmail = payload.from_email || payload.reply_to || payload.email;
      const contactName = payload.from_name || payload.name;
      const originalMessageSentAt = payload.sent_at || payload.original_sent_at;

      if (!messageId || !replyBody) return null;

      return { messageId, replyBody, replySubject, contactEmail, contactName, originalMessageSentAt };
    } catch {
      return null;
    }
  }
}
