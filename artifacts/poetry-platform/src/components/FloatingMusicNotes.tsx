import { motion } from "framer-motion";

/* Musical note SVG shapes */
const NOTE_PATHS = [
  // Standard filled quarter note
  "M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z",
  // Eighth note beamed 
  "M9 3v9.25A3.5 3.5 0 1 0 11 15.5V7h6V3H9z",
  // Double beamed note
  "M5 3v8.5A2.5 2.5 0 1 0 7 14V9h8v5.5a2.5 2.5 0 1 0 2-2.45V3H5z",
];

interface NoteConfig {
  x: number;
  startY: string;
  delay: number;
  duration: number;
  scale: number;
  pathIndex: number;
  opacity: number;
  drift: number;
  rotate: number;
}

const NOTE_CONFIGS: NoteConfig[] = [
  { x: 5,  startY: "90%", delay: 0,    duration: 9,  scale: 1.2, pathIndex: 0, opacity: 0.13, drift: 18,  rotate: -5 },
  { x: 12, startY: "95%", delay: 1.5,  duration: 11, scale: 0.7, pathIndex: 1, opacity: 0.09, drift: -14, rotate: 8  },
  { x: 20, startY: "88%", delay: 3.0,  duration: 8,  scale: 1.0, pathIndex: 2, opacity: 0.12, drift: 22,  rotate: -3 },
  { x: 28, startY: "92%", delay: 0.5,  duration: 13, scale: 0.6, pathIndex: 0, opacity: 0.07, drift: -18, rotate: 6  },
  { x: 38, startY: "96%", delay: 2.0,  duration: 10, scale: 1.4, pathIndex: 1, opacity: 0.10, drift: 28,  rotate: -8 },
  { x: 48, startY: "90%", delay: 4.0,  duration: 9,  scale: 0.8, pathIndex: 2, opacity: 0.08, drift: -10, rotate: 4  },
  { x: 58, startY: "94%", delay: 1.0,  duration: 12, scale: 1.1, pathIndex: 0, opacity: 0.11, drift: 16,  rotate: -6 },
  { x: 67, startY: "88%", delay: 3.5,  duration: 8.5,scale: 0.65,pathIndex: 1, opacity: 0.07, drift: -22, rotate: 10 },
  { x: 77, startY: "92%", delay: 0.8,  duration: 10.5,scale:1.3, pathIndex: 2, opacity: 0.12, drift: 20,  rotate: -4 },
  { x: 87, startY: "96%", delay: 2.5,  duration: 11, scale: 0.75,pathIndex: 0, opacity: 0.09, drift: -12, rotate: 7  },
  { x: 93, startY: "90%", delay: 1.2,  duration: 9.5,scale: 0.9, pathIndex: 1, opacity: 0.10, drift: 14,  rotate: -2 },
  { x: 15, startY: "94%", delay: 5.0,  duration: 14, scale: 0.55,pathIndex: 2, opacity: 0.06, drift: -16, rotate: 5  },
  { x: 43, startY: "88%", delay: 6.0,  duration: 10, scale: 1.0, pathIndex: 0, opacity: 0.08, drift: 24,  rotate: -7 },
  { x: 72, startY: "96%", delay: 4.5,  duration: 12, scale: 0.8, pathIndex: 1, opacity: 0.07, drift: -12, rotate: 3  },
];

