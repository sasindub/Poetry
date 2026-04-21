import { motion } from "framer-motion";
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

  function toggleMember(id: number) {
    setJury((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, active: !m.active, availability: !m.active ? "available" : "inactive" }
          : m
      )
    );
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
        <button className="px-4 py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 text-sm font-semibold">
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
    </DashboardLayout>
  );
}
