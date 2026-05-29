// // src/components/IndustrialHero.tsx

// import React, { useState, useEffect, useRef } from 'react';
// import { ArrowRight, Users, Sparkles } from 'lucide-react';

// const keyframesCSS = `
//   @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
//   @keyframes rotateAurora { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
//   @keyframes spin-horizontal { from { transform: rotateX(75deg) rotateZ(0deg); } to { transform: rotateX(75deg) rotateZ(360deg); } }
//   @keyframes spin-vertical { from { transform: rotateY(75deg) rotateZ(0deg); } to { transform: rotateY(75deg) rotateZ(-360deg); } }
//   @keyframes pulse-out { 0% { transform: scale(0.3); opacity: 0.8; } 100% { transform: scale(1.2); opacity: 0; } }
// `;

// export default function IndustrialHero() {
//   const [started, setStarted] = useState(false);
//   const sectionRef = useRef<HTMLElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isMobile, setIsMobile] = useState(false);

//   // --- FIX FOR HORIZONTAL SCROLL ---
//   // This effect programmatically prevents the entire page from scrolling horizontally.
//   useEffect(() => {
//     // When the component mounts, force the body to hide horizontal overflow.
//     document.body.style.overflowX = 'hidden';
//     // When the component unmounts, clean up the style.
//     return () => {
//         document.body.style.overflowX = '';
//     };
//   }, []); // The empty array [] ensures this runs only once when the component mounts.

//   // Effect to check screen size for performance optimization
//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768); // 768px is the 'md' breakpoint
//     };
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   // Logic to trigger animations on scroll
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           setStarted(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.1 }
//     );
//     if (sectionRef.current) observer.observe(sectionRef.current);
//     return () => {
//       if (sectionRef.current) observer.unobserve(sectionRef.current);
//     };
//   }, []);

//   // --- PARTICLE BACKGROUND LOGIC ---
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
//     const context = ctx as CanvasRenderingContext2D;

//     if (isMobile) {
//       ctx.fillStyle = '#09090b';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       return; 
//     }

//     let animationFrameId: number;
//     let particles: any[];
//     const primaryColorHsl = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '28 92% 56%';

//     class Particle {
//       x: number; y: number; size: number; speedX: number; speedY: number;
//       constructor(x: number, y: number, size: number, speedX: number, speedY: number) { this.x = x; this.y = y; this.size = size; this.speedX = speedX; this.speedY = speedY; }
//       update(width: number, height: number) {
//         if (this.x > width || this.x < 0) this.speedX = -this.speedX;
//         if (this.y > height || this.y < 0) this.speedY = -this.speedY;
//         this.x += this.speedX; this.y += this.speedY;
//       }
//       draw() {
//         context.fillStyle = `hsl(${primaryColorHsl} / 1.0)`;
//         context.beginPath(); context.arc(this.x, this.y, this.size, 0, Math.PI * 2); context.fill();
//       }
//     }

//     const init = () => {
//       const dpr = window.devicePixelRatio || 1;
//       const width = window.innerWidth;
//       const height = window.innerHeight;
//       canvas.width = width * dpr;
//       canvas.height = height * dpr;
//       canvas.style.width = `${width}px`;
//       canvas.style.height = `${height}px`;
//       context.scale(dpr, dpr);
//       particles = [];
//       const numberOfParticles = Math.floor((width * height) / 25000);
//       for (let i = 0; i < numberOfParticles; i++) {
//         const size = Math.random() * 1.5 + 0.5;
//         const x = Math.random() * width;
//         const y = Math.random() * height;
//         const speedX = (Math.random() * 0.3) - 0.15;
//         const speedY = (Math.random() * 0.3) - 0.15;
//         particles.push(new Particle(x, y, size, speedX, speedY));
//       }
//     };

//     const animate = () => {
//       if (!particles) return;
//       const width = window.innerWidth;
//       const height = window.innerHeight;
//       context.fillStyle = '#09090b';
//       context.fillRect(0, 0, width, height);
//       particles.forEach(p => { p.update(width, height); p.draw(); });
//       animationFrameId = requestAnimationFrame(animate);
//     };

//     init();
//     animate();
//     window.addEventListener('resize', init);
//     return () => {
//       window.removeEventListener('resize', init);
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, [isMobile]);


//   const getAnimStyle = (delay: number) => ({
//     opacity: started ? 1 : 0,
//     animation: started ? `fadeInUp 0.8s ${delay}s cubic-bezier(0.16, 1, 0.3, 1) forwards` : 'none',
//   });

//   return (
//     <>
//       <style>{keyframesCSS}</style>
//       <section id="home" ref={sectionRef} className="relative min-h-[100svh] overflow-hidden pt-24 pb-2 sm:pb-4">
//         <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />

