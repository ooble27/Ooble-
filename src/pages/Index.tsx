import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Fingerprint,
  KeyRound,
  Landmark,
  Lock,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppMockup from "@/components/AppMockup";
import Markets from "@/components/Markets";
import Coin, { type CoinId } from "@/components/Coin";
import { Button } from "@/components/ui/button";
import { InteracLogo, MapleLeaf } from "@/components/marks";
import { formatCad } from "@/lib/rates";

const marquee: { id: CoinId; name: string }[] = [
  { id: "usdt", name: "Tether" },
  { id: "trx", name: "Tron" },
  { id: "eth", name: "Ethereum" },
  { id: "btc", name: "Bitcoin" },
  { id: "usdc", name: "USD Coin" },
  { id: "sol", name: "Solana" },
  { id: "bnb", name: "BNB" },
  { id: "matic", name: "Polygon" },
];

const values = [
  { icon: KeyRound, title: "Non-custodial", desc: "Aucun solde conservé. Vos fonds vont directement de vous à votre wallet, ordre par ordre." },
  { icon: Lock, title: "Taux verrouillé", desc: "Le cours affiché est garanti 15 minutes, le temps de payer. Aucune mauvaise surprise." },
  { icon: Landmark, title: "Payé au Canada", desc: "Interac e-Transfer à l'achat comme à la vente, avec l'outil que votre banque connaît déjà." },
];

const steps = [
  { n: "01", title: "Créez votre compte", desc: "Inscription et vérification d'identité en quelques minutes, une seule fois." },
  { n: "02", title: "Créez votre ordre", desc: "Montant, réseau, destination — le taux se verrouille pour 15 minutes." },
  { n: "03", title: "Réglé directement", desc: "Vos USDT dans votre wallet, ou vos CAD dans votre compte Interac." },
];

