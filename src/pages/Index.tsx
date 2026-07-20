import { Link } from "react-router-dom";
import {
  ArrowRight,
  Banknote,
  Clock3,
  Landmark,
  Lock,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RateCalculator from "@/components/RateCalculator";

const steps = [
  {
    number: "01",
    title: "Créez votre compte",
    description:
      "Inscription rapide et vérification d'identité sécurisée, requise une seule fois.",
  },
  {
    number: "02",
    title: "Créez votre ordre",
    description:
      "Choisissez le montant : le taux CAD/USDT est verrouillé pendant 15 minutes.",
  },
  {
    number: "03",
    title: "Payez par Interac",
    description:
      "Envoyez votre e-Transfer — le moyen de paiement le plus simple au Canada.",
  },
  {
    number: "04",
    title: "Recevez vos USDT",
    description:
      "Les USDT arrivent directement sur votre propre wallet. Aucun détour.",
  },
];

const features = [
  {
    icon: Wallet,
    title: "100 % non-custodial",
    description:
      "Ooble ne détient jamais vos fonds. Pas de solde de plateforme, pas de risque de gel : chaque ordre est réglé directement vers votre wallet ou votre compte bancaire.",
  },
  {
    icon: Banknote,
    title: "Interac e-Transfer",
    description:
      "Payez et soyez payé avec l'outil bancaire que tous les Canadiens utilisent déjà. Pas de carte de crédit, pas de frais cachés.",
  },
  {
    icon: Lock,
    title: "Taux verrouillé",
    description:
      "Le taux est figé à la création de votre ordre. Le marché peut bouger pendant votre paiement — pas votre prix.",
  },
  {
    icon: Clock3,
    title: "Règlement rapide",
    description:
      "Dès la confirmation de votre paiement, vos USDT partent on-chain (TRC20 ou ERC20). Suivi de l'ordre en temps réel.",
  },
  {
    icon: ShieldCheck,
    title: "Identité vérifiée",
    description:
      "Chaque utilisateur est vérifié. Un environnement sain, sans anonymat, qui protège tout le monde.",
  },
  {
    icon: Landmark,
    title: "Pensé pour le Canada",
    description:
      "Conçu autour des règles canadiennes : programme de conformité, tenue de dossiers et déclarations réglementaires.",
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
  <div className="min-h-screen bg-background">
    <Header />

    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div
          className="absolute left-1/2 top-[-200px] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
          aria-hidden
        />
        <div className="container relative grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Non-custodial · Vos clés, vos fonds
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Vos USDT en <span className="text-gradient">dollars canadiens</span>,
              sans intermédiaire de solde
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Achetez et vendez des USDT par Interac e-Transfer. Chaque ordre
              est réglé directement vers votre wallet ou votre compte bancaire
              — Ooble ne détient jamais vos fonds.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/acheter"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-all hover:brightness-110"
              >
                Acheter des USDT <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/vendre"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-7 py-3.5 font-semibold transition-colors hover:bg-secondary"
              >
                Vendre des USDT
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Identité vérifiée
              </span>
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" /> Taux verrouillé 15 min
              </span>
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" /> Zéro solde plateforme
              </span>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RateCalculator />
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment" className="border-t border-border/60 py-24">
        <div className="container">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Comment ça marche
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Un parcours simple, ordre par ordre. Pas de dépôt préalable, pas
              de solde à retirer.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-border/80 bg-card/60 p-6 transition-colors hover:border-primary/40"
              >
                <span className="font-display text-sm font-bold text-primary">
                  {step.number}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">
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

      {/* Pourquoi Ooble */}
      <section className="border-t border-border/60 bg-card/30 py-24">
        <div className="container">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Pourquoi <span className="text-gradient">Ooble</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Une plateforme pensée pour la sécurité de vos fonds et la
              simplicité du paiement canadien.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border/80 bg-card/60 p-6 transition-colors hover:border-primary/40"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                  <feature.icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border/60 py-24">
        <div className="container max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Questions fréquentes
          </h2>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-border/80 bg-card/60 px-6 py-5 open:border-primary/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="text-primary transition-transform group-open:rotate-45">
                    +
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

      {/* CTA final */}
      <section className="border-t border-border/60 py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card px-8 py-16 text-center">
            <div
              className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]"
              aria-hidden
            />
            <h2 className="relative font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Prêt à échanger en toute simplicité ?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Créez votre premier ordre en quelques minutes. Vos fonds vont
              directement là où ils doivent aller : chez vous.
            </p>
            <div className="relative mt-8 flex justify-center gap-4">
              <Link
                to="/acheter"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-all hover:brightness-110"
              >
                Commencer maintenant <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default Index;
