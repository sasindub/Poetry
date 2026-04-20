import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useListSubmissions } from "@workspace/api-client-react";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  under_review: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  jury_assigned: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  evaluated: "bg-teal-500/15 text-teal-400 border border-teal-500/20",
  approved: "bg-green-500/15 text-green-400 border border-green-500/20",
  rejected: "bg-red-500/15 text-red-400 border border-red-500/20",
  archived: "bg-gray-500/15 text-gray-400 border border-gray-500/20",
};

const typeColors: Record<string, string> = {
  nabati: "text-amber-400",
  classical: "text-teal-400",
  modern: "text-indigo-400",
};

const fakeSubmissions = [
  { id: 1, referenceNumber: "AHA-2026-001", poetName: "Mohammed Al Mansoori", poetNameAr: "محمد المنصوري", poetNationality: "UAE", poemTitle: "Desert Song", poemTitleAr: "أغنية الصحراء", poemType: "nabati", status: "approved", submittedAt: "2026-01-20T10:00:00Z", finalScore: 9.2 },
  { id: 2, referenceNumber: "AHA-2026-002", poetName: "Fatima Al Hashimi", poetNameAr: "فاطمة الهاشمي", poetNationality: "UAE", poemTitle: "Voice of the Palm", poemTitleAr: "صوت النخيل", poemType: "classical", status: "evaluated", submittedAt: "2026-01-30T10:00:00Z", finalScore: 8.7 },
  { id: 3, referenceNumber: "AHA-2026-003", poetName: "Khalid Al Rashidi", poetNameAr: "خالد الراشدي", poetNationality: "UAE", poemTitle: "Pearl of the Gulf", poemTitleAr: "لؤلؤة الخليج", poemType: "nabati", status: "jury_assigned", submittedAt: "2026-02-08T10:00:00Z", finalScore: null },
  { id: 4, referenceNumber: "AHA-2026-004", poetName: "Aisha Al Marzouqi", poetNameAr: "عائشة المرزوقي", poetNationality: "UAE", poemTitle: "Sunset over Abu Dhabi", poemTitleAr: "غروب أبوظبي", poemType: "modern", status: "under_review", submittedAt: "2026-02-18T10:00:00Z", finalScore: null },
  { id: 5, referenceNumber: "AHA-2026-005", poetName: "Omar Al Shamsi", poetNameAr: "عمر الشمسي", poetNationality: "UAE", poemTitle: "The Brave Falcon", poemTitleAr: "الصقر الشجاع", poemType: "nabati", status: "approved", submittedAt: "2026-01-10T10:00:00Z", finalScore: 9.5 },
  { id: 6, referenceNumber: "AHA-2026-006", poetName: "Mariam Al Nuaimi", poetNameAr: "مريم النعيمي", poetNationality: "UAE", poemTitle: "Tears of the Moon", poemTitleAr: "دموع القمر", poemType: "modern", status: "pending", submittedAt: "2026-04-10T10:00:00Z", finalScore: null },
  { id: 7, referenceNumber: "AHA-2026-007", poetName: "Rashid Al Ketbi", poetNameAr: "راشد الكتبي", poetNationality: "Saudi Arabia", poemTitle: "Mountains of Hejaz", poemTitleAr: "جبال الحجاز", poemType: "classical", status: "evaluated", submittedAt: "2026-02-08T10:00:00Z", finalScore: 8.3 },
  { id: 8, referenceNumber: "AHA-2026-008", poetName: "Noura Al Dosari", poetNameAr: "نورة الدوسري", poetNationality: "Qatar", poemTitle: "Blue Waters", poemTitleAr: "المياه الزرقاء", poemType: "nabati", status: "pending", submittedAt: "2026-04-15T10:00:00Z", finalScore: null },
  { id: 9, referenceNumber: "AHA-2026-009", poetName: "Yousef Al Hammadi", poetNameAr: "يوسف الحمادي", poetNationality: "UAE", poemTitle: "The Brave Camel", poemTitleAr: "الجمل الشجاع", poemType: "nabati", status: "rejected", submittedAt: "2026-02-05T10:00:00Z", finalScore: 4.2 },
  { id: 10, referenceNumber: "AHA-2026-010", poetName: "Hessa Al Falasi", poetNameAr: "حصة الفلاسي", poetNationality: "UAE", poemTitle: "Whisper of the Wind", poemTitleAr: "همس الريح", poemType: "modern", status: "jury_assigned", submittedAt: "2026-02-25T10:00:00Z", finalScore: null },
  { id: 11, referenceNumber: "AHA-2026-011", poetName: "Abdullah Al Muhairi", poetNameAr: "عبدالله المهيري", poetNationality: "UAE", poemTitle: "Heritage of the Ancestors", poemTitleAr: "إرث الأجداد", poemType: "classical", status: "under_review", submittedAt: "2026-03-21T10:00:00Z", finalScore: null },
  { id: 12, referenceNumber: "AHA-2026-012", poetName: "Sheikha Al Qasimi", poetNameAr: "شيخة القاسمي", poetNationality: "UAE", poemTitle: "The Golden Dunes", poemTitleAr: "الكثبان الذهبية", poemType: "nabati", status: "approved", submittedAt: "2026-01-15T10:00:00Z", finalScore: 8.9 },
  { id: 13, referenceNumber: "AHA-2026-013", poetName: "Ibrahim Al Dhaheri", poetNameAr: "إبراهيم الظاهري", poetNationality: "UAE", poemTitle: "Song of the Sailors", poemTitleAr: "أغنية البحارة", poemType: "classical", status: "evaluated", submittedAt: "2026-02-05T10:00:00Z", finalScore: 7.8 },
  { id: 14, referenceNumber: "AHA-2026-014", poetName: "Maitha Al Suwaidi", poetNameAr: "ميثاء السويدي", poetNationality: "UAE", poemTitle: "The Last Bedouin", poemTitleAr: "آخر البدو", poemType: "modern", status: "pending", submittedAt: "2026-04-17T10:00:00Z", finalScore: null },
  { id: 15, referenceNumber: "AHA-2026-015", poetName: "Saeed Al Ameri", poetNameAr: "سعيد العامري", poetNationality: "UAE", poemTitle: "Spirit of the Nation", poemTitleAr: "روح الأمة", poemType: "nabati", status: "approved", submittedAt: "2026-01-22T10:00:00Z", finalScore: 9.1 },
];

