import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const INK = "#14201f";

function UsdtCoin({ cx, cy, r, rot = 0 }: { cx: number; cy: number; r: number; rot?: number }) {
  const bar = Math.max(3, r * 0.15);
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      <circle cx={0} cy={r * 0.16} r={r} fill="#17694f" stroke={INK} strokeWidth={3} />
      <circle cx={0} cy={0} r={r} fill="#26A17B" stroke={INK} strokeWidth={3} />
      <rect x={-r * 0.42} y={-r * 0.44} width={r * 0.84} height={bar} rx={bar / 2} fill="#fff" />
      <rect x={-bar / 2} y={-r * 0.44} width={bar} height={r * 0.82} rx={bar / 2} fill="#fff" />
      <rect x={-r * 0.24} y={-r * 0.02} width={r * 0.48} height={bar} rx={bar / 2} fill="#fff" />
    </g>
  );
}

function Spark({ cx, cy, s = 12 }: { cx: number; cy: number; s?: number }) {
  const d = s * 0.28;
  return (
    <path
      d={`M${cx} ${cy - s} L${cx + d} ${cy - d} L${cx + s} ${cy} L${cx + d} ${cy + d} L${cx} ${cy + s} L${cx - d} ${cy + d} L${cx - s} ${cy} L${cx - d} ${cy - d} Z`}
      fill="#F2C14E"
      stroke={INK}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  );
}

const CoinStrip = ({ className }: Props) => (
  <div className={cn("flex justify-center", className)}>
    <svg
      viewBox="0 0 680 160"
      className="h-[100px] w-full max-w-[520px] sm:h-[130px] sm:max-w-[620px]"
      fill="none"
      role="img"
      aria-label="USDT et Interac"
    >
      {/* --- Left: Phone with Interac notification --- */}
      <g transform="rotate(-4 108 80)">
        <rect x="42" y="30" width="76" height="110" rx="14" fill="#fff" stroke={INK} strokeWidth="2.8" />
        <rect x="66" y="37" width="28" height="5" rx="2.5" fill={INK} opacity="0.3" />
        {/* notification bar */}
        <rect x="52" y="54" width="56" height="20" rx="6" fill="#EEF2F2" stroke={INK} strokeWidth="1.8" />
        <circle cx="62" cy="64" r="5" fill="#F2C14E" stroke={INK} strokeWidth="1.5" />
        <rect x="72" y="60" width="28" height="3.5" rx="1.75" fill={INK} opacity="0.6" />
        <rect x="72" y="67" width="18" height="3" rx="1.5" fill={INK} opacity="0.25" />
        {/* amount */}
        <text x="80" y="100" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="16" fill={INK}>
          500 $
        </text>
        {/* send button */}
        <rect x="56" y="110" width="48" height="16" rx="8" fill="#2FA39B" stroke={INK} strokeWidth="1.8" />
        <text x="80" y="122" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="8" fill="#fff">
          Envoyer
        </text>
      </g>

      {/* --- Flow: dotted path left --- */}
      <path d="M132 82 C 160 82, 180 72, 210 72" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="2 10" opacity="0.3" />
      <path d="M204 66 l10 6 l-10 6" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />

      {/* --- Left small coin --- */}
      <UsdtCoin cx={186} cy={112} r={16} rot={-14} />

      {/* --- Center: large USDT coin --- */}
      <UsdtCoin cx={340} cy={78} r={52} />

      {/* --- Sparkles around center coin --- */}
      <Spark cx={278} cy={34} s={10} />
      <Spark cx={410} cy={42} s={8} />
      <Spark cx={396} cy={138} s={6} />

      {/* --- Right small coin --- */}
      <UsdtCoin cx={494} cy={112} r={16} rot={12} />

      {/* --- Flow: dotted path right --- */}
      <path d="M470 72 C 500 72, 520 82, 548 82" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="2 10" opacity="0.3" />
      <path d="M542 76 l10 6 l-10 6" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />

      {/* --- Right: Wallet --- */}
      <g transform="rotate(4 590 80)">
        <rect x="556" y="44" width="88" height="66" rx="12" fill="#0F3A43" stroke={INK} strokeWidth="2.8" />
        <path d="M556 76 h88 v18 a12 12 0 0 1 -12 12 H568 a12 12 0 0 1 -12 -12 Z" fill="#2FA39B" stroke={INK} strokeWidth="2.8" />
        {/* clasp */}
        <rect x="614" y="66" width="20" height="14" rx="7" fill="#F2C14E" stroke={INK} strokeWidth="2" />
        <circle cx="626" cy="73" r="3" fill={INK} />
        {/* card sticking out */}
        <rect x="566" y="86" width="56" height="8" rx="4" fill="none" stroke={INK} strokeWidth="1.5" strokeDasharray="2 5" opacity="0.4" />
      </g>
    </svg>
  </div>
);

export default CoinStrip;
