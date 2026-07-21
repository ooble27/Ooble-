import { NavLink } from "react-router-dom";
import { Home, Coins, HandCoins, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app", label: "Accueil", icon: Home, end: true },
  { to: "/app/acheter", label: "Acheter", icon: Coins, end: false },
  { to: "/app/vendre", label: "Vendre", icon: HandCoins, end: false },
  { to: "/app/envoyer", label: "Envoyer", icon: Send, end: false },
];

/** Barre de navigation flottante style application. */
const BottomNav = () => (
  <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
    <div className="pointer-events-auto flex w-full max-w-[440px] items-center justify-between gap-1 rounded-full border border-border bg-white/90 p-1.5 backdrop-blur-xl">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors",
              isActive
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="h-5 w-5" strokeWidth={2} />
              {isActive && <span className="pr-1">{label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNav;