const statuses = ["all", "pending", "under_review", "jury_assigned", "evaluated", "approved", "rejected"];

export default function SubmissionsPage() {
  const { t, lang } = useLanguage();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { data } = useListSubmissions({ status: statusFilter === "all" ? undefined : statusFilter as any });

  const submissions = (data?.submissions?.length ? data.submissions : fakeSubmissions) as typeof fakeSubmissions;

  const filtered = submissions.filter((s) => {
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchSearch = !search || s.poetName.toLowerCase().includes(search.toLowerCase()) || s.poemTitle.toLowerCase().includes(search.toLowerCase()) || s.referenceNumber.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t("submissions")}</h1>
          <p className="text-foreground/40 text-sm mt-0.5">{filtered.length} records found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-xl p-4 border border-gold/10 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-background/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold/50 transition-all"
          />
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  statusFilter === s
                    ? "gold-gradient text-navy"
                    : "border border-border text-foreground/50 hover:border-gold/30 hover:text-foreground"
                }`}
              >
                {s === "all" ? t("all") : t(s as any) || s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl border border-gold/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                {[t("reference"), t("poet"), t("poem"), t("type"), t("status"), t("date"), t("score"), ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((sub, i) => (
                <motion.tr
                  key={sub.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/2 transition-colors group"
                >
                  <td className="px-4 py-3 font-mono text-xs text-foreground/60">{sub.referenceNumber}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{lang === "ar" && sub.poetNameAr ? sub.poetNameAr : sub.poetName}</div>
                    <div className="text-xs text-foreground/40">{sub.poetNationality}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{lang === "ar" && sub.poemTitleAr ? sub.poemTitleAr : sub.poemTitle}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs capitalize ${typeColors[sub.poemType] || ""}`}>{sub.poemType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[sub.status] || ""}`}>
                      {t(sub.status as any) || sub.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/50 whitespace-nowrap">
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {sub.finalScore != null ? (
                      <span className="text-gold font-semibold">{sub.finalScore.toFixed(1)}</span>
                    ) : (
                      <span className="text-foreground/30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/submissions/${sub.id}`}>
                      <button className="opacity-0 group-hover:opacity-100 text-xs text-gold hover:underline transition-opacity whitespace-nowrap">
                        {t("viewDetails")}
                      </button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-foreground/30">No submissions found</div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
