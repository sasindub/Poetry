import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useGetSubmission } from "@workspace/api-client-react";

const fakeDetails: Record<number, any> = {
  1: {
    id: 1, referenceNumber: "AHA-2026-001", poetName: "Mohammed Al Mansoori", poetNameAr: "محمد المنصوري", poetEmail: "mohammed@example.com", poetPhone: "+971501234567", poetNationality: "UAE",
    poemTitle: "Desert Song", poemTitleAr: "أغنية الصحراء", poemType: "nabati", status: "approved",
    poemContent: "يا صحراء الوطن يا أرض الأجداد\nفي رمالك تاريخ وفي ترابك أمجاد\nبين نخيلك تسمع أصوات الأبطال\nوفي سمائك يسبح نسر الأحرار\n\nيا واحة الأمل في قلب الصحراء\nحيث يلتقي الماضي بنور المستقبل\nعلى ترابك المقدس تسير الأقدام\nونبض الوطن يدق في كل قلب",
    submittedAt: "2026-01-20T10:00:00Z", updatedAt: "2026-02-15T10:00:00Z",
    reviewerNotes: "Exceptional poem with perfect meter and profound imagery. Captures the spirit of the nation beautifully.",
    finalScore: 9.2, finalDecision: "Approved for National Heritage Collection",
    evaluations: [
      { id: 1, juryMemberId: 3, juryMemberName: "Prof. Ahmad Al Mazrouei", linguisticScore: 9.5, poeticScore: 9.2, originalityScore: 8.8, emotionalScore: 9.0, culturalScore: 9.5, totalScore: 9.2, recommendation: "approve", notes: "Masterful use of traditional Nabati forms. The rhythm and meter are flawless.", submittedAt: "2026-02-01T10:00:00Z" },
      { id: 2, juryMemberId: 4, juryMemberName: "Dr. Layla Al Suwaidi", linguisticScore: 9.0, poeticScore: 9.3, originalityScore: 9.1, emotionalScore: 8.9, culturalScore: 9.2, totalScore: 9.1, recommendation: "approve", notes: "Exceptional cultural authenticity and emotional depth. A true national poem.", submittedAt: "2026-02-03T10:00:00Z" },
    ],
  },
  5: {
    id: 5, referenceNumber: "AHA-2026-005", poetName: "Omar Al Shamsi", poetNameAr: "عمر الشمسي", poetEmail: "omar@example.com", poetPhone: "+971505678901", poetNationality: "UAE",
    poemTitle: "The Brave Falcon", poemTitleAr: "الصقر الشجاع", poemType: "nabati", status: "approved",
    poemContent: "يا صقر الجنوب يا ملك الجو العالي\nطائر بجناحيك فوق كل الجبال\nحلقاتك تملأ القلب بالإعجاب\nوعيناك تنظران بعيداً في الضباب\n\nيا رمز الحرية يا فخر الأجداد\nفي سمائنا تطير بكبرياء واقتدار\nمن يراك يعرف قوة هذا الوطن\nومن يسمع صوتك يشعر بالانتصار",
    submittedAt: "2026-01-10T10:00:00Z", updatedAt: "2026-01-30T10:00:00Z",
    reviewerNotes: "Outstanding Nabati poetry with authentic traditional style.",
    finalScore: 9.5, finalDecision: "Awarded Gold Medal — National Poets Competition 2026",
    evaluations: [
      { id: 5, juryMemberId: 3, juryMemberName: "Prof. Ahmad Al Mazrouei", linguisticScore: 9.8, poeticScore: 9.5, originalityScore: 9.3, emotionalScore: 9.6, culturalScore: 9.5, totalScore: 9.54, recommendation: "approve", notes: "Outstanding! Best Nabati poem submitted this cycle.", submittedAt: "2026-01-20T10:00:00Z" },
    ],
  },
};

