// CRM adapter — Salesforce + HubSpot upsert for reply triage
const SALESFORCE_API_VERSION = 'v62.0';

export interface CRMConfig {
  type: 'SALESFORCE' | 'HUBSPOT';
  // Salesforce
  salesforceInstanceUrl?: string;
  salesforceAccessToken?: string;
  // HubSpot
  hubspotAccessToken?: string;
}

export interface CRMUpsertRequest {
  contactEmail: string;
  contactName?: string;
  companyName?: string;
  meetingRequested: boolean;
  bucket: string; // HOT | WARM | COLD | AUTO_REPLY | OOF
  lastReplyAt: string;
  replyBody?: string;
  sequenceName?: string;
}

export interface CRMUpsertResponse {
  success: boolean;
  contactId?: string;
  error?: string;
}

export class CRMAdapter {
  private config: CRMConfig;

  constructor(config: CRMConfig) {
    this.config = config;
  }

  async upsertContact(request: CRMUpsertRequest): Promise<CRMUpsertResponse> {
    if (this.config.type === 'SALESFORCE') {
      return this.upsertSalesforce(request);
    } else if (this.config.type === 'HUBSPOT') {
      return this.upsertHubSpot(request);
    }
    return { success: false, error: `Unsupported CRM type: ${this.config.type}` };
  }

  // --- Salesforce ---

  private async upsertSalesforce(request: CRMUpsertRequest): Promise<CRMUpsertResponse> {
    const { salesforceInstanceUrl, salesforceAccessToken } = this.config;
    if (!salesforceInstanceUrl || !salesforceAccessToken) {
      return { success: false, error: 'Salesforce not configured' };
    }

    try {
      // Step 1: Search for existing contact by email
      const searchQuery = encodeURIComponent(
        `SELECT Id, Email, Name FROM Contact WHERE Email = '${request.contactEmail.replace(/'/g, "\\'")}' LIMIT 1`
      );
      const searchResp = await fetch(
        `${salesforceInstanceUrl}/services/data/${SALESFORCE_API_VERSION}/query/?q=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${salesforceAccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const searchData = await searchResp.json();

      let contactId: string;

      if (searchData.records && searchData.records.length > 0) {
        // Update existing contact
        contactId = searchData.records[0].Id;
        await fetch(
          `${salesforceInstanceUrl}/services/data/${SALESFORCE_API_VERSION}/sobjects/Contact/${contactId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${salesforceAccessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Saltrun_Bucket__c: request.bucket,
              Saltrun_Last_Reply_At__c: request.lastReplyAt,
              Saltrun_Meeting_Requested__c: request.meetingRequested,
              Saltrun_Latest_Reply__c: request.replyBody?.slice(0, 32000),
            }),
          }
        );
      } else {
        // Create new contact (lead)
        const createResp = await fetch(
          `${salesforceInstanceUrl}/services/data/${SALESFORCE_API_VERSION}/sobjects/Lead`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${salesforceAccessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Email: request.contactEmail,
              LastName: request.contactName || request.contactEmail.split('@')[0],
              Company: request.companyName || 'Unknown',
              Status: request.meetingRequested ? 'Qualified' : 'New',
              Saltrun_Bucket__c: request.bucket,
              Saltrun_Last_Reply_At__c: request.lastReplyAt,
              Saltrun_Meeting_Requested__c: request.meetingRequested,
              Saltrun_Latest_Reply__c: request.replyBody?.slice(0, 32000),
            }),
          }
        );
        const createData = await createResp.json();
        if (!createResp.ok) {
          return { success: false, error: createData[0]?.message || 'Failed to create lead' };
        }
        contactId = createData.id;
      }

      return { success: true, contactId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // --- HubSpot ---

  private async upsertHubSpot(request: CRMUpsertRequest): Promise<CRMUpsertResponse> {
    const { hubspotAccessToken } = this.config;
    if (!hubspotAccessToken) {
      return { success: false, error: 'HubSpot not configured' };
    }

    try {
      // Step 1: Search for existing contact by email
      const searchResp = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/search`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${hubspotAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filterGroups: [
              {
                filters: [
                  {
                    propertyName: 'email',
                    operator: 'EQ',
                    value: request.contactEmail,
                  },
                ],
              },
            ],
          }),
        }
      );
      const searchData = await searchResp.json();

      const properties = {
        email: request.contactEmail,
        firstname: request.contactName?.split(' ')[0] || request.contactEmail.split('@')[0],
        lastname: request.contactName?.split(' ').slice(1).join(' ') || '',
        company: request.companyName || 'Unknown',
        saltrun_bucket: request.bucket,
        saltrun_last_reply_at: request.lastReplyAt,
        saltrun_meeting_requested: request.meetingRequested ? 'true' : 'false',
      };

      let contactId: string;

      if (searchData.results && searchData.results.length > 0) {
        // Update existing contact
        contactId = searchData.results[0].id;
        await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${hubspotAccessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ properties }),
          }
        );
      } else {
        // Create new contact
        const createResp = await fetch(
          'https://api.hubapi.com/crm/v3/objects/contacts',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${hubspotAccessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ properties }),
          }
        );
        const createData = await createResp.json();
        if (!createResp.ok) {
          return { success: false, error: createData.message || 'Failed to create contact' };
        }
        contactId = createData.id;
      }

      return { success: true, contactId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
