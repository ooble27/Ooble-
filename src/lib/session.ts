/**
 * Session locale (démo front-end).
 * Aucune authentification réelle pour l'instant — la connexion Supabase
 * sera branchée plus tard. On mémorise juste l'utilisateur dans le
 * localStorage pour simuler l'état « connecté » et alimenter le dashboard.
 */

const KEY = "ooble.session";

export interface OobleUser {
  name: string;
  email: string;
}

export function getUser(): OobleUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as OobleUser;
    return u && u.name ? u : null;
  } catch {
    return null;
  }
}

export function setUser(user: OobleUser): void {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(KEY);
}

/** Prénom d'affichage à partir du nom complet. */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}
