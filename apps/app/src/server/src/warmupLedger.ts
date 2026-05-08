// Warmup ledger for email domain warmup
// 40-day ramp curve for domain reputation building

export interface WarmupConfig {
  domainId: string;
  domain: string;
  startDay: number;
  currentDay: number;
  dailyCap: number;
  emailsSentToday: number;
  status: 'warming' | 'healthy' | 'paused' | 'expiring';
}

// 40-day ramp curve (cumulative emails)
// Day 1: 5, Day 5: 50, Day 10: 200, Day 20: 1000, Day 40: 5000
const WARMUP_SCHEDULE = [
  { day: 0, dailyCap: 0 },
  { day: 1, dailyCap: 5 },
  { day: 2, dailyCap: 10 },
  { day: 3, dailyCap: 15 },
  { day: 4, dailyCap: 20 },
  { day: 5, dailyCap: 50 },
  { day: 6, dailyCap: 60 },
  { day: 7, dailyCap: 70 },
  { day: 8, dailyCap: 80 },
  { day: 9, dailyCap: 90 },
  { day: 10, dailyCap: 200 },
  { day: 15, dailyCap: 400 },
  { day: 20, dailyCap: 1000 },
  { day: 25, dailyCap: 2000 },
  { day: 30, dailyCap: 3000 },
  { day: 35, dailyCap: 4000 },
  { day: 40, dailyCap: 5000 },
];

export function getDailyCap(warmupDay: number): number {
  // Find the appropriate daily cap based on warmup day
  let cap = WARMUP_SCHEDULE[0].dailyCap;
  
  for (const milestone of WARMUP_SCHEDULE) {
    if (warmupDay >= milestone.day) {
      cap = milestone.dailyCap;
    } else {
      break;
    }
  }
  
  return cap;
}

export function getWarmupProgress(warmupDay: number): number {
  return Math.min((warmupDay / 40) * 100, 100);
}

export function isWarmupComplete(warmupDay: number): boolean {
  return warmupDay >= 40;
}

// Check if domain warmup is stalled (no progress in 48h)
export function isWarmupStalled(lastWarmupUpdate: Date): boolean {
  const now = new Date();
  const diffHours = (now.getTime() - lastWarmupUpdate.getTime()) / (1000 * 60 * 60);
  return diffHours > 48;
}

// Calculate next warmup day
export function advanceWarmupDay(currentDay: number): number {
  if (currentDay >= 40) return 40;
  return currentDay + 1;
}

// Check if sending is allowed based on warmup
export function canSendEmail(
  warmupDay: number,
  emailsSentToday: number
): { allowed: boolean; reason?: string } {
  const dailyCap = getDailyCap(warmupDay);
  
  if (emailsSentToday >= dailyCap) {
    return {
      allowed: false,
      reason: `Daily cap reached: ${emailsSentToday}/${dailyCap}`
    };
  }
  
  if (warmupDay === 0) {
    return {
      allowed: false,
      reason: 'Domain warmup not started'
    };
  }
  
  return { allowed: true };
}

// Ledger entry for tracking warmup progress
export interface WarmupLedgerEntry {
  id: string;
  domainId: string;
  day: number;
  dailyCap: number;
  emailsSent: number;
  bounces: number;
  complaints: number;
  timestamp: Date;
}

// In-memory ledger (in production, this would be in DB)
const warmupLedger: Map<string, WarmupLedgerEntry[]> = new Map();

export function recordWarmupEntry(
  domainId: string,
  day: number,
  emailsSent: number,
  bounces: number = 0,
  complaints: number = 0
): WarmupLedgerEntry {
  const entries = warmupLedger.get(domainId) || [];
  const entry: WarmupLedgerEntry = {
    id: `wle_${Date.now()}`,
    domainId,
    day,
    dailyCap: getDailyCap(day),
    emailsSent,
    bounces,
    complaints,
    timestamp: new Date()
  };
  entries.push(entry);
  warmupLedger.set(domainId, entries);
  return entry;
}

export function getWarmupLedger(domainId: string): WarmupLedgerEntry[] {
  return warmupLedger.get(domainId) || [];
}

export function getLatestWarmupEntry(domainId: string): WarmupLedgerEntry | undefined {
  const entries = warmupLedger.get(domainId) || [];
  return entries[entries.length - 1];
}
