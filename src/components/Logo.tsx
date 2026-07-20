import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => (
  <Link to="/" className={cn("group flex items-center gap-2.5", className)}>
    <span className="relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-foreground">
      <svg viewBox="0 0 32 32" className="h-8 w-8">
        <circle
          cx="12.5"
          cy="16"
          r="4.6"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="2.4"
        />
        <circle
          cx="20.5"
          cy="16"
          r="4.6"
          fill="none"
          stroke="hsl(var(--card))"
          strokeWidth="2.4"
        />
      </svg>
    </span>
    <span className="font-display text-[1.35rem] font-semibold leading-none tracking-tight">
      Ooble
    </span>
  </Link>
);

export default Logo;
