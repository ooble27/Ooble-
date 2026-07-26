import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Fingerprint, KeyRound, Landmark, Lock, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { InteracLogo } from "@/components/marks";
import {
  BuyMock,
  DashboardMock,
  FloatCard,
  Frame,
  RoundArrow,
  SecurityMock,
  StepOrderMock,
  StepSettleMock,
  StepVerifyMock,
} from "@/components/mockups";
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

const secure = [
  { icon: Fingerprint, title: "Identité vérifiée", desc: "Un KYC simple et rapide, une seule fois." },
  { icon: KeyRound, title: "Vos clés, vos fonds", desc: "Aucun solde ne dort chez Ooble." },
  { icon: Landmark, title: "Conformité canadienne", desc: "Obligations réglementaires respectées." },
];

const faqs = [
  { q: "Qu'est-ce que « non-custodial » veut dire ?", a: "Ooble ne conserve aucun solde. À l'achat, les USDT sont envoyés directement sur votre adresse wallet ; à la vente, le paiement CAD part directement vers votre compte via Interac. Vos fonds ne dorment jamais sur la plateforme." },
  { q: "Comment est calculé le taux ?", a: "Nous partons du taux de marché réel USDT/CAD, en direct, auquel s'ajoute une marge transparente de 2 %. Le taux affiché inclut déjà cette marge — aucun frais surprise." },
  { q: "Comment acheter des USDT ?", a: "Entrez le montant en CAD, choisissez votre réseau et votre adresse wallet, puis payez par Interac e-Transfer. Vos USDT arrivent en quelques minutes." },
  { q: "Sur quels réseaux puis-je recevoir mes USDT ?", a: "Six réseaux au choix : Tron (TRC20) pour des frais très bas, Ethereum (ERC20) pour une compatibilité maximale, ainsi que BNB Chain, Polygon, Solana et Avalanche." },
  { q: "Comment vendre mes USDT ?", a: "Indiquez le montant, votre réseau d'envoi et votre courriel Interac. Vous recevez votre paiement CAD dès la confirmation on-chain." },
  { q: "Combien de temps le taux est-il garanti ?", a: "Quinze minutes à partir de la création de l'ordre. Ce délai vous laisse le temps d'effectuer votre virement Interac sans subir les variations du marché." },
];

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1120px] px-6 sm:px-8 ${className}`}>{children}</div>
);

/** Libellé de section en petites capitales espacées. */
const Kicker = ({
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
      "text-[10.5px] uppercase tracking-[0.22em]",
      center && "text-center",
      inverted ? "text-background/40" : "text-muted-foreground",
    )}
  >
    {children}
  </p>
);

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
      "text-balance font-display text-[1.85rem] leading-[1.1] tracking-[-0.04em] sm:text-[2.4rem]",
      inverted && "text-background",
      className,
    )}
  >
    {children}
  </h2>
);

/** Carte de fonctionnalité : maquette en haut, texte et flèche en bas. */
const FeatureCard = ({
  title,
  desc,
  children,
  className,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col overflow-hidden rounded-[1.4rem] border border-border bg-secondary/40",
      className,
    )}
  >
    <div className="deco-grid relative flex-1 px-5 pt-8 sm:px-8">{children}</div>
    <div className="flex items-end justify-between gap-6 border-t border-border bg-card px-5 py-5 sm:px-8">
      <div>
        <h3 className="font-display text-[17px] tracking-tight">{title}</h3>
        <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">{desc}</p>
      </div>
      <RoundArrow to="/connexion" label={title} />
    </div>
  </div>
);

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
    <div className="min-h-screen bg-background">
      {/* ===================== HÉROS — panneau plein cadre ===================== */}
      <section data-dark className="app-type relative overflow-hidden bg-foreground text-background">
        <div className="deco-dots-inv pointer-events-none absolute inset-0" aria-hidden />
        {/* Halo doux derrière la maquette */}
        <div
          className="pointer-events-none absolute left-1/2 top-24 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(closest-side, hsl(var(--background)), transparent)" }}
          aria-hidden
        />

        <div className="relative">
          <Header inverted />

          <Wrap className="pt-14 text-center lg:pt-20">
            <Kicker center inverted>
              USDT · Dollars canadiens · Interac
            </Kicker>

            <h1 className="mx-auto mt-6 max-w-3xl text-balance font-display text-[2.7rem] leading-[1.02] tracking-[-0.045em] text-background sm:text-[4.1rem]">
              Achetez des USDT en quelques minutes
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-background/55">
              Réglez par Interac e-Transfer, recevez sur le réseau de votre
              choix. Non-custodial : vos fonds vont directement dans votre
              wallet, jamais chez nous.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
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

            <p className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[12.5px] text-background/40">
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
              Aucun solde conservé · Taux verrouillé 15 minutes
            </p>
          </Wrap>

          {/* Maquette du tableau de bord + cartes flottantes */}
          <Wrap className="relative mt-14 lg:mt-16">
            <div className="relative mx-auto max-w-[900px]">
              <Frame label="ooble.ca / tableau de bord">
                <DashboardMock rate={buy} />
              </Frame>

              <FloatCard
                icon={Lock}
                title="Taux verrouillé"
                sub="14:52 restantes"
                className="absolute -left-12 top-[42%] hidden lg:flex"
              />
              <FloatCard
                icon={Check}
                title="USDT envoyés"
                sub="Confirmé on-chain"
                className="absolute -bottom-6 right-12 hidden lg:flex"
              />
            </div>
          </Wrap>

          {/* Bandeau de confiance */}
          <div className="relative mt-16 border-t border-background/10">
            <Wrap className="flex flex-col items-center gap-5 py-7">
              <p className="text-[12px] text-background/40">
                Réglé par Interac e-Transfer · Six réseaux supportés
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
                {/* Le logo Interac est sombre : il lui faut une pastille claire ici. */}
                <span className="flex items-center rounded-lg bg-background px-2.5 py-1.5">
                  <InteracLogo className="h-5" />
                </span>
                <span className="hidden h-4 w-px bg-background/15 sm:block" />
                {networks.map((n) => (
                  <span key={n.id} className="flex items-center gap-2 text-[13px] text-background/50">
                    <img src={`/coins/${n.id}.svg`} alt="" className="h-5 w-5 rounded-full" draggable={false} />
                    {n.name}
                  </span>
                ))}
              </div>
            </Wrap>
          </div>
        </div>
      </section>

      <main className="app-type">
        {/* ===================== FONCTIONNALITÉS ===================== */}
        <section className="py-20 lg:py-28">
          <Wrap>
            <Kicker center>Ce que fait Ooble</Kicker>
            <Title className="mx-auto mt-5 max-w-2xl text-center">
              Un seul actif, réglé proprement, de bout en bout
            </Title>
            <p className="mx-auto mt-5 max-w-xl text-center text-[14.5px] leading-relaxed text-muted-foreground">
              Pas de dizaines de jetons, pas de solde à surveiller. Vous créez un
              ordre, il se règle directement — c'est tout.
            </p>

            {/* Grande carte : achat */}
            <FeatureCard
              className="mt-14"
              title="Achetez au taux du marché, plus 2 %"
              desc="Le montant, le réseau, l'adresse — et le taux se verrouille quinze minutes, le temps de faire votre virement Interac."
            >
              <div className="mx-auto grid max-w-3xl items-end gap-6 sm:grid-cols-[1fr_1.1fr]">
                <div className="relative mx-auto w-full max-w-[260px]">
                  <Frame label="Acheter" className="shadow-soft">
                    <BuyMock rate={buy} />
                  </Frame>
                </div>
                <div className="relative hidden pb-8 sm:block">
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <Kicker>Taux en direct</Kicker>
                    <p className="mt-3 font-display text-[2.4rem] leading-none tracking-[-0.04em]">
                      {formatCad(buy)}
                    </p>
                    <p className="mt-2 text-[12.5px] text-muted-foreground">
                      pour 1 USDT · frais inclus
                    </p>
                    <div className="mt-4 flex items-center gap-2 border-t border-border pt-3.5 text-[12px] text-muted-foreground">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
                      Mis à jour en continu
                    </div>
                  </div>
                  <FloatCard
                    icon={Landmark}
                    title="Interac e-Transfer"
                    sub="Reçu · 500,00 $"
                    className="absolute -bottom-2 -left-8 hidden lg:flex"
                  />
                </div>
              </div>
            </FeatureCard>

            {/* Deux cartes */}
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <FeatureCard
                title="Six réseaux, vous choisissez"
                desc="TRC20 pour des frais minimes, ERC20 pour la compatibilité maximale — plus BNB Chain, Polygon, Solana et Avalanche."
              >
                <div className="pb-8">
                  <div className="mx-auto grid max-w-sm grid-cols-3 gap-2.5">
                    {networks.map((n) => (
                      <div
                        key={n.id}
                        className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-2 py-3.5 shadow-soft"
                      >
                        <img src={`/coins/${n.id}.svg`} alt="" className="h-8 w-8 rounded-full" draggable={false} />
                        <span className="text-center text-[10.5px] leading-tight text-muted-foreground">
                          {n.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FeatureCard>

              <FeatureCard
                title="Non-custodial par construction"
                desc="Aucun solde conservé, aucun portefeuille interne. Chaque ordre est réglé individuellement vers votre adresse ou votre compte."
              >
                <div className="pb-8">
                  <div className="mx-auto max-w-[260px]">
                    <Frame label="Règlement" className="shadow-soft">
                      <StepSettleMock />
                    </Frame>
                  </div>
                </div>
              </FeatureCard>
            </div>
          </Wrap>
        </section>

        {/* ===================== COMMENT ÇA MARCHE ===================== */}
        <section id="comment" className="border-t py-20 lg:py-28">
          <Wrap>
            <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
              <div>
                <Kicker>Comment ça marche</Kicker>
                <Title className="mt-5">Trois écrans, et c'est réglé</Title>
              </div>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground lg:pb-1">
                Vous vérifiez votre identité une seule fois. Ensuite, chaque
                ordre suit le même chemin court : montant, réseau, règlement —
                sans jamais confier vos fonds à la plateforme.
              </p>
            </div>

            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Vérifiez votre compte",
                  desc: "Courriel, pièce d'identité, selfie. Une seule fois, en quelques minutes.",
                  label: "Vérification",
                  mock: <StepVerifyMock />,
                },
                {
                  n: "02",
                  title: "Créez votre ordre",
                  desc: "Montant en CAD, réseau de réception, adresse wallet. Le taux se verrouille.",
                  label: "Nouvel ordre",
                  mock: <StepOrderMock rate={buy} />,
                },
                {
                  n: "03",
                  title: "Recevez directement",
                  desc: "Vos USDT arrivent dans votre wallet, ou vos dollars sur votre compte Interac.",
                  label: "Règlement",
                  mock: <StepSettleMock />,
                },
              ].map((s) => (
                <div
                  key={s.n}
                  className="flex flex-col overflow-hidden rounded-[1.4rem] border border-border bg-secondary/40"
                >
                  <div className="deco-grid px-5 pb-7 pt-7">
                    <Frame label={s.label} className="shadow-soft">
                      {s.mock}
                    </Frame>
                  </div>
                  <div className="border-t border-border bg-card px-5 py-5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground font-display text-[10.5px] text-background">
                        {s.n}
                      </span>
                      <h3 className="font-display text-[16px] tracking-tight">{s.title}</h3>
                    </div>
                    <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Button asChild variant="appSolid" shape="rounded" size="lg">
                <Link to="/connexion">
                  Créer mon compte <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Wrap>
        </section>

        {/* ===================== SÉCURITÉ ===================== */}
        <section className="border-t py-20 lg:py-28">
          <Wrap className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
            <div>
              <Kicker>Sécurité</Kicker>
              <Title className="mt-5">Conçu pour que vos fonds ne dépendent pas de nous</Title>
              <p className="mt-5 text-[14.5px] leading-relaxed text-muted-foreground">
                Ooble n'est pas un dépositaire. Nous n'avons ni portefeuille
                interne, ni solde client — donc rien à geler, rien à perdre.
              </p>

              <ul className="mt-8 space-y-5">
                {secure.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3 className="font-display text-[15.5px] tracking-tight">{title}</h3>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-9 inline-flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5">
                <InteracLogo className="h-6" />
                <span className="text-[13px] text-muted-foreground">Moyen de paiement accepté</span>
              </div>
            </div>

            <div className="deco-grid relative rounded-[1.4rem] border border-border bg-secondary/40 px-5 py-10 sm:px-10">
              <Frame label="Sécurité du compte">
                <SecurityMock />
              </Frame>
              <FloatCard
                icon={KeyRound}
                title="Aucun solde conservé"
                sub="Règlement direct"
                className="absolute -bottom-4 left-4 hidden sm:flex lg:-left-8"
              />
            </div>
          </Wrap>
        </section>

        {/* ===================== FAQ ===================== */}
        <section id="faq" className="border-t py-20 lg:py-28">
          <Wrap className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Kicker>Questions</Kicker>
              <Title className="mt-5">Questions fréquentes</Title>
              <p className="mt-5 text-[14.5px] leading-relaxed text-muted-foreground">
                L'essentiel à savoir avant votre premier ordre.
              </p>
              <Button asChild variant="secondary" shape="rounded" className="mt-7">
                <Link to="/contact">
                  Nous écrire <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-2.5">
              {faqs.map((item, i) => {
                const open = faqOpen === i;
                return (
                  <div
                    key={i}
                    className={cn(
                      "overflow-hidden rounded-2xl border transition-colors",
                      open ? "border-border bg-card" : "border-border bg-secondary/40 hover:bg-secondary/70",
                    )}
                  >
                    <button
                      onClick={() => setFaqOpen(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="font-display text-[14.5px] tracking-tight">{item.q}</span>
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all",
                          open ? "rotate-45 bg-foreground text-background" : "bg-card text-foreground/70",
                        )}
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                      </span>
                    </button>
                    {open && (
                      <p className="px-5 pb-5 pr-12 text-[13.5px] leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Wrap>
        </section>

        {/* ===================== CTA ===================== */}
        <section className="px-6 pb-20 sm:px-8 lg:pb-28">
          <div
            data-dark
            className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[1.6rem] bg-foreground px-6 py-20 text-center text-background sm:px-10"
          >
            <div className="deco-dots-inv pointer-events-none absolute inset-0" aria-hidden />
            <div className="relative">
              <Kicker center inverted>
                Commencer
              </Kicker>
              <Title inverted className="mx-auto mt-5 max-w-2xl sm:text-[2.8rem]">
                Votre premier ordre en quelques minutes
              </Title>
              <p className="mx-auto mt-5 max-w-md text-[14.5px] leading-relaxed text-background/50">
                Créez votre compte, vérifiez votre identité une fois, et achetez.
                Vos fonds vont directement là où ils doivent aller : chez vous.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  to="/connexion"
                  className="inline-flex h-12 select-none items-center gap-2 rounded-xl bg-background px-7 text-[15px] text-foreground transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  Commencer <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex h-12 select-none items-center gap-2 rounded-xl border border-background/20 px-7 text-[15px] text-background transition-all hover:bg-background/10 active:scale-[0.98]"
                >
                  Nous écrire
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="app-type">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
