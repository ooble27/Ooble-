/**
 * Panneau « Messagerie » du back-office.
 *
 * Vocation : permettre au staff d'écrire librement à un client (sujet + corps
 * complets), avec l'aide facultative de « points de départ » réutilisables
 * (les templates deviennent des raccourcis, pas des corsets). Le composer
 * ressemble à un vrai client mail — pas un formulaire à variables.
 *
 * Personnalisation :
 *   - le champ « À » est un picker qui charge l'annuaire clients réel
 *     (fetchClientDirectory) et propose recherche + multi-sélection ;
 *   - dans le corps, les variables `{{prenom}}`, `{{nom}}`, `{{nom_complet}}`
 *     et `{{email}}` sont remplacées automatiquement par les vraies valeurs
 *     de chaque destinataire au moment de l'envoi (un envoi par client) ;
 *   - un envoi à plusieurs clients boucle : chaque destinataire reçoit un
 *     mail nominatif — pas de « Bonjour {{prenom}} » qui traîne.
 *
 * Sous-vues :
 *   1. Composer  — libre. Corps rédigé en markdown minimal (gras, italique,
 *                  listes, liens, titres…) avec toolbar. Aperçu HTML rendu
 *                  en direct avec substitution live des variables.
 *   2. Envoyés   — historique local des envois avec statut.
 *   3. Points de départ — snippets réutilisables (« bienvenue », « suivi »,
 *                  « demande de complément KYC »…). Un clic → chargés dans
 *                  le composer, entièrement modifiables ensuite.
 *   4. Réception — bloc de configuration expliquant les étapes pour activer
 *                  la réception (Resend Inbound + webhook).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send, Mail, Inbox, Sparkles, Check, AlertTriangle, Eye, Bold, Italic,
  List, ListOrdered, Link as LinkIcon, Heading2, Quote, Minus, Copy,
  X, User, Users,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { sendCustomEmail } from "@/lib/email";
import { loadSent, recordSent, type SentMail } from "@/lib/mailHistory";
import { fetchClientDirectory, type ClientDirectoryEntry } from "@/lib/adminClient";
import {
  markdownToHtml, wrapSelection, insertAtCursor, prefixLines, defaultSignature,
  substituteVars, CLIENT_VARS,
} from "@/lib/mailComposer";
import AdminHero from "./AdminHero";
import { SubTabs } from "./AdminBits";
import { C, FONT, card, sH, inputStyle, listRowStyle } from "./adminTheme";

// ──────────────────── Recipient model ────────────────────
//
// Un « recipient » peut être soit un client réel (id + prénom + nom), soit
// une adresse tapée à la main (pas d'id, prénom déduit de la partie locale).
// L'UI affiche l'un et l'autre sous forme de puce.

interface Recipient {
  id?: string;
  email: string;
  firstName: string;
  fullName: string;
}

function manualRecipient(email: string): Recipient {
  const local = email.split("@")[0] ?? "";
  const first = (local.split(/[.\-_]/)[0] || "").replace(/^./, (c) => c.toUpperCase());
  return { email, firstName: first, fullName: first };
}

function recipientFromClient(c: ClientDirectoryEntry): Recipient {
  return { id: c.id, email: c.email, firstName: c.firstName, fullName: c.fullName };
}

function recipientVars(r: Recipient): Record<string, string> {
  return {
    prenom: r.firstName || "",
    nom: r.fullName.split(/\s+/).slice(1).join(" ") || r.firstName || "",
    nom_complet: r.fullName || r.email,
    email: r.email,
  };
}

// ──────────────────── Points de départ (snippets) ────────────────────

interface Snippet {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
}

const SNIPPETS: Snippet[] = [
  {
    id: "kyc-followup",
    name: "Relance KYC",
    description: "Le client n'a pas fini sa vérification d'identité.",
    subject: "Votre vérification d'identité — Ooble",
    body: `Bonjour {{prenom}},

Nous n'avons pas encore reçu tous les documents nécessaires à la validation de votre compte Ooble.

Pour finaliser votre vérification, vous pouvez reprendre depuis votre espace :
[Reprendre la vérification](https://ooble.ca/app/verification)

Un membre de l'équipe reste disponible si vous avez la moindre question — répondez simplement à ce message.

À bientôt,`,
  },
  {
    id: "kyc-complement",
    name: "Demande de complément KYC",
    description: "Un document est illisible ou manque.",
    subject: "Complément d'information pour votre dossier — Ooble",
    body: `Bonjour {{prenom}},

Nous avons bien reçu votre dossier de vérification et il nous manque **{{piece}}** pour finaliser.

Pouvez-vous nous transmettre ce document en réponse à ce message, ou via votre espace ?

Merci,`,
  },
  {
    id: "welcome-manual",
    name: "Bienvenue personnalisée",
    description: "Message de bienvenue rédigé à la main, plus chaleureux que le mail auto.",
    subject: "Bienvenue sur Ooble",
    body: `Bonjour {{prenom}},

Bienvenue chez Ooble. Votre compte est actif : vous pouvez dès maintenant acheter ou vendre des USDT contre des dollars canadiens.

Quelques repères pour bien démarrer :

- Le taux est verrouillé pendant 15 minutes après création d'un ordre.
- Vos paiements Interac utilisent une question de sécurité personnelle — visible dans votre compte.
- Pour toute question, cet e-mail est le bon canal : nous vous répondons dans la journée.

Bienvenue à bord,`,
  },
  {
    id: "compliance-info",
    name: "Demande CANAFE",
    description: "Demande d'information pour une opération importante.",
    subject: "Vérification d'une opération — Ooble",
    body: `Bonjour {{prenom}},

Dans le cadre de nos obligations réglementaires (LRPCFAT / CANAFE), nous avons besoin de quelques précisions sur votre opération **{{ref}}** :

1. Nature exacte des fonds
2. Provenance
3. Usage prévu

Ces informations restent confidentielles et sont conservées dans votre dossier.

Merci d'y répondre dans les 5 jours ouvrables afin que nous puissions procéder au traitement.

Cordialement,`,
  },
  {
    id: "sav-response",
    name: "Réponse SAV",
    description: "Réponse type à une demande d'assistance.",
    subject: "Re: {{sujet}}",
    body: `Bonjour {{prenom}},

Merci pour votre message.

{{reponse}}

Restez à l'écoute et n'hésitez pas si autre chose,`,
  },
];

type SubTab = "compose" | "sent" | "snippets" | "inbox";

const dateFmt = new Intl.DateTimeFormat("fr-CA", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
});
const EMAIL_RE = /^\S+@\S+\.\S+$/;

// ────────────────────────────────────────────────────────────
// Composer libre
// ────────────────────────────────────────────────────────────

interface ComposerState {
  recipients: Recipient[];
  cc: string;
  subject: string;
  body: string;
}

interface ComposeViewProps {
  onSent: () => void;
  initial: ComposerState | null;
  onConsumed: () => void;
  clients: ClientDirectoryEntry[];
  clientsLoading: boolean;
}

function ComposeView({ onSent, initial, onConsumed, clients, clientsLoading }: ComposeViewProps) {
  const { session } = useAuth();
  const author = session?.user?.email ?? "staff";
  const signature = useMemo(() => defaultSignature(author), [author]);

  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(signature);
  const [showCc, setShowCc] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<null | { kind: "ok" | "err"; text: string }>(null);
  const [showPreview, setShowPreview] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!initial) return;
    setRecipients(initial.recipients);
    setCc(initial.cc);
    setSubject(initial.subject);
    setBody(initial.body || signature);
    setFeedback(null);
    onConsumed();
  }, [initial, signature, onConsumed]);

  // Aperçu : on personnalise avec le premier destinataire réel ; s'il n'y en
  // a aucun, on laisse les variables visibles pour que l'auteur sache où
  // elles s'inséreront.
  const previewRecipient = recipients[0];
  const previewVars = previewRecipient ? recipientVars(previewRecipient) : {};
  const previewBody = previewRecipient
    ? substituteVars(body, previewVars)
    : substituteVars(body, {}, [...CLIENT_VARS]);
  const previewSubject = previewRecipient
    ? substituteVars(subject, previewVars)
    : substituteVars(subject, {}, [...CLIENT_VARS]);
  const renderedHtml = useMemo(() => markdownToHtml(previewBody), [previewBody]);

  const valid = recipients.length > 0 && subject.trim().length > 0 && body.trim().length > 0;

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setFeedback(null);
    const ccList = cc.split(",").map((s) => s.trim()).filter((s) => EMAIL_RE.test(s));

    // Un envoi par destinataire, avec substitution des variables client.
    // On séquentialise (petits volumes, pas d'urgence) pour bien tracer
    // chaque envoi dans l'historique.
    let ok = 0;
    let failed = 0;
    let lastError: string | undefined;

    for (const r of recipients) {
      const vars = recipientVars(r);
      const subj = substituteVars(subject.trim(), vars);
      const bodyRendered = substituteVars(body, vars);
      const html = markdownToHtml(bodyRendered);

      const res = await sendCustomEmail({
        to: r.email,
        subject: subj,
        html,
        text: bodyRendered,
        cc: ccList.length > 0 ? ccList : undefined,
      });

      recordSent({
        id: crypto.randomUUID(),
        to: r.email,
        subject: subj,
        template: "newsletter",
        vars: { body: bodyRendered, clientName: r.fullName },
        sentAt: new Date().toISOString(),
        sentBy: author,
        outcome: res.error
          ? { ok: false, error: res.error }
          : { ok: true, providerId: res.id },
      });

      if (res.error) { failed += 1; lastError = res.error; }
      else ok += 1;
    }

    setBusy(false);
    onSent();

    if (failed === 0) {
      setFeedback({
        kind: "ok",
        text: recipients.length === 1
          ? `Envoyé à ${recipients[0].fullName || recipients[0].email}.`
          : `Envoyé à ${ok} destinataires.`,
      });
      setRecipients([]);
      setCc("");
      setSubject("");
      setBody(signature);
      setShowCc(false);
    } else if (ok === 0) {
      setFeedback({ kind: "err", text: lastError ?? "Échec des envois." });
    } else {
      setFeedback({
        kind: "err",
        text: `${ok} envoyé(s), ${failed} en échec — ${lastError ?? "cause inconnue"}.`,
      });
    }
  };

  const withRef = (fn: (t: HTMLTextAreaElement) => void) => () => {
    if (textareaRef.current) fn(textareaRef.current);
  };

  const insertLink = withRef((t) => {
    const url = prompt("URL du lien (https://…)");
    if (!url) return;
    const label = t.value.slice(t.selectionStart, t.selectionEnd) || "texte du lien";
    insertAtCursor(t, `[${label}](${url})`);
  });

  const addRecipient = (r: Recipient) => {
    setRecipients((prev) => prev.some((x) => x.email.toLowerCase() === r.email.toLowerCase()) ? prev : [...prev, r]);
  };
  const removeRecipient = (email: string) => {
    setRecipients((prev) => prev.filter((r) => r.email !== email));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
      {/* Colonne gauche — composer */}
      <div style={{ ...card, padding: 0, fontFamily: FONT }}>
        {/* Destinataires */}
        <div style={{
          padding: "14px 18px", borderBottom: `1px solid ${C.bds}`,
          display: "grid", rowGap: 12,
        }}>
          <RecipientPicker
            selected={recipients}
            clients={clients}
            loading={clientsLoading}
            onAdd={addRecipient}
            onRemove={removeRecipient}
            onSelectAllKyc={() => {
              const approved = clients.filter((c) => c.kycStatus === "approved").map(recipientFromClient);
              setRecipients(approved);
            }}
          />
          {showCc ? (
            <FieldRow label="Cc">
              <input
                type="text"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="conformite@ooble.ca, direction@ooble.ca"
                style={{ ...inputStyle, border: "none", padding: 0, background: "transparent" }}
                spellCheck={false}
                autoCapitalize="none"
              />
            </FieldRow>
          ) : (
            <button
              type="button"
              onClick={() => setShowCc(true)}
              style={{
                justifySelf: "start",
                background: "transparent", border: "none", cursor: "pointer",
                color: C.t3, fontSize: 11.5, padding: 0, fontFamily: FONT,
                transition: "color 0.12s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.t1; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.t3; }}
            >
              + Ajouter Cc
            </button>
          )}
          <FieldRow label="Sujet">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Objet du message"
              style={{ ...inputStyle, border: "none", padding: 0, background: "transparent" }}
            />
          </FieldRow>
        </div>

        {/* Toolbar */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 2,
          padding: "8px 12px", borderBottom: `1px solid ${C.bds}`,
          background: "rgba(255,255,255,0.015)",
        }}>
          <ToolbarButton title="Titre" onClick={withRef((t) => prefixLines(t, "## "))}>
            <Heading2 style={{ width: 14, height: 14 }} strokeWidth={1.7} />
          </ToolbarButton>
          <ToolbarButton title="Gras" onClick={withRef((t) => wrapSelection(t, "**"))}>
            <Bold style={{ width: 14, height: 14 }} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton title="Italique" onClick={withRef((t) => wrapSelection(t, "*"))}>
            <Italic style={{ width: 14, height: 14 }} strokeWidth={1.7} />
          </ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton title="Liste à puces" onClick={withRef((t) => prefixLines(t, "- "))}>
            <List style={{ width: 14, height: 14 }} strokeWidth={1.7} />
          </ToolbarButton>
          <ToolbarButton title="Liste numérotée" onClick={withRef((t) => prefixLines(t, "1. "))}>
            <ListOrdered style={{ width: 14, height: 14 }} strokeWidth={1.7} />
          </ToolbarButton>
          <ToolbarButton title="Citation" onClick={withRef((t) => prefixLines(t, "> "))}>
            <Quote style={{ width: 14, height: 14 }} strokeWidth={1.7} />
          </ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton title="Lien" onClick={insertLink}>
            <LinkIcon style={{ width: 14, height: 14 }} strokeWidth={1.7} />
          </ToolbarButton>
          <ToolbarButton title="Ligne horizontale" onClick={withRef((t) => insertAtCursor(t, "\n\n---\n\n"))}>
            <Minus style={{ width: 14, height: 14 }} strokeWidth={1.7} />
          </ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton title="Insérer {{prenom}}" onClick={withRef((t) => insertAtCursor(t, "{{prenom}}"))}>
            <span style={{ fontSize: 10.5, fontFamily: FONT, letterSpacing: "0.02em", padding: "0 3px" }}>
              {"{{prenom}}"}
            </span>
          </ToolbarButton>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "transparent", border: "none", cursor: "pointer",
              color: C.t3, fontSize: 11.5, padding: "4px 8px", borderRadius: 6,
              fontFamily: FONT, transition: "color 0.12s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.t1; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.t3; }}
          >
            <Eye style={{ width: 12, height: 12 }} />
            {showPreview ? "Cacher l'aperçu" : "Voir l'aperçu"}
          </button>
        </div>

        {/* Textarea du corps */}
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Bonjour {{prenom}},&#10;&#10;Écrivez votre message ici. Les variables {{prenom}}, {{nom}}, {{email}} sont remplacées par les vraies valeurs de chaque destinataire au moment de l'envoi."
          rows={18}
          style={{
            display: "block", width: "100%", boxSizing: "border-box",
            padding: "16px 18px", border: "none", outline: "none",
            background: "transparent", color: C.t1,
            fontFamily: FONT, fontSize: 14, lineHeight: 1.6,
            resize: "vertical", minHeight: 320,
          }}
        />

        {/* Feedback + actions */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
          padding: "12px 18px", borderTop: `1px solid ${C.bds}`,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            {feedback && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 12px", borderRadius: 8,
                background: feedback.kind === "ok" ? "rgba(255,255,255,0.05)" : "rgba(200,60,60,0.10)",
                border: `1px solid ${feedback.kind === "ok" ? C.accentBd : "rgba(200,60,60,0.3)"}`,
                color: feedback.kind === "ok" ? C.t1 : "#f2c1c1",
                fontSize: 12,
              }}>
                {feedback.kind === "ok"
                  ? <Check style={{ width: 13, height: 13 }} strokeWidth={2} />
                  : <AlertTriangle style={{ width: 13, height: 13 }} strokeWidth={2} />}
                {feedback.text}
              </div>
            )}
          </div>
          <button
            onClick={submit}
            disabled={!valid || busy}
            style={{
              height: 38, padding: "0 20px", borderRadius: 9, border: "none",
              background: valid && !busy ? C.accent : C.l3,
              color: valid && !busy ? "#111" : C.t3,
              fontSize: 12.5, fontFamily: FONT,
              display: "inline-flex", alignItems: "center", gap: 7,
              cursor: valid && !busy ? "pointer" : "default",
              transition: "background 0.15s",
            }}
          >
            <Send style={{ width: 14, height: 14 }} strokeWidth={2} />
            {busy
              ? "Envoi…"
              : recipients.length > 1
                ? `Envoyer à ${recipients.length}`
                : "Envoyer"}
          </button>
        </div>
      </div>

      {/* Colonne droite — aperçu rendu */}
      {showPreview && (
        <div style={{ ...card, padding: 0, fontFamily: FONT }}>
          <div style={{
            padding: "12px 18px", borderBottom: `1px solid ${C.bds}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={sH}>Aperçu du message</span>
            <span style={{ fontSize: 10.5, color: C.t3, letterSpacing: "0.06em" }}>
              {previewRecipient
                ? `Aperçu pour ${previewRecipient.fullName || previewRecipient.email}`
                : "Rendu final chez le destinataire"}
            </span>
          </div>
          <PreviewFrame
            from="Ooble <bonjour@ooble.ca>"
            to={previewRecipient?.email ?? (recipients[0]?.email ?? "—")}
            subject={previewSubject || "—"}
            html={renderedHtml}
          />
        </div>
      )}
    </div>
  );
}

// ─── Picker de destinataires ────────────────────────────────

interface PickerProps {
  selected: Recipient[];
  clients: ClientDirectoryEntry[];
  loading: boolean;
  onAdd: (r: Recipient) => void;
  onRemove: (email: string) => void;
  onSelectAllKyc: () => void;
}

function RecipientPicker({ selected, clients, loading, onAdd, onRemove, onSelectAllKyc }: PickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const q = query.trim().toLowerCase();
  const selectedIds = new Set(selected.map((r) => r.email.toLowerCase()));
  const matches = q
    ? clients
        .filter((c) => !selectedIds.has(c.email.toLowerCase()))
        .filter((c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.firstName.toLowerCase().includes(q),
        )
        .slice(0, 8)
    : clients.filter((c) => !selectedIds.has(c.email.toLowerCase())).slice(0, 6);

  const commit = () => {
    const raw = query.trim();
    if (!raw) return;
    if (EMAIL_RE.test(raw)) {
      onAdd(manualRecipient(raw));
      setQuery("");
      setOpen(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "40px 1fr", alignItems: "start", gap: 8, position: "relative" }}>
      <span style={{
        fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: "0.08em",
        paddingTop: 8,
      }}>À</span>

      <div style={{
        display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center",
        minHeight: 32,
      }}>
        {selected.map((r) => (
          <span
            key={r.email}
            title={r.email}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 6px 4px 10px", borderRadius: 999,
              background: r.id ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${r.id ? C.accentBd : C.bd}`,
              color: C.t1, fontSize: 12, fontFamily: FONT,
              maxWidth: "100%",
            }}
          >
            {r.id
              ? <User style={{ width: 10, height: 10, color: C.t3 }} strokeWidth={2} />
              : <Mail style={{ width: 10, height: 10, color: C.t3 }} strokeWidth={2} />}
            <span style={{
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              maxWidth: 180,
            }}>
              {r.fullName || r.email}
            </span>
            <button
              type="button"
              onClick={() => onRemove(r.email)}
              aria-label={`Retirer ${r.email}`}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18, borderRadius: 999,
                background: "transparent", border: "none", cursor: "pointer",
                color: C.t3, transition: "background 0.12s, color 0.12s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = C.t1; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.t3; }}
            >
              <X style={{ width: 10, height: 10 }} strokeWidth={2} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => { setTimeout(() => setOpen(false), 140); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); commit(); }
            if (e.key === "Backspace" && !query && selected.length > 0) {
              onRemove(selected[selected.length - 1].email);
            }
          }}
          placeholder={selected.length === 0 ? "Chercher un client ou taper un e-mail…" : ""}
          spellCheck={false}
          autoCapitalize="none"
          style={{
            flex: 1, minWidth: 180,
            border: "none", outline: "none", background: "transparent",
            color: C.t1, fontFamily: FONT, fontSize: 13.5,
            padding: "6px 0",
          }}
        />
      </div>

      {/* Dropdown */}
      {open && (matches.length > 0 || loading || clients.length > 0) && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: "absolute", top: "100%", left: 48, right: 0,
            marginTop: 4, zIndex: 20,
            background: C.l1, border: `1px solid ${C.bd}`, borderRadius: 10,
            boxShadow: "0 12px 32px -8px rgba(0,0,0,0.55)",
            maxHeight: 320, overflowY: "auto",
            padding: 4,
          }}
        >
          {loading && (
            <div style={{ padding: "10px 12px", fontSize: 12, color: C.t3 }}>
              Chargement de l'annuaire…
            </div>
          )}

          {!loading && clients.length === 0 && (
            <div style={{ padding: "10px 12px", fontSize: 12, color: C.t3 }}>
              Aucun client dans l'annuaire. Vous pouvez taper une adresse manuellement.
            </div>
          )}

          {matches.length === 0 && !loading && clients.length > 0 && (
            <div style={{ padding: "10px 12px", fontSize: 12, color: C.t3 }}>
              {q ? `Aucun résultat pour « ${q} ».` : "Tous les clients sont déjà sélectionnés."}
              {q && EMAIL_RE.test(q) && (
                <> Appuyer sur Entrée pour envoyer à cette adresse.</>
              )}
            </div>
          )}

          {matches.map((c) => (
            <button
              key={c.id}
              type="button"
              onMouseDown={() => { onAdd(recipientFromClient(c)); setQuery(""); }}
              style={{
                display: "flex", width: "100%", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 7,
                background: "transparent", border: "none", cursor: "pointer",
                color: C.t1, textAlign: "left", fontFamily: FONT,
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,0.05)", border: `1px solid ${C.bds}`,
                color: C.t2, fontSize: 11.5,
              }}>
                {(c.firstName || c.email)[0]?.toUpperCase() || "?"}
              </span>
              <span style={{ minWidth: 0, flex: 1 }}>
                <span style={{
                  display: "block", fontSize: 13, color: C.t1,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {c.fullName}
                </span>
                <span style={{
                  display: "block", fontSize: 11, color: C.t3,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {c.email}
                </span>
              </span>
              {c.kycStatus === "approved" && (
                <span style={{
                  fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: C.t3, flexShrink: 0,
                }}>
                  KYC
                </span>
              )}
            </button>
          ))}

          {!loading && clients.length > 0 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 10px", borderTop: `1px solid ${C.bds}`, marginTop: 4,
              fontSize: 11, color: C.t3,
            }}>
              <span>{clients.length} clients dans l'annuaire</span>
              <button
                type="button"
                onMouseDown={onSelectAllKyc}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "transparent", border: "none", cursor: "pointer",
                  color: C.t2, fontSize: 11, padding: 0, fontFamily: FONT,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.t1; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.t2; }}
              >
                <Users style={{ width: 11, height: 11 }} strokeWidth={2} />
                Sélectionner tous les KYC approuvés
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Petites briques du composer ────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gridTemplateColumns: "40px 1fr", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function ToolbarButton({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        minWidth: 30, height: 30, borderRadius: 7, padding: "0 6px",
        background: "transparent", border: "none", cursor: "pointer",
        color: C.t2, transition: "background 0.12s, color 0.12s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = C.t1; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.t2; }}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return <div style={{ width: 1, height: 20, background: C.bds, margin: "0 4px", alignSelf: "center" }} />;
}

/**
 * Preview du mail rendu — cadre blanc pour se rapprocher du rendu chez le
 * destinataire (les clients mail sont majoritairement en fond clair).
 */
function PreviewFrame({ from, to, subject, html }: { from: string; to: string; subject: string; html: string }) {
  return (
    <div style={{ background: "#f6f6f4", padding: 16 }}>
      <div style={{
        background: "#fff", borderRadius: 12,
        boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 12px 32px -12px rgba(20,20,20,0.08)",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "18px 22px 12px", color: "#111",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>Ooble</div>
        </div>
        <div style={{
          padding: "4px 22px 8px", fontSize: 12, color: "#6b6b68",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          lineHeight: 1.55,
        }}>
          <div><span style={{ color: "#9c9c98", display: "inline-block", width: 42 }}>De</span> {from}</div>
          <div><span style={{ color: "#9c9c98", display: "inline-block", width: 42 }}>À</span> {to}</div>
          <div><span style={{ color: "#9c9c98", display: "inline-block", width: 42 }}>Sujet</span> <strong style={{ color: "#111", fontWeight: 500 }}>{subject}</strong></div>
        </div>
        <div style={{
          padding: "4px 22px 22px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 14.5, color: "#1a1a1a", lineHeight: 1.55,
        }}>
          {html.trim() ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <em style={{ color: "#8b8b8b" }}>Aucun contenu — commencez à écrire à gauche.</em>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────── Envoyés ───────────────────

function SentView({ sent }: { sent: SentMail[] }) {
  if (sent.length === 0) {
    return (
      <div style={{ ...card, padding: 40, textAlign: "center", fontFamily: FONT }}>
        <Mail style={{ width: 22, height: 22, color: C.t3, opacity: 0.5, margin: "0 auto 8px", display: "block" }} strokeWidth={1.6} />
        <p style={{ fontSize: 12.5, color: C.t3, margin: 0 }}>
          Aucun e-mail envoyé depuis ce poste pour l'instant.
        </p>
      </div>
    );
  }
  return (
    <div style={card}>
      {sent.map((m, i) => {
        const ok = m.outcome.ok;
        return (
          <div key={m.id} style={{ ...listRowStyle(i === sent.length - 1), alignItems: "flex-start", gap: 14 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: "rgba(255,255,255,0.05)", border: `1px solid ${C.bds}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: ok ? C.t1 : "#dda0a0",
            }}>
              {ok ? <Check style={{ width: 13, height: 13 }} strokeWidth={2} />
                  : <AlertTriangle style={{ width: 13, height: 13 }} strokeWidth={2} />}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, color: C.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.subject}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 11.5, color: C.t3, fontVariantNumeric: "tabular-nums" }}>
                à {m.to} · par {m.sentBy} · {dateFmt.format(new Date(m.sentAt))}
                {!ok && <> · <span style={{ color: "#dda0a0" }}>{m.outcome.error}</span></>}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────── Points de départ ───────────────────

interface SnippetsViewProps { onLoad: (s: Snippet) => void }

function SnippetsView({ onLoad }: SnippetsViewProps) {
  return (
    <div style={card}>
      {SNIPPETS.map((s, i) => (
        <div
          key={s.id}
          style={{ ...listRowStyle(i === SNIPPETS.length - 1), alignItems: "flex-start", gap: 14 }}
        >
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: "rgba(255,255,255,0.05)", border: `1px solid ${C.bds}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.t2,
          }}>
            <Sparkles style={{ width: 13, height: 13 }} strokeWidth={1.7} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ margin: 0, fontSize: 13, color: C.t1 }}>{s.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11.5, color: C.t3, lineHeight: 1.5 }}>
              {s.description}
            </p>
          </div>
          <button
            onClick={() => onLoad(s)}
            style={{
              flexShrink: 0,
              height: 30, padding: "0 12px", borderRadius: 7,
              background: "transparent", border: `1px solid ${C.bd}`,
              color: C.t2, fontSize: 11.5, fontFamily: FONT,
              display: "inline-flex", alignItems: "center", gap: 5,
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accentBd; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t2; }}
          >
            <Copy style={{ width: 12, height: 12 }} />
            Charger
          </button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────── Boîte de réception ───────────────────

function InboxView() {
  return (
    <div style={{ ...card, padding: 26, fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: "rgba(255,255,255,0.05)", border: `1px solid ${C.bds}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.t2,
        }}>
          <Inbox style={{ width: 16, height: 16 }} strokeWidth={1.7} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 14, color: C.t1, margin: 0 }}>Réception — à activer</p>
          <p style={{ fontSize: 12.5, color: C.t3, margin: "8px 0 0", lineHeight: 1.6 }}>
            Pour recevoir les réponses des clients ici (et pouvoir cliquer sur « Répondre » pour ouvrir
            le composer préchargé), activer <strong style={{ color: C.t2 }}>Resend Inbound</strong>
            sur <code style={{ background: C.l3, padding: "1px 5px", borderRadius: 4 }}>replies@ooble.ca</code>
            et brancher un webhook <code style={{ background: C.l3, padding: "1px 5px", borderRadius: 4 }}>mail-webhook</code>
            qui insère dans une table <code style={{ background: C.l3, padding: "1px 5px", borderRadius: 4 }}>mail_messages</code>.
          </p>
          <ol style={{ margin: "12px 0 0", paddingLeft: 18, fontSize: 12, color: C.t3, lineHeight: 1.7 }}>
            <li>Activer Resend Inbound + créer la route sur <code>replies@ooble.ca</code>.</li>
            <li>Déployer une edge function <code>mail-webhook</code> qui parse les événements et insère dans <code>mail_messages</code>.</li>
            <li>Ajouter la migration <code>mail_threads</code> + <code>mail_messages</code>.</li>
            <li>Débloquer la liste des conversations et le bouton « Répondre » (ouvrira le composer avec destinataire + sujet préchargés).</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// ─────────────────── Panneau principal ───────────────────

const MailboxPanel = () => {
  const [tab, setTab] = useState<SubTab>("compose");
  const [sent, setSent] = useState<SentMail[]>([]);
  const [initialComposerState, setInitialComposerState] = useState<ComposerState | null>(null);
  const [clients, setClients] = useState<ClientDirectoryEntry[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  useEffect(() => { setSent(loadSent()); }, []);
  useEffect(() => {
    let active = true;
    fetchClientDirectory().then((rows) => {
      if (!active) return;
      setClients(rows);
      setClientsLoading(false);
    });
    return () => { active = false; };
  }, []);

  const refreshSent = () => setSent(loadSent());

  const successfulSent = useMemo(() => sent.filter((m) => m.outcome.ok).length, [sent]);
  const failedSent = sent.length - successfulSent;

  const loadSnippet = (s: Snippet) => {
    setInitialComposerState({ recipients: [], cc: "", subject: s.subject, body: s.body });
    setTab("compose");
  };

  const TABS = [
    { id: "compose",  label: "Composer" },
    { id: "sent",     label: "Envoyés",  count: sent.length || undefined },
    { id: "snippets", label: "Points de départ", count: SNIPPETS.length },
    { id: "inbox",    label: "Réception" },
  ];

  return (
    <div className="space-y-4">
      <div className="lg:max-w-[620px]">
        <AdminHero
          eyebrow="Messagerie"
          value={sent.length}
          unit={sent.length > 1 ? "envois" : "envoi"}
          stats={[
            { label: "Réussis", value: successfulSent },
            { label: "Échecs",  value: failedSent },
            { label: "Annuaire", value: clientsLoading ? "…" : clients.length },
          ]}
          actions={[
            { label: "Nouveau message", icon: Send, primary: true, onClick: () => setTab("compose") },
          ]}
        />
      </div>

      <SubTabs tabs={TABS} active={tab} onChange={(id) => setTab(id as SubTab)} />

      {tab === "compose"  && (
        <ComposeView
          onSent={refreshSent}
          initial={initialComposerState}
          onConsumed={() => setInitialComposerState(null)}
          clients={clients}
          clientsLoading={clientsLoading}
        />
      )}
      {tab === "sent"     && <SentView sent={sent} />}
      {tab === "snippets" && <SnippetsView onLoad={loadSnippet} />}
      {tab === "inbox"    && <InboxView />}
    </div>
  );
};

export default MailboxPanel;
