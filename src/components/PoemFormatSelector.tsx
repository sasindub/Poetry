import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type PoemFormat = "classical" | "muwashah" | "zajal" | "prose-poem";

interface FormatMeta {
  id: PoemFormat;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  accentColor: string;
  transformLines: (lines: string[]) => React.ReactNode;
}

const FORMATS: FormatMeta[] = [
  {
    id: "classical",
    nameAr: "القصيدة العمودية",
    nameEn: "Classical Qasida",
    descAr: "شطران متوازيان مع قافية موحّدة",
    descEn: "Two-hemistich lines with unified rhyme",
    icon: "⟨⟩",
    accentColor: "#C8A96E",
    transformLines: (lines) =>
      lines.filter(Boolean).map((line, i) => {
        const mid = Math.floor(line.length / 2);
        const a = line.slice(0, mid).trim() || line;
        const b = line.slice(mid).trim() || " ";
        return (
          <div key={i} className="grid grid-cols-2 gap-6 text-center py-1.5">
            <span className="border-r border-gold/20 pr-4">{a}</span>
            <span className="pl-4">{b}</span>
          </div>
        );
      }),
  },
  {
    id: "muwashah",
    nameAr: "الموشّح",
    nameEn: "Muwashah",
    descAr: "أبيات مقطّعة متعددة الأعجاز والأقفال",
    descEn: "Stanzas with alternating verses and refrains",
    icon: "❖",
    accentColor: "#7CB9A8",
    transformLines: (lines) => {
      const nonEmpty = lines.filter(Boolean);
      const stanzas: string[][] = [];
      for (let i = 0; i < nonEmpty.length; i += 3) stanzas.push(nonEmpty.slice(i, i + 3));
      if (stanzas.length === 0) return null;
      return stanzas.map((stanza, si) => (
        <div
          key={si}
          className="mb-4 rounded-xl p-4"
          style={{
            background: si % 2 === 0 ? "rgba(124,185,168,0.06)" : "rgba(200,169,110,0.05)",
            border: `1px solid ${si % 2 === 0 ? "rgba(124,185,168,0.18)" : "rgba(200,169,110,0.12)"}`,
          }}
        >
          <div className="text-[10px] tracking-widest uppercase mb-2 opacity-40 text-right font-sans">
            {si % 2 === 0 ? "غصن" : "قفل"} {si + 1}
          </div>
          {stanza.map((line, li) => (
            <div key={li} className="py-0.5 text-right leading-loose">{line}</div>
          ))}
        </div>
      ));
    },
  },
  {
    id: "zajal",
    nameAr: "الزجل",
    nameEn: "Zajal",
    descAr: "شعر عامّي ذو إيقاع حرّ وقوافٍ متشابكة",
    descEn: "Colloquial verse with interlaced rhymes",
    icon: "∿",
    accentColor: "#B07CC8",
    transformLines: (lines) => {
      const nonEmpty = lines.filter(Boolean);
      if (nonEmpty.length === 0) return null;
      return nonEmpty.map((line, i) => {
        const indented = i % 4 === 2 || i % 4 === 3;
        return (
          <div
            key={i}
            className="py-1 text-right"
            style={{
              paddingRight: indented ? "24px" : "0",
              borderRight: indented ? "2px solid rgba(176,124,200,0.35)" : "none",
              opacity: indented ? 0.8 : 1,
            }}
          >
            {line}
          </div>
        );
      });
    },
  },
  {
    id: "prose-poem",
    nameAr: "قصيدة النثر",
    nameEn: "Prose Poem",
    descAr: "كتابة شعرية حرّة بلا وزن أو قافية مقيّدة",
    descEn: "Free-form poetic prose without fixed meter",
    icon: "〜",
    accentColor: "#E8A87C",
    transformLines: (lines) => {
      const text = lines.filter(Boolean).join(" ");
      if (!text) return null;
      return (
        <p className="text-right font-arabic" style={{ lineHeight: "2.5", fontSize: "1rem" }}>
          {text}
        </p>
      );
    },
  },
];

interface Props {
  poemContent: string;
  selectedFormat: PoemFormat | null;
  onSelectFormat: (f: PoemFormat) => void;
}

