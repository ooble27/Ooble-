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
import {
  CoinsArt,
  InteracArt,
  PhoneArt,
  StepAccount,
  StepOrder,
  StepSettle,
  WalletArt,
} from "@/components/illustrations";
import Coin, { type CoinId } from "@/components/Coin";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { formatCad } from "@/lib/rates";

const networks: { id: CoinId; name: string; tag: string }[] = [
  { id: "trx", name: "Tron", tag: "TRC20" },
  { id: "eth", name: "Ethereum", tag: "ERC20" },
  { id: "bnb", name: "BNB Chain", tag: "BEP20" },
  { id: "matic", name: "Polygon", tag: "Polygon PoS" },
  { id: "sol", name: "Solana", tag: "SPL" },
  { id: "avax", name: "Avalanche", tag: "C-Chain" },
];

const values = [
  { icon: KeyRound, title: "Non-custodial", desc: "Aucun solde conservé. Vos USDT vont directement de vous à votre wallet, ordre par ordre." },
  { icon: Lock, title: "Taux verrouillé", desc: "Le cours USDT/CAD est garanti 15 minutes, le temps de payer. Aucune mauvaise surprise." },
  { icon: Landmark, title: "Payé au Canada", desc: "" },
];

const secure = [
  { icon: Fingerprint, title: "Identité vérifiée", desc: "Un KYC simple et rapide, une seule fois, pour protéger chaque transaction." },
  { icon: ShieldCheck, title: "Chiffrement & conformité", desc: "Vos données et vos ordres sont protégés selon les exigences canadiennes." },
  { icon: KeyRound, title: "Vos clés, vos fonds", desc: "Aucun solde ne dort chez Ooble : rien à retirer, rien à geler." },
];

const steps = [
  { n: "01", title: "Créez votre compte", desc: "Inscription et vérification d'identité en quelques minutes, une seule fois." },
  { n: "02", title: "Créez votre ordre", desc: "Montant, réseau, destination — le taux USDT/CAD se verrouille pour 15 minutes." },
  { n: "03", title: "Réglé directement", desc: "Vos USDT dans votre wallet, ou vos CAD dans votre compte Interac." },
];

