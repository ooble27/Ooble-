import { useMemo, useState } from "react";
import { ArrowLeft, Copy, Check, Hand, ArrowRight, Ban, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CURRENT_OPERATOR, STATUS_META, TYPE_META, nfCad, nfUsdt, timeAgo,
  type AdminOrder,
} from "@/lib/adminOrders";
import { StatusBadge } from "./AdminBits";
import { NETWORKS } from "@/components/app/networks";

interface Props {
  order: AdminOrder;
  onBack: () => void;
  onPatch: (id: string, changes: Partial<AdminOrder>) => void;
}

type SectionId = "client" | "commande" | "paiement" | "reseau";

const OrderDetail = ({ order, onBack, onPatch }: Props) => {
  const [section, setSection] = useState<SectionId>("client");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (value: string, key: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1200);
  };

  const Row = ({ label, value, mono, copyKey }: { label: string; value?: string | null; mono?: boolean; copyKey?: string }) => (
    <div className="flex items-start justify-between gap-4 px-5 py-3.5">
      <span className="shrink-0 text-[13px] text-muted-foreground">{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        <span className={cn("break-all text-right text-[13px] font-medium", mono && "font-mono text-[12px]")}>{value || "—"}</span>
        {copyKey && value && (
          <button onClick={() => copy(value, copyKey)} className="shrink-0 text-muted-foreground transition-colors hover:text-foreground" aria-label="Copier">
            {copied === copyKey ? <Check className="h-[13px] w-[13px] text-primary" /> : <Copy className="h-[13px] w-[13px]" />}
          </button>
        )}
      </span>
    </div>
  );

  const SECTIONS = useMemo(() => {
    const base: { id: SectionId; label: string }[] = [
      { id: "client", label: "Client" },
      { id: "commande", label: "Commande" },
      { id: "paiement", label: "Paiement" },
    ];
    if (order.type === "buy") base.push({ id: "reseau", label: "Réseau" });
    return base;
  }, [order.type]);

  const active = SECTIONS.some((s) => s.id === section) ? section : "client";

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          aria-label="Retour"
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-secondary active:scale-95"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-display text-[19px] font-semibold tracking-tight">Traiter la commande</h2>
            <StatusBadge status={order.status} />
          </div>
          <button onClick={() => copy(order.ref, "ref")} className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-[12px] text-muted-foreground transition-colors hover:text-foreground">
            {order.ref} {copied === "ref" ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Résumé compact */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{TYPE_META[order.type].label}</p>
          <p className="mt-1 text-[16px] font-semibold">
            {order.type === "buy" ? `${nfCad.format(order.cad)} CAD` : `${nfUsdt.format(order.usdt)} USDT`}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Contrepartie</p>
          <p className="mt-1 text-[16px] font-semibold">
            {order.type === "buy" ? `${nfUsdt.format(order.usdt)} USDT` : `${nfCad.format(order.cad)} CAD`}
          </p>
        </div>
        <div className="col-span-2 rounded-2xl border border-border bg-card px-4 py-3 sm:col-span-1">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">À faire</p>
          <p className="mt-1 text-[14px] font-medium">{TYPE_META[order.type].verb}</p>
        </div>
      </div>

      {/* Sections (pastilles) */}
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => {
          const on = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={cn(
                "rounded-[10px] border px-3.5 py-2 text-[13px] font-medium transition-colors",
                on ? "border-foreground bg-secondary text-foreground" : "border-border bg-card text-muted-foreground hover:bg-secondary/50",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Contenu de section */}
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {active === "client" && (
          <>
            <Row label="Nom complet" value={order.clientName} />
            <Row label="E-mail" value={order.clientEmail} mono copyKey="email" />
            <Row label="Type de compte" value="Particulier" />
          </>
        )}
        {active === "commande" && (
          <>
            <Row label="Type" value={TYPE_META[order.type].label} />
            <Row label="Montant CAD" value={`${nfCad.format(order.cad)} CAD`} />
            <Row label="Montant USDT" value={`${nfUsdt.format(order.usdt)} USDT`} />
            <Row label="Taux" value={`1 USDT = ${nfCad.format(order.rate)} CAD`} />
            <Row label="Créée" value={timeAgo(order.createdMinsAgo)} />
          </>
        )}
        {active === "paiement" && (
          <>
            {order.type === "buy" ? (
              <>
                <Row label="Moyen" value="Interac e-Transfer (entrant)" />
                <Row label="Le client paie" value={`${nfCad.format(order.cad)} CAD`} />
                <Row label="Référence" value={order.ref} mono copyKey="pref" />
              </>
            ) : (
              <>
                <Row label="Moyen" value="Interac e-Transfer (sortant)" />
                <Row label="À verser au client" value={`${nfCad.format(order.cad)} CAD`} />
                <Row label="E-mail Interac" value={order.interacEmail} mono copyKey="interac" />
              </>
            )}
          </>
        )}
        {active === "reseau" && order.type === "buy" && (
          <>
            <Row label="Réseau" value={(() => { const n = NETWORKS.find((x) => x.id === order.network); return n ? `${n.name} · ${n.tag}` : "—"; })()} />
            <Row label="Adresse de réception" value={order.address} mono copyKey="addr" />
          </>
        )}
      </div>

      {/* Barre d'actions */}
      <div className="flex flex-wrap gap-2.5">
        {order.status === "attente" && (
          <Button variant="appPrimary" shape="rounded" className="h-auto gap-2 rounded-[10px] px-4 py-[11px] text-sm"
                  onClick={() => onPatch(order.id, { status: "recu" })}>
            <Check className="h-[17px] w-[17px]" /> Marquer reçu
          </Button>
        )}
        {order.status === "recu" && (
          <Button variant="appPrimary" shape="rounded" className="h-auto gap-2 rounded-[10px] px-4 py-[11px] text-sm"
                  onClick={() => onPatch(order.id, { status: "cours", assignedTo: CURRENT_OPERATOR })}>
            <Hand className="h-[17px] w-[17px]" /> Prendre en charge
          </Button>
        )}
        {order.status === "cours" && (
          <>
            <Button variant="appPrimary" shape="rounded" className="h-auto gap-2 rounded-[10px] px-4 py-[11px] text-sm"
                    onClick={() => onPatch(order.id, { status: "termine" })}>
              <ArrowRight className="h-[17px] w-[17px]" /> Marquer terminé
            </Button>
            <Button variant="appOutline" shape="rounded" className="h-auto gap-2 rounded-[10px] px-4 py-[11px] text-sm"
                    onClick={() => onPatch(order.id, { status: "recu", assignedTo: null })}>
              Libérer
            </Button>
          </>
        )}
        {order.status !== "termine" && order.status !== "annule" && (
          <Button variant="appOutline" shape="rounded" className="h-auto gap-2 rounded-[10px] px-4 py-[11px] text-sm"
                  onClick={() => onPatch(order.id, { status: "annule" })}>
            <Ban className="h-[17px] w-[17px]" /> Annuler
          </Button>
        )}
        {(order.status === "termine" || order.status === "annule") && (
          <Button variant="appOutline" shape="rounded" className="h-auto gap-2 rounded-[10px] px-4 py-[11px] text-sm"
                  onClick={() => onPatch(order.id, { status: "recu", assignedTo: null })}>
            <RotateCcw className="h-[17px] w-[17px]" /> Rouvrir
          </Button>
        )}
      </div>

      <p className="text-center text-[12px] text-muted-foreground">
        Commande {STATUS_META[order.status].label.toLowerCase()}.
      </p>
    </div>
  );
};

export default OrderDetail;
