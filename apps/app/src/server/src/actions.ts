import { Domain, Sequence, Step } from '@wasp/entities';

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

  // TODO: Trigger Cloudflare DNS verification check
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
