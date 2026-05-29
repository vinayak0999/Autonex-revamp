import { useRef, useState, useCallback, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { CheckCircle2, Zap, ShieldCheck, MapPin, GitBranch, ClipboardList } from "lucide-react";

// ─── Product data ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id:       "vigil",
    step:     "01",
    icon:     ShieldCheck,
    name:     "V.I.G.I.L",
    fullName: "Visual Intelligence & Guard Inspection Layer",
    color:    "#60a5fa",
    tagline:  "See every safety risk in real time, on your existing cameras.",
    video:    "/videos/vigil.mp4",
    quickWin: "Live in 1 week",
    features: [
      "Helmet / PPE compliance monitoring",
      "Zone breach detection",
      "Unsafe posture & proximity risks",
      "Machine anomaly alerts",
      "5S / housekeeping compliance",
      "Full audit trail: photo + timestamp + severity",
    ],
    result: "50% drop in safety incidents — first month",
  },
  {
    id:       "wil",
    step:     "02",
    icon:     MapPin,
    name:     "WIL",
    fullName: "Warehouse Intelligence & Logistics",
    color:    "#2dd4bf",
    tagline:  "Google Maps for your warehouse. 5cm item location accuracy.",
    video:    "/videos/wil.mp4",
    quickWin: "Live in 3 weeks",
    features: [
      "5cm item location accuracy",
      "Turn-by-turn forklift HMI navigation",
      "Auto-links weight via camera",
      "1-week ERP integration (SAP, Oracle, Tally)",
      "Works across shifts & teams",
      "Cycle counts in minutes, not days",
    ],
    result: "Stock retrieval time down 70% in first month",
  },
  {
    id:       "twin",
    step:     "03",
    icon:     GitBranch,
    name:     "Digital Twin",
    fullName: "Virtual replica of your factory — finds hidden capacity",
    color:    "#a78bfa",
    tagline:  "Test hundreds of scenarios in minutes. Find what's costing you throughput.",
    video:    "/videos/twin.mov",
    quickWin: "POC in 6–8 weeks",
    features: [
      "Patent-published simulation algorithm (IIT Bombay)",
      "Deployed at Mahindra & John Deere",
      "Mirror → Simulate → Score → Recommend",
      "Zero capex — no new machines",
      "Live-connected to shop floor data",
      "Tests hundreds of scenarios in minutes",
    ],
    result: "+4% daily throughput — guaranteed",
  },
  {
    id:       "erp",
    step:     "04",
    icon:     ClipboardList,
    name:     "AI ERP / eBMR",
    fullName: "Auto-capture. Always audit-ready.",
    color:    "#38bdf8",
    tagline:  "Eliminate manual entry. Pull an audit package in minutes, not days.",
    video:    "/videos/ebmr.mov",
    quickWin: "Dispatch live in 1 day",
    features: [
      "Auto-capture via cameras & sensors — no paper",
      "Deviations flagged and logged in real time",
      "Full audit package in minutes, not days",
      "SAP · Oracle · Tally · Standalone integration",
      "Mobile app for shop floor operators",
      "99.9% dispatch accuracy — 1-day setup",
    ],
    result: "99%+ accuracy. Zero tally mismatches.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ServicesScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const frameRef   = useRef<HTMLDivElement>(null);
  const glitchRef  = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRefs  = useRef<(HTMLVideoElement | null)[]>([]);

  // refs for stale-closure-safe logic
  const activeIdxRef  = useRef(0);
  const transitingRef = useRef(false);
  const enteredRef    = useRef(false);

  const [active, setActive] = useState(0);

  // ── Play the right video ──────────────────────────────────────────────────
  const playVideo = useCallback((idx: number) => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === idx) { v.currentTime = 0; v.play().catch(() => {}); }
      else v.pause();
    });
  }, []);

  // ── 3D flip transition ────────────────────────────────────────────────────
  const transitionTo = useCallback((nextIdx: number) => {
    if (transitingRef.current)            return;
    if (nextIdx === activeIdxRef.current) return;
    if (!frameRef.current || !contentRef.current || !glitchRef.current) return;

    transitingRef.current = true;

    const tl = gsap.timeline({ onComplete: () => { transitingRef.current = false; } });

    tl.to(glitchRef.current, { opacity: 0.8, duration: 0.05, ease: "none" })
      .to(frameRef.current, { rotateY: -100, scale: 0.88, duration: 0.35, ease: "power3.in" }, 0)
      .call(() => {
        activeIdxRef.current = nextIdx;
        setActive(nextIdx);
        playVideo(nextIdx);
      })
      .to(glitchRef.current, { opacity: 0, duration: 0.06, ease: "none" })
      .fromTo(frameRef.current,
        { rotateY: 80, scale: 0.88 },
        { rotateY: -8, scale: 1, duration: 0.5, ease: "back.out(1.5)" }
      )
      .fromTo(
        contentRef.current.querySelectorAll(".psc-item"),
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.055, duration: 0.4, ease: "power3.out" },
        "-=0.3"
      );
  }, [playVideo]);

  // ── Mouse parallax ────────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e: MouseEvent) => {
      if (!frameRef.current) return;
      const r  = frameRef.current.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      gsap.to(frameRef.current, {
        rotateY: -8 + dx * 5, rotateX: 3 - dy * 3.5,
        duration: 0.5, ease: "power2.out",
      });
    };
    const onLeave = () => gsap.to(frameRef.current, {
      rotateY: -8, rotateX: 3, duration: 1.1, ease: "elastic.out(1, 0.5)",
    });
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── ScrollTrigger: entrance + pin + advance ───────────────────────────────
  useEffect(() => {
    if (!sectionRef.current || !wrapRef.current) return;

    const ctx = gsap.context(() => {

      // Header entrance
      gsap.from(".sv-header", {
        y: 50, opacity: 0, duration: 0.9, ease: "power4.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
      });

      // Frame entrance
      gsap.from(frameRef.current, {
        x: -100, opacity: 0, rotateY: -30, scale: 0.92,
        duration: 1.1, ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
          onEnter: () => {
            if (!enteredRef.current && contentRef.current) {
              enteredRef.current = true;
              gsap.fromTo(
                contentRef.current.querySelectorAll(".psc-item"),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.07, duration: 0.55, ease: "power3.out", delay: 0.35 }
              );
              playVideo(0);
            }
          },
        },
      });

      // Pin + chapter scroll
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top 80px",
        end: `+=${(window.innerHeight - 80) * (PRODUCTS.length - 1)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate(self) {
          const idx = Math.max(0, Math.min(
            Math.round(self.progress * (PRODUCTS.length - 1)),
            PRODUCTS.length - 1
          ));
          if (idx === activeIdxRef.current) return;

          // Direct update — no complex timeline blocking scroll-back
          activeIdxRef.current = idx;
          setActive(idx);
          playVideo(idx);

          // Quick flash on frame
          if (frameRef.current) {
            gsap.fromTo(frameRef.current,
              { opacity: 0.6, scale: 0.96 },
              { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out", overwrite: true }
            );
          }
          // Slide content in
          if (contentRef.current) {
            gsap.fromTo(
              contentRef.current.querySelectorAll(".psc-item"),
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power3.out", overwrite: true }
            );
          }
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [transitionTo, playVideo]);

  const p = PRODUCTS[active];
  const Icon = p.icon;

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(3,7,18,0) 0%, rgba(5,10,22,0.8) 20%, rgba(5,10,22,0.8) 80%, rgba(3,7,18,0) 100%)",
      }}
    >
      {/* ── CSS ──────────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes svScanline {
          from { background-position: 0 0; }
          to   { background-position: 0 120px; }
        }
        .sv-scanlines {
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.09) 2px, rgba(0,0,0,0.09) 4px
          );
          animation: svScanline 3s linear infinite;
        }
        @keyframes svCornerPulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        .sv-corner { animation: svCornerPulse 2.2s ease-in-out infinite; }
      `}</style>

      {/* ── Section heading — scrolls normally, NOT pinned ──────────────── */}
      <div className="sv-header text-center px-6 pt-28 pb-4">
        <p
          className="text-[11px] font-black tracking-[0.28em] uppercase mb-4"
          style={{ color: PRODUCTS[active].color, transition: "color 0.45s" }}
        >
          Our Products
        </p>
        <h2
          className="text-4xl sm:text-5xl lg:text-[4.5rem] font-black text-white leading-[1.05]"
          style={{ letterSpacing: "-0.025em" }}
        >
          Four products.<br />One platform.
        </h2>
      </div>

      {/* ── Product tabs — scrolls normally ─────────────────────────────── */}
      <div className="sv-header flex justify-center gap-2 px-4 pb-8 flex-wrap">
        {PRODUCTS.map((prod, i) => (
          <button
            key={prod.id}
            onClick={() => transitionTo(i)}
            className="text-[11px] font-bold tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap"
            style={{
              background: i === active ? `${prod.color}20` : "rgba(255,255,255,0.05)",
              border:     `1px solid ${i === active ? prod.color + "55" : "rgba(255,255,255,0.1)"}`,
              color:      i === active ? prod.color : "rgba(255,255,255,0.35)",
              transition: "all 0.35s",
              transform:  i === active ? "scale(1.06)" : "scale(1)",
            }}
          >
            {prod.name}
          </button>
        ))}
      </div>

      {/* ── Pinned: ONLY the video+content ─────────────────────────────── */}
      <div
        ref={wrapRef}
        className="flex flex-col overflow-hidden"
        style={{ height: "calc(100vh - 80px)" }}
      >

      {/* ── Two-column: VIDEO left · CONTENT right ─────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row items-center gap-6 lg:gap-10 px-6 md:px-12 xl:px-20 py-6 max-w-[1380px] mx-auto w-full overflow-hidden">

          {/* ── LEFT: 3D Holographic Video Frame ──────────────────────────── */}
          <div
            className="flex-1 min-h-0 w-full flex items-center justify-center"
            style={{ perspective: "1100px" }}
          >
            <div
              ref={frameRef}
              className="relative w-full max-h-full"
              style={{
                maxWidth: 640,
                transformStyle: "preserve-3d",
                transform: "rotateY(-8deg) rotateX(3deg)",
              }}
            >
              {/* Ambient glow */}
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: "-12%",
                  background: `radial-gradient(ellipse at 60% 50%, ${p.color}28 0%, transparent 65%)`,
                  filter: "blur(30px)",
                  transition: "background 0.55s",
                  zIndex: -1,
                }}
              />

              {/* Bezel */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  aspectRatio: "16/9",
                  background: "rgba(4,8,20,0.97)",
                  border: `1.5px solid ${p.color}45`,
                  boxShadow: `
                    0 28px 72px rgba(0,0,0,0.75),
                    0 0 0 1px ${p.color}12,
                    0 0 55px ${p.color}16,
                    inset 0 1px 0 rgba(255,255,255,0.05)
                  `,
                  transition: "border-color 0.5s, box-shadow 0.5s",
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 z-20"
                  style={{
                    height: 2.5,
                    background: `linear-gradient(90deg, transparent 5%, ${p.color} 50%, transparent 95%)`,
                    transition: "background 0.5s",
                  }}
                />

                {/* Corner reticles */}
                {([
                  { top: 8,    left: 8,    borderTopWidth: 1.5, borderLeftWidth: 1.5,    borderBottomWidth: 0, borderRightWidth: 0 },
                  { top: 8,    right: 8,   borderTopWidth: 1.5, borderRightWidth: 1.5,   borderBottomWidth: 0, borderLeftWidth: 0  },
                  { bottom: 8, left: 8,    borderBottomWidth: 1.5, borderLeftWidth: 1.5,  borderTopWidth: 0,   borderRightWidth: 0 },
                  { bottom: 8, right: 8,   borderBottomWidth: 1.5, borderRightWidth: 1.5, borderTopWidth: 0,   borderLeftWidth: 0  },
                ] as React.CSSProperties[]).map((s, ci) => (
                  <div
                    key={ci}
                    className="sv-corner absolute z-20 w-[18px] h-[18px] pointer-events-none"
                    style={{ ...s, borderStyle: "solid", borderColor: p.color, transition: "border-color 0.5s" }}
                  />
                ))}

                {/* Scanlines */}
                <div className="sv-scanlines absolute inset-0 z-10 pointer-events-none opacity-35" />

                {/* Gloss */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{ background: "linear-gradient(148deg, rgba(255,255,255,0.05) 0%, transparent 35%)" }}
                />

                {/* Videos */}
                {PRODUCTS.map((prod, vi) =>
                  prod.video ? (
                    <video
                      key={prod.id}
                      ref={el => { videoRefs.current[vi] = el; }}
                      src={prod.video}
                      loop muted playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: vi === active ? 1 : 0, transition: "opacity 0.3s ease", zIndex: 5 }}
                    />
                  ) : (
                    <div
                      key={prod.id}
                      className="absolute inset-0 flex flex-col items-center justify-center"
                      style={{
                        opacity: vi === active ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        zIndex: 5,
                        background: `radial-gradient(ellipse at center, ${prod.color}10 0%, transparent 70%)`,
                      }}
                    >
                      <p className="text-[10px] font-black tracking-[0.22em] uppercase"
                         style={{ color: "rgba(255,255,255,0.18)" }}>
                        Video coming soon
                      </p>
                    </div>
                  )
                )}

                {/* Glitch overlay */}
                <div
                  ref={glitchRef}
                  className="absolute inset-0 z-30 pointer-events-none opacity-0"
                  style={{
                    background: `linear-gradient(90deg, ${p.color}55, transparent 50%, ${p.color}55)`,
                    mixBlendMode: "screen",
                    transition: "background 0.3s",
                  }}
                />

                {/* HUD bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2"
                  style={{ background: "rgba(2,5,14,0.82)", backdropFilter: "blur(8px)" }}
                >
                  <span className="text-[10px] font-mono font-bold tracking-widest" style={{ color: p.color, transition: "color 0.4s" }}>
                    AUTONEX · {p.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: p.color }} />
                    <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>LIVE</span>
                  </div>
                </div>
              </div>

              {/* Reflection */}
              <div
                className="absolute left-4 right-4 pointer-events-none"
                style={{
                  top: "calc(100% + 6px)",
                  height: 48,
                  background: `linear-gradient(to bottom, ${p.color}12, transparent)`,
                  filter: "blur(10px)",
                  transform: "scaleY(-0.4)",
                  transformOrigin: "top center",
                  opacity: 0.55,
                  transition: "background 0.5s",
                }}
              />
            </div>
          </div>

          {/* ── RIGHT: Content ─────────────────────────────────────────────── */}
          <div ref={contentRef} className="flex-1 flex flex-col max-w-[460px] w-full">

            {/* Icon + Step */}
            <div className="psc-item flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${p.color}18`, border: `1px solid ${p.color}35` }}
              >
                <Icon className="w-5 h-5" style={{ color: p.color }} />
              </div>
              <span className="text-[10px] font-black tracking-[0.28em] uppercase" style={{ color: p.color, transition: "color 0.4s" }}>
                Step {p.step}
              </span>
            </div>

            {/* Name */}
            <h3
              className="psc-item text-4xl md:text-5xl font-black text-white leading-none mb-1"
              style={{ letterSpacing: "-0.025em" }}
            >
              {p.name}
            </h3>

            {/* Subtitle */}
            <p className="psc-item text-sm mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
              {p.fullName}
            </p>

            {/* Quick win pill */}
            <div className="psc-item mb-5">
              <span
                className="inline-block text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full"
                style={{
                  background: `${p.color}15`,
                  border: `1px solid ${p.color}40`,
                  color: p.color,
                  transition: "all 0.4s",
                }}
              >
                {p.quickWin}
              </span>
            </div>

            {/* Tagline */}
            <p className="psc-item text-[15px] leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.52)" }}>
              {p.tagline}
            </p>

            {/* Divider */}
            <div
              className="psc-item h-px mb-6"
              style={{ background: `linear-gradient(to right, ${p.color}45, transparent)`, transition: "background 0.4s" }}
            />

            {/* Features */}
            <ul className="psc-item space-y-2.5 mb-7">
              {p.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: p.color, transition: "color 0.4s" }}
                  />
                  <span className="text-[13.5px] leading-snug" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            {/* Result block */}
            <div
              className="psc-item rounded-xl px-5 py-4 mb-6"
              style={{
                background: `${p.color}0d`,
                border: `1px solid ${p.color}2e`,
                transition: "all 0.4s",
              }}
            >
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: p.color }} />
                <div>
                  <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: p.color }}>
                    Real result
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.72)" }}>
                    {p.result}
                  </p>
                </div>
              </div>
            </div>

            {/* Dot navigation */}
            <div className="psc-item flex items-center gap-3">
              {PRODUCTS.map((prod, i) => (
                <button
                  key={prod.id}
                  onClick={() => transitionTo(i)}
                  aria-label={`Go to ${prod.name}`}
                  style={{
                    width:        i === active ? 30 : 8,
                    height:       8,
                    borderRadius: 4,
                    border:       "none",
                    cursor:       "pointer",
                    background:   i === active ? p.color : "rgba(255,255,255,0.14)",
                    transition:   "all 0.35s ease",
                    padding:      0,
                  }}
                />
              ))}
              <span className="text-[10px] font-bold tracking-wider ml-1" style={{ color: "rgba(255,255,255,0.22)" }}>
                Scroll to advance
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom progress bar ─────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div
            className="h-full origin-left"
            style={{
              background:  p.color,
              transform:   `scaleX(${(active + 1) / PRODUCTS.length})`,
              transition:  "transform 0.6s ease, background 0.4s",
            }}
          />
        </div>
      </div>
    </section>
  );
}