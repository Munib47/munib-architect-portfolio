'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { skillGroups } from '@/data/skills';
import { projects } from '@/data/projects';
import { workExperience } from '@/data/experience';

// ── Design tokens ──────────────────────────────────────────────────
const E  = '#10B981';
const DK = '#0F172A';
const SL = '#334155';
const GR = '#475569';
const MU = '#94A3B8';
const BO = '#E2E8F0';
const SU = '#F8FAFC';
const GL = '#ECFDF5';
const GB = '#A7F3D0';
const WH = '#FFFFFF';

const HIGHLIGHTS = [
  '27 Live Projects Delivered',
  'Shopify + GoHighLevel Expert',
  '4+ Years of Experience',
  'React / Next.js / Three.js',
  'PK · USA · UAE · UK Clients',
];

// Two equal columns — interleave by index so both columns stay balanced
const LEFT_PROJECTS  = projects.filter((_, i) => i % 2 === 0);
const RIGHT_PROJECTS = projects.filter((_, i) => i % 2 !== 0);

// ── Stylesheet ─────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Page
  page: {
    backgroundColor: WH,
    paddingTop: 36,
    paddingBottom: 58,
    paddingLeft: 44,
    paddingRight: 44,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: DK,
  },

  // ── Header ────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingBottom: 14,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: E,
    borderBottomStyle: 'solid',
  },
  photoWrap: {
    width: 66,
    height: 66,
    borderRadius: 33,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: E,
    borderStyle: 'solid',
    flexShrink: 0,
  },
  photo: {
    width: 66,
    height: 66,
  },
  headerText: { flex: 1 },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 21,
    color: DK,
    marginBottom: 2,
  },
  headline: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: E,
    marginBottom: 7,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  contactItem: {
    fontSize: 8,
    color: GR,
  },
  statsBox: {
    width: 150,
    flexShrink: 0,
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: GL,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: GB,
    borderStyle: 'solid',
    alignSelf: 'flex-start',
  },
  statsHeading: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: E,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statsDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: E,
    marginRight: 5,
    flexShrink: 0,
  },
  statsText: { fontSize: 7.5, color: GR },

  // ── Two-column body ───────────────────────────────────────────────
  body: {
    flexDirection: 'row',
    gap: 12,
  },
  leftCol:  { width: 166, flexShrink: 0 },
  rightCol: { flex: 1 },

  // ── Section ───────────────────────────────────────────────────────
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: E,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    paddingBottom: 4,
    marginBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: BO,
    borderBottomStyle: 'solid',
  },

  // ── Summary ───────────────────────────────────────────────────────
  summaryText: {
    fontSize: 8.5,
    color: GR,
    lineHeight: 1.65,
  },

  // ── Skills ───────────────────────────────────────────────────────
  skillGroupLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: DK,
    marginBottom: 3,
  },
  skillChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginBottom: 8,
  },
  skillChip: {
    fontSize: 7,
    color: SL,
    backgroundColor: SU,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: BO,
    borderStyle: 'solid',
  },

  // ── Work experience ───────────────────────────────────────────────
  expEntry: {
    marginBottom: 11,
    paddingLeft: 9,
    borderLeftWidth: 2,
    borderLeftColor: '#10B98130',
    borderLeftStyle: 'solid',
  },
  expCompanyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  expCompany: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: DK,
    flex: 1,
  },
  expLocation: {
    fontSize: 7.5,
    color: MU,
    flexShrink: 0,
    marginLeft: 6,
  },
  expRoleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  expRoleTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: E,
  },
  expDateRange: {
    fontSize: 7.5,
    color: MU,
    flexShrink: 0,
    marginLeft: 6,
  },
  expBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  expBulletDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: E,
    marginRight: 5,
    marginTop: 4,
    flexShrink: 0,
  },
  expBulletText: {
    flex: 1,
    fontSize: 8,
    color: GR,
    lineHeight: 1.55,
  },

  // ── Projects section (full width) ─────────────────────────────────
  projectsSection: { marginTop: 16 },
  projectsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  projectCol: { flex: 1 },
  projectCard: {
    marginBottom: 7,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: SU,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: E,
    borderLeftStyle: 'solid',
  },
  projectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  projectTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: DK,
    flex: 1,
    marginRight: 4,
  },
  projectRole: {
    fontSize: 7.5,
    color: E,
    marginBottom: 2,
  },
  projectUrl: {
    fontSize: 7,
    color: MU,
    marginBottom: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  tag: {
    fontSize: 6.5,
    color: E,
    backgroundColor: GL,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 1.5,
    paddingBottom: 1.5,
    borderRadius: 3,
  },

  // ── Fixed footer ──────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 44,
    right: 44,
    borderTopWidth: 1,
    borderTopColor: BO,
    borderTopStyle: 'solid',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: { fontSize: 7.5, color: MU },
  footerAccent: { fontSize: 8, color: E },
});

// ── Category badge (computed inline to avoid style-array types) ────
function catBadgeStyle(category: string) {
  return {
    fontSize: 6.5 as const,
    paddingLeft: 4 as const,
    paddingRight: 4 as const,
    paddingTop: 2 as const,
    paddingBottom: 2 as const,
    borderRadius: 3 as const,
    flexShrink: 0 as const,
    backgroundColor: category === 'shopify' ? '#ECFDF5' : '#FFF7ED',
    color:           category === 'shopify' ? '#96BF48' : '#F97316',
  };
}

// ── Component ─────────────────────────────────────────────────────
type Props = { profileImageUrl: string };

