import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <header className="sticky top-0 z-50 py-3">
      <div className="container">
        <div className="flex h-14 items-center justify-between rounded-full border bg-card/90 px-5 shadow-soft backdrop-blur-xl">
          <Logo />

          <nav className="hidden items-center gap-7 md:flex">
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

          <div className="hidden md:block">
            <Link
              to="/acheter"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
            >
              Commencer
            </Link>
          </div>

          <button
            className="text-muted-foreground md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <nav className="mt-2 rounded-2xl border bg-card p-3 shadow-soft md:hidden">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/acheter"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Commencer
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
