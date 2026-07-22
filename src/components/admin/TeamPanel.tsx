import { useState } from "react";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SEED_TEAM, type TeamMember } from "@/lib/adminOrders";

const ROLE_TONE: Record<TeamMember["role"], string> = {
  Admin: "border-primary/40 text-primary",
  Opérateur: "border-border text-foreground",
  KYC: "border-border text-foreground",
  Marketing: "border-border text-muted-foreground",
};

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const TeamPanel = () => {
  const [members, setMembers] = useState<TeamMember[]>(SEED_TEAM);

  const toggle = (id: string) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">{members.filter((m) => m.active).length} membres actifs</p>
        <Button variant="appPrimary" shape="rounded" className="h-auto gap-1.5 rounded-[10px] px-3.5 py-2 text-[13px]">
          <UserPlus className="h-4 w-4" /> Inviter
        </Button>
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-[12px] font-semibold text-foreground/70">
              {initials(m.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">{m.name}</p>
              <p className="truncate text-[12px] text-muted-foreground">{m.email}</p>
            </div>
            <span className={cn("hidden rounded-full border px-2.5 py-1 text-[11px] font-semibold sm:inline-block", ROLE_TONE[m.role])}>
              {m.role}
            </span>
            <span className="hidden w-24 text-right text-[12px] text-muted-foreground md:block">{m.handled} traitées</span>
            <button
              onClick={() => toggle(m.id)}
              className={cn(
                "relative h-6 w-10 shrink-0 rounded-full transition-colors",
                m.active ? "bg-primary" : "bg-secondary",
              )}
              aria-label={m.active ? "Désactiver" : "Activer"}
            >
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all", m.active ? "left-[18px]" : "left-0.5")} />
            </button>
          </div>
        ))}
      </div>

      <p className="px-1 text-[12px] text-muted-foreground">
        Gestion des rôles et permissions — les accès réels (admin / opérateur / KYC) seront appliqués côté
        backend.
      </p>
    </div>
  );
};

export default TeamPanel;
