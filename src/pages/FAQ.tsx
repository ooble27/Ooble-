import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CoinsArt } from "@/components/illustrations";
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

const FaqItem = ({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) => (
  <div className="border-b border-border">
    <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 py-5 text-left">
      <span className="text-[15px] font-medium">{q}</span>
      <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border transition-transform", open && "rotate-45 bg-secondary")}>
        <Plus className="h-4 w-4" />
      </span>
    </button>
    <div className={cn("grid transition-all duration-300", open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]")}>
      <p className="overflow-hidden text-[14px] font-light leading-relaxed text-muted-foreground">{a}</p>
    </div>
  </div>
);

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="app-type min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-[1120px] px-6 sm:px-8">
        {/* Hero */}
        <section className="grid items-center gap-10 pb-8 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pb-14 lg:pt-16">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Aide</span>
            <h1 className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3.2rem]">
              Questions <span className="text-primary">fréquentes</span>
            </h1>
            <p className="mt-4 max-w-md text-[16px] font-light leading-relaxed text-muted-foreground">
              Tout ce qu'il faut savoir pour acheter et vendre des USDT en dollars canadiens, en toute simplicité.
            </p>
          </div>
          <div className="hidden lg:block">
            <CoinsArt className="mx-auto w-full max-w-[380px]" />
          </div>
        </section>

        {/* Accordéon */}
        <section className="mx-auto max-w-[760px] pb-16">
          <div className="rounded-3xl border border-border bg-card px-6 sm:px-8">
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-border bg-secondary/40 px-6 py-10 text-center">
            <h2 className="font-display text-[22px] font-semibold tracking-tight">Encore une question ?</h2>
            <p className="max-w-sm text-[14px] font-light text-muted-foreground">
              Notre équipe répond rapidement, en français comme en anglais.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="primary" shape="rounded" size="lg">
                <Link to="/contact">Nous contacter <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="secondary" shape="rounded" size="lg">
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
