/**
 * HorizontalTextReveal
 * ─────────────────────────────────────────────────────────────────────────
 * Pins the section to the viewport while a giant headline scrolls
 * horizontally (right → left). Each character flies in from a random
 * yPercent / rotation, scrubbed to the horizontal scroll progress —
 * exactly like the GSAP containerAnimation SplitText reference.
 *
 * Props:
 *   text       – the headline to display
 *   eyebrow    – small label above (optional)
 *   accent     – CSS color string for the gradient accent (default brand blue)
 *   scrollDist – how many px of scroll to consume (default 3500)
 */

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface Props {
  text: string;
  eyebrow?: string;
  accent?: string;
  scrollDist?: number;
}

export default function HorizontalTextReveal({
  text,
  eyebrow,
  accent = "#62AADE",
  scrollDist = 3500,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const textEl  = textRef.current;
    if (!wrapper || !textEl) return;

    // ── 1. Split text into individual char spans ──────────────────────
    const raw   = textEl.textContent ?? "";
    textEl.innerHTML = "";          // clear
    textEl.style.whiteSpace = "nowrap";

    const spans: HTMLSpanElement[] = [];
    Array.from(raw).forEach((ch) => {
      const s = document.createElement("span");
      s.textContent = ch === " " ? "\u00A0" : ch;
      s.style.display = "inline-block";
      s.style.willChange = "transform, opacity";
      textEl.appendChild(s);
      spans.push(s);
    });

    // ── 2. Horizontal scroll tween (pins the wrapper) ─────────────────
    const scrollTween = gsap.to(textEl, {
      xPercent: -100,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        pin: true,
        end: `+=${scrollDist}px`,
        scrub: true,
      },
    });

    // ── 3. Per-char animation using containerAnimation ─────────────────
    spans.forEach((span) => {
      gsap.from(span, {
        yPercent: () => gsap.utils.random(-220, 220),
        rotation: () => gsap.utils.random(-25, 25),
        opacity: 0,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger:            span,
          containerAnimation: scrollTween,   // ← the magic
          start:              "left 100%",
          end:                "left 28%",
          scrub:              1.2,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.containerAnimation === scrollTween) t.kill();
      });
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, [text, scrollDist]);

  return (
    <div
      ref={wrapperRef}
      className="horizontal-reveal overflow-hidden"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {eyebrow && (
        <span
          style={{
            position: "absolute",
            top: "calc(50% - 4.5rem)",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: accent,
            opacity: 0.7,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {eyebrow}
        </span>
      )}

      <div
        ref={textRef}
        style={{
          // padding-left pushes text off-screen right so it scrolls fully into view
          paddingLeft: "100vw",
          display:     "flex",
          gap:         "0.18em",
          // Gradient text — stays in the blue/white palette
          background: `linear-gradient(135deg, #ffffff 0%, ${accent} 45%, rgba(255,255,255,0.85) 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor:  "transparent",
          backgroundClip:       "text",
          fontSize:     "clamp(3.5rem, 11vw, 10rem)",
          fontWeight:   900,
          lineHeight:   1.05,
          letterSpacing: "-0.03em",
          userSelect:   "none",
        }}
      />
    </div>
  );
}
