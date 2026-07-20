import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2">
    <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-foreground">
      <span className="h-2.5 w-2.5 rounded-full bg-background" />
    </span>
    <span className="font-display text-lg font-bold tracking-tight">Ooble</span>
  </Link>
);

export default Logo;
