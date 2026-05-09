/**
 * Warmup-ready hook — called when DNS verifier confirms SPF + DKIM + DMARC.
 * Sets Domain.status → WARMUP_READY so Phase 2 warmup ledger can pick it up.
 */

export interface WarmupReadyDomain {
  id: string;
  domain: string;
  tenantId: string;
  spfStatus: string;
  dkimStatus: string;
  dmarcStatus: string;
}

export interface WarmupReadyEntities {
  Domain: {
    update: (args: { where: { id: string }; data: { status: string } }) => Promise<any>;
  };
}

export function isWarmupReady(
  spfStatus: string,
  dkimStatus: string,
  dmarcStatus: string
): boolean {
  return spfStatus === 'verified' && dkimStatus === 'verified' && dmarcStatus === 'verified';
}

export async function onWarmupReady(
  domainId: string,
  tenantId: string,
  entities: WarmupReadyEntities
): Promise<void> {
  await entities.Domain.update({
    where: { id: domainId },
    data: { status: 'WARMUP_READY' },
  });
  console.log(`[warmup_ready] domain=${domainId} tenant=${tenantId} — all DNS records verified`);
}
