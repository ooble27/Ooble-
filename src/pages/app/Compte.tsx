import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, KeyRound } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { getUser, clearUser } from "@/lib/session";

const Compte = () => {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    clearUser();
    navigate("/", { replace: true });
  };

  return (
    <AppShell
      header={
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Mon compte</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">Profil et sécurité</p>
        </div>
      }
    >
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-deep font-display text-xl font-bold text-white">
          {user?.name?.charAt(0).toUpperCase() ?? "O"}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold">{user?.name}</p>
          <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-white">
        <div className="flex items-center gap-3 px-5 py-4">
          <ShieldCheck className="h-5 w-5 text-accent-ink" strokeWidth={1.9} />
          <span className="flex-1 text-sm font-medium">Vérification d'identité</span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            Bientôt
          </span>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <KeyRound className="h-5 w-5 text-accent-ink" strokeWidth={1.9} />
          <span className="flex-1 text-sm font-medium">Non-custodial — vos clés, vos USDT</span>
        </div>
      </div>

      <Button variant="appOutline" shape="soft" size="lg" className="mt-6 w-full" onClick={logout}>
        <LogOut className="h-4 w-4" /> Se déconnecter
      </Button>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
        Démo front-end — l'authentification sécurisée sera bientôt disponible.
      </p>
    </AppShell>
  );
};

export default Compte;
