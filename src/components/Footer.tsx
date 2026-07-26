import { Link } from "react-router-dom";

const links = [
  { label: "Connexion", to: "/connexion" },
  { label: "Comment ça marche", to: "/#comment" },
  { label: "Réseaux", to: "/#reseaux" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

const Footer = () => (
  <footer className="bg-background">
    <div className="mx-auto max-w-[1200px] px-6 pt-28 sm:px-10">
      <div className="flex flex-wrap justify-between gap-x-10 gap-y-6 border-b pb-7">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {links.map((link) => (
            <Link key={link.label} to={link.to} className="transition-opacity hover:opacity-70">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ooble — Canada
        </p>
      </div>

      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        Les cryptoactifs comportent des risques ; leur valeur peut fluctuer. Ooble
        règle chaque ordre individuellement et ne conserve aucun fonds client.
      </p>
    </div>

    {/* Signature de bas de page — wordmark volontairement rogné */}
    <div className="mx-auto mt-10 max-w-[1200px] overflow-hidden px-6 sm:px-10" aria-hidden>
      <p className="-mb-[2.6vw] select-none text-center font-display text-[26vw] leading-[0.8] tracking-[-0.06em] text-foreground">
        Ooble
      </p>
    </div>
  </footer>
);

export default Footer;
