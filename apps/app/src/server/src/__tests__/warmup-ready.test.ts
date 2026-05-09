// Phase 1 closeout B — warmup_ready event hook tests
// Run with: npx vitest run apps/app/src/server/src/__tests__/warmup-ready.test.ts

import { describe, it, expect, vi } from 'vitest';
import { isWarmupReady, onWarmupReady, type WarmupReadyEntities } from '../warmupReady';

describe('isWarmupReady', () => {
  it('returns true when SPF, DKIM, and DMARC are all verified', () => {
    expect(isWarmupReady('verified', 'verified', 'verified')).toBe(true);
  });

  it('returns false when SPF is not verified', () => {
    expect(isWarmupReady('pending', 'verified', 'verified')).toBe(false);
    expect(isWarmupReady('failed', 'verified', 'verified')).toBe(false);
  });

  it('returns false when DKIM is not verified', () => {
    expect(isWarmupReady('verified', 'pending', 'verified')).toBe(false);
    expect(isWarmupReady('verified', 'failed', 'verified')).toBe(false);
  });

  it('returns false when DMARC is not verified', () => {
    expect(isWarmupReady('verified', 'verified', 'pending')).toBe(false);
    expect(isWarmupReady('verified', 'verified', 'failed')).toBe(false);
  });

  it('returns false when all are pending', () => {
    expect(isWarmupReady('pending', 'pending', 'pending')).toBe(false);
  });
});

describe('onWarmupReady', () => {
  it('sets Domain.status to WARMUP_READY', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({});
    const entities: WarmupReadyEntities = {
      Domain: { update: mockUpdate },
    };

    await onWarmupReady('domain-123', 'tenant-456', entities);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'domain-123' },
      data: { status: 'WARMUP_READY' },
    });
  });

  it('does not throw when entities call succeeds', async () => {
    const entities: WarmupReadyEntities = {
      Domain: { update: vi.fn().mockResolvedValue({}) },
    };

    await expect(onWarmupReady('d1', 't1', entities)).resolves.toBeUndefined();
  });
});

describe('updateDomain warmup_ready hook', () => {
  it('triggers onWarmupReady when update sets all DNS records to verified', async () => {
    const mockUpdate = vi.fn()
      .mockResolvedValueOnce({
        id: 'dom-1',
        tenantId: 't1',
        spfStatus: 'verified',
        dkimStatus: 'verified',
        dmarcStatus: 'verified',
      });

    const entities = {
      Domain: {
        update: mockUpdate,
        findFirst: vi.fn().mockResolvedValue({
          id: 'dom-1',
          tenant: { users: [{ id: 'u1' }] },
        }),
      },
      Tenant: {},
    };

    const context = {
      user: { id: 'u1' },
      entities,
    };

    const { updateDomain } = await import('../actions');

    await updateDomain(
      { id: 'dom-1', data: { spfStatus: 'verified', dkimStatus: 'verified', dmarcStatus: 'verified' } },
      context as any
    );

    // Second call should be onWarmupReady's Domain.update
    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(mockUpdate.mock.calls[1]).toEqual([
      { where: { id: 'dom-1' }, data: { status: 'WARMUP_READY' } },
    ]);
  });

  it('does not trigger onWarmupReady when only some DNS records are verified', async () => {
    const mockUpdate = vi.fn()
      .mockResolvedValueOnce({
        id: 'dom-2',
        tenantId: 't1',
        spfStatus: 'verified',
        dkimStatus: 'pending',
        dmarcStatus: 'verified',
      });

    const entities = {
      Domain: {
        update: mockUpdate,
        findFirst: vi.fn().mockResolvedValue({
          id: 'dom-2',
          tenant: { users: [{ id: 'u1' }] },
        }),
      },
      Tenant: {},
    };

    const context = {
      user: { id: 'u1' },
      entities,
    };

    const { updateDomain } = await import('../actions');

    await updateDomain(
      { id: 'dom-2', data: { spfStatus: 'verified' } },
      context as any
    );

    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });
});
