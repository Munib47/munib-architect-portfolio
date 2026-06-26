'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,            // animate once — avoids re-arming offsets on scroll-up
      mirror: false,
      offset: 80,
      delay: 0,
      // Skip AOS entirely for users who prefer reduced motion. This also means
      // no translate offsets are ever applied, so nothing can get "stuck".
      disable: () =>
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });

    // Recalculate trigger positions after the things that change layout:
    // first paint, full load (images/fonts), resize, and orientation change.
    // Without this, elements laid out below their trigger never receive
    // `aos-animate` and stay stuck in their translated (off-screen) state.
    const refresh = () => AOS.refresh();
    const raf = requestAnimationFrame(refresh);
    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
      AOS.refreshHard();
    };
  }, []);

  return <>{children}</>;
}
