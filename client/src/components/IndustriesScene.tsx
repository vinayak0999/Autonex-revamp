import {
  useRef, useState, useEffect, useLayoutEffect, useCallback, type CSSProperties
} from "react";
import {
  Package, Beaker, GitBranch, Activity, FileText, Factory, ChevronRight
} from "lucide-react";
import { Section, SectionHeader } from "./motion/Section";
import { SlideIn } from "./motion/Motion";
import { gsap, Flip, ScrollTrigger } from "@/lib/gsap";

// ─── Industry data ────────────────────────────────────────────────────────────
const industries = [
  {
    id: 0,
    icon: Package,
    name: "Corrugated Packaging",
    stat: "35%",
    statLabel: "Quality Improvement",
    features: [
      "Machine tracking & quality control",
      "Artwork quality checks at line speed",
      "Dispatch quantity auto-tracking",
    ],
    // Brand sapphire — primary identity
    color: "#62AADE",
    grad: "linear-gradient(135deg, rgba(98,170,222,0.16) 0%, rgba(22,55,145,0.07) 100%)",
    glow: "rgba(98,170,222,0.20)",
  },
  {
    id: 1,
    icon: Beaker,
    name: "Plastics Manufacturing",
    stat: "42%",
    statLabel: "Energy Savings",
    features: [
      "Predictive quality control",
      "Energy optimisation per run",
      "Process uptime monitoring",
    ],
    // Deep teal — cool, distinct from sapphire
    color: "#34bfbf",
    grad: "linear-gradient(135deg, rgba(52,191,191,0.14) 0%, rgba(22,100,120,0.06) 100%)",
    glow: "rgba(52,191,191,0.18)",
  },
  {
    id: 2,
    icon: GitBranch,
    name: "Automotive OEM",
    stat: "+4%",
    statLabel: "Daily Throughput",
    features: [
      "Patent-published Digital Twin",
      "Line balancing with zero capex",
      "Deployed at Mahindra & John Deere",
    ],
    // Periwinkle blue — premium, slightly purple-shifted
    color: "#7c9fe8",
    grad: "linear-gradient(135deg, rgba(124,159,232,0.14) 0%, rgba(60,80,180,0.06) 100%)",
    glow: "rgba(124,159,232,0.20)",
  },
  {
    id: 3,
    icon: Activity,
    name: "Energy Sector",
    stat: "50%",
    statLabel: "Safety Incident Drop",
    features: [
      "Live PPE & helmet monitoring",
      "Zone breach & proximity alerts",
      "Machine anomaly detection",
    ],
    // Ice steel blue — cold, precise, alert-system feel
    color: "#8ab4d4",
    grad: "linear-gradient(135deg, rgba(138,180,212,0.14) 0%, rgba(22,55,100,0.06) 100%)",
    glow: "rgba(138,180,212,0.20)",
  },
  {
    id: 4,
    icon: FileText,
    name: "Pharma / Life Sciences",
    stat: "99%+",
    statLabel: "Audit Accuracy",
    features: [
      "eBMR auto-capture via cameras",
      "Compliance-ready in minutes",
      "Batch record automation",
    ],
    // Slate blue-violet — clinical, precise, audit feel
    color: "#8b9fe8",
    grad: "linear-gradient(135deg, rgba(139,159,232,0.14) 0%, rgba(50,55,160,0.06) 100%)",
    glow: "rgba(139,159,232,0.20)",
  },
  {
    id: 5,
    icon: Factory,
    name: "Textile Industry",
    stat: "70%",
    statLabel: "Faster Stock Retrieval",
    features: [
      "5 cm item location accuracy",
      "Turn-by-turn forklift navigation",
      "1-week ERP integration",
    ],
    // Muted ocean blue — warehouse, logistics, flow
    color: "#4d8fd1",
    grad: "linear-gradient(135deg, rgba(77,143,209,0.14) 0%, rgba(22,55,120,0.06) 100%)",
    glow: "rgba(77,143,209,0.20)",
  },
];

const BASE_CARD_W = 460;
const BASE_CARD_H = 340;
const STACK_OFFSET = 26; // px per layer, cards fan upper-right
const AUTO_INTERVAL = 4200; // ms

