import type { Project } from '@/data/projects';

interface Props {
  project: Project;
  idPrefix?: string;
}

export default function AbstractMockup({ project, idPrefix = 'gm' }: Props) {
  const gid = `${idPrefix}-${project.id}`;
  const { gradientFrom, gradientVia, gradientTo, accentHex } = project;

  return (
    <svg
      viewBox="0 0 400 230"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradientFrom} />
          <stop offset="50%" stopColor={gradientVia} />
          <stop offset="100%" stopColor={gradientTo} />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="230" fill={`url(#${gid})`} />

      {/* Ambient glow orbs */}
      <ellipse cx="320" cy="90" rx="100" ry="80" fill={accentHex} fillOpacity={0.07} />
      <ellipse cx="60" cy="185" rx="60" ry="40" fill={accentHex} fillOpacity={0.04} />

      {/* ── Nav bar ── */}
      <rect width="400" height="34" fill="#000000" fillOpacity={0.42} />
      {/* Logo pill */}
      <rect x="14" y="11" width="56" height="12" rx="6" fill={accentHex} fillOpacity={0.65} />
      {/* Nav links */}
      <rect x="190" y="13" width="26" height="8" rx="4" fill="#ffffff" fillOpacity={0.18} />
      <rect x="224" y="13" width="26" height="8" rx="4" fill="#ffffff" fillOpacity={0.18} />
      <rect x="258" y="13" width="26" height="8" rx="4" fill="#ffffff" fillOpacity={0.18} />
      {/* Nav CTA */}
      <rect x="304" y="9" width="80" height="16" rx="8" fill={accentHex} fillOpacity={0.65} />

      {/* ── Hero: headline text (left column) ── */}
      <rect x="14" y="50" width="148" height="14" rx="3" fill="#ffffff" fillOpacity={0.82} />
      <rect x="14" y="72" width="172" height="8" rx="3" fill="#ffffff" fillOpacity={0.32} />
      <rect x="14" y="87" width="148" height="8" rx="3" fill="#ffffff" fillOpacity={0.22} />
      <rect x="14" y="102" width="128" height="8" rx="3" fill="#ffffff" fillOpacity={0.16} />
      {/* Hero CTA buttons */}
      <rect x="14" y="120" width="88" height="22" rx="11" fill={accentHex} fillOpacity={0.82} />
      <rect x="110" y="120" width="68" height="22" rx="11" fill="#ffffff" fillOpacity={0.06} />
      <rect x="110" y="120" width="68" height="22" rx="11" stroke="#ffffff" strokeOpacity={0.18} strokeWidth="1" fill="none" />

      {/* ── Hero: image card placeholder (right column) ── */}
      <rect x="220" y="44" width="166" height="112" rx="10" fill="#ffffff" fillOpacity={0.04} />
      <rect x="220" y="44" width="166" height="112" rx="10" stroke={accentHex} strokeOpacity={0.22} strokeWidth="1" fill="none" />
      <rect x="236" y="60" width="118" height="8" rx="3" fill="#ffffff" fillOpacity={0.10} />
      <rect x="236" y="76" width="90" height="8" rx="3" fill="#ffffff" fillOpacity={0.07} />
      <rect x="236" y="92" width="104" height="8" rx="3" fill="#ffffff" fillOpacity={0.07} />
      <rect x="236" y="108" width="62" height="8" rx="3" fill={accentHex} fillOpacity={0.28} />
      <rect x="236" y="124" width="46" height="8" rx="3" fill="#ffffff" fillOpacity={0.05} />

      {/* ── Bottom product card row ── */}
      <rect x="14" y="168" width="110" height="52" rx="7" fill="#ffffff" fillOpacity={0.03} stroke="#ffffff" strokeOpacity={0.07} strokeWidth="1" />
      <rect x="134" y="168" width="110" height="52" rx="7" fill="#ffffff" fillOpacity={0.03} stroke="#ffffff" strokeOpacity={0.07} strokeWidth="1" />
      <rect x="254" y="168" width="132" height="52" rx="7" fill={accentHex} fillOpacity={0.07} stroke={accentHex} strokeOpacity={0.20} strokeWidth="1" />

      {/* Card 1 lines */}
      <rect x="24"  y="182" width="56" height="5" rx="2.5" fill="#ffffff" fillOpacity={0.14} />
      <rect x="24"  y="194" width="76" height="5" rx="2.5" fill="#ffffff" fillOpacity={0.07} />
      <rect x="24"  y="207" width="42" height="5" rx="2.5" fill={accentHex} fillOpacity={0.22} />
      {/* Card 2 lines */}
      <rect x="144" y="182" width="56" height="5" rx="2.5" fill="#ffffff" fillOpacity={0.14} />
      <rect x="144" y="194" width="76" height="5" rx="2.5" fill="#ffffff" fillOpacity={0.07} />
      <rect x="144" y="207" width="42" height="5" rx="2.5" fill={accentHex} fillOpacity={0.22} />
      {/* Card 3 (accent) lines */}
      <rect x="264" y="182" width="56" height="5" rx="2.5" fill="#ffffff" fillOpacity={0.20} />
      <rect x="264" y="194" width="76" height="5" rx="2.5" fill="#ffffff" fillOpacity={0.10} />
      <rect x="264" y="207" width="42" height="5" rx="2.5" fill={accentHex} fillOpacity={0.36} />
    </svg>
  );
}
