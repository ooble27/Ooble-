/**
 * Maquettes d'interface — de vraies captures reconstruites de l'app Ooble,
 * présentées dans des cadres façon fenêtre. Tout est bâti sur les jetons du
 * design system : les maquettes suivent donc le mode clair / sombre.
 */
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Coins,
  HandCoins,
  Handshake,
  Lock,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import RateChart from "@/components/app/RateChart";
import { formatCad } from "@/lib/rates";
import { cn } from "@/lib/utils";

/** Tendance factice, purement décorative. */
const TREND = [1.38, 1.39, 1.385, 1.4, 1.398, 1.41, 1.405, 1.418, 1.425, 1.42, 1.43, 1.428];

/** Cadre façon fenêtre — barre à pastilles et étiquette. */
export const Frame = ({
  children,
  label,
  className,
  bodyClassName,
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
  bodyClassName?: string;
}) => (
  <div
    className={cn(
      /* `text-foreground` est indispensable : le cadre peut être posé sur un
         panneau inversé, qui impose sinon sa couleur de texte. */
      "overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-lift",
      className,
    )}
  >
    <div className="flex items-center gap-2.5 border-b border-border px-4 py-2.5">
      <span className="flex gap-1.5" aria-hidden>
        <i className="h-2 w-2 rounded-full bg-foreground/15" />
        <i className="h-2 w-2 rounded-full bg-foreground/15" />
        <i className="h-2 w-2 rounded-full bg-foreground/15" />
      </span>
      {label && (
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
          {label}
        </span>
      )}
    </div>
    <div className={cn("p-4", bodyClassName)}>{children}</div>
  </div>
);

/** Petite carte flottante posée sur une maquette. */
export const FloatCard = ({
  icon: Icon,
  title,
  sub,
  className,
}: {
  icon: typeof Check;
  title: string;
  sub?: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 text-foreground shadow-lift",
      className,
    )}
  >
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
    </span>
    <div className="leading-tight">
      <p className="text-[11.5px] tracking-tight">{title}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  </div>
);

/** Bouton rond fléché, en coin de carte. */
export const RoundArrow = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    aria-label={label}
    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-all hover:opacity-90 active:scale-95"
  >
    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
  </Link>
);

/** Pastille d'état discrète. */
const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
    {children}
  </span>
);

/* ===================== Tableau de bord ===================== */

