/**
 * Lenis Smooth Scroll — GSAP Ticker Integration
 *
 * The key: Lenis must be driven by GSAP's RAF loop (not its own),
 * so GSAP ScrollTrigger and Lenis are always in perfect sync.
 * Without this, pins/scrubs jitter and feel cheap.
 */
import Lenis from "@studio-freight/lenis";
import { gsap, ScrollTrigger } from "./gsap";

let lenis: Lenis | null = null;

export function initLenis() {
  if (typeof window === "undefined" || lenis) return lenis;

  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const isMobile =
    window.matchMedia?.("(pointer: coarse)").matches ?? false;

  lenis = new Lenis({
    // ── Feel tuning ───────────────────────────────────────────────────────
    // Shorter on mobile so the scroll settles faster on lower-end devices
    duration: prefersReducedMotion ? 0 : isMobile ? 0.9 : 1.5,

    // Custom expo-out easing — starts fast, rests perfectly still
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

    // Smooth wheel input across browsers
    smoothWheel: true as any,

    // Keep native touch on mobile — Lenis lerp conflicts with iOS native scroll
    // causing random UI flicker. Native scroll + ScrollTrigger.update() is enough.
    smoothTouch: false as any,

    // Normalize mouse-wheel delta for consistent cross-browser speed
    normalizeWheel: true as any,
  } as any);

  // ── GSAP Integration ──────────────────────────────────────────────────
  // 1. Tell ScrollTrigger to update on every Lenis scroll event
  lenis.on("scroll", ScrollTrigger.update);

  // 2. Drive Lenis from GSAP's ticker so all GSAP animations stay
  //    perfectly frame-synced with smooth scroll position.
  //    (GSAP time = seconds; Lenis.raf() expects milliseconds.)
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });

  // 3. Disable GSAP's lag smoothing — Lenis handles frame drops gracefully
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function destroyLenis() {
  if (lenis) {
    lenis.off?.("scroll", ScrollTrigger.update);
    lenis.destroy();
    lenis = null;
  }
}

/** Pause Lenis (use when a modal/menu overlay is open) */
export function stopLenis() {
  lenis?.stop();
}

/** Resume Lenis (use when modal/menu overlay closes) */
export function startLenis() {
  lenis?.start();
}

/** Smooth-scroll to a target element, route hash, or pixel offset */
export function scrollTo(
  target: string | number | HTMLElement,
  options: { offset?: number; duration?: number; immediate?: boolean } = {}
) {
  if (lenis) {
    lenis.scrollTo(target as any, options as any);
  }
}