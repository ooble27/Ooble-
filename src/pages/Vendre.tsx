import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderForm from "@/components/OrderForm";
import { Banknote, Send, Timer } from "lucide-react";

const Vendre = () => (
  <div className="min-h-screen bg-background">
    <Header />

    <main className="container grid gap-12 py-16 lg:grid-cols-[1fr_480px] lg:gap-16 lg:py-24">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
          Vente · USDT → CAD
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Vendre des USDT contre des dollars canadiens
        </h1>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
          Envoyez vos USDT et recevez un Interac e-Transfer directement dans
          votre compte bancaire, dès la confirmation on-chain.
        </p>

        <ul className="mt-10 space-y-6">
          <li className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <Timer className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h3 className="font-display font-semibold">1. Créez votre ordre</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Le taux est verrouillé 15 minutes et une adresse de dépôt USDT
                vous est attribuée.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <Send className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h3 className="font-display font-semibold">2. Envoyez vos USDT</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Depuis votre wallet, vers l'adresse de dépôt. Le suivi des
                confirmations est en temps réel.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <Banknote className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h3 className="font-display font-semibold">3. Recevez votre e-Transfer</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Le paiement CAD part vers votre courriel Interac dès la
                confirmation de la transaction.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <OrderForm side="sell" />
    </main>

    <Footer />
  </div>
);

export default Vendre;
