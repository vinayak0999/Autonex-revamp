import { useRef, useEffect } from "react";
import { gsap, Draggable } from "@/lib/gsap";

const CARDS = [
  {
    emoji:       "💰",
    title:       "20–50× Lower Cost",
    description: "Optimised AI pipeline built for Indian industrial scale. Not priced for Fortune 500 budgets.",
    color:       "#62AADE",                                                          // brand sapphire
    bg:          "linear-gradient(145deg, #0c1f3d 0%, #060d1f 100%)",               // dark navy
  },
  {
    emoji:       "🏭",
    title:       "Trained on Your Factory",
    description: "We train on your footage, your machines, your conditions. Nothing generic. Nothing off-the-shelf.",
    color:       "#60a5fa",                                                          // bright blue (unchanged)
    bg:          "linear-gradient(145deg, #0d2347 0%, #080f20 100%)",               // dark navy (unchanged)
  },
  {
    emoji:       "📷",
    title:       "Works on Existing Cameras",
    description: "No rip-and-replace. No new hardware budget. Your current CCTV is all we need to go live.",
    color:       "#7bafd4",                                                          // steel blue (was amber)
    bg:          "linear-gradient(145deg, #0e1e38 0%, #060d1f 100%)",               // dark navy (was orange)
  },
  {
    emoji:       "🧩",
    title:       "Start with One Module",
    description: "Pick the product that solves your biggest pain today. Prove ROI. Then expand. No big-bang commitment.",
    color:       "#a78bfa",                                                          // soft violet (unchanged — in brand gradient)
    bg:          "linear-gradient(145deg, #1a1342 0%, #0c0921 100%)",               // dark navy-violet
  },
  {
    emoji:       "🔬",
    title:       "Patent-Published Tech",
    description: "Digital Twin simulation patent-published, developed at IIT Bombay. Proprietary IP — not a wrapper.",
    color:       "#34c4c4",                                                          // deep teal (was red)
    bg:          "linear-gradient(145deg, #061f2b 0%, #030d18 100%)",               // dark teal-navy (was dark red)
  },
];

function buildSeamlessLoop(
  items: HTMLElement[],
  spacing: number,
  animateFunc: (el: HTMLElement) => gsap.core.Timeline
): gsap.core.Timeline {
  const overlap      = Math.ceil(1 / spacing);
  const startTime    = items.length * spacing + 0.5;
  const loopTime     = (items.length + overlap) * spacing + 1;
  const rawSequence  = gsap.timeline({ paused: true });
  const seamlessLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    onRepeat(this: gsap.core.Timeline) {
      // @ts-ignore
      if (this._time === this._dur) this._tTime += this._dur - 0.01;
    },
  });

  for (let i = 0; i < items.length + overlap * 2; i++) {
    const index = i % items.length;
    rawSequence.add(animateFunc(items[index]), i * spacing);
  }

  rawSequence.time(startTime);
  seamlessLoop
    .to(rawSequence, { time: loopTime, duration: loopTime - startTime, ease: "none" })
    .fromTo(rawSequence,
      { time: overlap * spacing + 1 },
      { time: startTime, duration: startTime - (overlap * spacing + 1), immediateRender: false, ease: "none" }
    );
  return seamlessLoop;
}

