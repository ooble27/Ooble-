import { useEffect, useState } from "react";
import { ArrowLeft, Copy, Check, Coins, HandCoins, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { nfCad } from "@/lib/adminOrders";
import { orderRef } from "@/lib/orders";
import {
  fetchClientProfile, fetchClientOrders, KYC_LABEL,
  type ClientProfile as ClientProfileData, type ClientOrder,
} from "@/lib/adminClient";

interface Props {
  userId: string;
  clientName: string;
  onBack: () => void;
  onOpenOrder?: (orderId: string) => void;
}

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const dateFmt = new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "long", year: "numeric" });
const dateFmtShort = new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "short" });
const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const nfUsdt = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 });

const STATUS_FR: Record<string, string> = {
  created: "Créée",
  awaiting_payment: "En attente",
  payment_received: "À traiter",
  settling: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
  expired: "Expirée",
};

const ClientProfile = ({ userId, clientName, onBack, onOpenOrder }: Props) => {
  const [profile, setProfile] = useState<ClientProfileData | null>(null);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([fetchClientProfile(userId), fetchClientOrders(userId)]).then(([p, o]) => {
      if (!active) return;
      setProfile(p);
      setOrders(o);
      setLoading(false);
    });
    return () => { active = false; };
  }, [userId]);

  const copy = (value: string, key: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1200);
  };

  const Row = ({ label, value, mono, copyKey }: { label: string; value?: string | null; mono?: boolean; copyKey?: string }) => (
    <div className="flex items-start justify-between gap-4 px-5 py-3.5">
      <span className="shrink-0 text-[14px] text-muted-foreground">{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        <span className={cn("break-all text-right text-[14px] font-medium", mono && "font-mono text-[12px]")}>{value || "—"}</span>
        {copyKey && value && (
          <button onClick={() => copy(value, copyKey)} className="shrink-0 text-muted-foreground transition-colors hover:text-foreground" aria-label="Copier">
            {copied === copyKey ? <Check className="h-[14px] w-[14px] text-primary" /> : <Copy className="h-[14px] w-[14px]" />}
          </button>
        )}
      </span>
    </div>
  );

  const name = profile?.fullName ?? clientName;

  return (
    <div className="mx-auto w-full max-w-[720px] space-y-4">
      {/* En-tête */}
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          aria-label="Retour"
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-secondary active:scale-95"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
        </button>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold">Fiche client</p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Informations complètes du client</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card py-16 text-center text-[13px] text-muted-foreground">
          Chargement…
        </div>
      ) : (
        <>
          {/* Carte identité */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary text-[16px] font-semibold text-foreground/70">
                {initials(name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[17px] font-semibold">{name}</p>
                <p className="text-[13px] text-muted-foreground">{profile?.email || "—"}</p>
                {profile && (
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    Client depuis {dateFmt.format(new Date(profile.createdAt))}
                  </p>
                )}
              </div>
            </div>

            {profile && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-secondary/50 px-3 py-2.5 text-center">
                  <p className="text-[18px] font-semibold">{profile.orderCount}</p>
                  <p className="text-[11px] text-muted-foreground">Commandes</p>
                </div>
                <div className="rounded-xl bg-secondary/50 px-3 py-2.5 text-center">
                  <p className="text-[18px] font-semibold">{nfCad.format(profile.totalCad)}</p>
                  <p className="text-[11px] text-muted-foreground">Volume CAD</p>
                </div>
                <div className="rounded-xl bg-secondary/50 px-3 py-2.5 text-center">
                  <p className="text-[14px] font-semibold">{KYC_LABEL[profile.kycStatus]}</p>
                  <p className="text-[11px] text-muted-foreground">KYC</p>
                </div>
              </div>
            )}
          </div>

          {/* Informations détaillées */}
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            <Row label="Nom complet" value={name} />
            <Row label="E-mail" value={profile?.email} mono copyKey="email" />
            <Row label="Téléphone" value={profile?.phone} />
            <Row label="ID utilisateur" value={userId.slice(0, 12) + "…" + userId.slice(-4)} mono copyKey="uid" />
            <Row label="Statut KYC" value={profile ? KYC_LABEL[profile.kycStatus] : "—"} />
            <Row label="Limite quotidienne" value={profile ? `${nfCad.format(profile.dailyLimitCad)} CAD` : "—"} />
            {profile?.interacQuestion && (
              <Row label="Question Interac" value={profile.interacQuestion} />
            )}
            {profile?.interacAnswer && (
              <Row label="Réponse Interac" value={profile.interacAnswer} />
            )}
            <Row label="Inscription" value={profile ? dateFmt.format(new Date(profile.createdAt)) : "—"} />
          </div>

          {/* Historique des commandes */}
          <div>
            <p className="mb-2.5 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Historique des commandes ({orders.length})
            </p>
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {orders.length === 0 ? (
                <div className="py-10 text-center text-[13px] text-muted-foreground">
                  Aucune commande pour ce client.
                </div>
              ) : (
                orders.map((o) => {
                  const buy = o.side === "buy";
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => onOpenOrder?.(o.id)}
                      className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-secondary/30 active:bg-secondary/50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                        {buy
                          ? <Coins className="h-[18px] w-[18px]" strokeWidth={1.7} />
                          : <HandCoins className="h-[18px] w-[18px]" strokeWidth={1.7} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium">
                          {buy ? "Achat" : "Vente"} — {nfUsdt.format(o.usdtAmount)} USDT
                        </p>
                        <p className="truncate text-[12px] text-muted-foreground">
                          {orderRef(o.id)} · {STATUS_FR[o.status] ?? o.status}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[14px] font-semibold">{nf.format(o.cadAmount)} <span className="text-[12px] font-medium">CAD</span></p>
                        <p className="text-[11.5px] text-muted-foreground">
                          {dateFmtShort.format(new Date(o.createdAt))}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientProfile;
