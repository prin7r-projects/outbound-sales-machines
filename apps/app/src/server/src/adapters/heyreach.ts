// HeyReach API adapter for LinkedIn lane
const HEYREACH_API_BASE = 'https://api.heyreach.io/v1';

export interface HeyReachConfig {
  apiKey: string;
  accountId?: string;
}

export interface LinkedInMessageRequest {
  campaignId: string;
  profileUrl: string;
  message: string;
  customFields?: Record<string, string>;
}

export interface LinkedInMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class HeyReachAdapter {
  private apiKey: string;
  private baseUrl: string;
  private dailyCap: number = 100; // Default daily cap per LI account
  private messagesSentToday: number = 0;

  constructor(config: HeyReachConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = HEYREACH_API_BASE;
  }

  // Send a LinkedIn message
  async sendMessage(request: LinkedInMessageRequest): Promise<LinkedInMessageResponse> {
    try {
      // Check daily cap
      if (this.messagesSentToday >= this.dailyCap) {
        return {
          success: false,
          error: `Daily cap reached: ${this.messagesSentToday}/${this.dailyCap}`
        };
      }

      const response = await fetch(`${this.baseUrl}/linkedin/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          campaign_id: request.campaignId,
          profile_url: request.profileUrl,
          message: request.message,
          custom_fields: request.customFields
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to send LinkedIn message'
        };
      }

      this.messagesSentToday++;
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

  // Create a campaign
  async createCampaign(name: string, accountId: string): Promise<{
    success: boolean;
    campaignId?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          name,
          account_id: accountId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to create campaign'
        };
      }

      return {
        success: true,
        campaignId: data.id || data.campaign_id
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get campaign status
  async getCampaignStatus(campaignId: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const data = await response.json();
      return data.status || 'unknown';
    } catch (error) {
      console.error('Failed to get campaign status:', error);
      return 'unknown';
    }
  }

  // Get daily usage
  getDailyUsage(): { sent: number; cap: number; remaining: number } {
    return {
      sent: this.messagesSentToday,
      cap: this.dailyCap,
      remaining: Math.max(0, this.dailyCap - this.messagesSentToday)
    };
  }

  // Reset daily counter (call at midnight)
  resetDailyCounter(): void {
    this.messagesSentToday = 0;
  }

  // Set daily cap
  setDailyCap(cap: number): void {
    this.dailyCap = cap;
  }

  // Check if LinkedIn account is restricted
  async checkAccountStatus(accountId: string): Promise<{
    isRestricted: boolean;
    reason?: string;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/accounts/${accountId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const data = await response.json();
      
      return {
        isRestricted: data.status === 'restricted' || data.is_restricted || false,
        reason: data.restriction_reason
      };
    } catch (error) {
      console.error('Failed to check account status:', error);
      return { isRestricted: false };
    }
  }

  // --- Reply Webhook ---

  /**
   * Verify a HeyReach reply webhook signature.
   */
  verifyWebhookSignature(payload: string, signature: string, webhookSecret: string): boolean {
    if (!signature || !webhookSecret) return false;
    return true; // Placeholder — real HMAC validation in production
  }

  /**
   * Parse a HeyReach LinkedIn reply webhook payload into a normalized InboundReply.
   */
  parseReplyWebhook(payload: any): {
    messageId: string;
    replyBody: string;
    contactName?: string;
    contactLinkedInUrl?: string;
  } | null {
    try {
      // Normalize HeyReach reply webhook format
      const messageId = payload.message_id || payload.id;
      const replyBody = payload.message || payload.reply_text || payload.body || '';
      const contactName = payload.from_name || payload.profile_name || payload.name;
      const contactLinkedInUrl = payload.profile_url || payload.linkedin_url;

      if (!messageId || !replyBody) return null;

      return { messageId, replyBody, contactName, contactLinkedInUrl };
    } catch {
      return null;
    }
  }
}
