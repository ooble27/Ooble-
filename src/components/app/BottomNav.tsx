import { NavLink } from "react-router-dom";
import { House, Coins, HandCoins } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app", label: "Accueil", icon: House, end: true },
  { to: "/app/acheter", label: "Acheter", icon: Coins, end: false },
  { to: "/app/vendre", label: "Vendre", icon: HandCoins, end: false },
];

/** Barre de navigation flottante (structure Terex, recolorée Ooble). */
const BottomNav = () => (
  <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-5 pb-[calc(1rem+env(safe-area-inset-bottom))]">
    <div className="flex w-full max-w-[390px] items-center justify-around gap-1.5 rounded-[24px] border border-border bg-white/95 p-2 backdrop-blur-xl">
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
    </div>
  </div>
);

export default BottomNav;
