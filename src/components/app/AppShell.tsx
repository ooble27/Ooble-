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
  /** Élargit la colonne sur tablette/desktop (tableau de bord uniquement). */
  wide?: boolean;
  /** Centre verticalement le contenu (écrans courts de saisie). */
  center?: boolean;
  className?: string;
}

/**
 * Coquille de l'app connectée. Sur desktop, la barre du haut occupe toujours
 * la même largeur (colonne max-w-[960px]) : l'avatar reste donc FIXE, au même
 * endroit sur toutes les pages. Le tableau de bord (`wide`) utilise toute cette
 * largeur ; les pages de saisie gardent une colonne un peu plus large que le
 * mobile (600px, alignée à gauche) pour respirer sans être trop grosses.
 */
const AppShell = ({ children, header, backTo, wide, center, className }: AppShellProps) => (
  <div className="app-type min-h-screen bg-background">
    <div className="mx-auto flex min-h-screen max-w-[400px] flex-col px-5 pb-28 pt-[max(1.25rem,env(safe-area-inset-top))] lg:max-w-[960px]">
      {/* Barre du haut — largeur constante, avatar toujours au même endroit */}
      <div className="flex items-start justify-between gap-4 pb-6 pt-2 lg:pb-10 lg:pt-4">
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
        <Link
          to="/app/compte"
          aria-label="Mon compte"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-secondary active:scale-95"
        >
          <User className="h-5 w-5" strokeWidth={1.8} />
        </Link>
      </div>

      <div
        className={cn(
          "flex-1",
          !wide && "lg:mx-auto lg:w-full lg:max-w-[600px]",
          center && "flex flex-col justify-center pb-[26vh] lg:justify-start lg:pb-0",
          className,
        )}
      >
        {children}
      </div>
    </div>

    <BottomNav />
  </div>
);

export default AppShell;
