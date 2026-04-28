import { useLanguage } from "@/hooks/useLanguage";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/30 text-gold text-sm font-medium hover:bg-gold/10 transition-all duration-200"
      title={lang === "en" ? "Switch to Arabic" : "التحويل للإنجليزية"}
    >
      <span className="text-xs opacity-60">{lang === "en" ? "AR" : "EN"}</span>
      <span className="w-px h-3 bg-gold/30" />
      <span className="text-xs font-bold">{lang === "en" ? "عربي" : "English"}</span>
    </button>
  );
}
