import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ShieldCheck, Check, Clock, IdCard, ScanFace, Video,
  HelpCircle, ChevronDown, CreditCard, FileText, UserCheck, Lock, Camera,
} from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { getMyKyc, submitKyc, type KycDbStatus, type KycFiles } from "@/lib/kyc";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- */
/*  Petits éléments réutilisés                                       */
/* ---------------------------------------------------------------- */

/** Bloc d'aide dépliable : la personne clique pour comprendre ce qu'on demande. */
const HelpNote = ({ title = "Pourquoi ?", children }: { title?: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-secondary/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-secondary/50"
      >
        <HelpCircle className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.9} />
        <span className="flex-1 text-[13px] font-medium">{title}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="px-4 pb-3.5 text-[13px] leading-relaxed text-muted-foreground">{children}</div>}
    </div>
  );
};

/** En-tête d'étape : icône, titre, sous-titre. */
const StepHead = ({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) => (
  <div className="mb-6">
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground/70">
      <Icon className="h-6 w-6" strokeWidth={1.7} />
    </span>
    <h2 className="mt-4 font-display text-[22px] font-semibold leading-tight tracking-tight">{title}</h2>
    <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{sub}</p>
  </div>
);

/** Champ texte. */
const Field = ({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[12px] border border-border bg-secondary/40 px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-foreground/30 placeholder:text-muted-foreground/40"
    />
  </label>
);

/** Zone de capture d'une image ou d'une vidéo (une seule par étape, en grand). */
const Capture = ({
  kind, file, onPick, accept, capture, hint,
}: {
  kind: "image" | "video";
  file: File | null;
  onPick: (f: File | null) => void;
  accept: string;
  capture?: "user" | "environment";
  hint: string;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={cn(
          "relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[18px] border-2 border-dashed text-center transition-colors",
          file ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-secondary/30 hover:bg-secondary/50",
        )}
      >
        {preview && kind === "image" && <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />}
        {preview && kind === "video" && <video src={preview} className="absolute inset-0 h-full w-full object-cover" muted playsInline />}
        {!preview && (
          <>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-foreground/60">
              {kind === "video" ? <Camera className="h-7 w-7" strokeWidth={1.6} /> : <Camera className="h-7 w-7" strokeWidth={1.6} />}
            </span>
            <span className="max-w-[240px] px-4 text-[13px] text-muted-foreground">{hint}</span>
          </>
        )}
        {file && (
          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        )}
        <input
          ref={ref}
          type="file"
          accept={accept}
          {...(capture ? { capture } : {})}
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
      </button>
      {file && (
        <button type="button" onClick={() => ref.current?.click()} className="mt-2.5 text-[13px] font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground">
          Reprendre
        </button>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------- */
/*  Carte d'état (déjà soumis / vérifié / refusé)                    */
/* ---------------------------------------------------------------- */

const StatusCard = ({ status, onRestart }: { status: KycDbStatus; onRestart: () => void }) => {
  const m = {
    not_started: { icon: ShieldCheck, title: "Non vérifié", sub: "Lancez la vérification pour lever les limites.", tone: "text-muted-foreground" },
    pending: { icon: Clock, title: "Vérification en cours", sub: "Vos pièces sont en cours d'examen. Vous serez notifié dès qu'elles seront validées — en général sous 24 h.", tone: "text-foreground" },
    approved: { icon: Check, title: "Identité vérifiée", sub: "Votre compte est vérifié. Aucune action requise.", tone: "text-primary" },
    rejected: { icon: ShieldCheck, title: "Vérification refusée", sub: "Vos pièces n'ont pas pu être validées. Reprenez avec des photos nettes, bien éclairées et non rognées.", tone: "text-destructive" },
  }[status];
  return (
    <div className="rounded-2xl border border-border bg-card p-7 text-center">
      <span className={cn("mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary", m.tone)}>
        <m.icon className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <h2 className="mt-4 font-display text-[20px] font-semibold tracking-tight">{m.title}</h2>
      <p className="mx-auto mt-1.5 max-w-[360px] text-[14px] leading-relaxed text-muted-foreground">{m.sub}</p>
      {status === "rejected" && (
        <div className="mt-6 flex justify-center">
          <Button variant="appSolid" shape="rounded" onClick={onRestart}>Recommencer</Button>
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------- */
/*  Assistant page par page                                          */
/* ---------------------------------------------------------------- */

const DOCS = [
  { id: "Permis de conduire", icon: CreditCard, desc: "Recto et verso.", back: true },
  { id: "Passeport", icon: FileText, desc: "Page photo uniquement.", back: false },
  { id: "Carte d'identité", icon: IdCard, desc: "Recto et verso.", back: true },
];

type Step = "identity" | "docType" | "front" | "back" | "selfie" | "liveness" | "review";

const Verification = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<KycDbStatus | null | "loading">("loading");

  // Données
  const [legalName, setLegalName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [docType, setDocType] = useState(DOCS[0].id);
  const [docNumber, setDocNumber] = useState("");
  const [files, setFiles] = useState<KycFiles>({});
  const setFile = (k: keyof KycFiles, f: File | null) => setFiles((prev) => ({ ...prev, [k]: f }));

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyKyc().then((k) => setStatus(k?.status ?? null));
  }, []);

  // Le verso n'est demandé que pour les pièces à deux faces.
  const needsBack = DOCS.find((d) => d.id === docType)?.back ?? true;
  const steps: Step[] = ["identity", "docType", "front", ...(needsBack ? (["back"] as Step[]) : []), "selfie", "liveness", "review"];
  const [stepIdx, setStepIdx] = useState(0);
  const step = steps[Math.min(stepIdx, steps.length - 1)];

  const canNext = (() => {
    switch (step) {
      case "identity": return legalName.trim().length > 1 && !!dob && address.trim().length > 3;
      case "docType": return docNumber.trim().length > 2;
      case "front": return !!files.front;
      case "back": return !!files.back;
      case "selfie": return !!files.selfie;
      case "liveness": return !!files.video;
      case "review": return true;
    }
  })();

  const goBack = () => {
    if (stepIdx === 0) return navigate("/app/compte");
    setStepIdx((i) => i - 1);
  };
  const goNext = () => setStepIdx((i) => Math.min(i + 1, steps.length - 1));

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    const res = await submitKyc({ legalName, dob, address, docType, docNumber }, files);
    setBusy(false);
    if (res.error) return setError(res.error);
    setStatus("pending");
  };

  const restart = () => { setStatus(null); setStepIdx(0); };

  const header = (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={goBack}
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

  if (status === "loading") {
    return (
      <AppShell header={header}>
        <div className="rounded-2xl border border-border bg-card py-12 text-center text-[13px] text-muted-foreground">Chargement…</div>
      </AppShell>
    );
  }
  if (status === "pending" || status === "approved" || status === "rejected") {
    return <AppShell header={header}><StatusCard status={status} onRestart={restart} /></AppShell>;
  }

  // Progression
  const progress = ((stepIdx + 1) / steps.length) * 100;

  return (
    <AppShell header={header}>
      {/* Barre de progression */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          <span>Étape {stepIdx + 1} / {steps.length}</span>
          <span>{Math.round(progress)} %</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-foreground transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="animate-page">
        {step === "identity" && (
          <>
            <StepHead icon={UserCheck} title="Vos informations" sub="Exactement comme elles figurent sur votre pièce d'identité officielle." />
            <div className="space-y-4">
              <Field label="Nom légal complet" value={legalName} onChange={setLegalName} placeholder="Prénom et nom" />
              <Field label="Date de naissance" type="date" value={dob} onChange={setDob} />
              <Field label="Adresse résidentielle" value={address} onChange={setAddress} placeholder="Numéro, rue, ville, province" />
              <HelpNote title="Pourquoi mon adresse ?">
                La réglementation canadienne (FINTRAC) impose de recueillir votre nom, votre date de naissance et
                votre adresse pour confirmer votre identité. Ces informations ne servent qu'à la vérification.
              </HelpNote>
            </div>
          </>
        )}

        {step === "docType" && (
          <>
            <StepHead icon={IdCard} title="Votre pièce d'identité" sub="Choisissez le document que vous allez photographier." />
            <div className="space-y-2.5">
              {DOCS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDocType(d.id)}
                  className={cn(
                    "flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-colors",
                    docType === d.id ? "border-foreground bg-secondary" : "border-border bg-card hover:bg-secondary/40",
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                    <d.icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium">{d.id}</span>
                    <span className="block text-[12.5px] text-muted-foreground">{d.desc}</span>
                  </span>
                  {docType === d.id && <Check className="h-5 w-5 shrink-0 text-foreground" strokeWidth={2.4} />}
                </button>
              ))}
              <div className="pt-1.5">
                <Field label="Numéro de la pièce" value={docNumber} onChange={setDocNumber} placeholder="Numéro du document" />
              </div>
              <HelpNote title="Quelles pièces sont acceptées ?">
                Une pièce officielle avec photo, en cours de validité : permis de conduire, passeport ou carte
                d'identité provinciale. La carte santé n'est pas acceptée comme pièce principale.
              </HelpNote>
            </div>
          </>
        )}

        {step === "front" && (
          <>
            <StepHead icon={CreditCard} title="Recto de la pièce" sub="Photographiez le recto de votre pièce, bien à plat." />
            <Capture kind="image" accept="image/*" capture="environment" file={files.front ?? null} onPick={(f) => setFile("front", f)}
              hint="Touchez pour photographier le recto" />
            <div className="mt-4">
              <HelpNote title="Comment bien la photographier ?">
                Posez la pièce sur une surface sombre et unie, dans un endroit bien éclairé. Les quatre coins
                doivent être visibles, le texte net et lisible, sans reflet ni flou. Ne rognez pas l'image.
              </HelpNote>
            </div>
          </>
        )}

        {step === "back" && (
          <>
            <StepHead icon={CreditCard} title="Verso de la pièce" sub="Photographiez maintenant le verso." />
            <Capture kind="image" accept="image/*" capture="environment" file={files.back ?? null} onPick={(f) => setFile("back", f)}
              hint="Touchez pour photographier le verso" />
            <div className="mt-4">
              <HelpNote title="Pourquoi le verso ?">
                Le verso contient des éléments de sécurité et, souvent, votre adresse. Il nous permet de confirmer
                que la pièce est authentique et à jour.
              </HelpNote>
            </div>
          </>
        )}

        {step === "selfie" && (
          <>
            <StepHead icon={ScanFace} title="Selfie avec votre pièce" sub="Prenez-vous en photo en tenant votre pièce près du visage." />
            <Capture kind="image" accept="image/*" capture="user" file={files.selfie ?? null} onPick={(f) => setFile("selfie", f)}
              hint="Touchez pour prendre le selfie" />
            <div className="mt-4">
              <HelpNote title="Comment faire ce selfie ?">
                Tenez votre pièce d'identité à côté de votre visage. Les deux doivent être nets et lisibles sur la
                même photo. Retirez lunettes de soleil, chapeau et masque. Cela confirme que la pièce est bien la vôtre.
              </HelpNote>
            </div>
          </>
        )}

        {step === "liveness" && (
          <>
            <StepHead icon={Video} title="Courte vidéo de vivacité" sub="Filmez-vous quelques secondes pour prouver que c'est bien vous, en direct." />
            <Capture kind="video" accept="video/*" capture="user" file={files.video ?? null} onPick={(f) => setFile("video", f)}
              hint="Touchez pour enregistrer 3 à 5 secondes" />
            <div className="mt-4">
              <HelpNote title="Que dois-je filmer ?">
                Regardez la caméra et tournez lentement la tête de gauche à droite pendant 3 à 5 secondes, dans un
                endroit éclairé. Cette étape empêche l'usage d'une simple photo à votre place.
              </HelpNote>
            </div>
          </>
        )}

        {step === "review" && (
          <>
            <StepHead icon={ShieldCheck} title="Vérifiez et envoyez" sub="Un dernier coup d'œil avant l'examen de votre dossier." />
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {[
                { k: "Nom légal", v: legalName || "—" },
                { k: "Date de naissance", v: dob || "—" },
                { k: "Adresse", v: address || "—" },
                { k: "Type de pièce", v: docType },
                { k: "Numéro", v: docNumber || "—" },
                { k: "Pièces", v: [files.front && "recto", files.back && "verso", files.selfie && "selfie", files.video && "vidéo"].filter(Boolean).join(", ") || "—" },
              ].map((r, i, arr) => (
                <div key={r.k} className={cn("flex items-start justify-between gap-4 px-4 py-3", i < arr.length - 1 && "border-b border-border")}>
                  <span className="text-[12.5px] text-muted-foreground">{r.k}</span>
                  <span className="max-w-[62%] break-words text-right text-[13px] font-medium">{r.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 px-4 py-3">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.9} />
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                Vos pièces sont chiffrées et stockées de façon privée. Elles ne servent qu'à la vérification
                réglementaire de votre identité et ne sont jamais partagées.
              </p>
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">{error}</p>
            )}
          </>
        )}
      </div>

      {/* Navigation bas de page */}
      <div className="mt-8 flex items-center justify-between">
        <button type="button" onClick={goBack} className="text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground">
          Retour
        </button>
        {step === "review" ? (
          <Button variant="appSolid" shape="rounded" size="lg" className="gap-2 px-6" onClick={submit} disabled={busy}>
            {busy ? "Envoi…" : "Envoyer mon dossier"}
            {!busy && <ShieldCheck className="h-4 w-4" />}
          </Button>
        ) : (
          <Button variant="appSolid" shape="rounded" size="lg" className="gap-2 px-6" onClick={goNext} disabled={!canNext}>
            Continuer <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </AppShell>
  );
};

export default Verification;
