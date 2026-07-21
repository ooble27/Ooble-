/* Illustrations plates originales (style ligne), palette Ooble. USDT uniquement. */
import { cn } from "@/lib/utils";

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
    <path d="M232 190 h66" stroke="#0F3A43" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="2 11" />
    <path d="M292 181 l12 9 l-12 9" fill="none" stroke="#0F3A43" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Carte Interac (dessinée) */}
    <g transform="rotate(8 330 176)">
      <rect x="266" y="132" width="128" height="88" rx="14" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <text x="282" y="170" fontFamily="Manrope, Arial, sans-serif" fontWeight="800" fontSize="23" letterSpacing="-0.5" fill={INK}>
        Interac
      </text>
      <circle cx="371" cy="162" r="5" fill="#FDB515" />
      <rect x="282" y="186" width="34" height="16" rx="4" fill="#F2C14E" stroke={INK} strokeWidth="2" />
    </g>

    <UsdtCoin cx={322} cy={264} r={26} rot={10} />
  </svg>
);

/* ===== Illustrations d'étapes (Comment ça marche) ===== */

/** Étape 1 — Compte vérifié (carte d'identité + coche). */
export const StepAccount = ({ className }: ArtProps) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" role="img" aria-label="Créez votre compte">
    <circle cx="60" cy="60" r="54" fill={HALO} />
    <rect x="30" y="42" width="60" height="44" rx="9" fill="#fff" stroke={INK} strokeWidth="3" />
    <circle cx="47" cy="60" r="9" fill="#2FA39B" stroke={INK} strokeWidth="2.5" />
    <rect x="62" y="54" width="20" height="5" rx="2.5" fill={INK} opacity="0.75" />
    <rect x="62" y="65" width="14" height="5" rx="2.5" fill={INK} opacity="0.35" />
    <circle cx="86" cy="42" r="12" fill="#26A17B" stroke={INK} strokeWidth="2.5" />
    <path d="M81 42 l4 4 l6 -7" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Étape 2 — Créez votre ordre (reçu + pièce USDT). */
export const StepOrder = ({ className }: ArtProps) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" role="img" aria-label="Créez votre ordre">
    <circle cx="60" cy="60" r="54" fill={HALO} />
    <rect x="34" y="32" width="46" height="56" rx="8" fill="#fff" stroke={INK} strokeWidth="3" />
    <rect x="44" y="46" width="26" height="5" rx="2.5" fill={INK} opacity="0.75" />
    <rect x="44" y="57" width="20" height="5" rx="2.5" fill={INK} opacity="0.35" />
    <rect x="44" y="68" width="24" height="5" rx="2.5" fill="#2FA39B" />
    <UsdtCoin cx={82} cy={80} r={16} rot={8} />
  </svg>
);

/* ===== Pièces de réseaux (vrai logo, présenté en pièce) ===== */

type NetId = "trx" | "eth" | "bnb" | "matic" | "sol" | "avax";

/** Couleur de tranche (pour l'effet pièce sous le logo). */
const NET_EDGE: Record<NetId, string> = {
  trx: "#a60019",
  eth: "#3a4a86",
  bnb: "#cf9a16",
  matic: "#5a2fa8",
  sol: "#4c1d95",
  avax: "#bb2a2b",
};

/** Pièce de réseau : vrai logo de la blockchain, avec tranche et contour. */
export const NetworkCoin = ({ id, className }: { id: NetId; className?: string }) => (
  <div className={cn("relative", className)}>
    <div
      className="absolute inset-0 translate-y-[7%] rounded-full border-[3px] border-[#14201f]"
      style={{ background: NET_EDGE[id] }}
      aria-hidden
    />
    <img
      src={`/coins/${id}.svg`}
      alt=""
      draggable={false}
      className="relative block w-full rounded-full border-[3px] border-[#14201f]"
    />
  </div>
);

/** Étape 3 — Réglé directement (portefeuille + pièce). */
export const StepSettle = ({ className }: ArtProps) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" role="img" aria-label="Réglé directement">
    <circle cx="60" cy="60" r="54" fill={HALO} />
    <rect x="30" y="54" width="60" height="38" rx="9" fill="#0F3A43" stroke={INK} strokeWidth="3" />
    <path d="M30 68 h60 v15 a9 9 0 0 1 -9 9 H39 a9 9 0 0 1 -9 -9 Z" fill="#2FA39B" stroke={INK} strokeWidth="3" />
    <circle cx="76" cy="75" r="4" fill={INK} />
    <UsdtCoin cx={54} cy={40} r={15} rot={-8} />
  </svg>
);
