import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getAuthUser, canSeeIdentity, isReadOnly } from "@/lib/auth";

const statusColors: Record<string, string> = {
  draft: "bg-slate-500/15 text-slate-400 border border-slate-500/20",
  received: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
  pending: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  under_review: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  pending_information: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  ready_for_jury: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
  sent_to_jury: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  jury_assigned: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  under_jury_review: "bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/20",
  evaluated: "bg-teal-500/15 text-teal-400 border border-teal-500/20",
  jury_review_closed: "bg-teal-500/15 text-teal-400 border border-teal-500/20",
  under_consolidation: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  sent_for_final_decision: "bg-amber-600/15 text-amber-300 border border-amber-600/20",
  approved: "bg-green-500/15 text-green-400 border border-green-500/20",
  rejected: "bg-red-500/15 text-red-400 border border-red-500/20",
  returned_for_clarification: "bg-orange-600/15 text-orange-300 border border-orange-600/20",
  archived: "bg-gray-500/15 text-gray-400 border border-gray-500/20",
};

const typeColors: Record<string, string> = {
  nabati: "text-amber-400",
  classical: "text-teal-400",
  modern: "text-indigo-400",
};

interface Submission {
  id: number;
  referenceNumber: string;
  poetName: string;
  poetNameAr: string;
  poetNationality: string;
  poemTitle: string;
  poemTitleAr: string;
  poemType: string;
  status: string;
  submittedAt: string;
  finalScore: number | null;
  poemContent?: string;
  poemContentAr?: string;
  meter?: string;
  rhyme?: string;
  verses?: number;
}

