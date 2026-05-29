import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  GitBranch,
  ClipboardList,
  ArrowRight,
  Zap,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Section } from "@/components/motion/Section";

/* ─── Product data ───────────────────────────────────────────────── */
const products = [
  {
    id: "vigil",
    icon: ShieldCheck,
    name: "V.I.G.I.L",
    fullName: "Visual Intelligence & Guard Inspection Layer",
    tagline: "See every safety risk in real time, on your existing cameras.",
    description:
      "V.I.G.I.L turns your existing CCTV infrastructure into a 24/7 AI safety officer. It detects PPE violations, zone breaches, unsafe postures, and machine anomalies — and alerts you before an incident happens.",
    detections: [
      "Helmet / PPE compliance — hard hats, vests, gloves, safety footwear",
      "Zone breach detection — unauthorised entry into hazardous areas",
      "Unsafe postures — ergonomic risk identification before injury",
      "Machine anomalies — vibration, heat, guard violation alerts",
      "Proximity risks — workers near moving machinery or cranes",
      "Housekeeping / 5S — fire exit and walkway compliance",
    ],
    setup: "Live in 1 week",
    cost: "Lowest recurring cost in market",
    result: "50% drop in safety incidents — first month",
    caseStudy:
      "Client wanted to track safety violations near a load crane when it arrives. Autonex took 2 weeks of footage — 99% detection accuracy on day one of go-live.",
    industry: "Energy Sector",
    color: "#62AADE",
    images: [
      "/assets/products/vigil/img_1.jpeg",
      "/assets/products/vigil/img_2.jpeg",
      "/assets/products/vigil/img_3.jpeg",
    ],
  },
  {
    id: "wil",
    icon: MapPin,
    name: "WIL",
    fullName: "Warehouse Intelligence & Logistics",
    tagline: "Navigation Maps for your warehouse. Find any item in seconds.",
    description:
      "WIL gives every item in your warehouse a precise, live location — accurate to 5cm. Forklifts navigate turn-by-turn to the item. Workers search on mobile and go straight there. No more roaming, no more guessing.",
    detections: [
      "5cm item location accuracy across any warehouse size",
      "Turn-by-turn forklift HMI navigation to any item",
      "Auto-links item weight via camera — no manual entry",
      "1-week ERP integration: SAP, Oracle, Tally, or standalone",
      "Works across shifts and teams with no retraining",
      "Cycle counts done on mobile — results immediate",
    ],
    setup: "Live in 3 weeks",
    cost: "One-time setup + low AMC",
    result: "Stock retrieval time down 70% in first month",
    caseStudy:
      "100,000+ heavy raw materials across 20,000 sq ft+ multi-aisle warehouse. Stock audits took 2–3 days monthly. After WIL: retrieval in seconds, forklift idle time down 40%.",
    industry: "Packaging Industry",
    color: "#E8A838",
    images: [
      "/assets/products/wil/warehouse.jpeg",
      "/assets/products/wil/forklift-ai-system.jpeg",
      "/assets/products/wil/side-view.jpeg",
      "/assets/products/wil/forklift-ai-system-3.jpeg",
    ],
  },
  {
    id: "digital-twin",
    icon: GitBranch,
    name: "Digital Twin",
    fullName: "Virtual replica of your factory — finds hidden capacity",
    tagline: "Test hundreds of scenarios in minutes. Find what's costing you throughput.",
    description:
      "Digital Twin builds a live virtual replica of your shop floor. It runs hundreds of production scenarios in minutes — identifying bottlenecks, WIP buildup, and missed throughput — and tells you exactly what to change.",
    detections: [
      "Mirror: precise virtual model built from machine data and flow",
      "Simulate: test hundreds of scenarios in minutes, not weeks",
      "Score: measure throughput, WIP, and bottlenecks for each scenario",
      "Recommend: 'Do X → +12% output, –18% WIP' — one click to approve",
      "Patent-published simulation algorithm — IIT Bombay",
      "Live-connected to your shop floor in real time",
    ],
    setup: "POC in 6–8 weeks",
    cost: "Zero capex — no new machines",
    result: "+4% daily throughput — delivered at Mahindra & John Deere",
    caseStudy:
      "Automotive OEM wanted to increase throughput without new capex. Digital Twin identified three bottlenecks invisible to the production team. Result: +4% daily throughput, zero new equipment.",
    industry: "Automotive OEM",
    color: "#9B8AE8",
    images: [
      "/assets/products/digital-twin/img_1.png",
      "/assets/products/digital-twin/img_2.png",
      "/assets/products/digital-twin/img_3.png",
      "/assets/products/digital-twin/img_4.png",
    ],
  },
  {
    id: "ai-erp",
    icon: ClipboardList,
    name: "AI ERP / eBMR",
    fullName: "Auto-capture. Always audit-ready.",
    tagline: "Eliminate manual entry. Pull a full audit package in minutes.",
    description:
      "AI ERP and eBMR auto-captures batch records, production data, and dispatch information directly via cameras and sensors. No paper. No transcription errors. Audit-ready at any moment.",
    detections: [
      "Batch records captured via cameras + sensors — tamper-evident",
      "Dispatch tracking: 99.9% accuracy, batch numbers + invoices auto-captured",
      "Production planning from your order book, machines, and shifts",
      "Compliance reporting: pull any audit period in minutes",
      "Integrations: SAP · Oracle · Tally · Standalone",
      "Mobile app for shop floor operators",
    ],
    setup: "Dispatch live in 1 day",
    cost: "Zero recurring cost beyond AMC",
    result: "99%+ dispatch accuracy — zero tally mismatches after go-live",
    caseStudy:
      "Packaging client had daily dispatch mismatches causing customer disputes. After eBMR: 99%+ accuracy on dispatch, zero mismatches in 4 months running.",
    industry: "Packaging Industry",
    color: "#34C77B",
    images: [
      "/assets/products/erp/img_2.png",
      "/assets/products/erp/img_3.png",
      "/assets/products/erp/img_4.png",
      "/assets/products/erp/img_1.png",
    ],
  },
];

