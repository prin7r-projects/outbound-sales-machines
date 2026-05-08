// Synthflow + Twilio adapter for Voice lane
const SYNTHFLOW_API_BASE = 'https://api.synthflow.ai/v1';
const TWILIO_API_BASE = 'https://api.twilio.com/2010-04-01';

export interface SynthflowConfig {
  synthflowApiKey: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  fromNumber: string;
}

export interface VoiceCallRequest {
  to: string;
  script: string;
  contactId: string;
  localHourStart?: number; // 9 (9am)
  localHourEnd?: number; // 17 (5pm)
}

export interface VoiceCallResponse {
  success: boolean;
  callId?: string;
  error?: string;
}

export class VoiceAdapter {
  private synthflowApiKey: string;
  private twilioAccountSid: string;
  private twilioAuthToken: string;
  private fromNumber: string;
  private baseUrl: string;

  constructor(config: SynthflowConfig) {
    this.synthflowApiKey = config.synthflowApiKey;
    this.twilioAccountSid = config.twilioAccountSid;
    this.twilioAuthToken = config.twilioAuthToken;
    this.fromNumber = config.fromNumber;
    this.baseUrl = SYNTHFLOW_API_BASE;
  }

  // Check if current time is within local hours for the contact
  private isWithinLocalHours(
    contactTimezone: string,
    startHour: number = 9,
    endHour: number = 17
  ): boolean {
    try {
      // Get current time in contact's timezone
      const now = new Date();
      const contactTime = new Date(
        now.toLocaleString('en-US', { timeZone: contactTimezone })
      );
      const hour = contactTime.getHours();
      return hour >= startHour && hour < endHour;
    } catch (error) {
      console.error('Timezone check failed:', error);
      return false; // Fail safe - don't call if timezone is unknown
    }
  }

  // Generate voice script using Synthflow
  async generateVoiceScript(
    baseScript: string,
    contactName: string,
    companyName: string
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/scripts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.synthflowApiKey}`
        },
        body: JSON.stringify({
          template: baseScript,
          variables: {
            contact_name: contactName,
            company_name: companyName
          }
        })
      });

      const data = await response.json();
      return data.script || baseScript;
    } catch (error: any) {
      console.error('Failed to generate voice script:', error);
      return baseScript; // Fallback to base script
    }
  }

  // Make a voice call via Twilio
  async makeCall(request: VoiceCallRequest): Promise<VoiceCallResponse> {
    try {
      // Check local hour gate
      // Note: In production, you'd get the contact's timezone from their data
      const contactTimezone = 'America/New_York'; // Default, should come from contact data
      if (!this.isWithinLocalHours(contactTimezone, 9, 17)) {
        return {
          success: false,
          error: 'Outside local hours (9am-5pm)'
        };
      }

      // Generate personalized script
      const script = await this.generateVoiceScript(
        request.script,
        `Contact-${request.contactId}`,
        'Company'
      );

      // Make call via Twilio
      const twilioUrl = `${TWILIO_API_BASE}/Accounts/${this.twilioAccountSid}/Calls.json`;
      const auth = btoa(`${this.twilioAccountSid}:${this.twilioAuthToken}`);
      
      const twiml = `
        <Response>
          <Say voice="alice">${script}</Say>
        </Response>
      `;

      const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: this.fromNumber,
          To: request.to,
          Twiml: twiml
        }).toString()
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to make call'
        };
      }

      return {
        success: true,
        callId: data.sid
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get call status
  async getCallStatus(callId: string): Promise<string> {
    try {
      const twilioUrl = `${TWILIO_API_BASE}/Accounts/${this.twilioAccountSid}/Calls/${callId}.json`;
      const auth = btoa(`${this.twilioAccountSid}:${this.twilioAuthToken}`);
      
      const response = await fetch(twilioUrl, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });

      const data = await response.json();
      return data.status || 'unknown';
    } catch (error) {
      console.error('Failed to get call status:', error);
      return 'unknown';
    }
  }

  // Check if number is on do-not-call list
  async checkDNC(to: string): Promise<boolean> {
    // In production, check against DNC list
    // For now, return false
    return false;
  }
}
