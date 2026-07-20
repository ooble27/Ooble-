import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Check,
  Fingerprint,
  Lock,
  Plus,
  Wallet,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExchangeWidget from "@/components/ExchangeWidget";
import { formatCad } from "@/lib/rates";

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

const pillars = [
  {
    icon: Wallet,
    tint: "bg-accent-soft text-accent-ink",
    title: "Non-custodial, vraiment",
    description:
      "Aucun solde ne dort chez Ooble. Chaque ordre est réglé directement vers votre wallet ou votre compte bancaire.",
  },
  {
    icon: Banknote,
    tint: "bg-butter text-butter-ink",
    title: "Payé comme au Canada",
    description:
      "Interac e-Transfer à l'achat comme à la vente. L'outil que votre banque connaît déjà, sans frais surprise.",
  },
  {
    icon: Lock,
    tint: "bg-lilac text-lilac-ink",
    title: "Le taux que vous voyez",
    description:
      "Verrouillé 15 minutes à la création de l'ordre. Le marché peut bouger pendant le paiement — votre prix, non.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Créez l'ordre",
    description:
      "Montant, réseau, destination. Le taux CAD/USDT se verrouille pour 15 minutes.",
    visual: (
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3 shadow-soft">
          <div>
            <p className="text-[11px] text-muted-foreground">Vous payez</p>
            <p className="font-display text-lg font-semibold tracking-tight">500,00 $</p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">CAD</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3 shadow-soft">
          <div>
            <p className="text-[11px] text-muted-foreground">Vous recevez</p>
            <p className="font-display text-lg font-semibold tracking-tight">351,00</p>
          </div>
          <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
            USDT
          </span>
        </div>
      </div>
    ),
  },
  {
    step: "02",
    title: "Payez par Interac",
    description:
      "Un e-Transfer depuis votre banque, comme n'importe quel virement. Confirmé à réception.",
    visual: (
      <div className="rounded-2xl border bg-card p-4 shadow-soft">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Méthode de paiement
        </p>
        <div className="mt-2.5 flex items-center justify-between rounded-xl border bg-background/60 px-3.5 py-3">
          <span className="text-sm font-semibold">Interac e-Transfer</span>
          <span className="text-[11px] font-medium text-accent-ink">Sans frais</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Check className="h-3.5 w-3.5 text-accent-ink" strokeWidth={3} />
          Réception détectée automatiquement
        </div>
      </div>
    ),
  },
  {
    step: "03",
    title: "Recevez vos USDT",
    description:
      "L'envoi part on-chain vers votre adresse. Le hash de transaction sert de reçu.",
    visual: (
      <div className="rounded-2xl border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold tracking-tight">351,00 USDT</span>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent-ink">
            Complété
          </span>
        </div>
        <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">
          tx : 7f3a2b…c92e
        </p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-full rounded-full bg-accent" />
        </div>
      </div>
    ),
  },
];

const steps = [
  {
    icon: Fingerprint,
    title: "Compte vérifié",
    description: "Inscription et vérification d'identité en quelques minutes, une seule fois.",
  },
  {
    icon: Zap,
    title: "Ordre au taux verrouillé",
    description: "Montant, réseau, destination : le taux est garanti 15 minutes.",
  },
  {
    icon: Wallet,
    title: "Règlement direct",
    description: "USDT dans votre wallet, ou CAD dans votre compte. Rien ne reste chez Ooble.",
  },
];

const faqs = [
  {
    question: "Qu'est-ce que « non-custodial » veut dire ?",
    answer:
      "Ooble ne conserve aucun solde pour ses clients. Quand vous achetez, les USDT sont envoyés directement sur l'adresse wallet que vous fournissez. Quand vous vendez, le paiement CAD est envoyé directement à votre compte via Interac. Vos fonds ne dorment jamais sur la plateforme.",
  },
  {
    question: "Quels réseaux sont supportés pour l'USDT ?",
    answer:
      "TRC20 (réseau Tron, frais très bas) et ERC20 (réseau Ethereum, compatible avec la majorité des wallets). Vous choisissez le réseau à la création de l'ordre.",
  },
  {
    question: "Combien de temps prend une transaction ?",
    answer:
      "Le taux est verrouillé 15 minutes, le temps d'envoyer votre e-Transfer. Une fois le paiement confirmé, l'envoi des USDT part généralement en quelques minutes.",
  },
  {
    question: "Pourquoi dois-je vérifier mon identité ?",
    answer:
      "L'échange entre dollars canadiens et cryptoactifs est une activité encadrée au Canada (FINTRAC). La vérification d'identité est obligatoire — elle se fait une seule fois, en quelques minutes.",
  },
  {
    question: "Quels sont les frais ?",
    answer:
      "Le taux affiché inclut la marge d'Ooble — ce que vous voyez est ce que vous obtenez. Aucun frais surprise au moment de payer.",
  },
];

