import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Logo from "./Logo";

const columns = [
  {
    title: "Produit",
    links: [
      { label: "Acheter des USDT", to: "/acheter" },
      { label: "Vendre des USDT", to: "/vendre" },
      { label: "Comment ça marche", to: "/#comment" },
      { label: "FAQ", to: "/#faq" },
    ],
  },
  {
    title: "Conformité",
    links: [
      { label: "Vérification d'identité", to: "/#faq" },
      { label: "Lutte anti-blanchiment", to: "/#faq" },
      { label: "Conservation des dossiers", to: "/#faq" },
    ],
  },
];

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="container py-16">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            La façon non-custodiale d'acheter et de vendre des USDT en dollars
            canadiens. Chaque ordre est réglé directement vers votre wallet ou
            votre compte — aucun solde conservé.
          </p>
          <Link
            to="/acheter"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:gap-2.5"
          >
            Commencer <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold tracking-tight">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ooble. Tous droits réservés.
        </p>
        <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
          Les cryptoactifs comportent des risques ; leur valeur peut fluctuer.
          Ooble règle chaque ordre individuellement et ne conserve aucun fonds
          client.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