// Compute card dimensions that fit within available width
function calcDims(numCards: number) {
  const maxOff = (numCards - 1) * STACK_OFFSET;
  const padded = typeof window !== "undefined" ? window.innerWidth - 32 : BASE_CARD_W + maxOff;
  const needed = BASE_CARD_W + maxOff;
  if (padded >= needed) return { w: BASE_CARD_W, h: BASE_CARD_H };
  const scale = padded / needed;
  return {
    w: Math.floor(BASE_CARD_W * scale),
    h: Math.floor(BASE_CARD_H * scale),
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** pos=0 → back (most stacked), pos=N-1 → front (fully visible) */
function getCardStyle(pos: number, total: number, w: number, h: number): CSSProperties {
  const fromFront = total - 1 - pos; // 0 = front
  return {
    position: "absolute",
    width: w,
    height: h,
    left: fromFront * STACK_OFFSET,
    top: -fromFront * STACK_OFFSET,
    zIndex: pos + 1,
    opacity: 1 - fromFront * 0.1,
    cursor: "pointer",
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function IndustriesScene() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const sliderRef   = useRef<HTMLDivElement>(null);
  const infoRef     = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const flipRef     = useRef<ReturnType<typeof Flip.getState> | null>(null);

  // Responsive card dimensions
  const [dims, setDims] = useState(() => calcDims(industries.length));
  useEffect(() => {
    const update = () => setDims(calcDims(industries.length));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxOffset = (industries.length - 1) * STACK_OFFSET;

  // order[N-1] = front card index, order[0] = back card index
  const [order, setOrder] = useState(() => industries.map((_, i) => i));
  const frontIdx = order[order.length - 1];
  const current  = industries[frontIdx];

  // ── Advance to next card ────────────────────────────────────────────────
  const advance = useCallback(() => {
    if (!sliderRef.current) return;
    // 1. Capture current DOM positions BEFORE state change
    const cards = sliderRef.current.querySelectorAll<HTMLElement>(".ind-card");
    flipRef.current = Flip.getState(cards);
    // 2. Rotate order: front → back
    setOrder(prev => {
      const next = [...prev];
      const front = next.pop()!;
      next.unshift(front);
      return next;
    });
  }, []);

  // 3. After React commits DOM with new positions → run Flip
  useLayoutEffect(() => {
    if (!flipRef.current || !sliderRef.current) return;
    const cards = sliderRef.current.querySelectorAll<HTMLElement>(".ind-card");
    Flip.from(flipRef.current, {
      targets: cards,
      ease: "expo.inOut",
      duration: 0.82,
      stagger: { amount: 0.12, from: "end" },
      onEnter: (els) =>
        gsap.from(els, { opacity: 0, y: 18, duration: 0.35, ease: "expo.out" }),
      onLeave: (els) =>
        gsap.to(els, {
          opacity: 0,
          yPercent: 6,
          xPercent: -4,
          duration: 0.35,
          ease: "expo.out",
        }),
    });
    flipRef.current = null;
  }, [order]);

  // ── Animate info panel on card change ──────────────────────────────────
  useEffect(() => {
    if (!infoRef.current) return;
    gsap.fromTo(
      infoRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
    );
  }, [frontIdx]);

  // ── Progress bar + auto-advance ────────────────────────────────────────
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) {
      gsap.killTweensOf(progressRef.current);
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: AUTO_INTERVAL / 1000, ease: "none", transformOrigin: "left center" }
      );
    }
    timerRef.current = setInterval(() => advance(), AUTO_INTERVAL);
  }, [advance]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  // ── Section entrance ──────────────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // immediateRender: false → elements are NOT set invisible before trigger fires.
      // If scroll positions shift (e.g. after section height changes) they stay visible.
      gsap.from(".ind-deck-wrapper", {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
          invalidateOnRefresh: true,
        },
      });
      gsap.from(".ind-info-wrapper", {
        opacity: 0,
        x: 40,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);
    // Force ScrollTrigger to recalculate all positions after any section height changes
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  const handleClick = () => { advance(); resetTimer(); };

  return (
    <Section id="industries" padding="xl">
      <SlideIn>
        <SectionHeader
          eyebrow="Industries We Serve"
          title="Built for every factory floor."
          subtitle="Click through to explore how Autonex powers each industry with custom AI, not off-the-shelf software."
        />
      </SlideIn>

      <div ref={sectionRef} className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16 mt-10">

        {/* ── Stacked Card Deck ────────────────────────────────────────── */}
        <div className="flex justify-center lg:justify-start">
        <div
          className="ind-deck-wrapper flex-shrink-0 select-none"
          style={{
            paddingTop: maxOffset,
            paddingRight: maxOffset,
            position: "relative",
          }}
        >
          <div
            ref={sliderRef}
            style={{ position: "relative", width: dims.w, height: dims.h }}
            onClick={handleClick}
            title="Click to advance"
          >
            {order.map((industryIdx, pos) => {
              const ind = industries[industryIdx];
              const Icon = ind.icon;
              const isFront = pos === order.length - 1;
              return (
                <div
                  key={ind.id}
                  className="ind-card"
                  data-flip-id={`ind-${ind.id}`}
                  style={{
                    ...getCardStyle(pos, order.length, dims.w, dims.h),
                    borderRadius: 20,
                    overflow: "hidden",
                    background: "rgba(6, 11, 24, 0.92)",
                    border: `1px solid ${ind.color}28`,
                    backdropFilter: "blur(18px)",
                    boxShadow: isFront
                      ? `0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px ${ind.color}18, 0 0 60px ${ind.glow}`
                      : "0 8px 24px rgba(0,0,0,0.35)",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  {/* Accent bar top */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${ind.color}, transparent)`,
                  }} />

                  {/* Gradient fill */}
                  <div style={{ position: "absolute", inset: 0, background: ind.grad }} />

                  {/* Content */}
                  <div style={{
                    position: "relative", zIndex: 1, height: "100%",
                    padding: "28px 32px", display: "flex", flexDirection: "column",
                    justifyContent: "space-between", gap: 16,
                  }}>

                    {/* Row 1: icon / name | stat */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <div style={{
                          width: 48, height: 48, borderRadius: 13,
                          background: `${ind.color}15`, border: `1px solid ${ind.color}30`,
                          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
                        }}>
                          <Icon style={{ width: 24, height: 24, color: ind.color }} />
                        </div>
                        <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: 0 }}>
                          {ind.name}
                        </h3>
                      </div>

                      {/* Big stat badge */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{
                          fontSize: 36, fontWeight: 900, color: ind.color, lineHeight: 1,
                          filter: `drop-shadow(0 0 10px ${ind.color}70)`,
                        }}>
                          {ind.stat}
                        </div>
                        <div style={{
                          fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 3,
                          textTransform: "uppercase", letterSpacing: "0.07em",
                        }}>
                          {ind.statLabel}
                        </div>
                      </div>
                    </div>

                    {/* Row 2: feature bullets */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      {ind.features.map((f, fi) => (
                        <div key={fi} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                            background: ind.color, boxShadow: `0 0 6px ${ind.color}80`,
                          }} />
                          <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.68)", lineHeight: 1.4 }}>
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Row 3: click hint */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{
                        fontSize: 11, color: "rgba(255,255,255,0.22)",
                        textTransform: "uppercase", letterSpacing: "0.09em",
                      }}>
                        {isFront ? "Click to explore next →" : ""}
                      </span>
                      {isFront && (
                        <div style={{
                          width: 30, height: 30, borderRadius: "50%",
                          background: `${ind.color}18`, border: `1px solid ${ind.color}35`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <ChevronRight style={{ width: 14, height: 14, color: ind.color }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>

        {/* ── Info panel ────────────────────────────────────────── */}
        <div
          className="ind-info-wrapper flex flex-col justify-between w-full lg:max-w-[380px]"
          style={{
            paddingTop: dims.w < BASE_CARD_W ? 0 : maxOffset,
            minHeight: dims.w < BASE_CARD_W ? "auto" : dims.h,
          }}
        >
          <div ref={infoRef}>
            {/* Counter */}
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: current.color, marginBottom: 14,
            }}>
              {String(frontIdx + 1).padStart(2, "0")} / {String(industries.length).padStart(2, "0")}
            </div>

            {/* Industry name */}
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
              {current.name}
            </h2>

            {/* Description */}
            <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 15, lineHeight: 1.65, marginBottom: 28 }}>
              Autonex deploys custom-trained AI models for{" "}
              {current.name.toLowerCase()}, running on your existing cameras, sensors, and ERP without disruption.
            </p>

            {/* Stat highlight */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "10px 20px", borderRadius: 50,
              background: `${current.color}10`, border: `1px solid ${current.color}30`,
              marginBottom: 36,
            }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: current.color }}>{current.stat}</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{current.statLabel}</span>
            </div>
          </div>

          {/* Progress + dots nav */}
          <div>
            {/* Progress bar */}
            <div style={{
              height: 2, borderRadius: 2, overflow: "hidden",
              background: "rgba(255,255,255,0.07)", marginBottom: 18,
            }}>
              <div
                ref={progressRef}
                style={{
                  height: "100%", background: current.color,
                  transform: "scaleX(0)", transformOrigin: "left center",
                  transition: "background 0.4s ease",
                }}
              />
            </div>

            {/* Dots */}
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              {industries.map((ind, i) => {
                const isActive = ind.id === current.id;
                return (
                  <button
                    key={ind.id}
                    aria-label={`Go to ${ind.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!sliderRef.current) return;
                      const cards = sliderRef.current.querySelectorAll<HTMLElement>(".ind-card");
                      flipRef.current = Flip.getState(cards);
                      // Rotate until the clicked industry is front
                      setOrder(prev => {
                        const next = [...prev];
                        while (next[next.length - 1] !== ind.id) {
                          next.push(next.shift()!);
                        }
                        return next;
                      });
                      resetTimer();
                    }}
                    style={{
                      width: isActive ? 28 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer",
                      background: isActive ? current.color : "rgba(255,255,255,0.15)",
                      transition: "all 0.35s ease", padding: 0,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </Section>
  );
}