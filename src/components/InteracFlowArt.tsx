import { Pointer } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Illustration de la section « Payez par virement Interac ».
 *
 * Même langage que l'illustration du héros (cartes en projection isométrique,
 * fondu sur les bords, main-curseur animée, carte visée qui se soulève) mais
 * ADAPTÉ au sujet et à l'emplacement :
 * — le sujet est le e-Transfer : une notification « Virement reçu · 500 $ »,
 *   une question de sécurité, le dépôt en banque ;
 * — la disposition est un empilement plus vertical (pile de notifications),
 *   pas la bande large et étirée du héros, car ce bloc occupe une colonne
 *   étroite (~420 px) et non toute la largeur.
 *
 * Animations réutilisées de l'illustration héros (génériques, indépendantes de
 * la géométrie) : `ooble-art-lift` (soulèvement), `ooble-art-select` (liseré),
 * `ooble-art-press` (enfoncement de la main). Seul le trajet du curseur est
 * propre à cette disposition : `ooble-pay-cursor`.
 */

const SKEW_DEG = 9;
const K = Math.tan((SKEW_DEG * Math.PI) / 180); // ≈ 0.1584
const SKEW = `matrix(1 ${(-K).toFixed(4)} 0 1 0 0)`;

/** Cartes empilées vers le bas-droite (pile de notifications). */
const CARD = { w: 470, h: 264, r: 24 };
const STEP = { x: 60, y: 120 };
const ORIGINS = [0, 1, 2].map((i) => ({ x: i * STEP.x, y: i * STEP.y }));

const VIEW_BOX = "-24 -150 690 720";

/* Fondu doux des quatre bords, pour que la pile se devine dans le fond. */
const FADE_Y = "linear-gradient(to bottom, transparent 0%, #000 8%, #000 66%, transparent 100%)";
const FADE_X = "linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%)";

const Card = ({ i, children }: { i: number; children: React.ReactNode }) => (
  <g className="ooble-art-lift" style={{ animationDelay: `${i * 4}s` }}>
    <g transform={`translate(${ORIGINS[i].x} ${ORIGINS[i].y}) ${SKEW}`}>
      <rect
        width={CARD.w}
        height={CARD.h}
        rx={CARD.r}
        className="fill-background stroke-foreground/[0.07] dark:stroke-foreground/[0.13]"
        strokeWidth="1.5"
        filter="url(#ooble-pay-shadow)"
      />
      {children}
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

const Title = ({ children }: { children: string }) => (
  <text
    x="44"
    y="62"
    className="fill-foreground/[0.42] font-display dark:fill-foreground/[0.5]"
    fontSize="34"
    fontWeight="500"
    letterSpacing="-0.8"
  >
    {children}
  </text>
);

const Bar = ({ x, y, w, h = 20 }: { x: number; y: number; w: number; h?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={h / 2} className="fill-foreground/[0.05] dark:fill-foreground/[0.08]" />
);

const Dashed = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx="14"
    fill="none"
    className="stroke-foreground/[0.12] dark:stroke-foreground/[0.19]"
    strokeWidth="1.6"
    strokeDasharray="10 9"
  />
);

const InteracFlowArt = ({ className }: { className?: string }) => (
  <div className={cn("flex w-full justify-center", className)}>
    <svg
      viewBox={VIEW_BOX}
      className="h-auto w-full"
      style={{
        maskImage: `${FADE_Y}, ${FADE_X}`,
        WebkitMaskImage: `${FADE_Y}, ${FADE_X}`,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
      fill="none"
      role="img"
      aria-label="Recevoir un virement Interac : notification, question de sécurité, dépôt en banque"
    >
      <defs>
        <filter id="ooble-pay-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="14" floodColor="#0b1b1f" floodOpacity="0.035" />
        </filter>
      </defs>

      {/* ---------- Compte bancaire (au fond) ---------- */}
      <Card i={0}>
        <Title>Compte bancaire</Title>
        <Bar x={44} y={104} w={150} h={16} />
        <Bar x={44} y={140} w={300} />
        <Bar x={44} y={176} w={230} />
        {/* Solde à droite */}
        <rect x={330} y={96} width={96} height={40} rx={12} className="fill-foreground/[0.05] dark:fill-foreground/[0.08]" />
      </Card>

      {/* ---------- Question de sécurité (au milieu) ---------- */}
      <Card i={1}>
        <Title>Question de sécurité</Title>
        <Bar x={44} y={104} w={250} h={16} />
        {/* Champ de réponse à saisir */}
        <Dashed x={44} y={140} w={382} h={70} />
      </Card>

      {/* ---------- Interac e-Transfer (au premier plan) ---------- */}
      <Card i={2}>
        <Title>Interac e-Transfer</Title>
        <text x="44" y="112" className="fill-foreground/40 dark:fill-foreground/50" fontSize="20">
          Virement reçu
        </text>
        <text
          x="44"
          y="164"
          className="fill-foreground/[0.7] font-display dark:fill-foreground/80"
          fontSize="46"
          fontWeight="600"
          letterSpacing="-1.5"
        >
          500,00 $
        </text>
        {/* Bouton « Déposer » — plein, c'est lui que la main enfonce */}
        <g id="ooble-pay-deposit">
          <rect x={280} y={196} width={146} height={44} rx={12} className="fill-foreground/[0.82] dark:fill-foreground/90" />
          <text x={353} y={224} textAnchor="middle" className="fill-background" fontSize="19" fontWeight="600">
            Déposer
          </text>
        </g>
      </Card>

      {/* Curseur : descend la pile et enfonce « Déposer ». */}
      <g className="ooble-pay-cursor">
        <g className="ooble-art-press">
          <Pointer
            x={-11}
            y={-3}
            width={34}
            height={34}
            strokeWidth={1.7}
            fill="none"
            className="stroke-foreground/[0.4] dark:stroke-foreground/[0.55]"
          />
        </g>
      </g>
    </svg>
  </div>
);

export default InteracFlowArt;
