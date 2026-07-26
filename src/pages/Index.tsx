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
  Layers,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { InteracLogo } from "@/components/marks";
import { NetworkCoin } from "@/components/illustrations";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { formatCad } from "@/lib/rates";
import { cn } from "@/lib/utils";

type NetId = "trx" | "eth" | "bnb" | "matic" | "sol" | "avax";
const networks: { id: NetId; name: string; tag: string }[] = [
  { id: "trx", name: "Tron", tag: "TRC20" },
  { id: "eth", name: "Ethereum", tag: "ERC20" },
  { id: "bnb", name: "BNB Chain", tag: "BEP20" },
  { id: "matic", name: "Polygon", tag: "Polygon PoS" },
  { id: "sol", name: "Solana", tag: "SOL" },
  { id: "avax", name: "Avalanche", tag: "C-Chain" },
];

const features = [
  { icon: KeyRound, title: "Non-custodial", desc: "Aucun solde conservé. Vos USDT vont directement dans votre wallet, ordre par ordre." },
  { icon: Landmark, title: "Paiement Interac", desc: "Payez en dollars canadiens avec Interac e-Transfer — l'outil que votre banque connaît déjà." },
  { icon: Lock, title: "Taux verrouillé 15 min", desc: "Le cours USDT/CAD est garanti pendant 15 minutes, le temps de payer. Aucune mauvaise surprise." },
  { icon: Layers, title: "6 réseaux blockchain", desc: "Recevez vos USDT sur Tron, Ethereum, BNB Chain, Polygon, Solana ou Avalanche." },
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

const Index = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const { buy } = useUsdtRate();

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main>
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          {/* ===== HERO ===== */}
          <section className="animate-up pb-6 pt-8 md:pt-12">
            <div className="rounded-3xl bg-card px-6 pb-10 pt-12 text-center md:px-16 md:pb-16 md:pt-20">
              <h1 className="mx-auto max-w-3xl text-balance font-display text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[3.4rem] md:text-[4.2rem]">
                Achetez des USDT,
                <br />
                gardez vos <span className="text-primary">clés.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
                Ooble fait une seule chose, et la fait bien : acheter et vendre
                des USDT en dollars canadiens par Interac. Non-custodial — vos
                fonds vont directement dans votre wallet.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button asChild variant="primary" shape="rounded" size="lg">
                  <Link to="/connexion">
                    Acheter des USDT <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" shape="rounded" size="lg">
                  <Link to="/connexion">Vendre des USDT</Link>
                </Button>
              </div>
              <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border bg-secondary/50 px-4 py-2 text-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="font-semibold">1 USDT = {formatCad(buy)}</span>
                <span className="text-muted-foreground">· taux du marché + 2 %</span>
              </div>
            </div>
          </section>

          {/* ===== BANDEAU CONFIANCE ===== */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-6 text-center text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              Réglé via <InteracLogo className="font-semibold text-foreground" />
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span>6 réseaux blockchain</span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span>100 % non-custodial</span>
          </div>

          {/* ===== LE PRINCIPE (4 cartes) ===== */}
          <section className="py-8 md:py-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                <span className="h-px w-7 bg-primary/40" />
                Le principe
              </p>
              <h2 className="mt-4 text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.4rem]">
                Vos fonds restent à vous, de bout en bout
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Un seul actif, un seul objectif : que vos USDT restent à vous, à chaque étape de la transaction.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl bg-card p-7 md:p-9">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                    <Icon className="h-[22px] w-[22px]" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===== COMMENT ÇA MARCHE ===== */}
          <section id="comment" className="py-8 md:py-12">
            <div className="rounded-3xl bg-card px-6 py-10 md:px-14 md:py-14">
              <div className="mx-auto max-w-2xl text-center">
                <p className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  <span className="h-px w-7 bg-primary/40" />
                  Comment ça marche
                </p>
                <h2 className="mt-4 text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.2rem]">
                  De l'inscription au règlement, en quelques minutes
                </h2>
              </div>
              <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-10">
                {steps.map(({ n, title, desc }) => (
                  <div key={n}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-tint font-display text-sm font-semibold text-accent-ink">
                      {n}
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== LE TAUX ===== */}
          <section className="py-8 md:py-12">
            <div className="rounded-3xl bg-card px-6 py-10 md:px-14 md:py-14">
              <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                <div>
                  <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    <span className="h-px w-7 bg-primary/40" />
                    Le taux
                  </p>
                  <h2 className="mt-4 text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.2rem]">
                    Le vrai taux du marché, plus 2 %
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                    Pas de dizaines de jetons, pas de confusion. Ooble se concentre sur l'USDT et applique le taux de marché réel, en direct, plus une marge transparente de 2 %.
                  </p>
                </div>
                <div className="text-center lg:text-right">
                  <p className="font-display text-[3.5rem] font-semibold leading-none tracking-[-0.03em]">
                    {formatCad(buy)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-primary">pour 1 USDT</p>
                  <p className="text-xs text-muted-foreground">verrouillé 15 min · frais inclus</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-end">
                    <Button asChild variant="primary" shape="rounded" size="lg">
                      <Link to="/connexion">
                        Acheter des USDT <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" shape="rounded" size="lg">
                      <Link to="/connexion">Vendre des USDT</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== INTERAC + SÉCURITÉ (2 cartes côte à côte) ===== */}
          <section className="py-8 md:py-12">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl bg-card p-7 md:p-9">
                <div className="flex items-center gap-3">
                  <InteracLogo className="h-7" />
                  <span className="text-sm font-medium text-muted-foreground">Moyen de paiement accepté</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">Vous payez par Interac e-Transfer</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Quand vous achetez des USDT sur Ooble, vous réglez par Interac e-Transfer — le virement que votre banque canadienne connaît déjà. Et à la vente, vous recevez vos dollars de la même façon.
                </p>
                <div className="mt-6">
                  <Button asChild variant="primary" shape="rounded" size="lg">
                    <Link to="/connexion">
                      Acheter des USDT <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                  Ooble accepte Interac e-Transfer comme moyen de paiement. Ooble
                  n'est pas affilié à Interac Corp. et ne fournit pas de services
                  Interac. « Interac » est une marque de commerce d'Interac Corp.
                </p>
              </div>

              <div className="rounded-2xl bg-card p-7 md:p-9">
                <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  <span className="h-px w-7 bg-primary/40" />
                  Sécurité
                </p>
                <h3 className="mt-4 font-display text-xl font-semibold">Pensée pour protéger vos fonds</h3>
                <ul className="mt-6 space-y-5">
                  {secure.map(({ icon: Icon, title, desc }) => (
                    <li key={title} className="flex gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-tint text-accent-ink">
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                      </span>
                      <div>
                        <h4 className="font-display text-[15px] font-semibold">{title}</h4>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ===== RÉSEAUX ===== */}
          <section className="py-8 md:py-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                <span className="h-px w-7 bg-primary/40" />
                Réseaux
              </p>
              <h2 className="mt-4 text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.2rem]">
                Six réseaux pour recevoir vos USDT
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Recevez vos USDT sur la blockchain de votre choix — vous sélectionnez le réseau à la création de votre ordre.
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {networks.map((n) => (
                <div key={n.id} className="rounded-2xl bg-card p-5 text-center transition-transform hover:-translate-y-1">
                  <NetworkCoin id={n.id} className="mx-auto h-16 w-16" />
                  <h3 className="mt-3 font-display text-sm font-semibold">{n.name}</h3>
                  <p className="text-[12px] text-muted-foreground">{n.tag}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===== FAQ ===== */}
          <section id="faq" className="py-8 md:py-12">
            <div className="rounded-3xl bg-card px-6 py-10 md:px-14 md:py-14">
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                <div>
                  <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    <span className="h-px w-7 bg-primary/40" />
                    FAQ
                  </p>
                  <h2 className="mt-4 font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.2rem]">
                    Tout ce qu'il faut savoir
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                    L'essentiel à savoir avant votre premier ordre. Une autre question ? Écrivez-nous, on répond vite.
                  </p>
                </div>
                <div className="divide-y">
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
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
                              open
                                ? "rotate-180 bg-primary text-primary-foreground"
                                : "bg-accent-tint text-primary",
                            )}
                          >
                            <ChevronDown className="h-4 w-4" />
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
              </div>
            </div>
          </section>

          {/* ===== CTA ===== */}
          <section className="py-8 pb-16 md:py-12 md:pb-20">
            <div className="rounded-3xl bg-deep px-6 py-12 text-center text-deep-foreground md:px-16 md:py-20">
              <h2 className="mx-auto max-w-2xl text-balance font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[2.8rem]">
                Prêt à échanger vos <span className="text-primary">premiers USDT</span> ?
              </h2>
              <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/65">
                Créez un ordre en quelques minutes. Vos fonds vont directement
                là où ils doivent aller : chez vous.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button asChild variant="primary" shape="rounded" size="lg">
                  <Link to="/connexion">
                    Commencer <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outlineOnDark" shape="rounded" size="lg">
                  <Link to="/connexion">Vendre des USDT</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
