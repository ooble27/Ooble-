import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Fingerprint,
  KeyRound,
  Landmark,
  Lock,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { InteracLogo } from "@/components/marks";
import { StepAccount, StepOrder, StepSettle } from "@/components/illustrations";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { formatCad } from "@/lib/rates";
import { cn } from "@/lib/utils";

const networks = [
  { id: "trx", name: "Tron", tag: "TRC20" },
  { id: "eth", name: "Ethereum", tag: "ERC20" },
  { id: "bnb", name: "BNB Chain", tag: "BEP20" },
  { id: "matic", name: "Polygon", tag: "Polygon" },
  { id: "sol", name: "Solana", tag: "SOL" },
  { id: "avax", name: "Avalanche", tag: "C-Chain" },
];

const values = [
  {
    icon: KeyRound,
    title: "Non-custodial",
    desc: "Aucun solde conservé. Vos USDT vont directement de vous à votre wallet, ordre par ordre.",
  },
  {
    icon: Lock,
    title: "Taux verrouillé",
    desc: "Le cours USDT/CAD est garanti 15 minutes, le temps de payer. Aucune mauvaise surprise.",
  },
  {
    icon: Landmark,
    title: "Payé au Canada",
    desc: "Interac e-Transfer à l'achat comme à la vente, avec l'outil que votre banque connaît déjà.",
  },
];

const secure = [
  { icon: Fingerprint, title: "Identité vérifiée", state: "Une seule fois", desc: "Un KYC simple et rapide pour protéger chaque transaction." },
  { icon: ShieldCheck, title: "Chiffrement & conformité", state: "Normes CA", desc: "Vos données et vos ordres protégés selon les exigences canadiennes." },
  { icon: KeyRound, title: "Vos clés, vos fonds", state: "Toujours", desc: "Aucun solde ne dort chez Ooble : rien à retirer, rien à geler." },
];

const steps = [
  { n: "01", title: "Créez votre compte", desc: "Inscription et vérification d'identité en quelques minutes, une seule fois.", Art: StepAccount },
  { n: "02", title: "Créez votre ordre", desc: "Montant, réseau, destination — le taux se verrouille pour 15 minutes.", Art: StepOrder },
  { n: "03", title: "Réglé directement", desc: "Vos USDT dans votre wallet, ou vos CAD par Interac e-Transfer.", Art: StepSettle },
];

