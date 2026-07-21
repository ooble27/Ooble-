import { Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { cn } from "@/lib/utils";
import BottomNav from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
  /** Contenu d'en-tête à gauche (salutation, titre…). */
  header?: React.ReactNode;
  /** Affiche une flèche retour vers `backTo`. */
  backTo?: string;
  className?: string;
}

/** Coquille de l'app connectée : fond neutre, colonne centrée, barre du bas. */
const AppShell = ({ children, header, backTo, className }: AppShellProps) => (
  <div className="min-h-screen bg-[#F4F7F7]">
    <div className="mx-auto flex min-h-screen max-w-[460px] flex-col px-5 pb-28 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="flex items-start justify-between gap-4 pb-6 pt-2">
        <div className="flex min-w-0 items-start gap-3">
          {backTo && (
            <Link
              to={backTo}
              aria-label="Retour"
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-white text-foreground shadow-soft transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
          <div className="min-w-0">{header}</div>
        </div>
        <Link
          to="/app/compte"
          aria-label="Mon compte"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-white text-foreground shadow-soft transition-colors hover:bg-secondary"
        >
          <User className="h-5 w-5" strokeWidth={1.9} />
        </Link>
      </div>

      <div className={cn("flex-1", className)}>{children}</div>
    </div>

    <BottomNav />
  </div>
);

export default AppShell;
