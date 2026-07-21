import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Fingerprint,
  KeyRound,
  Landmark,
  Lock,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppMockup from "@/components/AppMockup";
import Markets from "@/components/Markets";
import Coin from "@/components/Coin";
import { Button } from "@/components/ui/button";
import { InteracLogo, MapleLeaf } from "@/components/marks";
import { formatCad } from "@/lib/rates";

const props = [
  {
    icon: KeyRound,
    title: "100 % non-custodial",
    desc: "Aucun solde conservé. Vos fonds vont directement de vous à votre wallet, ordre par ordre.",
  },
  {
    icon: Lock,
    title: "Taux verrouillé",
    desc: "Le cours affiché est garanti 15 minutes, le temps de payer. Aucune mauvaise surprise.",
    interac: false,
  },
  {
    icon: Landmark,
    title: "Payé au Canada",
    desc: "Interac e-Transfer à l'achat comme à la vente, avec l'outil que votre banque connaît déjà.",
    interac: true,
  },
];

const steps = [
  { n: "01", title: "Créez votre compte", desc: "Inscription et vérification d'identité en quelques minutes, une seule fois." },
  { n: "02", title: "Créez votre ordre", desc: "Montant, réseau, destination — le taux se verrouille pour 15 minutes." },
  { n: "03", title: "Réglé directement", desc: "Vos USDT dans votre wallet, ou vos CAD dans votre compte Interac." },
];

const trust = [
  { icon: KeyRound, title: "Non-custodial", desc: "Aucun solde conservé — vos fonds vont directement à votre wallet." },
  { icon: Fingerprint, title: "Identité vérifiée", desc: "Un KYC simple et rapide protège chaque transaction." },
  { icon: Landmark, title: "Conforme au Canada", desc: "Conçu autour des exigences canadiennes et de la tenue des dossiers." },
];

