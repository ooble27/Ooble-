import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/session";
import BottomNav from "./BottomNav";
import ThemeToggle from "./ThemeToggle";

interface AppShellProps {
  children: React.ReactNode;
  /** Contenu d'en-tête à gauche (salutation, titre…). */
  header?: React.ReactNode;
  /** Affiche une flèche retour vers `backTo`. */
  backTo?: string;
  /** Élargit la colonne sur desktop (tableau de bord). */
  wide?: boolean;
  className?: string;
}

/** Coquille de l'app connectée : fond neutre, colonne centrée, barre du bas. */
const AppShell = ({ children, header, backTo, wide, className }: AppShellProps) => {
  const initial = getUser()?.name?.charAt(0).toUpperCase() ?? "O";
  return (
  <div className="app-type min-h-screen bg-background">
    <div
      className={cn(
        "mx-auto flex min-h-screen flex-col px-5 pb-28 pt-[max(1.25rem,env(safe-area-inset-top))] md:px-8",
        wide ? "max-w-[600px]" : "max-w-[480px]",
      )}
    >
      <div className="flex items-start justify-between gap-4 pb-6 pt-2">
        <div className="flex min-w-0 items-start gap-3">
          {backTo && (
            <Link
              to={backTo}
              aria-label="Retour"
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-secondary active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
          <div className="min-w-0">{header}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            to="/app/compte"
            aria-label="Mon compte"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-deep font-display text-base font-bold text-white transition-all hover:opacity-90 active:scale-95"
          >
            {initial}
          </Link>
        </div>
      </div>

      <div className={cn("flex-1", className)}>{children}</div>
    </div>

    <BottomNav />
  </div>
  );
};

export default AppShell;
