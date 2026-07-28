import { cn } from "@/lib/utils";

/**
 * Trois écrans de l'app en projection isométrique (Acheter / Vendre /
 * Transactions).
 *
 * Le rendu est en SVG avec `viewBox` : l'illustration se met à l'échelle
 * exactement de la même façon sur mobile, tablette et grand écran (texte,
 * filets et rayons compris) — seule la largeur maximale change.
 *
 * Projection parallèle (pas de perspective) : chaque carte est un
 * parallélogramme obtenu par un cisaillement vertical de 21°, donc les bords
 * gauche/droit restent verticaux et les bords haut/bas montent vers la droite.
 */

/** tan(21°) — cisaillement appliqué à chaque carte. */
const SKEW = "matrix(1 -0.3839 0 1 0 0)";

/** Géométrie commune : taille de carte et décalage d'une carte à l'autre. */
const CARD = { w: 550, h: 575, r: 30 };
const ORIGINS = [
  { x: 165, y: 340 },
  { x: 387, y: 383 },
  { x: 609, y: 426 },
];

const Card = ({ i, children }: { i: number; children: React.ReactNode }) => (
  <g transform={`translate(${ORIGINS[i].x} ${ORIGINS[i].y}) ${SKEW}`}>
    <rect
      width={CARD.w}
      height={CARD.h}
      rx={CARD.r}
      className="fill-card stroke-foreground/[0.09]"
      strokeWidth="1.6"
      filter="url(#ooble-card-shadow)"
    />
    {children}
  </g>
);

/** Titre d'écran, posé au même endroit sur les trois cartes. */
const Title = ({ children }: { children: string }) => (
  <text
    x="50"
    y="80"
    className="fill-foreground font-display"
    fontSize="44"
    fontWeight="500"
    letterSpacing="-1.2"
  >
    {children}
  </text>
);

/** Barre pleine (contenu « fantôme » d'une liste). */
const Bar = ({ x, y, w, h = 24 }: { x: number; y: number; w: number; h?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={h / 2} className="fill-foreground/[0.055]" />
);

/** Bloc au filet fin (champ ou ligne de tableau vide). */
const Outline = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx="20"
    fill="none"
    className="stroke-foreground/[0.09]"
    strokeWidth="1.6"
  />
);

/** Bloc en pointillés (zone à remplir). */
const Dashed = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx="18"
    fill="none"
    className="stroke-foreground/[0.16]"
    strokeWidth="1.8"
    strokeDasharray="11 10"
  />
);

/* Étapes de l'écran « Acheter », de la plus lisible à la plus effacée. */
const STEPS: [string, string][] = [
  ["montant", "0.62"],
  ["méthode", "0.50"],
  ["réseau", "0.40"],
  ["frais", "0.30"],
  ["disponible", "0.21"],
  ["confirmer", "0.13"],
];

const AppFlowArt = ({ className }: { className?: string }) => (
  /* `w-full` est indispensable : dans une colonne flex, un `mx-auto` sur cet
     élément l'empêcherait de s'étirer et le SVG retomberait sur sa largeur
     intrinsèque par défaut (300 px). */
  <div className={cn("flex w-full justify-center", className)}>
    <svg
      viewBox="140 105 1045 925"
      className="h-auto w-full max-w-[420px] sm:max-w-[560px] lg:max-w-[660px] xl:max-w-[720px]"
      fill="none"
      role="img"
      aria-label="Aperçu de l'application Ooble : acheter, vendre et suivre ses transactions USDT"
    >
      <defs>
        <filter id="ooble-card-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="15" floodColor="#0b1b1f" floodOpacity="0.05" />
        </filter>
      </defs>

      {/* ---------- Acheter USDT (au fond, à gauche) ---------- */}
      <Card i={0}>
        <Title>Acheter USDT</Title>
        {STEPS.map(([label, opacity], k) => (
          <text
            key={label}
            x="50"
            y={162 + k * 48}
            className="fill-foreground"
            fillOpacity={opacity}
            fontSize="34"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          >
            {label}
          </text>
        ))}
      </Card>

      {/* ---------- Vendre USDT (au milieu) ---------- */}
      <Card i={1}>
        <Title>Vendre USDT</Title>

        {/* Montant à saisir + zone secondaire qui dépasse en haut à droite */}
        <Dashed x={44} y={118} w={430} h={92} />
        <Dashed x={300} y={58} w={212} h={74} />

        {/* Flux vers la confirmation : petite fourche puis longue courbe */}
        <g className="stroke-foreground/20" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M196 212 C 196 252 214 262 250 272" />
          <path d="M196 212 C 196 268 140 292 124 348 C 114 382 112 402 112 428" />
          <path d="M100 412 L 112 442 L 124 412" strokeLinejoin="round" />
        </g>

        {/* Blocs de règlement en bas */}
        <rect x="60" y="430" width="100" height="110" rx="16" className="fill-foreground/[0.05]" />
        <rect x="174" y="406" width="92" height="108" rx="16" className="fill-foreground/[0.05]" />
      </Card>

      {/* ---------- Transactions (au premier plan, à droite) ---------- */}
      <Card i={2}>
        <Title>Transactions</Title>

        {/* Colonne de gauche */}
        <Outline x={44} y={118} w={235} h={66} />
        <Bar x={52} y={206} w={195} />
        <Bar x={52} y={247} w={130} />
        <Outline x={44} y={301} w={205} h={64} />
        <Bar x={52} y={387} w={215} />
        <Outline x={44} y={456} w={185} h={60} />

        {/* Colonne de droite */}
        <Outline x={330} y={92} w={160} h={58} />
        <Bar x={330} y={169} w={175} h={26} />
        <Bar x={330} y={211} w={150} h={26} />
        <Outline x={315} y={316} w={225} h={64} />
        <Bar x={325} y={402} w={200} />
        <Outline x={325} y={471} w={175} h={58} />

        {/* Séparateur en trois points */}
        {[222, 262, 302].map((cy) => (
          <circle key={cy} cx="296" cy={cy} r="9" className="fill-foreground/[0.09]" />
        ))}
      </Card>
    </svg>
  </div>
);

export default AppFlowArt;
