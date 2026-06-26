'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { skillGroups } from '@/data/skills';
import { projects } from '@/data/projects';

// ── Design tokens ─────────────────────────────────────────────────
const EMERALD = '#10B981';
const DARK    = '#0F172A';
const GRAY    = '#475569';
const MUTED   = '#94A3B8';
const BORDER  = '#E2E8F0';
const SURFACE = '#F8FAFC';
const GREEN_L = '#ECFDF5';
const GREEN_B = '#A7F3D0';

const s = StyleSheet.create({
  // Page
  page: {
    backgroundColor: '#FFFFFF',
    paddingTop: 38,
    paddingBottom: 52,
    paddingLeft: 48,
    paddingRight: 48,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: DARK,
  },

  // ── Header row ──────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: EMERALD,
    borderBottomStyle: 'solid',
  },
  headerLeft: { flex: 1 },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 24,
    color: DARK,
    marginBottom: 3,
  },
  headline: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: EMERALD,
    marginBottom: 9,
  },
  contactLine: {
    fontSize: 9,
    color: GRAY,
    marginBottom: 2,
  },

  // Stats box (top-right)
  statsBox: {
    width: 130,
    marginLeft: 18,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: GREEN_L,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: GREEN_B,
    borderStyle: 'solid',
  },
  statsHeading: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: EMERALD,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statsDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: EMERALD,
    marginRight: 6,
  },
  statsText: { fontSize: 8.5, color: GRAY },

  // ── Section ─────────────────────────────────────────────────────
  section: { marginBottom: 13 },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: EMERALD,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    paddingBottom: 5,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    borderBottomStyle: 'solid',
  },

  // ── Summary ─────────────────────────────────────────────────────
  summary: {
    fontSize: 9.5,
    color: GRAY,
    lineHeight: 1.7,
  },

  // ── Skills ──────────────────────────────────────────────────────
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  skillCat: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: DARK,
    width: 128,
    flexShrink: 0,
  },
  skillList: {
    flex: 1,
    fontSize: 9,
    color: GRAY,
    lineHeight: 1.55,
  },

  // ── Projects ────────────────────────────────────────────────────
  projectsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  projectCol: { flex: 1 },
  projectCard: {
    marginBottom: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 9,
    paddingRight: 9,
    backgroundColor: SURFACE,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: EMERALD,
    borderLeftStyle: 'solid',
  },
  projectTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: DARK,
    marginBottom: 2,
  },
  projectRole: {
    fontSize: 8.5,
    color: EMERALD,
    marginBottom: 2,
  },
  projectUrl: {
    fontSize: 8,
    color: MUTED,
    marginBottom: 5,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  tag: {
    fontSize: 7.5,
    color: EMERALD,
    backgroundColor: GREEN_L,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 3,
  },

  // More-projects note
  moreNote: {
    marginTop: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: GREEN_L,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: GREEN_B,
    borderStyle: 'solid',
  },
  moreNoteText: {
    fontSize: 8.5,
    color: GRAY,
    textAlign: 'center',
  },

  // ── Footer (fixed = repeats on every page) ───────────────────────
  footer: {
    position: 'absolute',
    bottom: 22,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    borderTopStyle: 'solid',
    paddingTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 8, color: MUTED },
});

// ── Static data ────────────────────────────────────────────────────
const HIGHLIGHTS = [
  '26 Live Projects Delivered',
  'Shopify + GoHighLevel Expert',
  '4+ Years of Experience',
  'React / Next.js / Three.js',
];

const TOP_PROJECTS = projects.slice(0, 6);
const LEFT_PROJECTS  = TOP_PROJECTS.slice(0, 3);
const RIGHT_PROJECTS = TOP_PROJECTS.slice(3, 6);

// ── PDF Document ───────────────────────────────────────────────────
export function ResumePDF() {
  return (
    <Document title="Munib Ahmad — Resume" author="Munib Ahmad">
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.name}>Munib Ahmad</Text>
            <Text style={s.headline}>Senior Frontend Engineer &amp; UI/UX Specialist</Text>
            <Text style={s.contactLine}>munibahmad47@gmail.com</Text>
            <Text style={s.contactLine}>+92 344 4955231</Text>
            <Text style={s.contactLine}>wa.me/923444955231</Text>
          </View>
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

        {/* ── Professional Summary ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Professional Summary</Text>
          <Text style={s.summary}>
            Senior Frontend Engineer with 4+ years of expertise building high-performance digital
            experiences. Specialized in Shopify Liquid theme development, GoHighLevel funnel
            architecture, and modern React ecosystems — including Next.js, Three.js, and GSAP
            animation systems. Delivered 26 live projects spanning e-commerce storefronts, CRM
            automation workflows, and conversion-optimized landing experiences for clients across
            Pakistan, USA, UAE, and the UK.
          </Text>
        </View>

        {/* ── Technical Skills ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Technical Skills</Text>
          {skillGroups.map((group) => (
            <View key={group.category} style={s.skillRow}>
              <Text style={s.skillCat}>{group.category}:</Text>
              <Text style={s.skillList}>
                {group.skills.map((sk) => sk.name).join('  ·  ')}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Selected Projects ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>
            Selected Projects — 6 of 26 Live Deployments
          </Text>
          <View style={s.projectsGrid}>

            {/* Left column */}
            <View style={s.projectCol}>
              {LEFT_PROJECTS.map((p) => (
                <View key={p.id} style={s.projectCard}>
                  <Text style={s.projectTitle}>{p.title}</Text>
                  <Text style={s.projectRole}>{p.role}</Text>
                  <Text style={s.projectUrl}>{p.url}</Text>
                  <View style={s.tagsRow}>
                    {p.tags.slice(0, 3).map((tag) => (
                      <Text key={tag} style={s.tag}>{tag}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            {/* Right column */}
            <View style={s.projectCol}>
              {RIGHT_PROJECTS.map((p) => (
                <View key={p.id} style={s.projectCard}>
                  <Text style={s.projectTitle}>{p.title}</Text>
                  <Text style={s.projectRole}>{p.role}</Text>
                  <Text style={s.projectUrl}>{p.url}</Text>
                  <View style={s.tagsRow}>
                    {p.tags.slice(0, 3).map((tag) => (
                      <Text key={tag} style={s.tag}>{tag}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>

          </View>

          {/* Overflow note */}
          <View style={s.moreNote}>
            <Text style={s.moreNoteText}>
              + 20 additional live projects — full portfolio available online
            </Text>
          </View>
        </View>

        {/* ── Fixed footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Munib Ahmad  ·  Senior Frontend Engineer</Text>
          <Text style={s.footerText}>munibahmad47@gmail.com</Text>
        </View>

      </Page>
    </Document>
  );
}
