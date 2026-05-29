import React, { useRef, useEffect, useState } from "react";
import { ArrowRight, Users, Sparkles } from "lucide-react";
import { gsap, ScrollTrigger, EASE_POWER4, EASE_BACK, EASE_SPRING } from "@/lib/gsap";

// ─── Cursor Mouse Tracker (feeds into ParticleBackground) ─────────────────
// We expose mouse position globally so the full-page ParticleBackground
// can react to cursor movement across ALL sections.
export const globalMouse = { x: -9999, y: -9999 };

if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    globalMouse.x = e.clientX;
    globalMouse.y = e.clientY;
  }, { passive: true });
}


// ─── Ambient Mirror Glitch ─────────────────────────────────────────────
// Starts 2 s after mount (well after entry animation is done).
// Picks characters ONLY from "INDUSTRIAL SYSTEMS" and briefly swaps them
// with their Unicode mirror equivalent (e.g., R→Я, N→И, S→ƨ, E→Ǝ, M→W)
// then snaps back. Slow, intentional, feels like live encrypted data.
function startMirrorGlitch(el: HTMLElement, fullText: string): () => void {
  // Unicode reversed/mirrored equivalents of uppercase letters
  const MIRROR: Record<string, string> = {
    R: '\u042f', // Я
    N: '\u0418', // И
    S: '\u01a8', // Ƨ
    E: '\u018e', // Ǝ
    M: 'W',
    U: '\u2229', // ∩
    A: '\u0245', // Ʌ
    D: '\u1441', // ᑁ
    Y: '\u028e', // ʎ
    I: '\u026a', // ɪ (small caps I)
    L: '\u2310', // ⌐
  };

  // "FOR SMARTER " = 12 characters, so INDUSTRIAL SYSTEMS starts at index 12
  const TARGET_OFFSET = 12;
  const validIdx: number[] = [];
  Array.from(fullText).forEach((ch, i) => {
    if (i >= TARGET_OFFSET && ch !== ' ' && MIRROR[ch]) validIdx.push(i);
  });

  let raf: number;
  let timer: ReturnType<typeof setTimeout>;
  let running = true;

  function glitch() {
    if (!running) return;
    const pos = validIdx[Math.floor(Math.random() * validIdx.length)];
    const mirror = MIRROR[fullText[pos]];
    // Hold mirror char for 10–18 frames (~167–300 ms at 60fps) — slow, deliberate
    let frames = 10 + Math.floor(Math.random() * 9);

    function flicker() {
      if (!running) { el.textContent = fullText; return; }
      const chars = Array.from(el.textContent ?? fullText);
      if (frames-- > 0) {
        chars[pos] = mirror;
        el.textContent = chars.join('');
        raf = requestAnimationFrame(flicker);
      } else {
        // Snap back to correct char
        chars[pos] = fullText[pos];
        el.textContent = chars.join('');
        // Wait 1.5–3.8 s before next glitch
        timer = setTimeout(
          () => { if (running) raf = requestAnimationFrame(glitch); },
          1500 + Math.random() * 2300
        );
      }
    }
    raf = requestAnimationFrame(flicker);
  }

  // Start 2 s after mount — entry animation will be done by then
  timer = setTimeout(() => { if (running) raf = requestAnimationFrame(glitch); }, 2000);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    clearTimeout(timer);
    el.textContent = fullText;
  };
}