/* ─── Image Gallery sub-component ───────────────────────────────── */
function ProductGallery({
  images,
  color,
  name,
}: {
  images: string[];
  color: string;
  name: string;
}) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10 flex-1"
        style={{ minHeight: 280 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={`${name} screenshot ${active + 1}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover"
            style={{ minHeight: 280 }}
          />
        </AnimatePresence>

        {/* Gradient overlay at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${color}18, transparent)`,
          }}
        />

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-white/10 bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-white/10 bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </>
        )}

        {/* Dot indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to image ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 20 : 6,
                height: 6,
                background: i === active ? color : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${images.length}, 1fr)` }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="relative rounded-xl overflow-hidden border-2 transition-all duration-200"
              style={{
                borderColor: i === active ? color : "rgba(255,255,255,0.07)",
                opacity: i === active ? 1 : 0.55,
              }}
            >
              <img
                src={src}
                alt={`${name} thumbnail ${i + 1}`}
                className="w-full h-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Product Block ──────────────────────────────────────────────── */
function ProductBlock({
  product,
  index,
}: {
  product: (typeof products)[0];
  index: number;
}) {
  const Icon = product.icon;
  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      id={product.id}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden mb-20 last:mb-0"
    >
      {/* Top accent bar */}
      <div
        className="h-[3px] w-full"
        style={{
          background: `linear-gradient(90deg, ${product.color}, transparent 70%)`,
        }}
      />

      <div
        className={`p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${
          isReversed ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* ── Left: Info ── */}
        <div className={isReversed ? "lg:[direction:ltr]" : ""}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 flex-shrink-0"
              style={{ background: `${product.color}15` }}
            >
              <Icon className="w-7 h-7" style={{ color: product.color }} />
            </div>
            <div>
              <h2
                className="text-3xl font-bold"
                style={{ color: product.color }}
              >
                {product.name}
              </h2>
              <p className="text-foreground/45 text-sm">{product.fullName}</p>
            </div>
          </div>

          <p className="text-xl font-semibold text-foreground/80 mb-4 leading-snug">
            {product.tagline}
          </p>
          <p className="text-foreground/55 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Capability pills */}
          <ul className="space-y-3 mb-8">
            {product.detections.map((feature, fi) => (
              <motion.li
                key={fi}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: fi * 0.06 }}
                className="flex items-start gap-3 text-sm text-foreground/65"
              >
                <CheckCircle
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: product.color }}
                />
                {feature}
              </motion.li>
            ))}
          </ul>

          {/* Stat badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span
              className="text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-full border"
              style={{
                color: product.color,
                borderColor: `${product.color}40`,
                background: `${product.color}10`,
              }}
            >
              {product.setup}
            </span>
            <span
              className="text-xs font-medium px-4 py-2 rounded-full border"
              style={{
                color: `${product.color}cc`,
                borderColor: `${product.color}25`,
                background: `${product.color}08`,
              }}
            >
              {product.cost}
            </span>
          </div>

          {/* Real result */}
          <div
            className="rounded-2xl p-5 border mb-6"
            style={{
              borderColor: `${product.color}25`,
              background: `${product.color}08`,
            }}
          >
            <p
              className="text-xs uppercase tracking-widest font-bold mb-1"
              style={{ color: product.color }}
            >
              Real Result
            </p>
            <p className="text-foreground/80 font-semibold text-base">
              {product.result}
            </p>
          </div>

          {/* Case study — highlighted */}
          <div
            className="rounded-2xl p-5 border mb-8 relative overflow-hidden"
            style={{
              borderColor: `${product.color}45`,
              background: `linear-gradient(135deg, ${product.color}12 0%, rgba(6,10,25,0.7) 100%)`,
              boxShadow: `0 4px 24px ${product.color}12, inset 0 1px 0 ${product.color}20`,
            }}
          >
            {/* Top accent bar */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, ${product.color}, transparent 70%)`,
              borderRadius: "12px 12px 0 0",
            }} />

            {/* Label + large quote icon */}
            <div className="flex items-center justify-between mb-3">
              <p
                className="text-[10px] uppercase tracking-widest font-black"
                style={{ color: product.color }}
              >
                ✦ Case Study — {product.industry}
              </p>
              <span
                className="text-4xl font-black leading-none select-none"
                style={{ color: product.color, opacity: 0.18, fontFamily: "Georgia, serif" }}
              >
                &ldquo;
              </span>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
              <span style={{ color: product.color, fontWeight: 700 }}>&ldquo;</span>
              {product.caseStudy}
              <span style={{ color: product.color, fontWeight: 700 }}>&rdquo;</span>
            </p>
          </div>

          {/* CTA */}
          <a
            href="/contact"
            id={`cta-${product.id}`}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #62AADE 0%, #1e40af 100%)",
              boxShadow: "0 0 28px rgba(98,170,222,0.35)",
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Book a Free Pilot <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </a>
        </div>

        {/* ── Right: Image Gallery ── */}
        <div className={isReversed ? "lg:[direction:ltr]" : ""}>
          <ProductGallery
            images={product.images}
            color={product.color}
            name={product.name}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function Products() {
  return (
    <div>
      <Header />
      <main>
        {/* Page Hero */}
        <section className="pt-32 pb-16 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#62AADE]/20 bg-[#62AADE]/5 text-sm font-semibold text-[#62AADE] mb-8">
                <Zap className="w-4 h-4" />
                Four products. One platform.
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Every factory problem.
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #62AADE 0%, #163791 100%)",
                  }}
                >
                  Solved.
                </span>
              </h1>
              <p className="text-xl text-foreground/55 max-w-2xl mx-auto leading-relaxed">
                Start with the product that solves your biggest pain. Each
                module is standalone. Prove ROI before expanding.
              </p>
            </motion.div>

            {/* Jump links */}
            <motion.div
              className="flex flex-wrap justify-center gap-3 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {products.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 hover:scale-105 text-white"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    borderColor: "rgba(98,170,222,0.3)",
                    background: "rgba(98,170,222,0.08)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = p.color;
                    (e.currentTarget as HTMLElement).style.borderColor = p.color + "70";
                    (e.currentTarget as HTMLElement).style.background = p.color + "15";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(98,170,222,0.3)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(98,170,222,0.08)";
                  }}
                >
                  {p.name}
                </a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Products */}
        <Section padding="lg">
          {products.map((product, index) => (
            <ProductBlock key={product.id} product={product} index={index} />
          ))}
        </Section>

        {/* Bottom CTA */}
        <section className="py-24 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Not sure where to start?
            </h2>
            <p className="text-foreground/55 mb-8 text-lg">
              Tell us your biggest pain point. We'll recommend the right product
              and design a free POC around it.
            </p>
            <a
              href="/contact"
              id="products-bottom-cta"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 text-white relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #62AADE 0%, #1e40af 100%)",
                boxShadow: "0 0 40px rgba(98,170,222,0.35)",
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Book a Free Pilot <Zap className="w-4 h-4" />
              </span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
