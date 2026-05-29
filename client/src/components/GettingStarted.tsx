import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@/hooks/useGSAP";
import { Zap } from "lucide-react";

const steps = [
  {
    timeframe: "Day 1 – 7",
    heading:   "Discovery",
    body:      "Share your existing camera or sensor feeds. Tell us your biggest pain point. We define KPIs for your POC together — so you know exactly what you're measuring.",
    color:     "#60a5fa",
    yOffset:   140,
  },
  {
    timeframe: "Week 2 – 4",
    heading:   "Setup & Build",
    body:      "We integrate cameras, sensors, and your ERP. Your live dashboard and operator apps are built with you. Alerts and KPIs configured before go-live.",
    color:     "#a78bfa",
    yOffset:   70,
  },
  {
    timeframe: "Week 4+",
    heading:   "Go Live",
    body:      "Real-time dashboard and alerts from day one. AI models upgrade automatically as they learn your facility. No hidden costs beyond AMC.",
    color:     "#2dd4bf",
    yOffset:   0,
  },
];

// Node dot center Y in SVG pixel space (yOffset + half of 20px node)
const NODE_Y = [150, 80, 10];

export default function GettingStarted() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef     = useRef<SVGSVGElement>(null);
  const railRef    = useRef<SVGPathElement>(null);
  const pathRef    = useRef<SVGPathElement>(null);
  const planeRef   = useRef<SVGGElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const svgEl   = svgRef.current;
    const railEl  = railRef.current;
    const pathEl  = pathRef.current;
    const planeEl = planeRef.current;
    if (!section || !svgEl || !railEl || !pathEl || !planeEl) return;

    // Build path AFTER layout so we know the actual pixel width
    requestAnimationFrame(() => {
      const W = svgEl.getBoundingClientRect().width;
      if (!W) return;

      const [y0, y1, y2] = NODE_Y;
      // S-curve: left node → mid node → right node using cubic bezier
      const d = [
        `M 0 ${y0}`,
        `C ${W * 0.28} ${y0}, ${W * 0.28} ${y1}, ${W * 0.5} ${y1}`,
        `C ${W * 0.72} ${y1}, ${W * 0.72} ${y2}, ${W} ${y2}`,
      ].join(" ");

      railEl.setAttribute("d", d);
      pathEl.setAttribute("d", d);

      const totalLen = pathEl.getTotalLength();
      if (!totalLen) return;

      // Hide animated path initially
      gsap.set(pathEl, { strokeDasharray: totalLen, strokeDashoffset: totalLen });

      // Place plane at start
      const startPt = pathEl.getPointAtLength(0);
      const aheadPt = pathEl.getPointAtLength(3);
      const initAngle = Math.atan2(aheadPt.y - startPt.y, aheadPt.x - startPt.x) * (180 / Math.PI);
      planeEl.setAttribute("transform", `translate(${startPt.x} ${startPt.y}) rotate(${initAngle})`);

      // Scrub: draw path + fly plane
      ScrollTrigger.create({
        trigger: section,
        start:   "top 55%",
        end:     "bottom 70%",
        scrub:   1.4,
        onUpdate(self) {
          const p    = self.progress;
          const dist = p * totalLen;

          // Draw the colored path
          gsap.set(pathEl, { strokeDashoffset: totalLen * (1 - p) });

          // Move + rotate plane
          const pt    = pathEl.getPointAtLength(dist);
          const ptAhd = pathEl.getPointAtLength(Math.min(dist + 6, totalLen));
          const angle = Math.atan2(ptAhd.y - pt.y, ptAhd.x - pt.x) * (180 / Math.PI);
          planeEl.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${angle})`);
        },
      });
    });

    // Cards fly in from different angles
    const cards = section.querySelectorAll<HTMLElement>(".gs-card");
    cards.forEach((card, i) => {
      gsap.from(card, {
        x: i === 0 ? -80 : i === 2 ? 80 : 0,
        y: i === 0 ? -30 : i === 1 ? 30  : 50,
        opacity: 0, duration: 1.1, ease: "power4.out",
        immediateRender: false, delay: i * 0.18,
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });
    });

    // Node dots pop in
    const nodes = section.querySelectorAll<HTMLElement>(".gs-node");
    nodes.forEach((node, i) => {
      gsap.from(node, {
        scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2)",
        immediateRender: false, delay: i * 0.18 + 0.4,
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });
    });

    gsap.from(".gs-cta", {
      y: 30, opacity: 0, duration: 0.8, ease: "back.out(1.5)",
      immediateRender: false,
      scrollTrigger: { trigger: ".gs-cta", start: "top 88%", once: true },
    });
  }, sectionRef, []);

  return (
    <section
      id="getting-started"
      ref={sectionRef}
      className="relative py-28 px-4 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(96,165,250,0.04) 0%, transparent 60%)" }}
      />

      <div className="max-w-6xl mx-auto relative">

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-black tracking-[0.28em] uppercase mb-5"
             style={{ color: "#60a5fa" }}>
            Getting Started
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}>
            Simple to start.<br />
            <span style={{ color: "#60a5fa" }}>Proven to deliver.</span>
          </h2>
          <p className="mt-5 text-base max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.38)" }}>
            No operational disruption. See AI results on your own cameras before you commit.
          </p>
        </div>

        {/* ── Flight path + staggered cards ───────────────────────────────────── */}
        <div style={{ position: "relative", minHeight: 460 }}>

          {/* SVG thread — no viewBox, real pixel coordinates set by JS */}
          <svg
            ref={svgRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%",
              height: 180,
              overflow: "visible",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <defs>
              <linearGradient id="gsGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#60a5fa" />
                <stop offset="50%"  stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>

            {/* Dashed rail — always visible */}
            <path
              ref={railRef}
              fill="none"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="2.5"
              strokeDasharray="10 7"
              strokeLinecap="round"
            />

            {/* Animated colored fill — draws in on scroll */}
            <path
              ref={pathRef}
              fill="none"
              stroke="url(#gsGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* ✈ Airplane — inside SVG so coordinates match exactly */}
            <g ref={planeRef}>
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fill="white"
                style={{
                  filter: "drop-shadow(0 0 5px rgba(98,170,222,0.95)) drop-shadow(0 0 12px rgba(98,170,222,0.6))",
                }}
              >
                ✈
              </text>
            </g>
          </svg>

          {/* 3 Cards — horizontal, staggered altitude */}
          <div style={{
            display: "flex", gap: "1.5rem", alignItems: "flex-start",
            position: "relative", zIndex: 5,
          }}>
            {steps.map((step, i) => (
              <div key={i} className="gs-card flex-1" style={{ marginTop: step.yOffset }}>

                {/* Node dot — aligns with SVG NODE_Y */}
                <div className="gs-node" style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: step.color,
                  border: "2px solid rgba(0,0,0,0.5)",
                  boxShadow: `0 0 14px ${step.color}80, 0 0 30px ${step.color}40`,
                  marginBottom: "1.25rem",
                }} />

                {/* Card */}
                <div style={{
                  borderRadius: 16, padding: "1.5rem",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${step.color}20`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 ${step.color}10`,
                  backdropFilter: "blur(8px)",
                }}>
                  <div style={{
                    height: 2, borderRadius: 2,
                    background: `linear-gradient(to right, ${step.color}, transparent)`,
                    marginBottom: "1.1rem",
                  }} />
                  <span style={{
                    display: "inline-block",
                    fontSize: "0.65rem", fontWeight: 800,
                    letterSpacing: "0.2em", textTransform: "uppercase" as const,
                    padding: "0.3rem 0.75rem", borderRadius: 999,
                    background: `${step.color}15`, border: `1px solid ${step.color}40`,
                    color: step.color, marginBottom: "0.85rem",
                  }}>
                    {step.timeframe}
                  </span>
                  <h3 style={{
                    fontSize: "1.4rem", fontWeight: 900, color: "#fff",
                    letterSpacing: "-0.02em", marginBottom: "0.65rem",
                  }}>
                    {step.heading}
                  </h3>
                  <p style={{ fontSize: "0.78rem", lineHeight: 1.65, color: "rgba(255,255,255,0.45)" }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────────────── */}
        <div className="gs-cta mt-24 text-center">
          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)",
              boxShadow:  "0 0 40px rgba(30,58,138,0.5), 0 0 80px rgba(96,165,250,0.15)",
              color:      "#fff",
            }}
          >
            Book a Free Pilot
            <Zap className="w-4 h-4" />
          </a>
          <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.28)" }}>
            No operational disruption. See results on your own cameras within 7 days.
          </p>
        </div>

      </div>
    </section>
  );
}