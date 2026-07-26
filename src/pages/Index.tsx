import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { InteracLogo } from "@/components/marks";
import RateChart from "@/components/app/RateChart";
import {
  CoinsArt,
  InteracArt,
  NetworkCoin,
  PhoneArt,
  StepAccount,
  StepOrder,
  StepSettle,
} from "@/components/illustrations";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { formatCad } from "@/lib/rates";
import { cn } from "@/lib/utils";

type NetId = "trx" | "eth" | "bnb" | "matic" | "sol" | "avax";

/** Réseaux, avec l'information réellement utile : le coût d'envoi. */
const networks: { id: NetId; name: string; tag: string; note: string }[] = [
  { id: "trx", name: "Tron", tag: "TRC20", note: "Frais les plus bas" },
  { id: "eth", name: "Ethereum", tag: "ERC20", note: "Compatibilité maximale" },
  { id: "bnb", name: "BNB Chain", tag: "BEP20", note: "Frais bas" },
  { id: "matic", name: "Polygon", tag: "Polygon", note: "Frais bas" },
  { id: "sol", name: "Solana", tag: "SOL", note: "Confirmation rapide" },
  { id: "avax", name: "Avalanche", tag: "C-Chain", note: "Confirmation rapide" },
];

const steps = [
  {
    n: "01",
    title: "Créez votre compte",
    desc: "Courriel, pièce d'identité, selfie. La vérification se fait une seule fois et prend quelques minutes.",
    meta: "Une seule fois",
    Art: StepAccount,
  },
  {
    n: "02",
    title: "Créez votre ordre",
    desc: "Vous entrez le montant en dollars canadiens, choisissez le réseau de réception et collez votre adresse wallet. Le taux se verrouille immédiatement.",
    meta: "Taux garanti 15 minutes",
    Art: StepOrder,
  },
  {
    n: "03",
    title: "Réglé directement",
    desc: "Vous payez par Interac e-Transfer, nous envoyons vos USDT sur votre adresse. À la vente, c'est l'inverse : vos dollars arrivent sur votre compte.",
    meta: "Aucun solde conservé",
    Art: StepSettle,
  },
];

const faqs = [
  { q: "Qu'est-ce que « non-custodial » veut dire ?", a: "Ooble ne conserve aucun solde. À l'achat, les USDT sont envoyés directement sur votre adresse wallet ; à la vente, le paiement CAD part directement vers votre compte via Interac. Vos fonds ne dorment jamais sur la plateforme — il n'y a rien à retirer, rien à geler." },
  { q: "Comment est calculé le taux ?", a: "Nous partons du taux de marché réel USDT/CAD, en direct, auquel s'ajoute une marge unique de 2 %. Le taux affiché inclut déjà cette marge : il n'y a aucun frais ajouté à l'étape du paiement." },
  { q: "Comment acheter des USDT ?", a: "Entrez le montant en CAD, choisissez votre réseau et votre adresse wallet, puis payez par Interac e-Transfer. Vos USDT arrivent en quelques minutes après réception du virement." },
  { q: "Sur quels réseaux puis-je recevoir mes USDT ?", a: "Six réseaux au choix : Tron (TRC20) pour des frais très bas, Ethereum (ERC20) pour une compatibilité maximale, ainsi que BNB Chain, Polygon, Solana et Avalanche. Vous sélectionnez le réseau à la création de l'ordre." },
  { q: "Comment vendre mes USDT ?", a: "Indiquez le montant, votre réseau d'envoi et votre courriel Interac. Vous recevez votre paiement en dollars canadiens dès la confirmation on-chain de votre envoi." },
  { q: "Combien de temps le taux est-il garanti ?", a: "Quinze minutes à partir de la création de l'ordre. Ce délai vous laisse le temps d'effectuer votre virement Interac sans subir les variations du marché." },
];

