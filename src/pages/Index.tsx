import { useState } from "react";
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
import { InteracLogo, MapleLeaf } from "@/components/marks";
import { CoinsArt, PhoneArt, WalletArt } from "@/components/illustrations";
import { formatCad } from "@/lib/rates";

const values = [
  { icon: KeyRound, title: "Non-custodial", desc: "Aucun solde conservé. Vos USDT vont directement de vous à votre wallet, ordre par ordre." },
  { icon: Lock, title: "Taux verrouillé", desc: "Le cours USDT/CAD est garanti 15 minutes, le temps de payer. Aucune mauvaise surprise." },
  { icon: Landmark, title: "Payé au Canada", desc: "Interac e-Transfer à l'achat comme à la vente, avec l'outil que votre banque connaît déjà." },
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
  { q: "Comment acheter des USDT ?", a: "Entrez le montant en CAD, choisissez votre réseau et votre adresse wallet, puis payez par Interac e-Transfer. Vos USDT arrivent en quelques minutes." },
  { q: "Sur quels réseaux puis-je recevoir mes USDT ?", a: "TRC20 (Tron) pour des frais très bas, et ERC20 (Ethereum) pour une compatibilité maximale avec les wallets. Vous choisissez à la création de l'ordre." },
  { q: "Comment vendre mes USDT ?", a: "Indiquez le montant, votre réseau d'envoi et votre courriel Interac. Vous recevez votre paiement CAD dès la confirmation on-chain." },
  { q: "Quels sont les frais ?", a: "Le taux affiché inclut la marge d'Ooble — ce que vous voyez est ce que vous obtenez. Aucun frais surprise." },
];

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1120px] px-6 sm:px-8 ${className}`}>{children}</div>
);

const SectionHead = ({
  index,
  eyebrow,
  children,
  sub,
  center,
  onDark,
}: {
  index: string;
  eyebrow: string;
  children: React.ReactNode;
  sub?: string;
  center?: boolean;
  onDark?: boolean;
}) => (
  <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
    <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary ${center ? "justify-center" : ""}`}>
      <span className="tabular-nums opacity-50">({index})</span>
      <span className="h-px w-7 bg-primary/40" />
      {eyebrow}
    </p>
    <h2 className={`mt-5 text-balance font-display text-[2rem] font-extrabold leading-[1.08] tracking-tight sm:text-[2.6rem] ${onDark ? "text-white" : ""}`}>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Bandeau d'annonce */}
      <div className="bg-deep text-deep-foreground">
        <Wrap className="flex items-center justify-center gap-2 py-2.5 text-center text-[13px]">
          <MapleLeaf className="h-3.5 w-3.5 text-[#EF4444]" />
          <span className="text-white/85">
            Ooble arrive au Canada — achetez et vendez vos USDT en dollars canadiens.
          </span>
        </Wrap>
      </div>

      <Header />

      <main>
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <div className="bg-wash absolute inset-0" aria-hidden />
          <Wrap className="relative grid items-center gap-10 pb-16 pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:pb-24 lg:pt-20">
            <div className="animate-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent-tint px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-ink">
                <MapleLeaf className="h-3.5 w-3.5 text-[#EF4444]" />
                USDT · Interac e-Transfer · Canada
              </span>
              <h1 className="mt-6 text-balance font-display text-[3rem] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-[4rem]">
                Achetez des USDT,
                <br />
                gardez vos <span className="text-primary">clés.</span>
              </h1>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted-foreground">
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
                <span className="font-semibold">1 USDT = {formatCad(1.4245)}</span>
                <span className="text-muted-foreground">· taux verrouillé 15 min</span>
              </div>
            </div>

            <div className="animate-up">
              <WalletArt className="mx-auto w-full max-w-[460px]" />
            </div>
          </Wrap>
        </section>

        {/* ===== BANDEAU CONFIANCE ===== */}
        <div className="border-y bg-secondary/40">
          <Wrap className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-4 text-center text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-2">
              Réglé via <InteracLogo className="text-foreground" />
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span>Réseaux TRC20 &amp; ERC20</span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span>100 % non-custodial</span>
          </Wrap>
        </div>

        {/* ===== 01 · LE PRINCIPE (3 colonnes) ===== */}
        <section className="border-b py-20 lg:py-28">
          <Wrap>
            <SectionHead
              index="01"
              eyebrow="Le principe"
              sub="Un seul actif, un seul objectif : que vos USDT restent à vous, à chaque étape."
            >
              Simple, direct, <span className="text-primary">sans détour</span>
            </SectionHead>
            <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
              {values.map((v, i) => (
                <div key={v.title} className={i === 0 ? "sm:pr-12" : "sm:px-12"}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                    <v.icon className="h-[22px] w-[22px]" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold">{v.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {v.title === "Payé au Canada" ? (
                      <>
                        <InteracLogo className="text-foreground" /> e-Transfer à l'achat comme à
                        la vente, avec l'outil que votre banque connaît déjà.
                      </>
                    ) : (
                      v.desc
                    )}
                  </p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== 02 · SÉCURITÉ (illustration à gauche) ===== */}
        <section className="bg-secondary/40 py-20 lg:py-28">
          <Wrap className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="order-2 lg:order-1">
              <PhoneArt className="mx-auto w-full max-w-[420px]" />
            </div>
            <div className="order-1 lg:order-2">
              <SectionHead index="02" eyebrow="Sécurité">
                Vos fonds protégés, <span className="text-primary">à chaque étape</span>
              </SectionHead>
              <ul className="mt-10 space-y-7">
                {secure.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-card text-primary shadow-soft ring-1 ring-border">
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Wrap>
        </section>

        {/* ===== 03 · COMMENT ÇA MARCHE (pétrole) ===== */}
        <section id="comment" className="bg-deep py-20 text-deep-foreground lg:py-28">
          <Wrap>
            <SectionHead index="03" eyebrow="Comment ça marche" onDark>
              Trois étapes, <span className="text-primary">réglé directement</span>
            </SectionHead>
            <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-3">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="border-t-2 border-white/15 pt-6">
                  <span className="font-display text-[2.6rem] font-extrabold leading-none tracking-tight text-white/20">
                    {n}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/60">{desc}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== 04 · USDT EN CAD (illustration à droite + taux) ===== */}
        <section className="border-b py-20 lg:py-28">
          <Wrap className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHead
                index="04"
                eyebrow="Un seul actif"
                sub="Pas de dizaines de jetons, pas de confusion. Ooble se concentre sur l'USDT — le stablecoin le plus utilisé — au meilleur taux canadien."
              >
                L'USDT en <span className="text-primary">dollars canadiens</span>
              </SectionHead>
              <div className="mt-8 flex items-end gap-4">
                <p className="font-display text-[3.5rem] font-extrabold leading-none tracking-[-0.03em]">
                  {formatCad(1.4245)}
                </p>
                <div className="mb-1.5">
                  <p className="text-sm font-semibold text-primary">pour 1 USDT</p>
                  <p className="text-xs text-muted-foreground">verrouillé 15 min · frais inclus</p>
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

        {/* ===== 05 · FAQ (tint) ===== */}
        <section id="faq" className="bg-secondary/40 py-20 lg:py-28">
          <Wrap className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHead
              index="05"
              eyebrow="FAQ"
              sub="L'essentiel à savoir avant votre premier ordre. Une autre question ? Écrivez-nous, on répond vite."
            >
              Vous avez <span className="text-primary">des questions ?</span>
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
                      <span className="font-display text-[15px] font-bold">{item.q}</span>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${open ? "rotate-180 bg-primary text-primary-foreground" : "bg-card text-primary"}`}>
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                    {open && (
                      <p className="-mt-1 pb-6 text-sm leading-relaxed text-muted-foreground">
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
        <section className="bg-deep py-20 text-deep-foreground lg:py-24">
          <Wrap className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-balance font-display text-[2.2rem] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[2.9rem]">
                Prêt à échanger vos <span className="text-primary">premiers USDT</span> ?
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65">
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
