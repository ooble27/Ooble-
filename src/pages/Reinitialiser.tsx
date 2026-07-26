import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Eye, EyeOff, Lock } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/app/ThemeToggle";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

/**
 * Définition d'un nouveau mot de passe, après clic sur le lien reçu par courriel.
 * Supabase traite le jeton présent dans l'URL (detectSessionInUrl) et émet un
 * évènement PASSWORD_RECOVERY : on n'autorise le formulaire qu'une fois ce
 * contexte de récupération établi.
 */
const Reinitialiser = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Le lien ouvre la page avec un jeton de récupération : on attend que
    // Supabase l'ait échangé contre une session avant d'ouvrir le formulaire.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await updatePassword(password);
    setBusy(false);
    if (res.error) {
      setError("Le lien a peut-être expiré. Redemandez un lien de réinitialisation.");
      return;
    }
    setDone(true);
    setTimeout(() => navigate("/app", { replace: true }), 1400);
  };

  return (
    <div className="ink-neutral app-type flex min-h-screen flex-col bg-background tracking-[-0.015em]">
      <header className="flex items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-10">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          {done ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background">
                <Check className="h-6 w-6" strokeWidth={2.2} />
              </span>
              <h1 className="mt-6 font-display text-[1.8rem] tracking-[-0.03em]">Mot de passe modifié</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Vous allez être redirigé vers votre espace…
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-[2rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]">
                Nouveau mot de passe
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Choisissez un nouveau mot de passe pour votre compte Ooble.
              </p>

              {ready ? (
                <form onSubmit={submit} className="mt-7 space-y-3">
                  <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 transition-colors focus-within:border-foreground">
                    <Lock className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.9} />
                    <input
                      type={show ? "text" : "password"}
                      placeholder="Nouveau mot de passe"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {show ? <EyeOff className="h-5 w-5" strokeWidth={1.9} /> : <Eye className="h-5 w-5" strokeWidth={1.9} />}
                    </button>
                  </label>

                  {error && (
                    <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] font-medium text-destructive">
                      {error}
                    </p>
                  )}

                  <div className="pt-1">
                    <Button type="submit" variant="appSolid" shape="rounded" size="lg" className="w-full" disabled={busy}>
                      {busy ? "Un instant…" : "Enregistrer"}
                      {!busy && <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="mt-7 rounded-xl border border-border bg-secondary px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
                  Ouvrez cette page depuis le lien reçu par courriel. Si vous y êtes
                  déjà,{" "}
                  <Link to="/connexion" className="text-foreground underline underline-offset-2">
                    redemandez un lien
                  </Link>
                  .
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reinitialiser;
