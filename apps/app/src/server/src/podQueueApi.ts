// API handlers for pod queue — operator intervention management
// GET /api/pod/queue — get the intervention queue
// GET /api/pod/assignments — get all assignments
// GET /api/pod/operators — get operators and workloads
// POST /api/pod/interventions — create an intervention
// PATCH /api/pod/interventions/:id — update intervention status
import { podQueue, type PodPriority, PodInterventionType, PodInterventionStatus } from './podQueue';

// System auth key for internal endpoints
const SYSTEM_API_KEY = process.env.SYSTEM_API_KEY || 'saltrun-internal';

// Session auth check (for UI endpoints)
const isAuthenticated = (req: any): boolean => {
  // In production, this would check the Wasp session
  // For now, accept either system key or session cookie
  const authHeader = req.headers?.authorization || '';
  if (authHeader === `Bearer ${SYSTEM_API_KEY}`) return true;
  // Wasp handles session auth for UI routes
  return !!req.user || !!req.session;
};

// GET /api/pod/queue
export const getPodQueue = async (req: any, res: any) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const operatorId = req.query.operatorId as string | undefined;
    const queue = podQueue.getQueue(operatorId);
    const stats = podQueue.getStats();

    // Check for stale interventions and auto-escalate
    const escalated = podQueue.checkEscalations();

    return res.status(200).json({
      queue: queue.map(item => ({
        intervention: {
          id: item.intervention.id,
          type: item.intervention.type,
          priority: item.intervention.priority,
          status: item.intervention.status,
          tenantName: item.intervention.tenantName,
          domainName: item.intervention.domainName,
          sequenceName: item.intervention.sequenceName,
          notes: item.intervention.notes,
          createdAt: item.intervention.createdAt.toISOString(),
        },
        assignment: {
          id: item.assignment.id,
          operatorName: item.assignment.operatorName,
          tenantPlan: item.assignment.tenantPlan,
        },
        ageInMinutes: Math.round(item.ageInMinutes),
        isEscalated: item.isEscalated,
      })),
      stats,
      escalatedCount: escalated.length,
    });
  } catch (error: any) {
    console.error('[PodQueueAPI] Queue fetch error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/pod/assignments
export const getPodAssignments = async (req: any, res: any) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const assignments = podQueue.getAssignments();
    return res.status(200).json({
      assignments: assignments.map(a => ({
        id: a.id,
        tenantId: a.tenantId,
        tenantName: a.tenantName,
        tenantPlan: a.tenantPlan,
        operatorId: a.operatorId,
        operatorName: a.operatorName,
        assignedAt: a.assignedAt.toISOString(),
        status: a.status,
        interventionCount: a.interventionCount,
        lastActivity: a.lastActivity?.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('[PodQueueAPI] Assignments fetch error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/pod/operators
export const getPodOperators = async (req: any, res: any) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const operators = podQueue.getOperators();
    const workloads = operators.map(op => {
      const workload = podQueue.getOperatorWorkload(op.id);
      return {
        id: op.id,
        name: op.name,
        email: op.email,
        isActive: op.isActive,
        maxTenants: op.maxTenants,
        currentTenants: op.currentTenants,
        openInterventions: workload?.openInterventions || 0,
        criticalInterventions: workload?.criticalInterventions || 0,
      };
    });

    return res.status(200).json({ operators: workloads });
  } catch (error: any) {
    console.error('[PodQueueAPI] Operators fetch error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/pod/interventions
export const createPodIntervention = async (req: any, res: any) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const {
      tenantId,
      tenantName,
      domainId,
      domainName,
      sequenceId,
      sequenceName,
      type,
      priority,
      notes,
    } = req.body;

    if (!tenantId || !tenantName || !type || !priority) {
      return res.status(400).json({
        error: 'Missing required fields: tenantId, tenantName, type, priority',
      });
    }

    const validTypes: PodInterventionType[] = [
      'warmup_stall',
      'circuit_breaker',
      'sequence_tuning',
      'domain_health',
      'manual',
    ];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
    }

    const validPriorities: PodPriority[] = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` });
    }

    const intervention = podQueue.createIntervention({
      tenantId,
      tenantName,
      domainId,
      domainName,
      sequenceId,
      sequenceName,
      type,
      priority,
      notes,
    });

    return res.status(201).json({
      ok: true,
      intervention: {
        id: intervention.id,
        type: intervention.type,
        priority: intervention.priority,
        status: intervention.status,
        tenantName: intervention.tenantName,
        createdAt: intervention.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[PodQueueAPI] Create intervention error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

// PATCH /api/pod/interventions/:id
export const updatePodIntervention = async (req: any, res: any) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id } = req.params;
    const { status, priority, notes } = req.body;

    if (status) {
      const validStatuses: PodInterventionStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      }
    }

    if (priority) {
      const validPriorities: PodPriority[] = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` });
      }
    }

    const updated = podQueue.updateIntervention(id, { status, priority, notes });

    if (!updated) {
      return res.status(404).json({ error: 'Intervention not found' });
    }

    return res.status(200).json({
      ok: true,
      intervention: {
        id: updated.id,
        type: updated.type,
        priority: updated.priority,
        status: updated.status,
        notes: updated.notes,
        resolvedAt: updated.resolvedAt?.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[PodQueueAPI] Update intervention error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
