import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="container py-14">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Plateforme non-custodiale d'achat et de vente d'USDT en dollars
            canadiens. Vos fonds ne transitent jamais par un solde de
            plateforme : chaque ordre est réglé directement vers votre wallet
            ou votre compte bancaire.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Produit</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/acheter" className="hover:text-foreground">Acheter des USDT</Link>
            </li>
            <li>
              <Link to="/vendre" className="hover:text-foreground">Vendre des USDT</Link>
            </li>
            <li>
              <Link to="/#comment" className="hover:text-foreground">Comment ça marche</Link>
            </li>
            <li>
              <Link to="/#faq" className="hover:text-foreground">FAQ</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Conformité</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>Vérification d'identité (KYC)</li>
            <li>Lutte contre le blanchiment (LBA)</li>
            <li>Conservation des dossiers</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t pt-6 text-xs leading-relaxed text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Ooble. Les cryptoactifs comportent des
          risques ; leur valeur peut fluctuer. Ooble est une plateforme
          d'échange ordre par ordre : aucun fonds client n'est conservé.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