const fakeSubmissions: Submission[] = [
  { id: 1, referenceNumber: "AHA-2026-001", poetName: "Mohammed Al Mansoori", poetNameAr: "محمد المنصوري", poetNationality: "UAE", poemTitle: "Desert Song", poemTitleAr: "أغنية الصحراء", poemType: "nabati", status: "approved", submittedAt: "2026-01-20T10:00:00Z", finalScore: 9.2, meter: "Tawil", rhyme: "Ra", verses: 22, poemContentAr: "يا صحراء الوطن يا أرض الأجداد\nفي رمالك تاريخ وفي ترابك أمجاد\nيا موطن البطولات والكرم\nفيك يحلو السرى ويطيب الزاد" },
  { id: 2, referenceNumber: "AHA-2026-002", poetName: "Fatima Al Hashimi", poetNameAr: "فاطمة الهاشمي", poetNationality: "UAE", poemTitle: "Voice of the Palm", poemTitleAr: "صوت النخيل", poemType: "classical", status: "under_jury_review", submittedAt: "2026-01-30T10:00:00Z", finalScore: null, meter: "Kamil", rhyme: "Lam", verses: 18, poemContentAr: "صوت النخيل يهمس في الفجر\nويرسم في السماء حكاية العمر\nيحكي حكايات أهل الصحراء\nويبقى شامخاً عبر الأزمان والدهر" },
  { id: 3, referenceNumber: "AHA-2026-003", poetName: "Khalid Al Rashidi", poetNameAr: "خالد الراشدي", poetNationality: "UAE", poemTitle: "Pearl of the Gulf", poemTitleAr: "لؤلؤة الخليج", poemType: "nabati", status: "sent_to_jury", submittedAt: "2026-02-08T10:00:00Z", finalScore: null, meter: "Wafir", rhyme: "Ya", verses: 16, poemContentAr: "لؤلؤة الخليج في عيون الزمان\nتتلألأ تحت أشعة الإيمان\nيا بحر الكرم والعطاء\nأنت رمز للأمل والوفاء" },
  { id: 4, referenceNumber: "AHA-2026-004", poetName: "Aisha Al Marzouqi", poetNameAr: "عائشة المرزوقي", poetNationality: "UAE", poemTitle: "Sunset over Abu Dhabi", poemTitleAr: "غروب أبوظبي", poemType: "modern", status: "under_review", submittedAt: "2026-02-18T10:00:00Z", finalScore: null, verses: 14, poemContentAr: "في غروب أبوظبي\nترقص الألوان فوق الماء\nذهب يلامس الفيروز\nفي نشيد الكون الخالد" },
  { id: 5, referenceNumber: "AHA-2026-005", poetName: "Omar Al Shamsi", poetNameAr: "عمر الشمسي", poetNationality: "UAE", poemTitle: "The Brave Falcon", poemTitleAr: "الصقر الشجاع", poemType: "nabati", status: "approved", submittedAt: "2026-01-10T10:00:00Z", finalScore: 9.5, meter: "Tawil", rhyme: "Nun", verses: 24 },
  { id: 6, referenceNumber: "AHA-2026-006", poetName: "Mariam Al Nuaimi", poetNameAr: "مريم النعيمي", poetNationality: "UAE", poemTitle: "Tears of the Moon", poemTitleAr: "دموع القمر", poemType: "modern", status: "received", submittedAt: "2026-04-10T10:00:00Z", finalScore: null, verses: 12 },
  { id: 7, referenceNumber: "AHA-2026-007", poetName: "Rashid Al Ketbi", poetNameAr: "راشد الكتبي", poetNationality: "Saudi Arabia", poemTitle: "Mountains of Hejaz", poemTitleAr: "جبال الحجاز", poemType: "classical", status: "under_consolidation", submittedAt: "2026-02-08T10:00:00Z", finalScore: 8.3, meter: "Basit", rhyme: "Mim", verses: 20 },
  { id: 8, referenceNumber: "AHA-2026-008", poetName: "Noura Al Dosari", poetNameAr: "نورة الدوسري", poetNationality: "Qatar", poemTitle: "Blue Waters", poemTitleAr: "المياه الزرقاء", poemType: "nabati", status: "pending_information", submittedAt: "2026-04-15T10:00:00Z", finalScore: null, meter: "Tawil", verses: 18 },
  { id: 9, referenceNumber: "AHA-2026-009", poetName: "Yousef Al Hammadi", poetNameAr: "يوسف الحمادي", poetNationality: "UAE", poemTitle: "The Brave Camel", poemTitleAr: "الجمل الشجاع", poemType: "nabati", status: "rejected", submittedAt: "2026-02-05T10:00:00Z", finalScore: 4.2 },
  { id: 10, referenceNumber: "AHA-2026-010", poetName: "Hessa Al Falasi", poetNameAr: "حصة الفلاسي", poetNationality: "UAE", poemTitle: "Whisper of the Wind", poemTitleAr: "همس الريح", poemType: "modern", status: "sent_to_jury", submittedAt: "2026-02-25T10:00:00Z", finalScore: null, verses: 15, poemContentAr: "همس الريح في أذن الجبال\nيحمل أسرار الزمان والأجيال\nأنغام من عبق الأصالة\nترسم الأمل والآمال" },
  { id: 11, referenceNumber: "AHA-2026-011", poetName: "Abdullah Al Muhairi", poetNameAr: "عبدالله المهيري", poetNationality: "UAE", poemTitle: "Heritage of the Ancestors", poemTitleAr: "إرث الأجداد", poemType: "classical", status: "ready_for_jury", submittedAt: "2026-03-21T10:00:00Z", finalScore: null, meter: "Kamil", verses: 22 },
  { id: 12, referenceNumber: "AHA-2026-012", poetName: "Sheikha Al Qasimi", poetNameAr: "شيخة القاسمي", poetNationality: "UAE", poemTitle: "The Golden Dunes", poemTitleAr: "الكثبان الذهبية", poemType: "nabati", status: "approved", submittedAt: "2026-01-15T10:00:00Z", finalScore: 8.9, meter: "Wafir", verses: 19 },
  { id: 13, referenceNumber: "AHA-2026-013", poetName: "Ibrahim Al Dhaheri", poetNameAr: "إبراهيم الظاهري", poetNationality: "UAE", poemTitle: "Song of the Sailors", poemTitleAr: "أغنية البحارة", poemType: "classical", status: "sent_for_final_decision", submittedAt: "2026-02-05T10:00:00Z", finalScore: 7.8, meter: "Basit", verses: 17 },
  { id: 14, referenceNumber: "AHA-2026-014", poetName: "Maitha Al Suwaidi", poetNameAr: "ميثاء السويدي", poetNationality: "UAE", poemTitle: "The Last Bedouin", poemTitleAr: "آخر البدو", poemType: "modern", status: "received", submittedAt: "2026-04-17T10:00:00Z", finalScore: null, verses: 13, poemContentAr: "آخر البدو يحمل قصة\nترويها الكثبان للقمر\nفي عينيه شموس الأمس\nوفي روحه نور البصر" },
  { id: 15, referenceNumber: "AHA-2026-015", poetName: "Saeed Al Ameri", poetNameAr: "سعيد العامري", poetNationality: "UAE", poemTitle: "Spirit of the Nation", poemTitleAr: "روح الأمة", poemType: "nabati", status: "approved", submittedAt: "2026-01-22T10:00:00Z", finalScore: 9.1, meter: "Tawil", verses: 26 },
];