/** Réplique du tableau de bord Ooble (taux, actions, réseaux, activité). */
export const DashboardMock = ({ rate }: { rate: number }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <p className="font-display text-[15px] tracking-tight">Bonjour</p>
      <span className="flex gap-1.5">
        <i className="h-6 w-6 rounded-lg bg-secondary" />
        <i className="h-6 w-6 rounded-lg bg-secondary" />
      </span>
    </div>

    <div className="grid gap-3 sm:grid-cols-2">
      {/* Taux + graphe */}
      <div className="rounded-xl border border-border p-3.5">
        <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
          Taux USDT / CAD
        </p>
        <p className="mt-2.5 font-display text-[26px] leading-none tracking-tight">
          {formatCad(rate)}
        </p>
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          1 USDT en dollars canadiens · marché + 2 %
        </p>
        <RateChart data={TREND} height={60} className="mt-3 w-full text-foreground/50" />
      </div>

      <div className="space-y-3">
        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Coins, label: "Acheter" },
            { icon: HandCoins, label: "Vendre" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-foreground/70">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
              </span>
              <span className="text-[11.5px]">{label}</span>
            </div>
          ))}
        </div>

        {/* Réseaux */}
        <div>
          <p className="mb-1.5 text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
            Recevez sur 6 réseaux
          </p>
          <div className="flex gap-1.5">
            {["trx", "eth", "bnb", "matic", "sol", "avax"].map((id) => (
              <img key={id} src={`/coins/${id}.svg`} alt="" className="h-6 w-6 rounded-full" draggable={false} />
            ))}
          </div>
        </div>

        {/* Envoyer / OTC */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Send, label: "Envoyer", sub: "Vers un wallet" },
            { icon: Handshake, label: "Desk OTC", sub: "Gros volumes" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="rounded-xl border border-border p-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-foreground/70">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
              </span>
              <p className="mt-2 text-[11px]">{label}</p>
              <p className="text-[9.5px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Activité */}
    <div className="rounded-xl border border-border px-3.5 py-3">
      <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
        Activité récente
      </p>
      <div className="mt-1 divide-y divide-border">
        {[
          { label: "Achat USDT", sub: "Tron · TRC20", amount: "+ 349,65 USDT", state: "Réglé" },
          { label: "Vente USDT", sub: "Interac e-Transfer", amount: "+ 420,00 $", state: "Réglé" },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground/70">
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11.5px]">{r.label}</p>
              <p className="text-[9.5px] text-muted-foreground">{r.sub}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px]">{r.amount}</p>
              <p className="text-[9.5px] text-muted-foreground">{r.state}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ===================== Écran d'achat ===================== */

export const BuyMock = ({ rate }: { rate: number }) => {
  const out = (500 / rate).toLocaleString("fr-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div className="space-y-2.5">
      <div className="rounded-xl bg-secondary px-3.5 py-3">
        <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">Vous payez</p>
        <p className="mt-1.5 font-display text-[22px] leading-none tracking-tight">500,00 $</p>
      </div>
      <div className="rounded-xl border border-border px-3.5 py-3">
        <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">Vous recevez</p>
        <p className="mt-1.5 font-display text-[17px] leading-none tracking-tight">{out} USDT</p>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
        <span className="flex items-center gap-2">
          <img src="/coins/trx.svg" alt="" className="h-6 w-6 rounded-full" draggable={false} />
          <span className="leading-tight">
            <span className="block text-[11.5px]">Tron</span>
            <span className="block text-[9.5px] text-muted-foreground">TRC20</span>
          </span>
        </span>
        <Pill>Frais bas</Pill>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
        <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Lock className="h-3.5 w-3.5" strokeWidth={1.7} /> Taux verrouillé
        </span>
        <span className="font-display text-[12px] tracking-tight">14:52</span>
      </div>
      <div className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-foreground text-[11.5px] text-background">
        Confirmer l'achat <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </div>
  );
};

/* ===================== Étapes (Comment ça marche) ===================== */

/** Étape 1 — vérification du compte. */
export const StepVerifyMock = () => (
  <div className="space-y-2">
    {[
      { label: "Courriel", state: "Confirmé" },
      { label: "Pièce d'identité", state: "Vérifiée" },
      { label: "Selfie", state: "Vérifié" },
    ].map((r) => (
      <div key={r.label} className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
        <span className="flex items-center gap-2 text-[11.5px]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
            <Check className="h-3 w-3" strokeWidth={2.5} />
          </span>
          {r.label}
        </span>
        <Pill>{r.state}</Pill>
      </div>
    ))}
    <div className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2.5">
      <span className="text-[11.5px]">Compte</span>
      <span className="text-[11px] text-muted-foreground">Prêt à négocier</span>
    </div>
  </div>
);

/** Étape 2 — création de l'ordre. */
export const StepOrderMock = ({ rate }: { rate: number }) => (
  <div className="space-y-2">
    <div className="rounded-xl bg-secondary px-3 py-2.5">
      <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">Montant</p>
      <p className="mt-1 font-display text-[19px] leading-none tracking-tight">500,00 $</p>
    </div>
    <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
      <span className="flex items-center gap-2">
        <img src="/coins/trx.svg" alt="" className="h-5 w-5 rounded-full" draggable={false} />
        <span className="text-[11.5px]">Tron · TRC20</span>
      </span>
      <Pill>Réseau</Pill>
    </div>
    <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
      <span className="text-[11px] text-muted-foreground">Taux</span>
      <span className="font-display text-[12px] tracking-tight">{formatCad(rate)}</span>
    </div>
    <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
      <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Lock className="h-3.5 w-3.5" strokeWidth={1.7} /> Verrouillé
      </span>
      <span className="font-display text-[12px] tracking-tight">15:00</span>
    </div>
  </div>
);

/** Étape 3 — règlement. */
export const StepSettleMock = () => (
  <div className="space-y-2">
    <div className="rounded-xl bg-secondary px-3 py-3 text-center">
      <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <p className="mt-2 text-[11.5px]">USDT envoyés</p>
      <p className="text-[9.5px] text-muted-foreground">Confirmé on-chain</p>
    </div>
    <div className="rounded-xl border border-border px-3 py-2.5">
      <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">Destination</p>
      <p className="mt-1 truncate font-display text-[11px] tracking-tight">TQn9…8mHc</p>
    </div>
    <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
      <span className="text-[11px] text-muted-foreground">Montant</span>
      <span className="font-display text-[12px] tracking-tight">349,65 USDT</span>
    </div>
    <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
      <span className="text-[11px] text-muted-foreground">Statut</span>
      <Pill>Terminé</Pill>
    </div>
  </div>
);

/* ===================== Sécurité ===================== */

export const SecurityMock = () => (
  <div className="space-y-2">
    {[
      { label: "Identité vérifiée", sub: "KYC complété", state: "Actif" },
      { label: "Chiffrement des données", sub: "En transit et au repos", state: "Actif" },
      { label: "Aucun solde conservé", sub: "Règlement à l'ordre", state: "Toujours" },
      { label: "Conformité canadienne", sub: "Obligations FINTRAC", state: "À jour" },
    ].map((r) => (
      <div key={r.label} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[11.5px]">{r.label}</p>
          <p className="text-[9.5px] text-muted-foreground">{r.sub}</p>
        </div>
        <Pill>{r.state}</Pill>
      </div>
    ))}
  </div>
);
