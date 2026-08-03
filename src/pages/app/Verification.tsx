import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SumsubWebSdk from "@sumsub/websdk-react";
import { ArrowLeft, ShieldCheck, Check, Clock, ScanFace, Camera, IdCard, Lock } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { getMyKyc, type KycDbStatus } from "@/lib/kyc";
import { getSumsubToken } from "@/lib/sumsub";
import { getTheme } from "@/lib/theme";
import { useT } from "@/lib/i18n";
import { getLang } from "@/lib/i18n";
import type { TKey } from "@/lib/translations";

const STATUS_META: Record<KycDbStatus, { icon: React.ElementType; titleKey: TKey; subKey: TKey; tone: string }> = {
  not_started: { icon: ShieldCheck, titleKey: "kyc.notVerified", subKey: "kyc.notVerifiedSub", tone: "text-muted-foreground" },
  pending: { icon: Clock, titleKey: "kyc.inReview", subKey: "kyc.inReviewSub", tone: "text-foreground" },
  approved: { icon: Check, titleKey: "kyc.verified", subKey: "kyc.verifiedSub", tone: "text-primary" },
  rejected: { icon: ShieldCheck, titleKey: "kyc.rejectedTitle", subKey: "kyc.rejectedSub", tone: "text-destructive" },
};

const CHECKLIST_KEYS: { icon: React.ElementType; key: TKey }[] = [
  { icon: IdCard, key: "kyc.check1" },
  { icon: Camera, key: "kyc.check2" },
  { icon: ScanFace, key: "kyc.check3" },
];

type Phase = "loading" | "intro" | "sdk";

const Verification = () => {
  const navigate = useNavigate();
  const t = useT();
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
    if (res.error || !res.token) return setError(res.error ?? t("kyc.startError"));
    setToken(res.token);
    setPhase("sdk");
  };

  const header = (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={() => navigate("/app/compte")}
        aria-label={t("misc.back")}
        className="mt-0.5 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/70 active:scale-95"
      >
        <ArrowLeft className="h-[18px] w-[18px]" />
      </button>
      <div>
        <h1 className="font-display text-[22px] font-semibold tracking-tight">{t("kyc.title")}</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">{t("kyc.sub")}</p>
      </div>
    </div>
  );

  if (phase === "loading") {
    return (
      <AppShell header={header}>
        <div className="rounded-2xl border border-border bg-card py-12 text-center text-[13px] text-muted-foreground">{t("kyc.loading")}</div>
      </AppShell>
    );
  }

  if (phase === "sdk" && token) {
    const lang = getLang();
    return (
      <AppShell header={header}>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <SumsubWebSdk
            accessToken={token}
            expirationHandler={async () => {
              const res = await getSumsubToken();
              return res.token ?? "";
            }}
            config={{ lang, theme: getTheme() === "dark" ? "dark" : "light" }}
            options={{ addViewportTag: false, adaptIframeHeight: true }}
            onMessage={(type: string) => {
              if (type === "idCheck.onApplicantSubmitted" || type === "idCheck.applicantStatus") {
                setStatus("pending");
              }
            }}
            onError={() => setError(t("kyc.sdkError"))}
          />
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setPhase("intro")}
            className="text-[13px] font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            {t("kyc.close")}
          </button>
        </div>
      </AppShell>
    );
  }

  const m = STATUS_META[status ?? "not_started"];
  const verified = status === "approved";
  const inReview = status === "pending";

  return (
    <AppShell header={header}>
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary ${m.tone}`}>
          <m.icon className="h-6 w-6" strokeWidth={1.8} />
        </span>
        <h2 className="mt-4 font-display text-[20px] font-semibold tracking-tight">{t(m.titleKey)}</h2>
        <p className="mx-auto mt-1.5 max-w-[360px] text-[14px] leading-relaxed text-muted-foreground">{t(m.subKey)}</p>
      </div>

      {!verified && (
        <>
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {t("kyc.before")}
            </p>
            <ul className="space-y-3.5">
              {CHECKLIST_KEYS.map((c) => (
                <li key={c.key} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground/70">
                    <c.icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span className="text-[13.5px] leading-relaxed text-muted-foreground">{t(c.key)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 px-4 py-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.9} />
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">
              {t("kyc.sumsub")}
            </p>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">{error}</p>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="appSolid" shape="rounded" size="lg" className="gap-2 px-6" onClick={start} disabled={starting}>
              {starting ? t("kyc.wait") : inReview ? t("kyc.resume") : t("kyc.start")}
              {!starting && <ShieldCheck className="h-4 w-4" />}
            </Button>
          </div>
        </>
      )}
    </AppShell>
  );
};

export default Verification;
