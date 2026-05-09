import { Domain, Sequence, Step, Reply, Tenant } from '@wasp/entities';
import { getTriage } from './replyTriage';
import { isWarmupReady, onWarmupReady } from './warmupReady';

type WaspContext = {
  user: any;
  entities: any;
};

async function getTenantForUser(context: WaspContext) {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const tenant = await context.entities.Tenant.findFirst({
    where: { users: { some: { id: user.id } } },
  });

  if (!tenant) throw new Error('Tenant not found');
  return tenant;
}

async function verifyDNSRecords(domain: string, cfApiToken: string) {
  const results = {
    spf: 'pending',
    dkim: 'pending',
    dmarc: 'pending',
  };

  try {
    const spfResp = await fetch(
      `https://api.cloudflare.com/client/v4/zones?name=${domain}`,
      { headers: { Authorization: `Bearer ${cfApiToken}` } }
    );
    const spfData = await spfResp.json();

    if (spfData.success && spfData.result.length > 0) {
      const zoneId = spfData.result[0].id;
      const dnsResp = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns/records?type=TXT`,
        { headers: { Authorization: `Bearer ${cfApiToken}` } }
      );
      const dnsData = await dnsResp.json();

      const spfRecord = dnsData.result?.find((r: any) =>
        r.content.includes('v=spf1')
      );
      results.spf = spfRecord ? 'verified' : 'failed';

      const dkimRecord = dnsData.result?.find((r: any) =>
        r.name.includes('_domainkey')
      );
      results.dkim = dkimRecord ? 'verified' : 'failed';

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

export const createDomain = async (args: { domain: string }, context: WaspContext) => {
  const tenant = await getTenantForUser(context);

  const domain = await context.entities.Domain.create({
    data: {
      domain: args.domain,
      tenantId: tenant.id,
    },
  });

  const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (cfApiToken) {
    const dnsResults = await verifyDNSRecords(args.domain, cfApiToken);
    await context.entities.Domain.update({
      where: { id: domain.id },
      data: {
        spfStatus: dnsResults.spf,
        dkimStatus: dnsResults.dkim,
        dmarcStatus: dnsResults.dmarc,
      },
    });
    domain.spfStatus = dnsResults.spf;
    domain.dkimStatus = dnsResults.dkim;
    domain.dmarcStatus = dnsResults.dmarc;

    if (isWarmupReady(dnsResults.spf, dnsResults.dkim, dnsResults.dmarc)) {
      await onWarmupReady(domain.id, tenant.id, context.entities);
      domain.status = 'WARMUP_READY' as any;
    }
  }

  return domain;
};

export const updateDomain = async (
  args: { id: string; data: Partial<Domain> },
  context: WaspContext
) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const domain = await context.entities.Domain.findFirst({
    where: {
      id: args.id,
      tenant: { users: { some: { id: user.id } } },
    },
  });

  if (!domain) throw new Error('Domain not found');

  return await context.entities.Domain.update({
    where: { id: args.id },
    data: args.data,
  });
};

export const createSequence = async (
  args: { name: string; spec?: any; steps?: any[] },
  context: WaspContext
) => {
  const tenant = await getTenantForUser(context);

  const sequence = await context.entities.Sequence.create({
    data: {
      name: args.name,
      spec: args.spec || {},
      tenantId: tenant.id,
      steps: {
        create: args.steps || [],
      },
    },
    include: { steps: true },
  });

  return sequence;
};

export const updateSequence = async (
  args: { id: string; data: { name?: string; spec?: any; steps?: any[] } },
  context: WaspContext
) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const sequence = await context.entities.Sequence.findFirst({
    where: {
      id: args.id,
      tenant: { users: { some: { id: user.id } } },
    },
    include: { steps: true },
  });

  if (!sequence) throw new Error('Sequence not found');

  // If steps are provided, delete existing steps and recreate
  if (args.data.steps) {
    await context.entities.Step.deleteMany({
      where: { sequenceId: args.id },
    });

    await context.entities.Sequence.update({
      where: { id: args.id },
      data: {
        name: args.data.name,
        spec: args.data.spec,
        steps: {
          create: args.data.steps,
        },
        version: sequence.version + 1,
      },
    });
  } else {
    await context.entities.Sequence.update({
      where: { id: args.id },
      data: {
        name: args.data.name,
        spec: args.data.spec,
      },
    });
  }

  return context.entities.Sequence.findUnique({
    where: { id: args.id },
    include: { steps: true },
  });
};

export const launchSequence = async (
  args: { id: string },
  context: WaspContext
) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const sequence = await context.entities.Sequence.findFirst({
    where: {
      id: args.id,
      tenant: { users: { some: { id: user.id } } },
    },
    include: { steps: true },
  });

  if (!sequence) throw new Error('Sequence not found');
  if (sequence.steps.length === 0) throw new Error('Sequence has no steps');

  return context.entities.Sequence.update({
    where: { id: args.id },
    data: { status: 'ACTIVE' },
    include: { steps: true },
  });
};

export const pauseSequence = async (
  args: { id: string },
  context: WaspContext
) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const sequence = await context.entities.Sequence.findFirst({
    where: {
      id: args.id,
      tenant: { users: { some: { id: user.id } } },
    },
  });

  if (!sequence) throw new Error('Sequence not found');

  return context.entities.Sequence.update({
    where: { id: args.id },
    data: { status: 'PAUSED' },
    include: { steps: true },
  });
};

// Manually triage a reply from the dashboard (for testing/spot-checking)
export const triageReplyAction = async (args: any, context: any) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const tenant = await context.entities.Tenant.findFirst({
    where: { users: { some: { id: user.id } } },
  });

  if (!tenant) throw new Error('Tenant not found');

  const triage = getTriage();

  const result = await triage.triage(
    {
      channel: args.channel || 'EMAIL',
      messageId: args.messageId,
      replyBody: args.replyBody,
      replySubject: args.replySubject,
      contactEmail: args.contactEmail,
      contactName: args.contactName,
      companyName: args.companyName,
      enrollmentId: args.enrollmentId,
      tenantId: tenant.id,
      tenantName: tenant.name,
      sequenceName: args.sequenceName,
    },
    context.entities
  );

  return result;
};
