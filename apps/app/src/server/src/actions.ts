import { Domain, Sequence, Step } from '@wasp/entities';

// Helper to check DNS records via Cloudflare API
async function verifyDNSRecords(domain: string, cfApiToken: string) {
  const results = {
    spf: 'pending',
    dkim: 'pending',
    dmarc: 'pending'
  };

  try {
    // Query Cloudflare DNS API for SPF record
    const spfResp = await fetch(
      `https://api.cloudflare.com/client/v4/zones?name=${domain}`,
      { headers: { 'Authorization': `Bearer ${cfApiToken}` } }
    );
    const spfData = await spfResp.json();
    
    if (spfData.success && spfData.result.length > 0) {
      const zoneId = spfData.result[0].id;
      const dnsResp = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns/records?type=TXT`,
        { headers: { 'Authorization': `Bearer ${cfApiToken}` } }
      );
      const dnsData = await dnsResp.json();
      
      // Check SPF
      const spfRecord = dnsData.result?.find((r: any) => 
        r.content.includes('v=spf1')
      );
      results.spf = spfRecord ? 'verified' : 'failed';
      
      // Check DKIM
      const dkimRecord = dnsData.result?.find((r: any) => 
        r.name.includes('_domainkey')
      );
      results.dkim = dkimRecord ? 'verified' : 'failed';
      
      // Check DMARC
      const dmarcRecord = dnsData.result?.find((r: any) => 
        r.name.includes('_dmarc')
      );
      results.dmarc = dmarcRecord ? 'verified' : 'failed';
    }
  } catch (error) {
    console.error('DNS verification error:', error);
  }

  return results;
}

export const createDomain = async (args: any, context: any) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const tenant = await context.entities.Tenant.findFirst({
    where: { users: { some: { id: user.id } } }
  });

  if (!tenant) throw new Error('Tenant not found');

  const domain = await context.entities.Domain.create({
    data: {
      domain: args.domain,
      tenantId: tenant.id
    }
  });

  // Trigger Cloudflare DNS verification check
  const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (cfApiToken) {
    const dnsResults = await verifyDNSRecords(args.domain, cfApiToken);
    await context.entities.Domain.update({
      where: { id: domain.id },
      data: {
        spfStatus: dnsResults.spf,
        dkimStatus: dnsResults.dkim,
        dmarcStatus: dnsResults.dmarc
      }
    });
    domain.spfStatus = dnsResults.spf;
    domain.dkimStatus = dnsResults.dkim;
    domain.dmarcStatus = dnsResults.dmarc;
  }

  return domain;
};

export const updateDomain = async (args: any, context: any) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const domain = await context.entities.Domain.findFirst({
    where: {
      id: args.id,
      tenant: { users: { some: { id: user.id } } }
    }
  });

  if (!domain) throw new Error('Domain not found');

  return await context.entities.Domain.update({
    where: { id: args.id },
    data: args.data
  });
};

export const createSequence = async (args: any, context: any) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const tenant = await context.entities.Tenant.findFirst({
    where: { users: { some: { id: user.id } } }
  });

  if (!tenant) throw new Error('Tenant not found');

  const sequence = await context.entities.Sequence.create({
    data: {
      name: args.name,
      spec: args.spec || {},
      tenantId: tenant.id,
      steps: {
        create: args.steps || []
      }
    },
    include: { steps: true }
  });

  return sequence;
};
