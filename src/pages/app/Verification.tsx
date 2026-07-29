import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SumsubWebSdk from "@sumsub/websdk-react";
import { ArrowLeft, ShieldCheck, Check, Clock, ScanFace, Camera, IdCard, Lock } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { getMyKyc, type KycDbStatus } from "@/lib/kyc";
import { getSumsubToken } from "@/lib/sumsub";
import { getTheme } from "@/lib/theme";

/** Ce que l'utilisateur doit avoir sous la main avant de commencer. */
const CHECKLIST = [
  { icon: IdCard, text: "Une pièce d'identité officielle en cours de validité (permis, passeport ou carte d'identité)." },
  { icon: Camera, text: "De la lumière et un appareil avec caméra pour photographier la pièce." },
  { icon: ScanFace, text: "Vous-même : un selfie et une courte vidéo confirmeront que c'est bien vous." },
];

const STATUS_META: Record<KycDbStatus, { icon: React.ElementType; title: string; sub: string; tone: string }> = {
  not_started: { icon: ShieldCheck, title: "Non vérifié", sub: "Lancez la vérification pour lever les limites.", tone: "text-muted-foreground" },
  pending: { icon: Clock, title: "Vérification en cours", sub: "Vos pièces sont en cours d'examen. Vous serez notifié dès qu'elles seront validées — en général sous quelques minutes.", tone: "text-foreground" },
  approved: { icon: Check, title: "Identité vérifiée", sub: "Votre compte est vérifié. Aucune action requise.", tone: "text-primary" },
  rejected: { icon: ShieldCheck, title: "Vérification refusée", sub: "Vos pièces n'ont pas pu être validées. Vous pouvez reprendre la vérification.", tone: "text-destructive" },
};

type Phase = "loading" | "intro" | "sdk";

const Verification = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<KycDbStatus | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    getMyKyc().then((k) => {
      setStatus(k?.status ?? "not_started");
      setPhase("intro");
    });
  }, []);

  const start = async () => {
    if (starting) return;
    setStarting(true);
    setError(null);
    const res = await getSumsubToken();
    setStarting(false);
    if (res.error || !res.token) return setError(res.error ?? "Impossible de démarrer la vérification.");
    setToken(res.token);
    setPhase("sdk");
  };

  const header = (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={() => navigate("/app/compte")}
        aria-label="Retour"
        className="mt-0.5 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/70 active:scale-95"
      >
        <ArrowLeft className="h-[18px] w-[18px]" />
      </button>
      <div>
        <h1 className="font-display text-[22px] font-semibold tracking-tight">Vérification d'identité</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Une seule fois, jamais à refaire</p>
      </div>
    </div>
  );

  if (phase === "loading") {
    return (
      <AppShell header={header}>
        <div className="rounded-2xl border border-border bg-card py-12 text-center text-[13px] text-muted-foreground">Chargement…</div>
      </AppShell>
    );
  }

  // Le WebSDK Sumsub occupe la carte. Le statut réel est écrit par le webhook ;
  // à la fin du parcours l'utilisateur revient sur l'intro qui affichera l'état.
  if (phase === "sdk" && token) {
    return (
      <AppShell header={header}>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <SumsubWebSdk
            accessToken={token}
            expirationHandler={async () => {
              const res = await getSumsubToken();
              return res.token ?? "";
            }}
            config={{ lang: "fr", theme: getTheme() === "dark" ? "dark" : "light" }}
            options={{ addViewportTag: false, adaptIframeHeight: true }}
            onMessage={(type: string) => {
              if (type === "idCheck.onApplicantSubmitted" || type === "idCheck.applicantStatus") {
                setStatus("pending");
              }
            }}
            onError={() => setError("Une erreur est survenue pendant la vérification.")}
          />
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setPhase("intro")}
            className="text-[13px] font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Fermer
          </button>
        </div>
      </AppShell>
    );
  }

  // Intro : état courant + ce qu'il faut, puis démarrage du parcours Sumsub.
  const m = STATUS_META[status ?? "not_started"];
  const verified = status === "approved";
  const inReview = status === "pending";

  return (
    <AppShell header={header}>
      {/* État actuel */}
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary ${m.tone}`}>
          <m.icon className="h-6 w-6" strokeWidth={1.8} />
        </span>
        <h2 className="mt-4 font-display text-[20px] font-semibold tracking-tight">{m.title}</h2>
        <p className="mx-auto mt-1.5 max-w-[360px] text-[14px] leading-relaxed text-muted-foreground">{m.sub}</p>
      </div>

      {!verified && (
        <>
          {/* Ce qu'il faut préparer */}
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Avant de commencer
            </p>
            <ul className="space-y-3.5">
              {CHECKLIST.map((c) => (
                <li key={c.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                    <c.icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span className="text-[13.5px] leading-relaxed text-muted-foreground">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 px-4 py-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.9} />
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">
              La vérification est réalisée par Sumsub, notre partenaire d'identité. Vos pièces sont chiffrées, ne
              servent qu'à la vérification réglementaire et ne sont jamais partagées.
            </p>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">{error}</p>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="appSolid" shape="rounded" size="lg" className="gap-2 px-6" onClick={start} disabled={starting}>
              {starting ? "Un instant…" : inReview ? "Reprendre la vérification" : "Commencer la vérification"}
              {!starting && <ShieldCheck className="h-4 w-4" />}
            </Button>
          </div>
        </>
      )}
    </AppShell>
  );
};

export default Verification;
