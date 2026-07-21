/* Illustrations plates originales (style ligne), palette Ooble. USDT uniquement. */

const INK = "#14201f";
const HALO = "#EEF2F2"; // fond neutre très clair (pas de vert)

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

interface ArtProps {
  className?: string;
}

/** Portefeuille + pièces USDT. */
export const WalletArt = ({ className }: ArtProps) => (
  <svg viewBox="0 0 420 360" className={className} fill="none" role="img" aria-label="Portefeuille et USDT">
    <circle cx="210" cy="185" r="165" fill={HALO} />
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

/** Téléphone + bouclier de sécurité + carte (sans étoiles). */
export const PhoneArt = ({ className }: ArtProps) => (
  <svg viewBox="0 0 420 360" className={className} fill="none" role="img" aria-label="Sécurité et application">
    <circle cx="210" cy="185" r="165" fill={HALO} />
    {/* carte derrière */}
    <g transform="rotate(-14 150 250)">
      <rect x="70" y="212" width="150" height="92" rx="14" fill="#2FA39B" stroke={INK} strokeWidth="3.5" />
      <rect x="86" y="232" width="40" height="26" rx="5" fill="#F2C14E" stroke={INK} strokeWidth="2.5" />
      <rect x="86" y="276" width="110" height="8" rx="4" fill="#0F3A43" />
    </g>
    {/* téléphone */}
    <rect x="176" y="70" width="150" height="248" rx="28" fill="#fff" stroke={INK} strokeWidth="3.5" />
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
    <circle cx="210" cy="160" r="150" fill={HALO} />
    <path
      d="M120 160 a 90 90 0 1 1 26 60"
      fill="none"
      stroke="#0F3A43"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeDasharray="2 12"
      opacity="0.5"
    />
    <UsdtCoin cx={210} cy={155} r={72} />
    <UsdtCoin cx={318} cy={96} r={26} rot={12} />
    <UsdtCoin cx={104} cy={214} r={20} rot={-14} />
  </svg>
);

/** e-Transfer Interac : carte Interac + flux vers USDT. */
export const InteracArt = ({ className }: ArtProps) => (
  <svg viewBox="0 0 420 360" className={className} fill="none" role="img" aria-label="Payé par Interac e-Transfer">
    <circle cx="210" cy="185" r="165" fill={HALO} />

    {/* Téléphone avec notification e-Transfer */}
    <g transform="rotate(-6 150 190)">
      <rect x="78" y="96" width="150" height="196" rx="24" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <rect x="96" y="120" width="114" height="30" rx="8" fill="#EEF2F2" stroke={INK} strokeWidth="2" />
      <circle cx="113" cy="135" r="8" fill="#F2C14E" stroke={INK} strokeWidth="2" />
      <rect x="128" y="128" width="66" height="6" rx="3" fill={INK} opacity="0.75" />
      <rect x="128" y="140" width="44" height="5" rx="2.5" fill={INK} opacity="0.35" />
      {/* montant reçu */}
      <text x="153" y="205" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif" fontWeight="700" fontSize="30" fill={INK}>
        500 $
      </text>
      <rect x="104" y="230" width="98" height="30" rx="15" fill="#2FA39B" stroke={INK} strokeWidth="2.5" />
      <text x="153" y="250" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif" fontWeight="700" fontSize="13" fill="#fff">
        Accepter
      </text>
    </g>

    {/* Flèche de transfert */}
    <path d="M232 178 h58" stroke="#0F3A43" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="2 11" />
    <path d="M284 169 l12 9 l-12 9" fill="none" stroke="#0F3A43" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Logo Interac officiel */}
    <g transform="rotate(7 330 150)">
      <image href="/interac.png" x="266" y="96" width="132" height="110" />
    </g>

    <UsdtCoin cx={322} cy={262} r={26} rot={10} />
  </svg>
);
