import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="app-type min-h-screen bg-background">
    <Header />
    <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-center gap-4 px-6 py-48 text-center">
      <p className="font-display text-7xl font-extrabold tracking-tight text-primary">404</p>
      <p className="text-lg text-muted-foreground">Cette page n'existe pas.</p>
      <Button asChild variant="primary" shape="pill" className="mt-2">
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
