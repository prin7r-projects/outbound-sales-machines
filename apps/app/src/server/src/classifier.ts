// LLM reply classifier — Claude 4.7 primary, GLM 5.1 fallback
// JSON-schema-validated output: bucket, meeting_requested, confidence, reason

export type ReplyBucket = 'HOT' | 'WARM' | 'COLD' | 'AUTO_REPLY' | 'OOF';

export interface ClassifierInput {
  replyBody: string;
  replySubject?: string;
  originalMessageSentAt?: string;
  contactEmail?: string;
  contactName?: string;
  companyName?: string;
}

export interface ClassifierOutput {
  bucket: ReplyBucket;
  meetingRequested: boolean;
  confidence: number; // 0.0 – 1.0
  reason: string;
  modelUsed: string;
}

const CLASSIFIER_JSON_SCHEMA = {
  type: 'object',
  properties: {
    bucket: {
      type: 'string',
      enum: ['HOT', 'WARM', 'COLD', 'AUTO_REPLY', 'OOF'],
      description: 'Classification bucket for the reply',
    },
    meeting_requested: {
      type: 'boolean',
      description: 'Whether the prospect explicitly requested a meeting/call/demo',
    },
    confidence: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      description: 'Confidence score 0.0-1.0',
    },
    reason: {
      type: 'string',
      maxLength: 200,
      description: 'Brief explanation of the classification (1-2 sentences)',
    },
  },
  required: ['bucket', 'meeting_requested', 'confidence', 'reason'],
  additionalProperties: false,
};

const CLASSIFIER_SYSTEM_PROMPT = `You are a sales reply classifier for Saltrun, an outbound sales automation platform.
Classify the following email/LinkedIn reply into exactly one bucket:

- HOT: Positive reply with clear buying intent. Prospect asks about pricing, wants a demo, mentions timeline/budget, or explicitly requests a meeting. Also "not interested right now, but try me next quarter" with a specific timeframe.
- WARM: Mildly positive or inquisitive. Asks a qualifying question, shows curiosity, mentions they're "the wrong person but let me connect you," or gives a soft maybe. Not a clear "no".  
- COLD: Explicit rejection, unsubscribe, "stop emailing me," "not interested," or hostile response.
- AUTO_REPLY: Automated out-of-office, vacation responder, mailbox full, or bounce notification. The message is system-generated.
- OOF: Specifically an out-of-office / vacation auto-reply. "I am out of the office until [date]" or similar.

Also determine if the prospect explicitly requested a meeting, demo, or call (meeting_requested: true).

Return valid JSON matching this schema. Only the JSON object, no other text.`;

export interface ClassifierConfig {
  // Claude (primary)
  anthropicApiKey?: string;
  claudeModel?: string; // default: claude-sonnet-4-20250514

  // GLM (fallback)
  zaiApiKey?: string;
  glmModel?: string; // default: glm-4-flash

  // Common
  timeoutMs?: number;
}

const DEFAULT_CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_GLM_MODEL = 'glm-4-flash';
const DEFAULT_TIMEOUT_MS = 3000;

export class ReplyClassifier {
  private config: ClassifierConfig;

  constructor(config: ClassifierConfig) {
    this.config = config;
  }

  async classify(input: ClassifierInput): Promise<ClassifierOutput> {
    const timeoutMs = this.config.timeoutMs || DEFAULT_TIMEOUT_MS;

    // Try Claude first
    if (this.config.anthropicApiKey) {
      try {
        const result = await this.classifyWithClaude(input, timeoutMs);
        return { ...result, modelUsed: 'claude' };
      } catch (error: any) {
        console.warn(`Claude classification failed: ${error.message}. Falling back to GLM.`);
      }
    }

    // Fallback to GLM
    if (this.config.zaiApiKey) {
      try {
        const result = await this.classifyWithGLM(input, timeoutMs);
        return { ...result, modelUsed: 'glm' };
      } catch (error: any) {
        console.error(`GLM classification failed: ${error.message}. Using heuristic fallback.`);
      }
    }

    // Heuristic fallback (no API keys configured or both failed)
    return this.classifyHeuristic(input);
  }

