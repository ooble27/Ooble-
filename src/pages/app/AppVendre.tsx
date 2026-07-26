import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, HandCoins, Check, Mail, AlertTriangle, MessageSquare } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import AppShell from "@/components/app/AppShell";
import CopyRow from "@/components/app/CopyRow";
import { Button } from "@/components/ui/button";
import { NETWORKS, type NetId } from "@/components/app/networks";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { createOrder, orderRef } from "@/lib/orders";
import { sendEmail } from "@/lib/email";
import { getMyProfile } from "@/lib/profile";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Unit = "USDT" | "CAD";
type Step = "amount" | "reception" | "network" | "deposit" | "done";

const MIN_USDT = 50;

const OOBLE_DEPOSIT: Record<NetId, string> = {
  trx: "TSPUk2W5bcGGNPpKzx1xTDc2NuxpRJRCBb",
  bnb: "0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84",
  eth: "0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84",
  matic: "0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84",
  sol: "8ES2hxsfqZVX3cjxWLBJ8jCdzSu9hTBYELSkX82UdnhN",
  avax: "0xe1d04ef9b4c199ba6a59460ed8bd0a486dc4fc84",
};

const nfCad = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const nfUsdt = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 });

const StepHeader = ({ title, sub, onBack }: { title: string; sub: string; onBack?: () => void }) => (
  <div className="mb-4 flex items-start gap-3">
    {onBack && (
      <button
        type="button"
        onClick={onBack}
        aria-label="Retour"
        className="mt-0.5 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/70 active:scale-95"
      >
        <ArrowLeft className="h-[18px] w-[18px]" />
      </button>
    )}
    <div>
      <h1 className="font-display text-[18px] font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-[13px] text-muted-foreground">{sub}</p>
    </div>
  </div>
);

