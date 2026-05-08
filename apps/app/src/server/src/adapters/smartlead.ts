// Smartlead API adapter for email lane
const SMARTLEAD_API_BASE = 'https://api.smartlead.api/v1';

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
}