const faqs = [
  { q: "Qu'est-ce que « non-custodial » veut dire ?", a: "Ooble ne conserve aucun solde. À l'achat, les USDT sont envoyés directement sur votre adresse wallet ; à la vente, le paiement CAD part directement vers votre compte via Interac. Vos fonds ne dorment jamais sur la plateforme." },
  { q: "Comment est calculé le taux ?", a: "Nous partons du taux de marché réel USDT/CAD, en direct, auquel s'ajoute une marge transparente de 2 %. Le taux affiché inclut déjà cette marge — aucun frais surprise." },
  { q: "Comment acheter des USDT ?", a: "Entrez le montant en CAD, choisissez votre réseau et votre adresse wallet, puis payez par Interac e-Transfer. Vos USDT arrivent en quelques minutes." },
  { q: "Sur quels réseaux puis-je recevoir mes USDT ?", a: "Six réseaux au choix : Tron (TRC20) pour des frais très bas, Ethereum (ERC20) pour une compatibilité maximale, ainsi que BNB Chain, Polygon, Solana et Avalanche." },
  { q: "Comment vendre mes USDT ?", a: "Indiquez le montant, votre réseau d'envoi et votre courriel Interac. Vous recevez votre paiement CAD dès la confirmation on-chain." },
];

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1120px] px-6 sm:px-8 ${className}`}>{children}</div>
);

/** Puce + libellé de section, façon « • Insights ». */
const Eyebrow = ({
  children,
  center,
  inverted,
}: {
  children: React.ReactNode;
  center?: boolean;
  inverted?: boolean;
}) => (
  <p
    className={cn(
      "flex items-center gap-2 text-[12.5px]",
      center && "justify-center",
      inverted ? "text-background/45" : "text-muted-foreground",
    )}
  >
    <span
      className={cn(
        "h-[3.5px] w-[3.5px] rounded-full",
        inverted ? "bg-background/45" : "bg-foreground/40",
      )}
    />
    {children}
  </p>
);

/** Titre de section — fin, serré, jamais gras. */
const Title = ({
  children,
  className,
  inverted,
}: {
  children: React.ReactNode;
  className?: string;
  inverted?: boolean;
}) => (
  <h2
    className={cn(
      "text-balance font-display text-[1.8rem] leading-[1.1] tracking-[-0.035em] sm:text-[2.35rem]",
      inverted && "text-background",
      className,
    )}
  >
    {children}
  </h2>
);

/** Cercles concentriques décoratifs — écho aux deux cercles du logo. */
const CardArc = () => (
  <svg
    viewBox="0 0 140 140"
    className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 text-foreground/[0.07]"
    fill="none"
    aria-hidden
  >
    <circle cx="132" cy="132" r="44" stroke="currentColor" strokeWidth="1.25" />
    <circle cx="132" cy="132" r="76" stroke="currentColor" strokeWidth="1.25" />
    <circle cx="132" cy="132" r="108" stroke="currentColor" strokeWidth="1.25" />
  </svg>
);

/** Marque du héros — anneaux entrelacés. */
const HeroMark = () => (
  <svg viewBox="0 0 108 44" className="mx-auto h-11 w-28 text-foreground/25" fill="none" aria-hidden>
    {[0, 1, 2, 3, 4].map((i) => (
      <circle key={i} cx={30 + i * 12} cy="22" r="15" stroke="currentColor" strokeWidth="1.1" />
    ))}
  </svg>
);

/** Bandeau défilant en tête de page — taux et repères clés. */
const Ticker = ({ rate }: { rate: number }) => {
  const items = [
    `USDT / CAD  ${formatCad(rate)}`,
    "Marché + 2 %",
    "Taux verrouillé 15 min",
    "Interac e-Transfer",
    "6 réseaux",
    "TRC20 · frais bas",
    "100 % non-custodial",
  ];
  return (
    <div className="pt-safe border-b bg-background">
      <div className="mask-fade-x overflow-hidden py-2">
        <div className="animate-marquee flex w-max items-center">
          {[...items, ...items, ...items].map((item, i) => (
            <span key={i} className="flex items-center whitespace-nowrap text-[12px] text-muted-foreground">
              <span className="px-4">{item}</span>
              <span className="h-[3px] w-[3px] rounded-full bg-foreground/20" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const { buy } = useUsdtRate();

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
    /* Le bandeau porte la zone sûre en haut : l'en-tête n'a plus à la doubler. */
    <div className="app-type min-h-screen bg-background [&>header]:pt-0">
      <Ticker rate={buy} />
      <Header />

      <main>
        {/* ===== HÉROS — centré ===== */}
        <section>
          <Wrap className="pb-20 pt-14 text-center lg:pb-28 lg:pt-20">
            <div className="animate-up">
              <HeroMark />

              <p className="mx-auto mt-8 max-w-md text-[13.5px] text-muted-foreground">
                Achat et vente d'USDT en dollars canadiens, par Interac e-Transfer.
              </p>

              <h1 className="mx-auto mt-5 max-w-3xl text-balance font-display text-[2.7rem] leading-[1.02] tracking-[-0.045em] sm:text-[4rem]">
                Achetez des USDT.
                <br />
                Gardez vos clés.
              </h1>

              {/* Widget — taux en direct + actions */}
              <div className="mx-auto mt-10 max-w-[420px] rounded-2xl border border-border bg-card p-2.5 shadow-soft">
                <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3.5">
                  <span className="text-[13px] text-muted-foreground">1 USDT</span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
                    <span className="font-display text-[17px] tracking-tight">{formatCad(buy)}</span>
                  </span>
                </div>
                <Button asChild variant="appSolid" shape="rounded" className="mt-2.5 w-full">
                  <Link to="/connexion">
                    Acheter des USDT <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Link
                  to="/connexion"
                  className="mt-1 flex h-10 items-center justify-center rounded-xl text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Vendre des USDT
                </Link>
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== LE PRINCIPE — cartes ===== */}
        <section className="border-t py-20 lg:py-28">
          <Wrap>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow center>Le principe</Eyebrow>
              <Title className="mt-4">Vos fonds restent à vous, de bout en bout</Title>
              <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
                Un seul actif, un seul objectif : que vos USDT restent à vous, à
                chaque étape de la transaction.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              {values.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-secondary/40"
                >
                  <CardArc />
                  <div className="relative">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-9 font-display text-[17px] tracking-tight">{title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== COMMENT ÇA MARCHE — panneau sombre ===== */}
        <section id="comment" className="py-20 lg:py-28">
          <Wrap>
            <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
              <div>
                <Eyebrow>Comment ça marche</Eyebrow>
                <Title className="mt-4">De l'inscription au règlement, en quelques minutes</Title>
              </div>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground lg:pb-1">
                Trois étapes, aucune friction. Vous créez votre compte une seule
                fois, puis chaque ordre se règle directement vers votre wallet ou
                votre compte bancaire.
              </p>
            </div>

            <div
              data-dark
              className="mt-12 overflow-hidden rounded-[1.6rem] bg-foreground px-6 py-12 text-background sm:px-10 lg:px-14"
            >
              <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
                {steps.map(({ n, title, desc, Art }) => (
                  <div key={n}>
                    <Art className="h-20 w-20" />
                    <div className="mt-6 flex items-center gap-3 border-t border-background/15 pt-5">
                      <span className="font-display text-[13px] text-background/35">{n}</span>
                      <h3 className="font-display text-[17px] tracking-tight">{title}</h3>
                    </div>
                    <p className="mt-2.5 text-[13.5px] leading-relaxed text-background/50">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 border-t border-background/15 pt-8">
                <Link
                  to="/connexion"
                  className="inline-flex h-11 select-none items-center gap-2 rounded-xl bg-background px-6 text-[14px] text-foreground transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  Créer mon compte <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== RÉSEAUX ===== */}
        <section className="border-t py-20 lg:py-28">
          <Wrap>
            <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
              <div>
                <Eyebrow>Réseaux</Eyebrow>
                <Title className="mt-4">Six réseaux pour recevoir vos USDT</Title>
              </div>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground lg:pb-1">
                Vous sélectionnez la blockchain à la création de votre ordre.
                TRC20 pour des frais minimes, ERC20 pour la compatibilité
                maximale avec les wallets.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {networks.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:bg-secondary/40"
                >
                  <img src={`/coins/${n.id}.svg`} alt="" className="h-9 w-9 rounded-full" draggable={false} />
                  <div className="min-w-0">
                    <p className="truncate font-display text-[15px] tracking-tight">{n.name}</p>
                    <p className="text-[12.5px] text-muted-foreground">{n.tag}</p>
                  </div>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== SÉCURITÉ — liste + fiche d'état ===== */}
        <section className="border-t py-20 lg:py-28">
          <Wrap className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            <div>
              <Eyebrow>Sécurité</Eyebrow>
              <Title className="mt-4">Une plateforme pensée pour protéger vos fonds</Title>
              <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
                Vérification d'identité, chiffrement et conformité canadienne —
                sans jamais prendre le contrôle de vos actifs.
              </p>
              <div className="mt-8">
                <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5">
                  <InteracLogo className="h-6" />
                  <span className="text-[13px] text-muted-foreground">Moyen de paiement accepté</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-3">
              <div className="divide-y divide-border">
                {secure.map(({ icon: Icon, title, state, desc }) => (
                  <div key={title} className="flex items-start gap-4 px-3 py-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display text-[15px] tracking-tight">{title}</h3>
                        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">
                          {state}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== LE TAUX — centré ===== */}
        <section className="border-t py-20 lg:py-28">
          <Wrap className="text-center">
            <Eyebrow center>Le taux</Eyebrow>
            <Title className="mx-auto mt-4 max-w-2xl">Le vrai taux du marché, plus 2 %</Title>
            <p className="mx-auto mt-4 max-w-lg text-[14.5px] leading-relaxed text-muted-foreground">
              Pas de dizaines de jetons, pas de confusion. Ooble se concentre sur
              l'USDT et applique le taux de marché réel, en direct.
            </p>

            <p className="mt-12 font-display text-[3.4rem] leading-none tracking-[-0.045em] sm:text-[5rem]">
              {formatCad(buy)}
            </p>
            <p className="mt-4 text-[13.5px] text-muted-foreground">
              pour 1 USDT · verrouillé 15 min · frais inclus
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="appSolid" shape="rounded" size="lg">
                <Link to="/connexion">
                  Acheter des USDT <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" shape="rounded" size="lg">
                <Link to="/connexion">Vendre des USDT</Link>
              </Button>
            </div>
          </Wrap>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="border-t py-20 lg:py-28">
          <Wrap className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <Title className="mt-4">Questions fréquentes</Title>
              <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
                L'essentiel à savoir avant votre premier ordre. Une autre
                question ?{" "}
                <Link to="/contact" className="text-foreground underline underline-offset-2">
                  Écrivez-nous
                </Link>
                .
              </p>
            </div>

            <div className="divide-y border-y">
              {faqs.map((item, i) => {
                const open = faqOpen === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setFaqOpen(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="font-display text-[14.5px] tracking-tight">{item.q}</span>
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all",
                          open ? "rotate-180 bg-foreground text-background" : "bg-secondary text-foreground/70",
                        )}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </span>
                    </button>
                    {open && (
                      <p className="-mt-1 pb-5 pr-10 text-[13.5px] leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Wrap>
        </section>

        {/* ===== CTA — sombre, centré ===== */}
        <section className="px-6 pb-20 sm:px-8 lg:pb-28">
          <div
            data-dark
            className="mx-auto max-w-[1120px] overflow-hidden rounded-[1.6rem] bg-foreground px-6 py-20 text-center text-background sm:px-10"
          >
            <Eyebrow center inverted>
              Commencer
            </Eyebrow>
            <Title inverted className="mx-auto mt-5 max-w-3xl sm:text-[2.8rem]">
              Prêt à échanger vos premiers USDT ?
            </Title>
            <p className="mx-auto mt-5 max-w-md text-[14.5px] leading-relaxed text-background/50">
              Créez un ordre en quelques minutes. Vos fonds vont directement là
              où ils doivent aller : chez vous.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                to="/connexion"
                className="inline-flex h-12 select-none items-center gap-2 rounded-xl bg-background px-7 text-[15px] text-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Commencer <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/connexion"
                className="inline-flex h-12 select-none items-center gap-2 rounded-xl border border-background/20 px-7 text-[15px] text-background transition-all hover:bg-background/10 active:scale-[0.98]"
              >
                Vendre des USDT
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
