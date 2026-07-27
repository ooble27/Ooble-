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
  icon: Icon,
  trailing,
  ...props
}: {
  icon: React.ElementType;
  trailing?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 transition-colors focus-within:border-foreground">
    <Icon className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.9} />
    <input
      className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
      {...props}
    />
    {trailing}
  </label>
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

  return (
    <div className="ink-neutral app-type flex min-h-screen flex-col bg-background tracking-[-0.015em]">
      <header className="flex items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-10">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          {!notice && (
            <>
              {step === 1 ? (
                <Link
                  to="/inscription"
                  className="mb-5 inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Type de compte
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={back}
                  className="mb-5 inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Informations sur l'entreprise
                </button>
              )}

              <div className="mb-6 flex items-center gap-1.5">
                {([1, 2] as Step[]).map((s) => (
                  <span
                    key={s}
                    className={cn("h-1 flex-1 rounded-full transition-colors", s <= step ? "bg-foreground" : "bg-border")}
                  />
                ))}
              </div>
            </>
          )}

          {notice ? (
            <>
              <h1 className="font-display text-[2rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]">
                Compte créé
              </h1>
              <div className="mt-7 rounded-2xl border border-border bg-secondary px-5 py-4 text-[14px] leading-relaxed text-foreground">
                {notice}
                <div className="mt-3">
                  <Link to="/connexion" className="font-medium underline underline-offset-4">
                    Aller à la connexion
                  </Link>
                </div>
              </div>
            </>
          ) : step === 1 ? (
            <>
              <h1 className="font-display text-[2rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]">
                Votre entreprise
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Quelques informations sur votre entreprise pour commencer.
              </p>

              <form onSubmit={goStep2} className="mt-7 space-y-3">
                <Field
                  icon={Building2}
                  type="text"
                  placeholder="Nom de l'entreprise"
                  autoComplete="organization"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
                <Field
                  icon={FileText}
                  type="text"
                  placeholder="Numéro d'entreprise (NEQ / BN)"
                  value={businessNumber}
                  onChange={(e) => setBusinessNumber(e.target.value)}
                />
                <Field
                  icon={MapPin}
                  type="text"
                  placeholder="Adresse de l'entreprise"
                  autoComplete="street-address"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                />
                <Field
                  icon={Phone}
                  type="tel"
                  placeholder="Téléphone de l'entreprise"
                  autoComplete="tel"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                />

                {error && (
                  <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] font-medium text-destructive">
                    {error}
                  </p>
                )}

                <div className="flex justify-end pt-1">
                  <Button type="submit" variant="appSolid" shape="rounded" size="default" className="px-6">
                    Continuer <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-display text-[2rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]">
                Votre compte
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Coordonnées du responsable pour {businessName || "votre entreprise"}.
              </p>

              <form onSubmit={submit} className="mt-7 space-y-3">
                <Field
                  icon={User}
                  type="text"
                  placeholder="Nom du responsable"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Field
                  icon={Mail}
                  type="email"
                  placeholder="Adresse e-mail"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Field
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" strokeWidth={1.9} /> : <Eye className="h-5 w-5" strokeWidth={1.9} />}
                    </button>
                  }
                />

                <p className="rounded-xl border border-border bg-secondary/60 px-4 py-3 text-[12.5px] leading-relaxed text-muted-foreground">
                  Les documents de votre entreprise (statuts constitutifs, etc.) pourront être ajoutés après la création de votre compte, depuis votre espace.
                </p>

                {error && (
                  <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] font-medium text-destructive">
                    {error}
                  </p>
                )}

                <div className="flex justify-end pt-1">
                  <Button type="submit" variant="appSolid" shape="rounded" size="default" className="px-6" disabled={busy}>
                    {busy ? "Un instant…" : "Créer mon compte"}
                    {!busy && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </>
          )}

          <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
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
