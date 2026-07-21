import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { setUser } from "@/lib/session";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

/** Dérive un nom d'affichage depuis l'adresse e-mail (mode connexion). */
function nameFromEmail(email: string): string {
  const local = email.split("@")[0] || "Ami";
  const clean = local.replace(/[._-]+/g, " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

const Field = ({
  icon: Icon,
  ...props
}: { icon: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="flex items-center gap-3 rounded-2xl border border-input bg-white px-4 py-3.5 transition-colors focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
    <Icon className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.9} />
    <input
      className="w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
      {...props}
    />
  </label>
);

const Connexion = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = mode === "register";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const display = isRegister && name.trim() ? name.trim() : nameFromEmail(email);
    // Démo front-end : aucune vérification, on mémorise juste la session.
    setUser({ name: display, email: email.trim() });
    navigate("/app", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7F7]">
      <header className="px-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <Logo />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            {isRegister ? "Créez votre compte" : "Bon retour"}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            {isRegister
              ? "Achetez et vendez des USDT en dollars canadiens, en gardant vos clés."
              : "Connectez-vous pour acheter et vendre vos USDT."}
          </p>

          {/* Bascule connexion / inscription */}
          <div className="mt-7 grid grid-cols-2 gap-1 rounded-full border border-border/70 bg-white p-1 shadow-soft">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-full py-2.5 text-sm font-semibold transition-colors",
                  mode === m ? "bg-primary text-primary-foreground shadow-teal" : "text-muted-foreground hover:text-foreground",
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
                <button type="button" className="text-sm font-medium text-primary hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <Button type="submit" size="lg" className="mt-2 w-full">
              {isRegister ? "Créer mon compte" : "Se connecter"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isRegister ? "Vous avez déjà un compte ? " : "Nouveau sur Ooble ? "}
            <button
              type="button"
              onClick={() => setMode(isRegister ? "login" : "register")}
              className="font-semibold text-primary hover:underline"
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