const allStatuses = [
  "all", "received", "under_review", "pending_information", "ready_for_jury",
  "sent_to_jury", "under_jury_review", "under_consolidation", "sent_for_final_decision",
  "approved", "rejected", "returned_for_clarification", "archived",
];

const juryStatuses = ["all", "sent_to_jury", "under_jury_review", "approved", "rejected"];

function statusLabel(status: string): string {
  return status.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function SubmissionsPage() {
  const { t, lang } = useLanguage();
  const user = getAuthUser();
  const role = user?.role;
  const showIdentity = canSeeIdentity(role);
  const readOnly = isReadOnly(role);
  const isJury = role === "jury";

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeSub, setActiveSub] = useState<Submission | null>(null);
  const [decisionType, setDecisionType] = useState<"accept" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const [criteria, setCriteria] = useState({ language: 7, meter: 7, imagery: 7, originality: 7, impact: 7 });
  const [submitted, setSubmitted] = useState<Record<number, "accept" | "reject">>({});
  const [toast, setToast] = useState<string | null>(null);

  const statuses = isJury ? juryStatuses : allStatuses;

  const filtered = useMemo(() => {
    let list = fakeSubmissions;
    if (isJury) {
      // Jury sees only items assigned to them or already evaluated by them
      list = list.filter((s) =>
        ["sent_to_jury", "under_jury_review", "approved", "rejected"].includes(s.status)
      );
    }
    return list.filter((s) => {
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const searchableName = showIdentity ? s.poetName : "";
      const matchSearch =
        !search ||
        searchableName.toLowerCase().includes(search.toLowerCase()) ||
        s.poemTitle.toLowerCase().includes(search.toLowerCase()) ||
        s.referenceNumber.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [statusFilter, search, isJury, showIdentity]);

  const openModal = (sub: Submission) => {
    if (!isJury) return; // for non-jury, normal navigation
    setActiveSub(sub);
    setDecisionType(null);
    setComment("");
    setCriteria({ language: 7, meter: 7, imagery: 7, originality: 7, impact: 7 });
  };

  const closeModal = () => {
    setActiveSub(null);
    setDecisionType(null);
    setComment("");
  };

  const handleSubmitDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSub || !decisionType) return;
    if (decisionType === "reject" && comment.trim().length < 10) {
      setToast(lang === "ar" ? "يرجى تقديم سبب مفصل للرفض" : "Please provide a detailed reason for rejection");
      setTimeout(() => setToast(null), 3500);
      return;
    }
    setSubmitted((s) => ({ ...s, [activeSub.id]: decisionType }));
    setToast(
      decisionType === "accept"
        ? (lang === "ar" ? "تم تسجيل التقييم بنجاح" : "Evaluation submitted successfully")
        : (lang === "ar" ? "تم تسجيل الرفض" : "Rejection recorded")
    );
    setTimeout(() => setToast(null), 3000);
    closeModal();
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">
            {isJury ? (lang === "ar" ? "الطلبات المخصصة لي" : "My Assigned Submissions") : t("submissions")}
          </h1>
          <p className="text-foreground/40 text-sm mt-0.5">
            {filtered.length} {lang === "ar" ? "سجل" : "records"}
            {isJury && (
              <span className="ms-2 text-gold/70">
                · {lang === "ar" ? "وضع المراجعة المغفلة (هوية الشاعر مخفية)" : "Blind review mode — poet identity hidden"}
              </span>
            )}
            {readOnly && (
              <span className="ms-2 text-amber-400">
                · {lang === "ar" ? "للقراءة فقط" : "Read-only"}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-xl p-4 border border-gold/10 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            placeholder={lang === "ar" ? "بحث…" : "Search by reference or title…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-background/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold/50 transition-all"
          />
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s
                    ? "gold-gradient text-navy"
                    : "border border-border text-foreground/50 hover:border-gold/30 hover:text-foreground"
                }`}
              >
                {s === "all" ? (lang === "ar" ? "الكل" : "All") : statusLabel(s)}
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">{lang === "ar" ? "المرجع" : "Reference"}</th>
                {showIdentity && (
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">{lang === "ar" ? "الشاعر" : "Poet"}</th>
                )}
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">{lang === "ar" ? "العنوان" : "Poem Title"}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">{lang === "ar" ? "النوع" : "Type"}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">{lang === "ar" ? "الحالة" : "Status"}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">{lang === "ar" ? "التاريخ" : "Date"}</th>
                {!isJury && (
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">{lang === "ar" ? "النتيجة" : "Score"}</th>
                )}
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((sub, i) => {
                const myDecision = submitted[sub.id];
                return (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.025, 0.4) }}
                    className="hover:bg-white/2 transition-colors group cursor-pointer"
                    onClick={() => isJury && openModal(sub)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-foreground/60">{sub.referenceNumber}</td>
                    {showIdentity && (
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{lang === "ar" ? sub.poetNameAr : sub.poetName}</div>
                        <div className="text-xs text-foreground/40">{sub.poetNationality}</div>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="font-medium">{lang === "ar" ? sub.poemTitleAr : sub.poemTitle}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs capitalize ${typeColors[sub.poemType] || ""}`}>{sub.poemType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[sub.status] || "bg-gray-500/15 text-gray-400 border border-gray-500/20"}`}>
                        {statusLabel(sub.status)}
                      </span>
                      {myDecision && (
                        <span className={`ms-2 text-[10px] font-bold ${myDecision === "accept" ? "text-green-400" : "text-red-400"}`}>
                          · {myDecision === "accept" ? "✓ Evaluated" : "✗ Rejected"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground/50 whitespace-nowrap">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>
                    {!isJury && (
                      <td className="px-4 py-3">
                        {sub.finalScore != null ? (
                          <span className="text-gold font-semibold">{sub.finalScore.toFixed(1)}</span>
                        ) : (
                          <span className="text-foreground/30">—</span>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      {isJury ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); openModal(sub); }}
                          className="text-xs text-gold hover:underline whitespace-nowrap font-semibold"
                        >
                          {lang === "ar" ? "افتح للمراجعة" : "Review →"}
                        </button>
                      ) : (
                        <Link href={`/dashboard/submissions/${sub.id}`}>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 text-xs text-gold hover:underline transition-opacity whitespace-nowrap"
                          >
                            {lang === "ar" ? "التفاصيل ←" : "View Details →"}
                          </button>
                        </Link>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-foreground/30">
              {lang === "ar" ? "لا توجد طلبات" : "No submissions found"}
            </div>
          )}
        </div>
      </motion.div>

      {/* ===== JURY BLIND REVIEW MODAL ===== */}
      <AnimatePresence>
        {activeSub && isJury && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-2xl border border-gold/30 w-full max-w-3xl my-8 max-h-[90vh] overflow-y-auto bg-card"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-gold/15 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gold/70 font-semibold">
                    {lang === "ar" ? "مراجعة مغفلة الهوية" : "Blind Review"}
                  </p>
                  <h3 className="text-lg font-display font-bold mt-0.5">
                    {activeSub.referenceNumber} · {lang === "ar" ? activeSub.poemTitleAr : activeSub.poemTitle}
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="w-9 h-9 rounded-full hover:bg-foreground/10 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Poem metadata - NO identity shown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg bg-foreground/5 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-foreground/40">{lang === "ar" ? "النوع" : "Type"}</p>
                    <p className={`text-sm font-semibold capitalize mt-0.5 ${typeColors[activeSub.poemType]}`}>{activeSub.poemType}</p>
                  </div>
                  <div className="rounded-lg bg-foreground/5 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-foreground/40">{lang === "ar" ? "البحر" : "Meter"}</p>
                    <p className="text-sm font-semibold mt-0.5">{activeSub.meter || "—"}</p>
                  </div>
                  <div className="rounded-lg bg-foreground/5 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-foreground/40">{lang === "ar" ? "القافية" : "Rhyme"}</p>
                    <p className="text-sm font-semibold mt-0.5">{activeSub.rhyme || "—"}</p>
                  </div>
                  <div className="rounded-lg bg-foreground/5 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-foreground/40">{lang === "ar" ? "الأبيات" : "Verses"}</p>
                    <p className="text-sm font-semibold mt-0.5">{activeSub.verses ?? "—"}</p>
                  </div>
                </div>

                {/* Poem text */}
                <div className="rounded-xl border border-gold/15 bg-gradient-to-br from-gold/5 to-transparent p-6 max-h-72 overflow-y-auto">
                  <p className="text-[10px] uppercase tracking-widest text-gold/60 mb-3 font-semibold">
                    {lang === "ar" ? "نص القصيدة" : "Poem Text"}
                  </p>
                  <pre
                    dir="rtl"
                    className="font-arabic text-lg leading-loose text-foreground/90 whitespace-pre-wrap text-right"
                  >
                    {activeSub.poemContentAr || "نص القصيدة غير متاح للعرض"}
                  </pre>
                </div>

                <p className="text-xs text-amber-400/80 flex items-center gap-2 px-3 py-2 bg-amber-500/5 rounded-lg border border-amber-500/15">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  {lang === "ar"
                    ? "هوية الشاعر مخفية لضمان حيادية التقييم"
                    : "Poet identity is intentionally hidden to ensure impartial evaluation"}
                </p>

                {/* Evaluation form */}
                <form onSubmit={handleSubmitDecision} className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold mb-3">
                      {lang === "ar" ? "معايير التقييم (1-10)" : "Evaluation Criteria (1–10)"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {([
                        ["language", lang === "ar" ? "اللغة والبلاغة" : "Language & Eloquence"],
                        ["meter", lang === "ar" ? "الوزن والقافية" : "Meter & Rhyme"],
                        ["imagery", lang === "ar" ? "الصور الشعرية" : "Imagery"],
                        ["originality", lang === "ar" ? "الأصالة" : "Originality"],
                        ["impact", lang === "ar" ? "الأثر العاطفي" : "Emotional Impact"],
                      ] as const).map(([key, label]) => (
                        <div key={key} className="rounded-lg border border-border p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-foreground/70">{label}</span>
                            <span className="text-sm font-bold text-gold">{(criteria as any)[key]}</span>
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={(criteria as any)[key]}
                            onChange={(e) => setCriteria({ ...criteria, [key]: Number(e.target.value) })}
                            className="w-full accent-[#C8A96E]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold block mb-2">
                      {lang === "ar" ? "تعليق المُحكِّم" : "Jury Comment"}
                      {decisionType === "reject" && <span className="text-red-400 ms-1">*</span>}
                    </label>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={
                        decisionType === "reject"
                          ? (lang === "ar" ? "يرجى تقديم سبب مفصل للرفض (مطلوب)" : "Please provide a detailed reason for rejection (required)")
                          : (lang === "ar" ? "اكتب ملاحظاتك حول القصيدة…" : "Write your evaluation notes…")
                      }
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/50">
                    <button
                      type="button"
                      onClick={() => setDecisionType("accept")}
                      className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                        decisionType === "accept"
                          ? "bg-green-500/20 border-green-500 text-green-400"
                          : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                      }`}
                    >
                      ✓ {lang === "ar" ? "قبول" : "Accept"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecisionType("reject")}
                      className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                        decisionType === "reject"
                          ? "bg-red-500/20 border-red-500 text-red-400"
                          : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                      }`}
                    >
                      ✗ {lang === "ar" ? "رفض" : "Reject"}
                    </button>
                  </div>

                  {decisionType && (
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="submit"
                      className="w-full py-3.5 rounded-xl gold-gradient text-navy font-bold text-base shadow-lg shadow-gold/20"
                    >
                      {lang === "ar" ? "إرسال التقييم" : "Submit Evaluation"}
                    </motion.button>
                  )}
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[200] glass-panel border border-gold/30 px-5 py-3 rounded-xl shadow-2xl"
          >
            <p className="text-sm font-medium">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
