import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";

const stages = [
  "Received",
  "Review",
  "Jury Form",
  "Assign",
  "Jury",
  "Monitor",
  "Consolidation",
  "Final Form",
  "Decision",
  "Notify",
];

export default function AdminWorkflowConfigPage() {
  const [juryDeadlineHours, setJuryDeadlineHours] = useState(48);
  const [duplicateDetection, setDuplicateDetection] = useState(true);
  const [enabledStages, setEnabledStages] = useState<Record<string, boolean>>(
    Object.fromEntries(stages.map((s) => [s, true]))
  );

  function toggleStage(stage: string) {
    setEnabledStages((prev) => ({ ...prev, [stage]: !prev[stage] }));
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Workflow Config</h1>
        <p className="text-foreground/40 text-sm mt-0.5">
          Configure jury deadline, stage toggles, and duplicate detection controls.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 p-5 mb-4">
        <h3 className="text-sm font-semibold mb-3">Global Workflow Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border p-3">
            <label className="text-xs text-foreground/40 uppercase tracking-wider">Jury Deadline (hours)</label>
            <input
              type="number"
              min={1}
              value={juryDeadlineHours}
              onChange={(e) => setJuryDeadlineHours(Number(e.target.value || 48))}
              className="mt-2 w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
            />
          </div>
          <div className="rounded-lg border border-border p-3">
            <label className="text-xs text-foreground/40 uppercase tracking-wider">Duplicate Detection</label>
            <button
              onClick={() => setDuplicateDetection((v) => !v)}
              className={`mt-2 w-full px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                duplicateDetection ? "border-green-500/30 text-green-400 bg-green-500/10" : "border-border text-foreground/60"
              }`}
            >
              {duplicateDetection ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 p-5">
        <h3 className="text-sm font-semibold mb-3">Stage Enable/Disable</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stages.map((stage) => (
            <label key={stage} className="rounded-lg border border-border p-3 flex items-center justify-between">
              <span className="text-sm">{stage}</span>
              <input type="checkbox" checked={enabledStages[stage]} onChange={() => toggleStage(stage)} className="accent-gold" />
            </label>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
