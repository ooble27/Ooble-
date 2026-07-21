import { Link } from "react-router-dom";
import { Send, Handshake } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";

const Envoyer = () => (
  <AppShell
    header={
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Envoyer & OTC</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">Transferts et gros volumes</p>
      </div>
    }
  >
    <div className="rounded-[1.5rem] border border-border/70 bg-white p-8 shadow-soft">
      <div className="flex flex-col items-center py-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
          <Send className="h-7 w-7" strokeWidth={1.7} />
        </span>
        <p className="mt-5 font-display text-xl font-bold">Bientôt disponible</p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
          L'envoi de USDT entre wallets et le desk OTC pour les gros volumes
          arrivent prochainement.
        </p>
      </div>
    </div>

    <div className="mt-4 flex items-center gap-3 rounded-2xl bg-accent-tint px-4 py-3.5 text-sm text-accent-ink">
      <Handshake className="h-5 w-5 shrink-0" strokeWidth={1.9} />
      <span>Un gros volume à traiter ? Écrivez-nous, on s'en occupe à la main.</span>
    </div>

    <Button size="lg" className="mt-6 w-full" asChild>
      <Link to="/app/acheter">Acheter des USDT</Link>
    </Button>
  </AppShell>
);

export default Envoyer;
