import Header from "@/components/Header";
import HeroScene from "@/components/HeroScene";
import StatsStrip from "@/components/StatsStrip";
import PainPoints from "@/components/PainPoints";
import ServicesScene from "@/components/ServicesScene";
import ProofSection from "@/components/ProofSection";
import VisionScene from "@/components/VisionScene";
import GettingStarted from "@/components/GettingStarted";
import IndustriesScene from "@/components/IndustriesScene";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
      }
    }
  }, []);

  return (
    <div>
      <Header />
      <main>
        <HeroScene />
        <StatsStrip />
        <PainPoints />
        <ServicesScene />
        <ProofSection />
        <VisionScene />
        <GettingStarted />
        <IndustriesScene />
      </main>
      <Footer />
    </div>
  );
}