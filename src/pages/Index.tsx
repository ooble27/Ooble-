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
  Wallet,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderCard from "@/components/OrderCard";
import Coin from "@/components/Coin";
import { Button } from "@/components/ui/button";
import { InteracLogo } from "@/components/marks";

const features = [
  { icon: KeyRound, title: "Non-custodial", desc: "Aucun solde conservé. Vos fonds vont directement de vous à votre wallet, ordre par ordre." },
  { icon: Layers, title: "Multi-réseaux", desc: "Recevez vos USDT sur TRC20 (Tron) ou ERC20 (Ethereum), sélectionné à la création." },
  { icon: ShieldCheck, title: "Sécurité & KYC", desc: "Vérification d'identité et conformité canadienne pour protéger vos fonds." },
];

const steps = [
  { n: "1", title: "Créez votre compte", desc: "Inscription et vérification d'identité en quelques minutes, une seule fois." },
  { n: "2", title: "Créez votre ordre", desc: "Montant, réseau et destination — le taux se verrouille pour 15 minutes." },
  { n: "3", title: "Réglé directement", desc: "Vos USDT dans votre wallet, ou vos CAD dans votre compte Interac." },
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

const Eyebrow = ({ children, center }: { children: React.ReactNode; center?: boolean }) => (
  <p className={`text-[11px] font-bold uppercase tracking-[0.18em] text-primary ${center ? "text-center" : ""}`}>
    {children}
  </p>
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
          <Wrap className="relative grid items-center gap-12 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24 lg:pt-14">
            <div>
              <h1 className="font-display text-[2.7rem] font-bold leading-[1.05] tracking-tight sm:text-[3.4rem]">
                Achetez des USDT,
                <br />
                gardez vos clés.
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                Ooble vous permet d'acheter et de vendre des USDT en dollars
                canadiens par Interac e-Transfer. Non-custodial : vos fonds vont
                directement dans votre wallet.
              </p>

              <div className="mt-7 flex max-w-md flex-col gap-2.5 sm:flex-row">
                <input
                  type="email"
                  placeholder="Votre adresse courriel"
                  className="h-12 flex-1 rounded-[12px] border bg-card px-4 text-sm outline-none ring-1 ring-transparent transition-all placeholder:text-muted-foreground focus:ring-primary"
                />
                <Button asChild variant="primary" shape="rounded" size="lg">
                  <Link to="/acheter">
                    Commencer <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <Coin id="usdt" size={24} />
                  <span className="text-sm font-semibold text-foreground/70">Tether</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coin id="trx" size={24} />
                  <span className="text-sm font-semibold text-foreground/70">Tron</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coin id="eth" size={24} />
                  <span className="text-sm font-semibold text-foreground/70">Ethereum</span>
                </div>
                <InteracLogo className="text-[15px] text-foreground/70" />
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <OrderCard />
            </div>
          </Wrap>
        </section>

        {/* ===== EXPÉRIENCE (grande carte blanche) ===== */}
        <section className="bg-secondary/50 py-14 lg:py-20">
          <Wrap>
            <div className="rounded-[28px] bg-card p-8 shadow-soft sm:p-12">
              <Eyebrow>Pensé pour durer</Eyebrow>
              <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
                <h2 className="font-display text-[1.9rem] font-bold leading-tight tracking-tight sm:text-4xl">
                  Une expérience qui grandit avec vos USDT
                </h2>
                <p className="self-end text-[15px] leading-relaxed text-muted-foreground">
                  Un système simple pour acheter et vendre vos USDT en dollars
                  canadiens, construit autour d'un principe : vos fonds restent
                  à vous, à chaque étape.
                </p>
              </div>

              <div className="mt-12 grid gap-10 border-t pt-10 sm:grid-cols-3">
                {features.map(({ icon: Icon, title, desc }) => (
                  <div key={title}>
                    <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
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
              <Eyebrow center>Pourquoi Ooble</Eyebrow>
              <h2 className="mt-3 font-display text-[1.9rem] font-bold tracking-tight sm:text-[2.5rem]">
                Ce qui fait la différence
              </h2>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-5">
              {/* Stat */}
              <div className="flex flex-col justify-between rounded-[24px] bg-secondary/60 p-8 lg:col-span-2">
                <p className="font-display text-6xl font-bold tracking-tight text-primary">1 200+</p>
                <p className="mt-6 text-[15px] font-medium leading-relaxed">
                  Ordres déjà réglés directement vers des wallets canadiens.
                </p>
              </div>

              {/* Règlement instantané */}
              <div className="flex flex-col justify-between rounded-[24px] bg-secondary/60 p-8 lg:col-span-3">
                <h3 className="max-w-xs font-display text-xl font-bold leading-snug">
                  Réglé instantanément vers votre wallet, à tout moment
                </h3>
                <div className="mt-8 flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Send className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <span className="h-px flex-1 bg-[repeating-linear-gradient(90deg,hsl(var(--primary)/0.5)_0_6px,transparent_6px_12px)]" />
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-deep text-white">
                    <Wallet className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="rounded-[24px] bg-secondary/60 p-8 lg:col-span-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold">Un taux stable, sans volatilité cachée</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                      L'USDT suit le dollar américain. Le cours affiché en CAD
                      est verrouillé 15 minutes à chaque ordre.
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-card p-5 shadow-soft">
                    <div className="flex items-center justify-between gap-8">
                      <div>
                        <p className="text-[11px] text-muted-foreground">USDT / CAD</p>
                        <p className="font-display text-2xl font-bold">1,4245 $</p>
                      </div>
                      <span className="rounded-full border px-3 py-1 text-xs font-semibold text-muted-foreground">
                        6 mois
                      </span>
                    </div>
                    <svg viewBox="0 0 360 96" className="mt-4 w-[280px] max-w-full sm:w-[360px]" fill="none">
                      <path
                        d="M0 78 L45 70 L90 74 L135 54 L180 60 L225 40 L270 46 L315 26 L360 16"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M0 78 L45 70 L90 74 L135 54 L180 60 L225 40 L270 46 L315 26 L360 16 V96 H0 Z"
                        fill="hsl(var(--primary) / 0.1)"
                      />
                    </svg>
                    <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                      {["Fév", "Mar", "Avr", "Mai", "Juin", "Juil"].map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== COMMENT ÇA MARCHE (navy) ===== */}
        <section id="comment" className="bg-deep py-16 text-deep-foreground lg:py-24">
          <Wrap>
            <Eyebrow>Étapes</Eyebrow>
            <h2 className="mt-4 max-w-xl font-display text-[1.9rem] font-bold leading-tight tracking-tight sm:text-4xl">
              Achetez vos premiers USDT en trois étapes
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="relative overflow-hidden rounded-[20px] bg-white/[0.05] p-7 ring-1 ring-white/10">
                  <span className="pointer-events-none absolute -right-2 -top-4 font-display text-8xl font-bold text-white/[0.06]">
                    {n}
                  </span>
                  <h3 className="relative font-display text-lg font-bold">{title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-white/60">{desc}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== STATS ===== */}
        <section className="py-16 lg:py-24">
          <Wrap className="text-center">
            <Eyebrow center>Notre promesse</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-xl font-display text-[1.9rem] font-bold tracking-tight sm:text-[2.5rem]">
              Un échange transparent, sans détour
            </h2>
            <div className="mx-auto mt-12 grid max-w-3xl gap-10 sm:grid-cols-3">
              {[
                { big: "0 $", label: "Solde conservé sur la plateforme" },
                { big: "15 min", label: "Taux garanti à chaque ordre" },
                { big: "~4 min", label: "Règlement moyen après paiement" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{s.big}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== DEUX FAÇONS (plans) ===== */}
        <section className="pb-16 lg:pb-24">
          <Wrap>
            <div className="text-center">
              <Eyebrow center>Deux façons d'échanger</Eyebrow>
              <h2 className="mt-3 font-display text-[1.9rem] font-bold tracking-tight sm:text-[2.5rem]">
                Acheter ou vendre, en quelques minutes
              </h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {/* Acheter */}
              <Link
                to="/acheter"
                className="group flex flex-col justify-between rounded-[24px] bg-secondary/60 p-8 transition-all hover:-translate-y-1"
              >
                <div>
                  <h3 className="font-display text-2xl font-bold">Acheter</h3>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">CAD → USDT</p>
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    Payez par Interac et recevez vos USDT directement sur votre
                    wallet.
                  </p>
                </div>
                <span className="mt-10 flex h-11 w-11 items-center justify-center self-end rounded-full bg-card text-foreground shadow-soft transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>

              {/* Vendre */}
              <Link
                to="/vendre"
                className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-primary p-8 text-primary-foreground transition-all hover:-translate-y-1"
              >
                <div className="bg-diagonal absolute inset-0" aria-hidden />
                <div className="relative">
                  <h3 className="font-display text-2xl font-bold">Vendre</h3>
                  <p className="mt-1 text-sm font-medium text-white/80">USDT → CAD</p>
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/85">
                    Envoyez vos USDT et recevez un Interac e-Transfer dans votre
                    compte, dès la confirmation.
                  </p>
                </div>
                <span className="relative mt-10 flex h-11 w-11 items-center justify-center self-end rounded-full bg-white text-primary">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </Wrap>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="border-t bg-secondary/40 py-16 lg:py-24">
          <Wrap className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-3 font-display text-[1.9rem] font-bold leading-tight tracking-tight sm:text-4xl">
                Vous avez des questions ?
              </h2>
              <p className="mt-4 text-muted-foreground">
                L'essentiel à savoir avant votre premier ordre. Une autre
                question ? Écrivez-nous.
              </p>
            </div>
            <div className="divide-y border-y">
              {faqs.map((item, i) => {
                const open = faqOpen === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setFaqOpen(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="font-display text-[15px] font-bold">{item.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <p className="-mt-1 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </Wrap>
        </section>

        {/* ===== CTA (navy) ===== */}
        <section className="py-16 lg:py-24">
          <Wrap>
            <div className="relative overflow-hidden rounded-[28px] bg-deep px-8 py-14 text-deep-foreground sm:px-12">
              <div className="bg-diagonal-dark absolute inset-0" aria-hidden />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <Eyebrow>Prêt ?</Eyebrow>
                  <h2 className="mt-4 font-display text-[1.9rem] font-bold leading-tight tracking-tight sm:text-[2.5rem]">
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
                    <Link to="/vendre">En savoir plus</Link>
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
