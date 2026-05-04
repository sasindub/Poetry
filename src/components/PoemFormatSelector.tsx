import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type PoemFormat = "classical" | "muwashah" | "zajal" | "prose-poem";

export interface FormatMeta {
  id: PoemFormat;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  accentColor: string;
  transformLines: (lines: string[]) => React.ReactNode;
}

export const FORMATS: FormatMeta[] = [
  {
    id: "classical",
    nameAr: "العمودية",
    nameEn: "Classical",
    descAr: "شطران متوازيان مع قافية موحّدة",
    descEn: "Two-hemistich lines with unified rhyme",
    icon: "⟨⟩",
    accentColor: "#C8A96E",
    transformLines: (lines) =>
      lines.filter(Boolean).map((line, i) => {
        const mid = Math.floor(line.length / 2);
        const a = line.slice(0, mid).trim() || line;
        const b = line.slice(mid).trim() || " ";
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
    nameAr: "النثر",
    nameEn: "Prose",
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

/* ─── Compact toolbar (above textarea, MS-Word style) ─── */
interface ToolbarProps {
  selectedFormat: PoemFormat | null;
  onSelectFormat: (f: PoemFormat) => void;
}

export function PoemFormatToolbar({ selectedFormat, onSelectFormat }: ToolbarProps) {
  const [hovered, setHovered] = useState<PoemFormat | null>(null);
  const tipFmt = hovered ? FORMATS.find((f) => f.id === hovered)! : null;

  return (
    <div className="mb-2">
      {/* Pills row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-foreground/30 tracking-widest uppercase mr-1 shrink-0">
          Format
        </span>
        {FORMATS.map((fmt) => {
          const active = selectedFormat === fmt.id;
          return (
            <motion.button
              key={fmt.id}
              type="button"
              onClick={() => onSelectFormat(fmt.id)}
              onHoverStart={() => setHovered(fmt.id)}
              onHoverEnd={() => setHovered(null)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.94 }}
              className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all select-none"
              style={{
                background: active ? `${fmt.accentColor}18` : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? fmt.accentColor + "55" : "rgba(255,255,255,0.08)"}`,
                color: active ? fmt.accentColor : "rgba(255,255,255,0.42)",
                boxShadow: active ? `0 0 10px ${fmt.accentColor}22` : "none",
              }}
            >
              <span className="text-[13px] leading-none">{fmt.icon}</span>
              <span className="font-arabic" dir="rtl">{fmt.nameAr}</span>
              {active && (
                <motion.span
                  layoutId="toolbar-active-dot"
                  className="w-1 h-1 rounded-full ml-0.5"
                  style={{ background: fmt.accentColor }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Inline tooltip */}
      <AnimatePresence mode="wait">
        {tipFmt && (
          <motion.div
            key={tipFmt.id}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="mt-1.5 flex items-center gap-2 px-2.5 py-1 rounded-lg w-fit"
            style={{
              background: `${tipFmt.accentColor}0C`,
              border: `1px solid ${tipFmt.accentColor}22`,
            }}
          >
            <span className="text-xs" style={{ color: tipFmt.accentColor }}>{tipFmt.icon}</span>
            <span className="text-[10px] font-arabic" style={{ color: tipFmt.accentColor }} dir="rtl">
              {tipFmt.descAr}
            </span>
            <span className="text-[10px] text-foreground/30 hidden sm:inline">· {tipFmt.descEn}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Standalone preview panel ─── */
interface PreviewProps {
  poemContent: string;
  poemTitle?: string;
  selectedFormat: PoemFormat | null;
}

export function PoemFormatPreview({ poemContent, poemTitle, selectedFormat }: PreviewProps) {
  const meta = selectedFormat ? FORMATS.find((f) => f.id === selectedFormat)! : null;
  const lines = poemContent.split("\n");
  const hasContent = poemContent.trim().length > 0;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-2" style={{ flexShrink: 0 }}>
        <div className="flex items-center gap-2">
          <div
            className="w-0.5 h-4 rounded-full transition-all duration-300"
            style={{
              background: meta
                ? `linear-gradient(to bottom, ${meta.accentColor}, ${meta.accentColor}44)`
                : "rgba(255,255,255,0.1)",
            }}
          />
          <span className="text-[10px] font-semibold tracking-widest uppercase text-foreground/40">
            Live Preview
          </span>
        </div>
        <AnimatePresence mode="wait">
          {meta && (
            <motion.span
              key={meta.id}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
              className="text-[10px] font-arabic px-2 py-0.5 rounded-full border"
              style={{
                color: meta.accentColor,
                borderColor: `${meta.accentColor}30`,
                background: `${meta.accentColor}0E`,
              }}
              dir="rtl"
            >
              {meta.nameAr}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Panel */}
      <div
        className="relative rounded-xl flex flex-col"
        style={{
          flex: "1 1 0",
          minHeight: 0,
          overflow: "hidden",
          background: "rgba(8,18,32,0.65)",
          border: `1px solid ${meta ? meta.accentColor + "20" : "rgba(255,255,255,0.06)"}`,
          boxShadow: meta
            ? `0 0 0 1px ${meta.accentColor}06, 0 8px 32px rgba(0,0,0,0.3)`
            : "0 8px 32px rgba(0,0,0,0.2)",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Top shimmer */}
        <div
          className="h-px w-full shrink-0 transition-all duration-500"
          style={{
            background: meta
              ? `linear-gradient(to right, transparent, ${meta.accentColor}70, transparent)`
              : "transparent",
          }}
        />

        {/* Poem title inside preview */}
        <AnimatePresence>
          {poemTitle && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 px-5 pt-4 pb-3 border-b flex flex-col items-center gap-1"
              style={{ borderColor: meta ? `${meta.accentColor}18` : "rgba(255,255,255,0.06)" }}
              dir="rtl"
            >
              <span
                className="text-base font-arabic font-bold leading-snug text-center"
                style={{ color: meta ? meta.accentColor : "rgba(200,169,110,0.7)" }}
              >
                {poemTitle}
              </span>
              <div
                className="w-10 h-px"
                style={{
                  background: meta
                    ? `linear-gradient(to right, transparent, ${meta.accentColor}60, transparent)`
                    : "rgba(200,169,110,0.25)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Watermarks */}
        <div
          className="absolute top-3 left-3 text-lg opacity-[0.06] select-none pointer-events-none font-arabic"
          style={{ color: meta?.accentColor ?? "#C8A96E" }}
        >
          ﷽
        </div>
        <div
          className="absolute bottom-3 right-3 text-xs opacity-[0.06] select-none pointer-events-none"
          style={{ color: meta?.accentColor ?? "#C8A96E" }}
        >
          ✦
        </div>

        {/* Scrollable content */}
        <div className="relative z-10 flex-1 overflow-y-auto px-5 py-5" dir="rtl">
          <AnimatePresence mode="wait">
            {!meta ? (
              <motion.div
                key="no-format"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[140px] gap-2 text-center"
              >
                <span className="text-3xl opacity-10 select-none">◈</span>
                <p className="text-[10px] text-foreground/25 font-arabic" dir="rtl">
                  اختر تنسيقاً لترى المعاينة
                </p>
                <p className="text-[9px] text-foreground/18">Select a format above to preview</p>
              </motion.div>
            ) : !hasContent ? (
              <motion.div
                key="no-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[140px] gap-2 text-center"
              >
                <span
                  className="text-3xl opacity-15 select-none"
                  style={{ color: meta.accentColor }}
                >
                  {meta.icon}
                </span>
                <p className="text-[10px] text-foreground/28 font-arabic" dir="rtl">
                  اكتب القصيدة لترى المعاينة هنا
                </p>
                <p className="text-[9px] text-foreground/18">Type your poem to see a live preview</p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedFormat + "|" + poemContent}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="font-arabic text-foreground/88 leading-loose"
                style={{ fontSize: "0.97rem" }}
              >
                {meta.transformLines(lines)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom shimmer */}
        <div
          className="h-px w-full shrink-0 transition-all duration-500"
          style={{
            background: meta
              ? `linear-gradient(to right, transparent, ${meta.accentColor}35, transparent)`
              : "transparent",
          }}
        />
      </div>
    </div>
  );
}
