import { useRef } from "react";
import { gsap, ScrollTrigger, EASE_SPRING } from "@/lib/gsap";
import { useGSAP } from "@/hooks/useGSAP";

const stats = [
  { value: 10, suffix: " Cr+", prefix: "INR ", label: "in client savings delivered" },
  { value: 20, suffix: "+", prefix: "", label: "Factories running Autonex live" },
  { value: 10000, suffix: "+", prefix: "", label: "Dispatches tracked with 99%+ accuracy" },
  { value: 50, suffix: "%", prefix: "", label: "Drop in safety incidents — first month" },
];

function formatNum(n: number) {
  return n >= 1000 ? n.toLocaleString() : String(n);
}

export default function StatsStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBotRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (ctx) => {
      if (!sectionRef.current) return;

      // Draw separator lines from center out
      [lineTopRef.current, lineBotRef.current].forEach((el) => {
        if (!el) return;
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "center",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
        });
      });

      // Animate each stat card
      const items = sectionRef.current?.querySelectorAll(".stat-item");
      items?.forEach((item, i) => {
        const dir = i % 2 === 0 ? -40 : 40;
        const numEl = item.querySelector(".stat-num");
        const prefixEl = item.querySelector(".stat-prefix");
        const suffixEl = item.querySelector(".stat-suffix");
        const labelEl = item.querySelector(".stat-label");

        const target = stats[i].value;
        const obj = { val: 0 };

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            // Slide in card
            gsap.from(item, { x: dir, opacity: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out" });

            // Number count up with elastic overshoot
            gsap.to(obj, {
              val: target,
              duration: 1.8,
              delay: i * 0.12 + 0.3,
              ease: EASE_SPRING,
              onUpdate: () => {
                if (numEl) numEl.textContent = formatNum(Math.round(obj.val));
              },
            });

            // Prefix/suffix fade
            if (prefixEl) gsap.from(prefixEl, { opacity: 0, duration: 0.5, delay: i * 0.12 + 0.6 });
            if (suffixEl) gsap.from(suffixEl, { opacity: 0, duration: 0.5, delay: i * 0.12 + 0.8 });
            if (labelEl) gsap.from(labelEl, { y: 12, opacity: 0, duration: 0.5, delay: i * 0.12 + 0.7, ease: "power2.out" });
          },
        });
      });
    },
    sectionRef,
    []
  );

  return (
    <section ref={sectionRef} className="relative py-12 md:py-16 overflow-hidden">
      {/* Separator lines */}
      <div ref={lineTopRef} className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(98,170,222,0.3), transparent)" }} />
      <div ref={lineBotRef} className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(98,170,222,0.3), transparent)" }} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, transparent, rgba(22,55,145,0.06), transparent)" }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[rgba(98,170,222,0.1)]">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-item flex flex-col items-center text-center px-6 py-4 group"
            >
              <div className="text-4xl md:text-5xl font-bold tracking-tight mb-2 leading-none">
                <span className="stat-prefix text-[rgba(255,255,255,0.45)] text-2xl md:text-3xl font-semibold">{stat.prefix}</span>
                <span
                  className="stat-num"
                  style={{ background: "linear-gradient(135deg,#fff 0%,#62AADE 60%,#163791 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  0
                </span>
                <span
                  className="stat-suffix"
                  style={{ background: "linear-gradient(135deg,#62AADE 0%,#163791 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  {stat.suffix}
                </span>
              </div>
              <p className="stat-label text-sm md:text-base font-medium leading-snug max-w-[160px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