const AppVendre = () => {
  const rate = useUsdtRate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("amount");
  const [unit, setUnit] = useState<Unit>("USDT");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [net, setNet] = useState<NetId | null>(null);
  const [savedRef, setSavedRef] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [interacQA, setInteracQA] = useState<{ q: string; a: string } | null>(null);

  useEffect(() => {
    getMyProfile().then((p) => {
      if (p?.interacQuestion && p?.interacAnswer) {
        setInteracQA({ q: p.interacQuestion, a: p.interacAnswer });
      }
    });
  }, []);

  const value = parseFloat(amount.replace(",", ".")) || 0;
  const usdt = unit === "USDT" ? value : value / rate.sell;
  const cad = unit === "USDT" ? value * rate.sell : value;
  const belowMin = usdt > 0 && usdt < MIN_USDT;
  const network = NETWORKS.find((n) => n.id === net) ?? null;
  const depositAddr = net ? OOBLE_DEPOSIT[net] : "";

  const submit = async () => {
    if (saving) return;
    setSaving(true);
    setErr(null);
    const res = await createOrder({
      side: "sell",
      cad,
      usdt,
      rate: rate.sell,
      network: net ?? undefined,
      interacEmail: email,
    });
    setSaving(false);
    if ("error" in res) {
      setErr(res.error);
      return;
    }
    const ref = orderRef(res.id);
    setSavedRef(ref);
    setStep("done");

    const to = user?.email || email;
    if (to) {
      void sendEmail({
        to,
        template: "order-sell",
        vars: {
          ref,
          usdtAmount: nfUsdt.format(usdt),
          cadAmount: nfCad.format(cad),
          network: network ? `${network.name} · ${network.tag}` : "—",
          depositAddress: depositAddr,
          orderUrl: `${window.location.origin}/app`,
        },
      });
    }
  };

  /* ---------- Montant ---------- */
  if (step === "amount") {
    return (
      <AppShell center>
        <div className="mb-5">
          <h1 className="font-display text-[22px] font-semibold tracking-tight">Vendre USDT</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Entrez le montant que vous souhaitez vendre</p>
        </div>
        <div className="rounded-[20px] border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Montant</span>
            <div className="inline-flex gap-0.5 rounded-[10px] bg-secondary/70 p-[3px]">
              {(["USDT", "CAD"] as Unit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => { setUnit(u); setAmount(""); }}
                  className={cn(
                    "rounded-[7px] px-3 py-[5px] text-xs font-semibold transition-colors",
                    unit === u ? "bg-card text-foreground dark:bg-neutral-600" : "text-muted-foreground",
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <input
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
              className="w-full rounded-[14px] border border-border bg-secondary/40 py-[18px] pl-5 pr-[84px] text-[34px] font-bold tracking-[-1px] outline-none placeholder:text-muted-foreground/40"
            />
            <span className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-sm font-medium text-muted-foreground">
              {unit === "USDT" && <img src="/coins/usdt.svg" alt="" className="h-5 w-5" />}
              {unit}
            </span>
          </div>

          <p className={cn("mt-2 text-xs", belowMin ? "text-destructive" : "text-muted-foreground")}>Minimum : {MIN_USDT} USDT</p>
        </div>

        <div className="mt-3 flex flex-col gap-2.5 rounded-[16px] border border-border bg-card px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">Vous recevez</span>
            <span className="text-sm font-semibold">{nfCad.format(cad)} CAD</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">Taux</span>
            <span className="text-[13px] text-muted-foreground">1 USDT = {nfCad.format(rate.sell)} CAD</span>
          </div>
        </div>

        <div className="mt-3 flex justify-start">
          <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" disabled={value <= 0 || belowMin} onClick={() => setStep("reception")}>
            <HandCoins className="h-[17px] w-[17px]" strokeWidth={2} /> Continuer
          </Button>
        </div>
      </AppShell>
    );
  }

  /* ---------- Réception Interac ---------- */
  if (step === "reception") {
    return (
      <AppShell center>
        <StepHeader title="Réception" sub="Où envoyer vos dollars" onBack={() => setStep("amount")} />
        <div className="overflow-hidden rounded-[14px] border border-border bg-card">
          <div className="border-b border-border px-4 py-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">E-mail Interac e-Transfer</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-4">
            <Mail className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.9} />
            <input
              type="email"
              spellCheck={false}
              autoCapitalize="none"
              placeholder="vous@exemple.ca"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
        <p className="mt-3 px-1 text-[13px] text-muted-foreground">
          Vous recevrez <span className="font-semibold text-foreground">{nfCad.format(cad)} CAD</span> par e-Transfer à cette adresse dès réception de vos USDT.
        </p>

        {/* Question / réponse Interac pour recevoir le virement */}
        {interacQA && (
          <div className="mt-4 overflow-hidden rounded-[14px] border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <MessageSquare className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Question de sécurité Interac</span>
            </div>
            <CopyRow label="Question" value={interacQA.q} />
            <CopyRow label="Réponse à entrer" value={interacQA.a} mono />
          </div>
        )}
        <p className="mt-2 px-1 text-[12px] text-muted-foreground">
          Utilisez cette réponse pour débloquer votre e-Transfer quand vous le recevrez.
        </p>

        <div className="mt-5 flex justify-start">
          <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" disabled={!/^\S+@\S+\.\S+$/.test(email)} onClick={() => setStep("network")}>
            <HandCoins className="h-[17px] w-[17px]" strokeWidth={2} /> Continuer
          </Button>
        </div>
      </AppShell>
    );
  }

  /* ---------- Choix du réseau ---------- */
  if (step === "network") {
    return (
      <AppShell center>
        <StepHeader title="Réseau" sub="Depuis quel réseau envoyez-vous vos USDT ?" onBack={() => setStep("reception")} />
        <div className="flex flex-wrap gap-2">
          {NETWORKS.map((n) => {
            const sel = net === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setNet(n.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border py-2 pl-2 pr-3.5 transition-colors active:scale-[0.98]",
                  sel ? "border-foreground bg-secondary" : "border-border bg-card",
                )}
              >
                <img src={`/coins/${n.id}.svg`} alt="" className="h-7 w-7 shrink-0 rounded-full" draggable={false} />
                <span className="whitespace-nowrap text-sm">{n.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-start">
          <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" disabled={!net} onClick={() => setStep("deposit")}>
            <HandCoins className="h-[17px] w-[17px]" strokeWidth={2} /> Continuer
          </Button>
        </div>
      </AppShell>
    );
  }

  /* ---------- Dépôt : envoyer les USDT à Ooble ---------- */
  if (step === "deposit") {
    return (
      <AppShell header={<StepHeader title="Envoyez vos USDT" sub="Transférez le montant exact à l'adresse ci-dessous" onBack={() => setStep("network")} />}>
        {/* QR code centré */}
        <div className="flex justify-center">
          <div className="rounded-2xl border border-border bg-white p-4">
            <QRCodeSVG value={depositAddr} size={180} level="M" />
          </div>
        </div>

        {/* Réseau + adresse de dépôt */}
        <div className="mt-4 overflow-hidden rounded-[14px] border border-border bg-card">
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-2.5">
            <img src={`/coins/${network?.id}.svg`} alt="" className="h-[26px] w-[26px] rounded-full" draggable={false} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{network?.name}</span>
            <span className="ml-auto text-[11px] font-medium text-muted-foreground">{network?.tag}</span>
          </div>
          <CopyRow label="Adresse de dépôt Ooble" value={depositAddr} mono />
          <CopyRow label="Montant exact à envoyer" value={`${nfUsdt.format(usdt)} USDT`} />
        </div>

        {/* Avertissement réseau */}
        <div className="mt-3 flex items-start gap-2.5 rounded-[12px] border border-amber-300/60 bg-amber-50 px-4 py-3 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={2} />
          <p className="text-[12.5px] leading-snug text-amber-800 dark:text-amber-200">
            Envoyez uniquement de l'USDT sur le réseau <strong>{network?.tag}</strong>. Un autre réseau entraînerait la perte des fonds.
          </p>
        </div>

        <p className="mt-3 px-1 text-[13px] text-muted-foreground">
          Une fois le transfert effectué, confirmez ci-dessous. Nous créditons vos{" "}
          <span className="font-semibold text-foreground">{nfCad.format(cad)} CAD</span> par Interac dès réception.
        </p>

        {err && <p className="mt-3 text-[13px] text-destructive">{err}</p>}

        <div className="mt-6 flex justify-start">
          <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" disabled={saving} onClick={submit}>
            <Check className="h-[17px] w-[17px]" strokeWidth={2} /> {saving ? "Enregistrement…" : "J'ai envoyé mes USDT"}
          </Button>
        </div>
      </AppShell>
    );
  }

  /* ---------- Confirmation : en attente de réception ---------- */
  return (
    <AppShell header={<StepHeader title="USDT envoyés" sub="En attente de confirmation" />}>
      <div className="mb-4 flex items-start gap-2.5 rounded-[14px] border border-border bg-secondary/40 px-4 py-3.5">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <Check className="h-[14px] w-[14px]" strokeWidth={2.5} />
        </span>
        <p className="text-[13px] leading-snug text-muted-foreground">
          Nous vérifions la réception de vos USDT sur la blockchain. Dès confirmation, vous recevez{" "}
          <span className="font-semibold text-foreground">{nfCad.format(cad)} CAD</span> par Interac e-Transfer.
        </p>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-border bg-card">
        {[
          { label: "Vous envoyez", value: `${nfUsdt.format(usdt)} USDT` },
          { label: "Vous recevez", value: `${nfCad.format(cad)} CAD` },
          { label: "Réseau", value: network ? `${network.name} · ${network.tag}` : "—" },
          { label: "Taux", value: `1 USDT = ${nfCad.format(rate.sell)} CAD` },
          { label: "Reçu par Interac", value: email, mono: true },
        ].map((r, i, arr) => (
          <div key={r.label} className={cn("flex items-center justify-between px-4 py-[14px]", i < arr.length - 1 && "border-b border-border")}>
            <span className="text-[13px] text-muted-foreground">{r.label}</span>
            <span className={cn("max-w-[60%] break-all text-right text-[13px] font-medium", r.mono && "font-mono text-[11px]")}>{r.value}</span>
          </div>
        ))}
      </div>

      <p className="mb-2 mt-5 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Détail de l'ordre</p>
      <div className="divide-y divide-border overflow-hidden rounded-[16px] border border-border bg-card">
        <CopyRow label="Montant envoyé" value={`${nfUsdt.format(usdt)} USDT`} />
        <CopyRow label="Référence de l'ordre" value={savedRef} mono />
      </div>

      <div className="mt-6 flex justify-start gap-2.5">
        <Button variant="appPrimary" shape="soft" className="h-auto gap-2 px-[22px] py-[13px] text-sm" asChild>
          <Link to="/app"><Check className="h-[17px] w-[17px]" strokeWidth={2} /> Terminé</Link>
        </Button>
        <Button variant="ghost" shape="soft" className="h-auto px-[22px] py-[13px] text-sm" onClick={() => { setStep("amount"); setAmount(""); setEmail(""); setNet(null); setSavedRef(""); setErr(null); }}>
          Nouvel ordre
        </Button>
      </div>
    </AppShell>
  );
};

export default AppVendre;
