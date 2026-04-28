import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";

type LogEntry = {
  id: number;
  at: string;
  user: string;
  actionType: "create" | "update" | "status_change" | "config_change" | "export";
  details: string;
};

const logs: LogEntry[] = [
  { id: 1, at: "2026-04-18T09:10:00Z", user: "Abdullah Al Mansoori", actionType: "config_change", details: "Updated jury deadline to 48 hours" },
  { id: 2, at: "2026-04-18T09:22:00Z", user: "Fatima Al Rashidi", actionType: "status_change", details: "Moved AHA-2026-015 to Final Form" },
  { id: 3, at: "2026-04-18T10:05:00Z", user: "Dr. Sultan Al Mansoori", actionType: "status_change", details: "Approved AHA-2026-005" },
  { id: 4, at: "2026-04-18T11:40:00Z", user: "Noor Al Ketbi", actionType: "export", details: "Exported monthly audit report" },
  { id: 5, at: "2026-04-19T08:12:00Z", user: "Abdullah Al Mansoori", actionType: "create", details: "Created role: External Reviewer" },
];

export default function AdminAuditLogPage() {
  const [userFilter, setUserFilter] = useState("");
  const [actionFilter, setActionFilter] = useState<LogEntry["actionType"] | "all">("all");

  const filtered = useMemo(
    () =>
      logs.filter((log) => {
        const byUser = !userFilter || log.user.toLowerCase().includes(userFilter.toLowerCase());
        const byAction = actionFilter === "all" || log.actionType === actionFilter;
        return byUser && byAction;
      }),
    [userFilter, actionFilter]
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold">Audit Log</h1>
          <p className="text-foreground/40 text-sm mt-0.5">
            Immutable read-only activity log. No edit/delete operations are allowed.
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 text-sm font-semibold">
          Export
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 p-4 mb-4">
        <div className="grid md:grid-cols-2 gap-3">
          <input
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            placeholder="Filter by user"
            className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
          />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as LogEntry["actionType"] | "all")}
            className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
          >
            <option value="all">All action types</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="status_change">Status Change</option>
            <option value="config_change">Config Change</option>
            <option value="export">Export</option>
          </select>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {["Time", "User", "Action Type", "Details"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filtered.map((entry) => (
              <tr key={entry.id} className="hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 text-xs text-foreground/50 whitespace-nowrap">{new Date(entry.at).toLocaleString()}</td>
                <td className="px-4 py-3 font-medium">{entry.user}</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20">
                    {entry.actionType}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground/70">{entry.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </DashboardLayout>
  );
}
