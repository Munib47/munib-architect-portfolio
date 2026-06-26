import type { WorkExperience } from '@/types/resume';

export const workExperience: WorkExperience[] = [
  {
    id: 'independent-consultant',
    company: 'Independent Frontend Consultant',
    location: 'Remote — Global Clients',
    roles: [
      {
        title: 'Senior Frontend Engineer',
        startDate: 'Jan 2022',
        endDate: 'Present',
        highlights: [
          'Delivered 26 live production deployments across Shopify e-commerce and GoHighLevel CRM platforms for clients in Pakistan, USA, UAE, and the UK.',
          'Architected 17 Shopify storefronts using Liquid templating, Dawn/Be Yours frameworks, AJAX cart mechanics, multi-currency support, and advanced CRO strategies.',
          'Built 9 GoHighLevel funnel systems with multi-step lead capture, CRM automation workflows, SMS/email triggers, booking calendar integrations, and webhook pipelines.',
          'Optimized Core Web Vitals (LCP, CLS) for high-traffic consumer electronics stores, achieving measurable search ranking improvements for clients like Mi Store Pakistan.',
          'Integrated third-party marketing stacks — Klaviyo, Meta Pixel, RTL Arabic layouts — while maintaining fast storefront loading speeds across all deployments.',
        ],
      },
    ],
  },
  {
    id: 'freelance-developer',
    company: 'Freelance Web Developer',
    location: 'Lahore, Pakistan',
    roles: [
      {
        title: 'Frontend Developer',
        startDate: 'Mar 2020',
        endDate: 'Dec 2021',
        highlights: [
          'Built responsive websites and landing pages using HTML5, CSS3, JavaScript ES6+, and React.js, growing an international client base from scratch.',
          'Delivered pixel-perfect UI implementations from Figma and Adobe XD design files across all major desktop and mobile viewports.',
          'Began specialization in Shopify Liquid theme engineering and custom section schema development, completing first e-commerce deployments.',
          'Conducted UI/UX audits and performance optimizations for existing client storefronts, consistently reducing bounce rates and improving conversion.',
        ],
      },
    ],
  },
];
