import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { getTheme, setTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Bouton bascule mode clair / sombre. */
const ThemeToggle = ({ className }: { className?: string }) => {
  const [theme, setThemeState] = useState<Theme>(getTheme);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-secondary active:scale-95",
        className,
      )}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" strokeWidth={1.8} /> : <Moon className="h-5 w-5" strokeWidth={1.8} />}
    </button>
  );
};

export default ThemeToggle;
