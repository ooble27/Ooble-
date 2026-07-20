import { Link } from "react-router-dom";
import { Banknote, Send, Timer } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderForm from "@/components/OrderForm";

const steps = [
  {
    icon: Timer,
    tint: "bg-accent-soft text-accent-ink",
    title: "Créez votre ordre",
    description:
      "Le taux se verrouille 15 minutes et une adresse de dépôt USDT vous est attribuée.",
  },
  {
    icon: Send,
    tint: "bg-butter text-butter-ink",
    title: "Envoyez vos USDT",
    description:
      "Depuis votre wallet, vers l'adresse de dépôt. Le suivi des confirmations est en temps réel.",
  },
  {
    icon: Banknote,
    tint: "bg-lilac text-lilac-ink",
    title: "Recevez votre e-Transfer",
    description:
      "Le paiement CAD part vers votre courriel Interac dès la confirmation de la transaction.",
  },
];

const Vendre = () => (
  <div className="grain min-h-screen bg-background">
    <Header />

    <section className="relative overflow-hidden">
      <div className="bg-halo absolute inset-0" aria-hidden />
      <main className="container relative grid gap-12 pb-24 pt-10 lg:grid-cols-[1fr_440px] lg:gap-16 lg:pt-16">
        <div>
          <Link
            to="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Accueil
          </Link>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur">
            Vente · USDT → CAD
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
            Vendre des USDT contre des{" "}
            <span className="italic text-accent-ink">dollars canadiens</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Envoyez vos USDT et recevez un Interac e-Transfer directement dans
            votre compte bancaire, dès la confirmation on-chain.
          </p>

          <ol className="mt-12 space-y-8">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${step.tint}`}
                  >
                    <step.icon className="h-5 w-5" />
                  </span>
                  {i < steps.length - 1 && (
                    <span className="mt-2 h-8 w-px bg-border" />
                  )}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:pt-14">
          <OrderForm side="sell" />
        </div>
      </main>
    </section>

    <Footer />
  </div>
);

export default Vendre;
