import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FaqArt } from "@/components/illustrations";
import { cn } from "@/lib/utils";

const GROUPS: { topic: string; items: { q: string; a: string }[] }[] = [
  {
    topic: "Le service",
    items: [
      {
        q: "Qu'est-ce qu'Ooble ?",
        a: "Une plateforme non-custodial pour acheter et vendre des USDT en dollars canadiens, réglés par Interac e-Transfer. Chaque ordre part directement vers votre wallet ou votre compte.",
      },
      {
        q: "Quels sont les frais ?",
        a: "Le cours du marché plus une marge de 2 %, déjà comprise dans le prix affiché. Aucun frais caché, aucun abonnement.",
      },
      {
        q: "Combien de temps le taux est-il garanti ?",
        a: "Quinze minutes à partir de la création de l'ordre — le temps d'effectuer votre virement sans subir les variations du marché.",
      },
    ],
  },
  {
    topic: "Acheter et vendre",
    items: [
      {
        q: "Comment acheter des USDT ?",
        a: "Indiquez le montant, choisissez le réseau de réception et collez votre adresse. Envoyez votre e-Transfer : vos USDT partent dès réception du paiement.",
      },
      {
        q: "Comment vendre des USDT ?",
        a: "Entrez le montant et le courriel Interac sur lequel recevoir vos dollars. Vous envoyez vos USDT à l'adresse indiquée ; dès confirmation, nous vous versons le montant en CAD.",
      },
      {
        q: "Quels réseaux sont pris en charge ?",
        a: "Tron (TRC20), Ethereum (ERC20), BNB Chain (BEP20), Polygon, Solana et Avalanche (C-Chain). Vérifiez toujours que l'adresse correspond au réseau choisi.",
      },
      {
        q: "Combien de temps pour recevoir ?",
        a: "Quelques minutes après réception du paiement, aux heures d'ouverture. Les très gros volumes passent par notre desk OTC.",
      },
    ],
  },
  {
    topic: "Sécurité et conformité",
    items: [
      {
        q: "Ooble conserve-t-il mes fonds ?",
        a: "Non. Aucun solde client, aucun portefeuille interne. Chaque ordre est réglé individuellement, puis clos.",
      },
      {
        q: "Pourquoi une vérification d'identité ?",
        a: "C'est une exigence réglementaire canadienne. Elle se fait une seule fois : courriel, pièce d'identité, selfie. Vos documents servent uniquement à la conformité.",
      },
    ],
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<string | null>(GROUPS[0].items[0].q);

  return (
    <div className="ink-neutral app-type min-h-screen bg-background tracking-[-0.015em]">
      <Header />

      <main className="mx-auto max-w-[1200px] px-6 sm:px-10">
        {/* Titre */}
        <section className="grid items-center gap-10 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
          <div>
            <p className="text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
              Centre d'aide
            </p>
            <h1 className="mt-5 font-display text-[2.7rem] leading-[0.98] tracking-[-0.05em] sm:text-[3.8rem] lg:text-[4.5rem]">
              Questions
              <br />
              <span className="text-foreground/35">fréquentes</span>
            </h1>
          </div>
          <FaqArt className="mx-auto hidden w-full max-w-[360px] lg:block" aria-hidden />
        </section>

        {/* Questions groupées par sujet */}
        <section className="pt-16 lg:pt-20">
          {GROUPS.map((group) => (
            <div key={group.topic} className="pb-14 lg:pb-16">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <p className="font-display text-[1.4rem] tracking-[-0.03em] lg:sticky lg:top-8 lg:self-start">
                  {group.topic}
                </p>

                <div>
                  {group.items.map((item) => {
                    const isOpen = open === item.q;
                    return (
                      <div key={item.q} className="border-t">
                        <button
                          onClick={() => setOpen(isOpen ? null : item.q)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-6 py-5 text-left"
                        >
                          <span className="font-display text-[17px] tracking-[-0.02em]">
                            {item.q}
                          </span>
                          <span
                            className={cn(
                              "shrink-0 text-[22px] leading-none text-foreground/35 transition-transform",
                              isOpen && "rotate-45",
                            )}
                            aria-hidden
                          >
                            +
                          </span>
                        </button>
                        {isOpen && (
                          <p className="mb-6 max-w-[620px] text-[15px] leading-[1.7] text-muted-foreground">
                            {item.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  <div className="border-t" />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Contact */}
        <section className="border-t py-16 text-center lg:py-20">
          <h2 className="mx-auto max-w-[560px] font-display text-[1.9rem] leading-[1.06] tracking-[-0.04em] sm:text-[2.6rem]">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="mx-auto mt-5 max-w-[380px] text-[15px] leading-[1.6] text-muted-foreground">
            Notre équipe répond en français comme en anglais.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-2.5">
            <Button asChild variant="appSolid" shape="rounded" size="default" className="px-6">
              <Link to="/contact">
                Nous écrire <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" shape="rounded" size="default" className="px-6">
              <Link to="/inscription">Ouvrir un compte</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
