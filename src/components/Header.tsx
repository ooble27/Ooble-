import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import ThemeToggle from "./app/ThemeToggle";

const links = [
  { to: "/#comment", label: "Comment ça marche" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="pt-safe relative z-40 bg-transparent">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.to && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button asChild variant="ghost" shape="rounded" size="default">
            <Link to="/connexion">Se connecter</Link>
          </Button>
          <Button asChild variant="primary" shape="rounded" size="default">
            <Link to="/connexion">Commencer</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-secondary active:scale-95"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile — petit dropdown solide, ancré en haut à droite */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)} />
          <div className="absolute right-5 top-[58px] z-50 w-56 rounded-2xl border border-border bg-background p-2 shadow-[0_18px_44px_-16px_rgba(15,58,67,0.35)] md:hidden">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-1.5 h-px bg-border" />
            <Link
              to="/connexion"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Se connecter
            </Link>
            <Button asChild variant="primary" shape="rounded" className="mt-1 w-full">
              <Link to="/connexion" onClick={() => setOpen(false)}>Commencer</Link>
            </Button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
