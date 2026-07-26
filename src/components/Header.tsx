import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
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
 * En-tête public. `inverted` l'adapte à un panneau `bg-foreground` en restant
 * piloté par les jetons, donc la bascule clair / sombre continue de marcher.
 */
const Header = ({ inverted }: { inverted?: boolean }) => {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const current = `${pathname}${hash}`;

  /* Le panneau mobile occupe tout l'écran : on gèle le défilement dessous. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const close = () => setOpen(false);

  const toggleOnDark = inverted
    ? "border-background/20 bg-transparent text-background hover:bg-background/10"
    : undefined;

  return (
    <header className={cn("pt-safe relative z-40 bg-transparent", inverted && "text-background")}>
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-8 px-6 sm:px-10">
        <Logo inverted={inverted} />

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "relative py-1 text-[15px] transition-colors",
                "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:transition-transform hover:after:scale-x-100",
                inverted
                  ? "text-background/60 after:bg-background hover:text-background"
                  : "text-muted-foreground after:bg-foreground hover:text-foreground",
                current === link.to && (inverted ? "text-background" : "text-foreground"),
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <ThemeToggle className={cn("h-10 w-10", toggleOnDark)} />
          <Link
            to="/connexion"
            className={cn(
              "px-2 text-[15px] transition-colors",
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
            className={cn("h-11 px-5 text-[15px]", inverted && "bg-background text-foreground")}
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
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Panneau mobile plein écran */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background text-foreground md:hidden">
          <div className="pt-safe flex h-full flex-col">
            <div className="flex h-[76px] shrink-0 items-center justify-between px-6">
              <Logo />
              <button
                onClick={close}
                aria-label="Fermer le menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-secondary active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 pt-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={close}
                  className="flex items-center justify-between gap-4 border-b py-5 font-display text-[1.7rem] tracking-[-0.035em] transition-opacity active:opacity-60"
                >
                  {link.label}
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.6} />
                </Link>
              ))}
            </nav>

            <div className="shrink-0 space-y-2.5 px-6 pb-10 pt-6">
              <Button asChild variant="appSolid" shape="rounded" size="lg" className="w-full text-[16px]">
                <Link to="/connexion" onClick={close}>Ouvrir un compte</Link>
              </Button>
              <Button asChild variant="secondary" shape="rounded" size="lg" className="w-full text-[16px]">
                <Link to="/connexion" onClick={close}>Connexion</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
