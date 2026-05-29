import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@/hooks/useGSAP";

// ─── Data ──────────────────────────────────────────────────────────────────────
const results = [
  {
    metric:      "99%+",
    suffix:      "",
    countTo:     99,
    label:       "Dispatch Accuracy",
    description: "Tally dispatch via CCTV. Zero tally mismatches after go-live.",
    product:     "AI ERP / eBMR",
    industry:    "Packaging",
    color:       "#60a5fa",
    glow:        "rgba(96,165,250,0.22)",
  },
  {
    metric:      "–50%",
    suffix:      "%",
    countTo:     50,
    label:       "Safety Incidents",
    description: "Machine anomalies and helmet violations caught in real time, every shift.",
    product:     "V.I.G.I.L",
    industry:    "Energy Sector",
    color:       "#2dd4bf",
    glow:        "rgba(45,212,191,0.22)",
  },
  {
    metric:      "+4%",
    suffix:      "%",
    countTo:     4,
    label:       "Daily Throughput",
    description: "Zero capex. No new machines. The hidden capacity was already there.",
    product:     "Digital Twin",
    industry:    "Automotive OEM",
    color:       "#a78bfa",
    glow:        "rgba(167,139,250,0.22)",
  },
  {
    metric:      "–70%",
    suffix:      "%",
    countTo:     70,
    label:       "Stock Retrieval Time",
    description: "Any item found in seconds. Forklift idle time dropped 40% in month one.",
    product:     "WIL",
    industry:    "Packaging",
    color:       "#38bdf8",
    glow:        "rgba(56,189,248,0.22)",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const metricRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // ── Scroll entrance + counter animation ─────────────────────────────────────
  useGSAP(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      // Card entrance
      gsap.from(card, {
        y: 80, opacity: 0, scale: 0.88,
        duration: 0.85, delay: i * 0.14, ease: "back.out(1.5)",
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
      });

      // Metric counter
      const metricEl = metricRefs.current[i];
      if (metricEl) {
        const r = results[i];
        const obj = { val: 0 };
        gsap.to(obj, {
          val: r.countTo,
          duration: 1.8,
          delay: i * 0.14 + 0.3,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
          onUpdate() {
            const prefix = r.metric.startsWith("+") ? "+" : r.metric.startsWith("–") ? "–" : "";
            metricEl.textContent = `${prefix}${Math.round(obj.val)}${r.suffix}`;
          },
          onComplete() { metricEl.textContent = r.metric; },
        });
      }
    });
  }, sectionRef, []);

  // ── 3D magnetic tilt + glow ──────────────────────────────────────────────────
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const glowEl = card.querySelector(".proof-glow") as HTMLElement;
      const r = results[i];

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const cx   = rect.left + rect.width / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / (rect.width  / 2);  // -1 to 1
        const dy   = (e.clientY - cy) / (rect.height / 2);  // -1 to 1

        // 3D tilt
        gsap.to(card, {
          rotateY:  dx * 10,
          rotateX: -dy * 10,
          scale:    1.035,
          duration: 0.4, ease: "power2.out", overwrite: "auto",
        });

        // Glow follows cursor
        if (glowEl) {
          const px = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
          const py = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
          gsap.to(glowEl, {
            background: `radial-gradient(circle at ${px}% ${py}%, ${r.glow} 0%, transparent 65%)`,
            opacity: 1, duration: 0.3, overwrite: "auto",
          });
        }
      };

      const onLeave = () => {
        gsap.to(card, {
          rotateY: 0, rotateX: 0, scale: 1,
          duration: 0.8, ease: "elastic.out(1,0.45)", overwrite: "auto",
        });
        if (glowEl) gsap.to(glowEl, { opacity: 0, duration: 0.5, overwrite: "auto" });
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <section
      id="proof"
      ref={sectionRef}
      className="relative py-28 px-4 overflow-hidden"
    >
      {/* Background pulse orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      <div className="max-w-6xl mx-auto relative">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-black tracking-[0.28em] uppercase mb-4"
            style={{ color: "#60a5fa" }}>
            Proof, Not Promises
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-4"
            style={{ letterSpacing: "-0.025em" }}>
            INR 10 Cr+ saved.<br />
            <span style={{ color: "#60a5fa" }}>Real factories.</span> Real numbers.
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.38)" }}>
            No stock photos. No fabricated case studies.<br />
            Client names in two months — results are live right now.
          </p>
        </div>

        {/* ── Cards ─────────────────────────────────────────────────────────── */}
        <style>{`
          .proof-card-wrap { perspective: 900px; }
          .proof-card {
            transform-style: preserve-3d;
            will-change: transform;
            cursor: default;
          }
          .proof-card:hover .proof-topline {
            transform: scaleX(1) !important;
            opacity: 1 !important;
          }
        `}</style>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((r, i) => (
            <div key={i} className="proof-card-wrap">
              <div
                ref={el => { cardRefs.current[i] = el; }}
                className="proof-card relative rounded-2xl overflow-hidden flex flex-col h-full"
                style={{
                  background:     `linear-gradient(145deg, ${r.color}0e 0%, rgba(9,16,40,0.9) 100%)`,
                  border:         `1px solid ${r.color}30`,
                  backdropFilter: "blur(16px)",
                  minHeight:      320,
                  padding:        "28px 24px",
                }}
              >
                {/* Dynamic cursor glow */}
                <div className="proof-glow absolute inset-0 pointer-events-none opacity-0" style={{ zIndex: 0 }} />

                {/* Top accent line */}
                <div
                  className="proof-topline absolute top-0 left-0 right-0 h-[3px] pointer-events-none"
                  style={{
                    background:      `linear-gradient(90deg, transparent 5%, ${r.color} 50%, transparent 95%)`,
                    transform:       "scaleX(0)",
                    transformOrigin: "center",
                    opacity:         0,
                    transition:      "transform 0.4s ease, opacity 0.4s ease",
                    zIndex:          2,
                  }}
                />

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, ${r.color}35, transparent)`, zIndex: 2 }}
                />

                <div className="relative z-10 flex flex-col h-full">

                  {/* Product + Industry */}
                  <div className="flex items-center justify-between mb-8">
                    <span
                      className="text-[9px] font-black tracking-[0.22em] uppercase px-2.5 py-1 rounded-full"
                      style={{
                        background: `${r.color}18`,
                        border:     `1px solid ${r.color}40`,
                        color:      r.color,
                      }}
                    >
                      {r.product}
                    </span>
                    <span className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {r.industry}
                    </span>
                  </div>

                  {/* Metric — giant */}
                  <div className="mb-1">
                    <span
                      ref={el => { metricRefs.current[i] = el; }}
                      className="text-[4rem] font-black leading-none"
                      style={{ color: r.color, letterSpacing: "-0.04em" }}
                    >
                      0
                    </span>
                  </div>

                  {/* Label */}
                  <div
                    className="text-xs font-bold uppercase tracking-[0.18em] mb-5"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {r.label}
                  </div>

                  {/* Divider */}
                  <div className="h-px mb-5"
                    style={{ background: `linear-gradient(to right, ${r.color}40, transparent)` }} />

                  {/* Description */}
                  <p className="text-[13px] leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {r.description}
                  </p>

                  {/* Bottom dot */}
                  <div className="flex items-center gap-2 mt-6">
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: r.color }}
                    />
                    <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: `${r.color}88` }}>
                      Live result
                    </span>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom callout ───────────────────────────────────────────────── */}
        <div className="mt-14 text-center">
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            Across pharma · textile · packaging · automotive — all standalone modules, no big-bang commitment
          </p>
        </div>

      </div>
    </section>
  );
}
