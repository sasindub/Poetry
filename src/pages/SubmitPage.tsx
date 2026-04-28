import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicLayout } from "@/components/PublicLayout";
import { useLanguage } from "@/hooks/useLanguage";
export default function SubmitPage() {
  const { t, isRtl } = useLanguage();
  const [success, setSuccess] = useState(false);
  const [refNum, setRefNum] = useState("");
  const [savedDraft, setSavedDraft] = useState(false);
  const [isPending, setIsPending] = useState(false);
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
    requesterName: "",
    requesterEmail: "",
    requesterMobile: "",
    requesterRelationship: "",
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
    localStorage.setItem("poem_intake_draft", JSON.stringify(form));
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2500);
  };

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
              className="text-4xl font-arabic text-gold/70 mb-3" dir="rtl"
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

        {/* Form */}
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-2xl p-8 border border-gold/10"
          >
            <form onSubmit={handleSubmit} className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
              {/* Poet info */}
              <div>
                <h3 className="text-sm font-semibold text-gold/70 tracking-wider uppercase mb-4">Poet Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: "poetName", label: t("poetName"), type: "text", required: true },
                    { key: "poetEmail", label: t("poetEmail"), type: "email", required: true },
                    { key: "poetPhone", label: t("poetPhone"), type: "tel" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs text-foreground/50 mb-1.5">
                        {field.label} {field.required && <span className="text-gold">*</span>}
                      </label>
                      <input
                        type={field.type}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        required={field.required}
                        dir={field.dir}
                        className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                        placeholder={field.dir === "rtl" ? "أدخل باللغة العربية" : ""}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border/50" />

              {/* Requester info */}
              <div>
                <h3 className="text-sm font-semibold text-gold/70 tracking-wider uppercase mb-4">Requester Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">Requester Name <span className="text-gold">*</span></label>
                    <input
                      type="text"
                      value={form.requesterName}
                      onChange={(e) => handleChange("requesterName", e.target.value)}
                      required
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">Requester Email <span className="text-gold">*</span></label>
                    <input
                      type="email"
                      value={form.requesterEmail}
                      onChange={(e) => handleChange("requesterEmail", e.target.value)}
                      required
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">Requester Mobile <span className="text-gold">*</span></label>
                    <input
                      type="tel"
                      value={form.requesterMobile}
                      onChange={(e) => handleChange("requesterMobile", e.target.value)}
                      required
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">Relationship to Poet</label>
                    <input
                      type="text"
                      value={form.requesterRelationship}
                      onChange={(e) => handleChange("requesterRelationship", e.target.value)}
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border/50" />

              {/* Poem info */}
              <div>
                <h3 className="text-sm font-semibold text-gold/70 tracking-wider uppercase mb-4">Poem Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">{t("poemTitle")} <span className="text-gold">*</span></label>
                    <input
                      type="text"
                      value={form.poemTitle}
                      onChange={(e) => handleChange("poemTitle", e.target.value)}
                      required
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                    />
                  </div>
                  <div />
                </div>

                <div className="mt-4">
                  <label className="block text-xs text-foreground/50 mb-1.5">{t("poemType")} <span className="text-gold">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["nabati", "standard"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleChange("poemType", type)}
                        className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
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

                <div className="mt-4">
                  <label className="block text-xs text-foreground/50 mb-1.5">Opening Line</label>
                  <input
                    type="text"
                    value={form.openingLine}
                    onChange={(e) => handleChange("openingLine", e.target.value)}
                    className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-xs text-foreground/50 mb-1.5">
                    {t("poemContent")} <span className="text-gold">*</span>
                  </label>
                  <textarea
                    value={form.poemContent}
                    onChange={(e) => handleChange("poemContent", e.target.value)}
                    required
                    rows={10}
                    dir="rtl"
                    className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all font-arabic resize-none leading-loose"
                    placeholder="اكتب قصيدتك هنا..."
                  />
                </div>
              </div>

              <div className="border-t border-border/50" />

              {/* Metadata */}
              <div>
                <h3 className="text-sm font-semibold text-gold/70 tracking-wider uppercase mb-4">Metadata</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">Source Channel</label>
                    <input
                      type="text"
                      value={form.sourceChannel}
                      onChange={(e) => handleChange("sourceChannel", e.target.value)}
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                      placeholder="Website / Email / Referral"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">Attachment (simulated)</label>
                    <input
                      type="file"
                      onChange={(e) => handleChange("attachmentName", e.target.files?.[0]?.name || "")}
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-gold/15 file:text-gold"
                    />
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
                <motion.button
                  type="button"
                  onClick={handleSaveDraft}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 rounded-xl border border-gold/30 text-gold font-semibold text-sm hover:bg-gold/10 transition-all"
                >
                  Save as Draft
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={createSubmission.isPending || !form.poemType}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 rounded-xl gold-gradient text-navy font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gold/20"
                >
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
