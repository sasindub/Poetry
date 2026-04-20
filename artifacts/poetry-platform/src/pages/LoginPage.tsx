import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { useLogin } from "@workspace/api-client-react";
import { setAuthUser } from "@/lib/auth";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Link } from "wouter";

const demoCredentials = [
  { email: "admin@aha.ae", password: "admin123", role: "Administrator", roleAr: "مسؤول النظام", color: "from-gold/20 to-amber-900/10" },
  { email: "reviewer@aha.ae", password: "reviewer123", role: "App Reviewer", roleAr: "مراجع الطلبات", color: "from-teal-900/20 to-teal-800/10" },
  { email: "jury@aha.ae", password: "jury123", role: "Jury Member", roleAr: "عضو لجنة التحكيم", color: "from-indigo-900/20 to-indigo-800/10" },
];

export default function LoginPage() {
  const { t, lang } = useLanguage();
  const [, navigate] = useLocation();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await login.mutateAsync({ email, password });
      if (result?.user) {
        setAuthUser(result.user as any, result.token || "");
        navigate("/dashboard");
      }
    } catch {
      // Try local validation for demo
      const found = demoCredentials.find((c) => c.email === email && c.password === password);
      if (found) {
        const fakeUser = { id: 1, name: found.role === "Administrator" ? "Dr. Sultan Al Mansoori" : found.role === "App Reviewer" ? "Fatima Al Rashidi" : "Prof. Ahmad Al Mazrouei", nameAr: "", email, role: (found.role === "Administrator" ? "admin" : found.role === "App Reviewer" ? "reviewer" : "jury") as any, status: "active", createdAt: new Date().toISOString() };
        setAuthUser(fakeUser, btoa(email));
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060d1f] to-[#0a1628]" />
        <div className="absolute inset-0 arabic-pattern opacity-30" />
        {/* Animated orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gold/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-teal-900/30 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative z-10 text-center px-8">
          <div className="w-20 h-20 rounded-full gold-gradient mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-gold/30">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-navy" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="text-5xl font-arabic text-gold mb-4" dir="rtl">هيئة أبوظبي للتراث</div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">{t("loginTitle")}</h1>
          <p className="text-foreground/50 max-w-xs mx-auto">{t("loginSubtitle")}</p>

          {/* Decorative poem */}
          <motion.div
            className="mt-10 p-6 glass-panel rounded-xl border border-gold/10 text-right max-w-xs mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            dir="rtl"
          >
            <p className="text-gold/70 font-arabic text-lg leading-loose">يا صحراء الوطن يا أرض الأجداد<br />في رمالك تاريخ وفي ترابك أمجاد</p>
            <p className="text-foreground/30 text-xs mt-3">— محمد المنصوري</p>
          </motion.div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Top nav */}
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="flex items-center gap-2 text-foreground/50 hover:text-gold text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to site
          </Link>
          <LanguageToggle />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-display font-bold mb-2">{t("loginTitle")}</h2>
              <p className="text-foreground/50 text-sm">{t("loginSubtitle")}</p>
            </div>

            {/* Demo credentials */}
            <div className="mb-6">
              <p className="text-xs text-foreground/40 mb-3 uppercase tracking-wider font-semibold">{t("demoCredentials")}</p>
              <div className="space-y-2">
                {demoCredentials.map((cred) => (
                  <motion.button
                    key={cred.email}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => { setEmail(cred.email); setPassword(cred.password); }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r ${cred.color} border border-gold/10 hover:border-gold/30 transition-all group text-left`}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{lang === "ar" ? cred.roleAr : cred.role}</p>
                      <p className="text-xs text-foreground/40">{cred.email}</p>
                    </div>
                    <span className="text-xs text-gold/50 group-hover:text-gold transition-colors">Use →</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-foreground/50 mb-1.5">{t("emailLabel")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                  placeholder="name@aha.ae"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground/50 mb-1.5">{t("passwordLabel")}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400">
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={login.isPending}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 rounded-xl gold-gradient text-navy font-bold text-base disabled:opacity-50 transition-all shadow-lg shadow-gold/20"
              >
                {login.isPending ? t("signingIn") : t("loginButton")}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
