// Slack notification adapter — pings on HOT replies
export interface SlackConfig {
  webhookUrl: string;
  channel?: string;
}

export interface SlackPingRequest {
  text: string;
  blocks?: any[];
  threadTs?: string;
}

export interface SlackPingResponse {
  success: boolean;
  error?: string;
}

export class SlackAdapter {
  private webhookUrl: string;
  private channel?: string;

  constructor(config: SlackConfig) {
    this.webhookUrl = config.webhookUrl;
    this.channel = config.channel;
  }

  async sendPing(request: SlackPingRequest): Promise<SlackPingResponse> {
    try {
      const payload: any = {
        text: request.text,
      };

      if (this.channel) {
        payload.channel = this.channel;
      }

      if (request.blocks) {
        payload.blocks = request.blocks;
      }

      if (request.threadTs) {
        payload.thread_ts = request.threadTs;
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return { success: false, error: `Slack responded ${response.status}: ${await response.text()}` };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Send a formatted HOT reply notification
  async notifyHotReply(opts: {
    contactEmail: string;
    contactName?: string;
    replyBody: string;
    bucket: string;
    sequenceName?: string;
    tenantName?: string;
  }): Promise<SlackPingResponse> {
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🔥 HOT REPLY: ${opts.contactName || opts.contactEmail}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Contact:*\n${opts.contactEmail}` },
          { type: 'mrkdwn', text: `*Bucket:*\n${opts.bucket}` },
          { type: 'mrkdwn', text: `*Sequence:*\n${opts.sequenceName || 'N/A'}` },
          { type: 'mrkdwn', text: `*Tenant:*\n${opts.tenantName || 'N/A'}` },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `> ${opts.replyBody.slice(0, 500)}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Saltrun reply triage · ${new Date().toISOString()}`,
          },
        ],
      },
    ];

    return this.sendPing({
      text: `🔥 HOT REPLY from ${opts.contactEmail}`,
      blocks,
    });
  }
}
