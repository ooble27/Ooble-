import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

const links = [
  { to: "/acheter", label: "Acheter" },
  { to: "/vendre", label: "Vendre" },
  { to: "/#comment", label: "Comment ça marche" },
  { to: "/#faq", label: "FAQ" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    // Header dans le flux normal (mobile comme desktop) : il défile avec la
    // page, aucune barre ne reste collée au scroll.
    <header className="pt-safe relative z-40 border-b border-border/70 bg-background">
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

        <div className="hidden items-center gap-1.5 md:flex">
          <Button asChild variant="ghost" shape="rounded" size="default">
            <Link to="/acheter">Se connecter</Link>
          </Button>
          <Button asChild variant="primary" shape="rounded" size="default">
            <Link to="/acheter">Commencer</Link>
          </Button>
        </div>

        <button className="p-2 text-foreground md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t bg-background px-6 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="primary" shape="rounded" className="mt-2 w-full">
            <Link to="/acheter" onClick={() => setOpen(false)}>
              Commencer
            </Link>
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
