import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Check,
  CheckCircle2,
  Landmark,
  Lock,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DEMO_RATES, formatCad } from "@/lib/rates";

const demoOrders = [
  { initials: "JT", color: "bg-emerald-100 text-emerald-700", name: "Julie T.", detail: "Achat · 351,00 USDT", ref: "O-52112" },
  { initials: "MK", color: "bg-sky-100 text-sky-700", name: "Marc K.", detail: "Vente · 1 200,00 USDT", ref: "O-52132" },
  { initials: "AD", color: "bg-violet-100 text-violet-700", name: "Awa D.", detail: "Achat · 702,15 USDT", ref: "O-52114" },
  { initials: "SL", color: "bg-amber-100 text-amber-700", name: "Sam L.", detail: "Vente · 89,50 USDT", ref: "O-52139" },
];

const features = [
  {
    icon: Wallet,
    iconClass: "bg-emerald-50 text-emerald-600",
    title: "100 % non-custodial",
    description:
      "Aucun solde de plateforme. Chaque ordre est réglé directement vers votre wallet ou votre compte bancaire.",
  },
  {
    icon: Banknote,
    iconClass: "bg-sky-50 text-sky-600",
    title: "Interac e-Transfer",
    description:
      "Payez et soyez payé avec l'outil bancaire que tous les Canadiens utilisent déjà. Pas de frais cachés.",
  },
  {
    icon: Lock,
    iconClass: "bg-violet-50 text-violet-600",
    title: "Taux verrouillé 15 min",
    description:
      "Le taux est figé à la création de votre ordre. Le marché peut bouger pendant votre paiement — pas votre prix.",
  },
];

