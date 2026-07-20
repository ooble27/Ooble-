import { Link } from "react-router-dom";
import Header from "@/components/Header";

const NotFound = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container flex flex-col items-center justify-center gap-4 py-40 text-center">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="text-lg text-muted-foreground">Cette page n'existe pas.</p>
      <Link
        to="/"
        className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
      >
        Retour à l'accueil
      </Link>
    </div>
  </div>
);

export default NotFound;
