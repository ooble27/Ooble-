import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderForm from "@/components/OrderForm";
import { Banknote, ShieldCheck, Wallet } from "lucide-react";

const Acheter = () => (
  <div className="min-h-screen bg-background">
    <Header />

    <main className="container grid gap-12 py-16 lg:grid-cols-[1fr_480px] lg:gap-16 lg:py-24">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
          Achat · CAD → USDT
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Acheter des USDT en dollars canadiens
        </h1>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
          Payez par Interac e-Transfer et recevez vos USDT directement sur
          votre propre wallet, sans jamais passer par un solde de plateforme.
        </p>

        <ul className="mt-10 space-y-6">
          <li className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <Banknote className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h3 className="font-display font-semibold">1. Créez votre ordre</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Le taux est verrouillé 15 minutes — les instructions Interac
                s'affichent immédiatement.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h3 className="font-display font-semibold">2. Envoyez le e-Transfer</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Depuis votre banque, comme n'importe quel virement Interac.
                Confirmation dès réception.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <Wallet className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h3 className="font-display font-semibold">3. Recevez vos USDT</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Envoi on-chain direct vers votre adresse, avec le hash de
                transaction comme reçu.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <OrderForm side="buy" />
    </main>

    <Footer />
  </div>
);

export default Acheter;
