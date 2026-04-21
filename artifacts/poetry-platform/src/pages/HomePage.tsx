import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { PublicLayout } from "@/components/PublicLayout";
import { FloatingMusicNotes } from "@/components/FloatingMusicNotes";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { useGetDashboardStats } from "@workspace/api-client-react";

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const juryMembers = [
  { name: "Prof. Ahmad Al Mazrouei", nameAr: "أ.د. أحمد المزروعي", title: "Professor of Arabic Literature", titleAr: "أستاذ الأدب العربي" },
  { name: "Dr. Layla Al Suwaidi", nameAr: "د. ليلى السويدي", title: "Poetry Critic & Author", titleAr: "ناقدة شعرية ومؤلفة" },
  { name: "Dr. Hassan Al Khatib", nameAr: "د. حسن الخطيب", title: "Expert in Classical Prosody", titleAr: "خبير في العروض الكلاسيكي" },
];

export default function HomePage() {
  const { t, lang } = useLanguage();
  const { isDark } = useTheme();
  const { data: stats } = useGetDashboardStats();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const poemTypes = [
    { key: "nabati", title: t("nabati"), desc: t("nabatiDesc"), color: isDark ? "from-amber-900/40 to-amber-800/20" : "from-amber-100 to-amber-50", border: isDark ? "border-amber-700/20" : "border-amber-200" },
    { key: "classical", title: t("classical"), desc: t("classicalDesc"), color: isDark ? "from-teal-900/40 to-teal-800/20" : "from-teal-50 to-emerald-50", border: isDark ? "border-teal-700/20" : "border-teal-200" },
    { key: "modern", title: t("modern"), desc: t("modernDesc"), color: isDark ? "from-indigo-900/40 to-indigo-800/20" : "from-indigo-50 to-blue-50", border: isDark ? "border-indigo-700/20" : "border-indigo-200" },
  ];

  return (
    <PublicLayout>
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-[#060d1f] via-[#0a1628] to-[#06100f]" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#f5edd4] via-[#f0e4c0] to-[#e8d8a8]" />
          )}

          {/* Animated glow orbs */}
          <motion.div
            className="absolute inset-0"
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            style={{
              backgroundImage: isDark
                ? "radial-gradient(ellipse at 30% 50%, rgba(200,169,110,0.18) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(26,122,107,0.12) 0%, transparent 50%)"
                : "radial-gradient(ellipse at 30% 50%, rgba(200,169,110,0.35) 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, rgba(26,122,107,0.15) 0%, transparent 50%)",
            }}
          />

          {/* Second pulsing orb */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(200,169,110,0.15) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Arabic pattern overlay */}
          <div className={`absolute inset-0 arabic-pattern ${isDark ? "opacity-30" : "opacity-20"}`} />

          {/* FLOATING MUSIC NOTES */}
          <FloatingMusicNotes
            count={14}
            rings
            equalizer={false}
            goldColor={isDark ? "#C8A96E" : "#B8820C"}
          />
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/8 text-gold text-xs font-medium mb-6 tracking-wider backdrop-blur-sm"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-gold"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span>هيئة أبوظبي للتراث</span>
            <span className="text-gold/40">|</span>
            <span>Abu Dhabi Heritage Authority</span>
          </motion.div>

          {/* Arabic calligraphy */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-4"
          >
            <p
              className={`text-5xl md:text-7xl font-arabic leading-tight ${isDark ? "text-gold/80" : "text-[#8B5E0A]/80"}`}
              dir="rtl"
            >
              ديوان الوطن
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight"
          >
            {t("heroTitle")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {t("heroDescription")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/submit"
                className="inline-block px-8 py-3.5 rounded-xl gold-gradient text-navy font-bold text-base hover:opacity-90 transition-all shadow-lg shadow-gold/25"
              >
                {t("submitNow")}
              </Link>
            </motion.div>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl border border-gold/30 text-foreground/80 font-semibold text-base hover:bg-gold/10 transition-all backdrop-blur-sm"
            >
              {t("learnMore")}
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gold/30 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-gold rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 border-y border-gold/10 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: stats?.totalSubmissions ?? 247, label: t("totalSubmissions") },
            { value: stats?.approved ?? 86, label: t("approvedPoems") },
            { value: stats?.totalJuryMembers ?? 12, label: t("juryMembers") },
            { value: 24, label: t("nationsRepresented") },
          ].map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold gold-gradient-text mb-2">
                  <AnimatedCounter target={stat.value} />
                </div>
                <div className="text-sm text-foreground/50">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div>
              <div className="text-xs text-gold font-semibold tracking-widest uppercase mb-3">{t("about")}</div>
              <h2 className="text-4xl font-display font-bold mb-6 leading-tight">{t("aboutTitle")}</h2>
              <p className="text-foreground/60 leading-relaxed mb-6">{t("aboutDescription")}</p>
              <div className="space-y-3">
                {["Transparent evaluation process", "Expert jury panels", "Preserving cultural heritage", "Celebrating poetic excellence"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-foreground/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=600&q=80"
                  alt="Arabic calligraphy"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-background/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-3xl text-gold font-arabic" dir="rtl">الشعر ديوان العرب</p>
                  <p className="text-sm text-foreground/60 mt-1">Poetry is the record of the Arabs</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full rounded-2xl border border-gold/20 pointer-events-none" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== HOW TO PARTICIPATE ===== */}
      <section className="py-24 bg-card/20 border-y border-gold/10">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="text-xs text-gold font-semibold tracking-widest uppercase mb-3">{t("howToParticipate")}</div>
              <h2 className="text-4xl font-display font-bold">{t("howToParticipate")}</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "01", title: t("step1"), desc: t("step1Desc") },
              { num: "02", title: t("step2"), desc: t("step2Desc") },
              { num: "03", title: t("step3"), desc: t("step3Desc") },
              { num: "04", title: t("step4"), desc: t("step4Desc") },
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="relative">
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-gold/30 to-transparent z-10" />
                  )}
                  <motion.div
                    whileHover={{ y: -4, borderColor: "rgba(200,169,110,0.4)" }}
                    className="glass-panel rounded-xl p-6 h-full border border-gold/10 transition-colors"
                  >
                    <div className="text-5xl font-display font-bold gold-gradient-text opacity-30 mb-3">{step.num}</div>
                    <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-foreground/50 leading-relaxed">{step.desc}</p>
                  </motion.div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section id="categories" className="py-24 max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="text-xs text-gold font-semibold tracking-widest uppercase mb-3">{t("poemTypes")}</div>
            <h2 className="text-4xl font-display font-bold">{t("poemTypes")}</h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {poemTypes.map((type, i) => (
            <ScrollReveal key={type.key} delay={i * 0.15}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative rounded-2xl p-8 bg-gradient-to-br ${type.color} border ${type.border} hover:border-gold/40 transition-colors overflow-hidden`}
              >
                <div className={`absolute top-4 right-4 text-4xl font-display font-bold ${isDark ? "text-foreground/10" : "text-foreground/8"}`}>{String(i + 1).padStart(2, "0")}</div>
                <div className="text-gold text-2xl mb-4">✦</div>
                <h3 className="text-xl font-display font-bold mb-3">{type.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{type.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== JURY ===== */}
      <section className="py-24 bg-card/20 border-y border-gold/10">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="text-xs text-gold font-semibold tracking-widest uppercase mb-3">{t("jury")}</div>
              <h2 className="text-4xl font-display font-bold">Distinguished Jury</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {juryMembers.map((member, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="glass-panel rounded-xl p-6 border border-gold/10 hover:border-gold/30 transition-all text-center"
                >
                  <div className="w-20 h-20 rounded-full gold-gradient mx-auto mb-4 flex items-center justify-center text-navy text-2xl font-bold font-display shadow-lg shadow-gold/20">
                    {member.name.split(" ")[1]?.charAt(0) || "J"}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-1">
                    {lang === "ar" ? member.nameAr : member.name}
                  </h3>
                  <p className="text-sm text-foreground/50">
                    {lang === "ar" ? member.titleAr : member.title}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 max-w-4xl mx-auto px-4 text-center">
        <ScrollReveal>
          <motion.div
            className="relative rounded-3xl p-12 overflow-hidden"
            whileHover={{ scale: 1.01 }}
          >
            <div className={`absolute inset-0 rounded-3xl border border-gold/20 ${isDark ? "bg-gradient-to-br from-gold/8 via-card to-accent/8" : "bg-gradient-to-br from-gold/12 via-amber-50 to-teal-50/40"}`} />
            <div className="relative z-10">
              <div className="text-5xl font-arabic text-gold mb-4" dir="rtl">قدّم قصيدتك الآن</div>
              <h2 className="text-3xl font-display font-bold mb-4">{t("submitNow")}</h2>
              <p className="text-foreground/60 mb-8 max-w-xl mx-auto">
                Join hundreds of poets who have shared their voice with the nation. Your poem could be the next celebrated work in our national heritage.
              </p>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-xl gold-gradient text-navy font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-gold/25"
                >
                  {t("submitNow")}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </ScrollReveal>
      </section>
    </PublicLayout>
  );
}
