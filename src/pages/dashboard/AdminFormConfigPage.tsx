import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";

type FormType = "application_intake" | "jury_evaluation" | "final_executive_review";
type FieldRule = { id: string; label: string; visible: boolean; mandatory: boolean };

const formLabels: Record<FormType, string> = {
  application_intake: "Application Intake Form",
  jury_evaluation: "Jury Evaluation Form",
  final_executive_review: "Final Executive Review Form",
};

const defaultFields: Record<FormType, FieldRule[]> = {
  application_intake: [
    { id: "poet_name", label: "Poet Name", visible: true, mandatory: true },
    { id: "requester_name", label: "Requester Name", visible: true, mandatory: true },
    { id: "poem_title", label: "Poem Title", visible: true, mandatory: true },
    { id: "poem_type", label: "Poem Type", visible: true, mandatory: true },
    { id: "attachment", label: "Attachment", visible: true, mandatory: false },
  ],
  jury_evaluation: [
    { id: "decision", label: "Decision", visible: true, mandatory: true },
    { id: "comments", label: "Comments", visible: true, mandatory: true },
    { id: "recommendation", label: "Recommendation", visible: true, mandatory: true },
  ],
  final_executive_review: [
    { id: "reviewer_summary", label: "Reviewer Summary", visible: true, mandatory: true },
    { id: "final_decision", label: "Final Decision", visible: true, mandatory: true },
    { id: "decision_note", label: "Decision Note", visible: true, mandatory: false },
  ],
};

export default function AdminFormConfigPage() {
  const [selectedForm, setSelectedForm] = useState<FormType>("application_intake");
  const [rules, setRules] = useState<Record<FormType, FieldRule[]>>(defaultFields);

  const selectedRules = useMemo(() => rules[selectedForm], [rules, selectedForm]);

  function updateField(fieldId: string, key: "visible" | "mandatory", value: boolean) {
    setRules((prev) => ({
      ...prev,
      [selectedForm]: prev[selectedForm].map((f) => (f.id === fieldId ? { ...f, [key]: value } : f)),
    }));
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Form Config</h1>
        <p className="text-foreground/40 text-sm mt-0.5">
          Configure visibility and mandatory rules for all 3 BRD forms.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 p-4 mb-4">
        <label className="text-xs text-foreground/40 uppercase tracking-wider">Select Form</label>
        <select
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value as FormType)}
          className="mt-2 w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
        >
          {Object.entries(formLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 p-4">
          <h3 className="text-sm font-semibold mb-3">Field Rules</h3>
          <div className="space-y-2">
            {selectedRules.map((field) => (
              <div key={field.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{field.label}</p>
                  <span className="text-xs text-foreground/40 font-mono">{field.id}</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={field.visible} onChange={(e) => updateField(field.id, "visible", e.target.checked)} className="accent-gold" />
                    Visible
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={field.mandatory} onChange={(e) => updateField(field.id, "mandatory", e.target.checked)} className="accent-gold" />
                    Mandatory
                  </label>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 p-4">
          <h3 className="text-sm font-semibold mb-3">Preview</h3>
          <div className="rounded-lg border border-border p-3 space-y-2">
            {selectedRules.filter((f) => f.visible).map((field) => (
              <div key={field.id}>
                <label className="text-xs text-foreground/50">{field.label} {field.mandatory ? "*" : ""}</label>
                <div className="mt-1 rounded-md border border-border bg-background/40 px-3 py-2 text-xs text-foreground/40">
                  Sample field preview
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
