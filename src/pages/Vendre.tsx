import { Link } from "react-router-dom";
import { Banknote, Send, Timer } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderForm from "@/components/OrderForm";

const steps = [
  {
    icon: Timer,
    title: "Créez votre ordre",
    description:
      "Le taux se verrouille 15 minutes et une adresse de dépôt USDT vous est attribuée.",
  },
  {
    icon: Send,
    title: "Envoyez vos USDT",
    description:
      "Depuis votre wallet, vers l'adresse de dépôt. Le suivi des confirmations est en temps réel.",
  },
  {
    icon: Banknote,
    title: "Recevez votre e-Transfer",
    description:
      "Le paiement CAD part vers votre courriel Interac dès la confirmation de la transaction.",
  },
];

const Vendre = () => (
  <div className="guide-lines min-h-screen bg-background">
    <Header />
    <div className="h-16" />

    <main className="relative z-[1] mx-auto grid max-w-[1120px] gap-12 px-6 pb-24 pt-12 sm:px-8 lg:grid-cols-[1fr_440px] lg:gap-16 lg:pt-16">
      <div>
        <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-white">
          ← Accueil
        </Link>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-hair bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
          Vente · USDT → CAD
        </span>
        <h1 className="mt-5 text-[2.2rem] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[2.8rem]">
          Vendre des USDT contre des dollars canadiens
        </h1>
        <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted-foreground">
          Envoyez vos USDT et recevez un Interac e-Transfer directement dans
          votre compte bancaire, dès la confirmation on-chain.
        </p>

        <ol className="mt-12 space-y-8">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-5">
              <div className="flex flex-col items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-icon">
                  <step.icon className="h-5 w-5 text-white/85" strokeWidth={1.8} />
                </span>
                {i < steps.length - 1 && <span className="mt-2 h-8 w-px bg-white/10" />}
              </div>
              <div className="pt-1.5">
                <h3 className="text-lg font-semibold">
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

    <Footer />
  </div>
);

export default Vendre;
