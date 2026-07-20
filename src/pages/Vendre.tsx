import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Vendre = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Accueil
        </Link>
        <span className="font-semibold">Vendre des USDT</span>
      </div>
    </header>

    <main className="container max-w-lg py-16">
      <h1 className="text-2xl font-bold">Vendre des USDT contre des CAD</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Vous envoyez vos USDT vers l'adresse de dépôt d'Ooble et recevez un
        Interac e-Transfer une fois la transaction confirmée. (Formulaire
        d'ordre à venir — nécessite un compte vérifié.)
      </p>
      <div className="mt-8 rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        🚧 Le parcours de vente sera activé une fois l'authentification et le
        KYC en place.
      </div>
    </main>
  </div>
);

export default Vendre;
