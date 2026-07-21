import { NavLink } from "react-router-dom";
import { Home, Coins, HandCoins } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app", label: "Accueil", icon: Home, end: true },
  { to: "/app/acheter", label: "Acheter", icon: Coins, end: false },
  { to: "/app/vendre", label: "Vendre", icon: HandCoins, end: false },
];

/** Barre d'onglets pleine largeur, posée en bas (texture application). */
const BottomNav = () => (
  <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/90 backdrop-blur-xl">
    <div className="mx-auto flex max-w-[460px] items-stretch justify-around px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground",
            )
          }
        >
          <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNav;
