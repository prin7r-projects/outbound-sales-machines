import { Tenant, Domain, Sequence } from '@wasp/entities';

export const getTenant = async (args: any, context: any) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const tenant = await context.entities.Tenant.findFirst({
    where: { users: { some: { id: user.id } } },
    include: { domains: true, users: true }
  });

  return tenant;
};

export const getDomains = async (args: any, context: any) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const domains = await context.entities.Domain.findMany({
    where: { tenant: { users: { some: { id: user.id } } }
  });

  return domains;
};

export const getSequences = async (args: any, context: any) => {
  const user = context.user;
  if (!user) throw new Error('Unauthorized');

  const sequences = await context.entities.Sequence.findMany({
    where: { tenant: { users: { some: { id: user.id } } },
    include: { steps: true }
  });

  return sequences;
};
