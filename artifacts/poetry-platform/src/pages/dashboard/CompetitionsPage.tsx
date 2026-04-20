import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useListCompetitions } from "@workspace/api-client-react";

const fakeCompetitions = [
  {
    id: 1,
    name: "National Nabati Poetry Festival 2026",
    nameAr: "مهرجان الشعر النبطي الوطني 2026",
    description: "Celebrating Nabati poetry tradition across the UAE and Gulf region",
    poemType: "nabati",
    status: "active",
    registrationDeadline: "2026-06-01T00:00:00Z",
    submissionDeadline: "2026-06-30T00:00:00Z",
    resultsDate: "2026-09-01T00:00:00Z",
    prizePools: "500,000 AED",
    totalSubmissions: 112,
    judges: 4,
    maxSubmissions: 300,
  },
  {
    id: 2,
    name: "Classical Arabic Poetry Award 2026",
    nameAr: "جائزة الشعر الفصيح 2026",
    description: "Honoring excellence in classical Arabic poetry following traditional meters and prosody",
    poemType: "classical",
    status: "active",
    registrationDeadline: "2026-07-15T00:00:00Z",
    submissionDeadline: "2026-08-15T00:00:00Z",
    resultsDate: "2026-10-01T00:00:00Z",
    prizePools: "350,000 AED",
    totalSubmissions: 78,
    judges: 3,
    maxSubmissions: 200,
  },
  {
    id: 3,
    name: "Young Poets Vanguard 2026",
    nameAr: "طلائع الشعراء الشباب 2026",
    description: "Platform for emerging poets under 35 to showcase modern and free verse poetry",
    poemType: "modern",
    status: "upcoming",
    registrationDeadline: "2026-09-01T00:00:00Z",
    submissionDeadline: "2026-10-01T00:00:00Z",
    resultsDate: "2026-12-15T00:00:00Z",
    prizePools: "250,000 AED",
    totalSubmissions: 0,
    judges: 3,
    maxSubmissions: 150,
  },
];

const statusColors: Record<string, string> = {
  active: "bg-green-500/15 text-green-400 border border-green-500/20",
  upcoming: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  closed: "bg-gray-500/15 text-gray-400 border border-gray-500/20",
  completed: "bg-teal-500/15 text-teal-400 border border-teal-500/20",
};

const typeColors: Record<string, string> = {
  nabati: "text-amber-400",
  classical: "text-teal-400",
  modern: "text-indigo-400",
};

export default function CompetitionsPage() {
  const { t, lang } = useLanguage();
  const { data } = useListCompetitions();
  const competitions = data?.competitions?.length ? data.competitions : fakeCompetitions;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t("competitions")}</h1>
          <p className="text-foreground/40 text-sm mt-0.5">{competitions.length} competitions configured</p>
        </div>
        <button className="px-4 py-2 rounded-lg gold-gradient text-navy text-sm font-semibold hover:opacity-90 transition-all">
          + New Competition
        </button>
      </div>

      <div className="space-y-4">
        {competitions.map((comp: any, i: number) => {
          const progress = comp.maxSubmissions > 0 ? Math.round((comp.totalSubmissions / comp.maxSubmissions) * 100) : 0;
          return (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-xl p-6 border border-gold/10 hover:border-gold/20 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[comp.status] || ""}`}>
                      {comp.status}
                    </span>
                    <span className={`text-xs capitalize font-medium ${typeColors[comp.poemType] || ""}`}>
                      {comp.poemType}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-0.5">
                    {lang === "ar" && comp.nameAr ? comp.nameAr : comp.name}
                  </h3>
                  <p className="text-sm text-foreground/50 mb-4">{comp.description}</p>

                  {/* Key dates */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { label: "Registration Deadline", date: comp.registrationDeadline },
                      { label: "Submission Deadline", date: comp.submissionDeadline },
                      { label: "Results Date", date: comp.resultsDate },
                    ].map((d) => (
                      <div key={d.label}>
                        <p className="text-xs text-foreground/30 mb-0.5">{d.label}</p>
                        <p className="text-sm font-medium">{new Date(d.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-foreground/40">Submissions Progress</span>
                      <span className="text-gold">{comp.totalSubmissions} / {comp.maxSubmissions}</span>
                    </div>
                    <div className="h-1.5 bg-border/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full gold-gradient rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats sidebar */}
                <div className="md:w-40 flex md:flex-col gap-3">
                  {[
                    { label: "Prize Pool", value: comp.prizePools },
                    { label: "Jury Members", value: comp.judges },
                    { label: "Progress", value: `${progress}%` },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-background/40 rounded-lg p-3 text-center flex-1 md:flex-none">
                      <p className="text-xs text-foreground/40 mb-1">{stat.label}</p>
                      <p className="text-sm font-semibold gold-gradient-text">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
