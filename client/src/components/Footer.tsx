import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer({ hideCta = false }: { hideCta?: boolean }) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isProducts = pathname === "/products";
  const isAbout = pathname === "/about";
  const isDataServices = pathname === "/data-services";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const goToContact = () => {
    window.location.href = "/contact";
  };

  const bookACall = () => {
    const mail = "nikhilg@autonexai360.com";
    const subject = encodeURIComponent("Book a Call - Data Annotation Services");
    const body = encodeURIComponent("Hi Autonex AI team,\n\nI would like to book a call to discuss data annotation needs.\n\nThanks,");
    window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`;
  };

  const handleNavClick = (sectionId: string) => {
    if (window.location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    window.location.href = `/#${sectionId}`;
  };

  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastFrameTime = 0;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      type: 'electron' | 'proton';
      charge: number;
      trail: Array<{ x: number, y: number }>;
    }> = [];

    const isMobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    const initParticles = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const effectiveDpr = isMobile ? Math.min(1.5, dpr) : dpr;
      canvas.width = Math.floor(rect.width * effectiveDpr);
      canvas.height = Math.floor(rect.height * effectiveDpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(effectiveDpr, effectiveDpr);

      particles = [];
      const densityDivisor = isMobile ? 30000 : 15000;
      const particleCount = Math.min(600, Math.floor((rect.width * rect.height) / densityDivisor));

      for (let i = 0; i < particleCount; i++) {
        const type = Math.random() > 0.5 ? 'electron' : 'proton';
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: type === 'electron' ? 1.5 : 2.5,
          type,
          charge: type === 'electron' ? -1 : 1,
          trail: []
        });
      }
    };

    const updateParticles = () => {
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Add to trail
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 8) particle.trail.shift();

        // Apply electromagnetic forces (skip on mobile to avoid O(n^2))
        if (!isMobile) {
          for (let i = 0; i < particles.length; i += 2) {
            const other = particles[i];
            if (particle === other) continue;
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0 && distance < 100) {
              const force = (particle.charge * other.charge) / (distance * distance) * 0.001;
              const fx = (dx / distance) * force;
              const fy = (dy / distance) * force;
              particle.vx += fx;
              particle.vy += fy;
            }
          }
        }

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Draw trail
        if (particle.trail.length > 1) {
          ctx.strokeStyle = particle.type === 'electron'
            ? `rgba(22, 55, 145, ${0.3})`
            : `rgba(15, 42, 107, ${0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }
          ctx.stroke();
        }

        // Draw particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 3
        );

        if (particle.type === 'electron') {
          gradient.addColorStop(0, 'rgba(22, 55, 145, 0.8)');
          gradient.addColorStop(1, 'rgba(22, 55, 145, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(15, 42, 107, 0.8)');
          gradient.addColorStop(1, 'rgba(15, 42, 107, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.fillStyle = particle.type === 'electron' ? '#163791' : '#0f2a6b';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    let running = true;
    const animate = (ts?: number) => {
      if (!running) { animationFrameId = requestAnimationFrame(animate); return; }
      // Throttle to ~30fps on mobile
      if (isMobile && ts !== undefined) {
        if (ts - lastFrameTime < 33) {
          animationFrameId = requestAnimationFrame(animate);
          return;
        }
        lastFrameTime = ts;
      }
      updateParticles();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    const handleResize = () => {
      initParticles();
    };
    const handleVisibility = () => {
      running = document.visibilityState === 'visible';
      if (running) {
        lastFrameTime = 0;
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Footer hero copy (page-specific overrides)
  const titleText = isAbout
    ? "Ready to Connect?"
    : isDataServices
      ? "Ready to Scale Your AI Training?"
      : isProducts
        ? "Ready To Transform Your Operations?"
        : "Ready to get started?";
  const subtitleText = isAbout
    ? "Reach out to us to discuss how we can transform your industrial operations"
    : isDataServices
      ? "Contact us to discuss your data annotation needs. We'll get back within 24 hours with a customized solution."
      : isProducts
        ? "Discover how our AI-powered solutions can revolutionize your industrial processess."
        : "Schedule a consultation to discuss your industrial automation needs";
  const primaryLabel = isDataServices
    ? "Book a Call"
    : isProducts || isAbout
      ? "Contact Us"
      : "Schedule Consultation";
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        @keyframes rotateAurora {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
      <footer className="relative w-full">
        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          style={{ background: 'transparent' }}
        />

        {/* ── CTA — LET'S GET STARTED TOGETHER ─────────────────────────── */}
        {!hideCta && (
          <div
            className="relative w-full overflow-hidden flex flex-col items-center justify-center"
            style={{ minHeight: "62vh" }}
          >
            {/* Brand blue — soft, blended glow from bottom */}
            <div style={{
              position: "absolute",
              bottom: 0, left: "50%",
              transform: "translateX(-50%)",
              width: "60%", height: "50%",
              background: "radial-gradient(ellipse at 50% 100%, rgba(22,55,145,0.28) 0%, rgba(98,170,222,0.08) 55%, transparent 80%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }} />


            {/* Top fade to blend with section above */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 80,
              background: "linear-gradient(to bottom, var(--background, #060d1f), transparent)",
              pointerEvents: "none",
            }} />

            {/* ── Giant headline ──────────────────────────────────────────── */}
            <div
              className="relative z-10 text-center px-4"
              style={{ paddingTop: "5rem", paddingBottom: "2.5rem" }}
            >
              <h2
                style={{
                  fontFamily:    "'Arial Black', 'Helvetica Neue', Impact, sans-serif",
                  fontWeight:    900,
                  textTransform: "uppercase",
                  lineHeight:    0.92,
                  color:         "#dce7f5",
                  letterSpacing: "0.01em",
                  textShadow:    "0 0 60px rgba(98,170,222,0.18), 0 0 20px rgba(22,55,145,0.12)",
                }}
              >
                <span style={{ display: "block", fontSize: "clamp(2rem, 6.5vw, 7rem)", whiteSpace: "nowrap" }}>
                  LET&apos;S GET STARTED
                </span>
                <span style={{ display: "block", fontSize: "clamp(2rem, 6.5vw, 7rem)", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                  TOGETHER
                </span>
              </h2>

              {/* ── SCHEDULE CONSULTATION button ──────────────────────────── */}
              <div style={{ marginTop: "3.5rem" }}>
                <a
                  href="/contact"
                  style={{
                    display:        "inline-flex",
                    alignItems:     "center",
                    gap:            "0.65rem",
                    padding:        "0.85rem 2.4rem",
                    borderRadius:   999,
                    background:     "rgba(8,14,35,0.85)",
                    border:         "1px solid rgba(98,170,222,0.25)",
                    color:          "rgba(255,255,255,0.88)",
                    fontFamily:     "inherit",
                    fontWeight:     700,
                    fontSize:       "0.72rem",
                    letterSpacing:  "0.22em",
                    textTransform:  "uppercase",
                    textDecoration: "none",
                    cursor:         "pointer",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    boxShadow:      "0 4px 32px rgba(0,0,0,0.5), 0 0 20px rgba(22,55,145,0.2), inset 0 1px 0 rgba(98,170,222,0.08)",
                    transition:     "all 0.25s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(22,55,145,0.4)";
                    (e.currentTarget as HTMLAnchorElement).style.border = "1px solid rgba(98,170,222,0.5)";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.04)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 40px rgba(0,0,0,0.5), 0 0 30px rgba(22,55,145,0.4)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(8,14,35,0.85)";
                    (e.currentTarget as HTMLAnchorElement).style.border = "1px solid rgba(98,170,222,0.25)";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 32px rgba(0,0,0,0.5), 0 0 20px rgba(22,55,145,0.2), inset 0 1px 0 rgba(98,170,222,0.08)";
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  SCHEDULE CONSULTATION
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Secondary footer (marketing) */}
        <div className="relative z-10">
          <div className="px-4 md:px-6 py-14">
            <div
              className="max-w-7xl mx-auto rounded-md bg-black p-8 md:p-12 relative overflow-visible"
            >
              {/* < 1280px (xl) – three-column compact grid */}
              <div className="xl:hidden text-[11px] sm:text-xs md:text-sm leading-5 text-muted-foreground">
                <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                  {/* Left: Socials (vertical) */}
                  <div className="space-y-1.5 text-left">
                    <a
                      href="https://www.linkedin.com/company/autonex-ai/posts/?feedView=all"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-1 py-0.5 hover:text-foreground transition-colors"
                    >
                      LinkedIn
                    </a>
                  </div>
                  {/* Middle: Navigation (vertical) */}
                  <div className="space-y-1.5 text-center">
                    <button className="block px-1 py-0.5 hover:text-foreground transition-colors" onClick={() => handleNavClick('home')}>Home</button>
                    <button className="block px-1 py-0.5 hover:text-foreground transition-colors" onClick={() => handleNavClick('why-autonex')}>Our Vision</button>
                    <button className="block px-1 py-0.5 hover:text-foreground transition-colors" onClick={() => handleNavClick('products')}>Services</button>
                    <button className="block px-1 py-0.5 hover:text-foreground transition-colors" onClick={() => handleNavClick('industries')}>Industries</button>
                    <button className="block px-1 py-0.5 hover:text-foreground transition-colors" onClick={goToContact}>Contact</button>
                  </div>
                  {/* Right: Legal (vertical) */}
                  <div className="space-y-1.5 text-right">
                    <a href="/terms" className="block px-1 py-0.5 hover:text-foreground transition-colors">Terms of Service</a>
                    <a href="/privacy" className="block px-1 py-0.5 hover:text-foreground transition-colors">Privacy Policy</a>
                  </div>
                </div>
              </div>

              {/* >= 1280px – single line, three groups */}
              <div className="hidden xl:flex w-full items-center justify-between gap-x-8 gap-y-4 pl-8 pr-4 text-sm text-muted-foreground flex-wrap">
                {/* Left: Socials */}
                <div className="flex items-center gap-6 xl:gap-8 2xl:gap-12">
                  <a
                    href="https://www.linkedin.com/company/autonex-ai/posts/?feedView=all"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>

                {/* Center: Navigation */}
                <div className="flex items-center gap-6 xl:gap-8 2xl:gap-12">
                  <button className="hover:text-foreground transition-colors" onClick={() => handleNavClick('home')}>Home</button>
                  <button className="hover:text-foreground transition-colors" onClick={() => handleNavClick('why-autonex')}>Our Vision</button>
                  <button className="hover:text-foreground transition-colors" onClick={() => handleNavClick('products')}>Services</button>
                  <button className="hover:text-foreground transition-colors" onClick={() => handleNavClick('industries')}>Industries</button>
                  <button className="hover:text-foreground transition-colors" onClick={goToContact}>Contact</button>
                </div>

                {/* Right: Legal */}
                <div className="flex items-center gap-6 xl:gap-8 2xl:gap-12">
                  <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
                  <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
                </div>
              </div>

              {/* Thin divider visible on all sizes */}
              <Separator className="my-6 bg-white/10" />

              {/* Bottom bar for < 1280px */}
              <div className="xl:hidden w-full mt-2">
                {/* Stacked layout on extra-small screens */}
                <div className="sm:hidden flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/path25.png"
                      alt="Autonex Home"
                      className="h-6 w-auto object-contain cursor-pointer"
                      onClick={() => handleNavClick('home')}
                    />
                    <span className="text-muted-foreground">|</span>
                    <p className="text-muted-foreground text-xs">© {currentYear} Autonex. All rights reserved.</p>
                  </div>
                  <div className="h-px w-4/5 bg-white/10" />
                </div>

                {/* Single row with equal spacing on small-to-large (<1280px) */}
                <div className="hidden sm:flex items-center justify-between px-4 sm:px-6 md:px-8 gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-nowrap">
                    <img
                      src="/path25.png"
                      alt="Autonex Home"
                      className="h-6 w-auto object-contain cursor-pointer flex-shrink-0"
                      onClick={() => handleNavClick('home')}
                    />
                    <span className="text-muted-foreground flex-shrink-0">|</span>
                    <p className="text-muted-foreground whitespace-nowrap text-[10px] sm:text-xs md:text-sm truncate">© {currentYear} Autonex. All rights reserved.</p>
                  </div>
                </div>
              </div>

              {/* Bottom bar for >= 1280px */}
              <div className="hidden xl:flex items-center justify-between gap-10 text-left mt-12 pl-8 pr-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/path25.png"
                    alt="Autonex Home"
                    className="h-7 w-auto object-contain cursor-pointer"
                    onClick={() => handleNavClick('home')}
                  />
                  <span className="text-muted-foreground">|</span>
                  <p className="text-muted-foreground text-sm">© {currentYear} Autonex. All rights reserved.</p>
                </div>

              </div>

              {/* Removed: shadow here now connects to the Schedule Consultation bordered box above */}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}