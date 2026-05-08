import { useState } from "react";
import { useQuery, useAction } from "wasp/client/operations";
import { createSequence, updateSequence, launchSequence } from "wasp/client/operations";
import { getSequences } from "wasp/client/operations";
import { Link } from "wasp/client/router";

type Channel = "EMAIL" | "LINKEDIN" | "VOICE";

interface StepDraft {
  idx: number;
  channel: Channel;
  waitDays: number;
  bodyTemplate: string;
}

const CHANNEL_CONFIG: Record<Channel, { label: string; icon: string; color: string }> = {
  EMAIL: {
    label: "Email",
    icon: "✉",
    color: "border-blue-400/30 bg-blue-400/5 text-blue-400",
  },
  LINKEDIN: {
    label: "LinkedIn",
    icon: "🔗",
    color: "border-sky-400/30 bg-sky-400/5 text-sky-400",
  },
  VOICE: {
    label: "Voice",
    icon: "📞",
    color: "border-phosphor/30 bg-phosphor/5 text-phosphor",
  },
};

const MAX_STEPS = 6;

export function SequenceBuilderPage() {
  const { data: sequences, isLoading, error } = useQuery(getSequences);
  const createSequenceFn = useAction(createSequence);
  const updateSequenceFn = useAction(updateSequence);
  const launchSequenceFn = useAction(launchSequence);

  const [name, setName] = useState("");
  const [steps, setSteps] = useState<StepDraft[]>([]);
  const [editingStepIdx, setEditingStepIdx] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  
  // Edit form state for step being edited
  const [editChannel, setEditChannel] = useState<Channel>("EMAIL");
  const [editWaitDays, setEditWaitDays] = useState(1);
  const [editBody, setEditBody] = useState("");

  const resetBuilder = () => {
    setName("");
    setSteps([]);
    setEditingStepIdx(null);
    setShowBuilder(false);
    setCreateError(null);
  };

  const addStep = () => {
    if (steps.length >= MAX_STEPS) return;
    const newStep: StepDraft = {
      idx: steps.length,
      channel: "EMAIL",
      waitDays: 1,
      bodyTemplate: "",
    };
    setSteps([...steps, newStep]);
    openStepEditor(steps.length);
  };

  const openStepEditor = (idx: number) => {
    const step = steps.find((s) => s.idx === idx);
    if (step) {
      setEditChannel(step.channel);
      setEditWaitDays(step.waitDays);
      setEditBody(step.bodyTemplate);
    } else {
      setEditChannel("EMAIL");
      setEditWaitDays(1);
      setEditBody("");
    }
    setEditingStepIdx(idx);
  };

  const saveStepEdit = () => {
    if (editingStepIdx === null) return;
    setSteps(
      steps.map((s) =>
        s.idx === editingStepIdx
          ? { ...s, channel: editChannel, waitDays: editWaitDays, bodyTemplate: editBody }
          : s
      )
    );
    setEditingStepIdx(null);
  };

  const removeStep = (idx: number) => {
    if (editingStepIdx === idx) setEditingStepIdx(null);
    setSteps(
      steps
        .filter((s) => s.idx !== idx)
        .map((s, i) => ({ ...s, idx: i }))
    );
  };

  const moveStep = (idx: number, direction: "up" | "down") => {
    const newSteps = [...steps];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newSteps.length) return;
    [newSteps[idx], newSteps[targetIdx]] = [newSteps[targetIdx], newSteps[idx]];
    setSteps(newSteps.map((s, i) => ({ ...s, idx: i })));
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setCreateError("Sequence name is required");
      return;
    }
    if (steps.length === 0) {
      setCreateError("Add at least one step");
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      await createSequenceFn({
        name: name.trim(),
        steps: steps.map((s) => ({
          idx: s.idx,
          channel: s.channel,
          waitDays: s.waitDays,
          bodyTemplate: s.bodyTemplate,
        })),
      });
      resetBuilder();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create sequence");
    } finally {
      setIsCreating(false);
    }
  };

  const handleLaunch = async (sequenceId: string) => {
    try {
      await launchSequenceFn({ id: sequenceId });
    } catch (err: any) {
      console.error("Launch error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-mono text-xs uppercase tracking-wider text-slate">
          Loading sequences…
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-bone">Sequence Builder</h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-slate">
            6-step · multi-channel · email + LinkedIn + voice
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/sequences" className="btn-ghost text-xs">
            ← Back to Sequences
          </Link>
          {!showBuilder && (
            <button
              onClick={() => setShowBuilder(true)}
              className="btn-primary text-xs"
            >
              New Sequence
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4">
          <span className="font-mono text-xs text-red-600">
            Error: {error.message}
          </span>
        </div>
      )}

      {/* Builder Panel */}
      {showBuilder && (
        <div className="mb-8 border border-hairline bg-steel p-6">
          <div className="mb-6">
            <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-slate">
              Sequence Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Enterprise Outreach Q1"
              className="w-full border border-hairline bg-plate px-4 py-2 font-mono text-sm text-bone placeholder:text-slate focus:border-signal focus:outline-none"
              disabled={isCreating}
            />
          </div>

          {/* Step List */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-slate">
                Steps ({steps.length}/{MAX_STEPS})
              </span>
              {steps.length < MAX_STEPS && (
                <button
                  onClick={addStep}
                  className="btn-ghost text-xs"
                  disabled={isCreating}
                >
                  + Add Step
                </button>
              )}
            </div>

            {steps.length === 0 ? (
              <div className="border border-hairline bg-plate p-6 text-center">
                <p className="font-mono text-sm text-slate">
                  No steps yet. Add up to {MAX_STEPS} steps across email, LinkedIn, and voice.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {steps.map((step, i) => (
                  <div
                    key={step.idx}
                    className={`border bg-plate p-4 ${
                      editingStepIdx === step.idx
                        ? "border-signal shadow-sm"
                        : "border-hairline"
                    }`}
                  >
                    {editingStepIdx === step.idx ? (
                      /* Step Editor */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <label className="mb-1 block font-mono text-xs text-slate">
                              Channel
                            </label>
                            <select
                              value={editChannel}
                              onChange={(e) =>
                                setEditChannel(e.target.value as Channel)
                              }
                              className="w-full border border-hairline bg-steel px-3 py-1.5 font-mono text-sm text-bone focus:border-signal focus:outline-none"
                            >
                              <option value="EMAIL">✉ Email</option>
                              <option value="LINKEDIN">🔗 LinkedIn</option>
                              <option value="VOICE">📞 Voice</option>
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block font-mono text-xs text-slate">
                              Wait (days)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={90}
                              value={editWaitDays}
                              onChange={(e) =>
                                setEditWaitDays(parseInt(e.target.value) || 0)
                              }
                              className="w-full border border-hairline bg-steel px-3 py-1.5 font-mono text-sm text-bone focus:border-signal focus:outline-none"
                            />
                          </div>
                          <div className="flex items-end justify-end gap-2">
                            <button
                              onClick={saveStepEdit}
                              className="btn-primary text-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingStepIdx(null)}
                              className="btn-ghost text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block font-mono text-xs text-slate">
                            {editChannel === "VOICE"
                              ? "Voice Script"
                              : "Message Template"}
                          </label>
                          <textarea
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                            placeholder={
                              editChannel === "EMAIL"
                                ? "Hi {{firstName}},\n\nI noticed your team at {{company}}..."
                                : editChannel === "VOICE"
                                  ? "Hello {{firstName}}, this is {{senderName}} from Saltrun. I'm calling about..."
                                  : "Hi {{firstName}}, I came across your profile and thought we should connect..."
                            }
                            rows={4}
                            className="w-full border border-hairline bg-steel px-3 py-2 font-mono text-sm text-bone placeholder:text-slate focus:border-signal focus:outline-none resize-y"
                          />
                          <p className="mt-1 font-mono text-xs text-slate">
                            Use {"{{variable}}"} for personalization.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Step Display */
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center border font-mono text-xs font-bold ${
                              CHANNEL_CONFIG[step.channel].color
                            }`}
                          >
                            {step.idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block border px-2 py-0.5 font-mono text-xs ${CHANNEL_CONFIG[step.channel].color}`}
                              >
                                {CHANNEL_CONFIG[step.channel].icon}{" "}
                                {CHANNEL_CONFIG[step.channel].label}
                              </span>
                              <span className="font-mono text-xs text-slate">
                                Wait {step.waitDays}d
                              </span>
                            </div>
                            {step.bodyTemplate && (
                              <p className="mt-1 font-mono text-xs text-slate line-clamp-2">
                                {step.bodyTemplate.slice(0, 120)}
                                {step.bodyTemplate.length > 120 && "…"}
                              </p>
                            )}
                            {!step.bodyTemplate && (
                              <p className="mt-1 font-mono text-xs italic text-slate/60">
                                No message template set
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-1">
                          <button
                            onClick={() => moveStep(i, "up")}
                            disabled={i === 0}
                            className="px-1.5 py-0.5 font-mono text-xs text-slate hover:text-bone disabled:opacity-30"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveStep(i, "down")}
                            disabled={i === steps.length - 1}
                            className="px-1.5 py-0.5 font-mono text-xs text-slate hover:text-bone disabled:opacity-30"
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => openStepEditor(step.idx)}
                            className="px-2 py-0.5 font-mono text-xs text-slate hover:text-bone"
                            title="Edit step"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => removeStep(step.idx)}
                            className="px-2 py-0.5 font-mono text-xs text-red-500/70 hover:text-red-500"
                            title="Remove step"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Channel Summary */}
          {steps.length > 0 && (
            <div className="mb-6 flex gap-3">
              {(["EMAIL", "LINKEDIN", "VOICE"] as Channel[]).map((ch) => {
                const count = steps.filter((s) => s.channel === ch).length;
                if (count === 0) return null;
                return (
                  <div
                    key={ch}
                    className={`border px-3 py-2 font-mono text-xs ${CHANNEL_CONFIG[ch].color}`}
                  >
                    {CHANNEL_CONFIG[ch].icon} {count}x {CHANNEL_CONFIG[ch].label}
                  </div>
                );
              })}
            </div>
          )}

          {/* Errors */}
          {createError && (
            <div className="mb-4 border border-red-200 bg-red-50 p-3">
              <span className="font-mono text-xs text-red-600">
                {createError}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-hairline pt-4">
            <button
              onClick={resetBuilder}
              className="btn-ghost text-xs"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="btn-primary text-xs"
              disabled={isCreating || steps.length === 0 || !name.trim()}
            >
              {isCreating ? "Creating…" : "Create Sequence"}
            </button>
          </div>
        </div>
      )}

      {/* Existing Sequences */}
      <div>
        <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-wider text-bone">
          Your Sequences
        </h2>

        {!sequences || sequences.length === 0 ? (
          <div className="border border-hairline bg-plate p-8 text-center">
            <p className="font-mono text-sm text-slate">
              No sequences yet. Create your first multi-channel sequence above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sequences.map((seq: any) => {
              const stepChannels = (seq.steps || []).map((s: any) => s.channel);
              const emailCount = stepChannels.filter((c: string) => c === "EMAIL").length;
              const liCount = stepChannels.filter((c: string) => c === "LINKEDIN").length;
              const voiceCount = stepChannels.filter((c: string) => c === "VOICE").length;

              return (
                <div key={seq.id} className="card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono text-lg font-bold text-bone">
                        {seq.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-xs text-slate">
                          v{seq.version} · {seq.steps?.length ?? 0} steps
                        </span>
                        {emailCount > 0 && (
                          <span className="border border-blue-400/20 px-1.5 py-0.5 font-mono text-xs text-blue-400">
                            ✉ {emailCount}
                          </span>
                        )}
                        {liCount > 0 && (
                          <span className="border border-sky-400/20 px-1.5 py-0.5 font-mono text-xs text-sky-400">
                            🔗 {liCount}
                          </span>
                        )}
                        {voiceCount > 0 && (
                          <span className="border border-phosphor/20 px-1.5 py-0.5 font-mono text-xs text-phosphor">
                            📞 {voiceCount}
                          </span>
                        )}
                      </div>
                      {/* Step preview */}
                      {seq.steps && seq.steps.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {seq.steps.map((step: any, i: number) => (
                            <div
                              key={step.id || i}
                              className={`border px-2 py-0.5 font-mono text-xs ${
                                CHANNEL_CONFIG[step.channel as Channel]?.color ??
                                "border-hairline bg-plate text-slate"
                              }`}
                            >
                              {i + 1}. {step.channel}{" "}
                              {step.waitDays > 0 && `(${step.waitDays}d)`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <SequenceStatusBadge status={seq.status} />
                      {seq.status === "DRAFT" && (
                        <button
                          onClick={() => handleLaunch(seq.id)}
                          className="btn-primary text-xs"
                        >
                          Launch
                        </button>
                      )}
                      {seq.status === "ACTIVE" && (
                        <span className="font-mono text-xs text-phosphor/60">
                          Running
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SequenceStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-phosphor/10 text-phosphor border-phosphor/20",
    DRAFT: "bg-plate text-slate border-hairline",
    PAUSED: "bg-amber/10 text-amber border-amber/20",
  };

  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-xs ${
        colors[status] ?? colors.DRAFT
      }`}
    >
      {status}
    </span>
  );
}
