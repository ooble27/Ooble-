import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Coins, HandCoins } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import RotatingWord from "@/components/RotatingWord";
import CoinStrip from "@/components/CoinStrip";
import { Button } from "@/components/ui/button";
import { InteracLogo } from "@/components/marks";
import { ETransferArt } from "@/components/illustrations";
import { RATE_LOCK_MINUTES } from "@/lib/rates";
import { cn } from "@/lib/utils";

const networks = [
  { id: "trx", tick: "TRC20", name: "Tron", note: "frais les plus bas" },
  { id: "eth", tick: "ERC20", name: "Ethereum", note: "compatibilité maximale" },
  { id: "bnb", tick: "BEP20", name: "BNB Chain", note: "rapide et économique" },
  { id: "matic", tick: "POL", name: "Polygon", note: "frais très bas" },
  { id: "sol", tick: "SOL", name: "Solana", note: "règlement quasi instantané" },
  { id: "avax", tick: "AVAX-C", name: "Avalanche", note: "C-Chain" },
];

const essentials = [
  {
    t: "Une seule paire, USDT / CAD",
    d: "Pas de catalogue de cent jetons : une paire, un prix, exécutée correctement.",
  },
  {
    t: "Un prix, pas une grille tarifaire",
    d: "Cours du marché + 2 %, marge incluse. Rien à calculer avant de valider.",
  },
  {
    t: "Aucune garde de fonds",
    d: "Ooble n'ouvre pas de compte-portefeuille : chaque ordre est réglé et se termine.",
  },
  {
    t: "Interac e-Transfer, dans les deux sens",
    d: "Depuis et vers votre compte bancaire canadien, sans carte ni virement international.",
  },
];

const steps = [
  {
    n: "01",
    t: "Vérifiez votre compte",
    d: "Courriel, pièce d'identité, selfie. Une seule fois, jamais à refaire.",
  },
  {
    n: "02",
    t: "Créez votre ordre",
    d: `Montant, réseau, adresse. Le taux se verrouille ${RATE_LOCK_MINUTES} minutes.`,
  },
  {
    n: "03",
    t: "Règlement direct",
    d: "Vos USDT vers votre wallet, ou vos dollars vers votre compte Interac.",
  },
];

const specs = [
  { k: "Solde conservé chez Ooble", v: "Aucun" },
  { k: "Portefeuille interne", v: "Aucun" },
  { k: "Vérification d'identité", v: "Une seule fois" },
  { k: "Taux verrouillé", v: `${RATE_LOCK_MINUTES} minutes` },
  { k: "Paiement", v: "Interac e-Transfer" },
];

