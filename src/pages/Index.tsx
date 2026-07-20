import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  KeyRound,
  Layers,
  Lock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Converter from "@/components/Converter";
import TetherMark from "@/components/TetherMark";

const marquee = [
  "Interac e-Transfer",
  "USDT",
  "Tron · TRC20",
  "Ethereum · ERC20",
  "MetaMask",
  "Trust Wallet",
  "Ledger",
  "Dollar canadien",
];

const steps = [
  { n: "1", title: "Créez votre compte", desc: "Inscription en quelques secondes et vérification d'identité rapide, une seule fois." },
  { n: "2", title: "Choisissez votre ordre", desc: "Achat ou vente : entrez le montant, le réseau et votre destination. Le taux se verrouille." },
  { n: "3", title: "Réglé directement", desc: "Vos USDT arrivent dans votre wallet, ou vos CAD dans votre compte Interac. Rien ne reste chez nous." },
];

const faqs = [
  { q: "Qu'est-ce que « non-custodial » veut dire ?", a: "Ooble ne conserve aucun solde. À l'achat, les USDT sont envoyés directement sur votre adresse wallet ; à la vente, le paiement CAD part directement vers votre compte via Interac. Vos fonds ne dorment jamais sur la plateforme." },
  { q: "Comment acheter des USDT ?", a: "Entrez le montant en CAD, choisissez votre réseau et votre adresse wallet, puis payez par Interac e-Transfer. Vos USDT arrivent en quelques minutes." },
  { q: "Quels réseaux sont supportés ?", a: "TRC20 (Tron) pour des frais très bas, et ERC20 (Ethereum) pour une compatibilité maximale avec les wallets." },
  { q: "Comment vendre mes USDT ?", a: "Indiquez le montant, votre réseau d'envoi et votre courriel Interac. Vous recevez votre paiement CAD dès la confirmation on-chain." },
  { q: "Quels sont les frais ?", a: "Le taux affiché inclut la marge d'Ooble — ce que vous voyez est ce que vous obtenez. Aucun frais surprise." },
  { q: "Pourquoi vérifier mon identité ?", a: "L'échange entre dollars canadiens et cryptoactifs est encadré au Canada (FINTRAC). La vérification est obligatoire et se fait une seule fois." },
];

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1120px] px-6 sm:px-8 ${className}`}>{children}</div>
);

const Index = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <div className="bg-mesh absolute inset-0" aria-hidden />
          <div className="bg-grid-soft absolute inset-0" aria-hidden />
          <Wrap className="relative grid items-center gap-14 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-20">
            <div className="animate-up">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Non-custodial · Interac e-Transfer · 🇨🇦
              </span>
              <h1 className="mt-6 font-display text-[2.7rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
                Achetez des USDT,
                <br />
                <span className="text-primary">gardez vos clés.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                La façon la plus simple d'acheter et de vendre des USDT en
                dollars canadiens. Payez par Interac, recevez directement dans
                votre wallet — aucun solde ne dort chez Ooble.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/acheter"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-green transition-transform hover:-translate-y-0.5"
                >
                  Acheter des USDT <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/vendre"
                  className="inline-flex items-center gap-2 rounded-full border bg-card px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  Vendre des USDT
                </Link>
              </div>
              <div className="mt-9 flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Identité vérifiée
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" /> Taux verrouillé
                </span>
              </div>
            </div>

            <div className="flex animate-up justify-center lg:justify-end">
              <Converter />
            </div>
          </Wrap>

          {/* Marquee */}
          <div className="relative border-y bg-card/60 py-4">
            <div className="mask-fade-x flex overflow-hidden">
              <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
                {[...marquee, ...marquee].map((item, i) => (
                  <span key={i} className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== BENTO ===== */}
        <section className="py-20 lg:py-28">
          <Wrap>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                Pourquoi Ooble
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
                Tout ce qu'il vous faut, rien qui traîne
              </h2>
            </div>

            <div className="mt-12 grid auto-rows-[minmax(0,1fr)] gap-4 md:grid-cols-3">
              {/* Grande carte : non-custodial */}
              <div className="relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-primary p-8 text-primary-foreground shadow-green md:col-span-2 md:row-span-2">
                <div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <KeyRound className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold sm:text-3xl">
                    100 % non-custodial
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-primary-foreground/85">
                    Ooble ne détient jamais vos fonds. Chaque ordre est réglé
                    directement vers votre wallet ou votre compte bancaire.
                    Pas de solde, pas de risque de gel — vos clés, vos fonds.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {["Aucun dépôt", "Aucun solde", "Ordre par ordre"].map((t) => (
                    <span key={t} className="rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-medium">
                      {t}
                    </span>
                  ))}
                </div>
                <div
                  className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
                  aria-hidden
                />
              </div>

              {/* Interac */}
              <div className="rounded-[28px] border bg-card p-7 shadow-soft">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                  <Zap className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">Interac e-Transfer</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Payez et soyez payé avec l'outil que votre banque connaît déjà.
                </p>
              </div>

              {/* Taux */}
              <div className="rounded-[28px] border bg-card p-7 shadow-soft">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                  <Lock className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">Taux verrouillé 15 min</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Le prix affiché est garanti le temps de payer. Zéro mauvaise surprise.
                </p>
              </div>

              {/* Réseaux */}
              <div className="flex flex-col justify-between rounded-[28px] border bg-card p-7 shadow-soft">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                  <Layers className="h-5 w-5" />
                </span>
                <div className="mt-5">
                  <h3 className="font-display text-lg font-bold">Multi-réseaux</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Recevez vos USDT sur TRC20 (Tron) ou ERC20 (Ethereum).
                  </p>
                </div>
              </div>

              {/* Rapidité */}
              <div className="rounded-[28px] border bg-card p-7 shadow-soft">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                  <Clock className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">Réglé en minutes</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Dès la confirmation du paiement, votre règlement part aussitôt.
                </p>
              </div>

              {/* Sécurité */}
              <div className="rounded-[28px] border bg-card p-7 shadow-soft">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">Sécurité & KYC</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Vérification d'identité et conformité canadienne pour protéger vos fonds.
                </p>
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== BANDE STATS ===== */}
        <section className="pb-20 lg:pb-28">
          <Wrap>
            <div className="rounded-[32px] bg-foreground px-8 py-14 text-background sm:px-12">
              <div className="grid gap-10 sm:grid-cols-3">
                {[
                  { big: "0 $", label: "Solde conservé sur la plateforme" },
                  { big: "15 min", label: "Taux garanti à chaque ordre" },
                  { big: "~4 min", label: "Règlement moyen après paiement" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                      {s.big}
                    </p>
                    <p className="mt-2 text-sm text-background/70">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== COMMENT ÇA MARCHE ===== */}
        <section id="comment" className="border-t bg-secondary/40 py-20 lg:py-28">
          <Wrap>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                Comment ça marche
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
                Trois étapes, réglé directement
              </h2>
            </div>
            <div className="relative mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-3">
              {steps.map((step) => (
                <div key={step.n} className="rounded-[28px] border bg-card p-7 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-display text-lg font-bold text-primary-foreground">
                    {step.n}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== TRANSPARENCE ===== */}
        <section className="py-20 lg:py-28">
          <Wrap className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                Transparence
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-[2.6rem]">
                Chaque ordre, un reçu vérifiable
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
                Un ordre Ooble n'a pas de zone grise. Le taux, le montant, le
                réseau et le règlement final sont visibles et vérifiables
                directement on-chain.
              </p>
              <ul className="mt-7 space-y-4">
                {["Taux verrouillé affiché avant de payer", "Suivi de l'ordre en temps réel", "Hash de transaction comme preuve"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[32px] border bg-card p-6 shadow-lift sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <TetherMark className="h-8 w-8" />
                  <p className="font-display font-bold">Reçu de règlement</p>
                </div>
                <span className="rounded-full bg-accent-tint px-3 py-1 text-xs font-semibold text-accent-ink">
                  Complété
                </span>
              </div>
              <dl className="mt-6 space-y-4 text-sm">
                {[
                  ["Montant payé", "500,00 $ CAD"],
                  ["Taux verrouillé", "1,4245 $ / USDT"],
                  ["USDT reçus", "351,00 USDT"],
                  ["Réseau", "TRC20 · Tron"],
                  ["Destination", "T•••92e"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b border-dashed pb-4 last:border-0 last:pb-0">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex items-center gap-2 rounded-2xl bg-secondary/70 px-4 py-3 text-xs text-muted-foreground">
                <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                Vérifiable sur la blockchain — tx 7f3a2b…c92e
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="border-t bg-secondary/40 py-20 lg:py-28">
          <Wrap className="max-w-[760px]">
            <h2 className="text-center font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
              Questions fréquentes
            </h2>
            <div className="mt-12">
              {faqs.map((item, i) => {
                const open = faqOpen === i;
                return (
                  <div key={i} className="border-b">
                    <button
                      onClick={() => setFaqOpen(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className={`font-display font-semibold ${open ? "text-foreground" : "text-foreground/80"}`}>
                        {item.q}
                      </span>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card shadow-soft transition-transform ${open ? "rotate-180" : ""}`}>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </span>
                    </button>
                    {open && <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>}
                  </div>
                );
              })}
            </div>
          </Wrap>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-20 lg:py-28">
          <Wrap>
            <div className="relative overflow-hidden rounded-[36px] bg-primary px-8 py-16 text-center text-primary-foreground shadow-green sm:py-20">
              <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden />
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
                  Prêt pour votre premier ordre ?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-lg text-primary-foreground/85">
                  Créez un ordre en quelques minutes. Vos fonds vont directement
                  là où ils doivent aller : chez vous.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/acheter"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
                  >
                    Acheter des USDT <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/vendre"
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Vendre des USDT
                  </Link>
                </div>
              </div>
            </div>
          </Wrap>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
