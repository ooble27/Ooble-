import { useId } from "react";

interface RateChartProps {
  data: number[];
  className?: string;
  stroke?: string;
  fillFrom?: string;
  height?: number;
}

/** Construit un tracé lissé (Catmull-Rom → Bézier) à partir de points. */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/** Mini-graphe d'aire lissé pour le taux (SVG pur, responsive). */
const RateChart = ({
  data,
  className,
  stroke = "#5FD4C2",
  fillFrom = "rgba(95,212,194,0.35)",
  height = 96,
}: RateChartProps) => {
  const id = useId();
  const W = 320;
  const H = height;
  const padY = 12;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const pts: [number, number][] = data.map((v, i) => [
    (i * W) / (data.length - 1),
    padY + (H - padY * 2) * (1 - (v - min) / span),
  ]);

  const line = smoothPath(pts);
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;
  const last = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} role="img" aria-label="Tendance du taux">
      <defs>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fillFrom} />
          <stop offset="1" stopColor="rgba(95,212,194,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#fill-${id})`} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill={stroke} />
      <circle cx={last[0]} cy={last[1]} r="7" fill={stroke} opacity="0.25" />
    </svg>
  );
};

export default RateChart;
