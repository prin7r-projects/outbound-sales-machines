// Pod queue — managed-tier auto-assignment and operator intervention tracking
// Assigns managed-tier tenants to pod operators, tracks warmup interventions

export type PodPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
export type PodInterventionType = 'warmup_stall' | 'circuit_breaker' | 'sequence_tuning' | 'domain_health' | 'manual';
export type PodInterventionStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export interface PodOperator {
  id: string;
  name: string;
  email: string;
  maxTenants: number;       // Max concurrent tenants
  currentTenants: number;
  isActive: boolean;
}

export interface PodAssignment {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantPlan: string;
  operatorId?: string;
  operatorName?: string;
  assignedAt: Date;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  interventionCount: number;
  lastActivity?: Date;
}

export interface PodIntervention {
  id: string;
  podAssignmentId: string;
  tenantId: string;
  tenantName: string;
  domainId?: string;
  domainName?: string;
  sequenceId?: string;
  sequenceName?: string;
  type: PodInterventionType;
  priority: PodPriority;
  status: PodInterventionStatus;
  notes?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface PodQueueItem {
  intervention: PodIntervention;
  assignment: PodAssignment;
  ageInMinutes: number;
  isEscalated: boolean;
}

// In-memory stores (production would use DB)
const operators = new Map<string, PodOperator>();
const assignments = new Map<string, PodAssignment>();
const interventions = new Map<string, PodIntervention>();

// Default operators (would be seeded from DB)
const DEFAULT_OPERATORS: PodOperator[] = [
  { id: 'op_1', name: 'Operator Alpha', email: 'alpha@saltrun.com', maxTenants: 10, currentTenants: 0, isActive: true },
  { id: 'op_2', name: 'Operator Beta', email: 'beta@saltrun.com', maxTenants: 10, currentTenants: 0, isActive: true },
];

// Initialize default operators
for (const op of DEFAULT_OPERATORS) {
  operators.set(op.id, op);
}

export class PodQueue {
  // Auto-assign a managed-tier tenant to an operator
  autoAssign(tenantId: string, tenantName: string): PodAssignment | null {
    // Find available operator with capacity
    const availableOps = Array.from(operators.values())
      .filter(op => op.isActive && op.currentTenants < op.maxTenants)
      .sort((a, b) => a.currentTenants - b.currentTenants);

    if (availableOps.length === 0) {
      console.warn(`[PodQueue] No available operators for tenant ${tenantId}`);
      return null;
    }

    const operator = availableOps[0];

    const assignment: PodAssignment = {
      id: `pa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      tenantId,
      tenantName,
      tenantPlan: 'MANAGED',
      operatorId: operator.id,
      operatorName: operator.name,
      assignedAt: new Date(),
      status: 'ACTIVE',
      interventionCount: 0,
    };

    assignments.set(assignment.id, assignment);
    operator.currentTenants++;
    operators.set(operator.id, operator);

    console.log(`[PodQueue] Assigned tenant ${tenantName} to ${operator.name}`);
    return assignment;
  }

  // Create an intervention
  createIntervention(params: {
    tenantId: string;
    tenantName: string;
    domainId?: string;
    domainName?: string;
    sequenceId?: string;
    sequenceName?: string;
    type: PodInterventionType;
    priority: PodPriority;
    notes?: string;
  }): PodIntervention {
    // Find assignment for tenant
    const assignment = Array.from(assignments.values())
      .find(a => a.tenantId === params.tenantId && a.status === 'ACTIVE');

    const intervention: PodIntervention = {
      id: `pi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      podAssignmentId: assignment?.id || 'unassigned',
      tenantId: params.tenantId,
      tenantName: params.tenantName,
      domainId: params.domainId,
      domainName: params.domainName,
      sequenceId: params.sequenceId,
      sequenceName: params.sequenceName,
      type: params.type,
      priority: params.priority,
      status: 'OPEN',
      notes: params.notes,
      createdAt: new Date(),
    };

    interventions.set(intervention.id, intervention);

    if (assignment) {
      assignment.interventionCount++;
      assignment.lastActivity = new Date();
      assignments.set(assignment.id, assignment);
    }

    console.log(`[PodQueue] Intervention created: ${params.type} for ${params.tenantName} (priority: ${params.priority})`);
    return intervention;
  }

  // Update intervention status
  updateIntervention(
    interventionId: string,
    update: {
      status?: PodInterventionStatus;
      priority?: PodPriority;
      notes?: string;
    }
  ): PodIntervention | null {
    const intervention = interventions.get(interventionId);
    if (!intervention) return null;

    if (update.status) intervention.status = update.status;
    if (update.priority) intervention.priority = update.priority;
    if (update.notes) intervention.notes = update.notes;

    if (update.status === 'RESOLVED') {
      intervention.resolvedAt = new Date();
    }

    interventions.set(interventionId, intervention);
    return intervention;
  }

