import { useRef } from "react";
import { ChevronRight, CheckCircle2, Zap } from "lucide-react";
import { gsap, EASE_POWER4, EASE_BACK } from "@/lib/gsap";
import { useGSAP } from "@/hooks/useGSAP";

// ─── Manual char-split (replaces premium SplitText) ─────────────────────────
// Renders each character as an inline-block span with class "sc" so GSAP can
// target them individually for the yPercent / rotation scroll animation.
function SplitChars({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className={`sc${className ? ` ${className}` : ""}`}
          style={{ display: "inline-block", ...style }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </>
  );
}

// ─── Journey data ───────────────────────────────────────────────────────────

type StepSolution = {
  name: string;
  tagline: string;
  color: string;
  video?: string;
  wins: string[];
  proof: string;
  quickWin: string;
};

type Step = {
  step: string;
  problem: { headline: string; pain: string; stat: string; statLabel: string };
  arrowLabel: string;
  solution: StepSolution;
};

const STEPS = [
  {
    step: "01",
    problem: {
      headline: "Safety incidents you discover after the fact",
      pain: "Workers skip PPE. Zone violations go unnoticed. No audit trail until it's too late.",
      stat: "80%",
      statLabel: "of plants have active safety blind spots",
    },
    arrowLabel: "Real-time vision AI prevents incidents before they happen",
    solution: {
      name: "V.I.G.I.L",
      tagline: "Visual Intelligence & Guard Inspection Layer",
      // Ice blue — cold, precise, surveillance feel
      color: "#62AADE",
      wins: [
        "PPE, zone breach & unsafe posture detection",
        "OCR label scanning & dispatch count verification",
        "Idle worker & machine time tracking per shift",
        "Truck load accuracy — confirmed before departure",
        "Real-time alerts: SMS, WhatsApp, dashboard",
        "Full audit trail: photo + timestamp + severity",
      ],
      proof: "Energy plant: crane-proximity tracking → accidents –50% in month 1 · 99% accuracy",
      quickWin: "Live in 1 week",
    },
  },
  {
    step: "02",
    problem: {
      headline: "Workers waste hours searching for stock",
      pain: "Forklifts navigate on memory. Stock audits take 2–3 days. ERP drifts from physical reality.",
      stat: "60%",
      statLabel: "of shift time lost to search & retrieval",
    },
    arrowLabel: "Every item gets a precise address — found in seconds",
    solution: {
      name: "WIL",
      tagline: "Warehouse Intelligence & Logistics",
      // Deep teal — navigation, logistics, movement
      color: "#34bfbf",
      wins: [
        "5 cm item accuracy — find any material in 1 click",
        "Turn-by-turn forklift HMI navigation",
        "Mobile cycle counts, results immediate & accurate",
        "Auto-synced to ERP — material entry on move",
      ],
      proof: "Packaging plant: retrieval time –70% · forklift idle –40% · deployed in 2 weeks",
      quickWin: "Live in 3 weeks",
    },
  },
  {
    step: "03",
    problem: {
      headline: "Running below capacity — bottleneck invisible",
      pain: "Shift planning by gut. Throughput loss with no root cause. Bottlenecks found too late.",
      stat: "60%",
      statLabel: "of plants run measurably below potential",
    },
    arrowLabel: "A virtual factory twin finds hidden capacity — zero capex",
    solution: {
      name: "Digital Twin",
      tagline: "Patent-published simulation · IIT Bombay",
      // Periwinkle blue — simulation, digital, futuristic
      color: "#7c9fe8",
      wins: [
        "+4% daily throughput at Mahindra & John Deere",
        "Tests 100s of scenarios in minutes, not weeks",
        "Live-connected to your shop floor",
        "\"Do X → +12% output\" — one click to approve",
      ],
      proof: "Context-aware twin, 90%+ accuracy · downtime –5% · zero new machines",
      quickWin: "+4% in 6–8 weeks",
    },
  },
  {
    step: "04",
    problem: {
      headline: "Manual logs & audit prep burns your team's time",
      pain: "Paper batch records, no traceability. Audit prep takes days. Basic AI in legacy platforms.",
      stat: "70%",
      statLabel: "of plants still file audits manually",
    },
    arrowLabel: "AI auto-captures everything — always audit-ready",
    solution: {
      name: "AI ERP / eBMR",
      tagline: "Eliminate manual entry. Always audit-ready.",
      // Slate blue — records, compliance, data systems
      color: "#8b9fe8",
      video: "/videos/ebmr.mov",
      wins: [
        "Auto-capture via cameras & sensors — no paper",
        "Deviations flagged and logged in real time",
        "Full audit package in minutes, not days",
        "SAP · Oracle · Tally · Standalone integration",
      ],
      proof: "Dispatch tracking: 99.9% accuracy · 1-day setup · zero recurring cost",
      quickWin: "Audit-ready in minutes",
    },
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function PainPoints() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const problemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const solutionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const connectorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const resolveRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header
    gsap.from(headerRef.current, {
      y: 50, opacity: 0, duration: 0.9, ease: EASE_POWER4,
      scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true },
    });

    STEPS.forEach((_, i) => {
      const prob = problemRefs.current[i];
      const soln = solutionRefs.current[i];
      const arrw = arrowRefs.current[i];
      const conn = connectorRefs.current[i];
      if (!prob) return;

      // Problem slides from left
      gsap.from(prob, {
        x: -65, opacity: 0, duration: 0.8, ease: EASE_POWER4,
        scrollTrigger: { trigger: prob, start: "top 82%", once: true },
      });

      // Arrow line draws (scaleX 0→1 from left)
      if (arrw) {
        gsap.from(arrw, {
          scaleX: 0, opacity: 0, duration: 0.65, ease: "power3.out",
          transformOrigin: "left center",
          scrollTrigger: { trigger: prob, start: "top 78%", once: true },
          delay: 0.42,
        });
      }

      // Solution slides from right with spring
      if (soln) {
        gsap.from(soln, {
          x: 65, opacity: 0, duration: 0.9, ease: EASE_BACK,
          scrollTrigger: { trigger: prob, start: "top 78%", once: true },
          delay: 0.62,
        });
      }

      // Vertical connector draws downward
      if (conn) {
        gsap.from(conn, {
          scaleY: 0, transformOrigin: "top center",
          duration: 0.8, ease: EASE_POWER4,
          scrollTrigger: { trigger: soln, start: "top 72%", once: true },
          delay: 0.5,
        });
      }

      // ── Char-split scroll animation (solution card) ───────────────
      if (soln) {
        // Solution NAME — big dramatic char fly-in, scrubbed to scroll
        const nameChars = soln.querySelectorAll(".sc-name");
        if (nameChars.length) {
          gsap.from(nameChars, {
            yPercent: "random(-220, 220)",
            rotation: "random(-22, 22)",
            opacity: 0,
            ease: "back.out(1.3)",
            stagger: { each: 0.055, from: "random" },
            scrollTrigger: {
              trigger: soln,
              start: "top 80%",
              end: "top 25%",
              scrub: 1.4,
            },
          });
        }

        // Win bullets — gentler char scatter, scrubbed
        soln.querySelectorAll(".win-line").forEach((line, li) => {
          const chars = line.querySelectorAll(".sc-win");
          if (!chars.length) return;
          gsap.from(chars, {
            yPercent: "random(-90, 90)",
            rotation: "random(-10, 10)",
            opacity: 0,
            ease: "power3.out",
            stagger: { each: 0.018, from: "start" },
            scrollTrigger: {
              trigger: soln,
              start: `top ${76 - li * 3}%`,
              end: "top 20%",
              scrub: 1,
            },
          });
        });
      }
    });

    // Resolution strip
    gsap.from(resolveRef.current, {
      y: 50, opacity: 0, scale: 0.97, duration: 0.9, ease: EASE_BACK,
      scrollTrigger: { trigger: resolveRef.current, start: "top 88%", once: true },
    });
  }, sectionRef, []);

  return (
    <section
      id="pain-points"
      ref={sectionRef}
      className="relative py-28 px-4 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, rgba(3,7,18,0) 0%, rgba(6,11,28,0.6) 40%, rgba(3,7,18,0) 100%)" }}
    >
      {/* CSS animations */}
      <style>{`
        @keyframes shimmerFlow {
          0%   { background-position: -250% center; }
          100% { background-position: 250% center; }
        }
        @keyframes particleDrift {
          0%   { left: 2%; opacity: 0; }
          12%  { opacity: 1; }
          88%  { opacity: 1; }
          100% { left: 97%; opacity: 0; }
        }
        @keyframes stepPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(98,170,222,0); }
          50%       { box-shadow: 0 0 0 12px rgba(98,170,222,0.14); }
        }
        @keyframes solutionGlow {
          0%, 100% { box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 40px rgba(98,170,222,0.07), inset 0 1px 0 rgba(255,255,255,0.05); }
          50%       { box-shadow: 0 8px 60px rgba(0,0,0,0.5), 0 0 70px rgba(98,170,222,0.16), inset 0 1px 0 rgba(255,255,255,0.08); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-18px) scale(1.04); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────────────────── */}
        <div ref={headerRef} className="text-center mb-24 relative">
          {/* Background glow orb */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600, height: 300,
            background: "radial-gradient(ellipse, rgba(22,55,145,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <span
            className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(98,170,222,0.12)", border: "1px solid rgba(98,170,222,0.3)", color: "#62AADE" }}
          >
            Start Where It Hurts
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] mb-5" style={{ color: "rgba(255,255,255,0.95)" }}>
            The Factory{" "}
            <span style={{
              background: "linear-gradient(90deg, #62AADE 0%, #ffffff 50%, #62AADE 100%)",
              backgroundSize: "200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmerFlow 5s linear infinite",
            }}>
              Intelligence Journey
            </span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            Four problems costing Indian factories crores every year.{" "}
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Four solutions — start with one, prove ROI, then expand.</span>
          </p>
        </div>

        {/* ── Journey rows ────────────────────────────────── */}
        <div className="flex flex-col gap-0">
          {STEPS.map((step, i) => (
            <div key={i}>

              {/* ROW: Problem ─── Arrow ─── Solution */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_1fr] items-stretch gap-4 md:gap-0">

                {/* ── PROBLEM CARD ─────────────────────── */}
                <div
                  ref={el => { problemRefs.current[i] = el; }}
                  className="relative rounded-2xl p-7 flex flex-col justify-between overflow-hidden"
                  style={{
                    background: "rgba(8,13,28,0.92)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  {/* Colored top accent bar */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, transparent, ${step.solution.color}60, transparent)`,
                    borderRadius: "12px 12px 0 0",
                  }} />

                  {/* Left accent stripe */}
                  <div style={{
                    position: "absolute", top: "20%", left: 0, width: 2, height: "60%",
                    background: `linear-gradient(to bottom, transparent, ${step.solution.color}50, transparent)`,
                    borderRadius: 2,
                  }} />

                  {/* Big stat watermark — more visible */}
                  <div
                    className="absolute right-4 top-3 text-8xl font-black leading-none pointer-events-none select-none"
                    style={{
                      color: "transparent",
                      WebkitTextStroke: `1px ${step.solution.color}18`,
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {step.problem.stat}
                  </div>

                  {/* Step number top-left */}
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="w-8 h-8 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, rgba(22,55,145,0.7), ${step.solution.color}30)`,
                        border: `1px solid ${step.solution.color}50`,
                        color: step.solution.color,
                        boxShadow: `0 0 12px ${step.solution.color}30`,
                      }}
                    >
                      {step.step}
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.32)" }}>
                      The Problem
                    </span>
                  </div>

                  {/* Headline */}
                  <p className="text-xl font-bold leading-snug mb-3" style={{ color: "rgba(255,255,255,0.92)" }}>
                    &ldquo;{step.problem.headline}&rdquo;
                  </p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {step.problem.pain}
                  </p>

                  {/* Stat pill */}
                  <div
                    className="inline-flex items-baseline gap-2 rounded-xl px-4 py-2.5 mt-auto w-fit"
                    style={{
                      background: `linear-gradient(135deg, ${step.solution.color}18, rgba(22,55,145,0.25))`,
                      border: `1px solid ${step.solution.color}30`,
                      boxShadow: `0 4px 20px ${step.solution.color}15`,
                    }}
                  >
                    <span className="text-3xl font-black" style={{ color: step.solution.color }}>{step.problem.stat}</span>
                    <span className="text-xs max-w-[140px] leading-snug" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {step.problem.statLabel}
                    </span>
                  </div>
                </div>

                {/* ── FLOW ARROW (desktop) ─────────────── */}
                <div className="hidden md:flex flex-col items-center justify-center px-2 py-0 relative z-10">
                  {/* Step circle */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black mb-4 relative z-10"
                    style={{
                      background: `linear-gradient(135deg, rgba(22,55,145,0.9), ${step.solution.color}40)`,
                      border: `1.5px solid ${step.solution.color}80`,
                      color: step.solution.color,
                      animation: "stepPulse 3s ease-in-out infinite",
                    }}
                  >
                    {step.step}
                  </div>

                  {/* Animated shimmer line with particles */}
                  <div
                    ref={el => { arrowRefs.current[i] = el; }}
                    className="relative w-full"
                    style={{ height: 2, marginBottom: 4 }}
                  >
                    {/* Line */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, rgba(22,55,145,0.2), ${step.solution.color} 50%, rgba(22,55,145,0.2))`,
                        backgroundSize: "250% 100%",
                        animation: "shimmerFlow 2s linear infinite",
                      }}
                    />
                    {/* Particle 1 */}
                    <div
                      className="absolute top-1/2 w-2 h-2 rounded-full"
                      style={{
                        background: step.solution.color,
                        boxShadow: `0 0 6px ${step.solution.color}`,
                        animation: "particleDrift 1.8s linear infinite",
                        transform: "translateY(-50%)",
                      }}
                    />
                    {/* Particle 2 */}
                    <div
                      className="absolute top-1/2 w-1.5 h-1.5 rounded-full"
                      style={{
                        background: `${step.solution.color}b0`,
                        animation: "particleDrift 1.8s linear infinite",
                        animationDelay: "0.9s",
                        transform: "translateY(-50%)",
                      }}
                    />
                    {/* Arrow head */}
                    <ChevronRight
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-4 h-4"
                      style={{ color: step.solution.color }}
                    />
                  </div>

                  {/* Transformation label */}
                  <p
                    className="text-[9px] text-center font-semibold tracking-wide leading-snug mt-2"
                    style={{ color: `${step.solution.color}88`, maxWidth: 140 }}
                  >
                    {step.arrowLabel}
                  </p>
                </div>

                {/* Mobile arrow (vertical) */}
                <div className="md:hidden flex flex-col items-center py-1">
                  <div style={{ width: 1.5, height: 28, background: `linear-gradient(to bottom, ${step.solution.color}25, ${step.solution.color})` }} />
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black my-1"
                    style={{ background: "rgba(22,55,145,0.7)", border: `1px solid ${step.solution.color}66`, color: step.solution.color }}
                  >
                    {step.step}
                  </div>
                  <div style={{ width: 1.5, height: 28, background: `linear-gradient(to bottom, ${step.solution.color}, ${step.solution.color}25)` }} />
                </div>

                {/* ── SOLUTION CARD ─────────────────────── */}
                <div
                  ref={el => { solutionRefs.current[i] = el; }}
                  className="relative rounded-2xl p-7 flex flex-col overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${step.solution.color}1e 0%, rgba(9,16,40,0.92) 60%, rgba(6,10,26,0.96) 100%)`,
                    border: `1px solid ${step.solution.color}45`,
                    backdropFilter: "blur(16px)",
                    animation: "solutionGlow 4s ease-in-out infinite",
                  }}
                >
                  {/* Top gradient line */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, transparent, ${step.solution.color}, transparent)`,
                    borderRadius: "12px 12px 0 0",
                  }} />

                  {/* Large faded step number background */}
                  <div style={{
                    position: "absolute", bottom: -20, right: -10,
                    fontSize: "10rem", fontWeight: 900, lineHeight: 1,
                    color: "transparent",
                    WebkitTextStroke: `1px ${step.solution.color}12`,
                    pointerEvents: "none", userSelect: "none",
                    letterSpacing: "-0.05em",
                  }}>
                    {step.step}
                  </div>

                  {/* Strong corner glow */}
                  <div
                    className="absolute top-0 right-0 w-48 h-48 pointer-events-none rounded-2xl overflow-hidden"
                    style={{ background: `radial-gradient(circle at top right, ${step.solution.color}2e, transparent 65%)` }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none"
                    style={{ background: `radial-gradient(circle at bottom left, ${step.solution.color}14, transparent 70%)` }}
                  />

                  {/* Solution name */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-1">
                      <Zap className="w-4 h-4 flex-shrink-0" style={{ color: step.solution.color, filter: `drop-shadow(0 0 6px ${step.solution.color})` }} />
                      <span className="text-2xl font-black" style={{ color: "#ffffff", letterSpacing: "0.02em", textShadow: `0 0 20px ${step.solution.color}50` }}>
                        <SplitChars text={step.solution.name} className="sc-name" />
                      </span>
                      <span
                        className="ml-auto text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{
                          background: `${step.solution.color}22`,
                          border: `1px solid ${step.solution.color}60`,
                          color: step.solution.color,
                          boxShadow: `0 0 12px ${step.solution.color}25`,
                        }}
                      >
                        {step.solution.quickWin}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.42)", paddingLeft: 28 }}>
                      {step.solution.tagline}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px mb-4" style={{ background: `linear-gradient(to right, ${step.solution.color}60, transparent)` }} />

                  {/* Feature wins */}
                  <ul className="space-y-2.5 flex-1 mb-5">
                    {step.solution.wins.map((w, wi) => (
                      <li key={wi} className="win-line flex items-start gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: step.solution.color, filter: `drop-shadow(0 0 4px ${step.solution.color}80)` }} />
                        <span className="text-sm leading-snug" style={{ color: "rgba(255,255,255,0.72)" }}>
                          <SplitChars text={w} className="sc-win" />
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Proof block */}
                  <div
                    className="rounded-xl px-4 py-3 mt-auto"
                    style={{
                      background: `linear-gradient(135deg, ${step.solution.color}14, rgba(6,13,31,0.8))`,
                      border: `1px solid ${step.solution.color}35`,
                      boxShadow: `inset 0 1px 0 ${step.solution.color}20`,
                    }}
                  >
                    <span className="text-[9px] font-black tracking-widest uppercase block mb-1" style={{ color: step.solution.color }}>✦ Proof</span>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{step.solution.proof}</p>
                  </div>
                  </div>

              </div>{/* end row grid */}

              {/* ── Vertical connector to next step ──── */}
              {i < STEPS.length - 1 && (
                <div className="flex justify-center md:justify-start md:ml-[calc(50%_-_1px)] pointer-events-none" style={{ height: 64 }}>
                  <div
                    ref={el => { connectorRefs.current[i] = el; }}
                    style={{
                      width: 1.5,
                      height: "100%",
                      background: "linear-gradient(to bottom, rgba(98,170,222,0.35), rgba(98,170,222,0.08))",
                      borderRadius: 2,
                    }}
                  />
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
