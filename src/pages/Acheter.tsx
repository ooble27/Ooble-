import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderForm from "@/components/OrderForm";
import { Banknote, ShieldCheck, Wallet } from "lucide-react";

const steps = [
  {
    icon: Banknote,
    iconClass: "bg-emerald-50 text-emerald-600",
    title: "1. Créez votre ordre",
    description:
      "Le taux est verrouillé 15 minutes — les instructions Interac s'affichent immédiatement.",
  },
  {
    icon: ShieldCheck,
    iconClass: "bg-sky-50 text-sky-600",
    title: "2. Envoyez le e-Transfer",
    description:
      "Depuis votre banque, comme n'importe quel virement Interac. Confirmation dès réception.",
  },
  {
    icon: Wallet,
    iconClass: "bg-violet-50 text-violet-600",
    title: "3. Recevez vos USDT",
    description:
      "Envoi on-chain direct vers votre adresse, avec le hash de transaction comme reçu.",
  },
];

const Acheter = () => (
  <div className="min-h-screen bg-background">
    <Header />

    <main className="container grid gap-12 py-14 lg:grid-cols-[1fr_460px] lg:gap-16 lg:py-20">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
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
          {steps.map((step) => (
            <li key={step.title} className="flex gap-4">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${step.iconClass}`}
              >
                <step.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <OrderForm side="buy" />
    </main>

    <Footer />
  </div>
);

export default Acheter;
