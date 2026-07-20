import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Clock,
  Coins,
  HandCoins,
  KeyRound,
  Repeat,
  Shield,
  Wallet,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TetherMark from "@/components/TetherMark";
import { DEMO_RATES, formatCad } from "@/lib/rates";

const actions = [
  { icon: Coins, label: "Acheter", sub: "Achat rapide", to: "/acheter", full: false },
  { icon: HandCoins, label: "Vendre", sub: "Vente rapide", to: "/vendre", full: false },
  { icon: KeyRound, label: "Non-custodial", sub: "Vos clés, vos fonds", to: "/#comment", full: true },
];

const marquee = [
  "Interac e-Transfer",
  "USDT",
  "Tron · TRC20",
  "Ethereum · ERC20",
  "MetaMask",
  "Trust Wallet",
  "Ledger",
  "Dollar canadien",
];

const features = [
  { icon: KeyRound, title: "Non-custodial", desc: "Aucun solde conservé. Chaque ordre est réglé directement vers votre wallet ou votre compte bancaire." },
  { icon: Zap, title: "Règlement rapide", desc: "Achats et ventes traités en quelques minutes après la confirmation du paiement." },
  { icon: Wallet, title: "Multi-réseaux", desc: "Recevez vos USDT sur TRC20 (Tron) ou ERC20 (Ethereum), au choix." },
  { icon: Repeat, title: "Meilleur taux CAD", desc: "Un taux USDT/CAD transparent et compétitif, verrouillé 15 minutes par ordre." },
  { icon: Shield, title: "Sécurité & KYC", desc: "Vérification d'identité et conformité canadienne pour protéger vos fonds." },
  { icon: Clock, title: "Support réactif", desc: "Une équipe disponible pour vous accompagner à chaque étape." },
];

const networks = [
  { name: "Tron", sub: "TRC20", glyph: "T", tint: "text-red-400" },
  { name: "Ethereum", sub: "ERC20", glyph: "Ξ", tint: "text-indigo-300" },
];

const why = [
  { icon: KeyRound, title: "Vos fonds restent à vous", desc: "Le modèle non-custodial élimine le risque d'un solde gelé : rien ne dort chez Ooble." },
  { icon: Zap, title: "Ordres instantanés", desc: "Confirmés en quelques minutes, à toute heure, dès réception du paiement." },
  { icon: Coins, title: "Prix compétitifs", desc: "Un taux USDT/CAD transparent, frais inclus, sans coût caché." },
  { icon: Shield, title: "KYC rapide", desc: "Vérification d'identité simple pour démarrer en quelques minutes." },
  { icon: Wallet, title: "Interface claire", desc: "Une expérience fluide, pensée pour aller à l'essentiel." },
  { icon: Clock, title: "Toujours disponible", desc: "Créez un ordre quand vous voulez — la plateforme est ouverte 24/7." },
];

const steps = [
  { n: "1", title: "Créez votre compte", desc: "Inscription en quelques secondes, vérification rapide de votre identité." },
  { n: "2", title: "Choisissez votre opération", desc: "Achat ou vente — entrez le montant et sélectionnez votre réseau." },
  { n: "3", title: "Réglé directement", desc: "Vos USDT arrivent dans votre wallet, ou vos CAD dans votre compte Interac." },
];

