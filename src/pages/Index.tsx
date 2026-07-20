import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Wallet } from "lucide-react";

const Index = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <span className="text-xl font-bold tracking-tight">Ooble</span>
        <nav className="flex items-center gap-4">
          <Link to="/acheter" className="text-sm font-medium hover:text-primary">
            Acheter
          </Link>
          <Link to="/vendre" className="text-sm font-medium hover:text-primary">
            Vendre
          </Link>
        </nav>
      </div>
    </header>

    <main>
      <section className="container py-24 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Achetez et vendez des USDT en dollars canadiens
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Payez par Interac e-Transfer, recevez vos USDT directement sur votre
          propre wallet. Ooble ne détient jamais vos fonds.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/acheter"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            Acheter des USDT <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/vendre"
            className="inline-flex items-center gap-2 rounded-md border px-6 py-3 font-medium hover:bg-secondary"
          >
            Vendre des USDT
          </Link>
        </div>
      </section>

      <section className="border-t bg-secondary/40 py-16">
        <div className="container grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <Wallet className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-4 font-semibold">Non-custodial</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Aucun solde sur la plateforme : chaque ordre est réglé
              directement vers votre wallet ou votre compte bancaire.
            </p>
          </div>
          <div className="text-center">
            <Zap className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-4 font-semibold">Interac e-Transfer</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Le moyen de paiement le plus simple au Canada, pour acheter
              comme pour vendre.
            </p>
          </div>
          <div className="text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-4 font-semibold">Taux verrouillé</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Le taux CAD/USDT est figé à la création de votre ordre — aucun
              risque de variation pendant le paiement.
            </p>
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t py-8">
      <div className="container text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Ooble — Plateforme d'échange de
        stablecoins au Canada.
      </div>
    </footer>
  </div>
);

export default Index;