  // Get the pod queue (open interventions, sorted by priority and age)
  getQueue(operatorId?: string): PodQueueItem[] {
    const now = new Date();
    const items: PodQueueItem[] = [];

    for (const intervention of interventions.values()) {
      if (intervention.status === 'RESOLVED') continue;

      // Filter by operator if specified
      if (operatorId) {
        const assignment = assignments.get(intervention.podAssignmentId);
        if (assignment?.operatorId !== operatorId) continue;
      }

      const assignment = assignments.get(intervention.podAssignmentId);
      if (!assignment) continue;

      const ageInMinutes = (now.getTime() - intervention.createdAt.getTime()) / (1000 * 60);

      items.push({
        intervention,
        assignment,
        ageInMinutes,
        isEscalated: ageInMinutes > 60 && intervention.priority !== 'CRITICAL', // Escalate after 1h
      });
    }

    // Sort: priority first, then age (oldest first)
    const priorityOrder: Record<PodPriority, number> = {
      'CRITICAL': 0,
      'HIGH': 1,
      'NORMAL': 2,
      'LOW': 3,
    };

    return items.sort((a, b) => {
      const pDiff = priorityOrder[a.intervention.priority] - priorityOrder[b.intervention.priority];
      if (pDiff !== 0) return pDiff;
      return b.ageInMinutes - a.ageInMinutes; // Oldest first
    });
  }

  // Get all assignments
  getAssignments(): PodAssignment[] {
    return Array.from(assignments.values());
  }

  // Get assignment for a tenant
  getTenantAssignment(tenantId: string): PodAssignment | undefined {
    return Array.from(assignments.values())
      .find(a => a.tenantId === tenantId && a.status === 'ACTIVE');
  }

  // Get all operators
  getOperators(): PodOperator[] {
    return Array.from(operators.values());
  }

  // Get operator workload
  getOperatorWorkload(operatorId: string): {
    operator: PodOperator;
    assignments: PodAssignment[];
    openInterventions: number;
    criticalInterventions: number;
  } | null {
    const operator = operators.get(operatorId);
    if (!operator) return null;

    const opAssignments = Array.from(assignments.values())
      .filter(a => a.operatorId === operatorId && a.status === 'ACTIVE');

    const opInterventions = Array.from(interventions.values())
      .filter(i => {
        const assignment = assignments.get(i.podAssignmentId);
        return assignment?.operatorId === operatorId && i.status !== 'RESOLVED';
      });

    return {
      operator,
      assignments: opAssignments,
      openInterventions: opInterventions.length,
      criticalInterventions: opInterventions.filter(i => i.priority === 'CRITICAL').length,
    };
  }

  // Get queue statistics
  getStats(): {
    totalAssignments: number;
    activeAssignments: number;
    totalInterventions: number;
    openInterventions: number;
    criticalInterventions: number;
    avgResolutionTimeMinutes: number;
  } {
    const allInterventions = Array.from(interventions.values());
    const resolved = allInterventions.filter(i => i.status === 'RESOLVED' && i.resolvedAt);

    const avgResolutionTime = resolved.length > 0
      ? resolved.reduce((sum, i) => {
          return sum + (i.resolvedAt!.getTime() - i.createdAt.getTime()) / (1000 * 60);
        }, 0) / resolved.length
      : 0;

    return {
      totalAssignments: assignments.size,
      activeAssignments: Array.from(assignments.values()).filter(a => a.status === 'ACTIVE').length,
      totalInterventions: allInterventions.length,
      openInterventions: allInterventions.filter(i => i.status !== 'RESOLVED').length,
      criticalInterventions: allInterventions.filter(i => i.status !== 'RESOLVED' && i.priority === 'CRITICAL').length,
      avgResolutionTimeMinutes: Math.round(avgResolutionTime),
    };
  }

  // Check for stale interventions and auto-escalate
  checkEscalations(): PodIntervention[] {
    const now = new Date();
    const escalated: PodIntervention[] = [];

    for (const intervention of interventions.values()) {
      if (intervention.status === 'RESOLVED') continue;

      const ageMinutes = (now.getTime() - intervention.createdAt.getTime()) / (1000 * 60);

      // Escalate NORMAL after 2h
      if (intervention.priority === 'NORMAL' && ageMinutes > 120) {
        intervention.priority = 'HIGH';
        interventions.set(intervention.id, intervention);
        escalated.push(intervention);
      }

      // Escalate HIGH after 4h
      if (intervention.priority === 'HIGH' && ageMinutes > 240) {
        intervention.priority = 'CRITICAL';
        interventions.set(intervention.id, intervention);
        escalated.push(intervention);
      }
    }

    return escalated;
  }
}

export const podQueue = new PodQueue();
