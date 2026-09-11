// ── Single reusable icon renderer ────────────────────────────────────
// One component for every skill/category icon in the Skills section —
// each icon is just a data entry (viewBox + a handful of primitive
// shapes) fed into this same renderer, rather than a bespoke component
// per icon. Keeps the bundle small (no repeated SVG boilerplate/markup
// per icon) and means adding or restyling an icon is a data change here,
// never a new component.
//
// `mode: 'fill'` is used for brand logos (their path data is an exact
// filled silhouette, e.g. the official Next.js/React/Shopify marks).
// `mode: 'stroke'` is used for generic concept icons (calendar, funnel,
// cart, etc.) built from simple line/circle/path primitives — easier to
// draw accurately as outlines than as solid silhouettes.

export type IconShape =
  | { type: 'path'; d: string }
  | { type: 'rect'; x: number; y: number; width: number; height: number; rx?: number }
  | { type: 'circle'; cx: number; cy: number; r: number }
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number };

export type IconDef = {
  viewBox: string;
  mode: 'fill' | 'stroke';
  shapes: IconShape[];
};

export function TechIcon({
  def,
  className,
}: {
  def: IconDef;
  className?: string;
}) {
  const shapeProps =
    def.mode === 'fill'
      ? { fill: 'currentColor', fillRule: 'evenodd' as const }
      : {
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.75,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
        };

  return (
    <svg className={className} viewBox={def.viewBox} aria-hidden="true">
      {def.shapes.map((shape, i) => {
        switch (shape.type) {
          case 'path':
            return <path key={i} d={shape.d} {...shapeProps} />;
          case 'rect':
            return (
              <rect
                key={i}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                rx={shape.rx}
                {...shapeProps}
              />
            );
          case 'circle':
            return <circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} {...shapeProps} />;
          case 'line':
            return <line key={i} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} {...shapeProps} />;
          default:
            return null;
        }
      })}
    </svg>
  );
}
