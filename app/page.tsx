import ThreeBackgroundWrapper from '@/components/ThreeBackgroundWrapper';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Portfolio from '@/components/Portfolio/index';
import SwiperShowcase from '@/components/SwiperShowcase';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      {/* Fixed Three.js particle background — z-index 0 */}
      <ThreeBackgroundWrapper />

      {/* Sticky navigation — z-index 100 */}
      <Navigation />

      {/* All page sections — z-index 1, sits above the canvas */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <Skills />
        <Portfolio />
        <SwiperShowcase />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