const statusColors: Record<string, string> = {
  approved: "bg-green-500/15 text-green-400",
  rejected: "bg-red-500/15 text-red-400",
  pending: "bg-amber-500/15 text-amber-400",
  under_review: "bg-blue-500/15 text-blue-400",
  jury_assigned: "bg-purple-500/15 text-purple-400",
  evaluated: "bg-teal-500/15 text-teal-400",
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-foreground/40 w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-border/50 rounded-full h-1.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full gold-gradient rounded-full"
        />
      </div>
      <span className="text-xs text-gold font-semibold w-8 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

export default function SubmissionDetail() {
  const { t, lang } = useLanguage();
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0", 10);
  const { data } = useGetSubmission(id);

  const submission = data || fakeDetails[id] || fakeDetails[1];

  if (!submission) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-foreground/40">
          Submission not found.
          <Link href="/dashboard/submissions" className="block mt-4 text-gold hover:underline text-sm">
            Back to submissions
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const recommendationColors: Record<string, string> = {
    approve: "text-green-400",
    reject: "text-red-400",
    needs_revision: "text-amber-400",
  };

  return (
    <DashboardLayout>
      {/* Back */}
      <Link href="/dashboard/submissions" className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-gold mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        Back to Submissions
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left - main info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-xl p-6 border border-gold/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-mono text-foreground/40 mb-1">{submission.referenceNumber}</div>
                <h1 className="text-2xl font-display font-bold">{lang === "ar" && submission.poemTitleAr ? submission.poemTitleAr : submission.poemTitle}</h1>
                {submission.poemTitleAr && lang !== "ar" && (
                  <p className="text-gold/60 font-arabic text-lg mt-1" dir="rtl">{submission.poemTitleAr}</p>
                )}
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusColors[submission.status] || ""}`}>
                {t(submission.status) || submission.status}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-foreground/40 mb-0.5">Poet</p>
                <p className="font-medium">{lang === "ar" && submission.poetNameAr ? submission.poetNameAr : submission.poetName}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/40 mb-0.5">Nationality</p>
                <p className="font-medium">{submission.poetNationality}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/40 mb-0.5">Type</p>
                <p className="font-medium capitalize">{submission.poemType}</p>
              </div>
            </div>
          </motion.div>

          {/* Poem content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-xl p-6 border border-gold/10"
          >
            <h3 className="text-sm font-semibold text-foreground/60 mb-4 uppercase tracking-wider">Poem Text</h3>
            <div
              className="font-arabic text-xl leading-loose text-foreground/90 whitespace-pre-line text-right"
              dir="rtl"
            >
              {submission.poemContent}
            </div>
          </motion.div>

          {/* Evaluations */}
          {submission.evaluations?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-xl p-6 border border-gold/10"
            >
              <h3 className="text-sm font-semibold text-foreground/60 mb-4 uppercase tracking-wider">{t("evaluations")}</h3>
              <div className="space-y-6">
                {submission.evaluations.map((ev: any) => (
                  <div key={ev.id} className="border border-border/50 rounded-xl p-5 bg-background/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-navy font-bold text-sm">
                          {ev.juryMemberName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{ev.juryMemberName}</p>
                          <p className="text-xs text-foreground/40">Jury Member</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-display font-bold gold-gradient-text">{ev.totalScore?.toFixed(1)}</div>
                        <div className={`text-xs font-medium capitalize ${recommendationColors[ev.recommendation] || ""}`}>{ev.recommendation?.replace("_", " ")}</div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <ScoreBar label={t("linguistic")} value={ev.linguisticScore} />
                      <ScoreBar label={t("poetic")} value={ev.poeticScore} />
                      <ScoreBar label={t("originality")} value={ev.originalityScore} />
                      <ScoreBar label={t("emotional")} value={ev.emotionalScore} />
                      <ScoreBar label={t("cultural")} value={ev.culturalScore} />
                    </div>
                    {ev.notes && (
                      <p className="text-sm text-foreground/60 italic border-t border-border/30 pt-3 mt-3">
                        "{ev.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Final score */}
          {submission.finalScore && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-xl p-6 border border-gold/20 text-center"
            >
              <div className="text-xs text-foreground/40 mb-2 uppercase tracking-wider">Final Score</div>
              <div className="text-5xl font-display font-bold gold-gradient-text mb-2">{submission.finalScore.toFixed(1)}</div>
              <div className="text-xs text-foreground/30">/ 10.0</div>
              {submission.finalDecision && (
                <div className="mt-4 text-xs text-foreground/60 italic border-t border-gold/10 pt-4">
                  {submission.finalDecision}
                </div>
              )}
            </motion.div>
          )}

          {/* Poet contact */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-xl p-5 border border-gold/10"
          >
            <h3 className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-3">Poet Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-foreground/60">
                <svg className="w-4 h-4 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                {submission.poetEmail}
              </div>
              {submission.poetPhone && (
                <div className="flex items-center gap-2 text-foreground/60">
                  <svg className="w-4 h-4 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  {submission.poetPhone}
                </div>
              )}
            </div>
          </motion.div>

          {/* Reviewer notes */}
          {submission.reviewerNotes && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-panel rounded-xl p-5 border border-gold/10"
            >
              <h3 className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-3">Reviewer Notes</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{submission.reviewerNotes}</p>
            </motion.div>
          )}

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-xl p-5 border border-gold/10"
          >
            <h3 className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-3">Timeline</h3>
            <div className="space-y-3">
              {[
                { label: "Submitted", date: submission.submittedAt, done: true },
                { label: "Under Review", date: null, done: ["under_review","jury_assigned","evaluated","approved","rejected"].includes(submission.status) },
                { label: "Jury Assigned", date: null, done: ["jury_assigned","evaluated","approved","rejected"].includes(submission.status) },
                { label: "Evaluated", date: null, done: ["evaluated","approved","rejected"].includes(submission.status) },
                { label: "Final Decision", date: null, done: ["approved","rejected"].includes(submission.status) },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${step.done ? "gold-gradient" : "border border-border"}`}>
                    {step.done && <svg className="w-3 h-3 text-navy" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${step.done ? "text-foreground" : "text-foreground/30"}`}>{step.label}</p>
                    {step.date && <p className="text-xs text-foreground/30">{new Date(step.date).toLocaleDateString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
