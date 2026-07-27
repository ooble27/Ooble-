import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, Eye, EyeOff, FileText, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/app/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Step = 1 | 2;

function traduireErreur(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered")) return "Un compte existe déjà avec cet e-mail.";
  if (m.includes("password should be at least")) return "Le mot de passe doit contenir au moins 6 caractères.";
  if (m.includes("unable to validate email")) return "Adresse e-mail invalide.";
  return message;
}

const Field = ({
  label,
  icon: Icon,
  trailing,
  last,
  ...props
}: {
  label: string;
  icon: React.ElementType;
  trailing?: React.ReactNode;
  last?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div
    className={cn(
      "flex items-center gap-3 px-4 py-3.5 transition-colors focus-within:bg-primary/[0.03]",
      !last && "border-b border-border/50",
    )}
  >
    <Icon className="h-[18px] w-[18px] shrink-0 text-muted-foreground/50" strokeWidth={1.6} />
    <div className="min-w-0 flex-1">
      <span className="block text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground/60">
        {label}
      </span>
      <input
        className="mt-0.5 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground/30"
        {...props}
      />
    </div>
    {trailing}
  </div>
);

const InscriptionEntreprise = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [step, setStep] = useState<Step>(1);

  const [businessName, setBusinessName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const goStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setError("Le nom de l'entreprise est requis.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await signUp(email, password, name, {
        accountType: "business",
        businessName: businessName.trim(),
        businessNumber: businessNumber.trim() || undefined,
        businessAddress: businessAddress.trim() || undefined,
        businessPhone: businessPhone.trim() || undefined,
      });
      if (res.error) return setError(traduireErreur(res.error));
      if (res.needsConfirmation) {
        setNotice("Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.");
        return;
      }
      navigate("/app", { replace: true });
    } finally {
      setBusy(false);
    }
  };

  const back = () => {
    setError(null);
    setStep(1);
  };

  const stepLabels = ["Entreprise", "Responsable"];

  return (
    <div className="ink-neutral app-type flex min-h-screen flex-col bg-background tracking-[-0.015em]">
      <header className="flex items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-10">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[440px]">
          {!notice && (
            <>
              {step === 1 ? (
                <Link
                  to="/inscription"
                  className="mb-6 inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Type de compte
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={back}
                  className="mb-6 inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Informations entreprise
                </button>
              )}

              {/* Step indicator */}
              <div className="mb-8 flex items-center">
                {stepLabels.map((lbl, i) => {
                  const s = (i + 1) as Step;
                  const active = s <= step;
                  return (
                    <div key={lbl} className="flex flex-1 items-center">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-[12px] transition-colors",
                            active
                              ? "bg-foreground text-background"
                              : "border border-border text-muted-foreground",
                          )}
                        >
                          {s}
                        </span>
                        <span className={cn("text-[12px]", active ? "text-foreground" : "text-muted-foreground/60")}>
                          {lbl}
                        </span>
                      </div>
                      {i < stepLabels.length - 1 && (
                        <div className={cn("mx-3 h-px flex-1 transition-colors", step > s ? "bg-foreground" : "bg-border")} />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {notice ? (
            <>
              <h1 className="font-display text-[2rem] leading-[1.05] tracking-[-0.04em] sm:text-[2.4rem]">
                Compte créé
              </h1>
              <div className="mt-8 overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.04]">
                <div className="px-5 py-5 text-[14px] leading-relaxed text-foreground">
                  {notice}
                  <div className="mt-4">
                    <Link
                      to="/connexion"
                      className="inline-flex items-center gap-2 text-[13px] text-primary hover:underline"
                    >
                      Aller à la connexion <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : step === 1 ? (
            <>
              <h1 className="font-display text-[2rem] leading-[1.05] tracking-[-0.04em] sm:text-[2.4rem]">
                Votre entreprise
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Quelques informations sur votre organisation.
              </p>

              <form onSubmit={goStep2} className="mt-8">
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <Field
                    label="Raison sociale"
                    icon={Building2}
                    type="text"
                    autoComplete="organization"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                  <Field
                    label="Numéro d'entreprise (NEQ / BN)"
                    icon={FileText}
                    type="text"
                    value={businessNumber}
                    onChange={(e) => setBusinessNumber(e.target.value)}
                    placeholder="Optionnel"
                  />
                  <Field
                    label="Adresse"
                    icon={MapPin}
                    type="text"
                    autoComplete="street-address"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Optionnel"
                  />
                  <Field
                    label="Téléphone"
                    icon={Phone}
                    type="tel"
                    autoComplete="tel"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    placeholder="Optionnel"
                    last
                  />
                </div>

                {error && (
                  <p className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
                    {error}
                  </p>
                )}

                <div className="mt-5 flex justify-end">
                  <Button type="submit" variant="appSolid" shape="rounded" size="default" className="px-6">
                    Continuer <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-display text-[2rem] leading-[1.05] tracking-[-0.04em] sm:text-[2.4rem]">
                Personne responsable
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Coordonnées du responsable pour {businessName || "votre entreprise"}.
              </p>

              <form onSubmit={submit} className="mt-8">
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <Field
                    label="Nom complet"
                    icon={User}
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Field
                    label="Adresse e-mail"
                    icon={Mail}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Field
                    label="Mot de passe"
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    last
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        className="shrink-0 text-muted-foreground/50 transition-colors hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.6} /> : <Eye className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                      </button>
                    }
                  />
                </div>

                <p className="mt-3 rounded-xl border border-border/60 bg-secondary/50 px-4 py-3 text-[12px] leading-relaxed text-muted-foreground">
                  Les documents de votre entreprise (statuts constitutifs, etc.) pourront être ajoutés depuis votre espace après la création du compte.
                </p>

                {error && (
                  <p className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
                    {error}
                  </p>
                )}

                <div className="mt-5 flex justify-end">
                  <Button type="submit" variant="appSolid" shape="rounded" size="default" className="px-6" disabled={busy}>
                    {busy ? "Un instant…" : "Créer mon compte"}
                    {!busy && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </>
          )}

          <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground">
            Non-custodial — vos USDT vont directement dans votre wallet.{" "}
            <Link to="/" className="underline hover:text-foreground">
              Retour à l'accueil
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default InscriptionEntreprise;
