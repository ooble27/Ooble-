import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Fingerprint,
  KeyRound,
  Landmark,
  Lock,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppMockup from "@/components/AppMockup";
import PriceCard from "@/components/PriceCard";
import Coin, { type CoinId } from "@/components/Coin";
import { Button } from "@/components/ui/button";
import { MapleLeaf, TransferMark } from "@/components/marks";

const networks: { id: CoinId; name: string; sub: string; note: string }[] = [
  { id: "trx", name: "Tron", sub: "TRC20", note: "Frais très bas et confirmation rapide — idéal au quotidien." },
  { id: "eth", name: "Ethereum", sub: "ERC20", note: "Compatible avec la grande majorité des wallets et services." },
];

const steps = [
  { n: "1", title: "Créez votre compte", desc: "Inscrivez-vous et vérifiez votre identité en quelques minutes, une seule fois." },
  { n: "2", title: "Créez votre ordre", desc: "Entrez le montant, choisissez le réseau et votre destination. Le taux se verrouille." },
  { n: "3", title: "Réglé directement", desc: "Vos USDT arrivent dans votre wallet, ou vos CAD dans votre compte Interac." },
];

const trust = [
  { icon: KeyRound, title: "Non-custodial", desc: "Aucun solde conservé. Vos fonds vont directement de vous à votre wallet." },
  { icon: Fingerprint, title: "Identité vérifiée", desc: "Un KYC simple et rapide protège chaque transaction et chaque utilisateur." },
  { icon: Landmark, title: "Conforme au Canada", desc: "Conçu autour des exigences canadiennes : conformité et tenue des dossiers." },
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
      {/* Bandeau d'annonce */}
      <div className="bg-deep text-deep-foreground">
        <Wrap className="flex items-center justify-center gap-2 py-2.5 text-center text-[13px]">
          <MapleLeaf className="h-3.5 w-3.5 text-[#EF4444]" />
          <span className="text-white/85">
            Ooble arrive au Canada — achetez et vendez vos USDT en dollars canadiens.
          </span>
        </Wrap>
      </div>

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

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild variant="primary" shape="rounded" size="lg">
                  <Link to="/acheter">
                    Acheter des USDT <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" shape="rounded" size="lg">
                  <Link to="/vendre">Vendre des USDT</Link>
                </Button>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <Coin id="usdt" size={26} />
                  <Coin id="trx" size={26} className="-ml-3" />
                  <Coin id="eth" size={26} className="-ml-3" />
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    USDT sur TRC20 &amp; ERC20
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-[13px] font-semibold text-foreground/70 shadow-soft">
                  <TransferMark className="h-4 w-4 text-primary" /> Interac
                </span>
              </div>
            </div>

            <div className="flex animate-up justify-center lg:justify-end">
              <PriceCard />
            </div>
          </Wrap>
        </section>

        {/* ===== RÉSEAUX ===== */}
        <section className="py-16 lg:py-24">
          <Wrap>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
              <div>
                <Eyebrow>Réseaux supportés</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                  Recevez vos USDT sur le réseau de votre choix
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Sélectionnez le réseau à la création de votre ordre. Les mêmes
                  USDT, livrés là où vous en avez besoin.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {networks.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-[24px] border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="flex items-center gap-3">
                      <Coin id={n.id} size={44} />
                      <div>
                        <p className="font-display text-lg font-bold leading-tight">{n.name}</p>
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                          {n.sub}
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{n.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== FEATURES (cartes avec visuels) ===== */}
        <section className="pb-16 lg:pb-24">
          <Wrap>
            <div className="max-w-2xl">
              <Eyebrow>Pensé pour vos USDT</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
                Une expérience conçue autour de vos fonds
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {/* Non-custodial — diagramme */}
              <div className="overflow-hidden rounded-[26px] border bg-card shadow-soft">
                <div className="bg-gradient-to-br from-accent-tint/70 to-secondary/40 p-6">
                  <div className="flex items-center justify-between rounded-2xl bg-card/90 p-3.5 shadow-soft ring-1 ring-border/60 backdrop-blur">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                        <MapleLeaf className="h-4 w-4 text-[#EF4444]" />
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">Vous</span>
                    </div>
                    <div className="flex flex-1 items-center px-2">
                      <span className="h-px flex-1 bg-primary/50 [mask-image:repeating-linear-gradient(90deg,#000_0_5px,transparent_5px_10px)]" />
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

              {/* Interac */}
              <div className="overflow-hidden rounded-[26px] border bg-card shadow-soft">
                <div className="bg-gradient-to-br from-accent-tint/70 to-secondary/40 p-6">
                  <div className="rounded-2xl bg-card/90 p-4 shadow-soft ring-1 ring-border/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        Méthode de paiement
                      </span>
                      <span className="text-[11px] font-semibold text-accent-ink">Sans frais</span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border border-primary/50 bg-accent-tint/40 px-3 py-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <TransferMark className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold">Interac e-Transfer</span>
                      <Check className="ml-auto h-4 w-4 text-primary" strokeWidth={3} />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold">Payé comme au Canada</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Interac e-Transfer à l'achat comme à la vente. L'outil que
                    votre banque connaît déjà.
                  </p>
                </div>
              </div>

              {/* Taux */}
              <div className="overflow-hidden rounded-[26px] border bg-card shadow-soft">
                <div className="bg-gradient-to-br from-accent-tint/70 to-secondary/40 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coin id="usdt" size={22} />
                      <span className="font-display text-xl font-bold">1,4245 $</span>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-accent-ink">
                      <Lock className="h-3 w-3" /> 15 min
                    </span>
                  </div>
                  <svg viewBox="0 0 240 66" className="mt-4 w-full" fill="none" preserveAspectRatio="none">
                    <path
                      d="M0 54 L34 46 L68 50 L102 34 L136 38 L170 22 L204 26 L240 10"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M0 54 L34 46 L68 50 L102 34 L136 38 L170 22 L204 26 L240 10 V66 H0 Z"
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

        {/* ===== APP (pétrole) ===== */}
        <section className="pb-16 lg:pb-24">
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

        {/* ===== COMMENT ÇA MARCHE ===== */}
        <section id="comment" className="pb-16 lg:pb-24">
          <Wrap>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Comment ça marche</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
                Trois étapes, réglé directement
              </h2>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              {steps.map(({ n, title, desc }, i) => (
                <div key={n} className="rounded-[26px] border bg-card p-7 shadow-soft">
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

        {/* ===== SÉCURITÉ / CONFIANCE ===== */}
        <section className="pb-16 lg:pb-24">
          <Wrap>
            <div className="rounded-[36px] border bg-gradient-to-br from-accent-tint/50 via-card to-card p-8 shadow-soft sm:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <Eyebrow>Sécurité &amp; conformité</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Une plateforme qui protège vos fonds
                </h2>
              </div>
              <div className="mt-12 grid gap-6 sm:grid-cols-3">
                {trust.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-soft ring-1 ring-border">
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

        {/* ===== DEUX FAÇONS ===== */}
        <section className="pb-16 lg:pb-24">
          <Wrap>
            <div className="grid gap-5 md:grid-cols-2">
              <Link
                to="/acheter"
                className="group rounded-[28px] border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-tint">
                      <TransferMark className="h-6 w-6 text-primary" />
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-bold">Acheter</h3>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">CAD → USDT</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
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
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Coin id="usdt" size={28} />
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
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${open ? "rotate-180 bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
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
