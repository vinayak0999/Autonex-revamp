import { type CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  background?: "default" | "secondary" | "gradient";
  maxWidth?: "4xl" | "5xl" | "6xl" | "7xl";
  padding?: "sm" | "md" | "lg" | "xl";
}

export function Section({ 
  id, 
  children, 
  className, 
  background = "default", 
  maxWidth = "7xl", 
  padding = "lg" 
}: SectionProps) {
  const backgroundClasses = {
    // Make sections inherit the page background (so we can force pure black sitewide)
    default: "bg-transparent",
    secondary: "bg-transparent",
    gradient: "bg-transparent"
  };

  const maxWidthClasses = {
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl", 
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl"
  };

  const paddingClasses = {
    sm: "py-16",
    md: "py-20",
    lg: "py-24",
    xl: "py-32"
  };

  return (
    <section 
      id={id}
      className={cn(
        "relative",
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeader({ 
  eyebrow, 
  title, 
  subtitle, 
  centered = true, 
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) {
  const titleContainerRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleBounds, setTitleBounds] = useState({ width: 0, height: 0 });
  // Left offset (px) from the h2's left edge to where the first character actually starts.
  // For centered multi-line text the h2 is full-width, so this offset > 0.
  const [textLeftOffset, setTextLeftOffset] = useState(0);
  const [sweepActive, setSweepActive] = useState(false);

  useEffect(() => {
    setSweepActive(true);
  }, []);

  useEffect(() => {
    const headingEl = titleRef.current;
    if (!headingEl) return;

    const updateBounds = () => {
      const rect = headingEl.getBoundingClientRect();
      setTitleBounds({ width: rect.width, height: rect.height });

      // Measure exact position of the first rendered character (e.g. "D")
      // relative to the h2's own left edge, using the Range API.
      let leftOffset = 0;
      try {
        const firstTextNode = Array.from(headingEl.childNodes).find(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent?.trim().length ?? 0) > 0
        );
        if (firstTextNode) {
          const range = document.createRange();
          range.setStart(firstTextNode, 0);
          range.setEnd(firstTextNode, 1);
          const charRect = range.getBoundingClientRect();
          leftOffset = Math.max(0, charRect.left - rect.left);
        }
      } catch (_) {
        // fallback: no offset
      }
      setTextLeftOffset(leftOffset);
    };

    updateBounds();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => updateBounds());
      resizeObserver.observe(headingEl);
    }

    window.addEventListener("resize", updateBounds);

    return () => {
      window.removeEventListener("resize", updateBounds);
      resizeObserver?.disconnect();
    };
  }, [title]);

  // Glow is constrained to the actual text area: starts at the first character,
  // width = element width minus the symmetric indent on both sides.
  const glowLeft = textLeftOffset;
  const glowWidth = titleBounds.width
    ? Math.max(titleBounds.width - textLeftOffset * 2, titleBounds.width * 0.4)
    : undefined;

  const glowStyle: CSSProperties = {
    top: 0,
    left: glowLeft > 0 ? `${glowLeft}px` : 0,
    width: glowWidth ? `${glowWidth}px` : "100%",
    height: titleBounds.height ? `${titleBounds.height}px` : "100%",
    background:
      "linear-gradient(to right, transparent 0%, hsl(var(--primary)/0.06) 6%, hsl(var(--primary)/0.2) 20%, hsl(var(--primary)/0.28) 45%, hsl(var(--primary)/0.28) 55%, hsl(var(--primary)/0.2) 80%, hsl(var(--primary)/0.06) 94%, transparent 100%)",
    animation: "sectionTitlePulse 4s ease-in-out infinite",
    filter: "blur(12px)",
    transform: "translateZ(0)",
    willChange: "opacity",
    // clip-path ensures the blur doesn't bleed left of the glow box
    clipPath: "inset(0)",
  };

  return (
    <div className={cn(
      "mb-16", 
      centered && "text-center max-w-4xl mx-auto",
      className
    )}>
      {/* Light sweep + glow keyframes for section titles */}
      <style>{`
        @keyframes sectionTitleSweepOnce { 
          0% { transform: translateX(-120%); opacity: 0.0; }
          10% { opacity: 0.5; }
          50% { opacity: 0.6; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes sectionTitleFlow { 
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes sectionTitleWaveFlow {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(120%); }
        }
        @keyframes sectionTitleWaveBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes sectionTitlePulse { 0%, 100% { opacity: 0.45; } 50% { opacity: 0.85; } }
        @keyframes rotateBadgeBorder { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
      `}</style>
      {eyebrow && (
        <div className="relative inline-flex items-center justify-center p-0.5 mb-6 overflow-hidden rounded-full">
          {/* Animated border glow with rotating conic gradient */}
          <div className="absolute top-1/2 left-1/2 w-[200%] h-[400%]" style={{ background: 'conic-gradient(from 0deg at 50% 50%, rgba(98, 170, 222, 0.5), rgba(22, 55, 145, 0.3), rgba(98, 170, 222, 0.5))', animation: 'rotateBadgeBorder 4s linear infinite' }} />
          {/* Badge container */}
          <div className="relative flex items-center px-5 py-2.5 rounded-full border border-[#163791]/30 bg-zinc-900/90 backdrop-blur-sm shadow-lg shadow-black/50 z-10">
            {/* Sparkles icon */}
            <Sparkles className="w-4 h-4 mr-2 text-[#62AADE] drop-shadow-[0_0_4px_rgba(98,170,222,0.6)]" />
            {/* Badge text */}
            <span className="text-sm font-semibold tracking-wider uppercase text-[#efefef] drop-shadow-lg">
              {eyebrow}
            </span>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        {/* clipPath: inset(0) forces hard GPU clip so blur never bleeds left of "D" */}
        <span
          ref={titleContainerRef}
          className="relative inline-block align-top overflow-hidden"
          style={{ clipPath: "inset(0)" }}
        >
          <h2
            ref={titleRef}
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground inline-block relative z-10 m-0 p-0",
              titleClassName
            )}
            style={{ textShadow: "0 0 12px rgba(255,255,255,0.06)" }}
          >
            {title}
          </h2>
          {/* Glow halo - dynamically sized to the measured text bounds */}
          <span
            className="pointer-events-none absolute -z-10 opacity-40 block"
            style={glowStyle}
          />
          {/* Wave-like multi-sweep constrained to text width, continuous and soft.
              The container's left/right are offset to textLeftOffset so the sweep
              clips exactly at the first character position. */}
          {sweepActive && (
            <span
              className="pointer-events-none absolute block -z-10"
              style={{
                top: 0,
                bottom: 0,
                left: textLeftOffset > 0 ? `${textLeftOffset}px` : 0,
                right: textLeftOffset > 0 ? `${textLeftOffset}px` : 0,
                overflow: "hidden",
                clipPath: "inset(0)",
                animation: "sectionTitleWaveBob 2.8s ease-in-out infinite",
              }}
            >
              <span
                className="absolute top-0 bottom-0 left-0 w-1/3 opacity-35 mix-blend-screen"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
                  animation: "sectionTitleWaveFlow 3s linear infinite",
                }}
              />
              <span
                className="absolute top-0 bottom-0 left-0 w-1/4 opacity-25 mix-blend-screen"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                  animation: "sectionTitleWaveFlow 2.2s linear infinite",
                  animationDelay: "0.6s",
                }}
              />
            </span>
          )}
        </span>
      </div>
      
      {subtitle && (
        <p className={cn("text-xl md:text-2xl text-muted-foreground leading-relaxed", subtitleClassName)}>
          {subtitle}
        </p>
      )}
    </div>
  );
}