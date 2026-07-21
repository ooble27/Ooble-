/* Illustrations plates originales (style ligne), palette Ooble. USDT uniquement. */

const INK = "#14201f";

/** Pièce USDT stylisée. */
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

function Sparkle({ cx, cy, s = 9, fill = "#0F3A43" }: { cx: number; cy: number; s?: number; fill?: string }) {
  return (
    <path
      d={`M${cx} ${cy - s} C ${cx + s * 0.2} ${cy - s * 0.2}, ${cx + s * 0.2} ${cy - s * 0.2}, ${cx + s} ${cy} C ${cx + s * 0.2} ${cy + s * 0.2}, ${cx + s * 0.2} ${cy + s * 0.2}, ${cx} ${cy + s} C ${cx - s * 0.2} ${cy + s * 0.2}, ${cx - s * 0.2} ${cy + s * 0.2}, ${cx - s} ${cy} C ${cx - s * 0.2} ${cy - s * 0.2}, ${cx - s * 0.2} ${cy - s * 0.2}, ${cx} ${cy - s} Z`}
      fill={fill}
    />
  );
}

interface ArtProps {
  className?: string;
}

/** Portefeuille + pièces USDT. */
export const WalletArt = ({ className }: ArtProps) => (
  <svg viewBox="0 0 420 360" className={className} fill="none" role="img" aria-label="Portefeuille et USDT">
    <circle cx="210" cy="185" r="165" fill="hsl(var(--accent-tint))" />
    <Sparkle cx={62} cy={110} s={10} fill="#2FA39B" />
    <Sparkle cx={360} cy={90} s={12} fill="#0F3A43" />
    <Sparkle cx={368} cy={250} s={8} fill="#2FA39B" />

    {/* corps du portefeuille */}
    <rect x="96" y="150" width="248" height="158" rx="22" fill="#0F3A43" stroke={INK} strokeWidth="3.5" />
    {/* poche avant */}
    <path
      d="M96 214 h248 v72 a22 22 0 0 1 -22 22 H118 a22 22 0 0 1 -22 -22 Z"
      fill="#2FA39B"
      stroke={INK}
      strokeWidth="3.5"
    />
    <rect x="116" y="232" width="208" height="58" rx="12" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="3 7" opacity="0.5" />
    {/* fermoir */}
    <rect x="250" y="196" width="70" height="34" rx="17" fill="#F2C14E" stroke={INK} strokeWidth="3.5" />
    <circle cx="304" cy="213" r="7" fill={INK} />

    {/* pièces */}
    <UsdtCoin cx={168} cy={132} r={30} rot={-6} />
    <UsdtCoin cx={92} cy={118} r={19} rot={-18} />
    <UsdtCoin cx={330} cy={150} r={16} rot={12} />
  </svg>
);

/** Téléphone + bouclier de sécurité + carte. */
export const PhoneArt = ({ className }: ArtProps) => (
  <svg viewBox="0 0 420 360" className={className} fill="none" role="img" aria-label="Sécurité et application">
    <circle cx="210" cy="185" r="165" fill="hsl(var(--accent-tint))" />
    <Sparkle cx={70} cy={120} s={11} fill="#0F3A43" />
    <Sparkle cx={356} cy={110} s={9} fill="#2FA39B" />
    <Sparkle cx={78} cy={270} s={8} fill="#2FA39B" />

    {/* carte derrière */}
    <g transform="rotate(-14 150 250)">
      <rect x="70" y="212" width="150" height="92" rx="14" fill="#2FA39B" stroke={INK} strokeWidth="3.5" />
      <rect x="86" y="232" width="40" height="26" rx="5" fill="#F2C14E" stroke={INK} strokeWidth="2.5" />
      <rect x="86" y="276" width="110" height="8" rx="4" fill="#0F3A43" />
    </g>

    {/* téléphone */}
    <rect x="176" y="70" width="150" height="248" rx="28" fill="#fff" stroke={INK} strokeWidth="3.5" />
    <rect x="176" y="70" width="150" height="248" rx="28" fill="none" stroke={INK} strokeWidth="3.5" />
    <rect x="228" y="82" width="46" height="8" rx="4" fill={INK} />
    {/* écran : bouclier + cadenas */}
    <path
      d="M251 132 c 22 10 40 10 40 10 v 34 c 0 30 -22 46 -40 54 c -18 -8 -40 -24 -40 -54 v -34 s 18 0 40 -10 Z"
      fill="#0F3A43"
      stroke={INK}
      strokeWidth="3.5"
    />
    <rect x="238" y="176" width="26" height="22" rx="5" fill="#F2C14E" stroke={INK} strokeWidth="2.5" />
    <path d="M243 176 v -6 a 8 8 0 0 1 16 0 v 6" fill="none" stroke={INK} strokeWidth="2.5" />

    <UsdtCoin cx={330} cy={276} r={22} rot={10} />
  </svg>
);

/** Grande pièce USDT + échange. */
export const CoinsArt = ({ className }: ArtProps) => (
  <svg viewBox="0 0 420 320" className={className} fill="none" role="img" aria-label="USDT en dollars canadiens">
    <circle cx="210" cy="160" r="150" fill="hsl(var(--accent-tint))" />
    <Sparkle cx={70} cy={80} s={11} fill="#2FA39B" />
    <Sparkle cx={352} cy={70} s={10} fill="#0F3A43" />
    <Sparkle cx={360} cy={230} s={9} fill="#2FA39B" />
    <Sparkle cx={62} cy={230} s={8} fill="#0F3A43" />

    {/* flèche circulaire d'échange */}
    <path
      d="M120 160 a 90 90 0 1 1 26 60"
      fill="none"
      stroke="#0F3A43"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeDasharray="2 12"
      opacity="0.55"
    />

    <UsdtCoin cx={210} cy={155} r={72} />
    <UsdtCoin cx={318} cy={96} r={26} rot={12} />
    <UsdtCoin cx={104} cy={214} r={20} rot={-14} />
  </svg>
);