const faqs = [
  { q: "Qu'est-ce que « non-custodial » veut dire ?", a: "Ooble ne conserve aucun solde. À l'achat, les USDT sont envoyés directement sur votre adresse wallet ; à la vente, le paiement CAD part directement vers votre compte via Interac. Vos fonds ne dorment jamais sur la plateforme." },
  { q: "Comment acheter des USDT ?", a: "Entrez le montant en CAD, choisissez votre réseau et votre adresse wallet, puis payez par Interac e-Transfer. Vos USDT arrivent en quelques minutes." },
  { q: "Quels réseaux sont supportés ?", a: "TRC20 (Tron) pour des frais très bas, et ERC20 (Ethereum) pour une compatibilité maximale avec les wallets." },
  { q: "Comment vendre mes USDT ?", a: "Indiquez le montant, votre réseau d'envoi et votre courriel Interac. Vous recevez votre paiement CAD dès la confirmation on-chain." },
  { q: "Quels sont les frais ?", a: "Le taux affiché inclut la marge d'Ooble — ce que vous voyez est ce que vous obtenez. Aucun frais surprise." },
];

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1120px] px-6 sm:px-8 ${className}`}>{children}</div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">{children}</p>
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
        <section className="relative overflow-hidden border-b">
          <div className="bg-wash absolute inset-0" aria-hidden />
          <Wrap className="relative grid gap-12 pb-16 pt-12 lg:grid-cols-2 lg:gap-16 lg:pb-20 lg:pt-16">
            <div className="animate-up">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <MapleLeaf className="h-3.5 w-3.5 text-[#EF4444]" />
                Non-custodial · Interac e-Transfer
              </span>
              <h1 className="mt-5 font-display text-[2.7rem] font-extrabold leading-[1.04] tracking-tight sm:text-[3.5rem]">
                Achetez des USDT,
                <br />
                gardez vos clés.
              </h1>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted-foreground">
                Le moyen le plus direct d'acheter et de vendre des USDT en
                dollars canadiens. Payez par Interac, recevez dans votre wallet
                — aucun solde ne dort chez Ooble.
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
              <div className="mt-9 flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Coin id="usdt" size={26} />
                  <Coin id="trx" size={26} className="-ml-2.5 ring-2 ring-background rounded-full" />
                  <Coin id="eth" size={26} className="-ml-2.5 ring-2 ring-background rounded-full" />
                </div>
                <span>
                  USDT sur TRC20 &amp; ERC20 · réglé via <InteracLogo className="text-foreground" />
                </span>
              </div>
            </div>

            {/* Cotation ouverte (sans boîte) */}
            <div className="animate-up lg:border-l lg:border-border lg:pl-16">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Coin id="usdt" size={40} />
                  <div>
                    <p className="font-display text-[15px] font-bold leading-tight">Tether · USDT</p>
                    <p className="text-xs text-muted-foreground">Cours en dollars canadiens</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-accent-ink">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  En direct
                </span>
              </div>

              <div className="mt-6 flex items-end gap-3">
                <p className="font-display text-6xl font-extrabold leading-none tracking-tight">
                  {formatCad(1.4245)}
                </p>
                <span className="mb-1.5 flex items-center gap-1 text-sm font-semibold text-primary">
                  <TrendingUp className="h-4 w-4" /> +0,3 %
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Taux garanti 15 minutes à chaque ordre</p>

              <svg viewBox="0 0 460 90" className="mt-5 w-full" fill="none" preserveAspectRatio="none">
                <path
                  d="M0 74 L52 64 L104 68 L156 48 L208 54 L260 34 L312 40 L364 22 L416 28 L460 8"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 74 L52 64 L104 68 L156 48 L208 54 L260 34 L312 40 L364 22 L416 28 L460 8 V90 H0 Z"
                  fill="hsl(var(--primary) / 0.08)"
                />
              </svg>

              <div className="mt-6 flex items-center justify-between border-t pt-5 text-sm">
                <div>
                  <span className="text-muted-foreground">500,00 $ CAD</span>
                  <ArrowRight className="mx-2 inline h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">351,00 USDT</span>
                </div>
                <Link to="/acheter" className="font-semibold text-primary hover:underline">
                  Échanger →
                </Link>
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== MARCHÉ ===== */}
        <section className="border-b py-16 lg:py-20">
          <Wrap>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Marché en direct</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.4rem]">
                  Les cours, en temps réel
                </h2>
              </div>
              <p className="max-w-xs text-sm text-muted-foreground">
                Échange disponible sur USDT. Les autres cours sont affichés à
                titre indicatif.
              </p>
            </div>
            <div className="mt-8">
              <Markets />
            </div>
          </Wrap>
        </section>

        {/* ===== VALEURS (colonnes, sans boîte) ===== */}
        <section className="border-b py-16 lg:py-24">
          <Wrap>
            <div className="grid gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
              {props.map((p, i) => (
                <div key={p.title} className={i === 0 ? "sm:pr-10" : "sm:px-10"}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius)] bg-accent-tint text-accent-ink">
                    <p.icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.interac ? (
                      <>
                        <InteracLogo className="text-foreground" /> e-Transfer à l'achat comme à
                        la vente, avec l'outil que votre banque connaît déjà.
                      </>
                    ) : (
                      p.desc
                    )}
                  </p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== APP (bande pétrole) ===== */}
        <section className="bg-deep text-deep-foreground">
          <Wrap className="relative grid items-center gap-12 py-16 lg:grid-cols-[1fr_auto] lg:gap-16 lg:py-20">
            <div>
              <Eyebrow>L'application</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Un ordre, suivi de bout en bout
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                Créez un ordre, suivez son statut en temps réel et recevez votre
                reçu on-chain — dans une interface pensée pour aller à
                l'essentiel.
              </p>
              <ul className="mt-8 space-y-3.5">
                {[
                  "Taux verrouillé affiché avant de payer",
                  "Suivi de l'ordre étape par étape",
                  "Reçu vérifiable directement sur la blockchain",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-white/85">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild variant="primary" shape="rounded" size="lg">
                  <Link to="/acheter">
                    Acheter des USDT <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outlineOnDark" shape="rounded" size="lg">
                  <Link to="/vendre">Vendre des USDT</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <AppMockup />
            </div>
          </Wrap>
        </section>

        {/* ===== STATS (ligne, sans boîte) ===== */}
        <section className="border-b">
          <Wrap>
            <div className="grid gap-8 border-b py-14 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
              {[
                { big: "0 $", label: "Solde conservé sur la plateforme" },
                { big: "15 min", label: "Taux garanti à chaque ordre" },
                { big: "~4 min", label: "Règlement moyen après paiement" },
              ].map((s, i) => (
                <div key={s.label} className={`text-center sm:text-left ${i === 0 ? "sm:pr-10" : "sm:px-10"}`}>
                  <p className="font-display text-5xl font-extrabold tracking-tight text-primary">
                    {s.big}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== COMMENT ÇA MARCHE (flux, sans boîte) ===== */}
        <section id="comment" className="border-b py-16 lg:py-24">
          <Wrap>
            <div className="max-w-2xl">
              <Eyebrow>Comment ça marche</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
                Trois étapes, réglé directement
              </h2>
            </div>
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="border-t-2 border-primary/20 pt-6">
                  <p className="font-display text-4xl font-extrabold tracking-tight text-primary/25">
                    {n}
                  </p>
                  <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== SÉCURITÉ (colonnes) ===== */}
        <section className="border-b py-16 lg:py-24">
          <Wrap>
            <div className="max-w-2xl">
              <Eyebrow>Sécurité &amp; conformité</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
                Une plateforme qui protège vos fonds
              </h2>
            </div>
            <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
              {trust.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className={i === 0 ? "sm:pr-10" : "sm:px-10"}>
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.8} />
                  <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== FAQ (lignes, sans boîte) ===== */}
        <section id="faq" className="border-b py-16 lg:py-24">
          <Wrap className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Vous avez des questions ?
              </h2>
              <p className="mt-4 text-muted-foreground">
                L'essentiel à savoir avant votre premier ordre. Une autre
                question ? Écrivez-nous.
              </p>
            </div>
            <div className="divide-y border-t border-b">
              {faqs.map((item, i) => {
                const open = faqOpen === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setFaqOpen(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="font-display text-[15px] font-semibold">{item.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`}
                      />
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

        {/* ===== CTA (bande pétrole) ===== */}
        <section className="bg-deep text-deep-foreground">
          <Wrap className="relative grid items-center gap-8 py-16 lg:grid-cols-[1.4fr_1fr] lg:py-20">
            <div>
              <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-[2.7rem]">
                Prêt à échanger vos premiers USDT ?
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
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
