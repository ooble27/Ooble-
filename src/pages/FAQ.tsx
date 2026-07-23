import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FaqArt } from "@/components/illustrations";
import { cn } from "@/lib/utils";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Qu'est-ce qu'Ooble ?",
    a: "Ooble est une plateforme non-custodial pour acheter et vendre des USDT en dollars canadiens, réglés par Interac e-Transfer. Nous ne conservons jamais vos fonds : chaque ordre part directement vers votre wallet (achat) ou votre compte (vente).",
  },
  {
    q: "Comment acheter des USDT ?",
    a: "Indiquez le montant en CAD ou en USDT, choisissez le réseau de réception et collez votre adresse. Vous recevez une référence et un e-mail Interac : envoyez votre e-Transfer, et vos USDT partent vers votre adresse dès réception du paiement.",
  },
  {
    q: "Comment vendre des USDT ?",
    a: "Entrez le montant à vendre et l'e-mail Interac sur lequel recevoir vos dollars. Vous envoyez vos USDT à l'adresse indiquée ; dès confirmation, nous vous versons le montant en CAD par Interac e-Transfer.",
  },
  {
    q: "Quels réseaux sont pris en charge ?",
    a: "Tron (TRC20), BNB Chain (BEP20), Ethereum (ERC20), Polygon, Solana (SPL) et Avalanche (C-Chain). Vérifiez toujours que l'adresse correspond au bon réseau avant de valider.",
  },
  {
    q: "Quels sont les frais ?",
    a: "Un seul taux, transparent : le prix du marché en direct + une marge de 2 %. Aucun frais caché, aucun abonnement.",
  },
  {
    q: "Ooble conserve-t-il mes fonds ?",
    a: "Non. Ooble est non-custodial : nous ne détenons aucun solde client. Chaque ordre est réglé individuellement vers votre wallet ou votre compte bancaire.",
  },
  {
    q: "Y a-t-il une vérification d'identité ?",
    a: "Une vérification d'identité (KYC) peut être demandée pour respecter la réglementation canadienne, notamment sur les montants élevés. Vos documents restent confidentiels et servent uniquement à la conformité.",
  },
  {
    q: "Combien de temps pour recevoir ?",
    a: "La plupart des ordres sont traités en quelques minutes après réception du paiement, aux heures d'ouverture. Les très gros volumes peuvent passer par notre desk OTC.",
  },
];

const TOPICS: { label: string; idx: number }[] = [
  { label: "Acheter", idx: 1 },
  { label: "Vendre", idx: 2 },
  { label: "Réseaux", idx: 3 },
  { label: "Frais", idx: 4 },
  { label: "Sécurité", idx: 5 },
  { label: "KYC", idx: 6 },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const jumpTo = (i: number) => {
    setOpenIdx(i);
    document.getElementById(`faq-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="app-type min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-[1120px] px-6 sm:px-8">
        {/* Hero */}
        <section className="grid items-center gap-8 pb-6 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pb-12 lg:pt-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Centre d'aide
            </span>
            <h1 className="mt-4 font-display text-[2.7rem] font-semibold leading-[1.03] tracking-[-0.03em] sm:text-[3.4rem]">
              Comment pouvons-nous <span className="text-primary">aider ?</span>
            </h1>
            <p className="mt-4 max-w-md text-[16px] font-light leading-relaxed text-muted-foreground">
              Tout ce qu'il faut savoir pour acheter et vendre des USDT en dollars canadiens, en toute simplicité.
            </p>

            {/* Sujets rapides */}
            <div className="mt-6 flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t.label}
                  onClick={() => jumpTo(t.idx)}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <FaqArt className="mx-auto w-full max-w-[400px]" />
          </div>
        </section>

        {/* Accordéon — une carte par question */}
        <section className="mx-auto max-w-[820px] pb-14">
          <div className="space-y-2.5">
            {FAQS.map((f, i) => {
              const open = openIdx === i;
              return (
                <div
                  key={f.q}
                  id={`faq-${i}`}
                  className={cn(
                    "scroll-mt-24 rounded-2xl border bg-card px-5 transition-colors sm:px-6",
                    open ? "border-foreground/25" : "border-border",
                  )}
                >
                  <button onClick={() => setOpenIdx(open ? null : i)} className="flex w-full items-center justify-between gap-4 py-4 text-left sm:py-5">
                    <span className="text-[15px] font-medium">{f.q}</span>
                    <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border transition-transform", open && "rotate-45 bg-secondary")}>
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  <div className={cn("grid transition-all duration-300", open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]")}>
                    <p className="overflow-hidden text-[14px] font-light leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA — accent pétrole */}
        <section className="pb-16">
          <div className="relative overflow-hidden rounded-[28px] bg-deep px-6 py-12 text-center text-deep-foreground sm:py-14">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <h2 className="relative font-display text-[26px] font-semibold tracking-tight sm:text-[30px]">Encore une question ?</h2>
            <p className="relative mx-auto mt-2 max-w-sm text-[14px] font-light text-white/70">
              Notre équipe répond rapidement, en français comme en anglais.
            </p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild variant="white" shape="rounded" size="lg">
                <Link to="/contact">Nous contacter <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outlineOnDark" shape="rounded" size="lg">
                <Link to="/connexion">Commencer</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
