import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Fingerprint,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { InteracLogo } from "@/components/marks";
import {
  StepAccount,
  StepOrder,
  StepSettle,
} from "@/components/illustrations";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { formatCad } from "@/lib/rates";
import { cn } from "@/lib/utils";

type NetId = "trx" | "eth" | "bnb" | "matic" | "sol" | "avax";
const networks: { id: NetId; name: string; tag: string }[] = [
  { id: "trx", name: "Tron", tag: "TRC20" },
  { id: "eth", name: "Ethereum", tag: "ERC20" },
  { id: "bnb", name: "BNB Chain", tag: "BEP20" },
  { id: "matic", name: "Polygon", tag: "Polygon" },
  { id: "sol", name: "Solana", tag: "SOL" },
  { id: "avax", name: "Avalanche", tag: "C-Chain" },
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
  { q: "Sur quels réseaux puis-je recevoir mes USDT ?", a: "TRC20 (Tron) pour des frais très bas, et ERC20 (Ethereum) pour une compatibilité maximale avec les wallets. Vous choisissez à la création de l'ordre." },
  { q: "Comment vendre mes USDT ?", a: "Indiquez le montant, votre réseau d'envoi et votre courriel Interac. Vous recevez votre paiement CAD dès la confirmation on-chain." },
];

const marqueeItems = [
  "Non-custodial",
  "Interac e-Transfer",
  "6 réseaux",
  "Taux verrouillé 15 min",
  "KYC simple",
  "USDT uniquement",
];

