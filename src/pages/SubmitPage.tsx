import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicLayout } from "@/components/PublicLayout";
import { useLanguage } from "@/hooks/useLanguage";
import { PoemFormatToolbar, PoemFormatPreview, PoemFormat } from "@/components/PoemFormatSelector";

type SubmitterRole = "poet" | "requester";

const UAE_NATIONALITIES = [
  "Emirati",
  "Saudi Arabian","Egyptian","Jordanian","Lebanese","Syrian","Palestinian","Iraqi","Yemeni","Omani",
  "Kuwaiti","Bahraini","Qatari","Moroccan","Tunisian","Algerian","Libyan","Sudanese",
  "Indian","Pakistani","Bangladeshi","Sri Lankan","Filipino","Indonesian","British",
  "American","Canadian","Australian","French","German","Other",
];

export default function SubmitPage() {
  const { t, isRtl } = useLanguage();
  const [success, setSuccess] = useState(false);
  const [refNum, setRefNum] = useState("");
  const [savedDraft, setSavedDraft] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [role, setRole] = useState<SubmitterRole>("poet");
  const [poemFormat, setPoemFormat] = useState<PoemFormat | null>(null);

  const createSubmission = {
    isPending,
    mutateAsync: async (data: any) => {
      setIsPending(true);
      await new Promise((r) => setTimeout(r, 800));
      setIsPending(false);
      return { referenceNumber: `AHA-${Date.now()}` };
    },
  };

  const [form, setForm] = useState({
    poetName: "",
    poetEmail: "",
    poetPhone: "",
    poetNationality: "",
    poetIdFile: "",
    requesterName: "",
    requesterEmail: "",
    requesterMobile: "",
    requesterRelationship: "",
    requesterNationality: "",
    requesterIdFile: "",
    sourceChannel: "",
    poemTitle: "",
    openingLine: "",
    poemContent: "",
    poemType: "" as "nabati" | "standard" | "",
    attachmentName: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submitForm = async () => {
    if (!form.poemType) return;
    try {
      const result = await createSubmission.mutateAsync({
        poetName: form.poetName,
        poetEmail: form.poetEmail,
        poetPhone: form.poetPhone,
        poemTitle: form.poemTitle,
        poemContent: form.poemContent,
        poemType: form.poemType,
      });
      setRefNum(result.referenceNumber || `AHA-${Date.now()}`);
      setSuccess(true);
    } catch {
      setRefNum(`AHA-${Date.now()}`);
      setSuccess(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  const handleSaveDraft = () => {
    localStorage.setItem("poem_intake_draft", JSON.stringify({ ...form, role, poemFormat }));
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2500);
  };

  const inputClass =
    "w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all";

  const selectClass =
    "w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all appearance-none cursor-pointer";

  if (success) {
    return (
      <PublicLayout>
        <div className="min-h-screen pt-20 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="glass-panel rounded-2xl p-12 max-w-lg w-full text-center border border-gold/20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
              className="w-20 h-20 rounded-full gold-gradient mx-auto mb-6 flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="text-3xl font-display font-bold gold-gradient-text mb-3">{t("successTitle")}</h2>
            <div className="text-5xl font-arabic text-gold/60 mb-4" dir="rtl">مبروك</div>
            <p className="text-foreground/60 mb-6">{t("successMessage")}</p>
            <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 mb-6">
              <p className="text-xs text-foreground/50 mb-1">Request ID</p>
              <p className="text-xl font-mono font-bold text-gold">{refNum}</p>
            </div>
            <motion.a
              href="/"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gold-gradient text-navy font-bold hover:opacity-90 transition-all"
            >
              Back to Home
            </motion.a>
          </motion.div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen pt-24 pb-16">
        {/* Hero */}
        <div className="relative py-16 text-center overflow-hidden">
          <div className="absolute inset-0 arabic-pattern opacity-20" />
          <div className="relative z-10 max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-arabic text-gold/70 mb-3"
              dir="rtl"
            >
              قدّم قصيدتك
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-display font-bold mb-3"
            >
              {t("submitTitle")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-foreground/60"
            >
              {t("submitSubtitle")}
            </motion.p>
          </div>
        </div>

        {/* Form — wide container */}
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-2xl p-8 border border-gold/10"
          >
            {/* Role Toggle */}
            <div className="mb-8 max-w-lg mx-auto">
              <p className="text-xs text-foreground/40 uppercase tracking-widest text-center mb-3">
                Submitting as
              </p>
              <div className="relative flex items-center bg-background/60 border border-border rounded-xl p-1 gap-1">
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  className="absolute top-1 bottom-1 rounded-lg gold-gradient shadow-lg shadow-gold/20"
                  style={{
                    left: role === "poet" ? "4px" : "calc(50% + 2px)",
                    width: "calc(50% - 6px)",
                  }}
                />
                {([
                  { value: "poet" as const, label: "I am the Poet", icon: "✦" },
                  { value: "requester" as const, label: "I am a Requester", icon: "◈" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                      role === opt.value ? "text-navy" : "text-foreground/50 hover:text-foreground"
                    }`}
                  >
                    <span className="text-base leading-none">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={role}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="text-xs text-foreground/40 text-center mt-2"
                >
                  {role === "poet"
                    ? "Fill in your own details as the poem's author."
                    : "You are submitting on behalf of a poet. Your contact details are required."}
                </motion.p>
              </AnimatePresence>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8" dir={isRtl ? "rtl" : "ltr"}>

              {/* ── Poet Information ── */}
              <div>
                <h3 className="text-sm font-semibold text-gold/70 tracking-wider uppercase mb-4">
                  Poet Information
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">
                      {t("poetName")} <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.poetName}
                      onChange={(e) => handleChange("poetName", e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">
                      {t("poetEmail")}
                      {role === "poet" && <span className="text-gold"> *</span>}
                      {role === "requester" && <span className="text-foreground/30 text-xs ml-1">(optional)</span>}
                    </label>
                    <input
                      type="email"
                      value={form.poetEmail}
                      onChange={(e) => handleChange("poetEmail", e.target.value)}
                      required={role === "poet"}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">
                      {t("poetPhone")}
                      {role === "poet" && <span className="text-gold"> *</span>}
                      {role === "requester" && <span className="text-foreground/30 text-xs ml-1">(optional)</span>}
                    </label>
                    <input
                      type="tel"
                      value={form.poetPhone}
                      onChange={(e) => handleChange("poetPhone", e.target.value)}
                      required={role === "poet"}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Nationality + ID upload */}
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {/* Nationality dropdown */}
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">
                      Nationality
                      {role === "poet" && <span className="text-gold"> *</span>}
                      {role === "requester" && <span className="text-foreground/30 text-xs ml-1">(optional)</span>}
                    </label>
                    <div className="relative">
                      <select
                        value={form.poetNationality}
                        onChange={(e) => handleChange("poetNationality", e.target.value)}
                        required={role === "poet"}
                        className={selectClass}
                      >
                        <option value="" disabled>Select nationality…</option>
                        {UAE_NATIONALITIES.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      {/* chevron */}
                      <svg
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Emirates ID / Passport upload */}
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">
                      Emirates ID or Passport
                      {role === "poet" && <span className="text-gold"> *</span>}
                      {role === "requester" && <span className="text-foreground/30 text-xs ml-1">(optional)</span>}
                    </label>
                    <label
                      className="flex items-center gap-3 w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 cursor-pointer hover:border-gold/40 transition-all group"
                      style={{ borderStyle: form.poetIdFile ? "solid" : "dashed" }}
                    >
                      {/* Icon */}
                      <span
                        className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                        style={{
                          background: form.poetIdFile ? "rgba(200,169,110,0.15)" : "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(200,169,110,0.2)",
                        }}
                      >
                        <svg className="w-3.5 h-3.5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                        </svg>
                      </span>
                      <span className="text-xs text-foreground/40 group-hover:text-foreground/60 transition-colors flex-1 truncate">
                        {form.poetIdFile ? form.poetIdFile : "Upload ID / Passport (PDF, JPG, PNG)"}
                      </span>
                      {form.poetIdFile && (
                        <svg className="w-3.5 h-3.5 text-gold/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="sr-only"
                        onChange={(e) => handleChange("poetIdFile", e.target.files?.[0]?.name || "")}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* ── Requester Information (requester role only) ── */}
              <AnimatePresence>
                {role === "requester" && (
                  <motion.div
                    key="requester-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="border-t border-border/50 mb-6" />
                    <h3 className="text-sm font-semibold text-gold/70 tracking-wider uppercase mb-4">
                      Requester Information
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-foreground/50 mb-1.5">
                          Requester Name <span className="text-gold">*</span>
                        </label>
                        <input type="text" value={form.requesterName}
                          onChange={(e) => handleChange("requesterName", e.target.value)}
                          required={role === "requester"} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs text-foreground/50 mb-1.5">
                          Requester Email <span className="text-gold">*</span>
                        </label>
                        <input type="email" value={form.requesterEmail}
                          onChange={(e) => handleChange("requesterEmail", e.target.value)}
                          required={role === "requester"} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs text-foreground/50 mb-1.5">
                          Requester Mobile <span className="text-gold">*</span>
                        </label>
                        <input type="tel" value={form.requesterMobile}
                          onChange={(e) => handleChange("requesterMobile", e.target.value)}
                          required={role === "requester"} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs text-foreground/50 mb-1.5">Relationship to Poet</label>
                        <input type="text" value={form.requesterRelationship}
                          onChange={(e) => handleChange("requesterRelationship", e.target.value)}
                          className={inputClass} />
                      </div>
                    </div>

                    {/* Requester nationality + ID */}
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-xs text-foreground/50 mb-1.5">
                          Nationality <span className="text-gold">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={form.requesterNationality}
                            onChange={(e) => handleChange("requesterNationality", e.target.value)}
                            required={role === "requester"}
                            className={selectClass}
                          >
                            <option value="" disabled>Select nationality…</option>
                            {UAE_NATIONALITIES.map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-foreground/50 mb-1.5">
                          Emirates ID or Passport <span className="text-gold">*</span>
                        </label>
                        <label
                          className="flex items-center gap-3 w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 cursor-pointer hover:border-gold/40 transition-all group"
                          style={{ borderStyle: form.requesterIdFile ? "solid" : "dashed" }}
                        >
                          <span className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center"
                            style={{
                              background: form.requesterIdFile ? "rgba(200,169,110,0.15)" : "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(200,169,110,0.2)",
                            }}>
                            <svg className="w-3.5 h-3.5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                            </svg>
                          </span>
                          <span className="text-xs text-foreground/40 group-hover:text-foreground/60 transition-colors flex-1 truncate">
                            {form.requesterIdFile ? form.requesterIdFile : "Upload ID / Passport (PDF, JPG, PNG)"}
                          </span>
                          {form.requesterIdFile && (
                            <svg className="w-3.5 h-3.5 text-gold/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                            onChange={(e) => handleChange("requesterIdFile", e.target.files?.[0]?.name || "")} />
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="border-t border-border/50" />

              {/* ── Poem Details ── */}
              <div>
                <h3 className="text-sm font-semibold text-gold/70 tracking-wider uppercase mb-4">
                  Poem Details
                </h3>

                {/* Title + Type row */}
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">
                      {t("poemTitle")} <span className="text-gold">*</span>
                    </label>
                    <input type="text" value={form.poemTitle}
                      onChange={(e) => handleChange("poemTitle", e.target.value)}
                      required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">
                      {t("poemType")} <span className="text-gold">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 h-[42px]">
                      {(["nabati", "standard"] as const).map((type) => (
                        <button key={type} type="button"
                          onClick={() => handleChange("poemType", type)}
                          className={`rounded-lg border text-sm font-medium transition-all ${
                            form.poemType === type
                              ? "border-gold/50 bg-gold/10 text-gold"
                              : "border-border text-foreground/50 hover:border-gold/30 hover:text-foreground"
                          }`}
                        >
                          {type === "nabati" ? "Nabati" : "Standard"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-foreground/50 mb-1.5">Opening Line</label>
                  <input type="text" value={form.openingLine}
                    onChange={(e) => handleChange("openingLine", e.target.value)}
                    className={inputClass} />
                </div>

                {/* ── Poem editor + preview side-by-side ── */}
                <div className="grid lg:grid-cols-2 gap-4 items-start">
                  {/* Left: format toolbar + textarea */}
                  <div className="flex flex-col">
                    <label className="block text-xs text-foreground/50 mb-2">
                      {t("poemContent")} <span className="text-gold">*</span>
                    </label>
                    <div
                      className="rounded-t-lg border border-b-0 border-border px-3 py-2"
                      style={{ background: "rgba(255,255,255,0.025)" }}
                    >
                      <PoemFormatToolbar
                        selectedFormat={poemFormat}
                        onSelectFormat={setPoemFormat}
                      />
                    </div>
                    <textarea
                      value={form.poemContent}
                      onChange={(e) => handleChange("poemContent", e.target.value)}
                      required
                      dir="rtl"
                      className="w-full bg-background/50 border border-border rounded-b-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all font-arabic resize-none leading-loose"
                      style={{ height: "400px" }}
                      placeholder="اكتب قصيدتك هنا..."
                    />
                  </div>

                  {/* Right: preview — fixed same 400px, no flex tricks */}
                  <div className="flex flex-col">
                    <label className="block text-xs text-foreground/50 mb-2">
                      Live Preview
                    </label>
                    <div style={{ height: "400px" }}>
                      <PoemFormatPreview
                        poemContent={form.poemContent}
                        poemTitle={form.poemTitle}
                        selectedFormat={poemFormat}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/50" />

              {/* ── Metadata ── */}
              <div>
                <h3 className="text-sm font-semibold text-gold/70 tracking-wider uppercase mb-4">
                  Metadata
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">Source Channel</label>
                    <input type="text" value={form.sourceChannel}
                      onChange={(e) => handleChange("sourceChannel", e.target.value)}
                      className={inputClass} placeholder="Website / Email / Referral" />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">Attachment (simulated)</label>
                    <input type="file"
                      onChange={(e) => handleChange("attachmentName", e.target.files?.[0]?.name || "")}
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-gold/15 file:text-gold" />
                    {form.attachmentName && (
                      <p className="text-xs text-foreground/50 mt-1">Selected: {form.attachmentName}</p>
                    )}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {savedDraft && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold"
                  >
                    Draft saved successfully.
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid sm:grid-cols-2 gap-3">
                <motion.button type="button" onClick={handleSaveDraft}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="w-full py-3 rounded-xl border border-gold/30 text-gold font-semibold text-sm hover:bg-gold/10 transition-all">
                  Save as Draft
                </motion.button>
                <motion.button type="submit"
                  disabled={createSubmission.isPending || !form.poemType}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="w-full py-3 rounded-xl gold-gradient text-navy font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gold/20">
                  {createSubmission.isPending ? t("submitting") : "Save"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