//         <div className="min-h-[calc(100svh-10rem)] flex items-center justify-center">
//           <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
//             <div className="max-w-6xl mx-auto">
//               {/* Badge, Headline, Subtitle, and Buttons... */}
//               <div style={getAnimStyle(0.2)}>
//                 <div className="relative inline-flex items-center justify-center p-0.5 mb-8 overflow-hidden rounded-full">
//                   <div className="absolute top-1/2 left-1/2 w-[200%] h-[400%]" style={{ background: 'conic-gradient(from 0deg at 50% 50%, hsl(var(--primary)/0.5), hsl(var(--primary)/0), hsl(var(--primary)/0.5))', animation: 'rotateAurora 4s linear infinite' }} />
//                   <div className="relative flex items-center px-6 py-3 rounded-full bg-zinc-900/90 backdrop-blur-sm">
//                     <Sparkles className="w-4 h-4 mr-2 text-primary" />
//                     <span className="text-sm font-semibold tracking-wider uppercase text-white">Next-Gen Industrial Intelligence</span>
//                   </div>
//                 </div>
//               </div>
//               <div style={getAnimStyle(0.4)}>
//                 <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6">
//                   <span className="block">AI AGENTS & DATA INFRA</span>
//                   <span className="block text-primary">FOR SMARTER INDUSTRIAL SYSTEMS</span>
//                 </h1>
//               </div>
//               <div style={getAnimStyle(0.7)}>
//                 <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed text-zinc-300 mb-10">
//                   We combine machine-level optimization with domain-specific intelligence to automate decisions, enhance transparency, and create datasets that fuel the next generation of robotics.
//                 </p>
//               </div>
//               <div style={getAnimStyle(0.9)} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                 <button className="group relative text-base px-8 py-4 rounded-full font-bold transition-transform duration-300 hover:scale-105 flex items-center overflow-hidden bg-primary text-white w-full sm:w-auto shadow-[0_0_40px_hsl(var(--primary)/0.4)]">
//                   <span className="relative z-10 flex items-center justify-center gap-2">Discover Our Platform <ArrowRight className="h-5 w-5 group-hover:translate-x-1" /></span>
//                 </button>
//                 <button className="group text-base px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 flex items-center backdrop-blur-sm bg-white/5 border-2 border-white/10 text-zinc-100 w-full sm:w-auto">
//                   <Users className="mr-2 h-5 w-5 group-hover:scale-110" /> Join as a Partner
//                 </button>
//               </div>

//               {/* Inline AI Logo container shown directly under CTAs, responsive and centered */}
//               <div style={getAnimStyle(1.0)} className="mt-10 sm:mt-12 flex justify-center">
//                 <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 pointer-events-none select-none">
//                   <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '1s' }}>
//                     <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <circle cx="50%" cy="50%" r="35%" className="stroke-primary/10" strokeWidth="1" />
//                       <circle cx="50%" cy="50%" r="25%" className="stroke-primary/10" strokeWidth="1" />
//                     </svg>
//                   </div>
//                   <div className="absolute inset-[35%] rounded-full bg-primary/20 shadow-[0_0_30px_5px_hsl(var(--primary)/0.3)] animate-pulse">
//                     <div className="absolute inset-4 rounded-full bg-primary/30 shadow-[inset_0_0_10px_hsl(var(--primary))] flex items-center justify-center text-primary font-bold text-3xl sm:text-4xl">AI</div>
//                   </div>
//                   <div className="absolute inset-[20%] border border-primary/30 rounded-full" style={{ transform: 'rotateX(75deg)', animation: 'spin-horizontal 10s linear infinite' }} />
//                   <div className="absolute inset-[20%] border border-primary/30 rounded-full" style={{ transform: 'rotateY(75deg)', animation: 'spin-vertical 12s linear infinite' }} />
//                   <div className="absolute inset-0 border border-primary/20 rounded-full" style={{ animation: 'pulse-out 3s ease-out infinite' }} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </section>
//     </>
//   );
// }


// src/components/IndustrialHero.tsx

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Users, Sparkles } from 'lucide-react';

const keyframesCSS = `
  @keyframes rotateAurora { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
`;


