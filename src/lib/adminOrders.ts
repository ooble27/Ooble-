/**
 * Données du back-office (démo front-end).
 *
 * Aucune vraie base pour l'instant : on modélise les commandes exactement comme
 * le back-office aura besoin (achat / vente / envoi, statuts, montants CAD+USDT,
 * réseau, Interac, prise en charge par un opérateur) avec un jeu de données
 * factices. Quand Supabase sera branché, seules les fonctions de lecture/écriture
 * changeront — l'UI reste identique.
 */
import type { NetId } from "@/components/app/networks";

export type OrderType = "buy" | "sell" | "transfer";

/**
 * Cycle de vie d'une commande côté Ooble (paiement Interac) :
 *  attente → le client doit envoyer (achat) ou a créé sa vente
 *  recu    → fonds reçus, à traiter (entre dans la file d'attente)
 *  cours   → pris en charge par un opérateur
 *  termine → USDT envoyés / CAD versés
 *  annule  → annulée / expirée
 */
export type OrderStatus = "attente" | "recu" | "cours" | "termine" | "annule";

export interface AdminOrder {
  id: string;
  ref: string;
  type: OrderType;
  status: OrderStatus;
  clientName: string;
  clientEmail: string;
  cad: number;
  usdt: number;
  rate: number;
  network?: NetId;
  /** Adresse de réception USDT (achat / envoi). */
  address?: string;
  /** E-mail Interac de réception (vente). */
  interacEmail?: string;
  /** Minutes écoulées depuis la création (pour l'affichage relatif). */
  createdMinsAgo: number;
  assignedTo?: string | null;
}

export const STATUS_META: Record<OrderStatus, { label: string; dot: string; tone: string }> = {
  attente: { label: "En attente", dot: "bg-muted-foreground/40", tone: "text-muted-foreground" },
  recu:    { label: "À traiter",  dot: "bg-primary",             tone: "text-foreground" },
  cours:   { label: "En cours",   dot: "bg-amber-500",           tone: "text-foreground" },
  termine: { label: "Terminé",    dot: "bg-emerald-500",         tone: "text-muted-foreground" },
  annule:  { label: "Annulé",     dot: "bg-destructive",         tone: "text-muted-foreground" },
};

export const TYPE_META: Record<OrderType, { label: string; verb: string }> = {
  buy:      { label: "Achat",  verb: "Envoyer les USDT" },
  sell:     { label: "Vente",  verb: "Verser les CAD" },
  transfer: { label: "Envoi",  verb: "Exécuter l'envoi" },
};

/** Opérateur connecté au back-office (démo). Sert à « Mes commandes ». */
export const CURRENT_OPERATOR = "Vous";

export const nfCad = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
export const nfUsdt = new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 });

/** Affichage relatif court : « il y a 5 min », « il y a 2 h », « il y a 3 j ». */
export function timeAgo(mins: number): string {
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return `il y a ${d} j`;
}

const RATE = 1.43;
const addr = (p: string) => `${p}${Math.random().toString(36).slice(2, 10)}`;

/** Fabrique une commande d'achat (le client paie en CAD, reçoit des USDT). */
const buy = (
  ref: string, status: OrderStatus, name: string, email: string, cad: number,
  network: NetId, mins: number, assignedTo: string | null = null,
): AdminOrder => ({
  id: ref, ref, type: "buy", status, clientName: name, clientEmail: email,
  cad, usdt: cad / RATE, rate: RATE, network, address: addr("T"),
  createdMinsAgo: mins, assignedTo,
});

/** Fabrique une commande de vente (le client envoie des USDT, reçoit des CAD). */
const sell = (
  ref: string, status: OrderStatus, name: string, email: string, usdt: number,
  mins: number, assignedTo: string | null = null,
): AdminOrder => ({
  id: ref, ref, type: "sell", status, clientName: name, clientEmail: email,
  cad: usdt * RATE, usdt, rate: RATE, interacEmail: email,
  createdMinsAgo: mins, assignedTo,
});

/** Jeu de données de démonstration. */
export const SEED_ORDERS: AdminOrder[] = [
  sell("OOB-7K2P4A", "recu",    "Amélie Tremblay", "amelie.t@gmail.com",   1200, 3),
  buy ("OOB-9QX3M1", "recu",    "Marc Gagnon",     "marc.gagnon@icloud.com", 500, "trx", 8),
  buy ("OOB-3H8L2C", "cours",   "Sophie Bergeron", "s.bergeron@outlook.com", 2500, "eth", 21, "Karim"),
  sell("OOB-5R1N7D", "recu",    "David Roy",       "davidroy88@gmail.com",  800, 34),
  buy ("OOB-2W6T9E", "attente", "Julie Côté",      "julie.cote@gmail.com",  150, "matic", 44),
  sell("OOB-8B4K5F", "cours",   "Nicolas Fortin",  "n.fortin@proton.me",   3400, 52, "Awa"),
  buy ("OOB-1M9P2G", "termine", "Isabelle Girard", "i.girard@videotron.ca", 640, "sol", 190),
  buy ("OOB-6C3V8H", "termine", "Patrick Lévesque","plevesque@gmail.com",  1800, "trx", 260),
  sell("OOB-4F7J1K", "termine", "Mélanie Dubé",    "melanie.dube@gmail.com", 950, 320),
  buy ("OOB-0T5R9L", "attente", "Étienne Caron",   "etienne.caron@gmail.com", 300, "bnb", 380),
  sell("OOB-7Y2Q6M", "annule",  "Vincent Ouellet", "vince.o@hotmail.com",   500, 520),
  buy ("OOB-9D8W3N", "termine", "Catherine Pelletier","cath.p@gmail.com",  4200, "eth", 610),
  buy ("OOB-3G1X7P", "recu",    "Hugo Bouchard",   "hugo.bouchard@gmail.com", 220, "avax", 12),
  sell("OOB-5A6Z2Q", "termine", "Laurence Simard", "l.simard@gmail.com",   1500, 720),
];
