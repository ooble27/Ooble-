import { Link } from "react-router-dom";
import Logo from "./Logo";
import { InteracLogo } from "./marks";

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Produit",
    links: [
      { label: "Accueil", to: "/" },
      { label: "Réseaux", to: "/#reseaux" },
      { label: "Ouvrir un compte", to: "/connexion" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact" },
      { label: "Connexion", to: "/connexion" },
    ],
  },
];

const Footer = () => (
  <footer className="bg-background">
    <div className="mx-auto max-w-[1200px] px-6 pt-24 sm:px-10">
      {/* Haut : marque + colonnes de liens */}
      <div className="grid gap-12 border-b pb-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-[14px] leading-[1.6] text-muted-foreground">
            Achetez et vendez des USDT en dollars canadiens, réglés par Interac
            e-Transfer. Non-custodial : vos fonds ne dorment jamais chez nous.
          </p>
          <div className="mt-6">
            <p className="text-[12px] text-muted-foreground">Moyen de paiement accepté</p>
            <InteracLogo className="mt-2 h-7" />
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[15px] text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bas : copyright + mention de risque */}
      <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-start sm:justify-between">
        <p className="shrink-0 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ooble — Canada
        </p>
        <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
          Les cryptoactifs comportent des risques ; leur valeur peut fluctuer.
          Ooble règle chaque ordre individuellement et ne conserve aucun fonds
          client.
        </p>
      </div>
    </div>

    {/* Signature de bas de page — wordmark volontairement rogné */}
    <div className="mx-auto max-w-[1200px] overflow-hidden px-6 sm:px-10" aria-hidden>
      <p className="-mb-[2.6vw] select-none text-center font-display text-[26vw] leading-[0.8] tracking-[-0.06em] text-foreground">
        Ooble
      </p>
    </div>
  </footer>
);

export default Footer;