const faqs = [
  { q: "Qu'est-ce que « non-custodial » veut dire ?", a: "Ooble ne conserve aucun solde. À l'achat, les USDT sont envoyés directement sur votre adresse wallet ; à la vente, le paiement CAD part directement vers votre compte via Interac. Vos fonds ne dorment jamais sur la plateforme." },
  { q: "Comment est calculé le taux ?", a: "Nous partons du taux de marché réel USDT/CAD, en direct, auquel s'ajoute une marge transparente de 2 %. Le taux affiché inclut déjà cette marge — aucun frais surprise." },
  { q: "Comment acheter des USDT ?", a: "Entrez le montant en CAD, choisissez votre réseau et votre adresse wallet, puis payez par Interac e-Transfer. Vos USDT arrivent en quelques minutes." },
  { q: "Sur quels réseaux puis-je recevoir mes USDT ?", a: "TRC20 (Tron) pour des frais très bas, et ERC20 (Ethereum) pour une compatibilité maximale avec les wallets. Vous choisissez à la création de l'ordre." },
  { q: "Comment vendre mes USDT ?", a: "Indiquez le montant, votre réseau d'envoi et votre courriel Interac. Vous recevez votre paiement CAD dès la confirmation on-chain." },
];

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1120px] px-6 sm:px-8 ${className}`}>{children}</div>
);

const SectionHead = ({
  eyebrow,
  children,
  sub,
  onDark,
}: {
  eyebrow: string;
  children: React.ReactNode;
  sub?: string;
  onDark?: boolean;
}) => (
  <div className="max-w-xl">
    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
      <span className="h-px w-7 bg-primary/40" />
      {eyebrow}
    </p>
    <h2 className={`mt-4 text-balance font-display text-[1.9rem] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[2.5rem] ${onDark ? "text-white" : ""}`}>
      {children}
    </h2>
    {sub && (
      <p className={`mt-4 text-[15px] leading-relaxed ${onDark ? "text-white/65" : "text-muted-foreground"}`}>
        {sub}
      </p>
    )}
  </div>
);

const Index = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const { buy } = useUsdtRate();

  // Adapte la couleur de la barre d'état (encoche) à la section en haut de
  // l'écran : pétrole sur les sections sombres, blanc sinon — plus de bande
  // blanche fixe au-dessus des sections colorées.
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
      meta!.setAttribute("content", onDark ? "#0F3A43" : "#ffffff");
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
      <Header />

      <main>
        {/* ===== HERO ===== */}
        <section>
          <Wrap className="grid items-center gap-10 pb-16 pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:pb-24 lg:pt-20">
            <div className="animate-up">
              <h1 className="text-balance font-display text-[3rem] font-semibold leading-[1] tracking-[-0.035em] sm:text-[4rem]">
                Achetez des USDT,
                <br />
                gardez vos <span className="text-primary">clés.</span>
              </h1>
              <p className="mt-6 max-w-md text-[17px] font-light leading-relaxed text-muted-foreground">
                Ooble fait une seule chose, et la fait bien : acheter et vendre
                des USDT en dollars canadiens par Interac. Non-custodial — vos
                fonds vont directement dans votre wallet.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild variant="primary" shape="rounded" size="lg">
                  <Link to="/acheter">
                    Acheter des USDT <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" shape="rounded" size="lg">
                  <Link to="/vendre">Vendre des USDT</Link>
                </Button>
              </div>
              <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border bg-card px-4 py-2 text-sm shadow-soft">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="font-semibold">1 USDT = {formatCad(buy)}</span>
                <span className="font-light text-muted-foreground">· taux du marché + 2 %</span>
              </div>
            </div>

            <div className="animate-up">
              <WalletArt className="mx-auto w-full max-w-[460px]" />
            </div>
          </Wrap>
        </section>

        {/* ===== BANDEAU CONFIANCE ===== */}
        <div className="border-y">
          <Wrap className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-4 text-center text-sm font-light text-muted-foreground">
            <span className="flex items-center gap-2">
              Réglé via <InteracLogo className="font-semibold text-foreground" />
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span>Réseaux TRC20 &amp; ERC20</span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span>100 % non-custodial</span>
          </Wrap>
        </div>

        {/* ===== LE PRINCIPE (3 colonnes) ===== */}
        <section className="border-b py-20 lg:py-28">
          <Wrap>
            <SectionHead
              eyebrow="Le principe"
              sub="Un seul actif, un seul objectif : que vos USDT restent à vous, à chaque étape de la transaction."
            >
              Vos fonds restent à vous, de bout en bout
            </SectionHead>
            <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
              {values.map((v, i) => (
                <div key={v.title} className={i === 0 ? "sm:pr-12" : "sm:px-12"}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                    <v.icon className="h-[22px] w-[22px]" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-semibold">{v.title}</h3>
                  <p className="mt-2.5 text-sm font-light leading-relaxed text-muted-foreground">
                    {v.title === "Payé au Canada"
                      ? "Interac e-Transfer à l'achat comme à la vente, avec l'outil que votre banque connaît déjà."
                      : v.desc}
                  </p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== RÉSEAUX ===== */}
        <section className="border-b py-20 lg:py-28">
          <Wrap>
            <SectionHead
              eyebrow="Réseaux"
              sub="Recevez vos USDT sur la blockchain de votre choix — vous sélectionnez le réseau à la création de votre ordre."
            >
              Six réseaux pour recevoir vos USDT
            </SectionHead>
            <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
              {networks.map((n) => (
                <div key={n.id} className="text-center">
                  <div className="relative mx-auto flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
                    <span className="absolute inset-0 rounded-full bg-[#EEF2F2]" />
                    <span className="absolute inset-[9px] rounded-full border-2 border-dashed border-primary/25" />
                    <Coin id={n.id} size={52} className="relative" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">{n.name}</h3>
                  <p className="text-xs font-medium text-muted-foreground">{n.tag}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== INTERAC (illustration à droite) ===== */}
        <section className="border-b py-20 lg:py-28">
          <Wrap className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHead
                eyebrow="Moyen de paiement"
                sub="Quand vous achetez des USDT sur Ooble, vous réglez par Interac e-Transfer — le virement que votre banque canadienne connaît déjà. Et à la vente, vous recevez vos dollars de la même façon."
              >
                Vous payez par Interac e-Transfer
              </SectionHead>
              <div className="mt-6 inline-flex items-center gap-3 rounded-xl border bg-card px-4 py-2.5 shadow-soft">
                <InteracLogo className="h-6" />
                <span className="text-sm font-medium text-muted-foreground">Moyen de paiement accepté</span>
              </div>
              <p className="mt-4 max-w-md text-xs font-light leading-relaxed text-muted-foreground">
                Ooble accepte Interac e-Transfer comme moyen de paiement. Ooble
                n'est pas affilié à Interac Corp. et ne fournit pas de services
                Interac. « Interac » est une marque de commerce d'Interac Corp.
              </p>
              <div className="mt-8">
                <Button asChild variant="primary" shape="rounded" size="lg">
                  <Link to="/acheter">
                    Acheter des USDT <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <InteracArt className="mx-auto w-full max-w-[440px]" />
            </div>
          </Wrap>
        </section>

        {/* ===== SÉCURITÉ (illustration à gauche) ===== */}
        <section className="border-b py-20 lg:py-28">
          <Wrap className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="order-2 lg:order-1">
              <PhoneArt className="mx-auto w-full max-w-[420px]" />
            </div>
            <div className="order-1 lg:order-2">
              <SectionHead eyebrow="Sécurité">
                Une plateforme pensée pour protéger vos fonds
              </SectionHead>
              <ul className="mt-10 space-y-7">
                {secure.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{title}</h3>
                      <p className="mt-1 text-sm font-light leading-relaxed text-muted-foreground">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Wrap>
        </section>

        {/* ===== COMMENT ÇA MARCHE (pétrole) ===== */}
        <section id="comment" data-dark className="bg-deep py-20 text-deep-foreground lg:py-28">
          <Wrap>
            <SectionHead eyebrow="Comment ça marche" onDark>
              De l'inscription au règlement, en quelques minutes
            </SectionHead>
            <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-3">
              {steps.map(({ n, title, desc }, i) => {
                const Art = [StepAccount, StepOrder, StepSettle][i];
                return (
                  <div key={n}>
                    <Art className="h-28 w-28" />
                    <div className="mt-5 flex items-center gap-3 border-t border-white/15 pt-5">
                      <span className="font-display text-sm font-semibold text-primary">{n}</span>
                      <h3 className="font-display text-lg font-semibold">{title}</h3>
                    </div>
                    <p className="mt-2.5 text-sm font-light leading-relaxed text-white/60">{desc}</p>
                  </div>
                );
              })}
            </div>
          </Wrap>
        </section>

        {/* ===== LE TAUX (illustration à droite) ===== */}
        <section className="border-b py-20 lg:py-28">
          <Wrap className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHead
                eyebrow="Le taux"
                sub="Pas de dizaines de jetons, pas de confusion. Ooble se concentre sur l'USDT et applique le taux de marché réel, en direct, plus une marge transparente de 2 %."
              >
                Le vrai taux du marché, plus 2 %
              </SectionHead>
              <div className="mt-8 flex items-end gap-4">
                <p className="font-display text-[3.5rem] font-semibold leading-none tracking-[-0.03em]">
                  {formatCad(buy)}
                </p>
                <div className="mb-1.5">
                  <p className="text-sm font-semibold text-primary">pour 1 USDT</p>
                  <p className="text-xs font-light text-muted-foreground">verrouillé 15 min · frais inclus</p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="primary" shape="rounded" size="lg">
                  <Link to="/acheter">
                    Acheter des USDT <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" shape="rounded" size="lg">
                  <Link to="/vendre">Vendre des USDT</Link>
                </Button>
              </div>
            </div>
            <div>
              <CoinsArt className="mx-auto w-full max-w-[420px]" />
            </div>
          </Wrap>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="border-b py-20 lg:py-28">
          <Wrap className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHead
              eyebrow="FAQ"
              sub="L'essentiel à savoir avant votre premier ordre. Une autre question ? Écrivez-nous, on répond vite."
            >
              Tout ce qu'il faut savoir avant de commencer
            </SectionHead>
            <div className="divide-y border-y">
              {faqs.map((item, i) => {
                const open = faqOpen === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setFaqOpen(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-6 text-left"
                    >
                      <span className="font-display text-[15px] font-semibold">{item.q}</span>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${open ? "rotate-180 bg-primary text-primary-foreground" : "bg-accent-tint text-primary"}`}>
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                    {open && (
                      <p className="-mt-1 pb-6 text-sm font-light leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Wrap>
        </section>

        {/* ===== CTA (pétrole) ===== */}
        <section data-dark className="bg-deep py-20 text-deep-foreground lg:py-24">
          <Wrap className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-balance font-display text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[2.8rem]">
                Prêt à échanger vos <span className="text-primary">premiers USDT</span> ?
              </h2>
              <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-white/65">
                Créez un ordre en quelques minutes. Vos fonds vont directement
                là où ils doivent aller : chez vous.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button asChild variant="primary" shape="rounded" size="lg">
                <Link to="/acheter">
                  Commencer <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outlineOnDark" shape="rounded" size="lg">
                <Link to="/vendre">Vendre des USDT</Link>
              </Button>
            </div>
          </Wrap>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
