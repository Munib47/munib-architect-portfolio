// `icon` fields are keys into TECH_ICONS (lib/tech-icons.ts), rendered via
// the shared <TechIcon> component — not emoji, not per-icon components.
//
// `parts` is only set for skills that bundle two distinct technologies
// under one bar (currently just "HTML5 / CSS3") — each part gets its own
// icon before its own label instead of a single icon for the whole line.
export interface Skill {
  name: string;
  level: number;
  icon: string;
  parts?: { icon: string; label: string }[];
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
    icon: 'zap',
    color: '#06B6D4',
    skills: [
      { name: 'Next.js',           level: 95, icon: 'nextjs'     },
      { name: 'React.js',          level: 93, icon: 'react'      },
      { name: 'JavaScript (ES6+)', level: 92, icon: 'javascript' },
      { name: 'TypeScript',        level: 85, icon: 'typescript' },
      {
        name: 'HTML5 / CSS3', level: 98, icon: 'html5',
        parts: [{ icon: 'html5', label: 'HTML5' }, { icon: 'css3', label: 'CSS3' }],
      },
      { name: 'Tailwind CSS',      level: 96, icon: 'tailwindcss'},
      { name: 'Bootstrap',         level: 90, icon: 'bootstrap'  },
      { name: 'Material UI',       level: 88, icon: 'mui'        },
      { name: 'Shopify Polaris',   level: 85, icon: 'polaris'    },
      { name: 'Sass',              level: 88, icon: 'sass'       },
      { name: 'Less',              level: 82, icon: 'less'       },
      { name: 'WordPress',         level: 85, icon: 'wordpress'  },
    ],
  },
  {
    category: 'Animation & 3D',
    icon: 'playTriangle',
    color: '#10B981',
    skills: [
      { name: 'GSAP',           level: 88, icon: 'gsap'        },
      { name: 'Three.js',       level: 82, icon: 'threejs'     },
      { name: 'AOS',            level: 95, icon: 'scrollReveal'},
      { name: 'Swiper.js',      level: 92, icon: 'swiper'      },
      { name: 'CSS Animations', level: 94, icon: 'sparkle'     },
      { name: 'Framer Motion',  level: 80, icon: 'framer'      },
      { name: 'Anime.js',       level: 80, icon: 'animejs'     },
    ],
  },
  {
    category: 'Shopify & E-Commerce',
    icon: 'cart',
    color: '#96BF48',
    skills: [
      { name: 'Shopify Liquid',      level: 97, icon: 'shopify'    },
      { name: 'Theme Customization', level: 96, icon: 'sliders'    },
      { name: 'Dawn Framework',      level: 94, icon: 'sunrise'    },
      { name: 'Be Yours Framework',  level: 92, icon: 'shoppingBag'},
      { name: 'AJAX Cart Mechanics', level: 95, icon: 'cart'       },
      { name: 'Shopify Sections',    level: 97, icon: 'package'    },
      { name: 'CRO Optimization',    level: 90, icon: 'trendingUp' },
    ],
  },
  {
    category: 'GoHighLevel & CRM',
    icon: 'rocket',
    color: '#F97316',
    skills: [
      { name: 'GHL Platform',        level: 95, icon: 'zap'         },
      { name: 'Funnel Building',     level: 97, icon: 'funnel'      },
      { name: 'CRM Automation',      level: 94, icon: 'refreshCycle'},
      { name: 'Workflow Builder',    level: 93, icon: 'link'        },
      { name: 'SMS/Email Triggers',  level: 92, icon: 'envelope'    },
      { name: 'Webhook Integrations',level: 88, icon: 'plug'        },
      { name: 'Booking Calendars',   level: 90, icon: 'calendar'    },
      { name: 'ClickFunnels',        level: 88, icon: 'clickfunnels'},
      { name: 'Unbounce',            level: 85, icon: 'unbounce'    },
    ],
  },
];

export const techBadges = [
  'Next.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS',
  'GSAP', 'Three.js', 'Swiper.js', 'AOS', 'HTML5', 'CSS3',
  'Shopify Liquid', 'Dawn Theme', 'GoHighLevel', 'Klaviyo',
  'Bootstrap', 'Material UI', 'Node.js', 'Git', 'Figma',
];
