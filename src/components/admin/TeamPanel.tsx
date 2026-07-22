import { useState } from "react";
import { UserPlus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SEED_TEAM, TEAM_ROLES, type TeamMember, type TeamRole } from "@/lib/adminOrders";

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const roleDesc = (role: TeamRole) => TEAM_ROLES.find((r) => r.role === role)?.desc ?? "";

const TeamPanel = () => {
  const [members, setMembers] = useState<TeamMember[]>(SEED_TEAM);

  const toggle = (id: string) => setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
  const setRole = (id: string, role: TeamRole) => setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">{members.filter((m) => m.active).length} membres actifs</p>
        <Button variant="appSolid" shape="rounded" className="h-auto gap-1.5 rounded-[9px] px-3.5 py-2 text-[13px] font-bold">
          <UserPlus className="h-4 w-4" /> Inviter
        </Button>
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {members.map((m) => (
          <div key={m.id} className="px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-[12px] font-semibold text-foreground/70">
                {initials(m.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{m.name}</p>
                <p className="truncate text-[12px] text-muted-foreground">{m.email}</p>
              </div>

              {/* Sélecteur de rôle */}
              <div className="relative shrink-0">
                <select
                  value={m.role}
                  onChange={(e) => setRole(m.id, e.target.value as TeamRole)}
                  className="appearance-none rounded-[9px] border border-border bg-card py-1.5 pl-3 pr-7 text-[12.5px] font-medium outline-none transition-colors hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {TEAM_ROLES.map((r) => (
                    <option key={r.role} value={r.role}>{r.role}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>

              <span className="hidden w-24 text-right text-[12px] text-muted-foreground lg:block">{m.handled} traitées</span>

              {/* Activer / désactiver */}
              <button
                onClick={() => toggle(m.id)}
                className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", m.active ? "bg-foreground" : "bg-secondary")}
                aria-label={m.active ? "Désactiver" : "Activer"}
              >
                <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-background transition-all", m.active ? "left-[18px]" : "left-0.5")} />
              </button>
            </div>

            {/* Ce que le rôle autorise */}
            <p className="mt-2 pl-12 text-[12px] text-muted-foreground">{roleDesc(m.role)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPanel;
