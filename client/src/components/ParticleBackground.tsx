// src/components/ParticleBackground.tsx
// Global fixed-position canvas — covers the full page on all routes.
// Cursor-reactive: particles gently flee the mouse across every section.

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; ox: number; oy: number;
  vx: number; vy: number;
  size: number; baseAlpha: number;
}

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    let raf: number;
    let running = true;
    let lastFrameTime = 0;
    const mouse = { x: -9999, y: -9999 };
    // Cache vw/vh — reading window.innerWidth/Height inside rAF triggers reflow
    let cachedVW = window.innerWidth;
    let cachedVH = window.innerHeight;

    let particles: Particle[] = [];

    // ─── Setup ────────────────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      cachedVW = window.innerWidth;
      cachedVH = window.innerHeight;
      canvas.width = cachedVW * dpr;
      canvas.height = cachedVH * dpr;
      canvas.style.width = `${cachedVW}px`;
      canvas.style.height = `${cachedVH}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      buildParticles(cachedVW, cachedVH);
    };

    const buildParticles = (vw: number, vh: number) => {
      particles = [];
      const divisor = isMobile ? 18000 : 9000;
      // 70 particles on mobile (was 120) — fewer draw calls per frame
      const count = Math.min(isMobile ? 70 : 350, Math.floor((vw * vh) / divisor));
      for (let i = 0; i < count; i++) {
        const x = Math.random() * vw;
        const y = Math.random() * vh;
        particles.push({
          x, y, ox: x, oy: y,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          size: Math.random() * 1.8 + 0.8,
          baseAlpha: Math.random() * 0.45 + 0.15,
        });
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // ─── Animation loop ───────────────────────────────────────────────────
    const animate = (ts = 0) => {
      if (!running) return;

      // Throttle mobile to ~25 fps (40 ms) instead of 30 fps — easier on low-end GPUs
      if (isMobile && ts - lastFrameTime < 40) {
        raf = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = ts;

      // Use cached dimensions — avoids reflow on every animation frame
      const vw = cachedVW;
      const vh = cachedVH;

      // Clear with brand dark background — slightly deeper navy
      ctx.fillStyle = "rgba(3, 7, 18, 1)";
      ctx.fillRect(0, 0, vw, vh);

      const FLEE_RADIUS = isMobile ? 80 : 140;

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Cursor repulsion
        if (dist < FLEE_RADIUS && dist > 0) {
          const force = ((FLEE_RADIUS - dist) / FLEE_RADIUS) * 2.5;
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
        }

        // Spring back to origin
        p.vx += (p.ox - p.x) * 0.025;
        p.vy += (p.oy - p.y) * 0.025;

        // Damping
        p.vx *= 0.9;
        p.vy *= 0.9;

        p.x += p.vx;
        p.y += p.vy;

        // Color: white-blue → bright electric blue near cursor
        const proximity = dist < FLEE_RADIUS ? 1 - dist / FLEE_RADIUS : 0;
        const r = Math.round(lerp(98, 180, proximity));
        const g = Math.round(lerp(170, 220, proximity));
        const b = Math.round(lerp(222, 255, proximity));
        const alpha = lerp(p.baseAlpha, 1.0, proximity);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + proximity * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      // Connecting lines (desktop only, sampled for performance)
      if (!isMobile) {
        for (let a = 0; a < particles.length; a += 2) {
          for (let b = a + 2; b < particles.length; b += 2) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 90) {
              const opacity = (1 - d / 90) * 0.25;
              ctx.strokeStyle = `rgba(98,170,222,${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.stroke();
            }
          }
        }
      }

      raf = requestAnimationFrame(animate);
    };

    // ─── Mouse tracking ───────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        lastFrameTime = 0;
        raf = requestAnimationFrame(animate);
      }
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
};