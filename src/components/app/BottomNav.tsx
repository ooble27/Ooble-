import { useRef, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { House, Coins, HandCoins } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app", label: "Accueil", icon: House, end: true },
  { to: "/app/acheter", label: "Acheter", icon: Coins, end: false },
  { to: "/app/vendre", label: "Vendre", icon: HandCoins, end: false },
];

const BottomNav = () => {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!navRef.current) return;
    const active = navRef.current.querySelector<HTMLElement>("[data-active='true']");
    if (active) {
      const navRect = navRef.current.getBoundingClientRect();
      const elRect = active.getBoundingClientRect();
      setIndicator({ left: elRect.left - navRect.left, width: elRect.width });
    }
  }, [location.pathname]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div
        ref={navRef}
        className="relative flex w-auto items-center gap-1 rounded-[20px] border border-border bg-card/95 p-1.5 backdrop-blur-xl"
      >
        {/* Sliding indicator */}
        <div
          className="absolute top-1.5 h-[calc(100%-12px)] rounded-2xl bg-secondary transition-all duration-300 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />

        {items.map(({ to, label, icon: Icon, end }) => {
          const isActive = end
            ? location.pathname === to
            : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              data-active={isActive}
              className={cn(
                "relative z-10 flex items-center justify-center rounded-2xl py-[10px] transition-all duration-300",
                isActive ? "gap-2 px-[16px]" : "gap-0 px-[14px]",
              )}
            >
              <Icon
                size={20}
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
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