export default function IndustrialHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // --- FIX FOR HORIZONTAL SCROLL ---
  // This effect programmatically prevents the entire page from scrolling horizontally.
  useEffect(() => {
    // When the component mounts, force the body to hide horizontal overflow.
    document.body.style.overflowX = 'hidden';
    // When the component unmounts, clean up the style.
    return () => {
      document.body.style.overflowX = '';
    };
  }, []); // The empty array [] ensures this runs only once when the component mounts.

  // Effect to check screen size for performance optimization
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the 'md' breakpoint
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  // --- PARTICLE BACKGROUND LOGIC ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const context = ctx as CanvasRenderingContext2D;

    if (isMobile) {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animationFrameId: number;
    let particles: any[];
    // Use secondary color (Blue) for particles so they are visible on black background
    const primaryColorHsl = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '224 73% 33%';

    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number;
      constructor(x: number, y: number, size: number, speedX: number, speedY: number) { this.x = x; this.y = y; this.size = size; this.speedX = speedX; this.speedY = speedY; }
      update(width: number, height: number) {
        if (this.x > width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > height || this.y < 0) this.speedY = -this.speedY;
        this.x += this.speedX; this.y += this.speedY;
      }
      draw() {
        context.fillStyle = `hsl(${primaryColorHsl} / 1.0)`;
        context.beginPath(); context.arc(this.x, this.y, this.size, 0, Math.PI * 2); context.fill();
      }
    }

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.scale(dpr, dpr);
      particles = [];
      const numberOfParticles = Math.floor((width * height) / 25000);
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 1.5 + 0.5;
        const x = Math.random() * width;
        const y = Math.random() * height;
        const speedX = (Math.random() * 0.3) - 0.15;
        const speedY = (Math.random() * 0.3) - 0.15;
        particles.push(new Particle(x, y, size, speedX, speedY));
      }
    };

    const animate = () => {
      if (!particles) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.fillStyle = '#09090b';
      context.fillRect(0, 0, width, height);
      particles.forEach(p => { p.update(width, height); p.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);


  return (
    <>
      <style>{keyframesCSS}</style>
      <section id="home" className="relative min-h-[100svh] overflow-hidden pt-24 pb-2 sm:pb-4">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />

        <div className="min-h-[calc(100svh-10rem)] flex items-center justify-center">
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <div className="max-w-6xl mx-auto">
              {/* Badge, Headline, Subtitle, and Buttons... */}
              <div>
                <div className="relative inline-flex items-center justify-center p-0.5 mb-8 overflow-hidden rounded-full">
                  <div className="absolute top-1/2 left-1/2 w-[200%] h-[400%]" style={{ background: 'conic-gradient(from 0deg at 50% 50%, hsl(var(--primary)/0.5), hsl(var(--primary)/0), hsl(var(--primary)/0.5))', animation: 'rotateAurora 4s linear infinite' }} />
                  <div className="relative flex items-center px-6 py-3 rounded-full bg-zinc-900/90 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 mr-2 text-tertiary" />
                    <span className="text-sm font-semibold tracking-wider uppercase text-foreground">Next-Gen Industrial Intelligence</span>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6">
                  <span className="block">AI PRODUCTS</span>
                  <span className="block text-secondary">FOR SMARTER INDUSTRIAL SYSTEMS</span>
                </h1>
              </div>
              <div>
                <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed text-zinc-300 mb-10">
                  We build AI powered deeptech products for automation and observability, with multiple patented products live to improve operations in the factories
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="group relative text-base px-8 py-4 rounded-full font-bold transition-transform duration-300 hover:scale-105 flex items-center overflow-hidden bg-secondary text-secondary-foreground w-full sm:w-auto shadow-[0_0_40px_hsl(var(--secondary)/0.4)]">
                  <span className="relative z-10 flex items-center justify-center gap-2">Discover Our Platform <ArrowRight className="h-5 w-5 group-hover:translate-x-1" /></span>
                </button>
                <button className="group text-base px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 flex items-center backdrop-blur-sm bg-white/5 border-2 border-white/10 text-zinc-100 w-full sm:w-auto">
                  <Users className="mr-2 h-5 w-5 group-hover:scale-110" /> Join as a Partner
                </button>
              </div>

              {/* Inline AI Logo container shown directly under CTAs, responsive and centered */}
              <div className="mt-16 sm:mt-20 mb-8 sm:mb-10 flex justify-center">
                <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 pointer-events-none select-none">
                  <div className="absolute inset-0">
                    <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50%" cy="50%" r="35%" className="stroke-secondary/10" strokeWidth="1" />
                      <circle cx="50%" cy="50%" r="25%" className="stroke-secondary/10" strokeWidth="1" />
                    </svg>
                  </div>
                  <div className="absolute inset-[35%] rounded-full bg-secondary/20 shadow-[0_0_30px_5px_hsl(var(--secondary)/0.3)]">
                    <div className="absolute inset-4 rounded-full bg-secondary/30 shadow-[inset_0_0_10px_hsl(var(--secondary))] flex items-center justify-center text-secondary-foreground font-bold text-3xl sm:text-4xl">AI</div>
                  </div>
                  <div className="absolute inset-[20%] border border-secondary/30 rounded-full" style={{ transform: 'rotateX(75deg)' }} />
                  <div className="absolute inset-[20%] border border-secondary/30 rounded-full" style={{ transform: 'rotateY(75deg)' }} />
                  <div className="absolute inset-0 border border-secondary/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}