const workflow = [
  {
    title: "Créez votre ordre",
    description:
      "Choisissez le montant et le réseau. Le taux CAD/USDT est verrouillé 15 minutes.",
    to: "/acheter",
    visual: (
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
          <div>
            <p className="text-[11px] text-muted-foreground">Vous payez</p>
            <p className="text-sm font-semibold">500,00 $ CAD</p>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium">Interac</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
          <div>
            <p className="text-[11px] text-muted-foreground">Vous recevez</p>
            <p className="text-sm font-semibold">351,00 USDT</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">TRC20</span>
        </div>
      </div>
    ),
  },
  {
    title: "Payez par Interac",
    description:
      "Envoyez votre e-Transfer depuis votre banque, comme n'importe quel virement.",
    to: "/acheter",
    visual: (
      <div className="p-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Méthode de paiement
          </p>
          <div className="mt-2 flex items-center justify-between rounded-lg border px-3 py-2.5">
            <span className="text-sm font-semibold">Interac e-Transfer</span>
            <span className="text-[11px] text-muted-foreground">Sans frais</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Confirmation dès réception du paiement
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Recevez vos USDT",
    description:
      "L'envoi part on-chain directement vers votre adresse, avec le hash comme reçu.",
    to: "/vendre",
    visual: (
      <div className="p-4">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">351,00 USDT</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
              Complété
            </span>
          </div>
          <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">
            tx : 7f3a…c92e
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-full rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    ),
  },
];

const steps = [
  {
    step: "Étape 1",
    title: "Compte vérifié",
    description:
      "Inscription et vérification d'identité en quelques minutes, une seule fois.",
  },
  {
    step: "Étape 2",
    title: "Ordre au taux verrouillé",
    description:
      "Montant, réseau, destination : le taux est garanti 15 minutes.",
  },
  {
    step: "Étape 3",
    title: "Règlement direct",
    description:
      "USDT dans votre wallet ou CAD dans votre compte. Rien ne reste chez Ooble.",
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
      <section className="relative">
        <div className="bg-dots absolute inset-0" aria-hidden />
        <div className="container relative pb-16 pt-16 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
              🇨🇦 Plateforme non-custodiale · Interac e-Transfer
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
              Vos USDT, directement
              <br className="hidden sm:block" /> dans votre wallet
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              La façon la plus simple d'acheter et de vendre des USDT en
              dollars canadiens. Payez par Interac, recevez on-chain. Aucun
              solde de plateforme, jamais.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/acheter"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
              >
                Acheter des USDT <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/vendre"
                className="inline-flex items-center gap-2 rounded-full border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                Vendre des USDT
              </Link>
            </div>
          </div>

          {/* Bulles flottantes */}
          <div className="pointer-events-none absolute left-8 top-32 hidden xl:block">
            <div className="flex items-center gap-2 rounded-full border bg-card py-1.5 pl-1.5 pr-4 shadow-soft">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                JT
              </span>
              <span className="text-xs font-medium">Reçu en 4 min ✅</span>
            </div>
          </div>
          <div className="pointer-events-none absolute right-8 top-40 hidden xl:block">
            <div className="flex items-center gap-2 rounded-full border bg-card py-1.5 pl-1.5 pr-4 shadow-soft">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                MK
              </span>
              <span className="text-xs font-medium">Taux verrouillé 👌</span>
            </div>
          </div>

          {/* Panneau produit */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="relative rounded-3xl border bg-secondary/60 p-4 shadow-panel sm:p-6">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Ordres récents */}
                <div className="rounded-2xl border bg-card p-4 shadow-soft">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Ordres récents
                  </p>
                  <ul className="mt-3 space-y-3">
                    {demoOrders.map((order) => (
                      <li key={order.ref} className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${order.color}`}
                        >
                          {order.initials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{order.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {order.detail}
                          </p>
                        </div>
                        <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-muted-foreground">
                          {order.ref}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Taux en direct */}
                <div className="rounded-2xl border bg-card p-4 shadow-soft">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Taux CAD / USDT
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight">
                      {formatCad(DEMO_RATES.buy)}
                    </span>
                    <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <ArrowUpRight className="h-3 w-3" /> direct
                    </span>
                  </div>
                  <ul className="mt-4 space-y-3 border-t pt-3 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Achat</span>
                      <span className="font-medium">{formatCad(DEMO_RATES.buy)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Vente</span>
                      <span className="font-medium">{formatCad(DEMO_RATES.sell)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Verrouillage</span>
                      <span className="font-medium">15 min</span>
                    </li>
                  </ul>
                </div>

                {/* Suivi d'ordre */}
                <div className="rounded-2xl border bg-card p-4 shadow-soft">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Suivi de l'ordre O-52112
                  </p>
                  <ul className="mt-3 space-y-3">
                    {[
                      { label: "Ordre créé · taux verrouillé", done: true },
                      { label: "e-Transfer reçu", done: true },
                      { label: "USDT envoyés (TRC20)", done: true },
                      { label: "Confirmé on-chain", done: false },
                    ].map((item) => (
                      <li key={item.label} className="flex items-center gap-2.5 text-sm">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            item.done
                              ? "bg-emerald-500 text-white"
                              : "border-2 border-border bg-card"
                          }`}
                        >
                          {item.done && <Check className="h-3 w-3" />}
                        </span>
                        <span className={item.done ? "" : "text-muted-foreground"}>
                          {item.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full w-3/4 rounded-full bg-foreground" />
                  </div>
                </div>
              </div>

              {/* Pastille centrale */}
              <span className="absolute -top-5 left-1/2 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-foreground shadow-panel md:flex">
                <span className="h-3.5 w-3.5 rounded-full bg-background" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 piliers */}
      <section className="py-20">
        <div className="container grid gap-12 text-center sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="mx-auto max-w-xs">
              <span
                className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconClass}`}
              >
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Transparence / chiffres */}
      <section className="border-t py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Sachez exactement où sont vos fonds,
              <br className="hidden sm:block" /> à chaque étape
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Un ordre Ooble n'a pas de zone grise : chaque étape est visible,
              horodatée et vérifiable on-chain.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-8">
              <div className="flex gap-5 border-l-2 border-foreground pl-5">
                <div>
                  <p className="text-3xl font-bold tracking-tight">0 $</p>
                  <p className="mt-1 font-medium">Solde conservé sur la plateforme</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Modèle ordre par ordre : payé, livré, clôturé.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 border-l-2 border-border pl-5">
                <div>
                  <p className="text-3xl font-bold tracking-tight">15 min</p>
                  <p className="mt-1 font-medium">Taux garanti par ordre</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Le temps d'envoyer votre e-Transfer, sans stress.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 border-l-2 border-border pl-5">
                <div>
                  <p className="text-3xl font-bold tracking-tight">2 réseaux</p>
                  <p className="mt-1 font-medium">TRC20 et ERC20</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Frais bas avec Tron, compatibilité maximale avec Ethereum.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-secondary/60 p-6">
              <div className="rounded-2xl border bg-card p-5 shadow-soft">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Reçu de règlement</p>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    Complété
                  </span>
                </div>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Montant payé</span>
                    <span className="font-medium">500,00 $ CAD</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Taux verrouillé</span>
                    <span className="font-medium">1,4245 $ / USDT</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">USDT reçus</span>
                    <span className="font-medium">351,00 USDT</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Réseau</span>
                    <span className="font-medium">TRC20</span>
                  </li>
                  <li className="flex items-center justify-between border-t pt-3">
                    <span className="text-muted-foreground">Transaction</span>
                    <span className="font-mono text-xs">7f3a…c92e</span>
                  </li>
                </ul>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Chaque ordre produit un reçu vérifiable sur la blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow — 3 cartes */}
      <section className="border-t bg-card py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Un flux simple pour chaque ordre
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Trois moments, zéro friction : l'ordre, le paiement, la
              livraison.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {workflow.map((item) => (
              <div
                key={item.title}
                className="flex flex-col rounded-2xl border bg-background shadow-soft"
              >
                <div className="rounded-t-2xl bg-secondary/50">{item.visual}</div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <Link
                    to={item.to}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    En savoir plus <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibilité */}
      <section className="border-t py-16">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            Compatible avec vos outils de tous les jours
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-semibold text-muted-foreground/70">
            <span>Interac</span>
            <span>Tron</span>
            <span>Ethereum</span>
            <span>MetaMask</span>
            <span>Trust Wallet</span>
            <span>Ledger</span>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment" className="border-t py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Voici comment ça marche
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Pas de dépôt préalable, pas de solde à retirer. Juste des ordres
              réglés directement.
            </p>
          </div>
          <div className="relative mx-auto mt-16 grid max-w-4xl gap-10 sm:grid-cols-3">
            <span
              className="absolute left-[16%] right-[16%] top-5 hidden border-t border-dashed sm:block"
              aria-hidden
            />
            {steps.map((step, index) => (
              <div key={step.step} className="relative text-center">
                <span className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full border bg-card text-sm font-bold shadow-soft">
                  {index + 1}
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {step.step}
                </p>
                <h3 className="mt-1 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confiance */}
      <section className="border-t bg-card py-20">
        <div className="container">
          <div className="mx-auto grid max-w-4xl gap-8 text-center sm:grid-cols-3">
            <div>
              <ShieldCheck className="mx-auto h-6 w-6 text-emerald-600" />
              <h3 className="mt-3 font-semibold">Identité vérifiée</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Chaque utilisateur passe un KYC. Un environnement sain, sans
                anonymat.
              </p>
            </div>
            <div>
              <Landmark className="mx-auto h-6 w-6 text-emerald-600" />
              <h3 className="mt-3 font-semibold">Pensé pour le Canada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Conçu autour des exigences canadiennes : conformité, dossiers,
                déclarations.
              </p>
            </div>
            <div>
              <Wallet className="mx-auto h-6 w-6 text-emerald-600" />
              <h3 className="mt-3 font-semibold">Vos clés, vos fonds</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Les USDT vont dans votre wallet, le CAD dans votre compte.
                Point final.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t py-24">
        <div className="container max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Questions fréquentes
          </h2>
          <div className="mt-12 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border bg-card px-6 py-5 shadow-soft"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">
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
      <section className="border-t py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-3xl border bg-card px-8 py-16 text-center shadow-panel">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Prêt pour votre premier ordre ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Créez un ordre en quelques minutes. Vos fonds vont directement
              là où ils doivent aller : chez vous.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/acheter"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
              >
                Acheter des USDT <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/vendre"
                className="inline-flex items-center gap-2 rounded-full border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                Vendre des USDT
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
