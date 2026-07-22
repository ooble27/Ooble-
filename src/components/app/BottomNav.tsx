import { useState } from "react";
import { NavLink } from "react-router-dom";
import { House, Coins, HandCoins, Sun, Moon } from "lucide-react";
import { getTheme, setTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app", label: "Accueil", icon: House, end: true },
  { to: "/app/acheter", label: "Acheter", icon: Coins, end: false },
  { to: "/app/vendre", label: "Vendre", icon: HandCoins, end: false },
];

/** Barre de navigation flottante (structure Terex, recolorée Ooble) + bascule de thème. */
const BottomNav = () => {
  const [theme, setThemeState] = useState<Theme>(getTheme);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-5 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="flex w-full max-w-[400px] items-center justify-around gap-1.5 rounded-[24px] border border-border bg-card/95 p-2 backdrop-blur-xl">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center justify-center rounded-2xl py-[13px] transition-all duration-300",
                isActive ? "gap-2 bg-secondary px-[18px]" : "gap-0 bg-transparent px-[15px]",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.1 : 1.7}
                  className={cn("shrink-0 transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}
                />
                <span
                  className={cn(
                    "overflow-hidden whitespace-nowrap text-[13px] font-semibold tracking-[0.01em] text-foreground transition-all duration-300",
                    isActive ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0",
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {/* Bascule clair / sombre */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          className="flex items-center justify-center rounded-2xl bg-transparent px-[15px] py-[13px] text-muted-foreground transition-colors hover:text-foreground active:scale-95"
        >
          {theme === "dark" ? <Sun size={21} strokeWidth={1.7} /> : <Moon size={21} strokeWidth={1.7} />}
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