const trust = [
  { icon: KeyRound, title: "Non-custodial", desc: "Aucun solde conservé — vos fonds vont directement à votre wallet." },
  { icon: Fingerprint, title: "Identité vérifiée", desc: "Un KYC simple et rapide protège chaque transaction et chaque utilisateur." },
  { icon: Landmark, title: "Conforme au Canada", desc: "Conçu autour des exigences canadiennes et de la tenue des dossiers." },
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

/** Anneaux « oo » décoratifs (motif de marque). */
const Rings = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 240 140" className={className} fill="none" aria-hidden>
    <circle cx="92" cy="70" r="62" stroke="currentColor" strokeWidth="1" />
    <circle cx="148" cy="70" r="62" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const SectionHead = ({
  index,
  eyebrow,
  children,
  sub,
  center,
  onDark,
}: {
  index: string;
  eyebrow: string;
  children: React.ReactNode;
  sub?: string;
  center?: boolean;
  onDark?: boolean;
}) => (
  <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
    <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] ${center ? "justify-center" : ""} ${onDark ? "text-primary" : "text-primary"}`}>
      <span className="tabular-nums opacity-50">({index})</span>
      <span className="h-px w-7 bg-primary/40" />
      {eyebrow}
    </p>
    <h2 className={`mt-5 text-balance font-display text-[2rem] font-extrabold leading-[1.08] tracking-tight sm:text-[2.7rem] ${onDark ? "text-white" : ""}`}>
      {children}
    </h2>
    {sub && (
      <p className={`mt-4 text-[15px] leading-relaxed ${onDark ? "text-white/65" : "text-muted-foreground"}`}>
        {sub}
      </p>
    )}
  </div>
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
        <section className="relative overflow-hidden border-b">
          <div className="bg-wash absolute inset-0" aria-hidden />
          <Rings className="pointer-events-none absolute -right-24 top-10 hidden w-[560px] text-primary/[0.09] lg:block" />
          <Wrap className="relative grid gap-14 pb-20 pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-20 lg:pb-28 lg:pt-24">
            <div className="animate-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent-tint px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
                <MapleLeaf className="h-3.5 w-3.5 text-[#EF4444]" />
                Non-custodial · Interac e-Transfer
              </span>
              <h1 className="mt-6 text-balance font-display text-[3rem] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-[4rem]">
                Achetez des USDT,
                <br />
                gardez vos <span className="text-primary">clés.</span>
              </h1>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted-foreground">
                Le moyen le plus direct d'acheter et de vendre des USDT en
                dollars canadiens. Payez par Interac, recevez dans votre wallet
                — aucun solde ne dort chez Ooble.
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
              <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Coin id="usdt" size={28} className="rounded-full ring-2 ring-background" />
                  <Coin id="trx" size={28} className="-ml-2.5 rounded-full ring-2 ring-background" />
                  <Coin id="eth" size={28} className="-ml-2.5 rounded-full ring-2 ring-background" />
                </div>
                <span>
                  USDT sur TRC20 &amp; ERC20 · réglé via <InteracLogo className="text-foreground" />
                </span>
              </div>
            </div>

            {/* Cotation ouverte */}
            <div className="animate-up lg:border-l lg:border-border lg:pl-16">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Coin id="usdt" size={42} />
                  <div>
                    <p className="font-display text-[15px] font-bold leading-tight">Tether · USDT</p>
                    <p className="text-xs text-muted-foreground">Cours en dollars canadiens</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-accent-tint px-2.5 py-1 text-[11px] font-semibold text-accent-ink">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  En direct
                </span>
              </div>

              <div className="mt-7 flex items-end gap-3">
                <p className="font-display text-[4rem] font-extrabold leading-[0.9] tracking-[-0.03em]">
                  {formatCad(1.4245)}
                </p>
                <span className="mb-2 flex items-center gap-1 text-sm font-semibold text-primary">
                  <TrendingUp className="h-4 w-4" /> +0,3 %
                </span>
              </div>
              <p className="mt-2.5 text-xs text-muted-foreground">
                Taux garanti 15 minutes à chaque ordre
              </p>

              <svg viewBox="0 0 460 90" className="mt-6 w-full" fill="none" preserveAspectRatio="none">
                <path
                  d="M0 74 L52 64 L104 68 L156 48 L208 54 L260 34 L312 40 L364 22 L416 28 L460 8"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 74 L52 64 L104 68 L156 48 L208 54 L260 34 L312 40 L364 22 L416 28 L460 8 V90 H0 Z"
                  fill="hsl(var(--primary) / 0.08)"
                />
              </svg>

              <div className="mt-7 flex items-center justify-between border-t pt-5 text-sm">
                <div>
                  <span className="text-muted-foreground">500,00 $ CAD</span>
                  <ArrowRight className="mx-2 inline h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">351,00 USDT</span>
                </div>
                <Link to="/acheter" className="font-semibold text-primary hover:underline">
                  Échanger →
                </Link>
              </div>
            </div>
          </Wrap>

          {/* Bandeau de logos */}
          <div className="border-t bg-card/50">
            <div className="mask-fade-x flex overflow-hidden py-5">
              <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
                {[...marquee, ...marquee].map((c, i) => (
                  <span key={i} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
                    <Coin id={c.id} size={24} />
                    <span className="text-sm font-semibold text-muted-foreground">{c.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== MARCHÉ ===== */}
        <section className="border-b py-20 lg:py-28">
          <Wrap>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead index="01" eyebrow="Marché en direct">
                Le marché USDT, <span className="text-primary">en temps réel</span>
              </SectionHead>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Échange disponible sur USDT. Les autres cours sont affichés à
                titre indicatif.
              </p>
            </div>
            <div className="mt-10">
              <Markets />
            </div>
          </Wrap>
        </section>

        {/* ===== VALEURS ===== */}
        <section className="relative overflow-hidden border-b py-20 lg:py-28">
          <div className="deco-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_50%_50%_at_80%_30%,black,transparent)]" aria-hidden />
          <Wrap className="relative">
            <SectionHead
              index="02"
              eyebrow="Le principe"
              sub="Un système simple pour acheter et vendre vos USDT, construit autour d'une idée : vos fonds restent à vous, à chaque étape."
            >
              Conçu autour de <span className="text-primary">vos fonds</span>
            </SectionHead>

            <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
              {values.map((v, i) => (
                <div key={v.title} className={i === 0 ? "sm:pr-12" : "sm:px-12"}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                    <v.icon className="h-[22px] w-[22px]" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold">{v.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {v.title === "Payé au Canada" ? (
                      <>
                        <InteracLogo className="text-foreground" /> e-Transfer à l'achat comme à
                        la vente, avec l'outil que votre banque connaît déjà.
                      </>
                    ) : (
                      v.desc
                    )}
                  </p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== APP (pétrole) ===== */}
        <section className="relative overflow-hidden bg-deep text-deep-foreground">
          <Rings className="pointer-events-none absolute -left-32 -top-16 w-[600px] text-white/[0.04]" />
          <Wrap className="relative grid items-center gap-14 py-20 lg:grid-cols-[1fr_auto] lg:gap-16 lg:py-28">
            <div>
              <SectionHead index="03" eyebrow="L'application" onDark>
                Un ordre, suivi <span className="text-primary">de bout en bout</span>
              </SectionHead>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65">
                Créez un ordre, suivez son statut en temps réel et recevez votre
                reçu on-chain — dans une interface pensée pour aller à
                l'essentiel.
              </p>
              <ul className="mt-8 space-y-4">
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
              <div className="mt-10 flex flex-wrap gap-3">
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
          </Wrap>
        </section>

        {/* ===== STATS ===== */}
        <section className="border-b">
          <Wrap>
            <div className="grid gap-10 py-16 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
              {[
                { big: "0 $", label: "Solde conservé sur la plateforme" },
                { big: "15 min", label: "Taux garanti à chaque ordre" },
                { big: "~4 min", label: "Règlement moyen après paiement" },
              ].map((s, i) => (
                <div key={s.label} className={`${i === 0 ? "sm:pr-12" : "sm:px-12"}`}>
                  <p className="font-display text-[3.5rem] font-extrabold leading-none tracking-[-0.03em] text-primary">
                    {s.big}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== COMMENT ÇA MARCHE ===== */}
        <section id="comment" className="border-b py-20 lg:py-28">
          <Wrap>
            <SectionHead index="04" eyebrow="Comment ça marche">
              Trois étapes, <span className="text-primary">réglé directement</span>
            </SectionHead>
            <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-3">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="relative border-t-2 border-primary/15 pt-6">
                  <span className="font-display text-[2.6rem] font-extrabold leading-none tracking-tight text-primary/20">
                    {n}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== SÉCURITÉ ===== */}
        <section className="border-b py-20 lg:py-28">
          <Wrap>
            <SectionHead index="05" eyebrow="Sécurité & conformité">
              Une plateforme qui <span className="text-primary">protège vos fonds</span>
            </SectionHead>
            <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
              {trust.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className={i === 0 ? "sm:pr-12" : "sm:px-12"}>
                  <Icon className="h-7 w-7 text-primary" strokeWidth={1.6} />
                  <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="border-b py-20 lg:py-28">
          <Wrap className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHead
              index="06"
              eyebrow="FAQ"
              sub="L'essentiel à savoir avant votre premier ordre. Une autre question ? Écrivez-nous, on répond vite."
            >
              Vous avez <span className="text-primary">des questions ?</span>
            </SectionHead>
            <div className="divide-y border-y">
              {faqs.map((item, i) => {
                const open = faqOpen === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setFaqOpen(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-6 text-left"
                    >
                      <span className="font-display text-[15px] font-bold">{item.q}</span>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${open ? "rotate-180 bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                    {open && (
                      <p className="-mt-1 pb-6 text-sm leading-relaxed text-muted-foreground">
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
        <section className="relative overflow-hidden bg-deep text-deep-foreground">
          <Rings className="pointer-events-none absolute -right-24 -bottom-20 w-[520px] text-white/[0.05]" />
          <Wrap className="relative grid items-center gap-8 py-20 lg:grid-cols-[1.4fr_1fr] lg:py-24">
            <div>
              <h2 className="text-balance font-display text-[2.2rem] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[2.9rem]">
                Prêt à échanger vos <span className="text-primary">premiers USDT</span> ?
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65">
                Créez un ordre en quelques minutes. Vos fonds vont directement
                là où ils doivent aller : chez vous.
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
          </Wrap>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
