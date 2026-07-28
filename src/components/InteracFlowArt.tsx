import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Illustration de la section « Payez par virement Interac ».
 *
 * Concept VOLONTAIREMENT différent de l'illustration du héros (qui est une pile
 * de cartes isométriques) : ici c'est un « virement en chemin ». Deux nœuds —
 * votre banque à gauche, Ooble à droite — reliés par un rail en pointillés ; un
 * paiement « 500 $ » glisse le long du rail, et une onde se propage à l'arrivée.
 * Disposition, forme et animation sont donc autres, tout en gardant le même
 * esprit : sobre, aux jetons du thème, fondu dans le fond, mouvement discret.
 *
 * Le paiement suit exactement le rail grâce à `offset-path` (même tracé que le
 * `<path>` visible). L'animation ne joue que `offset-distance` + l'opacité ; le
 * tracé, lui, est passé en style inline pour rester défini à un seul endroit.
 */

/** Tracé du rail (unités de la viewBox). Sert au trait visible ET à offset-path. */
const RAIL = "M 206 300 C 296 300 344 198 442 190";

const Node = ({
  cx,
  cy,
  label,
  children,
}: {
  cx: number;
  cy: number;
  label: string;
  children: React.ReactNode;
}) => (
  <g>
    <rect
      x={cx - 62}
      y={cy - 62}
      width={124}
      height={124}
      rx={28}
      className="fill-background stroke-foreground/[0.09] dark:stroke-foreground/[0.16]"
      strokeWidth="1.6"
      filter="url(#ooble-xfer-shadow)"
    />
    {children}
    <text
      x={cx}
      y={cy + 96}
      textAnchor="middle"
      className="fill-foreground/45 font-display dark:fill-foreground/55"
      fontSize="21"
      fontWeight="500"
      letterSpacing="-0.4"
    >
      {label}
    </text>
  </g>
);

const InteracFlowArt = ({ className }: { className?: string }) => (
  <div className={cn("flex w-full justify-center", className)}>
    <svg
      viewBox="30 70 590 380"
      className="h-auto w-full"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 14%, #000 78%, transparent 100%), linear-gradient(to right, transparent 0%, #000 9%, #000 91%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, #000 14%, #000 78%, transparent 100%), linear-gradient(to right, transparent 0%, #000 9%, #000 91%, transparent 100%)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
      fill="none"
      role="img"
      aria-label="Un virement Interac voyage de votre banque vers Ooble"
    >
      <defs>
        <filter id="ooble-xfer-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="14" floodColor="#0b1b1f" floodOpacity="0.04" />
        </filter>
      </defs>

      {/* Rail en pointillés reliant les deux nœuds. */}
      <path
        d={RAIL}
        className="stroke-foreground/[0.16] dark:stroke-foreground/25"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 13"
        fill="none"
      />

      {/* Nœud gauche : votre banque. */}
      <Node cx={150} cy={310} label="Votre banque">
        <Landmark
          x={150 - 27}
          y={310 - 27}
          width={54}
          height={54}
          strokeWidth={1.6}
          className="stroke-foreground/55 dark:stroke-foreground/65"
        />
      </Node>

      {/* Nœud droit : Ooble (marque à deux anneaux), avec onde d'arrivée. */}
      <g>
        {/* Onde qui se propage quand le paiement arrive. */}
        <circle
          cx={498}
          cy={198}
          r={62}
          className="ooble-xfer-ripple stroke-primary/40"
          strokeWidth="2"
          fill="none"
        />
        <Node cx={498} cy={198} label="Ooble">
          <g transform="translate(498 198)">
            <circle cx={-10} cy={0} r={15} fill="none" className="stroke-primary" strokeWidth="6" />
            <circle cx={12} cy={0} r={15} fill="none" className="stroke-foreground/70 dark:stroke-foreground/80" strokeWidth="6" />
          </g>
        </Node>
      </g>

      {/* Paiement qui glisse le long du rail. */}
      <g
        className="ooble-xfer-payload"
        style={{ offsetPath: `path("${RAIL}")`, offsetRotate: "0deg" }}
      >
        <rect
          x={-44}
          y={-22}
          width={88}
          height={44}
          rx={22}
          className="fill-background stroke-foreground/[0.14] dark:stroke-foreground/25"
          strokeWidth="1.5"
          filter="url(#ooble-xfer-shadow)"
        />
        <circle cx={-24} cy={0} r={7} className="fill-primary/80" />
        <text
          x={8}
          y={6}
          textAnchor="middle"
          className="fill-foreground/80 font-display dark:fill-foreground/90"
          fontSize="20"
          fontWeight="600"
          letterSpacing="-0.5"
        >
          500 $
        </text>
      </g>
    </svg>
  </div>
);

export default InteracFlowArt;
