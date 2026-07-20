import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5">
    <span className="relative flex h-8 w-8 items-center justify-center">
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600" />
      <span className="absolute inset-[7px] rounded-full bg-background" />
    </span>
    <span className="font-display text-xl font-bold tracking-tight">Ooble</span>
  </Link>
);

export default Logo;
