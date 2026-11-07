import About from "@/components/About";
import Analysis from "@/components/Analysis";
import Calculator from "@/components/Calculator";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LocalPricing from "@/components/LocalPricing";
import Nav from "@/components/Nav";
import Problems from "@/components/Problems";
import Risks from "@/components/Risks";
import Roadmap from "@/components/Roadmap";
import Simulator from "@/components/Simulator";
import Tiers from "@/components/Tiers";

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-lg focus:bg-primary focus:p-3 focus:text-onprimary">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Problems />
        <Simulator />
        <Tiers />
        <LocalPricing />
        <Calculator />
        <Roadmap />
        <Risks />
        <Analysis />
        <About />
      </main>
      <Footer />
    </>
  );
}
