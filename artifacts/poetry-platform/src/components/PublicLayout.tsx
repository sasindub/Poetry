import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";

export function PublicLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/#about", label: t("about") },
    { href: "/#categories", label: t("poemTypes") },
    { href: "/submit", label: t("submit") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-navy" fill="currentColor">
                  <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gold font-display tracking-wider opacity-70">أبوظبي للتراث</div>
                <div className="text-sm font-semibold text-foreground leading-none">AHA Poetry</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors duration-200 ${
                    location === link.href
                      ? isDark ? "text-gold" : "text-[#8B5E0A] font-medium"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg gold-gradient text-navy text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                {t("login")}
              </Link>
              {/* Mobile menu button */}
              <button className="md:hidden text-foreground/70 hover:text-foreground p-1" onClick={() => setMenuOpen(!menuOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gold/10 bg-background/95 backdrop-blur-xl"
            >
              <div className="px-4 py-3 space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block py-2 text-foreground/70 hover:text-foreground text-sm" onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <Link href="/login" className="block py-2 text-gold text-sm font-semibold" onClick={() => setMenuOpen(false)}>
                  {t("login")}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className={`border-t border-gold/10 py-12 mt-20 ${isDark ? "bg-[#060e1c]" : "bg-[#f0e6ca]"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-navy" fill="currentColor">
                    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
                  </svg>
                </div>
                <span className="font-display text-lg font-semibold gold-gradient-text">AHA Poetry</span>
              </div>
              <p className="text-foreground/50 text-sm leading-relaxed">
                هيئة أبوظبي للتراث — Abu Dhabi Heritage Authority
              </p>
            </div>
            <div>
              <h4 className="text-gold text-sm font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2">
                {navLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="block text-foreground/50 hover:text-foreground text-sm transition-colors">{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-gold text-sm font-semibold mb-3">Contact</h4>
              <p className="text-foreground/50 text-sm">poetry@adheritage.ae</p>
              <p className="text-foreground/50 text-sm mt-1">Abu Dhabi, UAE</p>
            </div>
          </div>
          <div className="border-t border-gold/10 pt-6 text-center">
            <p className="text-foreground/30 text-xs">
              2026 Abu Dhabi Heritage Authority. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
