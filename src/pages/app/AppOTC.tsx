import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Handshake, Check } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import CopyRow from "@/components/app/CopyRow";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Side = "buy" | "sell";

const nf = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 0 });
const newRef = () => `OTC-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

const USAGES = [
  "Réserve de valeur / épargne",
  "Paiements commerciaux",
  "Transferts internationaux",
  "Trading",
  "Autre",
];
const SOURCES = [
  "Salaire / revenus",
  "Épargne personnelle",
  "Vente de biens ou services",
  "Activité commerciale",
  "Autre",
];

const fieldClass =
  "w-full rounded-[12px] border border-border bg-secondary/40 px-4 py-3.5 text-base outline-none placeholder:text-muted-foreground/60 focus:border-foreground";

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-1.5 block px-1 text-[13px] font-medium text-muted-foreground">{children}</span>
);

const AppOTC = () => {
  const [side, setSide] = useState<Side>("buy");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [usage, setUsage] = useState("");
  const [source, setSource] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const ref = useMemo(() => newRef(), []);

  const value = parseFloat(amount.replace(/[^\d.]/g, "")) || 0;
  const valid =
    value > 0 && address.length >= 12 && usage && source && /^\S+@\S+\.\S+$/.test(email);

  /* ---------- Confirmation ---------- */
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

  /* ---------- Formulaire ---------- */
  return (
    <AppShell
      backTo="/app"
      header={
        <div>
          <h1 className="font-display text-[22px] font-semibold tracking-tight">Desk OTC</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Cotation sur mesure pour les gros volumes</p>
        </div>
      }
    >
      <div className="space-y-4 rounded-[16px] border border-border bg-card p-5">
        {/* Sens */}
        <div>
          <Label>Sens de l'opération</Label>
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
        </div>

        {/* Montant */}
        <div>
          <Label>Montant souhaité</Label>
          <div className="relative">
            <input
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              className={cn(fieldClass, "pr-16")}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">USDT</span>
          </div>
        </div>

        {/* Adresse */}
        <div>
          <Label>Adresse USDT</Label>
          <input
            type="text"
            spellCheck={false}
            autoCapitalize="none"
            placeholder="Votre adresse de réception / d'envoi"
            value={address}
            onChange={(e) => setAddress(e.target.value.trim())}
            className={cn(fieldClass, "font-mono")}
          />
        </div>

        {/* Usage des fonds */}
        <div>
          <Label>Usage prévu des fonds</Label>
          <select value={usage} onChange={(e) => setUsage(e.target.value)} className={cn(fieldClass, !usage && "text-muted-foreground/60")}>
            <option value="" disabled>Sélectionnez…</option>
            {USAGES.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        {/* Provenance des fonds */}
        <div>
          <Label>Provenance des fonds</Label>
          <select value={source} onChange={(e) => setSource(e.target.value)} className={cn(fieldClass, !source && "text-muted-foreground/60")}>
            <option value="" disabled>Sélectionnez…</option>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Contact */}
        <div>
          <Label>E-mail de contact</Label>
          <input
            type="email"
            spellCheck={false}
            autoCapitalize="none"
            placeholder="vous@exemple.ca"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            className={fieldClass}
          />
        </div>
      </div>

      <p className="mt-3 px-1 text-xs text-muted-foreground">
        Informations demandées pour la conformité (vérification de la provenance des fonds).
      </p>

      <div className="mt-5 flex justify-end">
        <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" disabled={!valid} onClick={() => setSent(true)}>
          <Handshake className="h-[17px] w-[17px]" strokeWidth={2} /> Demander un devis
        </Button>
      </div>
    </AppShell>
  );
};

export default AppOTC;
