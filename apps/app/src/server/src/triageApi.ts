// API handler for POST /api/internal/replies/triage
// Receives inbound reply webhooks from Smartlead and HeyReach
import { getTriage, type InboundReply } from './replyTriage';
import { SmartleadAdapter } from './adapters/smartlead';
import { HeyReachAdapter } from './adapters/heyreach';

// System auth key for internal endpoints
const SYSTEM_API_KEY = process.env.SYSTEM_API_KEY || 'saltrun-internal';

export const triageReply = async (req: any, res: any, context: any) => {
  // Verify system auth
  const authHeader = req.headers?.authorization || '';
  if (authHeader !== `Bearer ${SYSTEM_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = req.body;
    const channel: string = (payload.channel || 'EMAIL').toUpperCase();

    if (!['EMAIL', 'LINKEDIN'].includes(channel)) {
      return res.status(400).json({ error: 'Invalid channel. Must be EMAIL or LINKEDIN.' });
    }

    // Parse the raw webhook payload based on channel
    let parsed: {
      messageId: string;
      replyBody: string;
      replySubject?: string;
      contactEmail?: string;
      contactName?: string;
      originalMessageSentAt?: string;
    } | null = null;

    if (channel === 'EMAIL') {
      const smartlead = new SmartleadAdapter({ apiKey: process.env.SMARTLEAD_API_KEY || '' });
      parsed = smartlead.parseReplyWebhook(payload.reply || payload);
    } else {
      const heyreach = new HeyReachAdapter({ apiKey: process.env.HEYREACH_API_KEY || '' });
      parsed = heyreach.parseReplyWebhook(payload.reply || payload);
    }

    if (!parsed) {
      return res.status(400).json({ error: 'Invalid or unparseable reply payload' });
    }

    // Build the InboundReply for the triage orchestrator
    const inboundReply: InboundReply = {
      channel: channel as 'EMAIL' | 'LINKEDIN',
      messageId: payload.messageId || parsed.messageId,
      replyBody: parsed.replyBody,
      replySubject: parsed.replySubject,
      contactEmail: parsed.contactEmail || payload.contactEmail,
      contactName: parsed.contactName || payload.contactName,
      companyName: payload.companyName,
      tenantId: payload.tenantId,
      tenantName: payload.tenantName,
      sequenceName: payload.sequenceName,
      enrollmentId: payload.enrollmentId,
      originalMessageSentAt: parsed.originalMessageSentAt || payload.originalMessageSentAt,
      rawPayload: payload,
    };

    // Run triage pipeline
    const triage = getTriage();
    const result = await triage.triage(inboundReply, context.entities);

    // Log the triage result
    console.log('[ReplyTriage]', JSON.stringify({
      channel: inboundReply.channel,
      bucket: result.bucket,
      meetingRequested: result.meetingRequested,
      modelUsed: result.modelUsed,
      crmUpdated: result.crmUpdated,
      slackSent: result.slackSent,
      elapsedMs: result.elapsedMs,
    }));

    // Respond
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json({
      ok: result.success,
      bucket: result.bucket,
      meeting_requested: result.meetingRequested,
      model_used: result.modelUsed,
      crm_updated: result.crmUpdated,
      slack_sent: result.slackSent,
      reply_id: result.replyId,
      elapsed_ms: result.elapsedMs,
      error: result.error,
    });
  } catch (error: any) {
    console.error('[ReplyTriage] Unhandled error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
