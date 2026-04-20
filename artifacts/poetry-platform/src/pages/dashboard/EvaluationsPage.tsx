import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useListEvaluations } from "@workspace/api-client-react";

const fakeEvaluations = [
  { id: 1, submissionId: 1, referenceNumber: "AHA-2026-001", poemTitle: "Desert Song", poetName: "Mohammed Al Mansoori", juryMemberName: "Prof. Ahmad Al Mazrouei", linguisticScore: 9.5, poeticScore: 9.2, originalityScore: 8.8, emotionalScore: 9.0, culturalScore: 9.5, totalScore: 9.2, recommendation: "approve", submittedAt: "2026-02-01T10:00:00Z" },
  { id: 2, submissionId: 1, referenceNumber: "AHA-2026-001", poemTitle: "Desert Song", poetName: "Mohammed Al Mansoori", juryMemberName: "Dr. Layla Al Suwaidi", linguisticScore: 9.0, poeticScore: 9.3, originalityScore: 9.1, emotionalScore: 8.9, culturalScore: 9.2, totalScore: 9.1, recommendation: "approve", submittedAt: "2026-02-03T10:00:00Z" },
  { id: 3, submissionId: 2, referenceNumber: "AHA-2026-002", poemTitle: "Voice of the Palm", poetName: "Fatima Al Hashimi", juryMemberName: "Dr. Hassan Al Khatib", linguisticScore: 8.8, poeticScore: 8.6, originalityScore: 8.5, emotionalScore: 8.7, culturalScore: 8.9, totalScore: 8.7, recommendation: "approve", submittedAt: "2026-02-05T10:00:00Z" },
  { id: 4, submissionId: 5, referenceNumber: "AHA-2026-005", poemTitle: "The Brave Falcon", poetName: "Omar Al Shamsi", juryMemberName: "Prof. Ahmad Al Mazrouei", linguisticScore: 9.8, poeticScore: 9.5, originalityScore: 9.3, emotionalScore: 9.6, culturalScore: 9.5, totalScore: 9.54, recommendation: "approve", submittedAt: "2026-01-20T10:00:00Z" },
  { id: 5, submissionId: 7, referenceNumber: "AHA-2026-007", poemTitle: "Mountains of Hejaz", poetName: "Rashid Al Ketbi", juryMemberName: "Dr. Layla Al Suwaidi", linguisticScore: 8.5, poeticScore: 8.3, originalityScore: 8.2, emotionalScore: 8.4, culturalScore: 8.1, totalScore: 8.3, recommendation: "approve", submittedAt: "2026-02-15T10:00:00Z" },
  { id: 6, submissionId: 9, referenceNumber: "AHA-2026-009", poemTitle: "The Brave Camel", poetName: "Yousef Al Hammadi", juryMemberName: "Dr. Hassan Al Khatib", linguisticScore: 4.5, poeticScore: 4.2, originalityScore: 3.8, emotionalScore: 4.0, culturalScore: 4.5, totalScore: 4.2, recommendation: "reject", submittedAt: "2026-02-20T10:00:00Z" },
];

const recColors: Record<string, string> = {
  approve: "bg-green-500/15 text-green-400 border border-green-500/20",
  reject: "bg-red-500/15 text-red-400 border border-red-500/20",
  needs_revision: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
};

function MiniScoreBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1 bg-border/50 rounded-full overflow-hidden">
        <div className="h-full gold-gradient rounded-full" style={{ width: `${(value / 10) * 100}%` }} />
      </div>
      <span className="text-xs text-gold font-semibold">{value.toFixed(1)}</span>
    </div>
  );
}

export default function EvaluationsPage() {
  const { t } = useLanguage();
  const { data } = useListEvaluations();
  const evaluations = data?.evaluations?.length ? data.evaluations : fakeEvaluations;

  const avgScore = evaluations.length
    ? (evaluations.reduce((a: number, e: any) => a + (e.totalScore || 0), 0) / evaluations.length).toFixed(2)
    : "—";

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t("evaluations")}</h1>
          <p className="text-foreground/40 text-sm mt-0.5">{evaluations.length} evaluations submitted</p>
        </div>
        <div className="glass-panel rounded-xl px-5 py-3 border border-gold/10 text-center">
          <p className="text-xs text-foreground/40">Average Score</p>
          <p className="text-2xl font-display font-bold gold-gradient-text">{avgScore}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl border border-gold/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                {[t("reference"), t("poem"), t("poet"), "Jury Member", t("linguistic"), t("poetic"), t("originality"), t("emotional"), t("cultural"), t("totalScore"), t("recommendation"), t("date")].map((h) => (
                  <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {evaluations.map((ev: any, i: number) => (
                <motion.tr
                  key={ev.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/2 transition-colors"
                >
                  <td className="px-3 py-3 font-mono text-xs text-foreground/50">{ev.referenceNumber}</td>
                  <td className="px-3 py-3 font-medium max-w-[120px] truncate">{ev.poemTitle}</td>
                  <td className="px-3 py-3 text-foreground/60 whitespace-nowrap">{ev.poetName}</td>
                  <td className="px-3 py-3 text-foreground/60 whitespace-nowrap">{ev.juryMemberName}</td>
                  <td className="px-3 py-3"><MiniScoreBar value={ev.linguisticScore} /></td>
                  <td className="px-3 py-3"><MiniScoreBar value={ev.poeticScore} /></td>
                  <td className="px-3 py-3"><MiniScoreBar value={ev.originalityScore} /></td>
                  <td className="px-3 py-3"><MiniScoreBar value={ev.emotionalScore} /></td>
                  <td className="px-3 py-3"><MiniScoreBar value={ev.culturalScore} /></td>
                  <td className="px-3 py-3">
                    <span className="text-gold font-bold text-base">{ev.totalScore?.toFixed(1)}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${recColors[ev.recommendation] || ""}`}>
                      {ev.recommendation?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-foreground/40 whitespace-nowrap">
                    {new Date(ev.submittedAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