const Index = () => (
  <div className="grain min-h-screen bg-background">
    <Header />

    <main className="relative">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="bg-halo absolute inset-0" aria-hidden />
        <div className="container relative grid items-center gap-14 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] text-accent-foreground">
                ✦
              </span>
              Non-custodial · Interac e-Transfer · 🇨🇦
            </span>

            <h1 className="mt-6 font-display text-[2.75rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.1rem]">
              Vos USDT en dollars
              <br />
              canadiens,{" "}
              <span className="italic text-accent-ink [font-variation-settings:'opsz'_20]">
                réglés en direct
              </span>
              .
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Achetez et vendez des USDT par Interac. Chaque ordre part
              directement vers votre wallet — jamais un solde qui traîne chez
              nous.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/acheter"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:gap-3"
              >
                Acheter des USDT
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/vendre"
                className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-6 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-card"
              >
                Vendre des USDT
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-5">
              <div className="flex -space-x-2.5">
                {[
                  "bg-accent-soft text-accent-ink",
                  "bg-butter text-butter-ink",
                  "bg-lilac text-lilac-ink",
                  "bg-secondary text-foreground",
                ].map((c, i) => (
                  <span
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-background text-[11px] font-semibold ${c}`}
                  >
                    {["JT", "MK", "AD", "SL"][i]}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">1 200+</span> ordres
                réglés directement vers des wallets canadiens
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ExchangeWidget />
          </div>
        </div>

        {/* Marquee */}
        <div className="relative border-y bg-card/50 py-4">
          <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
              {[...marquee, ...marquee].map((item, i) => (
                <span
                  key={i}
                  className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== MANIFESTE / STATS ===== */}
      <section className="border-b py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-ink">
                Le principe
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-[2.6rem]">
                Un échange qui ne{" "}
                <span className="italic">retient</span> jamais votre argent.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                La plupart des plateformes gardent vos fonds sur un compte
                interne. Pas Ooble. Ici, chaque transaction est un ordre
                autonome : vous payez, on livre, c'est clos. Rien à déposer,
                rien à retirer.
              </p>
              <Link
                to="/#comment"
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5"
              >
                Voir le fonctionnement <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 self-center">
              {[
                { big: "0 $", label: "Solde conservé", sub: "Modèle ordre par ordre" },
                { big: "15 min", label: "Taux garanti", sub: "Par ordre créé" },
                { big: "2", label: "Réseaux USDT", sub: "TRC20 & ERC20" },
                { big: "~4 min", label: "Règlement moyen", sub: "Après confirmation" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border bg-card p-5 shadow-soft"
                >
                  <p className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    {stat.big}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PILIERS ===== */}
      <section className="py-24">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group rounded-3xl border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${pillar.tint}`}
                >
                  <pillar.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WORKFLOW ===== */}
      <section id="comment" className="border-y bg-card/50 py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-ink">
              Un flux, trois temps
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-[2.6rem]">
              De l'ordre à votre wallet
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Pas de dépôt préalable, pas de solde à surveiller. Juste des
              ordres réglés directement.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {workflow.map((item) => (
              <div
                key={item.step}
                className="flex flex-col rounded-3xl border bg-background p-6 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-accent-ink">
                    {item.step}
                  </span>
                  <span className="h-px flex-1 mx-3 bg-border" />
                </div>
                <div className="mt-5">{item.visual}</div>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRANSPARENCE / REÇU ===== */}
      <section className="py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative order-2 lg:order-1">
              <div className="divider-dots absolute -inset-6 -z-10 rounded-[2rem] opacity-60" aria-hidden />
              <div className="rounded-[2rem] border bg-card p-6 shadow-lift sm:p-8">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg font-semibold tracking-tight">
                    Reçu de règlement
                  </p>
                  <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-ink">
                    <ArrowUpRight className="h-3.5 w-3.5" /> Complété
                  </span>
                </div>
                <dl className="mt-6 space-y-4 text-sm">
                  {[
                    ["Montant payé", "500,00 $ CAD"],
                    ["Taux verrouillé", formatCad(1.4245) + " / USDT"],
                    ["USDT reçus", "351,00 USDT"],
                    ["Réseau", "TRC20 · Tron"],
                    ["Destination", "T•••92e"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between border-b border-dashed border-border pb-4 last:border-0 last:pb-0"
                    >
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 flex items-center gap-2 rounded-2xl bg-secondary/70 px-4 py-3 text-xs text-muted-foreground">
                  <Check className="h-4 w-4 text-accent-ink" strokeWidth={3} />
                  Vérifiable sur la blockchain — tx 7f3a2b…c92e
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-ink">
                Transparence
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-[2.6rem]">
                Sachez exactement où sont vos fonds,{" "}
                <span className="italic">à chaque étape</span>.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                Un ordre Ooble n'a pas de zone grise. Chaque étape est visible,
                horodatée, et le règlement final est vérifiable directement
                on-chain.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Taux verrouillé affiché avant de payer",
                  "Suivi de l'ordre en temps réel",
                  "Hash de transaction comme preuve de règlement",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ÉTAPES ===== */}
      <section className="border-y bg-card/50 py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-[2.6rem]">
              Trois étapes, c'est tout
            </h2>
          </div>
          <div className="relative mx-auto mt-16 grid max-w-4xl gap-10 sm:grid-cols-3">
            <span
              className="absolute left-[16%] right-[16%] top-6 hidden border-t border-dashed border-border sm:block"
              aria-hidden
            />
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <span className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border bg-background shadow-soft">
                  <step.icon className="h-5 w-5 text-accent-ink" />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Étape {index + 1}
                </p>
                <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-24">
        <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-ink">
              FAQ
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Ce qu'on nous demande le plus souvent
            </h2>
            <p className="mt-5 text-muted-foreground">
              Une autre question ? Écrivez-nous, on répond vite.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-3xl border bg-card px-6 py-5 shadow-soft transition-colors open:bg-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-transform group-open:rotate-45">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground px-8 py-16 text-center text-background sm:py-20">
            <div
              className="absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  "radial-gradient(60% 60% at 50% 0%, hsl(var(--accent)), transparent 70%)",
              }}
              aria-hidden
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Prêt pour votre premier ordre ?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-background/70">
                Créez un ordre en quelques minutes. Vos fonds vont directement
                là où ils doivent aller : chez vous.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  to="/acheter"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all hover:gap-3"
                >
                  Acheter des USDT <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/vendre"
                  className="inline-flex items-center gap-2 rounded-full border border-background/25 px-7 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-background/10"
                >
                  Vendre des USDT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default Index;