export function PoemFormatSelector({ poemContent, selectedFormat, onSelectFormat }: Props) {
  const [hoveredFormat, setHoveredFormat] = useState<PoemFormat | null>(null);

  const lines = poemContent.split("\n");
  const hasContent = poemContent.trim().length > 0;

  const activeMeta = hoveredFormat
    ? FORMATS.find((f) => f.id === hoveredFormat)!
    : selectedFormat
    ? FORMATS.find((f) => f.id === selectedFormat)!
    : null;

  const selectedMeta = selectedFormat ? FORMATS.find((f) => f.id === selectedFormat)! : null;

  return (
    <div className="mt-6 space-y-4">
      {/* Divider header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-gold/55 select-none">
          Poem Format
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      </div>

      {/* Format picker cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FORMATS.map((fmt) => {
          const isSelected = selectedFormat === fmt.id;
          return (
            <motion.button
              key={fmt.id}
              type="button"
              onClick={() => onSelectFormat(fmt.id)}
              onHoverStart={() => setHoveredFormat(fmt.id)}
              onHoverEnd={() => setHoveredFormat(null)}
              whileHover={{ y: -3, scale: 1.025 }}
              whileTap={{ scale: 0.96 }}
              className="relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border cursor-pointer text-center outline-none focus-visible:ring-2"
              style={{
                background: isSelected
                  ? `${fmt.accentColor}12`
                  : "rgba(255,255,255,0.025)",
                borderColor: isSelected ? `${fmt.accentColor}55` : "rgba(255,255,255,0.08)",
                boxShadow: isSelected ? `0 4px 24px ${fmt.accentColor}18` : "none",
                transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
              }}
            >
              {/* Glow blob */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, ${fmt.accentColor}18 0%, transparent 70%)`,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Icon box */}
              <motion.div
                animate={{ scale: isSelected ? 1.12 : 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${fmt.accentColor}28, ${fmt.accentColor}12)`
                    : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${isSelected ? fmt.accentColor + "55" : "rgba(255,255,255,0.07)"}`,
                  color: isSelected ? fmt.accentColor : "rgba(255,255,255,0.4)",
                  boxShadow: isSelected ? `0 0 16px ${fmt.accentColor}35` : "none",
                  transition: "background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s",
                }}
              >
                {fmt.icon}
              </motion.div>

              {/* Text */}
              <div className="relative z-10 space-y-0.5">
                <div
                  className="text-[13px] font-arabic font-bold leading-snug"
                  style={{
                    color: isSelected ? fmt.accentColor : "rgba(255,255,255,0.65)",
                    transition: "color 0.2s",
                  }}
                  dir="rtl"
                >
                  {fmt.nameAr}
                </div>
                <div
                  className="text-[10px] leading-snug"
                  style={{
                    color: isSelected ? `${fmt.accentColor}99` : "rgba(255,255,255,0.28)",
                    transition: "color 0.2s",
                  }}
                >
                  {fmt.nameEn}
                </div>
              </div>

              {/* Check badge */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: fmt.accentColor }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l1.8 1.8 3.2-3.6" stroke="#0A1628" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Format description tooltip */}
      <AnimatePresence mode="wait">
        {activeMeta && (
          <motion.div
            key={activeMeta.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
            style={{
              background: `${activeMeta.accentColor}0A`,
              border: `1px solid ${activeMeta.accentColor}25`,
            }}
          >
            <span className="text-base shrink-0" style={{ color: activeMeta.accentColor }}>
              {activeMeta.icon}
            </span>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
              <span className="text-xs font-arabic" style={{ color: activeMeta.accentColor }} dir="rtl">
                {activeMeta.descAr}
              </span>
              <span className="text-foreground/20 text-xs">·</span>
              <span className="text-xs text-foreground/38">{activeMeta.descEn}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live preview */}
      <AnimatePresence>
        {selectedMeta && (
          <motion.div
            key={selectedMeta.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Preview header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-1 h-5 rounded-full"
                  style={{
                    background: `linear-gradient(to bottom, ${selectedMeta.accentColor}, ${selectedMeta.accentColor}44)`,
                  }}
                />
                <span className="text-[11px] font-semibold tracking-widest uppercase text-foreground/45">
                  Live Preview
                </span>
              </div>
              <span
                className="text-[11px] font-arabic px-2.5 py-1 rounded-full border"
                style={{
                  color: selectedMeta.accentColor,
                  borderColor: `${selectedMeta.accentColor}30`,
                  background: `${selectedMeta.accentColor}0E`,
                }}
                dir="rtl"
              >
                {selectedMeta.nameAr}
              </span>
            </div>

            {/* Preview card */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "rgba(8,18,32,0.72)",
                border: `1px solid ${selectedMeta.accentColor}20`,
                boxShadow: `0 0 0 1px ${selectedMeta.accentColor}08, 0 12px 40px rgba(0,0,0,0.35)`,
              }}
            >
              {/* Top shimmer bar */}
              <div
                className="h-px w-full"
                style={{
                  background: `linear-gradient(to right, transparent 0%, ${selectedMeta.accentColor}70 50%, transparent 100%)`,
                }}
              />

              {/* Watermark ornaments */}
              <div
                className="absolute top-3 left-4 text-xl opacity-[0.07] select-none pointer-events-none font-arabic"
                style={{ color: selectedMeta.accentColor }}
              >
                ﷽
              </div>
              <div
                className="absolute bottom-3 right-4 text-sm opacity-[0.07] select-none pointer-events-none"
                style={{ color: selectedMeta.accentColor }}
              >
                ✦
              </div>

              {/* Content area */}
              <div className="relative z-10 px-7 py-7 h-64 overflow-y-auto" dir="rtl">
                {hasContent ? (
                  <motion.div
                    key={selectedFormat + "|" + poemContent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.28 }}
                    className="font-arabic text-foreground/88 leading-loose"
                    style={{ fontSize: "1.02rem" }}
                  >
                    {selectedMeta.transformLines(lines)}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                    <span
                      className="text-4xl opacity-15 font-arabic select-none"
                      style={{ color: selectedMeta.accentColor }}
                    >
                      {selectedMeta.icon}
                    </span>
                    <p className="text-xs text-foreground/28 font-arabic" dir="rtl">
                      اكتب القصيدة أعلاه لترى المعاينة هنا
                    </p>
                    <p className="text-[10px] text-foreground/18">
                      Type your poem above to see a live preview
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom shimmer bar */}
              <div
                className="h-px w-full"
                style={{
                  background: `linear-gradient(to right, transparent 0%, ${selectedMeta.accentColor}35 50%, transparent 100%)`,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
