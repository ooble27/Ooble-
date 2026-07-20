import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Acheter = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Accueil
        </Link>
        <span className="font-semibold">Acheter des USDT</span>
      </div>
    </header>

    <main className="container max-w-lg py-16">
      <h1 className="text-2xl font-bold">Acheter des USDT en CAD</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Vous payez par Interac e-Transfer et recevez les USDT directement sur
        votre adresse wallet. (Formulaire d'ordre à venir — nécessite un compte
        vérifié.)
      </p>
      <div className="mt-8 rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        🚧 Le parcours d'achat sera activé une fois l'authentification et le
        KYC en place.
      </div>
    </main>
  </div>
);

export default Acheter;
