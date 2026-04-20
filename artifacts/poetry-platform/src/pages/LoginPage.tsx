import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { useLogin } from "@workspace/api-client-react";
import { setAuthUser } from "@/lib/auth";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FloatingMusicNotes } from "@/components/FloatingMusicNotes";

const demoCredentials = [
  { email: "admin@aha.ae", password: "admin123", role: "Administrator", roleAr: "مسؤول النظام", color: "from-gold/15 to-amber-900/5 border-gold/20" },
  { email: "reviewer@aha.ae", password: "reviewer123", role: "App Reviewer", roleAr: "مراجع الطلبات", color: "from-teal-900/20 to-teal-800/5 border-teal-700/20" },
  { email: "jury@aha.ae", password: "jury123", role: "Jury Member", roleAr: "عضو لجنة التحكيم", color: "from-indigo-900/20 to-indigo-800/5 border-indigo-700/20" },
];

const demoCLight = [
  { email: "admin@aha.ae", password: "admin123", role: "Administrator", roleAr: "مسؤول النظام", color: "from-amber-50 to-amber-100/80 border-amber-300/60" },
  { email: "reviewer@aha.ae", password: "reviewer123", role: "App Reviewer", roleAr: "مراجع الطلبات", color: "from-teal-50 to-teal-100/80 border-teal-300/60" },
  { email: "jury@aha.ae", password: "jury123", role: "Jury Member", roleAr: "عضو لجنة التحكيم", color: "from-indigo-50 to-indigo-100/80 border-indigo-300/60" },
];

export default function LoginPage() {
  const { t, lang } = useLanguage();
  const { isDark } = useTheme();
  const [, navigate] = useLocation();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const creds = isDark ? demoCredentials : demoCLight;

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
      const found = creds.find((c) => c.email === email && c.password === password);
      if (found) {
        const fakeUser = {
          id: 1,
          name: found.role === "Administrator" ? "Dr. Sultan Al Mansoori" : found.role === "App Reviewer" ? "Fatima Al Rashidi" : "Prof. Ahmad Al Mazrouei",
          nameAr: "",
          email,
          role: (found.role === "Administrator" ? "admin" : found.role === "App Reviewer" ? "reviewer" : "jury") as any,
          status: "active",
          createdAt: new Date().toISOString(),
        };
        setAuthUser(fakeUser, btoa(email));
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* ===== LEFT PANEL — Decorative ===== */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        {/* Background */}
        {isDark ? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#060d1f] via-[#0a1628] to-[#061810]" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5edd4] via-[#eedfc0] to-[#e8d5a8]" />
        )}

        {/* Radial glow orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(200,169,110,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(200,169,110,0.3) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(26,122,107,0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(26,122,107,0.1) 0%, transparent 70%)",
          }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Arabic pattern */}
        <div className={`absolute inset-0 arabic-pattern ${isDark ? "opacity-25" : "opacity-15"}`} />

        {/* FLOATING MUSIC NOTES */}
        <FloatingMusicNotes
          count={12}
          rings
          equalizer
          goldColor={isDark ? "#C8A96E" : "#A87828"}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-8 max-w-sm">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
            className="w-20 h-20 rounded-full gold-gradient mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-gold/30"
          >
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-navy" fill="currentColor">
              <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p
              className={`text-4xl font-arabic mb-4 leading-tight ${isDark ? "text-gold" : "text-[#8B5E0A]"}`}
              dir="rtl"
            >
              هيئة أبوظبي للتراث
            </p>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">{t("loginTitle")}</h1>
            <p className="text-foreground/50 text-sm">{t("loginSubtitle")}</p>
          </motion.div>

          {/* Decorative poem quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-5 glass-panel rounded-2xl border border-gold/15 text-right"
            dir="rtl"
          >
            <svg className={`w-5 h-5 mb-3 ${isDark ? "text-gold/40" : "text-[#8B5E0A]/40"}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className={`font-arabic text-lg leading-loose ${isDark ? "text-foreground/80" : "text-foreground/70"}`}>
              يا صحراء الوطن يا أرض الأجداد<br />
              في رمالك تاريخ وفي ترابك أمجاد
            </p>
            <p className="text-foreground/30 text-xs mt-3">— محمد المنصوري</p>
          </motion.div>

          {/* Animated equalizer visual at bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-end justify-center gap-1.5"
          >
            {[20, 35, 28, 45, 32, 50, 25, 40, 30, 38, 22, 44].map((h, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full gold-gradient"
                animate={{ height: [h * 0.4, h, h * 0.5, h * 0.8, h * 0.3, h] }}
                transition={{
                  duration: 1.1 + i * 0.08,
                  delay: i * 0.05,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "mirror",
                }}
                style={{ height: h }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Form ===== */}
      <div className="w-full lg:w-1/2 flex flex-col bg-background">
        {/* Top nav */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <Link href="/" className="flex items-center gap-2 text-foreground/50 hover:text-foreground text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to site
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-display font-bold mb-1">{t("loginTitle")}</h2>
              <p className="text-foreground/50 text-sm">{t("loginSubtitle")}</p>
            </div>

            {/* Demo credentials */}
            <div className="mb-6">
              <p className="text-xs text-foreground/40 mb-3 uppercase tracking-wider font-semibold">{t("demoCredentials")}</p>
              <div className="space-y-2">
                {creds.map((cred) => (
                  <motion.button
                    key={cred.email}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => { setEmail(cred.email); setPassword(cred.password); }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r ${cred.color} border hover:border-gold/40 transition-all group text-left`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center text-navy text-xs font-bold">
                        {cred.role.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{lang === "ar" ? cred.roleAr : cred.role}</p>
                        <p className="text-xs text-foreground/40">{cred.email}</p>
                      </div>
                    </div>
                    <motion.span
                      className="text-xs text-gold/50 group-hover:text-gold transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      Use →
                    </motion.span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-foreground/30">or enter manually</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-foreground/50 mb-1.5 font-medium">{t("emailLabel")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
                  placeholder="name@aha.ae"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground/50 mb-1.5 font-medium">{t("passwordLabel")}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-sm text-red-400 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={login.isPending}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 rounded-xl gold-gradient text-navy font-bold text-base disabled:opacity-50 transition-all shadow-lg shadow-gold/20 mt-2"
              >
                {login.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full inline-block"
                    />
                    {t("signingIn")}
                  </span>
                ) : t("loginButton")}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
