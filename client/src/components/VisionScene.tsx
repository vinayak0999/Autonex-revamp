import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, Factory, Cctv, Layers, Award, ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────────────── */
const CARDS = [
  {
    Icon:        Banknote,
    stat:        "50×",
    statSub:     "lower cost",
    title:       "20–50× Lower Cost",
    description: "Optimised AI pipeline built for Indian industrial scale. Not priced for Fortune 500 budgets.",
    color:       "#62AADE",
    darkColor:   "rgba(98,170,222,0.08)",
    tag:         "COST ADVANTAGE",
  },
  {
    Icon:        Factory,
    stat:        "100%",
    statSub:     "custom-trained",
    title:       "Trained on Your Factory",
    description: "We train on your footage, your machines, your conditions. Nothing generic. Nothing off-the-shelf.",
    color:       "#34bfbf",
    darkColor:   "rgba(52,191,191,0.08)",
    tag:         "CUSTOM AI",
  },
  {
    Icon:        Cctv,
    stat:        "₹0",
    statSub:     "new hardware",
    title:       "Works on Existing Cameras",
    description: "No rip-and-replace. No new hardware budget. Your current CCTV is all we need to go live.",
    color:       "#7c9fe8",
    darkColor:   "rgba(124,159,232,0.08)",
    tag:         "ZERO CAPEX",
  },
  {
    Icon:        Layers,
    stat:        "7",
    statSub:     "days to go live",
    title:       "Start with One Module",
    description: "Pick the product that solves your biggest pain. Prove ROI. Then expand. No big-bang commitment.",
    color:       "#8b9fe8",
    darkColor:   "rgba(139,159,232,0.08)",
    tag:         "FAST DEPLOY",
  },
  {
    Icon:        Award,
    stat:        "IIT",
    statSub:     "Bombay patent",
    title:       "Patent-Published Tech",
    description: "Digital Twin simulation patent-published at IIT Bombay. Proprietary IP — not a wrapper around someone else's API.",
    color:       "#62AADE",
    darkColor:   "rgba(98,170,222,0.06)",
    tag:         "DEEP TECH",
  },
];

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
const wrap = (i: number, len: number) => ((i % len) + len) % len;

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function VisionScene() {
  const [active, setActive]   = useState(0);
  const [paused, setPaused]   = useState(false);
  const [dir,    setDir]      = useState(1);           // 1 = fwd, -1 = back

  /* Auto-advance */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDir(1);
      setActive(a => wrap(a + 1, CARDS.length));
    }, 4000);
    return () => clearInterval(id);
  }, [paused]);

  const goNext = useCallback(() => {
    setPaused(true);
    setDir(1);
    setActive(a => wrap(a + 1, CARDS.length));
    setTimeout(() => setPaused(false), 6000);
  }, []);

  const goPrev = useCallback(() => {
    setPaused(true);
    setDir(-1);
    setActive(a => wrap(a - 1, CARDS.length));
    setTimeout(() => setPaused(false), 6000);
  }, []);

  const card    = CARDS[active];
  const prevIdx = wrap(active - 1, CARDS.length);
  const nextIdx = wrap(active + 1, CARDS.length);

  return (
    <section
      id="why-autonex"
      className="relative overflow-hidden"
      style={{ minHeight: "100vh", background: "transparent" }}
    >
      {/* ── Subtle section overlay so cards pop over particles ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(6,13,31,0.55) 0%, transparent 100%)",
      }} />

      {/* ── Grid texture ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* ── Header ── */}
      <div className="relative z-10 text-center pt-24 pb-16 px-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-black tracking-[0.3em] uppercase mb-4"
          style={{ color: "#60a5fa" }}
        >
          Why Autonex
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.02] tracking-tight"
        >
          Deep tech.<br />
          <span style={{
            background: "linear-gradient(135deg, #1a4fa8 0%, #2560c8 40%, #4a8fd4 75%, #62AADE 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Nothing generic.
          </span>
        </motion.h2>
      </div>

      {/* ── 3-card carousel ── */}
      <div className="relative z-10 flex items-center justify-center px-4" style={{ paddingBottom: 100 }}>

        {/* Side: PREV card */}
        <motion.div
          key={`prev-${prevIdx}`}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          className="hidden lg:flex flex-col cursor-pointer select-none"
          style={{ width: 240, flexShrink: 0, marginRight: -40 }}
          onClick={goPrev}
        >
          <SideCard card={CARDS[prevIdx]} />
        </motion.div>

        {/* Center: ACTIVE card */}
        <div style={{ position: "relative", zIndex: 10, flexShrink: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`active-${active}`}
              initial={{ opacity: 0, x: dir > 0 ? 120 : -120, scale: 0.88 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: dir > 0 ? -120 : 120, scale: 0.88 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ActiveCard card={card} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Side: NEXT card */}
        <motion.div
          key={`next-${nextIdx}`}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          className="hidden lg:flex flex-col cursor-pointer select-none"
          style={{ width: 240, flexShrink: 0, marginLeft: -40 }}
          onClick={goNext}
        >
          <SideCard card={CARDS[nextIdx]} />
        </motion.div>
      </div>

      {/* ── Controls ── */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20, zIndex: 20,
      }}>
        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 8 }}>
          {CARDS.map((c, i) => (
            <button
              key={i}
              onClick={() => { setPaused(true); setDir(i > active ? 1 : -1); setActive(i); setTimeout(() => setPaused(false), 6000); }}
              style={{
                width:  i === active ? 28 : 8,
                height: 8,
                borderRadius: 99,
                background: i === active ? card.color : "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: i === active ? `0 0 12px ${card.color}80` : "none",
              }}
            />
          ))}
        </div>

        {/* Prev / Next buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={goPrev}
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: `1px solid rgba(255,255,255,0.12)`,
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `${card.color}25`)}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goNext}
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: `1px solid rgba(255,255,255,0.12)`,
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `${card.color}25`)}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Active (center) card ───────────────────────────────────────────────────── */
function ActiveCard({ card }: { card: typeof CARDS[0] }) {
  const { Icon, stat, statSub, title, description, color, darkColor, tag } = card;
  return (
    <div style={{
      width: "min(88vw, 420px)",
      borderRadius: 28,
      overflow: "hidden",
      background: `linear-gradient(145deg, ${darkColor} 0%, rgba(6,13,31,0.92) 100%)`,
      border: `1.5px solid ${color}55`,
      boxShadow: `0 0 0 1px ${color}15, 0 32px 80px rgba(0,0,0,0.75), 0 0 60px ${color}30`,
      backdropFilter: "blur(12px)",
      position: "relative",
    }}>
      {/* Glowing top bar */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, transparent, ${color}, ${color}80, transparent)`,
      }} />

      {/* Tag label */}
      <div style={{ padding: "20px 24px 0" }}>
        <span style={{
          fontSize: 9, fontWeight: 900, letterSpacing: "0.2em",
          color, background: `${color}15`,
          border: `1px solid ${color}30`,
          padding: "4px 10px", borderRadius: 99,
        }}>
          {tag}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Icon + Stat row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          {/* Icon circle */}
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: `${color}18`, border: `1.5px solid ${color}35`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 30px ${color}30`,
          }}>
            <Icon size={30} style={{ color }} strokeWidth={1.5} />
          </div>

          {/* Big stat */}
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: 52, fontWeight: 900, lineHeight: 1,
              background: `linear-gradient(135deg, #fff 0%, ${color} 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "-0.03em",
            }}>
              {stat}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {statSub}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${color}30, transparent)` }} />

        {/* Text */}
        <div>
          <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: 10 }}>
            {title}
          </h3>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "rgba(255,255,255,0.52)" }}>
            {description}
          </p>
        </div>

        {/* Bottom glow strip */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 16px", borderRadius: 12,
          background: `${color}0d`, border: `1px solid ${color}20`,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: color, boxShadow: `0 0 8px ${color}`,
            animation: "pulse 2s infinite",
          }} />
          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
            Live across Indian factories
          </span>
        </div>
      </div>

      {/* Corner glow */}
      <div style={{
        position: "absolute", bottom: -40, right: -40,
        width: 140, height: 140, borderRadius: "50%",
        background: `${color}15`, filter: "blur(40px)", pointerEvents: "none",
      }} />
    </div>
  );
}

/* ─── Side (prev/next) card ──────────────────────────────────────────────────── */
function SideCard({ card }: { card: typeof CARDS[0] }) {
  const { Icon, stat, title, color, darkColor } = card;
  return (
    <div style={{
      borderRadius: 20,
      background: `linear-gradient(145deg, ${darkColor} 0%, rgba(6,13,31,0.85) 100%)`,
      border: `1px solid ${color}30`,
      boxShadow: `0 16px 40px rgba(0,0,0,0.5)`,
      backdropFilter: "blur(8px)",
      padding: "24px 20px",
      opacity: 0.55,
      display: "flex", flexDirection: "column", gap: 12,
      transition: "opacity 0.3s",
    }}
    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "0.55")}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={20} style={{ color }} strokeWidth={1.5} />
        </div>
        <div style={{
          fontSize: 26, fontWeight: 900, color,
          letterSpacing: "-0.03em", lineHeight: 1,
        }}>
          {stat}
        </div>
      </div>
      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", lineHeight: 1.3 }}>
        {title}
      </div>
      <div style={{ height: 2, background: `linear-gradient(90deg, ${color}50, transparent)`, borderRadius: 2 }} />
    </div>
  );
}
