import { Pointer } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Trois écrans de l'app en projection isométrique (Acheter / Vendre /
 * Transactions), traités comme une trame de fond plutôt que comme une image.
 *
 * Rendu en SVG avec `viewBox` : l'illustration se met à l'échelle exactement de
 * la même façon sur mobile, tablette et grand écran (texte, filets et rayons
 * compris) — seule la largeur maximale change selon la brèche.
 *
 * Projection parallèle (aucune perspective) : chaque carte est un
 * parallélogramme obtenu par un cisaillement vertical, donc les bords
 * gauche/droit restent verticaux et les bords haut/bas montent vers la droite.
 *
 * Deux partis pris de composition :
 * — les cartes sont larges et basses, et s'étalent en longueur, pour occuper la
 *   largeur d'une page desktop sans gagner en hauteur ;
 * — tout est très peu contrasté et fondu sur les quatre bords, pour qu'on
 *   devine l'illustration incrustée dans le fond plutôt qu'on la regarde.
 */

/** Inclinaison des cartes, en degrés. Plus la valeur est basse, plus c'est droit. */
const SKEW_DEG = 9;
const K = Math.tan((SKEW_DEG * Math.PI) / 180); // ≈ 0.1584
const SKEW = `matrix(1 ${(-K).toFixed(4)} 0 1 0 0)`;

/** Carte large et basse ; le pas horizontal étale la série en longueur. */
const CARD = { w: 620, h: 420, r: 26 };
const STEP = { x: 280, y: 24 };
const ORIGINS = [0, 1, 2].map((i) => ({ x: i * STEP.x, y: i * STEP.y }));

/**
 * Cadre visible. Il est nettement plus large que haut (rapport ≈ 2,2) : c'est
 * lui qui donne l'allure étirée. La hauteur coupe le bas de la dernière carte,
 * mais le fondu rend la coupe invisible.
 */
const VIEW_BOX = "-5 -158 1200 592";

/*
 * Fondus : vertical puis horizontal, croisés pour estomper les quatre bords.
 * Le bord gauche ne part pas de zéro — il reste un fond de teinte — pour qu'on
 * devine le flanc de la première carte au lieu de le voir disparaître net.
 */
/* Le palier haut est court (7 %) : le cadre garde une marge pour la carte qui se
   soulève, et un fondu plus long y mangerait son coin supérieur. */
const FADE_Y = "linear-gradient(to bottom, transparent 0%, #000 7%, #000 60%, transparent 100%)";
const FADE_X =
  "linear-gradient(to right, rgba(0,0,0,0.32) 0%, #000 6%, #000 90%, transparent 100%)";

const Card = ({ i, children }: { i: number; children: React.ReactNode }) => (
  /*
    Deux groupes imbriqués, et pas un seul : l'extérieur porte le soulèvement,
    qui est une animation CSS, l'intérieur porte la position et le cisaillement,
    qui sont un attribut `transform`. Sur un même élément la règle CSS écraserait
    l'attribut et la carte reviendrait à l'origine.
  */
  <g className="ooble-art-lift" style={{ animationDelay: `${i * 4}s` }}>
    <g transform={`translate(${ORIGINS[i].x} ${ORIGINS[i].y}) ${SKEW}`}>
      {/*
      Le remplissage suit `--background`, pas `--card` : il ne sert qu'à masquer
      la carte du dessous. En clair les deux jetons valent blanc, mais en sombre
      `--card` est 3 % plus clair que la page — la carte devenait alors une dalle
      grise, impossible à fondre dans le fond. Avec `--background` la carte n'est
      dessinée que par son filet, dans les deux thèmes.
      */}
      <rect
        width={CARD.w}
        height={CARD.h}
        rx={CARD.r}
        className="fill-background stroke-foreground/[0.07] dark:stroke-foreground/[0.13]"
        strokeWidth="1.5"
        filter="url(#ooble-card-shadow)"
      />
      {children}
      {/*
        Liseré de sélection, peint après le contenu pour ne pas passer sous le
        remplissage opaque. Il accompagne le soulèvement — il ne suffisait pas
        seul, notamment en thème sombre où il se voyait à peine.
      */}
      <rect
        width={CARD.w}
        height={CARD.h}
        rx={CARD.r}
        fill="none"
        strokeWidth="2"
        className="ooble-art-select stroke-foreground/[0.18] dark:stroke-foreground/30"
        style={{ animationDelay: `${i * 4}s` }}
      />
    </g>
  </g>
);

/** Titre d'écran, posé au même endroit sur les trois cartes. */
const Title = ({ children }: { children: string }) => (
  <text
    x="50"
    y="72"
    className="fill-foreground/[0.42] font-display dark:fill-foreground/[0.5]"
    fontSize="40"
    fontWeight="500"
    letterSpacing="-1"
  >
    {children}
  </text>
);

/** Barre pleine (contenu « fantôme » d'une liste). */
const Bar = ({ x, y, w, h = 24 }: { x: number; y: number; w: number; h?: number }) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx={h / 2}
    className="fill-foreground/[0.04] dark:fill-foreground/[0.07]"
  />
);

/** Bloc au filet fin (champ ou ligne de tableau vide). */
const Outline = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx="18"
    fill="none"
    className="stroke-foreground/[0.06] dark:stroke-foreground/[0.11]"
    strokeWidth="1.5"
  />
);

