import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4">
    <h1 className="text-4xl font-bold">404</h1>
    <p className="text-muted-foreground">Cette page n'existe pas.</p>
    <Link to="/" className="text-primary underline underline-offset-4">
      Retour à l'accueil
    </Link>
  </div>
);

export default NotFound;
