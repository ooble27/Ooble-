import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/app/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

type Mode = "login" | "forgot";

function traduireErreur(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou mot de passe incorrect.";
  if (m.includes("email not confirmed")) return "Adresse e-mail non confirmée — vérifiez votre boîte mail.";
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

const Connexion = () => {
  const navigate = useNavigate();
  const { signIn, sendPasswordReset } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isForgot = mode === "forgot";

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setNotice(null);
    setShowPassword(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (isForgot) {
        const res = await sendPasswordReset(email);
        if (res.error) return setError(traduireErreur(res.error));
        setNotice("Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé. Vérifiez votre boîte mail.");
        return;
      }
      const res = await signIn(email, password);
      if (res.error) return setError(traduireErreur(res.error));
      navigate("/app", { replace: true });
    } finally {
      setBusy(false);
    }
  };

  const title = isForgot ? "Mot de passe oublié" : "Bon retour";
  const subtitle = isForgot
    ? "Entrez votre adresse e-mail : nous vous enverrons un lien pour définir un nouveau mot de passe."
    : "Connectez-vous pour acheter et vendre vos USDT.";

  return (
    <div className="ink-neutral app-type flex min-h-screen flex-col bg-background tracking-[-0.015em]">
      <header className="flex items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-10">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          {isForgot && (
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="mb-6 inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Retour à la connexion
            </button>
          )}

          <h1 className="font-display text-[2rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]">
            {title}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{subtitle}</p>

          <form onSubmit={submit} className="mt-7 space-y-3">
            <Field
              icon={Mail}
              type="email"
              placeholder="Adresse e-mail"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {!isForgot && (
              <Field
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                autoComplete="current-password"
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
            )}

            {mode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-sm text-foreground hover:underline"
                >
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
              <p className="rounded-xl border border-border bg-secondary px-4 py-3 text-[13px] leading-relaxed text-foreground">
                {notice}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <Button type="submit" variant="appSolid" shape="rounded" size="default" className="px-6" disabled={busy}>
                {busy ? "Un instant…" : isForgot ? "Envoyer le lien" : "Se connecter"}
                {!busy && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </form>

          {!isForgot && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Nouveau sur Ooble ?{" "}
              <Link
                to="/inscription"
                className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
              >
                Créer un compte
              </Link>
            </p>
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

export default Connexion;
