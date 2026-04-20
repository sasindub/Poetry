import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-14 h-7 rounded-full border border-gold/30 bg-gold/5 hover:bg-gold/10 transition-colors overflow-hidden flex items-center px-1"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Track */}
      <motion.div
        className="absolute inset-0.5 rounded-full"
        animate={{
          background: isDark
            ? "linear-gradient(135deg, rgba(10,22,40,0.8), rgba(14,30,56,0.8))"
            : "linear-gradient(135deg, rgba(245,237,212,0.8), rgba(255,248,230,0.8))",
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Thumb */}
      <motion.div
        className="relative z-10 w-5 h-5 rounded-full shadow-md flex items-center justify-center text-xs"
        animate={{
          x: isDark ? 0 : 28,
          background: isDark
            ? "linear-gradient(135deg, #1a2a4a, #0a1628)"
            : "linear-gradient(135deg, #C8A96E, #E8C97A)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -30, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 30, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-gold" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: -30, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 30, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-navy" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="12" cy="12" r="5" />
                <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