const trust = [
  { icon: Fingerprint, title: "Identité vérifiée", desc: "Un KYC simple et rapide, une seule fois." },
  { icon: ShieldCheck, title: "Chiffrement conforme", desc: "Vos données protégées selon les normes canadiennes." },
  { icon: KeyRound, title: "Vos clés, vos fonds", desc: "Aucun solde ne dort chez Ooble." },
];

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1120px] px-6 sm:px-8 ${className}`}>{children}</div>
);

const PhoneMockup = ({ rate }: { rate: number }) => {
  const received = (500 / rate).toFixed(2);
  return (
    <div className="relative animate-float">
      <div className="absolute -inset-8 rounded-[3rem] bg-foreground/[0.03] blur-2xl" aria-hidden />
      <div className="relative w-[260px] overflow-hidden rounded-[2.4rem] border-2 border-foreground/[0.08] bg-card shadow-lift sm:w-[288px]">
        <div className="mx-auto mt-3 h-[24px] w-[92px] rounded-full bg-foreground" />
        <div className="px-4 pb-6 pt-5 sm:px-5">
          <p className="text-center text-[12px] font-medium text-muted-foreground">Acheter USDT</p>

          <div className="mt-4 rounded-2xl bg-secondary px-4 py-4 text-center">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Vous payez</p>
            <p className="mt-1.5 font-display text-[26px] font-semibold tracking-tight">500,00 $</p>
            <p className="text-[10px] text-muted-foreground">CAD</p>
          </div>

          <div className="mt-2.5 rounded-2xl border border-border px-4 py-3.5 text-center">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Vous recevez</p>
            <p className="mt-1 font-display text-[18px] font-semibold tracking-tight">{received} USDT</p>
          </div>

          <div className="mt-2.5 flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
            <div className="flex items-center gap-2">
              <img src="/coins/trx.svg" alt="" className="h-5 w-5 rounded-full" draggable={false} />
              <div className="text-left">
                <p className="text-[12px] font-medium leading-tight">Tron</p>
                <p className="text-[9px] text-muted-foreground">TRC20</p>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </div>

          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            1 USDT = {formatCad(rate)} · 15 min
          </p>

          <div className="mt-3 rounded-xl bg-foreground py-3 text-center text-[13px] font-semibold text-background">
            Confirmer l'achat
          </div>
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
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* ===== HERO ===== */}
        <section className="overflow-hidden">
          <Wrap className="grid items-center gap-12 pb-20 pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:pb-28 lg:pt-20">
            <div className="animate-up">
              <h1 className="text-balance font-display text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[3.8rem] lg:text-[4.6rem]">
                Achetez des USDT.
                <br />
                Gardez vos clés.
              </h1>
              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-muted-foreground">
                Achetez et vendez des USDT en dollars canadiens par Interac
                e-Transfer. Non-custodial — vos fonds vont directement dans
                votre wallet.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild variant="appSolid" shape="pill" size="lg">
                  <Link to="/connexion">
                    Acheter des USDT <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" shape="pill" size="lg">
                  <Link to="/connexion">Vendre des USDT</Link>
                </Button>
              </div>
              <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border bg-card px-4 py-2 text-sm shadow-soft">
                <span className="h-2 w-2 animate-pulse rounded-full bg-foreground" />
                <span className="font-semibold">1 USDT = {formatCad(buy)}</span>
                <span className="text-muted-foreground">· marché + 2 %</span>
              </div>
            </div>

            <div className="animate-up flex justify-center [animation-delay:200ms] lg:justify-end">
              <PhoneMockup rate={buy} />
            </div>
          </Wrap>
        </section>

        {/* ===== MARQUEE CONFIANCE ===== */}
        <div className="border-y overflow-hidden">
          <div className="mask-fade-x py-3.5">
            <div className="animate-marquee flex w-max items-center">
              {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
                <span key={i} className="flex items-center whitespace-nowrap text-sm text-muted-foreground">
                  <span className="px-5">{item}</span>
                  <span className="h-1 w-1 rounded-full bg-foreground/20" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ===== BENTO FEATURES ===== */}
        <section className="py-24 lg:py-32">
          <Wrap>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Pourquoi Ooble
              </p>
              <h2 className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] sm:text-[2.6rem]">
                Un seul actif. Un seul objectif.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Ooble se concentre sur l'USDT — et uniquement l'USDT. Chaque
                fonctionnalité est pensée pour que vos fonds restent à vous.
              </p>
            </div>

            <div className="mt-14 grid gap-4 lg:grid-cols-[1.3fr_1fr] lg:grid-rows-2">
              {/* Taux — dark card, spans 2 rows */}
              <div className="relative overflow-hidden rounded-[1.4rem] bg-foreground p-8 text-background transition-transform duration-300 hover:-translate-y-0.5 lg:row-span-2 lg:p-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-background/40">
                  Taux en direct
                </p>
                <div className="mt-8 flex items-baseline gap-3">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-background/50" />
                  <p className="font-display text-[3rem] font-semibold leading-none tracking-[-0.03em] sm:text-[3.8rem]">
                    {formatCad(buy)}
                  </p>
                </div>
                <p className="mt-3 text-[15px] text-background/50">
                  pour 1 USDT · verrouillé 15 min
                </p>
                <p className="mt-1 text-sm text-background/30">
                  Taux de marché réel + marge transparente de 2 %
                </p>
                <div className="mt-8">
                  <Link
                    to="/connexion"
                    className="inline-flex select-none items-center gap-2 rounded-full bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    Acheter maintenant <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 rounded-full border border-background/[0.06]" aria-hidden />
                <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full border border-background/[0.04]" aria-hidden />
              </div>

              {/* Non-custodial */}
              <div className="rounded-[1.4rem] border border-border bg-card p-7 transition-transform duration-300 hover:-translate-y-0.5 sm:p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                  <KeyRound className="h-5 w-5 text-foreground/70" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">Non-custodial</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Vos USDT vont directement dans votre wallet. Aucun solde
                  conservé — rien à retirer, rien à geler.
                </p>
              </div>

              {/* Interac */}
              <div className="rounded-[1.4rem] border border-border bg-card p-7 transition-transform duration-300 hover:-translate-y-0.5 sm:p-8">
                <InteracLogo className="h-7" />
                <h3 className="mt-5 font-display text-lg font-semibold">Interac e-Transfer</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  L'outil que votre banque connaît déjà. À l'achat comme
                  à la vente, en dollars canadiens.
                </p>
              </div>
            </div>

            {/* Réseaux — full width */}
            <div className="mt-4 rounded-[1.4rem] border border-border bg-card p-7 transition-transform duration-300 hover:-translate-y-0.5 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="shrink-0">
                  <h3 className="font-display text-lg font-semibold">6 réseaux supportés</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Recevez vos USDT sur la blockchain de votre choix.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {networks.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center gap-2 rounded-xl border border-border py-2 pl-2 pr-3.5 transition-colors hover:bg-secondary/50"
                    >
                      <img src={`/coins/${n.id}.svg`} alt="" className="h-6 w-6 rounded-full" draggable={false} />
                      <span className="whitespace-nowrap text-sm font-medium">{n.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== SÉCURITÉ ===== */}
        <section className="border-y py-16 lg:py-20">
          <Wrap>
            <div className="grid gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
              {trust.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className={cn("flex flex-col", i === 0 ? "sm:pr-10" : "sm:px-10")}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                    <Icon className="h-5 w-5 text-foreground/70" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== COMMENT ÇA MARCHE ===== */}
        <section id="comment" data-dark className="bg-foreground py-24 text-background lg:py-32">
          <Wrap>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-background/40">
                Comment ça marche
              </p>
              <h2 className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] sm:text-[2.6rem]">
                De l'inscription au règlement, en quelques minutes
              </h2>
            </div>

            <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-3">
              {steps.map(({ n, title, desc, Art }) => (
                <div key={n} className="text-center">
                  <Art className="mx-auto h-24 w-24" />
                  <div className="mt-6 border-t border-background/10 pt-5">
                    <span className="font-display text-sm font-semibold text-background/25">{n}</span>
                    <h3 className="mt-2 font-display text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-background/50">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 flex justify-center">
              <Link
                to="/connexion"
                className="inline-flex select-none items-center gap-2 rounded-full bg-background px-7 py-3.5 text-[15px] font-semibold text-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Commencer maintenant <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Wrap>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="py-24 lg:py-32">
          <Wrap className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">FAQ</p>
              <h2 className="mt-4 font-display text-[1.8rem] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[2.2rem]">
                Questions fréquentes
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                L'essentiel à savoir avant votre premier ordre. Une question ?{" "}
                <Link to="/contact" className="font-medium text-foreground underline underline-offset-2">
                  Écrivez-nous
                </Link>.
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
                      <span className="font-display text-[15px] font-semibold">{item.q}</span>
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all",
                          open
                            ? "rotate-180 bg-foreground text-background"
                            : "bg-secondary text-foreground",
                        )}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </span>
                    </button>
                    {open && (
                      <p className="-mt-1 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Wrap>
        </section>

        {/* ===== CTA ===== */}
        <section data-dark className="relative overflow-hidden bg-foreground py-24 text-background lg:py-28">
          <div className="pointer-events-none absolute inset-0 bg-diagonal opacity-40" aria-hidden />
          <Wrap className="relative text-center">
            <h2 className="mx-auto max-w-2xl text-balance font-display text-[2.2rem] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[3rem]">
              Prêt à échanger vos premiers USDT ?
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-background/50">
              Créez un ordre en quelques minutes. Vos fonds vont directement
              là où ils doivent aller : chez vous.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/connexion"
                className="inline-flex select-none items-center gap-2 rounded-full bg-background px-7 py-3.5 text-[15px] font-semibold text-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Commencer <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/connexion"
                className="inline-flex select-none items-center gap-2 rounded-full border border-background/20 px-7 py-3.5 text-[15px] font-semibold text-background transition-all hover:bg-background/10 active:scale-[0.98]"
              >
                Vendre des USDT
              </Link>
            </div>
          </Wrap>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
