import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

type JuryMember = {
  id: number;
  name: string;
  email: string;
  availability: "available" | "busy" | "inactive";
  responseRate: number;
  active: boolean;
};

const initialJury: JuryMember[] = [
  { id: 1, name: "Dr. Khalid Al Mansoori", email: "khalid@aha.gov.ae", availability: "available", responseRate: 94, active: true },
  { id: 2, name: "Prof. Fatima Al Hashimi", email: "fatima@aha.gov.ae", availability: "available", responseRate: 88, active: true },
  { id: 3, name: "Dr. Ahmed Al Nuaimi", email: "ahmed@aha.gov.ae", availability: "busy", responseRate: 76, active: true },
  { id: 4, name: "Dr. Mariam Al Suwaidi", email: "mariam@aha.gov.ae", availability: "available", responseRate: 91, active: true },
  { id: 5, name: "Prof. Salem Al Dhaheri", email: "salem@aha.gov.ae", availability: "inactive", responseRate: 60, active: false },
];

export default function JuryPage() {
  const [jury, setJury] = useState<JuryMember[]>(initialJury);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", availability: "available" as JuryMember["availability"] });

  function toggleMember(id: number) {
    setJury((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, active: !m.active, availability: !m.active ? "available" : "inactive" }
          : m
      )
    );
  }

  function addJuryMember() {
    if (!form.name.trim() || !form.email.trim()) return;
    setJury((prev) => [
      {
        id: Date.now(),
        name: form.name.trim(),
        email: form.email.trim(),
        availability: form.availability,
        responseRate: 0,
        active: form.availability !== "inactive",
      },
      ...prev,
    ]);
    setForm({ name: "", email: "", availability: "available" });
    setCreateOpen(false);
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Jury Pool</h1>
          <p className="text-foreground/40 text-sm mt-0.5">
            Manage pre-registered jury members, availability, and response rate.
          </p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="px-4 py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 text-sm font-semibold">
          + Add jury member
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {["Name", "Email", "Availability", "Response rate", "Action"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {jury.map((member) => (
              <tr key={member.id} className="hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 font-medium">{member.name}</td>
                <td className="px-4 py-3 text-foreground/60">{member.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      member.availability === "available"
                        ? "bg-green-500/15 text-green-400"
                        : member.availability === "busy"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {member.availability === "available" ? "Available" : member.availability === "busy" ? "Busy" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">{member.responseRate}%</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleMember(member.id)}
                    className="text-xs font-semibold text-gold border border-gold/30 hover:bg-gold/10 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                  >
                    {member.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <AnimatePresence>
        {createOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCreateOpen(false)}
            className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 16, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-2xl border border-gold/30 w-full max-w-xl bg-card p-6"
            >
              <h3 className="text-lg font-display font-bold mb-1">Add Jury Member</h3>
              <p className="text-sm text-foreground/50 mb-5">Register a pre-approved jury member in the pool.</p>
              <div className="space-y-3">
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Full name"
                  className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
                />
                <input
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="Email"
                  className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
                />
                <select
                  value={form.availability}
                  onChange={(e) => setForm((p) => ({ ...p, availability: e.target.value as JuryMember["availability"] }))}
                  className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setCreateOpen(false)} className="flex-1 py-2.5 rounded-lg border border-border text-foreground/60 hover:border-gold/20">
                  Cancel
                </button>
                <button onClick={addJuryMember} className="flex-1 py-2.5 rounded-lg gold-gradient text-navy font-semibold">
                  Add Member
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