  private async classifyWithClaude(input: ClassifierInput, timeoutMs: number): Promise<ClassifierOutput> {
    const model = this.config.claudeModel || DEFAULT_CLAUDE_MODEL;

    const userMessage = this.buildUserMessage(input);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.anthropicApiKey!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 256,
          temperature: 0,
          system: CLASSIFIER_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `Claude API error ${response.status}`);
      }

      const rawText = data.content?.[0]?.text || '';
      return this.parseAndValidate(rawText);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async classifyWithGLM(input: ClassifierInput, timeoutMs: number): Promise<ClassifierOutput> {
    const model = this.config.glmModel || DEFAULT_GLM_MODEL;

    const userMessage = this.buildUserMessage(input);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.zaiApiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: CLASSIFIER_SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 256,
          temperature: 0,
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `GLM API error ${response.status}`);
      }

      const rawText = data.choices?.[0]?.message?.content || '';
      return this.parseAndValidate(rawText);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private classifyHeuristic(input: ClassifierInput): ClassifierOutput {
    const body = (input.replyBody || '').toLowerCase();
    const subject = (input.replySubject || '').toLowerCase();

    // OOF detection
    const oofPatterns = [
      'out of the office', 'out of office', 'vacation', 'away from',
      'automatic reply', 'auto-reply', 'auto reply', 'on leave',
      'will be back', 'returning on', 'limited email access',
    ];
    if (oofPatterns.some((p) => body.includes(p) || subject.includes(p))) {
      return {
        bucket: 'OOF',
        meetingRequested: false,
        confidence: 0.95,
        reason: 'Matched out-of-office patterns',
        modelUsed: 'heuristic',
      };
    }

    // Auto-reply detection
    const autoPatterns = [
      'mailbox full', 'undeliverable', 'delivery failure', 'bounced',
      'mailer-daemon', 'postmaster', 'address not found',
      'user unknown', 'does not exist',
    ];
    if (autoPatterns.some((p) => body.includes(p) || subject.includes(p))) {
      return {
        bucket: 'AUTO_REPLY',
        meetingRequested: false,
        confidence: 0.95,
        reason: 'Matched auto-reply/bounce patterns',
        modelUsed: 'heuristic',
      };
    }

    // Meeting request detection
    const meetingPatterns = [
      'demo', 'meeting', 'schedule', 'calendar', 'call',
      'next week', 'available', 'let\'s talk', 'interested',
      'pricing', 'price', 'cost', 'how much', 'trial',
      'set up a time', 'book', 'connect',
    ];
    const meetingRequested = meetingPatterns.some((p) => body.includes(p));

    // Cold detection
    const coldPatterns = [
      'not interested', 'unsubscribe', 'remove me', 'stop emailing',
      'do not contact', 'no thanks', 'don\'t email',
      'never contact', 'take me off', 'spam',
    ];
    if (coldPatterns.some((p) => body.includes(p))) {
      return {
        bucket: 'COLD',
        meetingRequested: false,
        confidence: 0.85,
        reason: 'Matched rejection/unsubscribe patterns',
        modelUsed: 'heuristic',
      };
    }

    // Hot detection
    const hotPatterns = [
      'interested', 'tell me more', 'how does it work',
      'what\'s the price', 'send details', 'love to learn',
      'sounds great', 'definitely', 'yes',
    ];
    if (hotPatterns.some((p) => body.includes(p))) {
      return {
        bucket: meetingRequested ? 'HOT' : 'WARM',
        meetingRequested,
        confidence: 0.7,
        reason: meetingRequested ? 'Matched interest + meeting patterns' : 'Matched interest patterns',
        modelUsed: 'heuristic',
      };
    }

    // Default to WARM for any human-written reply that isn't explicitly cold
    return {
      bucket: 'WARM',
      meetingRequested,
      confidence: 0.5,
      reason: 'Default classification for unstructured reply',
      modelUsed: 'heuristic',
    };
  }

  private buildUserMessage(input: ClassifierInput): string {
    const parts: string[] = [];

    if (input.replySubject) {
      parts.push(`Subject: ${input.replySubject}`);
    }

    parts.push(`Body:\n${input.replyBody}`);

    if (input.contactEmail) {
      parts.push(`\nFrom: ${input.contactName || input.contactEmail} <${input.contactEmail}>`);
    }

    if (input.companyName) {
      parts.push(`Company: ${input.companyName}`);
    }

    if (input.originalMessageSentAt) {
      parts.push(`Original message sent: ${input.originalMessageSentAt}`);
    }

    return parts.join('\n');
  }

  private parseAndValidate(rawText: string): ClassifierOutput {
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = rawText.trim();

    // Remove markdown code fences
    const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      // Try to find raw JSON object
      const braceIdx = jsonText.indexOf('{');
      if (braceIdx >= 0) {
        jsonText = jsonText.slice(braceIdx);
        // Find matching closing brace
        let depth = 0;
        let endIdx = -1;
        for (let i = 0; i < jsonText.length; i++) {
          if (jsonText[i] === '{') depth++;
          if (jsonText[i] === '}') depth--;
          if (depth === 0) {
            endIdx = i + 1;
            break;
          }
        }
        if (endIdx > 0) {
          jsonText = jsonText.slice(0, endIdx);
        }
      }
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      throw new Error(`Invalid JSON from classifier: ${rawText.slice(0, 200)}`);
    }

    // Validate against schema
    const validBuckets: ReplyBucket[] = ['HOT', 'WARM', 'COLD', 'AUTO_REPLY', 'OOF'];
    if (!validBuckets.includes(parsed.bucket)) {
      throw new Error(`Invalid bucket: ${parsed.bucket}`);
    }

    if (typeof parsed.meeting_requested !== 'boolean') {
      parsed.meeting_requested = false;
    }

    if (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 1) {
      parsed.confidence = 0.5;
    }

    if (typeof parsed.reason !== 'string') {
      parsed.reason = 'No reason provided';
    }

    return {
      bucket: parsed.bucket,
      meetingRequested: parsed.meeting_requested,
      confidence: parsed.confidence,
      reason: parsed.reason.slice(0, 200),
      modelUsed: 'unknown',
    };
  }
}
