import { Link, NavLink } from "react-router-dom";
import { ArrowLeft, User, House, Coins, HandCoins } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
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
  /** Centre verticalement le contenu sur mobile (écrans courts de saisie). */
  center?: boolean;
  className?: string;
}

const navItems = [
  { to: "/app", label: "Accueil", icon: House, end: true },
  { to: "/app/acheter", label: "Acheter", icon: Coins, end: false },
  { to: "/app/vendre", label: "Vendre", icon: HandCoins, end: false },
];

const sideLink = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
    isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
  );

/** Coquille de l'app connectée : barre latérale (desktop) / barre du bas (mobile). */
const AppShell = ({ children, header, backTo, wide, center, className }: AppShellProps) => (
  <div className="app-type min-h-screen bg-background">
    {/* Barre latérale — desktop / tablette */}
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-background px-4 py-6 lg:flex">
      <div className="px-2">
        <Logo />
      </div>
      <nav className="mt-10 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={sideLink}>
            <Icon className="h-5 w-5" strokeWidth={1.9} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-2">
        <NavLink to="/app/compte" className={cn(sideLink, "flex-1")}>
          <User className="h-5 w-5" strokeWidth={1.9} /> Mon compte
        </NavLink>
        <ThemeToggle />
      </div>
    </aside>

    {/* Colonne principale */}
    <div className="lg:pl-60">
      <div
        className={cn(
          "mx-auto flex min-h-screen flex-col px-5 pb-28 pt-[max(1.25rem,env(safe-area-inset-top))] md:px-8 lg:pb-16 lg:pt-10",
          wide ? "max-w-[400px] lg:max-w-[960px]" : "max-w-[400px] lg:max-w-[620px]",
        )}
      >
        {/* Barre du haut */}
        <div className="flex items-start justify-between gap-4 pb-6 pt-2 lg:pb-8">
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
          {/* Avatar : mobile uniquement (sur desktop il est dans la barre latérale) */}
          <Link
            to="/app/compte"
            aria-label="Mon compte"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-secondary active:scale-95 lg:hidden"
          >
            <User className="h-5 w-5" strokeWidth={1.8} />
          </Link>
        </div>

        <div
          className={cn(
            "flex-1",
            center && "flex flex-col justify-center pb-[26vh] lg:justify-start lg:pb-0",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
);

export default AppShell;
