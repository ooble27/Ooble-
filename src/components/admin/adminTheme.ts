/**
 * Vocabulaire visuel du back-office Ooble — thème sombre monochrome
 * inspiré du back-office Terex. Zéro couleur d'accent : tout est
 * en niveaux de gris, avec le blanc pur comme unique surbrillance.
 *
 * Utilisé partout dans `src/components/admin/*` et `src/pages/admin/*` pour
 * garder une cohérence visuelle stricte : mêmes cartes, mêmes textes, mêmes
 * transitions. Les composants qui l'importent partent d'un socle homogène ;
 * ils n'ont plus qu'à composer la structure.
 */

/** Palette — 100 % monochrome. */
export const C = {
  /** Fond principal de l'écran. */
  bg:   "#1a1a1a",
  /** Fond des cartes. */
  l1:   "#212121",
  /** Fond au-dessus (survol, sous-carte). */
  l2:   "#282828",
  /** Fond boutons, chip, icon-box. */
  l3:   "#303030",
  /** Fond boutons hover. */
  l4:   "#383838",

  /** Séparateurs internes (très subtils). */
  bds:  "#2a2a2a",
  /** Bordures cartes / boutons. */
  bd:   "#383838",
  /** Bordures au survol. */
  bdh:  "#484848",

  /** Accent unique — blanc pur. Jamais de couleur. */
  accent:      "#ffffff",
  accentSoft:  "rgba(255,255,255,0.08)",
  accentBd:    "rgba(255,255,255,0.20)",
  accentHover: "#e8e8e8",

  /** Texte primaire (titres, valeurs). */
  t1:   "#f0f0f0",
  /** Texte secondaire (labels de contenu, valeurs discrètes). */
  t2:   "#888888",
  /** Texte tertiaire (labels de section, méta). */
  t3:   "#565656",
} as const;

/** Familles de police. */
export const FONT = "'Inter', system-ui, -apple-system, sans-serif";
/** Chiffres et code (montants, IDs, adresses). */
export const MONO = "'JetBrains Mono', ui-monospace, Consolas, monospace";

/** Carte standard. */
export const card: React.CSSProperties = {
  background: C.l1,
  border: `1px solid ${C.bds}`,
  borderRadius: 14,
  overflow: "hidden",
};

/** Carte héro (dégradé subtil, ombre profonde). */
export const heroCard: React.CSSProperties = {
  background: "linear-gradient(135deg, #1e1e1e 0%, #181818 60%, #1a1a1a 100%)",
  border: `1px solid ${C.bds}`,
  borderRadius: 16,
  padding: "30px 28px 26px",
  boxShadow: "0 4px 32px rgba(0,0,0,0.45)",
};

/** Label de section uppercase (au-dessus d'une carte). */
export const sH: React.CSSProperties = {
  color: C.t3,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  margin: 0,
  fontFamily: FONT,
};

/** Padding interne standard pour l'en-tête d'une carte. */
export const cardHeader: React.CSSProperties = {
  padding: "14px 20px",
  borderBottom: `1px solid ${C.bds}`,
};

/** Ligne dans une liste au sein d'une carte (sépare toutes les lignes sauf la dernière). */
export function rowStyle(isLast: boolean): React.CSSProperties {
  return {
    padding: "11px 20px",
    borderBottom: isLast ? "none" : `1px solid ${C.bds}`,
  };
}

/** Bouton primaire — plein blanc. */
export const btnPrimary: React.CSSProperties = {
  height: 36,
  paddingLeft: 18,
  paddingRight: 18,
  background: C.accent,
  border: "none",
  borderRadius: 9,
  color: "#111",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontFamily: FONT,
  whiteSpace: "nowrap",
  transition: "background 0.15s",
};

/** Bouton secondaire — contour, bord + texte deviennent blancs au survol. */
export const btnGhost: React.CSSProperties = {
  height: 36,
  paddingLeft: 16,
  paddingRight: 16,
  background: "transparent",
  border: `1px solid ${C.bd}`,
  borderRadius: 9,
  color: C.t2,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontFamily: FONT,
  whiteSpace: "nowrap",
  transition: "all 0.15s",
};

/** Input / select / textarea unifiés. */
export const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: `1px solid ${C.bd}`,
  borderRadius: 9,
  padding: "9px 12px",
  color: C.t1,
  fontSize: 13,
  fontFamily: FONT,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

/** Attache un effet de survol conforme au ghost button à un handler. */
export function ghostHoverIn(el: HTMLElement) {
  el.style.borderColor = C.accentBd;
  el.style.color = C.accent;
}
export function ghostHoverOut(el: HTMLElement) {
  el.style.borderColor = C.bd;
  el.style.color = C.t2;
}

/** Effet de survol pour bouton primaire. */
export function primaryHoverIn(el: HTMLElement) { el.style.background = C.accentHover; }
export function primaryHoverOut(el: HTMLElement) { el.style.background = C.accent; }