function FloatingNote({ cfg, goldColor }: { cfg: NoteConfig; goldColor: string }) {
  const w = 24 * cfg.scale;
  const h = 24 * cfg.scale;

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${cfg.x}%`, top: cfg.startY }}
      initial={{ y: 0, opacity: 0, x: 0, rotate: cfg.rotate }}
      animate={{
        y: [0, -120, -260, -420, -580, -760, -950],
        opacity: [0, cfg.opacity, cfg.opacity, cfg.opacity * 0.75, cfg.opacity * 0.45, cfg.opacity * 0.15, 0],
        x: [0, cfg.drift * 0.15, cfg.drift * 0.4, cfg.drift * 0.65, cfg.drift, cfg.drift * 1.1, cfg.drift * 0.9],
        rotate: [cfg.rotate, cfg.rotate + 8, cfg.rotate - 5, cfg.rotate + 10, cfg.rotate - 3, cfg.rotate + 6, cfg.rotate],
        scale: [cfg.scale * 0.5, cfg.scale, cfg.scale * 1.1, cfg.scale, cfg.scale * 0.85, cfg.scale * 0.6, 0.1],
      }}
      transition={{
        duration: cfg.duration,
        delay: cfg.delay,
        repeat: Infinity,
        ease: [0.25, 0.46, 0.45, 0.94],
        times: [0, 0.08, 0.25, 0.45, 0.65, 0.85, 1],
      }}
    >
      <svg
        width={w}
        height={h}
        viewBox="0 0 24 24"
        fill={goldColor}
        style={{ filter: cfg.scale < 0.65 ? "blur(0.5px)" : "none" }}
      >
        <path d={NOTE_PATHS[cfg.pathIndex % NOTE_PATHS.length]} />
      </svg>
    </motion.div>
  );
}

/* Expanding sound ring */
function SoundRing({ left, top, delay, size, color }: { left: string; top: string; delay: number; size: number; color: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full border"
      style={{
        left,
        top,
        width: size,
        height: size,
        borderColor: color,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 0.2, opacity: 0 }}
      animate={{
        scale: [0.2, 0.8, 1.6, 2.4],
        opacity: [0, 0.45, 0.18, 0],
      }}
      transition={{
        duration: 3.8,
        delay,
        repeat: Infinity,
        ease: "easeOut",
        times: [0, 0.25, 0.65, 1],
      }}
    />
  );
}

/* Pulsing beat dot */
function BeatDot({ left, top, delay, color }: { left: string; top: string; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{ left, top, width: 4, height: 4, background: color, transform: "translate(-50%,-50%)" }}
      animate={{
        scale: [1, 1.9, 1],
        opacity: [0.25, 0.65, 0.25],
        boxShadow: [`0 0 0px ${color}`, `0 0 10px 2px ${color}`, `0 0 0px ${color}`],
      }}
      transition={{
        duration: 1.6 + delay * 0.4,
        delay: delay * 0.25,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* Inline equalizer bar */
function EqBar({ height, delay, color }: { height: number; delay: number; color: string }) {
  return (
    <motion.div
      style={{ width: 3, borderRadius: 2, background: color, transformOrigin: "bottom" }}
      animate={{
        height: [4, height, height * 0.3, height * 0.85, height * 0.45, height * 1.05, 4],
        opacity: [0.3, 0.55, 0.35, 0.55, 0.35, 0.55, 0.3],
      }}
      transition={{
        duration: 1.15,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

interface FloatingMusicNotesProps {
  count?: number;
  rings?: boolean;
  equalizer?: boolean;
  goldColor?: string;
  className?: string;
}

export function FloatingMusicNotes({
  count = 14,
  rings = true,
  equalizer = true,
  goldColor = "#C8A96E",
  className = "",
}: FloatingMusicNotesProps) {
  const goldWithAlpha = (a: number) => {
    const hex = Math.round(a * 255).toString(16).padStart(2, "0");
    return `${goldColor}${hex}`;
  };

  const eqHeights = [18, 32, 24, 42, 28, 38, 20, 46, 26, 40, 22, 34];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Floating notes */}
      {NOTE_CONFIGS.slice(0, count).map((cfg, i) => (
        <FloatingNote key={i} cfg={cfg} goldColor={goldColor} />
      ))}

      {/* Sound rings */}
      {rings && (
        <>
          <SoundRing left="15%" top="45%" delay={0}   size={90}  color={goldWithAlpha(0.25)} />
          <SoundRing left="15%" top="45%" delay={1.3} size={90}  color={goldWithAlpha(0.18)} />
          <SoundRing left="75%" top="60%" delay={0.7} size={70}  color={goldWithAlpha(0.20)} />
          <SoundRing left="75%" top="60%" delay={2.0} size={70}  color={goldWithAlpha(0.13)} />
          <SoundRing left="50%" top="28%" delay={2.6} size={55}  color={goldWithAlpha(0.15)} />
          <SoundRing left="88%" top="35%" delay={1.5} size={48}  color={goldWithAlpha(0.12)} />
        </>
      )}

      {/* Beat dots */}
      <BeatDot left="8%"  top="32%" delay={0}   color={goldWithAlpha(0.7)} />
      <BeatDot left="23%" top="68%" delay={1.0}  color={goldWithAlpha(0.7)} />
      <BeatDot left="62%" top="42%" delay={0.5}  color={goldWithAlpha(0.7)} />
      <BeatDot left="88%" top="22%" delay={1.5}  color={goldWithAlpha(0.7)} />
      <BeatDot left="45%" top="78%" delay={0.8}  color={goldWithAlpha(0.7)} />
      <BeatDot left="35%" top="18%" delay={1.2}  color={goldWithAlpha(0.7)} />

      {/* Equalizer bars — bottom right corner */}
      {equalizer && (
        <div className="absolute bottom-8 right-8 flex items-end gap-[3px] opacity-25">
          {eqHeights.map((h, i) => (
            <EqBar key={i} height={h} delay={i * 0.1} color={goldColor} />
          ))}
        </div>
      )}
    </div>
  );
}
