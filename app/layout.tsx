import type { Metadata } from 'next';
import './globals.css';
import AOSProvider from '@/components/AOSProvider';

export const metadata: Metadata = {
  title: 'Munib Ahmad — Frontend Architect & Shopify Developer',
  description:
    'Premium portfolio of Munib Ahmad — Next.js developer, Shopify theme engineer, and GoHighLevel automation specialist with 26+ live projects.',
  keywords: [
    'Munib Ahmad',
    'Next.js developer',
    'Shopify developer',
    'GoHighLevel',
    'Frontend architect',
    'Liquid template',
    'GSAP',
    'Three.js portfolio',
    'Lahore Pakistan',
  ],
  authors: [{ name: 'Munib Ahmad', url: 'https://github.com/Munib47' }],
  openGraph: {
    title: 'Munib Ahmad — Frontend Architect',
    description:
      'Premium portfolio showcasing 26+ live Shopify stores & GoHighLevel funnels by Munib Ahmad.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{ backgroundColor: '#0A0A0C', color: '#F0F4F8' }}
      >
        <AOSProvider>{children}</AOSProvider>
      </body>
    </html>
  );
}
