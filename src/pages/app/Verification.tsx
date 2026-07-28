import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Upload, Check, Clock, IdCard, ScanFace } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { getMyKyc, submitKyc, type KycDbStatus } from "@/lib/kyc";
import { cn } from "@/lib/utils";

const DOC_TYPES = ["Permis de conduire", "Passeport", "Carte santé"];

/** Champ texte au style de l'app (icône + label au-dessus, saisie en dessous). */
const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      {label}
    </span>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[12px] border border-border bg-secondary/40 px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-foreground/30 placeholder:text-muted-foreground/40"
    />
  </label>
);

/** Zone de dépôt d'une image (recto ou selfie). */
const FileTile = ({
  label,
  icon: Icon,
  file,
  onPick,
}: {
  label: string;
  icon: React.ElementType;
  file: File | null;
  onPick: (f: File | null) => void;
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
    <button
      type="button"
      onClick={() => ref.current?.click()}
      className={cn(
        "relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-[14px] border border-dashed text-center transition-colors",
        file ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-secondary/30 hover:bg-secondary/50",
      )}
    >
      {preview ? (
        <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground/60">
            <Icon className="h-5 w-5" strokeWidth={1.7} />
          </span>
          <span className="px-3 text-[12.5px] text-muted-foreground">{label}</span>
        </>
      )}
      {file && (
        <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
    </button>
  );
};

/** Bandeau d'état lorsqu'une vérification est déjà en cours ou terminée. */
const StatusCard = ({ status, onRestart }: { status: KycDbStatus; onRestart: () => void }) => {
  const map: Record<KycDbStatus, { icon: React.ElementType; title: string; sub: string; tone: string }> = {
    not_started: { icon: ShieldCheck, title: "Non vérifié", sub: "Lancez la vérification pour lever les limites.", tone: "text-muted-foreground" },
    pending: { icon: Clock, title: "Vérification en cours", sub: "Vos pièces sont en cours d'examen. Vous serez notifié dès qu'elles seront validées.", tone: "text-foreground" },
    approved: { icon: Check, title: "Identité vérifiée", sub: "Votre compte est vérifié. Aucune action requise.", tone: "text-primary" },
    rejected: { icon: ShieldCheck, title: "Vérification refusée", sub: "Vos pièces n'ont pas pu être validées. Reprenez avec des photos nettes et lisibles.", tone: "text-destructive" },
  };
  const m = map[status];
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center">
      <span className={cn("mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary", m.tone)}>
        <m.icon className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <h2 className="mt-4 font-display text-[19px] font-semibold tracking-tight">{m.title}</h2>
      <p className="mx-auto mt-1.5 max-w-[340px] text-[13.5px] leading-relaxed text-muted-foreground">{m.sub}</p>
      {status === "rejected" && (
        <div className="mt-5 flex justify-center">
          <Button variant="appSolid" shape="rounded" onClick={onRestart}>Recommencer</Button>
        </div>
      )}
    </div>
  );
};

const Verification = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<KycDbStatus | null | "loading">("loading");

  const [legalName, setLegalName] = useState("");
  const [dob, setDob] = useState("");
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [docNumber, setDocNumber] = useState("");
  const [front, setFront] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyKyc().then((k) => setStatus(k?.status ?? null));
  }, []);

  const canSubmit = legalName.trim().length > 1 && dob && docNumber.trim().length > 2 && front && selfie;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || busy) return;
    setBusy(true);
    setError(null);
    const res = await submitKyc({ legalName, dob, docType, docNumber }, { front, selfie });
    setBusy(false);
    if (res.error) return setError(res.error);
    setStatus("pending");
  };

  const restart = () => setStatus(null);

  return (
    <AppShell
      header={
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
      }
    >
      {status === "loading" ? (
        <div className="rounded-2xl border border-border bg-card py-12 text-center text-[13px] text-muted-foreground">
          Chargement…
        </div>
      ) : status === "pending" || status === "approved" || status === "rejected" ? (
        <StatusCard status={status} onRestart={restart} />
      ) : (
        <form onSubmit={submit} className="space-y-5">
          {/* Identité */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5">
              <IdCard className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={1.9} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Vos informations</p>
            </div>
            <Field label="Nom légal complet" value={legalName} onChange={setLegalName} placeholder="Tel qu'inscrit sur la pièce" />
            <Field label="Date de naissance" type="date" value={dob} onChange={setDob} />
            <div>
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Type de pièce</span>
              <div className="flex flex-wrap gap-2">
                {DOC_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDocType(t)}
                    className={cn(
                      "rounded-[10px] border px-3.5 py-2 text-[13px] transition-colors",
                      docType === t ? "border-foreground bg-secondary font-medium" : "border-border bg-card text-muted-foreground hover:bg-secondary/50",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Numéro de la pièce" value={docNumber} onChange={setDocNumber} placeholder="Numéro du document" />
          </div>

          {/* Pièces */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5">
              <Upload className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={1.9} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Vos pièces</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FileTile label="Recto de la pièce" icon={IdCard} file={front} onPick={setFront} />
              <FileTile label="Selfie" icon={ScanFace} file={selfie} onPick={setSelfie} />
            </div>
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Photos nettes, lisibles, non rognées. Le selfie sert à confirmer que la pièce vous appartient.
            </p>
          </div>

          {error && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="appSolid" shape="rounded" size="lg" className="gap-2 px-6" disabled={!canSubmit || busy}>
              {busy ? "Envoi…" : "Envoyer pour vérification"}
              {!busy && <ShieldCheck className="h-4 w-4" />}
            </Button>
          </div>

          <p className="pb-4 text-center text-[11.5px] leading-relaxed text-muted-foreground">
            Vos pièces sont stockées de façon privée et ne servent qu'à la vérification réglementaire.
          </p>
        </form>
      )}
    </AppShell>
  );
};

export default Verification;