export function DynamicResumeEngine({ profileImageUrl }: Props) {
  return (
    <Document
      title="Munib Ahmad — Resume"
      author="Munib Ahmad"
      subject="Senior Frontend Engineer — Shopify · GoHighLevel · React"
      creator="Portfolio DynamicResumeEngine"
    >
      <Page size="A4" style={s.page}>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <View style={s.header}>
          {/* Circular profile photo */}
          <View style={s.photoWrap}>
            <Image src={profileImageUrl} style={s.photo} />
          </View>

          {/* Name + headline + contact */}
          <View style={s.headerText}>
            <Text style={s.name}>Munib Ahmad</Text>
            <Text style={s.headline}>Senior Frontend Engineer &amp; UI/UX Specialist</Text>
            <View style={s.contactRow}>
              <Text style={s.contactItem}>munibahmad47@gmail.com</Text>
              <Text style={s.contactItem}>+92 344 4955231</Text>
              <Text style={s.contactItem}>wa.me/923444955231</Text>
            </View>
          </View>

          {/* Highlights / stats box */}
          <View style={s.statsBox}>
            <Text style={s.statsHeading}>Highlights</Text>
            {HIGHLIGHTS.map((h) => (
              <View key={h} style={s.statsRow}>
                <View style={s.statsDot} />
                <Text style={s.statsText}>{h}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── TWO-COLUMN BODY ─────────────────────────────────────── */}
        <View style={s.body}>

          {/* LEFT COLUMN — Summary + All Skills */}
          <View style={s.leftCol}>

            <View style={s.section}>
              <Text style={s.sectionTitle}>Summary</Text>
              <Text style={s.summaryText}>
                Senior Frontend Engineer with 4+ years building high-performance digital
                experiences. Expert in Shopify Liquid theme engineering, GoHighLevel funnel
                architecture, and modern React ecosystems — Next.js, Three.js, and GSAP animation
                systems. 27 live deployments across Pakistan, USA, UAE, and the UK.
              </Text>
            </View>

            {/* All skill groups — every skill included */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Technical Skills</Text>
              {skillGroups.map((group) => (
                <View key={group.category}>
                  <Text style={s.skillGroupLabel}>{group.category}</Text>
                  <View style={s.skillChipsWrap}>
                    {group.skills.map((sk) => (
                      <Text key={sk.name} style={s.skillChip}>{sk.name}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>

          </View>

          {/* RIGHT COLUMN — All Work Experience */}
          <View style={s.rightCol}>
            <View style={s.section}>
              <Text style={s.sectionTitle}>Work Experience</Text>

              {workExperience.map((exp) => (
                <View key={exp.id} style={s.expEntry} wrap={false}>
                  {exp.roles.map((role) => (
                    <View key={role.title}>
                      {/* Company name + location */}
                      <View style={s.expCompanyRow}>
                        <Text style={s.expCompany}>{exp.company}</Text>
                        <Text style={s.expLocation}>{exp.location}</Text>
                      </View>
                      {/* Role title + date range */}
                      <View style={s.expRoleRow}>
                        <Text style={s.expRoleTitle}>{role.title}</Text>
                        <Text style={s.expDateRange}>
                          {role.startDate} – {role.endDate}
                        </Text>
                      </View>
                      {/* All bullet highlights */}
                      {role.highlights.map((h, i) => (
                        <View key={i} style={s.expBulletRow}>
                          <View style={s.expBulletDot} />
                          <Text style={s.expBulletText}>{h}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>

        </View>

        {/* ── ALL PROJECTS — every deployment, 2-column grid ──────── */}
        <View style={s.projectsSection}>
          <Text style={s.sectionTitle}>
            Live Deployments — All {projects.length} Projects
          </Text>
          <View style={s.projectsGrid}>

            {/* Left column — even indices (0, 2, 4 …) */}
            <View style={s.projectCol}>
              {LEFT_PROJECTS.map((p) => (
                <View key={p.id} style={s.projectCard} wrap={false}>
                  <View style={s.projectCardHeader}>
                    <Text style={s.projectTitle}>{p.title}</Text>
                    <Text style={catBadgeStyle(p.category)}>
                      {p.category === 'shopify' ? 'Shopify' : 'GHL'}
                    </Text>
                  </View>
                  <Text style={s.projectRole}>{p.role}</Text>
                  <Text style={s.projectUrl}>{p.url}</Text>
                  <View style={s.tagsRow}>
                    {p.tags.map((tag) => (
                      <Text key={tag} style={s.tag}>{tag}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            {/* Right column — odd indices (1, 3, 5 …) */}
            <View style={s.projectCol}>
              {RIGHT_PROJECTS.map((p) => (
                <View key={p.id} style={s.projectCard} wrap={false}>
                  <View style={s.projectCardHeader}>
                    <Text style={s.projectTitle}>{p.title}</Text>
                    <Text style={catBadgeStyle(p.category)}>
                      {p.category === 'shopify' ? 'Shopify' : 'GHL'}
                    </Text>
                  </View>
                  <Text style={s.projectRole}>{p.role}</Text>
                  <Text style={s.projectUrl}>{p.url}</Text>
                  <View style={s.tagsRow}>
                    {p.tags.map((tag) => (
                      <Text key={tag} style={s.tag}>{tag}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>

          </View>
        </View>

        {/* ── FIXED FOOTER — repeats on every page ─────────────────── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Munib Ahmad  ·  Senior Frontend Engineer</Text>
          <Text style={s.footerAccent}>◆</Text>
          <Text style={s.footerText}>munibahmad47@gmail.com</Text>
        </View>

      </Page>
    </Document>
  );
}
