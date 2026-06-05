export interface Skill {
  name: string;
  level: number;
  icon: string;
}

export interface SkillGroup {
  category: string;
  icon: string;
  color: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend Development',
    icon: '⚡',
    color: '#06B6D4',
    skills: [
      { name: 'Next.js',           level: 95, icon: '▲'  },
      { name: 'React.js',          level: 93, icon: '⚛️' },
      { name: 'JavaScript (ES6+)', level: 92, icon: 'JS' },
      { name: 'TypeScript',        level: 85, icon: 'TS' },
      { name: 'HTML5 / CSS3',      level: 98, icon: '🌐' },
      { name: 'Tailwind CSS',      level: 96, icon: '🎨' },
      { name: 'Bootstrap',         level: 90, icon: '🅱️' },
      { name: 'Material UI',       level: 88, icon: '💎' },
    ],
  },
  {
    category: 'Animation & 3D',
    icon: '🎬',
    color: '#10B981',
    skills: [
      { name: 'GSAP',           level: 88, icon: '🟢' },
      { name: 'Three.js',       level: 82, icon: '🔷' },
      { name: 'AOS',            level: 95, icon: '📜' },
      { name: 'Swiper.js',      level: 92, icon: '🔄' },
      { name: 'CSS Animations', level: 94, icon: '✨' },
      { name: 'Framer Motion',  level: 80, icon: '🎭' },
    ],
  },
  {
    category: 'Shopify & E-Commerce',
    icon: '🛒',
    color: '#96BF48',
    skills: [
      { name: 'Shopify Liquid',      level: 97, icon: '💧' },
      { name: 'Theme Customization', level: 96, icon: '🎨' },
      { name: 'Dawn Framework',      level: 94, icon: '🌅' },
      { name: 'Be Yours Framework',  level: 92, icon: '🛍️' },
      { name: 'AJAX Cart Mechanics', level: 95, icon: '🔄' },
      { name: 'Shopify Sections',    level: 97, icon: '📦' },
      { name: 'CRO Optimization',    level: 90, icon: '📈' },
    ],
  },
  {
    category: 'GoHighLevel & CRM',
    icon: '🚀',
    color: '#F97316',
    skills: [
      { name: 'GHL Platform',        level: 95, icon: '⚡' },
      { name: 'Funnel Building',     level: 97, icon: '🎯' },
      { name: 'CRM Automation',      level: 94, icon: '🤖' },
      { name: 'Workflow Builder',    level: 93, icon: '🔗' },
      { name: 'SMS/Email Triggers',  level: 92, icon: '📧' },
      { name: 'Webhook Integrations',level: 88, icon: '🔌' },
      { name: 'Booking Calendars',   level: 90, icon: '📅' },
    ],
  },
];

export const techBadges = [
  'Next.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS',
  'GSAP', 'Three.js', 'Swiper.js', 'AOS', 'HTML5', 'CSS3',
  'Shopify Liquid', 'Dawn Theme', 'GoHighLevel', 'Klaviyo',
  'Bootstrap', 'Material UI', 'Node.js', 'Git', 'Figma',
];
