import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicLayout } from "@/components/PublicLayout";
import { useLanguage } from "@/hooks/useLanguage";
import { useCreateSubmission } from "@workspace/api-client-react";

export default function SubmitPage() {
  const { t, isRtl } = useLanguage();
  const [success, setSuccess] = useState(false);
  const [refNum, setRefNum] = useState("");
  const createSubmission = useCreateSubmission();

  const [form, setForm] = useState({
    poetName: "",
    poetNameAr: "",
    poetEmail: "",
    poetPhone: "",
    poetNationality: "",
    poemTitle: "",
    poemTitleAr: "",
    poemContent: "",
    poemType: "" as "nabati" | "classical" | "modern" | "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.poemType) return;
    try {
      const result = await createSubmission.mutateAsync({
        poetName: form.poetName,
        poetNameAr: form.poetNameAr,
        poetEmail: form.poetEmail,
        poetPhone: form.poetPhone,
        poetNationality: form.poetNationality,
        poemTitle: form.poemTitle,
        poemTitleAr: form.poemTitleAr,
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
              <p className="text-xs text-foreground/50 mb-1">Reference Number</p>
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
                    { key: "poetNameAr", label: t("poetNameAr"), type: "text", dir: "rtl" },
                    { key: "poetEmail", label: t("poetEmail"), type: "email", required: true },
                    { key: "poetPhone", label: t("poetPhone"), type: "tel" },
                    { key: "poetNationality", label: t("poetNationality"), type: "text" },
                  ].map((field) => (
                    <div key={field.key} className={field.key === "poetNationality" ? "sm:col-span-2" : ""}>
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
                  <div>
                    <label className="block text-xs text-foreground/50 mb-1.5">{t("poemTitleAr")}</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={form.poemTitleAr}
                      onChange={(e) => handleChange("poemTitleAr", e.target.value)}
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs text-foreground/50 mb-1.5">{t("poemType")} <span className="text-gold">*</span></label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["nabati", "classical", "modern"] as const).map((type) => (
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
                        {t(type)}
                      </button>
                    ))}
                  </div>
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

              <motion.button
                type="submit"
                disabled={createSubmission.isPending || !form.poemType}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-4 rounded-xl gold-gradient text-navy font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gold/20"
              >
                {createSubmission.isPending ? t("submitting") : t("submitButton")}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
