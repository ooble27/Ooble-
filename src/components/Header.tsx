import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import ThemeToggle from "./app/ThemeToggle";

const links = [
  { to: "/#comment", label: "Comment ça marche" },
  { to: "/#reseaux", label: "Réseaux" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

/**
 * En-tête public : navigation groupée en pastille au centre, actions à droite.
 * `inverted` l'adapte à un panneau `bg-foreground` en restant piloté par les
 * jetons, donc la bascule clair / sombre continue de fonctionner.
 */
const Header = ({ inverted }: { inverted?: boolean }) => {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const current = `${pathname}${hash}`;

  const toggleOnDark = inverted
    ? "border-background/20 bg-transparent text-background hover:bg-background/10"
    : undefined;

  return (
    <header className={cn("pt-safe relative z-40 bg-transparent", inverted && "text-background")}>
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-6 px-6 sm:px-10">
        <Logo inverted={inverted} />

        {/* Navigation groupée */}
        <nav
          className={cn(
            "hidden items-center gap-0.5 rounded-xl p-1 lg:flex",
            inverted ? "bg-background/10" : "bg-secondary",
          )}
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-[9px] px-3.5 py-2.5 text-sm transition-colors",
                inverted
                  ? "text-background/60 hover:bg-background/15 hover:text-background"
                  : "text-muted-foreground hover:bg-card hover:text-foreground",
                current === link.to && (inverted ? "text-background" : "bg-card text-foreground"),
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle className={cn("h-10 w-10", toggleOnDark)} />
          <Link
            to="/connexion"
            className={cn(
              "rounded-xl px-3.5 py-2.5 text-sm transition-colors",
              inverted
                ? "text-background/60 hover:text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Connexion
          </Link>
          <Button
            asChild
            variant="appSolid"
            shape="rounded"
            size="default"
            className={cn("h-10", inverted && "bg-background text-foreground")}
          >
            <Link to="/connexion">Ouvrir un compte</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className={cn("h-10 w-10", toggleOnDark)} />
          <button
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors active:scale-95",
              inverted
                ? "border-background/20 text-background hover:bg-background/10"
                : "border-border bg-card text-foreground hover:bg-secondary",
            )}
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)} />
          <div className="absolute right-5 top-[68px] z-50 w-60 rounded-2xl border border-border bg-background p-2 text-foreground shadow-[0_18px_44px_-16px_rgba(15,58,67,0.35)] md:hidden">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-1.5 h-px bg-border" />
            <Link
              to="/connexion"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Connexion
            </Link>
            <Button asChild variant="appSolid" shape="rounded" className="mt-1 w-full">
              <Link to="/connexion" onClick={() => setOpen(false)}>Ouvrir un compte</Link>
            </Button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