export default function VisionScene() {
  const listRef     = useRef<HTMLUListElement>(null);
  const dragProxRef = useRef<HTMLDivElement>(null);
  const prevRef     = useRef<HTMLButtonElement>(null);
  const nextRef     = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const list     = listRef.current;
    const dragProx = dragProxRef.current;
    if (!list || !dragProx) return;

    const cardEls = Array.from(list.querySelectorAll<HTMLElement>(".vs-card"));
    const spacing = 0.14;

    gsap.set(cardEls, { xPercent: 400, opacity: 0, scale: 0 });

    const animateFunc = (el: HTMLElement) => {
      const tl = gsap.timeline();
      tl.fromTo(el,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false }
      ).fromTo(el,
        { xPercent: 400 },
        { xPercent: -400, duration: 1, ease: "none", immediateRender: false },
        0
      );
      return tl;
    };

    const seamlessLoop = buildSeamlessLoop(cardEls, spacing, animateFunc);
    const snapTime     = gsap.utils.snap(spacing);
    const wrapTime     = gsap.utils.wrap(0, seamlessLoop.duration());

    const playhead = { offset: 0 };

    // Scrub tween — used by drag and buttons
    const scrub = gsap.to(playhead, {
      offset: 0,
      onUpdate() { seamlessLoop.time(wrapTime(playhead.offset)); },
      duration: 0.5, ease: "power3", paused: true,
    });

    // Auto-play — just let the loop run on its own ticker
    const autoTween = gsap.to(playhead, {
      offset: "+=" + seamlessLoop.duration() * 10,   // run for a long time
      duration: seamlessLoop.duration() * 10 / 0.06, // ~speed: 0.06 units/sec
      ease: "none",
      repeat: -1,
      onUpdate() { seamlessLoop.time(wrapTime(playhead.offset)); },
    });

    const pauseAuto  = () => autoTween.pause();
    const resumeAuto = () => autoTween.play();

    // Snap to nearest card after interaction ends
    const snapToNearest = () => {
      autoTween.pause();
      const snapped = snapTime(playhead.offset);
      gsap.to(playhead, {
        offset: snapped,
        duration: 0.5, ease: "power3.out",
        onUpdate() { seamlessLoop.time(wrapTime(playhead.offset)); },
        onComplete() { resumeAuto(); },
      });
    };

    // Prev / Next
    const step = spacing;
    prevRef.current?.addEventListener("click", () => {
      pauseAuto();
      playhead.offset -= step;
      scrub.invalidate().restart();
      setTimeout(snapToNearest, 600);
    });
    nextRef.current?.addEventListener("click", () => {
      pauseAuto();
      playhead.offset += step;
      scrub.invalidate().restart();
      setTimeout(snapToNearest, 600);
    });

    // Drag
    Draggable.create(dragProx, {
      type: "x",
      trigger: list,
      onPress() { pauseAuto(); (this as any).startOffset = playhead.offset; },
      onDrag(this: Draggable) {
        playhead.offset = (this as any).startOffset + ((this as any).startX - this.x) * 0.001;
        seamlessLoop.time(wrapTime(playhead.offset));
      },
      onDragEnd() { snapToNearest(); },
    });

    return () => {
      autoTween.kill();
      scrub.kill();
      seamlessLoop.kill();
    };
  }, []);

  return (
    <section
      id="why-autonex"
      className="relative overflow-hidden"
      style={{
        height: "100vh",
        background: "radial-gradient(ellipse at 50% 55%, rgba(96,165,250,0.04) 0%, transparent 60%)",
      }}
    >
      {/* Title */}
      <div className="absolute top-0 left-0 right-0 z-20 text-center pt-28 pointer-events-none">
        <p
          className="text-[11px] font-black tracking-[0.28em] uppercase mb-3"
          style={{ color: "#60a5fa" }}
        >
          Why Autonex
        </p>
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05]"
          style={{ letterSpacing: "-0.025em" }}
        >
          Deep tech.<br />
          <span style={{ color: "#60a5fa" }}>Nothing generic.</span>
        </h2>
        <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.22)", letterSpacing: "0.1em" }}>
          DRAG OR USE BUTTONS
        </p>
      </div>

      {/* Card list */}
      <ul
        ref={listRef}
        style={{
          position: "absolute",
          width: "15rem",
          top: "50%", left: "50%",
          transform: "translate(-50%, -44%)",
          listStyle: "none", margin: 0, padding: 0,
        }}
      >
        {[...CARDS, ...CARDS].map((card, i) => (
          <li
            key={i}
            className="vs-card"
            style={{
              position:       "absolute",
              top: 0, left: 0,
              width:          "15rem",
              aspectRatio:    "9/16",
              maxHeight:      "24rem",
              borderRadius:   "1.2rem",
              overflow:       "hidden",
              background:     card.bg,
              border:         `1px solid ${card.color}30`,
              boxShadow:      `0 24px 60px rgba(0,0,0,0.7), 0 0 40px ${card.color}12`,
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              justifyContent: "center",
              padding:        "1.75rem 1.25rem",
              textAlign:      "center",
              gap:            "0.85rem",
            }}
          >
            <div style={{ fontSize: "3rem", lineHeight: 1 }}>{card.emoji}</div>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: card.color, boxShadow: `0 0 10px ${card.color}`,
              margin: "0.1rem auto",
            }} />
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.25 }}>
              {card.title}
            </h3>
            <p style={{ fontSize: "0.72rem", lineHeight: 1.55, color: "rgba(255,255,255,0.48)" }}>
              {card.description}
            </p>
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
            }} />
          </li>
        ))}
      </ul>

      {/* Drag proxy */}
      <div ref={dragProxRef} style={{ visibility: "hidden", position: "absolute" }} />

      {/* Prev / Next */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: "0.75rem", zIndex: 30,
      }}>
        <button
          ref={prevRef}
          style={{
            padding: "0.45rem 1.2rem", borderRadius: 999,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)", fontFamily: "inherit", fontWeight: 700,
            fontSize: "0.7rem", letterSpacing: "0.06em", cursor: "pointer",
          }}
        >
          ← PREV
        </button>
        <button
          ref={nextRef}
          style={{
            padding: "0.45rem 1.2rem", borderRadius: 999,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)", fontFamily: "inherit", fontWeight: 700,
            fontSize: "0.7rem", letterSpacing: "0.06em", cursor: "pointer",
          }}
        >
          NEXT →
        </button>
      </div>
    </section>
  );
}
