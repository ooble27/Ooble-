import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  /** Rôles d'équipe de l'utilisateur (vide pour un client). */
  roles: AppRole[];
  /** A un rôle admin. */
  isAdmin: boolean;
  /** Fait partie de l'équipe (au moins un rôle) → accès back-office. */
  isStaff: boolean;
  /** Les rôles sont encore en cours de chargement. */
  rolesLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Nom d'affichage depuis l'e-mail, si aucun nom n'a été fourni. */
function nameFromEmail(email: string): string {
  const local = email.split("@")[0] || "Ami";
  const clean = local.replace(/[._-]+/g, " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function toUser(session: Session | null): AuthUser | null {
  const u = session?.user;
  if (!u) return null;
  const email = u.email ?? "";
  const name = (u.user_metadata?.full_name as string | undefined)?.trim() || nameFromEmail(email);
  return { id: u.id, name, email };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  useEffect(() => {
    // Session initiale + abonnement aux changements (connexion, déconnexion,
    // rafraîchissement de jeton, confirmation d'e-mail…).
    supabase.auth.getSession().then(({ data }) => {
      setUser(toUser(data.session));
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session));
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Charge les rôles d'équipe de l'utilisateur connecté (RLS : chacun voit les
  // siens). Un client sans rôle obtient un tableau vide → pas de back-office.
  useEffect(() => {
    const uid = user?.id;
    if (!uid) {
      setRoles([]);
      setRolesLoading(false);
      return;
    }
    let active = true;
    setRolesLoading(true);
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .then(({ data }) => {
        if (!active) return;
        setRoles((data ?? []).map((r) => r.role));
        setRolesLoading(false);
      });
    return () => { active = false; };
  }, [user?.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      roles,
      isAdmin: roles.includes("admin"),
      isStaff: roles.length > 0,
      rolesLoading,
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        return error ? { error: error.message } : {};
      },
      signUp: async (email, password, name) => {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() || nameFromEmail(email) },
            emailRedirectTo: `${window.location.origin}/app`,
          },
        });
        if (error) return { error: error.message };
        // Si la confirmation d'e-mail est activée, aucune session n'est ouverte.
        return { needsConfirmation: !data.session };
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [user, loading, roles, rolesLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
}
