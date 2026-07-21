import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  KeyRound,
  Lock,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCard from "@/components/HeroCard";
import AppMockup from "@/components/AppMockup";
import { Button } from "@/components/ui/button";
import TetherMark from "@/components/TetherMark";
import { EthereumMark, MapleLeaf, TransferMark, TronMark } from "@/components/marks";
import { formatCad } from "@/lib/rates";

const compat = [
  { label: "Interac", mark: <TransferMark className="h-4 w-4 text-primary" /> },
  { label: "Tether", mark: <TetherMark className="h-4 w-4" /> },
  { label: "Tron", mark: <TronMark className="h-4 w-4 text-[#EF4444]" /> },
  { label: "Ethereum", mark: <EthereumMark className="h-4 w-4 text-[#627EEA]" /> },
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

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{children}</p>
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
                <MapleLeaf className="h-3.5 w-3.5 text-[#EF4444]" />
                Non-custodial · Interac e-Transfer · Fait pour le Canada
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

              <div className="mt-7 flex max-w-md flex-col gap-2.5 sm:flex-row">
                <input
                  type="email"
                  placeholder="Votre adresse courriel"
                  className="h-12 flex-1 rounded-xl border bg-card px-4 text-sm outline-none ring-1 ring-transparent transition-all placeholder:text-muted-foreground focus:ring-primary"
                />
                <Button asChild variant="primary" shape="rounded" size="lg">
                  <Link to="/acheter">
                    Commencer <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Compatible avec
                </p>
                <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                  {compat.map((c) => (
                    <span
                      key={c.label}
                      className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-[13px] font-semibold text-foreground/70 shadow-soft"
                    >
                      {c.mark}
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex animate-up justify-center lg:justify-end">
              <HeroCard />
            </div>
          </Wrap>
        </section>

        {/* ===== FEATURES (cartes avec visuels) ===== */}
        <section className="py-16 lg:py-24">
          <Wrap>
            <div className="max-w-2xl">
              <Eyebrow>Pensé pour vos USDT</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
                Une expérience conçue autour de vos fonds
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {/* Non-custodial — diagramme de flux */}
              <div className="overflow-hidden rounded-[26px] border bg-card shadow-soft">
                <div className="bg-gradient-to-br from-accent-tint/70 to-secondary/40 p-6">
                  <div className="flex items-center justify-between rounded-2xl bg-card/80 p-3.5 shadow-soft ring-1 ring-border/60 backdrop-blur">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                        <MapleLeaf className="h-4 w-4 text-[#EF4444]" />
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">Vous</span>
                    </div>
                    <div className="flex flex-1 items-center px-2">
                      <span className="h-px flex-1 bg-gradient-to-r from-primary/50 to-primary/50 [mask-image:repeating-linear-gradient(90deg,#000_0_5px,transparent_5px_10px)]" />
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <KeyRound className="h-4 w-4" />
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">Wallet</span>
                    </div>
                  </div>
                  <p className="mt-3 text-center text-[11px] font-medium text-accent-ink">
                    Aucun solde intermédiaire
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold">100 % non-custodial</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Vos fonds vont directement de vous à votre wallet. Ooble ne
                    conserve jamais de solde.
                  </p>
                </div>
              </div>

              {/* Multi-réseaux — sélecteur */}
              <div className="overflow-hidden rounded-[26px] border bg-card shadow-soft">
                <div className="space-y-2 bg-gradient-to-br from-accent-tint/70 to-secondary/40 p-6">
                  <div className="flex items-center justify-between rounded-xl bg-card p-3 shadow-soft ring-1 ring-primary/40">
                    <div className="flex items-center gap-2.5">
                      <TronMark className="h-6 w-6 text-[#EF4444]" />
                      <div>
                        <p className="text-xs font-bold">Tron</p>
                        <p className="text-[10px] text-muted-foreground">TRC20 · frais bas</p>
                      </div>
                    </div>
                    <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-card/70 p-3 ring-1 ring-border/60">
                    <div className="flex items-center gap-2.5">
                      <EthereumMark className="h-6 w-6 text-[#627EEA]" />
                      <div>
                        <p className="text-xs font-bold">Ethereum</p>
                        <p className="text-[10px] text-muted-foreground">ERC20 · partout</p>
                      </div>
                    </div>
                    <span className="h-4 w-4 rounded-full border-2 border-border" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold">Multi-réseaux</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Recevez vos USDT sur le réseau de votre choix, sélectionné à
                    la création de l'ordre.
                  </p>
                </div>
              </div>

              {/* Taux — graphe */}
              <div className="overflow-hidden rounded-[26px] border bg-card shadow-soft">
                <div className="relative bg-gradient-to-br from-accent-tint/70 to-secondary/40 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted-foreground">1 USDT</p>
                      <p className="font-display text-xl font-bold">{formatCad(1.4245)}</p>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-accent-ink">
                      <Lock className="h-3 w-3" /> 15 min
                    </span>
                  </div>
                  <svg viewBox="0 0 240 70" className="mt-3 w-full" fill="none" preserveAspectRatio="none">
                    <path
                      d="M0 56 L34 48 L68 52 L102 36 L136 40 L170 24 L204 28 L240 12"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M0 56 L34 48 L68 52 L102 36 L136 40 L170 24 L204 28 L240 12 V70 H0 Z"
                      fill="hsl(var(--primary) / 0.12)"
                    />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold">Taux verrouillé</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Le prix affiché est garanti 15 minutes, le temps de payer.
                    Zéro mauvaise surprise.
                  </p>
                </div>
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== SHOWCASE (app · pétrole) ===== */}
        <section className="py-4">
          <Wrap>
            <div className="relative overflow-hidden rounded-[36px] bg-deep px-8 py-14 text-deep-foreground sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden />
              <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
                <div>
                  <Eyebrow>L'application</Eyebrow>
                  <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                    Tout se passe dans une app claire et rapide
                  </h2>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                    Créez un ordre, suivez son statut en temps réel et recevez
                    votre reçu on-chain — le tout dans une interface pensée pour
                    aller à l'essentiel.
                  </p>
                  <ul className="mt-8 space-y-3.5">
                    {[
                      "Taux verrouillé affiché avant de payer",
                      "Suivi de l'ordre étape par étape",
                      "Reçu vérifiable directement sur la blockchain",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        <span className="text-sm text-white/85">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <Button asChild variant="primary" shape="rounded" size="lg">
                      <Link to="/acheter">
                        Acheter des USDT <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outlineOnDark" shape="rounded" size="lg">
                      <Link to="/vendre">Vendre des USDT</Link>
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <AppMockup />
                </div>
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== ÉTAPES ===== */}
        <section id="comment" className="py-16 lg:py-24">
          <Wrap>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Comment ça marche</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
                Trois étapes, réglé directement
              </h2>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              {steps.map(({ n, title, desc }, i) => (
                <div key={n} className="relative rounded-[26px] border bg-card p-7 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary font-display text-lg font-bold text-primary-foreground">
                      {n}
                    </span>
                    {i < steps.length - 1 && (
                      <span className="hidden h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent sm:block" />
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== STATS ===== */}
        <section className="pb-16 lg:pb-24">
          <Wrap>
            <div className="grid gap-px overflow-hidden rounded-[28px] border bg-border sm:grid-cols-3">
              {[
                { big: "0 $", label: "Solde conservé sur la plateforme" },
                { big: "15 min", label: "Taux garanti à chaque ordre" },
                { big: "~4 min", label: "Règlement moyen après paiement" },
              ].map((s) => (
                <div key={s.label} className="bg-card p-8 text-center">
                  <p className="font-display text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                    {s.big}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== DEUX FAÇONS ===== */}
        <section className="pb-16 lg:pb-24">
          <Wrap>
            <div className="text-center">
              <Eyebrow>Deux façons d'échanger</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
                Acheter ou vendre, en quelques minutes
              </h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <Link
                to="/acheter"
                className="group rounded-[28px] border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                      <TransferMark className="h-6 w-6 text-primary" />
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-bold">Acheter</h3>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">CAD → USDT</p>
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

              <Link
                to="/vendre"
                className="group relative overflow-hidden rounded-[28px] bg-deep p-8 text-deep-foreground shadow-lift transition-all hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/25 blur-2xl" aria-hidden />
                <div className="relative flex items-start justify-between">
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                      <TetherMark className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-bold">Vendre</h3>
                    <p className="mt-1 text-sm font-medium text-white/60">USDT → CAD</p>
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
          <Wrap className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Vous avez des questions ?
              </h2>
              <p className="mt-4 text-muted-foreground">
                L'essentiel à savoir avant votre premier ordre. Une autre
                question ? Écrivez-nous.
              </p>
              <div className="mt-8 flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-soft">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-tint text-accent-ink">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <p className="text-sm text-muted-foreground">
                  Plateforme vérifiée · conforme aux exigences canadiennes
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {faqs.map((item, i) => {
                const open = faqOpen === i;
                return (
                  <div
                    key={i}
                    className={`overflow-hidden rounded-2xl border bg-card shadow-soft transition-colors ${open ? "ring-1 ring-primary/30" : ""}`}
                  >
                    <button
                      onClick={() => setFaqOpen(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-display font-semibold">{item.q}</span>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${open ? "bg-primary text-primary-foreground rotate-180" : "bg-secondary text-muted-foreground"}`}>
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                    {open && (
                      <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Wrap>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-16 lg:py-24">
          <Wrap>
            <div className="relative overflow-hidden rounded-[36px] bg-deep px-8 py-16 text-deep-foreground sm:px-12">
              <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" aria-hidden />
              <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden />
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
                  <Button asChild variant="primary" shape="rounded" size="lg">
                    <Link to="/acheter">
                      Commencer <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outlineOnDark" shape="rounded" size="lg">
                    <Link to="/vendre">Vendre des USDT</Link>
                  </Button>
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