const faqs = [
  { q: "Qu'est-ce que « non-custodial » veut dire ?", a: "Ooble ne conserve aucun solde. À l'achat, les USDT sont envoyés directement sur votre adresse wallet ; à la vente, le paiement CAD part directement vers votre compte via Interac. Vos fonds ne dorment jamais sur la plateforme." },
  { q: "Comment acheter des USDT ?", a: "Entrez le montant en CAD, choisissez votre réseau et votre adresse wallet, puis payez par Interac e-Transfer. Vos USDT arrivent en quelques minutes." },
  { q: "Quels réseaux sont supportés ?", a: "TRC20 (Tron) pour des frais très bas, et ERC20 (Ethereum) pour une compatibilité maximale avec les wallets." },
  { q: "Comment vendre mes USDT ?", a: "Indiquez le montant, votre réseau d'envoi et votre courriel Interac. Vous recevez votre paiement CAD dès la confirmation on-chain." },
  { q: "Quels sont les frais ?", a: "Le taux affiché inclut la marge d'Ooble — ce que vous voyez est ce que vous obtenez. Aucun frais surprise au moment de payer." },
  { q: "Pourquoi vérifier mon identité ?", a: "L'échange entre dollars canadiens et cryptoactifs est encadré au Canada (FINTRAC). La vérification est obligatoire et se fait une seule fois, en quelques minutes." },
];

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1120px] px-6 sm:px-8 ${className}`}>{children}</div>
);

const SectionHead = ({
  eyebrow,
  title,
  sub,
  center,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  center?: boolean;
}) => (
  <div className={`mb-9 ${center ? "text-center" : ""}`}>
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {eyebrow}
    </p>
    <h2 className="mt-2.5 text-[1.9rem] font-extrabold leading-[1.1] tracking-tight sm:text-[2.1rem]">
      {title}
    </h2>
    {sub && (
      <p className={`mt-3 text-[15px] text-muted-foreground ${center ? "" : "max-w-lg"}`}>
        {sub}
      </p>
    )}
  </div>
);

const Index = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div className="guide-lines min-h-screen bg-background">
      <Header />
      <div className="h-16" />

      <main className="relative z-[1]">
        {/* ===== HERO ===== */}
        <header className="relative">
          <Wrap className="pb-16 pt-16 sm:pt-20">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
              {/* Texte */}
              <div className="animate-up">
                <span className="inline-flex items-center gap-2 rounded-full border border-hair bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(172_44%_46%)]" />
                  Non-custodial · Interac e-Transfer · 🇨🇦
                </span>
                <h1 className="mt-5 text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.035em] sm:text-[3.4rem]">
                  Achetez et vendez
                  <br />
                  des USDT en CAD
                </h1>
                <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted-foreground">
                  Achat et vente de USDT en quelques minutes. Rapide, sécurisé,
                  au meilleur taux canadien — et vos fonds vont directement dans
                  votre wallet.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/acheter"
                    className="inline-flex h-[50px] items-center gap-2 rounded-xl bg-white px-7 text-[15px] font-bold text-[#141414] transition-transform hover:-translate-y-0.5"
                  >
                    Commencer <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#comment"
                    className="inline-flex h-[50px] items-center rounded-xl border border-hair bg-secondary px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Comment ça marche
                  </a>
                </div>
              </div>

              {/* App directement sur le fond : taux + actions */}
              <div className="animate-up">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Taux USDT / CAD · en direct
                </p>
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[3.2rem] font-bold leading-none tracking-[-1.5px]">
                      {formatCad(DEMO_RATES.buy).replace("$", "").trim()}
                    </span>
                    <span className="text-base font-semibold text-muted-foreground">CAD</span>
                  </div>
                  <TetherMark className="h-12 w-12 opacity-90" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {actions.map(({ icon: Icon, label, sub, to, full }) => (
                    <Link
                      key={label}
                      to={to}
                      className={`group rounded-[18px] border border-hair p-[18px] text-left transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.02] ${
                        full ? "col-span-2" : ""
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-icon">
                          <Icon className="h-5 w-5 text-white/85" strokeWidth={1.8} />
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-white/20 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <p className="text-[15px] font-semibold">{label}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Wrap>

          {/* Marquee */}
          <div className="border-y border-hair py-4">
            <div className="mask-fade-x flex overflow-hidden">
              <div className="flex shrink-0 animate-marquee items-center gap-14 pr-14">
                {[...marquee, ...marquee].map((item, i) => (
                  <span
                    key={i}
                    className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(172_44%_46%)]/60" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ===== FEATURES (grille bordée) ===== */}
        <section id="features" className="border-t border-hair">
          <Wrap className="py-[72px]">
            <SectionHead
              eyebrow="Fonctionnalités"
              title="Tout ce qu'il vous faut pour vos USDT"
              sub="Une plateforme simple pour acheter et vendre vos USDT, sans jamais lâcher vos clés."
            />
            <div className="grid border-l border-t border-hair sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="border-b border-r border-hair p-7">
                  <span className="mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-icon">
                    <Icon className="h-5 w-5 text-white/85" strokeWidth={1.8} />
                  </span>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== RÉSEAUX ===== */}
        <section id="networks" className="border-t border-hair">
          <Wrap className="py-[72px]">
            <SectionHead
              eyebrow="Réseaux"
              title="Recevez vos USDT sur le réseau de votre choix"
              sub="Deux réseaux éprouvés, sélectionnés à la création de votre ordre."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {networks.map((n) => (
                <div
                  key={n.name}
                  className="flex items-center gap-4 rounded-2xl border border-hair p-5 transition-colors hover:border-white/20"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full bg-icon text-2xl font-bold ${n.tint}`}>
                    {n.glyph}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold">{n.name}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                      {n.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== PAIEMENTS ===== */}
        <section className="border-t border-hair">
          <Wrap className="py-[72px]">
            <SectionHead
              eyebrow="Paiements"
              title="Payez avec Interac e-Transfer"
              sub="Le moyen de paiement que toutes les banques canadiennes connaissent, pour acheter comme pour être payé."
            />
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-[18px] border border-hair p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-extrabold text-[#141414]">
                  ⇄
                </span>
                <div>
                  <p className="text-base font-semibold">Interac e-Transfer</p>
                  <p className="text-sm text-muted-foreground">Achat et paiement instantanés</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-[18px] border border-hair p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-icon text-lg font-bold">
                  🏦
                </span>
                <div>
                  <p className="text-base font-semibold">Virement bancaire</p>
                  <p className="text-sm text-muted-foreground">Pour les gros montants · à venir</p>
                </div>
              </div>
            </div>
          </Wrap>
        </section>

        {/* ===== POURQUOI OOBLE ===== */}
        <section className="border-t border-hair">
          <Wrap className="py-[72px]">
            <SectionHead
              eyebrow="Pourquoi Ooble"
              title="L'échange de USDT, sans jamais lâcher vos fonds"
              sub="Une plateforme pensée pour la sécurité de vos fonds et la simplicité du paiement canadien."
            />
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {why.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-[20px] border border-hair p-6 transition-transform hover:-translate-y-0.5"
                >
                  <span className="mb-[18px] flex h-11 w-11 items-center justify-center rounded-[13px] bg-icon">
                    <Icon className="h-[21px] w-[21px] text-white/90" strokeWidth={1.8} />
                  </span>
                  <h3 className="text-[16.5px] font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== COMMENT ÇA MARCHE ===== */}
        <section id="comment" className="border-t border-hair">
          <Wrap className="py-[72px]">
            <SectionHead
              eyebrow="Comment ça marche"
              title="Démarrez en 3 étapes"
              sub="De l'inscription au règlement, tout est pensé pour aller vite."
            />
            <div className="grid gap-5 sm:grid-cols-3">
              {steps.map(({ n, title, desc }) => (
                <div key={n}>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-hair bg-icon text-[15px] font-bold">
                    {n}
                  </div>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="border-t border-hair">
          <div className="mx-auto max-w-[760px] px-6 py-[72px] sm:px-8">
            <SectionHead eyebrow="FAQ" title="Questions fréquentes" center />
            <div>
              {faqs.map((item, i) => {
                const open = faqOpen === i;
                return (
                  <div key={i} className="border-b border-hair">
                    <button
                      onClick={() => setFaqOpen(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className={`text-[15px] font-medium ${open ? "text-white" : "text-white/80"}`}>
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`h-[17px] w-[17px] shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="border-t border-hair">
          <Wrap className="py-[88px] text-center">
            <h2 className="text-[2.1rem] font-extrabold tracking-tight sm:text-[2.4rem]">
              Prêt à commencer ?
            </h2>
            <p className="mx-auto mt-3.5 max-w-md text-base text-muted-foreground">
              Créez votre compte et échangez vos premiers USDT en quelques
              minutes. Vos fonds vont directement là où ils doivent aller :
              chez vous.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/acheter"
                className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-[#141414] transition-transform hover:-translate-y-0.5"
              >
                Acheter des USDT <ArrowRight className="h-[17px] w-[17px]" />
              </Link>
              <Link
                to="/vendre"
                className="inline-flex h-[52px] items-center rounded-xl border border-hair bg-secondary px-8 text-base font-semibold text-white transition-colors hover:bg-white/10"
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
