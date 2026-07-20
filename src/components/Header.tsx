import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="container px-0">
        <div
          className={cn(
            "flex h-14 items-center justify-between rounded-full border pl-5 pr-2 transition-all duration-300",
            scrolled
              ? "border-border bg-card/85 shadow-soft backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <Logo />

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground",
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
              className="group inline-flex items-center gap-1.5 rounded-full bg-primary py-2.5 pl-5 pr-4 text-sm font-semibold text-primary-foreground transition-all hover:gap-2.5"
            >
              Commencer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            className="p-2 text-foreground md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <nav className="mt-2 rounded-3xl border bg-card p-3 shadow-lift md:hidden">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/acheter"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
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
