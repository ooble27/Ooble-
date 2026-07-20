import { Link } from "react-router-dom";
import Header from "@/components/Header";

const NotFound = () => (
  <div className="grain min-h-screen bg-background">
    <Header />
    <div className="container flex flex-col items-center justify-center gap-4 py-40 text-center">
      <p className="font-display text-7xl font-semibold tracking-tight">404</p>
      <p className="text-lg text-muted-foreground">Cette page n'existe pas.</p>
      <Link
        to="/"
        className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Retour à l'accueil
      </Link>
    </div>
  </div>
);

export default NotFound;