const TREND = [1.38, 1.39, 1.385, 1.4, 1.398, 1.41, 1.405, 1.418, 1.425, 1.42, 1.43, 1.428];

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1120px] px-6 sm:px-8 ${className}`}>{children}</div>
);

/** Libellé de section, aligné sur un filet. */
const Label = ({ children, inverted }: { children: React.ReactNode; inverted?: boolean }) => (
  <p
    className={cn(
      "flex items-center gap-3 text-[11px] uppercase tracking-[0.2em]",
      inverted ? "text-background/40" : "text-muted-foreground",
    )}
  >
    <span className={cn("h-px w-6", inverted ? "bg-background/25" : "bg-foreground/20")} />
    {children}
  </p>
);

const Index = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const { base, buy, sell } = useUsdtRate();
  const margin = buy - base;

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
    <div className="app-type min-h-screen bg-background">
      <Header />

      <main>
        {/* ================= HÉROS — purement typographique ================= */}
        <section>
          <Wrap className="pb-16 pt-16 text-center lg:pb-20 lg:pt-24">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Plateforme non-custodial · Canada
            </p>

            <h1 className="mx-auto mt-8 max-w-[15ch] text-balance font-display text-[3rem] leading-[0.98] tracking-[-0.05em] sm:text-[4.6rem] lg:text-[5.4rem]">
              Achetez des USDT en dollars canadiens
            </h1>

            <p className="mx-auto mt-8 max-w-lg text-[16px] leading-relaxed text-muted-foreground">
              Vous réglez par Interac e-Transfer, vous recevez sur le réseau de
              votre choix. Vos fonds vont directement dans votre wallet — Ooble
              n'en conserve aucun.
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

          {/* Bande de chiffres réels */}
          <div className="border-y">
            <Wrap className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4">
              {[
                { v: formatCad(buy), k: "Taux à l'achat" },
                { v: "15 min", k: "Taux garanti" },
                { v: "2 %", k: "Marge unique" },
                { v: "6", k: "Réseaux" },
              ].map((s, i) => (
                <div key={s.k} className={cn("py-7 text-center", i % 2 === 1 && "border-l sm:border-l-0")}>
                  <p className="font-display text-[1.6rem] leading-none tracking-[-0.03em] sm:text-[2rem]">
                    {s.v}
                  </p>
                  <p className="mt-2 text-[12px] text-muted-foreground">{s.k}</p>
                </div>
              ))}
            </Wrap>
          </div>
        </section>

        {/* ================= COMMENT ÇA MARCHE — rangées éditoriales ================= */}
        <section id="comment" className="py-20 lg:py-28">
          <Wrap>
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <Label>Comment ça marche</Label>
              <h2 className="text-balance font-display text-[1.9rem] leading-[1.08] tracking-[-0.04em] sm:text-[2.6rem]">
                Trois étapes, et vos USDT sont chez vous
              </h2>
            </div>

            <div className="mt-14 divide-y border-t">
              {steps.map(({ n, title, desc, meta, Art }) => (
                <div
                  key={n}
                  className="grid items-center gap-6 py-10 sm:grid-cols-[auto_1fr_auto] sm:gap-10 lg:py-12"
                >
                  <p className="font-display text-[2.4rem] leading-none tracking-[-0.04em] text-foreground/20 sm:text-[3rem]">
                    {n}
                  </p>
                  <div>
                    <h3 className="font-display text-[1.3rem] leading-tight tracking-[-0.03em] sm:text-[1.55rem]">
                      {title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
                      {desc}
                    </p>
                    <p className="mt-4 inline-flex rounded-full bg-secondary px-3 py-1 text-[12px] text-muted-foreground">
                      {meta}
                    </p>
                  </div>
                  <Art className="h-24 w-24 shrink-0 sm:h-28 sm:w-28" />
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Button asChild variant="appSolid" shape="rounded" size="lg">
                <Link to="/connexion">
                  Créer mon compte <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Wrap>
        </section>

        {/* ================= LE TAUX — le calcul, comme un reçu ================= */}
        <section data-dark className="bg-foreground py-20 text-background lg:py-28">
          <Wrap className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
            <div>
              <Label inverted>Le taux</Label>
              <h2 className="mt-6 text-balance font-display text-[1.9rem] leading-[1.08] tracking-[-0.04em] text-background sm:text-[2.6rem]">
                Le taux du marché, plus 2 %. Rien d'autre.
              </h2>
              <p className="mt-6 max-w-md text-[14.5px] leading-relaxed text-background/55">
                Nous partons du cours réel USDT/CAD, en direct. Nous y ajoutons
                une marge unique de 2 %, déjà comprise dans le taux affiché. Il
                n'y a pas de frais de dossier, pas de frais de retrait, pas de
                surprise à la dernière étape.
              </p>

              <RateChart data={TREND} height={80} className="mt-10 w-full text-background/40" />
            </div>

            {/* Décomposition du calcul */}
            <div className="rounded-2xl border border-background/15 p-6 sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-background/40">
                Pour 1 USDT
              </p>

              <dl className="mt-6 divide-y divide-background/10">
                <div className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-[14px] text-background/55">Cours du marché</dt>
                  <dd className="font-display text-[15px] tracking-tight">{formatCad(base)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-[14px] text-background/55">Marge Ooble (2 %)</dt>
                  <dd className="font-display text-[15px] tracking-tight">+ {formatCad(margin)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 py-5">
                  <dt className="text-[14px]">Vous payez</dt>
                  <dd className="font-display text-[2rem] leading-none tracking-[-0.04em] sm:text-[2.4rem]">
                    {formatCad(buy)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-[14px] text-background/55">À la vente, vous recevez</dt>
                  <dd className="font-display text-[15px] tracking-tight">{formatCad(sell)}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-background/10 pt-6">
                <Link
                  to="/connexion"
                  className="inline-flex h-11 select-none items-center gap-2 rounded-xl bg-background px-6 text-[14px] text-foreground transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  Acheter <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/connexion"
                  className="inline-flex h-11 select-none items-center gap-2 rounded-xl border border-background/20 px-6 text-[14px] text-background transition-all hover:bg-background/10 active:scale-[0.98]"
                >
                  Vendre
                </Link>
              </div>
            </div>
          </Wrap>
        </section>

        {/* ================= RÉSEAUX ================= */}
        <section className="py-20 lg:py-28">
          <Wrap>
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <Label>Réseaux</Label>
              <div>
                <h2 className="text-balance font-display text-[1.9rem] leading-[1.08] tracking-[-0.04em] sm:text-[2.6rem]">
                  Six réseaux pour recevoir vos USDT
                </h2>
                <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
                  Vous choisissez le réseau à la création de votre ordre. Si vous
                  hésitez, prenez TRC20 : c'est le moins coûteux à l'envoi.
                </p>
              </div>
            </div>

            <div className="mt-14 divide-y border-y">
              {networks.map((n) => (
                <div key={n.id} className="flex items-center gap-5 py-5">
                  <NetworkCoin id={n.id} className="h-14 w-14 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[1.05rem] tracking-tight">{n.name}</p>
                    <p className="text-[13px] text-muted-foreground">{n.tag}</p>
                  </div>
                  <p className="shrink-0 text-right text-[13px] text-muted-foreground">{n.note}</p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ================= INTERAC ================= */}
        <section className="border-t py-20 lg:py-28">
          <Wrap className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Label>Moyen de paiement</Label>
              <h2 className="mt-6 text-balance font-display text-[1.9rem] leading-[1.08] tracking-[-0.04em] sm:text-[2.6rem]">
                Vous payez par Interac e-Transfer
              </h2>
              <p className="mt-6 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
                Le virement que votre banque canadienne connaît déjà. À l'achat,
                vous envoyez votre paiement depuis votre application bancaire. À
                la vente, vous recevez vos dollars de la même façon.
              </p>

              <div className="mt-8 inline-flex items-center gap-3 rounded-xl border bg-card px-4 py-2.5">
                <InteracLogo className="h-6" />
                <span className="text-[13px] text-muted-foreground">Moyen de paiement accepté</span>
              </div>

              <p className="mt-6 max-w-md text-[12px] leading-relaxed text-muted-foreground">
                Ooble accepte Interac e-Transfer comme moyen de paiement. Ooble
                n'est pas affilié à Interac Corp. et ne fournit pas de services
                Interac. « Interac » est une marque de commerce d'Interac Corp.
              </p>
            </div>

            <InteracArt className="mx-auto w-full max-w-[420px]" />
          </Wrap>
        </section>

        {/* ================= NON-CUSTODIAL ================= */}
        <section className="border-t py-20 lg:py-28">
          <Wrap className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <PhoneArt className="order-2 mx-auto w-full max-w-[400px] lg:order-1" />

            <div className="order-1 lg:order-2">
              <Label>Non-custodial</Label>
              <h2 className="mt-6 text-balance font-display text-[1.9rem] leading-[1.08] tracking-[-0.04em] sm:text-[2.6rem]">
                Nous ne détenons jamais vos fonds
              </h2>
              <p className="mt-6 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
                Ooble n'est pas un dépositaire. Il n'y a pas de portefeuille
                interne, pas de solde client, pas de compte à créditer.
              </p>

              <dl className="mt-9 divide-y border-y">
                {[
                  { t: "Aucun solde conservé", d: "Chaque ordre est réglé individuellement, puis clos." },
                  { t: "Vos clés restent à vous", d: "Vous fournissez l'adresse ; nous n'y avons aucun accès." },
                  { t: "Identité vérifiée une fois", d: "Un KYC unique, exigé par la réglementation canadienne." },
                ].map((r) => (
                  <div key={r.t} className="py-4">
                    <dt className="font-display text-[15.5px] tracking-tight">{r.t}</dt>
                    <dd className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{r.d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Wrap>
        </section>

        {/* ================= FAQ ================= */}
        <section id="faq" className="border-t py-20 lg:py-28">
          <Wrap className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <Label>Questions</Label>
              <h2 className="mt-6 text-balance font-display text-[1.9rem] leading-[1.08] tracking-[-0.04em] sm:text-[2.4rem]">
                Questions fréquentes
              </h2>
              <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-muted-foreground">
                L'essentiel à savoir avant votre premier ordre.
              </p>
              <Button asChild variant="secondary" shape="rounded" className="mt-7">
                <Link to="/contact">
                  Nous écrire <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="divide-y border-y">
              {faqs.map((item, i) => {
                const open = faqOpen === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setFaqOpen(open ? null : i)}
                      className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    >
                      <span className="font-display text-[15px] leading-snug tracking-tight">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                          open && "rotate-180",
                        )}
                      />
                    </button>
                    {open && (
                      <p className="-mt-1 max-w-2xl pb-5 pr-8 text-[14px] leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Wrap>
        </section>

        {/* ================= CTA ================= */}
        <section data-dark className="bg-foreground py-20 text-background lg:py-24">
          <Wrap className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <h2 className="text-balance font-display text-[2rem] leading-[1.04] tracking-[-0.045em] text-background sm:text-[2.9rem]">
                Votre premier ordre, en quelques minutes
              </h2>
              <p className="mt-6 max-w-md text-[14.5px] leading-relaxed text-background/55">
                Créez votre compte, vérifiez votre identité une seule fois, puis
                achetez ou vendez au taux affiché.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
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

            <div className="flex justify-center lg:justify-end">
              <CoinsArt className="w-full max-w-[340px]" />
            </div>
          </Wrap>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
