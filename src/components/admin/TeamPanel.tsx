import { useEffect, useState } from "react";
import { UserPlus, ChevronDown, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEAM_ROLES, type TeamRole } from "@/lib/adminOrders";
import { fetchTeam, setMemberRole, addRoleByEmail, type LiveTeamMember } from "@/lib/adminTeam";

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const roleDesc = (role: TeamRole) => TEAM_ROLES.find((r) => r.role === role)?.desc ?? "";

const TeamPanel = () => {
  const [members, setMembers] = useState<LiveTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("Opérateur");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetchTeam().then((m) => { setMembers(m); setLoading(false); });
  }, []);

  // Optimiste : mise à jour immédiate puis écriture en base (RLS admin).
  const setRole = (userId: string, role: TeamRole) => {
    setMembers((prev) => prev.map((m) => (m.userId === userId ? { ...m, role } : m)));
    setMemberRole(userId, role).then((res) => { if (res.error) fetchTeam().then(setMembers); });
  };

  const invite = async () => {
    if (inviteBusy || !/^\S+@\S+\.\S+$/.test(inviteEmail)) return;
    setInviteBusy(true);
    setInviteMsg(null);
    const res = await addRoleByEmail(inviteEmail, inviteRole);
    setInviteBusy(false);
    if (res.error) { setInviteMsg({ ok: false, text: res.error }); return; }
    setInviteMsg({ ok: true, text: `${inviteEmail} ajouté·e comme ${inviteRole}.` });
    setInviteEmail("");
    fetchTeam().then(setMembers);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          {loading ? "Chargement…" : `${members.length} membre${members.length > 1 ? "s" : ""}`}
        </p>
        <Button
          variant="appSolid"
          shape="rounded"
          className="h-auto gap-1.5 rounded-[9px] px-3.5 py-2 text-[13px] font-bold"
          onClick={() => { setInviteOpen((v) => !v); setInviteMsg(null); }}
        >
          {inviteOpen ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />} Inviter
        </Button>
      </div>

      {/* Formulaire d'invitation : attribue un rôle à un compte existant */}
      {inviteOpen && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 text-[12.5px] text-muted-foreground">
            Attribuez un rôle à un compte Ooble existant. La personne doit d'abord avoir créé son compte.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <input
              type="email"
              spellCheck={false}
              autoCapitalize="none"
              placeholder="membre@exemple.ca"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="min-w-0 flex-1 rounded-[10px] border border-border bg-secondary/40 px-3.5 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground/60"
            />
            <div className="relative shrink-0">
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                className="h-full w-full appearance-none rounded-[10px] border border-border bg-card py-2.5 pl-3.5 pr-8 text-[13px] font-medium outline-none"
              >
                {TEAM_ROLES.map((r) => <option key={r.role} value={r.role}>{r.role}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button
              variant="appSolid"
              shape="rounded"
              className="h-auto shrink-0 rounded-[10px] px-4 py-2.5 text-[13px] font-bold"
              disabled={inviteBusy || !/^\S+@\S+\.\S+$/.test(inviteEmail)}
              onClick={invite}
            >
              {inviteBusy ? "…" : "Ajouter"}
            </Button>
          </div>
          {inviteMsg && (
            <p className={`mt-2.5 text-[12.5px] ${inviteMsg.ok ? "text-primary" : "text-destructive"}`}>{inviteMsg.text}</p>
          )}
        </div>
      )}

      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {members.map((m) => (
          <div key={m.userId} className="px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-[12px] font-semibold text-foreground/70">
                {initials(m.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{m.name}</p>
                <p className="truncate text-[12px] text-muted-foreground">{m.email}</p>
              </div>

              {/* Sélecteur de rôle — persiste dans user_roles */}
              <div className="relative shrink-0">
                <select
                  value={m.role}
                  onChange={(e) => setRole(m.userId, e.target.value as TeamRole)}
                  className="appearance-none rounded-[9px] border border-border bg-card py-1.5 pl-3 pr-7 text-[12.5px] font-medium outline-none transition-colors hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {TEAM_ROLES.map((r) => (
                    <option key={r.role} value={r.role}>{r.role}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Ce que le rôle autorise */}
            <p className="mt-2 pl-12 text-[12px] text-muted-foreground">{roleDesc(m.role)}</p>
          </div>
        ))}

        {!loading && members.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Users className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <p className="mt-3 text-[13px] text-muted-foreground">Aucun membre pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPanel;
