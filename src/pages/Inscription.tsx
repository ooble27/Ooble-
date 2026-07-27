import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/app/ThemeToggle";

const IndividualArt = () => (
  <svg viewBox="0 0 240 120" fill="none" className="h-full w-full" aria-hidden>
    <circle cx="108" cy="60" r="28" stroke="hsl(174 58% 38%)" strokeWidth="2.5" opacity="0.7" />
    <circle cx="132" cy="60" r="28" stroke="white" strokeWidth="2.5" opacity="0.9" />
    <circle cx="56" cy="32" r="4" fill="hsl(174 58% 38%)" opacity="0.15" />
    <circle cx="184" cy="88" r="3" fill="white" opacity="0.18" />
    <circle cx="42" cy="82" r="2.5" fill="hsl(174 58% 38%)" opacity="0.1" />
    <circle cx="198" cy="38" r="5" fill="white" opacity="0.08" />
  </svg>
);

const EnterpriseArt = () => (
  <svg viewBox="0 0 240 120" fill="none" className="h-full w-full" aria-hidden>
    <circle cx="82" cy="48" r="18" stroke="hsl(174 58% 38%)" strokeWidth="2" opacity="0.55" />
    <circle cx="98" cy="48" r="18" stroke="white" strokeWidth="2" opacity="0.7" />
    <circle cx="134" cy="38" r="22" stroke="hsl(174 58% 38%)" strokeWidth="2.2" opacity="0.65" />
    <circle cx="152" cy="38" r="22" stroke="white" strokeWidth="2.2" opacity="0.85" />
    <circle cx="106" cy="76" r="16" stroke="hsl(174 58% 38%)" strokeWidth="1.8" opacity="0.45" />
    <circle cx="120" cy="76" r="16" stroke="white" strokeWidth="1.8" opacity="0.6" />
    <circle cx="48" cy="28" r="3" fill="white" opacity="0.1" />
    <circle cx="192" cy="90" r="4" fill="hsl(174 58% 38%)" opacity="0.12" />
  </svg>
);

const Inscription = () => {
  const navigate = useNavigate();

  const cards = [
    {
      key: "individuel",
      path: "/inscription/individuel",
      art: <IndividualArt />,
      title: "Compte individuel",
      desc: "Pour acheter et vendre des USDT en votre nom propre.",
      features: ["Vérification rapide", "Interac e-Transfer", "Envoi direct vers votre wallet"],
    },
    {
      key: "entreprise",
      path: "/inscription/entreprise",
      art: <EnterpriseArt />,
      title: "Compte entreprise",
      desc: "Pour une société, un OBNL ou une organisation.",
      features: ["Accès OTC sur demande", "Interac e-Transfer", "Envoi direct vers votre wallet"],
    },
  ];

  return (
    <div className="ink-neutral app-type flex min-h-screen flex-col bg-background tracking-[-0.015em]">
      <header className="flex items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-10">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[560px]">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Inscription
          </p>
          <h1 className="mt-3 font-display text-[2.1rem] leading-[1.05] tracking-[-0.04em] sm:text-[2.6rem]">
            Créez votre compte
          </h1>
          <p className="mt-3 max-w-[380px] text-[15px] leading-relaxed text-muted-foreground">
            Choisissez le type de compte qui vous correspond.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {cards.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => navigate(c.path)}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lift"
              >
                <div className="relative flex h-[140px] items-center justify-center overflow-hidden bg-deep deco-dots-inv">
                  <div className="w-[200px]">{c.art}</div>
                </div>

                <div className="px-5 pb-5 pt-4">
                  <h3 className="font-display text-[17px] tracking-[-0.02em]">{c.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-muted-foreground">{c.desc}</p>

                  <ul className="mt-4 space-y-1.5">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.2} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center gap-1.5 text-[13px] text-primary">
                    Commencer
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link
              to="/connexion"
              className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Inscription;
