import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type PoemFormat =
  | "nabati"
  | "amudi"
  | "lazma"
  | "wanna"
  | "taf3ila";

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
  /* ── 1. النبطي ── Image 1 & 5
     Full-width single lines, right-aligned, no split.
     Consistent end-rhyme running through all lines.
     Colloquial Gulf Arabic dialect.                          */
  {
    id: "nabati",
    nameAr: "النبطي",
    nameEn: "Nabati",
    descAr: "أبيات كاملة على سطر واحد بقافية موحّدة",
    descEn: "Full-width single lines with unified end-rhyme",
    icon: "◆",
    accentColor: "#C8A96E",
    transformLines: (lines) => {
      const nonEmpty = lines.filter(Boolean);
      if (nonEmpty.length === 0) return null;
      return nonEmpty.map((line, i) => (
        <div
          key={i}
          className="py-1.5 text-right font-arabic leading-loose"
          style={{ borderBottom: "1px solid rgba(200,169,110,0.07)" }}
        >
          {line}
        </div>
      ));
    },
  },

  /* ── 2. العمودي ── Images 2 & 3
     True two-hemistich split: right half | left half per line.
     Generous spacing between couplet pairs (every 2 lines).
     Formal Arabic (فصيح).                                    */
  {
    id: "amudi",
    nameAr: "العمودي",
    nameEn: "Amudi",
    descAr: "شطران متوازيان لكل بيت مع مسافة بين الأبيات",
    descEn: "Two-hemistich split per line, grouped in couplets",
    icon: "⟨⟩",
    accentColor: "#7CB9A8",
    transformLines: (lines) => {
      const nonEmpty = lines.filter(Boolean);
      if (nonEmpty.length === 0) return null;
      // Group into couplet pairs
      const pairs: string[][] = [];
      for (let i = 0; i < nonEmpty.length; i += 2)
        pairs.push(nonEmpty.slice(i, i + 2));
      return pairs.map((pair, pi) => (
        <div key={pi} className="mb-5">
          {pair.map((line, li) => {
            const mid = Math.ceil(line.length / 2);
            const right = line.slice(0, mid).trim() || line;
            const left  = line.slice(mid).trim() || " ";
            return (
              <div
                key={li}
                className="grid gap-8 py-1 text-center font-arabic"
                style={{ gridTemplateColumns: "1fr 1px 1fr" }}
              >
                <span className="text-right">{right}</span>
                <span
                  className="self-stretch"
                  style={{ background: "rgba(124,185,168,0.18)" }}
                />
                <span className="text-left">{left}</span>
              </div>
            );
          })}
        </div>
      ));
    },
  },

  /* ── 3. اللازمة (مردّد) ── Image 4
     Nabati with a repeating refrain line.
     User writes: normal lines then a blank line marks the refrain.
     The first line typed becomes the refrain (لازمة) and is
     repeated centered after every stanza of 2 lines.          */
  {
    id: "lazma",
    nameAr: "اللازمة",
    nameEn: "Lazma",
    descAr: "شعر نبطي بلازمة مكرّرة بعد كل مقطع",
    descEn: "Nabati with a repeating refrain after each stanza",
    icon: "↻",
    accentColor: "#B07CC8",
    transformLines: (lines) => {
      const all = lines.filter(Boolean);
      if (all.length === 0) return null;
      // First line is the refrain
      const refrain = all[0];
      const rest = all.slice(1);
      // Group remaining lines into stanzas of 2
      const stanzas: string[][] = [];
      for (let i = 0; i < rest.length; i += 2)
        stanzas.push(rest.slice(i, i + 2));

      const RefrainLine = ({ first }: { first?: boolean }) => (
        <div
          className="text-center font-arabic py-2 my-2 mx-auto"
          style={{
            color: "#B07CC8",
            fontSize: "0.9rem",
            letterSpacing: "0.05em",
            borderTop: first ? "none" : "1px solid rgba(176,124,200,0.18)",
            borderBottom: "1px solid rgba(176,124,200,0.18)",
          }}
        >
          {refrain}
        </div>
      );

      return (
        <div>
          <RefrainLine first />
          {stanzas.map((stanza, si) => (
            <div key={si}>
              <div className="my-2">
                {stanza.map((line, li) => (
                  <div key={li} className="py-1 text-right font-arabic leading-loose">
                    {line}
                  </div>
                ))}
              </div>
              <RefrainLine />
            </div>
          ))}
        </div>
      );
    },
  },

  /* ── 4. الونّة ── Image 6
     Nabati ghazal with DUAL rhyme scheme shown as two columns.
     Right column: lines ending with rhyme-A (e.g. -نسايم)
     Left column:  lines ending with rhyme-B (e.g. -جداه)
     User writes odd lines (right col) then even lines (left col).  */
  {
    id: "wanna",
    nameAr: "الونّة",
    nameEn: "Wanna",
    descAr: "غزل نبطي بعمودين بقافيتين متناوبتين",
    descEn: "Nabati ghazal with dual alternating rhyme columns",
    icon: "❧",
    accentColor: "#E87C9A",
    transformLines: (lines) => {
      const nonEmpty = lines.filter(Boolean);
      if (nonEmpty.length === 0) return null;
      // Pair each odd line (right) with next even line (left)
      const pairs: [string, string][] = [];
      for (let i = 0; i < nonEmpty.length; i += 2)
        pairs.push([nonEmpty[i], nonEmpty[i + 1] ?? ""]);
      return (
        <div>
          {pairs.map(([right, left], pi) => (
            <div
              key={pi}
              className="grid gap-4 py-2 font-arabic"
              style={{
                gridTemplateColumns: "1fr 1fr",
                borderBottom: "1px solid rgba(232,124,154,0.10)",
              }}
            >
              <span className="text-right leading-loose">{right}</span>
              <span
                className="text-right leading-loose"
                style={{ opacity: left ? 1 : 0.3, color: "rgba(232,124,154,0.85)" }}
              >
                {left || "—"}
              </span>
            </div>
          ))}
        </div>
      );
    },
  },

  /* ── 5. التفعيلة ── Image 7
     Modern free verse — each line on its own, varying lengths.
     Very short lines (≤ 4 chars) get centered and enlarged
     to match the dramatic single-word effect seen in the image. */
  {
    id: "taf3ila",
    nameAr: "التفعيلة",
    nameEn: "Free Verse",
    descAr: "شعر حرّ بأسطر متفاوتة الطول بلا وزن مقيّد",
    descEn: "Modern free verse with variable line lengths",
    icon: "〜",
    accentColor: "#7A9ED4",
    transformLines: (lines) => {
      const nonEmpty = lines.filter(Boolean);
      if (nonEmpty.length === 0) return null;
      return nonEmpty.map((line, i) => {
        const isShort = line.trim().length <= 4;
        return (
          <div
            key={i}
            className="font-arabic leading-loose"
            style={{
              textAlign: isShort ? "center" : "right",
              fontSize: isShort ? "1.15rem" : "0.88rem",
              fontWeight: isShort ? 600 : 400,
              marginTop: isShort ? "1rem" : "0.1rem",
              marginBottom: isShort ? "0.75rem" : "0.1rem",
              color: isShort ? "#7A9ED4" : "inherit",
              paddingRight: isShort ? 0 : `${Math.min((nonEmpty.length - i) * 2, 32)}px`,
            }}
          >
            {line}
          </div>
        );
      });
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
        {/* Description bar */}
        <div
          className="shrink-0 flex items-center gap-2 px-3 border-b"
          style={{
            height: "37px",
            background: "rgba(255,255,255,0.025)",
            borderColor: meta ? meta.accentColor + "18" : "rgba(255,255,255,0.06)",
            transition: "border-color 0.3s",
          }}
        >
          <AnimatePresence mode="wait">
            {meta ? (
              <motion.div
                key={selectedFormat!}
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.16 }}
                className="flex items-center gap-2 w-full"
              >
                <span className="text-[13px] leading-none shrink-0" style={{ color: meta.accentColor }}>{meta.icon}</span>
                <span className="text-[10px] font-arabic truncate" style={{ color: meta.accentColor }} dir="rtl">{meta.descAr}</span>
                <span className="text-[10px] text-foreground/30 hidden sm:inline shrink-0 ml-1">· {meta.descEn}</span>
              </motion.div>
            ) : (
              <motion.span key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-[10px] text-foreground/25">
                Select a format above to preview
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Top shimmer */}
        <div
          className="h-px w-full shrink-0 transition-all duration-500"
          style={{
            background: meta
              ? `linear-gradient(to right, transparent, ${meta.accentColor}70, transparent)`
              : "transparent",
          }}
        />

        {/* Poem title */}
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
        <div
          className="relative z-10 flex-1 px-5 py-5"
          dir="rtl"
          style={{ overflowY: "auto", overflowX: "hidden" }}
        >
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
                style={{
                  fontSize: "0.88rem",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  maxWidth: "100%",
                }}
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
