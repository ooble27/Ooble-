import { Link } from "react-router-dom";
import Header from "@/components/Header";

const NotFound = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-center gap-4 px-6 py-48 text-center">
      <p className="text-7xl font-extrabold tracking-tight">404</p>
      <p className="text-lg text-muted-foreground">Cette page n'existe pas.</p>
      <Link
        to="/"
        className="mt-2 inline-flex h-12 items-center rounded-xl bg-white px-6 text-sm font-bold text-[#141414] transition-transform hover:-translate-y-0.5"
      >
        Retour à l'accueil
      </Link>
    </div>
  </div>
);

export default NotFound;
