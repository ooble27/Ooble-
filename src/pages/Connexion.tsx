import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/app/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

/** Traduit les messages d'erreur Supabase les plus fréquents. */
function traduireErreur(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou mot de passe incorrect.";
  if (m.includes("already registered") || m.includes("already been registered")) return "Un compte existe déjà avec cet e-mail.";
  if (m.includes("password should be at least")) return "Le mot de passe doit contenir au moins 6 caractères.";
  if (m.includes("email not confirmed")) return "Adresse e-mail non confirmée — vérifiez votre boîte mail.";
  if (m.includes("unable to validate email")) return "Adresse e-mail invalide.";
  return message;
}

const Field = ({
  icon: Icon,
  ...props
}: { icon: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 transition-colors focus-within:border-foreground">
    <Icon className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.9} />
    <input
      className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
      {...props}
    />
  </label>
);

const Connexion = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isRegister = mode === "register";

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setNotice(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (isRegister) {
        const res = await signUp(email, password, name);
        if (res.error) return setError(traduireErreur(res.error));
        if (res.needsConfirmation) {
          setNotice("Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.");
          setMode("login");
          return;
        }
        navigate("/app", { replace: true });
      } else {
        const res = await signIn(email, password);
        if (res.error) return setError(traduireErreur(res.error));
        navigate("/app", { replace: true });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-type flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {isRegister ? "Créez votre compte" : "Bon retour"}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            {isRegister
              ? "Achetez et vendez des USDT en dollars canadiens, en gardant vos clés."
              : "Connectez-vous pour acheter et vendre vos USDT."}
          </p>

          {/* Bascule connexion / inscription */}
          <div className="mt-7 grid grid-cols-2 gap-1 rounded-lg border border-border bg-secondary/60 p-1">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={cn(
                  "rounded-md py-2.5 text-sm font-semibold transition-colors",
                  mode === m ? "bg-card text-foreground dark:bg-neutral-600" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "login" ? "Se connecter" : "S'inscrire"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-3">
            {isRegister && (
              <Field
                icon={User}
                type="text"
                placeholder="Nom complet"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
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
              type="password"
              placeholder="Mot de passe"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {!isRegister && (
              <div className="flex justify-end">
                <button type="button" className="text-sm font-medium text-foreground hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] font-medium text-destructive">
                {error}
              </p>
            )}
            {notice && (
              <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-[13px] font-medium text-foreground">
                {notice}
              </p>
            )}

            <Button type="submit" variant="appPrimary" shape="soft" size="lg" disabled={busy} className="mt-2 w-full">
              {busy ? "Un instant…" : isRegister ? "Créer mon compte" : "Se connecter"}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isRegister ? "Vous avez déjà un compte ? " : "Nouveau sur Ooble ? "}
            <button
              type="button"
              onClick={() => switchMode(isRegister ? "login" : "register")}
              className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              {isRegister ? "Se connecter" : "Créer un compte"}
            </button>
          </p>

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

export default Connexion;