// ─── Main Hero ──────────────────────────────────────────────────────────────
export default function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrambleStop = useRef<(() => void) | null>(null);

  // ── Entrance timeline ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE_POWER4 } });

      // Badge — pop up with spring
      tl.from(badgeRef.current, { y: 40, opacity: 0, scale: 0.82, duration: 0.75, ease: EASE_BACK }, 0.1);

      // Line 1 — slide up from clip
      tl.from(line1Ref.current, { y: "100%", opacity: 0, duration: 0.75 }, 0.38);

      // Line 2 — clean slide up on entry, mirror glitch starts after 2 s separately
      tl.from(line2Ref.current, { y: "100%", opacity: 0, duration: 0.85 }, 0.56);

      // Sub paragraph
      tl.from(subRef.current, { y: 28, opacity: 0, duration: 0.6 }, 1.0);

      // CTA buttons stagger
      tl.from(ctaRef.current?.children ?? [], { y: 28, opacity: 0, scale: 0.9, duration: 0.55, stagger: 0.1, ease: EASE_BACK }, 1.15);


      // Parallax on scroll — hero text drifts up
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        onUpdate: (self) => {
          if (!sectionRef.current) return;
          const p = self.progress;
          const textEls = sectionRef.current.querySelectorAll(".hero-parallax");
          gsap.set(textEls, { y: p * 70 });
        },
      });
    }, sectionRef);

    // Start mirror glitch AFTER entry animation settles (handled by 2 s internal delay)
    if (line2Ref.current) {
      scrambleStop.current = startMirrorGlitch(line2Ref.current, "FOR SMARTER INDUSTRIAL SYSTEMS");
    }

    return () => {
      scrambleStop.current?.();
      ctx.revert();
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes rotateAurora { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes auroraShift {
          0%,100% { transform: translate(0%,0%) scale(1); opacity: 0.15; }
          33% { transform: translate(3%,-4%) scale(1.05); opacity: 0.22; }
          66% { transform: translate(-2%,3%) scale(0.97); opacity: 0.18; }
        }
      `}</style>

      <section id="home" ref={sectionRef} className="relative min-h-[100svh] overflow-hidden pt-24 pb-2 sm:pb-4">

        {/* Deep space gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(22,55,145,0.25) 0%, transparent 70%)", zIndex: 1 }} />

        {/* Drifting aurora blobs */}
        <div className="absolute pointer-events-none" style={{ inset: 0, overflow: "hidden", zIndex: 1 }}>
          <div style={{ position: "absolute", top: "15%", left: "20%", width: "55vw", height: "55vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(22,55,145,0.35) 0%, transparent 70%)", animation: "auroraShift 14s ease-in-out infinite", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", top: "40%", right: "10%", width: "35vw", height: "35vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(98,170,222,0.18) 0%, transparent 70%)", animation: "auroraShift 18s ease-in-out infinite reverse", filter: "blur(50px)" }} />
        </div>

        {/* Static noise texture — no animation to prevent blinking */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 2, opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }} />

        {/* Content */}
        <div className="relative min-h-[calc(100svh-10rem)] flex items-center justify-center" style={{ zIndex: 2 }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="max-w-6xl mx-auto hero-parallax">

              {/* Badge */}
              <div ref={badgeRef} className="hero-parallax relative inline-flex items-center justify-center p-[1.5px] mb-8 overflow-hidden rounded-full" style={{ background: "transparent" }}>
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[400%]" style={{ background: "conic-gradient(from 0deg at 50% 50%, rgba(98,170,222,0.6), rgba(22,55,145,0.2), rgba(98,170,222,0.6))", animation: "rotateAurora 4s linear infinite" }} />
                <div className="relative flex items-center px-6 py-3 rounded-full" style={{ background: "rgba(6,13,31,0.9)", backdropFilter: "blur(12px)" }}>
                  <Sparkles className="w-4 h-4 mr-2" style={{ color: "#62AADE" }} />
                  <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: "#ffffff" }}>Next-Gen Industrial Intelligence</span>
                </div>
              </div>

              {/* Headline — each line wrapped in overflow:hidden container for clip-reveal */}
              <div>
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter mb-6">
                  <span className="block overflow-hidden">
                    <span ref={line1Ref} className="block text-white">AI PRODUCTS</span>
                  </span>
                  <span className="block overflow-hidden">
                    <span
                      ref={line2Ref}
                      className="block"
                      style={{
                        background: "linear-gradient(135deg, #1a4fa8 0%, #2560c8 40%, #4a8fd4 75%, #62AADE 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        paddingBottom: "0.05em",
                      }}
                    >
                      FOR SMARTER INDUSTRIAL SYSTEMS
                    </span>
                  </span>
                </h1>
              </div>

              {/* Sub */}
              <p ref={subRef} className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-10 hero-parallax" style={{ color: "rgba(255,255,255,0.65)" }}>
               We build AI powered deeptech products for automation and observability, with multiple patented products live to improve operations in the factories
              </p>

              {/* CTAs */}
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center hero-parallax">
                <a href="https://calendly.com/nikhilg-autonexai360/30min" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <button
                    id="hero-cta-primary"
                    className="group relative text-base px-8 py-4 rounded-full font-bold w-full sm:w-auto overflow-hidden flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #163791 0%, #62AADE 100%)", boxShadow: "0 0 40px rgba(22,55,145,0.5), 0 0 80px rgba(98,170,222,0.2)", color: "#fff" }}
                    onMouseEnter={(e) => { gsap.to(e.currentTarget.querySelector(".btn-shimmer"), { x: "200%", duration: 0.5, ease: "power2.inOut" }); }}
                    onMouseLeave={(e) => { gsap.set(e.currentTarget.querySelector(".btn-shimmer"), { x: "-100%" }); }}
                  >
                    <div className="btn-shimmer absolute inset-0 w-1/3 skew-x-[-20deg]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)", transform: "translateX(-100%)" }} />
                    <span className="relative z-10 flex items-center gap-2">Discover Our Platform <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></span>
                  </button>
                </a>
                <a href="/contact" className="w-full sm:w-auto">
                  <button
                    id="hero-cta-secondary"
                    className="group text-base px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 w-full sm:w-auto transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(98,170,222,0.3)", color: "#fff", backdropFilter: "blur(12px)" }}
                    onMouseEnter={(e) => { gsap.to(e.currentTarget, { borderColor: "rgba(98,170,222,0.7)", boxShadow: "0 0 20px rgba(98,170,222,0.2)", duration: 0.3 }); }}
                    onMouseLeave={(e) => { gsap.to(e.currentTarget, { borderColor: "rgba(98,170,222,0.3)", boxShadow: "none", duration: 0.3 }); }}
                  >
                    <Users className="h-5 w-5 transition-transform group-hover:scale-110" />
                    Join as a Partner
                  </button>
                </a>
              </div>


            </div>
          </div>
        </div>
      </section>
    </>
  );
}