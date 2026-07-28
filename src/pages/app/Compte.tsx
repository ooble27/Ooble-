import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, KeyRound, Sun, Moon, LayoutGrid, ChevronRight, MessageSquare, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import AppShell from "@/components/app/AppShell";
import CopyRow from "@/components/app/CopyRow";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { getMyProfile, type MyProfile } from "@/lib/profile";
import { getMyKyc, type KycDbStatus } from "@/lib/kyc";
import { getTheme, setTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const KYC_META: Record<KycDbStatus, { label: string; tone: string }> = {
  not_started: { label: "À faire", tone: "bg-secondary text-muted-foreground" },
  pending: { label: "En cours", tone: "bg-secondary text-foreground" },
  approved: { label: "Vérifié", tone: "bg-primary/10 text-primary" },
  rejected: { label: "Refusé", tone: "bg-destructive/10 text-destructive" },
};

const Compte = () => {
  const navigate = useNavigate();
  const { user, signOut, isStaff } = useAuth();
  const [theme, setThemeState] = useState<Theme>(getTheme);
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [kyc, setKyc] = useState<KycDbStatus | null>(null);

  useEffect(() => {
    getMyProfile().then(setProfile);
    getMyKyc().then((k) => setKyc(k?.status ?? "not_started"));
  }, []);

  const chooseTheme = (t: Theme) => {
    setTheme(t);
    setThemeState(t);
  };

  const logout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <AppShell
      header={
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Mon compte</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">Profil et sécurité</p>
        </div>
      }
    >
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-deep font-display text-xl font-bold text-white">
          {user?.name?.charAt(0).toUpperCase() ?? "O"}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold">{user?.name}</p>
          <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
          {profile?.accountType === "business" && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-deep/10 px-2 py-0.5 text-[11px] font-semibold text-deep">
              <Building2 className="h-3 w-3" /> Entreprise
            </span>
          )}
        </div>
      </div>

      {/* Informations entreprise */}
      {profile?.accountType === "business" && profile.businessName && (
        <div className="mt-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2.5 px-5 pb-1 pt-4">
            <Building2 className="h-4 w-4 text-muted-foreground" strokeWidth={1.9} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Entreprise</p>
          </div>
          <div className="divide-y divide-border border-t border-border">
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-muted-foreground">Raison sociale</span>
              <span className="text-sm font-medium">{profile.businessName}</span>
            </div>
            {profile.businessNumber && (
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">NEQ / BN</span>
                <span className="font-mono text-sm">{profile.businessNumber}</span>
              </div>
            )}
            {profile.businessAddress && (
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">Adresse</span>
                <span className="text-right text-sm">{profile.businessAddress}</span>
              </div>
            )}
            {profile.businessPhone && (
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-muted-foreground">Téléphone</span>
                <span className="text-sm">{profile.businessPhone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Question / réponse Interac pour recevoir les ventes */}
      {profile?.interacQuestion && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2.5 px-5 pb-1 pt-4">
            <MessageSquare className="h-4 w-4 text-muted-foreground" strokeWidth={1.9} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Interac e-Transfer</p>
          </div>
          <p className="px-5 pb-2 text-[12.5px] text-muted-foreground">
            Lors d'une vente, vous recevrez un virement Interac avec cette question de sécurité. Entrez la réponse ci-dessous pour débloquer vos fonds.
          </p>
          <div className="divide-y divide-border border-t border-border">
            <CopyRow label="Question" value={profile.interacQuestion} />
            <CopyRow label="Réponse" value={profile.interacAnswer!} mono />
          </div>
        </div>
      )}

      {/* Apparence — bascule clair / sombre */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4">
        <span className="flex-1 text-sm font-medium">Apparence</span>
        <div className="flex rounded-lg border border-border bg-secondary/60 p-0.5">
          {([
            { key: "light" as Theme, icon: Sun, label: "Clair" },
            { key: "dark" as Theme, icon: Moon, label: "Sombre" },
          ]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => chooseTheme(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                theme === key ? "bg-card text-foreground dark:bg-neutral-600" : "text-muted-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        <Link to="/app/verification" className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-secondary/40">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" strokeWidth={1.9} />
          <span className="flex-1 text-sm font-medium">Vérification d'identité</span>
          {kyc && (
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", KYC_META[kyc].tone)}>
              {KYC_META[kyc].label}
            </span>
          )}
          <ChevronRight className="h-[18px] w-[18px] text-muted-foreground" />
        </Link>
        <div className="flex items-center gap-3 px-5 py-4">
          <KeyRound className="h-5 w-5 text-muted-foreground" strokeWidth={1.9} />
          <span className="flex-1 text-sm font-medium">Non-custodial — vos clés, vos USDT</span>
        </div>
        {isStaff && (
          <Link to="/admin" className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-secondary/40">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" strokeWidth={1.9} />
            <span className="flex-1 text-sm font-medium">Back-office</span>
            <ChevronRight className="h-[18px] w-[18px] text-muted-foreground" />
          </Link>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="appOutline" shape="rounded" className="h-auto gap-2 px-[18px] py-[10px] text-sm" onClick={logout}>
          <LogOut className="h-4 w-4" /> Se déconnecter
        </Button>
      </div>
    </AppShell>
  );
};

export default Compte;
