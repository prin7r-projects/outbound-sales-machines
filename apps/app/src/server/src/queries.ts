import { Tenant, Domain, Sequence, Reply } from '@wasp/entities';

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

export const getTenant = async (args: any, context: WaspContext) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const tenant = await context.entities.Tenant.findFirst({
    where: { users: { some: { id: user.id } } },
    include: { domains: true, users: true },
  });

  return tenant;
};

export const getDomains = async (args: any, context: WaspContext) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const domains = await context.entities.Domain.findMany({
    where: { tenant: { users: { some: { id: user.id } } } },
  });

  return domains;
};

export const getSequences = async (args: any, context: WaspContext) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const sequences = await context.entities.Sequence.findMany({
    where: { tenant: { users: { some: { id: user.id } } } },
    include: { steps: true },
  });

  return sequences;
};

export const getReplies = async (args: any, context: any) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const replies = await context.entities.Reply.findMany({
    where: {
      message: {
        enrollment: {
          sequence: {
            tenant: { users: { some: { id: user.id } } },
          },
        },
      },
    },
    include: {
      message: {
        include: {
          enrollment: {
            include: {
              sequence: true,
            },
          },
        },
      },
    },
    orderBy: { receivedAt: 'desc' },
    take: args.limit || 50,
  });

  return replies;
};
