import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useListJuryMembers } from "@workspace/api-client-react";

const fakeJury = [
  { id: 1, name: "Prof. Ahmad Al Mazrouei", nameAr: "أ.د. أحمد المزروعي", email: "jury@aha.ae", specialization: "Nabati Poetry & Classical Arabic", specializations: ["Nabati Poetry", "Classical Arabic", "Arabic Prosody"], assignedSubmissions: 38, completedEvaluations: 32 },
  { id: 2, name: "Dr. Layla Al Suwaidi", nameAr: "د. ليلى السويدي", email: "jury2@aha.ae", specialization: "Literary Criticism & Poetry Analysis", specializations: ["Literary Criticism", "Modern Arabic Poetry", "Cultural Heritage"], assignedSubmissions: 35, completedEvaluations: 29 },
  { id: 3, name: "Dr. Hassan Al Khatib", nameAr: "د. حسن الخطيب", email: "jury3@aha.ae", specialization: "Classical Arabic Prosody", specializations: ["Classical Prosody", "Arabic Meter", "Historical Poetry"], assignedSubmissions: 30, completedEvaluations: 27 },
  { id: 4, name: "Dr. Noora Al Dhaheri", nameAr: "د. نورة الظاهري", email: "jury4@aha.ae", specialization: "Heritage Poetry & Folk Literature", specializations: ["Heritage Poetry", "Folk Literature", "Oral Traditions"], assignedSubmissions: 28, completedEvaluations: 24 },
  { id: 5, name: "Prof. Khalid Al Hamoud", nameAr: "أ.د. خالد الحمود", email: "jury5@aha.ae", specialization: "Modern Poetry & Comparative Literature", specializations: ["Modern Poetry", "Comparative Literature", "Arabic Poetics"], assignedSubmissions: 32, completedEvaluations: 30 },
];

export default function JuryPage() {
  const { t, lang } = useLanguage();
  const { data } = useListJuryMembers();
  const jury = data?.juryMembers?.length ? data.juryMembers : fakeJury;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">{t("juryPanel")}</h1>
        <p className="text-foreground/40 text-sm mt-0.5">{jury.length} distinguished jury members</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {jury.map((member: any, i: number) => {
          const completionRate = member.assignedSubmissions > 0
            ? Math.round((member.completedEvaluations / member.assignedSubmissions) * 100)
            : 0;
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="glass-panel rounded-xl p-6 border border-gold/10 hover:border-gold/25 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center text-navy text-xl font-bold font-display flex-shrink-0 shadow-lg shadow-gold/20">
                  {member.name?.split(" ")[1]?.charAt(0) || "J"}
                </div>
                <div>
                  <h3 className="font-display font-semibold">
                    {lang === "ar" && member.nameAr ? member.nameAr : member.name}
                  </h3>
                  <p className="text-xs text-foreground/40 mt-0.5">{member.email}</p>
                </div>
              </div>

              <p className="text-xs text-foreground/50 mb-3 leading-relaxed">{member.specialization}</p>

              {/* Specialization tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {member.specializations?.slice(0, 2).map((spec: string) => (
                  <span key={spec} className="px-2 py-0.5 text-xs rounded-full bg-gold/10 text-gold/70 border border-gold/10">
                    {spec}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-center">
                <div className="bg-background/40 rounded-lg p-2.5">
                  <p className="text-xl font-display font-bold gold-gradient-text">{member.assignedSubmissions}</p>
                  <p className="text-xs text-foreground/40">{t("assigned")}</p>
                </div>
                <div className="bg-background/40 rounded-lg p-2.5">
                  <p className="text-xl font-display font-bold gold-gradient-text">{member.completedEvaluations}</p>
                  <p className="text-xs text-foreground/40">{t("completed")}</p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-foreground/40">{t("completionRate")}</span>
                  <span className="text-xs text-gold font-semibold">{completionRate}%</span>
                </div>
                <div className="h-1.5 bg-border/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full gold-gradient rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
