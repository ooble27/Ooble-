import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  KeyRound,
  Layers,
  Send,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCard from "@/components/HeroCard";
import { formatCad } from "@/lib/rates";

const features = [
  {
    icon: KeyRound,
    title: "Non-custodial",
    desc: "Aucun solde conservé. Chaque ordre est réglé directement vers votre wallet ou votre compte bancaire.",
  },
  {
    icon: Layers,
    title: "Multi-réseaux",
    desc: "Recevez vos USDT sur TRC20 (Tron) pour des frais bas, ou ERC20 (Ethereum) pour la compatibilité.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité & KYC",
    desc: "Vérification d'identité et conformité canadienne pour protéger vos fonds à chaque transaction.",
  },
];

const steps = [
  { n: "1", title: "Créez votre compte", desc: "Inscrivez-vous et vérifiez votre identité en quelques minutes, une seule fois." },
  { n: "2", title: "Créez votre ordre", desc: "Entrez le montant, choisissez le réseau et votre destination. Le taux se verrouille." },
  { n: "3", title: "Réglé directement", desc: "Vos USDT arrivent dans votre wallet, ou vos CAD dans votre compte Interac." },
];

const faqs = [
  { q: "Qu'est-ce que « non-custodial » veut dire ?", a: "Ooble ne conserve aucun solde. À l'achat, les USDT sont envoyés directement sur votre adresse wallet ; à la vente, le paiement CAD part directement vers votre compte via Interac. Vos fonds ne dorment jamais sur la plateforme." },
  { q: "Comment acheter des USDT ?", a: "Entrez le montant en CAD, choisissez votre réseau et votre adresse wallet, puis payez par Interac e-Transfer. Vos USDT arrivent en quelques minutes." },
  { q: "Quels réseaux sont supportés ?", a: "TRC20 (Tron) pour des frais très bas, et ERC20 (Ethereum) pour une compatibilité maximale avec les wallets." },
  { q: "Comment vendre mes USDT ?", a: "Indiquez le montant, votre réseau d'envoi et votre courriel Interac. Vous recevez votre paiement CAD dès la confirmation on-chain." },
  { q: "Quels sont les frais ?", a: "Le taux affiché inclut la marge d'Ooble — ce que vous voyez est ce que vous obtenez. Aucun frais surprise." },
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
          <div className="bg-wash absolute inset-0" aria-hidden />
          <Wrap className="relative grid items-center gap-14 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-16">
            <div className="animate-up">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Non-custodial · Interac e-Transfer · 🇨🇦
              </span>
              <h1 className="mt-6 font-display text-[2.7rem] font-extrabold leading-[1.05] tracking-tight sm:text-[3.4rem]">
                Achetez des USDT,
                <br />
                gardez vos clés.
              </h1>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted-foreground">
                La façon la plus simple d'acheter et de vendre des USDT en
                dollars canadiens. Payez par Interac, recevez directement dans
                votre wallet — aucun solde ne dort chez Ooble.
              </p>

              {/* Capture façon Finpay */}
              <div className="mt-7 flex max-w-md flex-col gap-2.5 sm:flex-row">
                <input
                  type="email"
                  placeholder="Votre adresse courriel"
                  className="h-12 flex-1 rounded-xl border bg-card px-4 text-sm outline-none ring-1 ring-transparent transition-all focus:ring-primary"
                />
                <Link
                  to="/acheter"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-teal transition-transform hover:-translate-y-0.5"
                >
                  Commencer <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Compatible avec
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-2 text-[15px] font-bold text-foreground/45">
                  <span>Interac</span>
                  <span>Tron</span>
                  <span>Ethereum</span>
                  <span>MetaMask</span>
                  <span>Ledger</span>
                </div>
              </div>
            </div>

            <div className="flex animate-up justify-center lg:justify-end">
              <HeroCard />
            </div>
          </Wrap>
        </section>

        {/* ===== FEATURES (grande carte blanche) ===== */}
        <section className="bg-muted/60 py-16 lg:py-24">
          <Wrap>
            <div className="rounded-[32px] border bg-card p-8 shadow-soft sm:p-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                    Pensé pour durer
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                    Une expérience qui grandit avec vous
                  </h2>
                </div>
                <p className="self-end text-[15px] leading-relaxed text-muted-foreground">
                  Un système simple pour acheter et vendre vos USDT en dollars
                  canadiens, conçu autour d'un principe : vos fonds restent à
                  vous, à chaque étape.
                </p>
              </div>

              <div className="mt-12 grid gap-8 border-t pt-10 sm:grid-cols-3">
                {features.map(({ icon: Icon, title, desc }) => (
                  <div key={title}>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-tint text-accent-ink">
                      <Icon className="h-5 w-5" strokeWidth={1.9} />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== POURQUOI (bento) ===== */}
        <section className="py-16 lg:py-24">
          <Wrap>
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Pourquoi Ooble
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
                Ce qui fait la différence
              </h2>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {/* Grand stat */}
              <div className="flex flex-col justify-between rounded-[28px] bg-muted/70 p-8">
                <p className="font-display text-6xl font-extrabold tracking-tight text-primary">1 200+</p>
                <p className="mt-6 text-[15px] font-medium leading-relaxed">
                  Ordres déjà réglés directement vers des wallets canadiens.
                </p>
              </div>

              {/* Règlement direct */}
              <div className="flex flex-col justify-between rounded-[28px] bg-muted/70 p-8">
                <h3 className="font-display text-xl font-bold leading-snug">
                  Réglé directement vers votre wallet, à tout moment.
                </h3>
                <div className="mt-8 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Send className="h-5 w-5" />
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-deep text-white">
                    <KeyRound className="h-5 w-5" />
                  </span>
                </div>
              </div>

              {/* Taux transparent + graphe */}
              <div className="flex flex-col justify-between rounded-[28px] bg-muted/70 p-8">
                <div>
                  <h3 className="font-display text-xl font-bold">Taux transparent</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    1 USDT = {formatCad(1.4245)} · verrouillé 15 min
                  </p>
                </div>
                <svg viewBox="0 0 220 70" className="mt-6 w-full" fill="none" preserveAspectRatio="none">
                  <path
                    d="M0 58 L30 50 L60 54 L90 38 L120 42 L150 26 L180 30 L220 12"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0 58 L30 50 L60 54 L90 38 L120 42 L150 26 L180 30 L220 12 V70 H0 Z"
                    fill="hsl(var(--primary) / 0.1)"
                  />
                </svg>
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== ÉTAPES (panneau pétrole) ===== */}
        <section id="comment" className="py-4">
          <Wrap>
            <div className="rounded-[36px] bg-deep px-8 py-16 text-deep-foreground sm:px-12 sm:py-20">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Comment ça marche
              </p>
              <h2 className="mt-3 max-w-xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Achetez vos premiers USDT en trois étapes.
              </h2>

              <div className="mt-12 grid gap-5 sm:grid-cols-3">
                {steps.map(({ n, title, desc }) => (
                  <div key={n} className="rounded-[24px] bg-white/[0.06] p-6 ring-1 ring-white/10">
                    <p className="font-display text-5xl font-extrabold text-white/25">{n}</p>
                    <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== STATS MISSION ===== */}
        <section className="py-16 lg:py-24">
          <Wrap className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Notre promesse
            </p>
            <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
              Un échange transparent, sans détour
            </h2>
            <div className="mx-auto mt-12 grid max-w-3xl gap-10 sm:grid-cols-3">
              {[
                { big: "0 $", label: "Solde conservé sur la plateforme" },
                { big: "15 min", label: "Taux garanti à chaque ordre" },
                { big: "~4 min", label: "Règlement moyen après paiement" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{s.big}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== DEUX FAÇONS (cartes façon plans) ===== */}
        <section className="pb-16 lg:pb-24">
          <Wrap>
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Deux façons d'échanger
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
                Acheter ou vendre, en quelques minutes
              </h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {/* Acheter (clair) */}
              <Link
                to="/acheter"
                className="group rounded-[28px] border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold">Acheter</h3>
                    <p className="mt-1 text-sm text-muted-foreground">CAD → USDT</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  Payez en dollars canadiens par Interac et recevez vos USDT
                  directement sur votre wallet.
                </p>
              </Link>

              {/* Vendre (pétrole) */}
              <Link
                to="/vendre"
                className="group relative overflow-hidden rounded-[28px] bg-deep p-8 text-deep-foreground shadow-lift transition-all hover:-translate-y-1"
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/25 blur-2xl"
                  aria-hidden
                />
                <div className="relative flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold">Vendre</h3>
                    <p className="mt-1 text-sm text-white/60">USDT → CAD</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
                <p className="relative mt-6 text-sm leading-relaxed text-white/70">
                  Envoyez vos USDT et recevez un Interac e-Transfer dans votre
                  compte, dès la confirmation on-chain.
                </p>
              </Link>
            </div>
          </Wrap>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="bg-muted/60 py-16 lg:py-24">
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

        {/* ===== CTA (pétrole) ===== */}
        <section className="py-16 lg:py-24">
          <Wrap>
            <div className="relative overflow-hidden rounded-[36px] bg-deep px-8 py-16 text-deep-foreground sm:px-12">
              <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" aria-hidden />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-[2.7rem]">
                    Prêt à échanger vos premiers USDT ?
                  </h2>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                    Créez un ordre en quelques minutes. Vos fonds vont
                    directement là où ils doivent aller : chez vous.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Link
                    to="/acheter"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    Commencer <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/vendre"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
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
