import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Handshake, Check, ShieldCheck, Zap, BadgePercent } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import CopyRow from "@/components/app/CopyRow";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Side = "buy" | "sell";

const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 0 });
const newRef = () => `OTC-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

const perks = [
  { icon: BadgePercent, title: "Meilleur taux", sub: "Marge réduite dès 25 000 $" },
  { icon: Zap, title: "Règlement dédié", sub: "Un interlocuteur, sur mesure" },
  { icon: ShieldCheck, title: "Non-custodial", sub: "Vos USDT, vos clés" },
];

const AppOTC = () => {
  const [side, setSide] = useState<Side>("buy");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const ref = useMemo(() => newRef(), []);

  const value = parseFloat(amount.replace(/[^\d.]/g, "")) || 0;
  const valid = value >= 25000 && /^\S+@\S+\.\S+$/.test(email);

  if (sent) {
    return (
      <AppShell backTo="/app" header={<div><h1 className="font-display text-[22px] font-semibold tracking-tight">Demande envoyée</h1><p className="mt-1 text-[13px] text-muted-foreground">Notre desk vous répond sous peu</p></div>}>
        <div className="rounded-[16px] border border-border bg-card p-6">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary text-foreground">
              <Check className="h-7 w-7" strokeWidth={2.4} />
            </span>
            <p className="mt-4 font-display text-lg font-semibold">Merci !</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Un membre du desk OTC vous contacte à <span className="font-semibold text-foreground">{email}</span> avec une cotation ferme.
            </p>
          </div>
          <dl className="mt-6 divide-y divide-border border-t border-border text-sm">
            <div className="flex justify-between py-3"><dt className="text-muted-foreground">Sens</dt><dd className="font-medium">{side === "buy" ? "Achat" : "Vente"} d'USDT</dd></div>
            <div className="flex justify-between py-3"><dt className="text-muted-foreground">Volume</dt><dd className="font-semibold">{nf.format(value)} USDT</dd></div>
          </dl>
        </div>

        <p className="mb-2 mt-5 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Votre référence</p>
        <div className="overflow-hidden rounded-[16px] border border-border bg-card">
          <CopyRow label="Référence de la demande" value={ref} mono />
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="appPrimary" shape="soft" className="h-auto px-[22px] py-[13px] text-sm" asChild>
            <Link to="/app"><Check className="h-[17px] w-[17px]" strokeWidth={2} /> Terminé</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      backTo="/app"
      header={
        <div>
          <h1 className="font-display text-[22px] font-semibold tracking-tight">Desk OTC</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Pour les gros volumes</p>
        </div>
      }
    >
      {/* Avantages */}
      <div className="divide-y divide-border overflow-hidden rounded-[16px] border border-border bg-card">
        {perks.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 px-5 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
              <Icon className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{title}</span>
              <span className="block text-[13px] text-muted-foreground">{sub}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Demande de cotation */}
      <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Demander une cotation</p>
      <div className="space-y-3 rounded-[16px] border border-border bg-card p-5">
        {/* Sens */}
        <div className="flex rounded-[10px] border border-border bg-secondary/60 p-0.5">
          {([
            { key: "buy" as Side, label: "Acheter" },
            { key: "sell" as Side, label: "Vendre" },
          ]).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSide(key)}
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-semibold transition-colors",
                side === key ? "bg-card text-foreground dark:bg-neutral-600" : "text-muted-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Volume */}
        <div className="relative">
          <input
            inputMode="numeric"
            placeholder="Volume"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
            className="w-full rounded-[12px] border border-border bg-secondary/40 py-3.5 pl-4 pr-16 text-base outline-none placeholder:text-muted-foreground/60"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">USDT</span>
        </div>

        {/* Email */}
        <input
          type="email"
          spellCheck={false}
          autoCapitalize="none"
          placeholder="E-mail de contact"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          className="w-full rounded-[12px] border border-border bg-secondary/40 py-3.5 px-4 text-base outline-none placeholder:text-muted-foreground/60"
        />

        <p className="px-1 text-xs text-muted-foreground">Volume minimum : 25 000 USDT.</p>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" disabled={!valid} onClick={() => setSent(true)}>
          <Handshake className="h-[17px] w-[17px]" strokeWidth={2} /> Demander un devis
        </Button>
      </div>
    </AppShell>
  );
};

export default AppOTC;
