import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";

type ReportDef = {
  id: string;
  name: string;
  description: string;
};

const REPORTS: ReportDef[] = [
  { id: "requests_by_channel", name: "Requests by Channel", description: "Distribution of requests by intake channel." },
  { id: "requests_by_type", name: "Requests by Type", description: "Distribution of requests by poem type." },
  { id: "requests_by_source", name: "Requests by Source", description: "Distribution of requests by request source." },
  { id: "jury_response_report", name: "Jury Response Report", description: "Jury response performance and completion status." },
  { id: "pending_jury_report", name: "Pending Jury Report", description: "Pending jury assignments and overdue responses." },
  { id: "final_decision_report", name: "Final Decision Report", description: "Approved, rejected, and returned-for-clarification outcomes." },
  { id: "reviewer_workload_report", name: "Reviewer Workload Report", description: "Reviewer assignment and processing workload summary." },
  { id: "turnaround_time_report", name: "Turnaround Time Report", description: "Lifecycle turnaround times from received to decision." },
  { id: "archive_report", name: "Archive Report", description: "Archived cases and closure information." },
];

function buildCsv(reportName: string): string {
  const rows = [
    ["Report", reportName],
    ["Generated At", new Date().toISOString()],
    [],
    ["Metric", "Value"],
    ["Sample A", "42"],
    ["Sample B", "17"],
    ["Sample C", "8"],
  ];
  return rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [exported, setExported] = useState<string | null>(null);

  function exportReport(report: ReportDef) {
    const csv = buildCsv(report.name);
    downloadCsv(`${report.id}.csv`, csv);
    setExported(report.name);
    setTimeout(() => setExported(null), 2200);
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Reports</h1>
      </div>

      {exported && (
        <div className="mb-4 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold">
          Export started: {exported}
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORTS.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="glass-panel rounded-xl border border-gold/10 p-5"
          >
            <h3 className="text-sm font-semibold mb-1">{report.name}</h3>
            <p className="text-xs text-foreground/45 mb-4">{report.description}</p>
            <button
              onClick={() => exportReport(report)}
              className="text-xs font-semibold text-gold border border-gold/30 hover:bg-gold/10 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
            >
              Export
            </button>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
