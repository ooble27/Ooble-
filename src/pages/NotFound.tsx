import { Link } from "react-router-dom";
import Header from "@/components/Header";

const NotFound = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-center gap-4 px-6 py-48 text-center">
      <p className="font-display text-7xl font-extrabold tracking-tight text-primary">404</p>
      <p className="text-lg text-muted-foreground">Cette page n'existe pas.</p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-green transition-transform hover:-translate-y-0.5"
      >
        Retour à l'accueil
      </Link>
    </div>
  </div>
);

export default NotFound;
