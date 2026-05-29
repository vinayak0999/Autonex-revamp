import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { gsap, EASE_POWER4 } from "@/lib/gsap";
import { stopLenis, startLenis } from "@/lib/lenis";

export default function Header() {
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const headerRef    = useRef<HTMLElement>(null);
  const logoRef      = useRef<HTMLImageElement>(null);
  const menuBtnRef   = useRef<HTMLButtonElement>(null);
  // Menu DOM refs (always mounted — no conditional render = no flash)
  const overlayRef   = useRef<HTMLDivElement>(null);
  const scrimRef     = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll as any);
  }, []);

  // Header entrance animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -70, opacity: 0, duration: 0.9, ease: EASE_POWER4, delay: 0.1,
      });
      gsap.from(logoRef.current, {
        scale: 0.6, opacity: 0, duration: 0.9, ease: "back.out(1.7)", delay: 0.35,
      });
      gsap.from(menuBtnRef.current, {
        x: 30, opacity: 0, duration: 0.7, ease: EASE_POWER4, delay: 0.5,
      });
    });

    return () => ctx.revert();
  }, []);

  // ── Menu open / close animation (GSAP drives BOTH directions) ────────────
  useEffect(() => {
    const overlay = overlayRef.current;
    const scrim   = scrimRef.current;
    const panel   = menuPanelRef.current;
    const list    = menuItemsRef.current;
    if (!overlay || !scrim || !panel) return;

    if (menuOpen) {
      // ── OPEN ────────────────────────────────────────────────────
      stopLenis();
      gsap.set(overlay, { visibility: "visible", pointerEvents: "auto" });
      gsap.to(scrim, { opacity: 1, duration: 0.25, ease: "power2.out" });
      // fromTo ensures GSAP doesn't rely on reading CSS transform
      gsap.fromTo(panel,
        { x: "100%", opacity: 0 },
        { x: "0%",   opacity: 1, duration: 0.45, ease: "power3.out", clearProps: "transform" }
      );
      if (list) {
        gsap.from(list.querySelectorAll("li"), {
          x: 40, opacity: 0, duration: 0.4, stagger: 0.08, ease: "power3.out", delay: 0.18,
        });
      }
    } else {
      // ── CLOSE ────────────────────────────────────────────────────────────
      gsap.to(scrim, { opacity: 0, duration: 0.25, ease: "power2.in" });
      gsap.to(panel, {
        x: "100%", opacity: 0, duration: 0.35, ease: "power3.in",
        onComplete: () => {
          gsap.set(overlay, { visibility: "hidden", pointerEvents: "none" });
          startLenis(); // re-enable body scroll after overlay is gone
        },
      });
    }
  }, [menuOpen]);

  const handleNavClick = (sectionId: string) => {
    setMenuOpen(false);
    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) { element.scrollIntoView({ behavior: "smooth" }); return; }
    }
    navigate(`/#${sectionId}`);
  };

  const goToTopAndClose = (path: string) => {
    setMenuOpen(false);
    if (window.location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(path);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
      style={{ top: 14 }}
    >
      <div className="max-w-7xl mx-auto px-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-20">
          <div />
          <div className="flex items-center justify-center">
            <img
              ref={logoRef}
              src="/path25.png"
              alt="Autonex Logo"
              className="h-14 w-auto object-contain cursor-pointer transition-transform duration-200 hover:scale-105"
              style={{ filter: "brightness(1.95) saturate(1.1)" }}
              onClick={() => handleNavClick("home")}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              ref={menuBtnRef as any}
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="hover:scale-105 transition-transform duration-150 flex items-center justify-center rounded-md"
              style={{ width: 30, height: 30, background: "transparent", border: "none", cursor: "pointer", color: "white" }}
            >
              <Menu style={{ width: 36, height: 36 }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Menu overlay — ALWAYS MOUNTED, GSAP controls visibility ─────────
          Initial state via inline CSS so it’s invisible from frame 0.    */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[60]"
        style={{ visibility: "hidden", pointerEvents: "none" }}
        aria-hidden={!menuOpen}
      >
        {/* Scrim — solid background, no backdrop-blur (avoids GPU repaint) */}
        <button
          ref={scrimRef}
          aria-label="Close menu overlay"
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-black/50"
          style={{ opacity: 0, border: "none", cursor: "pointer" }}
        />

        {/* Quarter-circle panel */}
        <div className="pointer-events-none absolute top-0 right-0 w-[85vw] max-w-[520px] aspect-square overflow-hidden rounded-bl-[100%]">
          <div
            ref={menuPanelRef}
            className="pointer-events-auto absolute inset-0 text-white shadow-2xl flex flex-col"
            style={{
              background: "rgba(6,13,31,0.98)",
              border: "1px solid rgba(98,170,222,0.2)",
              // Initial state: invisible at frame 0 — GSAP will animate from here
              opacity: 0,
              transform: "translateX(100%)",
            }}
          >
            <div className="p-3 self-end">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                className="h-11 w-11"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-7 w-7" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto p-8 pt-10 pr-12 pl-32 md:pl-40 lg:pl-44">
              <ul ref={menuItemsRef} className="space-y-3">
                <li className="ml-0 md:ml-2">
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-lg nav-item-hover"
                    onClick={() => handleNavClick("home")}
                  >
                    Home
                  </Button>
                </li>
                <li className="ml-6 md:ml-8">
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-lg nav-item-hover"
                    onClick={() => goToTopAndClose("/products")}
                  >
                    Products
                  </Button>
                </li>
                <li className="ml-10 md:ml-14">
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-lg nav-item-hover"
                    onClick={() => goToTopAndClose("/about")}
                  >
                    About
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <style>{`
        .nav-item-hover:hover {
          background-color: rgba(98,170,222,0.1) !important;
          color: #62AADE !important;
        }
      `}</style>
    </header>
  );
}