const faqs = [
  {
    q: "Quels sont les frais ?",
    a: "Le prix affiché correspond au cours du marché USDT/CAD plus une marge de 2 %, déjà incluse. Aucun autre frais.",
  },
  {
    q: "Combien de temps le taux est-il garanti ?",
    a: `Le taux est verrouillé ${RATE_LOCK_MINUTES} minutes à la création de l'ordre.`,
  },
  {
    q: "Ooble garde-t-il mes fonds ?",
    a: "Non. Ooble est non-custodial : aucun solde client, aucun portefeuille interne. Chaque ordre est réglé directement vers votre wallet ou votre compte Interac.",
  },
  {
    q: "Quels réseaux sont pris en charge ?",
    a: "Tron (TRC20), Ethereum (ERC20), BNB Chain (BEP20), Polygon, Solana et Avalanche (C-Chain).",
  },
  {
    q: "Pourquoi une vérification d'identité ?",
    a: "C'est une exigence réglementaire canadienne. Elle se fait une seule fois : courriel, pièce d'identité, selfie.",
  },
  {
    q: "Comment payer ou être payé ?",
    a: "Par Interac e-Transfer, dans les deux sens, depuis votre compte bancaire canadien.",
  },
];

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1200px] px-6 sm:px-10 ${className}`}>{children}</div>
);

/** Libellé de section en petites capitales espacées. */
const Kicker = ({ children, inverted }: { children: React.ReactNode; inverted?: boolean }) => (
  <p
    className={cn(
      "text-[12px] uppercase tracking-[0.16em]",
      inverted ? "text-background/55" : "text-muted-foreground",
    )}
  >
    {children}
  </p>
);

/** Titre de section — 56 px sur grand écran, jamais gras. */
const H2 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2
    className={cn(
      "font-display text-[2.1rem] leading-[1.04] tracking-[-0.045em] sm:text-[2.9rem] lg:text-[3.5rem]",
      className,
    )}
  >
    {children}
  </h2>
);

/** Second membre d'un titre, en gris clair. */
const Soft = ({ children }: { children: React.ReactNode }) => (
  <span className="text-foreground/35">{children}</span>
);

const Index = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    const update = () => {
      const darks = Array.from(document.querySelectorAll<HTMLElement>("[data-dark]"));
      const onDark = darks.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= 4 && r.bottom > 4;
      });
      meta!.setAttribute("content", onDark ? "#131E21" : "#ffffff");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="ink-neutral app-type min-h-screen bg-background tracking-[-0.015em]">
      <Header />

      <main>
        {/* ===================== HÉROS ===================== */}
        <section>
          {/* Le héros occupe une vraie hauteur d'écran, pas un simple bloc. */}
          <Wrap className="flex min-h-[78svh] flex-col justify-center pb-20 pt-24 text-center lg:min-h-[82svh] lg:pb-28 lg:pt-28">
            {/* Pas de `text-balance` ici : il entre en conflit avec les <br>
                explicites et casse le titre en quatre lignes. */}
            {/*
              La boîte du mot défilant prend la largeur de sa variante la plus
              longue : le corps du titre et la largeur maximale sont calibrés
              pour que la deuxième ligne tienne, sinon elle se scinde.
            */}
            <h1 className="animate-up mx-auto max-w-[1120px] font-display text-[2.6rem] leading-[0.98] tracking-[-0.05em] sm:text-[4rem] lg:text-[5.75rem]">
              Achetez et vendez
              <br />
              des USDT{" "}
              <RotatingWord
                words={["en dollars", "par Interac", "sans dépôt", "en sécurité"]}
                className="text-foreground/35"
              />
            </h1>

            <p className="animate-up mx-auto mt-8 max-w-[520px] text-[16px] leading-[1.6] text-muted-foreground [animation-delay:140ms] sm:text-[17px]">
              Réglé directement vers votre wallet ou votre compte Interac.
              Ooble ne conserve aucun solde.
            </p>

            <div className="animate-up mt-10 flex flex-wrap justify-center gap-3 [animation-delay:260ms]">
              <Button asChild variant="appSolid" shape="rounded" size="lg" className="btn-depth px-7">
                <Link to="/connexion">
                  <Coins className="h-4 w-4" strokeWidth={1.8} />
                  Acheter
                </Link>
              </Button>
              <Button asChild variant="secondary" shape="rounded" size="lg" className="px-7">
                <Link to="/connexion">
                  <HandCoins className="h-4 w-4" strokeWidth={1.8} />
                  Vendre
                </Link>
              </Button>
            </div>

            <CoinStrip className="animate-up mx-auto mt-16 [animation-delay:380ms]" />
          </Wrap>
        </section>

        {/* ===================== L'ESSENTIEL ===================== */}
        <section>
          <Wrap className="pt-24 lg:pt-28">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-20">
              <Reveal>
                <H2>
                  Un service
                  <br />
                  volontairement
                  <br />
                  <Soft>réduit à l'essentiel</Soft>
                </H2>

                {/* La seule donnée chiffrée de la page, à sa place logique */}
                <div className="mt-12 border-t pt-7">
                  <Kicker>Marge Ooble</Kicker>
                  <p className="mt-3 font-display text-[3rem] leading-none tracking-[-0.05em] sm:text-[3.6rem]">
                    + 2 %
                  </p>
                  <p className="mt-4 max-w-[320px] text-[14px] leading-[1.6] text-muted-foreground">
                    Déjà comprise dans le prix affiché. Aucun autre frais.
                  </p>
                </div>
              </Reveal>

              <div>
                {essentials.map((e, i) => (
                  <Reveal key={e.t} delay={i * 90}>
                    <div className={cn("border-t py-6", i === essentials.length - 1 && "border-b")}>
                      <p className="font-display text-[20px] tracking-[-0.02em]">{e.t}</p>
                      <p className="mt-2 text-[15px] leading-[1.6] text-muted-foreground">{e.d}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===================== COMMENT ÇA MARCHE ===================== */}
        <section id="comment" className="scroll-mt-24">
          <Wrap className="pt-24 lg:pt-28">
            <Reveal>
              <div className="mb-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end sm:gap-12">
                <div>
                  <Kicker>Comment ça marche</Kicker>
                  <H2 className="mt-4">Trois étapes, aucun dépôt</H2>
                </div>
                <p className="max-w-[300px] text-[15px] leading-[1.6] text-muted-foreground">
                  Vous gardez le contrôle de vos fonds du début à la fin de chaque
                  ordre.
                </p>
              </div>
            </Reveal>

            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 110}>
                <div
                  className={cn(
                    "grid items-baseline gap-x-12 gap-y-3 border-t py-8 sm:grid-cols-[96px_1fr] lg:grid-cols-[96px_1fr_1fr]",
                    i === steps.length - 1 && "border-b",
                  )}
                >
                  <p className="font-display text-[2rem] leading-none tracking-[-0.045em] text-foreground/25 lg:text-[2.875rem]">
                    {s.n}
                  </p>
                  <h3 className="font-display text-[1.35rem] tracking-[-0.03em] sm:text-[1.625rem]">
                    {s.t}
                  </h3>
                  <p className="text-[15px] leading-[1.7] text-muted-foreground sm:col-start-2 lg:col-start-3 lg:row-start-1">
                    {s.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </Wrap>
        </section>

        {/* ===================== RÉSEAUX ===================== */}
        <section id="reseaux" className="scroll-mt-24">
          <Wrap className="pt-24 lg:pt-28">
            <Reveal>
              <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end sm:gap-12">
                <div>
                  <Kicker>Recevez sur 6 réseaux</Kicker>
                  <H2 className="mt-4">La chaîne de votre choix</H2>
                </div>
                <p className="max-w-[300px] text-[15px] leading-[1.6] text-muted-foreground">
                  Le réseau se choisit à la création de l'ordre. Les frais de réseau
                  varient, le taux ne change pas.
                </p>
              </div>
            </Reveal>

            <div className="grid lg:grid-cols-2 lg:gap-x-16">
              {networks.map((n, i) => (
                <Reveal key={n.id} delay={i * 70} className="flex items-center gap-5 border-t py-5">
                  <img
                    src={`/coins/${n.id}.svg`}
                    alt=""
                    draggable={false}
                    className="h-[34px] w-[34px] shrink-0 rounded-full"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[20px] tracking-[-0.02em]">
                      {n.name}
                    </span>
                    <span className="block text-[14px] text-muted-foreground">{n.note}</span>
                  </span>
                  <span className="shrink-0 text-[13px] tracking-[0.1em] text-muted-foreground">
                    {n.tick}
                  </span>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===================== NON-CUSTODIAL (panneau inversé) ===================== */}
        <section data-dark className="mt-24 bg-foreground py-20 text-background lg:mt-28 lg:py-24">
          <Wrap className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
            <Reveal>
              <Kicker inverted>Non-custodial</Kicker>
              <h2 className="mt-5 font-display text-[2.1rem] leading-[1.04] tracking-[-0.045em] text-background sm:text-[2.9rem] lg:text-[3.5rem]">
                Rien à retirer,
                <br />
                <span className="text-background/50">rien à geler</span>
              </h2>
              <p className="mt-7 max-w-[400px] text-[16px] leading-[1.7] text-background/65">
                Aucun solde client, aucun portefeuille interne. Vos clés restent
                les vôtres.
              </p>
            </Reveal>

            <dl>
              {specs.map((s, i) => (
                <Reveal
                  key={s.k}
                  delay={i * 80}
                  className={cn(
                    "flex justify-between gap-6 border-t border-background/15 py-5 text-[17px]",
                    i === specs.length - 1 && "border-b border-background/15",
                  )}
                >
                  <dt>{s.k}</dt>
                  <dd className="shrink-0 text-background/55">{s.v}</dd>
                </Reveal>
              ))}
            </dl>
          </Wrap>
        </section>

        {/* ===================== INTERAC ===================== */}
        <section>
          <Wrap className="pt-24 lg:pt-28">
            <Reveal className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <Kicker>Paiement</Kicker>
                <h2 className="mt-4 font-display text-[1.9rem] leading-[1.06] tracking-[-0.04em] sm:text-[2.4rem] lg:text-[2.75rem]">
                  Payez et soyez payé
                  <br />
                  <span className="text-foreground/35">par votre banque</span>
                </h2>
                <p className="mt-6 max-w-[420px] text-[16px] leading-[1.7] text-muted-foreground">
                  À l'achat vous envoyez un Interac e-Transfer, à la vente vous en
                  recevez un — depuis et vers votre compte bancaire canadien, sans
                  solde intermédiaire.
                </p>
                <div className="mt-7 inline-flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5">
                  <InteracLogo className="h-6" />
                  <span className="text-[13px] text-muted-foreground">Moyen de paiement accepté</span>
                </div>
                <p className="mt-5 max-w-[420px] text-[12px] leading-[1.7] text-muted-foreground">
                  Ooble accepte Interac e-Transfer comme moyen de paiement.
                </p>
              </div>

              <ETransferArt className="mx-auto w-full max-w-[420px]" aria-hidden />
            </Reveal>
          </Wrap>
        </section>

        {/* ===================== DESK OTC ===================== */}
        <section>
          <Wrap className="pt-24 lg:pt-28">
            <Reveal className="grid gap-8 border-b pb-8 lg:grid-cols-2 lg:items-end lg:gap-20">
              <div>
                <Kicker>Gros volumes</Kicker>
                <h2 className="mt-4 font-display text-[1.9rem] leading-[1.06] tracking-[-0.04em] sm:text-[2.4rem] lg:text-[2.75rem]">
                  Un ordre important ?
                  <br />
                  Passez par notre desk
                </h2>
              </div>
              <div>
                <p className="text-[16px] leading-[1.7] text-muted-foreground">
                  Pour les gros volumes, écrivez-nous avant de créer l'ordre.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  shape="rounded"
                  size="default"
                  className="mt-6 px-6"
                >
                  <Link to="/contact">Écrire au desk</Link>
                </Button>
              </div>
            </Reveal>
          </Wrap>
        </section>

        {/* ===================== FAQ ===================== */}
        <section id="faq" className="scroll-mt-24">
          <Wrap className="pt-24 lg:pt-28">
            <Reveal>
              <Kicker>FAQ</Kicker>
              <H2 className="mb-10 mt-4">Questions fréquentes</H2>
            </Reveal>

            {faqs.map((item, i) => {
              const open = faqOpen === i;
              return (
                <Reveal key={item.q} delay={i * 60} className="border-t">
                  <button
                    onClick={() => setFaqOpen(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-[17px] tracking-[-0.02em] sm:text-[20px]">
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-[22px] leading-none text-foreground/35 transition-transform",
                        open && "rotate-45",
                      )}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                  {open && (
                    <p className="mb-7 max-w-[680px] text-[15px] leading-[1.7] text-muted-foreground">
                      {item.a}
                    </p>
                  )}
                </Reveal>
              );
            })}
            <div className="border-t" />
          </Wrap>
        </section>

        {/* ===================== CTA ===================== */}
        <section>
          <Wrap className="pt-28 text-center lg:pt-32">
            <Reveal>
              <h2 className="mx-auto max-w-[760px] text-balance font-display text-[2.6rem] leading-[0.98] tracking-[-0.05em] sm:text-[3.6rem] lg:text-[5rem]">
                Ouvrez un compte
                <br />
                <Soft>en cinq minutes</Soft>
              </h2>
            </Reveal>
            <Reveal delay={140} className="mt-10 flex flex-wrap justify-center gap-3">
              <Button asChild variant="appSolid" shape="rounded" size="lg" className="px-7">
                <Link to="/connexion">
                  <Coins className="h-4 w-4" strokeWidth={1.8} />
                  Ouvrir un compte
                </Link>
              </Button>
              <Button asChild variant="secondary" shape="rounded" size="lg" className="px-7">
                <Link to="/faq">Consulter la FAQ</Link>
              </Button>
            </Reveal>
          </Wrap>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
