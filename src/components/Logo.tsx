import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => (
  <Link to="/" className={cn("flex items-center gap-2.5", className)}>
    <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-white/[0.06] ring-1 ring-white/10">
      <svg viewBox="0 0 32 32" className="h-8 w-8">
        <circle cx="12.5" cy="16" r="4.6" fill="none" stroke="hsl(172 44% 46%)" strokeWidth="2.4" />
        <circle cx="20.5" cy="16" r="4.6" fill="none" stroke="#ffffff" strokeWidth="2.4" />
      </svg>
    </span>
    <span className="text-xl font-bold tracking-tight text-white">Ooble</span>
  </Link>
);

export default Logo;