/** Bloc en pointillés (zone à remplir). */
const Dashed = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx="16"
    fill="none"
    className="stroke-foreground/[0.11] dark:stroke-foreground/[0.18]"
    strokeWidth="1.6"
    strokeDasharray="11 10"
  />
);

/* Étapes de l'écran « Acheter », de la plus lisible à la plus effacée. */
const STEPS: [string, string][] = [
  ["montant", "0.40"],
  ["méthode", "0.33"],
  ["réseau", "0.26"],
  ["frais", "0.20"],
  ["disponible", "0.15"],
  ["confirmer", "0.10"],
];

const AppFlowArt = ({ className }: { className?: string }) => (
  /* `w-full` est indispensable : dans une colonne flex, un `mx-auto` sur cet
     élément l'empêcherait de s'étirer et le SVG retomberait sur sa largeur
     intrinsèque par défaut (300 px). */
  <div className={cn("flex w-full justify-center", className)}>
    <svg
      viewBox={VIEW_BOX}
      /* Le cadre est taillé pour le desktop, très étiré. Sur mobile un rapport
         plus haut est imposé et `slice` recadre l'illustration au lieu de la
         réduire — sinon la bande deviendrait minuscule sur un petit écran. Les
         bords de la coupe sont mangés par le fondu.
         Le calage est à gauche, et la fenêtre visible mesure 560 × ce rapport en
         unités de `viewBox` : 1,67 donne ≈ 935, juste ce qu'il faut pour que le
         titre « Transactions » rentre en entier à droite. */
      preserveAspectRatio="xMinYMid slice"
      className="aspect-[1.67/1] h-auto w-full sm:aspect-auto sm:max-w-[760px] lg:max-w-[1040px] xl:max-w-[1120px]"
      style={{
        maskImage: `${FADE_Y}, ${FADE_X}`,
        WebkitMaskImage: `${FADE_Y}, ${FADE_X}`,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
      fill="none"
      role="img"
      aria-label="Aperçu de l'application Ooble : acheter, vendre et suivre ses transactions USDT"
    >
      <defs>
        <filter id="ooble-card-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="14" floodColor="#0b1b1f" floodOpacity="0.035" />
        </filter>
      </defs>

      {/* ---------- Acheter USDT (au fond, à gauche) ---------- */}
      <Card i={0}>
        <Title>Acheter USDT</Title>
        {STEPS.map(([label, opacity], k) => (
          <text
            key={label}
            x="52"
            y={140 + k * 40}
            className="fill-foreground"
            fillOpacity={opacity}
            fontSize="30"
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
        <Dashed x={44} y={110} w={470} h={76} />
        <Dashed x={330} y={52} w={240} h={62} />

        {/* Flux vers le règlement : petite fourche puis longue courbe */}
        <g
          className="stroke-foreground/[0.13] dark:stroke-foreground/20"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M200 188 C 200 218 216 226 250 234" />
          <path d="M200 188 C 200 232 148 250 132 292 C 124 316 122 330 122 348" />
          <path d="M110 334 L 122 360 L 134 334" strokeLinejoin="round" />
        </g>

        {/* Blocs de règlement en bas */}
        <rect x="60" y="300" width="110" height="95" rx="14" className="fill-foreground/[0.038] dark:fill-foreground/[0.07]" />
        <rect x="184" y="282" width="100" height="95" rx="14" className="fill-foreground/[0.038] dark:fill-foreground/[0.07]" />
      </Card>

      {/* ---------- Transactions (au premier plan, à droite) ---------- */}
      <Card i={2}>
        <Title>Transactions</Title>

        {/* Colonne de gauche */}
        <Outline x={44} y={112} w={250} h={58} />
        <Bar x={52} y={192} w={205} />
        <Bar x={52} y={228} w={140} />
        <Outline x={44} y={272} w={220} h={56} />
        <Bar x={52} y={348} w={225} />

        {/* Colonne de droite */}
        <Outline x={350} y={86} w={180} h={54} />
        <Bar x={350} y={158} w={190} />
        <Bar x={350} y={194} w={160} />
        <Outline x={340} y={248} w={245} h={58} />
        <Bar x={350} y={326} w={215} />
        <Outline x={350} y={372} w={190} h={52} />

        {/* Séparateur en trois points */}
        {[196, 230, 264].map((cy) => (
          <circle
            key={cy}
            cx="316"
            cy={cy}
            r="8"
            className="fill-foreground/[0.07] dark:fill-foreground/[0.12]"
          />
        ))}
      </Card>

      {/*
        Curseur qui parcourt les trois écrans. Il est posé au niveau du SVG, pas
        dans une carte : il ne doit pas subir le cisaillement, une souris ne
        penche pas. Le déplacement vient d'une règle CSS — donc pas d'attribut
        `transform` ici, il l'écraserait.
      */}
      <g className="ooble-art-cursor">
        {/*
          Léger enfoncement de la main à l'arrivée sur chaque écran, à la place
          de l'ancienne onde ronde. Groupe séparé : le groupe parent occupe déjà
          son `transform` avec le déplacement.
          `Pointer` est repositionné pour que le bout de l'index tombe sur le
          point visé plutôt que le coin de l'icône.
        */}
        <g className="ooble-art-press">
          <Pointer
            x={-11}
            y={-3}
            width={34}
            height={34}
            strokeWidth={1.7}
            fill="none"
            className="stroke-foreground/[0.38] dark:stroke-foreground/[0.52]"
          />
        </g>
      </g>
    </svg>
  </div>
);

export default AppFlowArt;
