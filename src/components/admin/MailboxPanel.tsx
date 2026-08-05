/**
 * Panneau « Messagerie » du back-office.
 *
 * Trois sous-vues :
 *   1. Composer          — nouveau message vers un client à partir d'un
 *                          template, avec preview HTML rendue en direct.
 *   2. Envoyés           — historique des envois avec statut de retour.
 *   3. Boîte de réception — bloc de configuration : la réception nécessite
 *                          Resend Inbound + un webhook edge function.
 *                          On documente clairement le chemin.
 *
 * L'envoi passe par la fonction edge `send-email` déjà en place, qui utilise
 * Resend. La liste des templates et leurs variables vient de `TEMPLATES_META`
 * plus bas — la source de vérité reste `supabase/functions/send-email/templates.ts`.
 */
import { useEffect, useMemo, useState } from "react";
import {
  Send, Mail, Inbox, LayoutTemplate, Check, AlertTriangle, Eye,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { sendEmail, type EmailTemplate } from "@/lib/email";
import { loadSent, recordSent, type SentMail } from "@/lib/mailHistory";
import AdminHero from "./AdminHero";
import { SubTabs } from "./AdminBits";
import {
  C, FONT, card, cardHeader, sH, inputStyle, listRowStyle,
} from "./adminTheme";

// ──────────────────── Métadonnées templates ────────────────────

interface TemplateVar {
  key: string;
  label: string;
  placeholder: string;
  required?: boolean;
}

interface TemplateMeta {
  id: EmailTemplate;
  name: string;
  description: string;
  defaultSubject: string;
  vars: TemplateVar[];
}

const TEMPLATES_META: TemplateMeta[] = [
  {
    id: "welcome",
    name: "Bienvenue",
    description: "E-mail envoyé automatiquement à l'inscription. Utile en renvoi manuel si le client dit ne pas l'avoir reçu.",
    defaultSubject: "Bienvenue sur Ooble",
    vars: [
      { key: "name", label: "Prénom du client", placeholder: "Marie", required: true },
    ],
  },
  {
    id: "order-buy",
    name: "Ordre d'achat créé",
    description: "Confirme la création d'un ordre d'achat, rappelle le montant et l'adresse de destination.",
    defaultSubject: "Votre ordre d'achat Ooble ({{ref}})",
    vars: [
      { key: "ref", label: "Référence", placeholder: "OOB-A1B2C3D4", required: true },
      { key: "cadAmount", label: "Montant CAD", placeholder: "500,00" },
      { key: "usdtAmount", label: "Montant USDT", placeholder: "348,72" },
      { key: "walletAddress", label: "Adresse wallet", placeholder: "TXyZ…9c3d" },
    ],
  },
  {
    id: "order-sell",
    name: "Ordre de vente créé",
    description: "Confirme la création d'un ordre de vente et les instructions de dépôt USDT.",
    defaultSubject: "Votre ordre de vente Ooble ({{ref}})",
    vars: [
      { key: "ref", label: "Référence", placeholder: "OOB-A1B2C3D4", required: true },
      { key: "cadAmount", label: "Montant CAD", placeholder: "500,00" },
      { key: "usdtAmount", label: "Montant USDT", placeholder: "348,72" },
    ],
  },
  {
    id: "payment-received",
    name: "Paiement reçu",
    description: "Notifie le client que son virement Interac a été rapproché et que la commande est en traitement.",
    defaultSubject: "Paiement reçu — on traite votre commande ({{ref}})",
    vars: [
      { key: "ref", label: "Référence", placeholder: "OOB-A1B2C3D4", required: true },
    ],
  },
  {
    id: "order-completed",
    name: "Transaction terminée",
    description: "Confirme la fin d'une transaction. Utile en cas de doute du client sur le règlement.",
    defaultSubject: "Transaction terminée ({{ref}})",
    vars: [
      { key: "ref", label: "Référence", placeholder: "OOB-A1B2C3D4", required: true },
    ],
  },
  {
    id: "newsletter",
    name: "Newsletter / annonce",
    description: "Message libre à un client (marketing, changement de politique, invitation). Le sujet est celui que vous saisissez.",
    defaultSubject: "{{subjectLine}}",
    vars: [
      { key: "subjectLine", label: "Ligne de sujet", placeholder: "Nouvelle limite quotidienne — 25 000 $", required: true },
      { key: "body", label: "Corps du message (HTML autorisé)", placeholder: "Bonjour {{name}}, …", required: true },
      { key: "name", label: "Prénom (optionnel)", placeholder: "Marie" },
    ],
  },
];

type SubTab = "compose" | "sent" | "templates" | "inbox";

const dateFmt = new Intl.DateTimeFormat("fr-CA", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
});

// ─────────────────── Composer ───────────────────

function ComposeView({ onSent }: { onSent: () => void }) {
  const { session } = useAuth();
  const author = session?.user?.email ?? "staff";
  const [templateId, setTemplateId] = useState<EmailTemplate>("welcome");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [vars, setVars] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<null | { kind: "ok" | "err"; text: string }>(null);
  const [showPreview, setShowPreview] = useState(false);

  const meta = TEMPLATES_META.find((t) => t.id === templateId)!;

  useEffect(() => {
    setSubject(meta.defaultSubject);
    setVars({});
    setFeedback(null);
  }, [templateId, meta.defaultSubject]);

  // Substitue {{clé}} dans une chaîne pour la preview.
  const render = (str: string) =>
    str.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars && vars[k] ? vars[k] : m));

  const renderedSubject = render(subject);
  const missingRequired = meta.vars.filter((v) => v.required && !vars[v.key]?.trim());
  const valid = /^\S+@\S+\.\S+$/.test(to) && missingRequired.length === 0;

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setFeedback(null);
    const res = await sendEmail({ to: to.trim(), template: templateId, vars, subject: renderedSubject });
    setBusy(false);
    const mail: SentMail = {
      id: crypto.randomUUID(),
      to: to.trim(),
      subject: renderedSubject,
      template: templateId,
      vars,
      sentAt: new Date().toISOString(),
      sentBy: author,
      outcome: res.error
        ? { ok: false, error: res.error }
        : { ok: true, providerId: res.id },
    };
    recordSent(mail);
    onSent();
    if (res.error) {
      setFeedback({ kind: "err", text: res.error });
    } else {
      setFeedback({ kind: "ok", text: `Envoyé à ${mail.to}.` });
      setTo(""); setVars({});
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
      {/* Colonne gauche — formulaire */}
      <div style={{ ...card, padding: 22, fontFamily: FONT }}>
        {/* Template */}
        <label style={{ display: "block", marginBottom: 18 }}>
          <span style={{ ...sH, display: "block", marginBottom: 6 }}>Template</span>
          <div style={{ position: "relative" }}>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value as EmailTemplate)}
              style={{ ...inputStyle, appearance: "none", paddingRight: 32, colorScheme: "dark" }}
            >
              {TEMPLATES_META.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <p style={{ fontSize: 11.5, color: C.t3, margin: "6px 0 0", lineHeight: 1.5 }}>
            {meta.description}
          </p>
        </label>

        {/* Destinataire */}
        <label style={{ display: "block", marginBottom: 14 }}>
          <span style={{ ...sH, display: "block", marginBottom: 6 }}>Destinataire</span>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="client@exemple.ca"
            style={inputStyle}
            spellCheck={false}
            autoCapitalize="none"
          />
        </label>

        {/* Sujet */}
        <label style={{ display: "block", marginBottom: 14 }}>
          <span style={{ ...sH, display: "block", marginBottom: 6 }}>Sujet</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={inputStyle}
          />
          {subject !== renderedSubject && (
            <p style={{ fontSize: 11, color: C.t3, margin: "4px 0 0", fontStyle: "italic" }}>
              Après substitution : {renderedSubject}
            </p>
          )}
        </label>

        {/* Variables */}
        {meta.vars.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ ...sH, marginBottom: 8 }}>Variables du template</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {meta.vars.map((v) => (
                <label key={v.key} style={{ display: "block" }}>
                  <span style={{ display: "block", fontSize: 12, color: C.t2, marginBottom: 4 }}>
                    {v.label}
                    {v.required && <span style={{ color: C.t3, marginLeft: 4 }}>*</span>}
                  </span>
                  {v.key === "body" ? (
                    <textarea
                      rows={5}
                      value={vars[v.key] ?? ""}
                      onChange={(e) => setVars((p) => ({ ...p, [v.key]: e.target.value }))}
                      placeholder={v.placeholder}
                      style={{ ...inputStyle, resize: "vertical", minHeight: 100, fontFamily: FONT }}
                    />
                  ) : (
                    <input
                      value={vars[v.key] ?? ""}
                      onChange={(e) => setVars((p) => ({ ...p, [v.key]: e.target.value }))}
                      placeholder={v.placeholder}
                      style={inputStyle}
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "10px 14px", borderRadius: 10, marginBottom: 12,
            background: feedback.kind === "ok" ? "rgba(255,255,255,0.06)" : "rgba(200,60,60,0.10)",
            border: `1px solid ${feedback.kind === "ok" ? C.accentBd : "rgba(200,60,60,0.3)"}`,
            color: feedback.kind === "ok" ? C.t1 : "#f2c1c1",
            fontSize: 12.5, lineHeight: 1.5,
          }}>
            {feedback.kind === "ok"
              ? <Check style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
              : <AlertTriangle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} strokeWidth={2} />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 10 }}>
          <button
            onClick={() => setShowPreview((v) => !v)}
            style={{
              height: 36, padding: "0 14px", borderRadius: 9,
              background: "transparent", border: `1px solid ${C.bd}`,
              color: C.t2, fontSize: 12, fontFamily: FONT,
              display: "inline-flex", alignItems: "center", gap: 6,
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accentBd; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.t2; }}
          >
            <Eye style={{ width: 13, height: 13 }} />
            {showPreview ? "Cacher" : "Aperçu"}
          </button>
          <button
            onClick={submit}
            disabled={!valid || busy}
            style={{
              height: 36, padding: "0 18px", borderRadius: 9, border: "none",
              background: valid && !busy ? C.accent : C.l3,
              color: valid && !busy ? "#111" : C.t3,
              fontSize: 12, fontFamily: FONT,
              display: "inline-flex", alignItems: "center", gap: 6,
              cursor: valid && !busy ? "pointer" : "default",
              transition: "background 0.15s",
            }}
          >
            <Send style={{ width: 13, height: 13 }} />
            {busy ? "Envoi…" : "Envoyer"}
          </button>
        </div>
      </div>

      {/* Colonne droite — aperçu / conseils */}
      <div style={{ ...card, padding: 20, fontFamily: FONT }}>
        <p style={{ ...sH, marginBottom: 10 }}>Aperçu</p>
        {showPreview ? (
          <div>
            <div style={{
              padding: "10px 12px", borderRadius: 10,
              background: "rgba(255,255,255,0.03)", border: `1px solid ${C.bds}`,
              fontSize: 12, color: C.t2, marginBottom: 10,
            }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <span style={{ color: C.t3, minWidth: 44 }}>De</span>
                <span style={{ color: C.t1 }}>Ooble &lt;bonjour@ooble.ca&gt;</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <span style={{ color: C.t3, minWidth: 44 }}>À</span>
                <span style={{ color: C.t1 }}>{to || "—"}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ color: C.t3, minWidth: 44 }}>Sujet</span>
                <span style={{ color: C.t1, fontWeight: 400 }}>{renderedSubject || "—"}</span>
              </div>
            </div>
            <div style={{
              padding: 14, borderRadius: 10,
              background: "#f7f7f5", color: "#1a1a1a",
              fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap",
            }}>
              {vars.body ? render(vars.body) :
                <em style={{ color: "#8b8b8b" }}>
                  L'aperçu du corps n'est disponible que pour le template « Newsletter » (champ Corps du message). Pour les autres templates, l'HTML est rendu par la fonction edge au moment de l'envoi.
                </em>}
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 12.5, color: C.t2, margin: "0 0 12px", lineHeight: 1.55 }}>
              Cliquez sur <em>Aperçu</em> pour voir la ligne d'en-tête (De / À / Sujet) et, pour la newsletter, le corps rendu.
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: C.t3, lineHeight: 1.7 }}>
              <li>Les templates transactionnels sont rendus par la fonction edge à l'envoi.</li>
              <li>Le sujet peut contenir des variables — elles sont remplacées automatiquement.</li>
              <li>Un envoi échoue sans exception : l'erreur remonte dans l'historique.</li>
            </ul>
          </div>
        )}
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
              <p style={{
                margin: 0, fontSize: 13, color: C.t1,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {m.subject}
              </p>
              <p style={{
                margin: "2px 0 0", fontSize: 11.5, color: C.t3,
                fontVariantNumeric: "tabular-nums",
              }}>
                à {m.to} · par {m.sentBy} · {dateFmt.format(new Date(m.sentAt))}
                {!ok && <> · <span style={{ color: "#dda0a0" }}>{m.outcome.error}</span></>}
              </p>
            </div>
            <span style={{
              flexShrink: 0, padding: "3px 9px", borderRadius: 999,
              background: "rgba(255,255,255,0.05)", border: `1px solid ${C.bds}`,
              color: C.t2, fontSize: 10.5,
            }}>
              {m.template}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────── Templates ───────────────────

function TemplatesView() {
  return (
    <div style={card}>
      {TEMPLATES_META.map((t, i) => (
        <div key={t.id} style={{ ...listRowStyle(i === TEMPLATES_META.length - 1), alignItems: "flex-start", gap: 14 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: "rgba(255,255,255,0.05)", border: `1px solid ${C.bds}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.t2,
          }}>
            <LayoutTemplate style={{ width: 13, height: 13 }} strokeWidth={1.7} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ margin: 0, fontSize: 13, color: C.t1 }}>{t.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11.5, color: C.t3, lineHeight: 1.5 }}>
              {t.description}
            </p>
            {t.vars.length > 0 && (
              <p style={{ margin: "6px 0 0", fontSize: 10.5, color: C.t3, fontVariantNumeric: "tabular-nums" }}>
                Variables : {t.vars.map((v) => v.key).join(" · ")}
              </p>
            )}
          </div>
          <span style={{
            flexShrink: 0, padding: "3px 9px", borderRadius: 999,
            background: "rgba(255,255,255,0.05)", border: `1px solid ${C.bds}`,
            color: C.t2, fontSize: 10.5, fontFamily: FONT,
          }}>
            {t.id}
          </span>
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
          <p style={{ fontSize: 14, color: C.t1, margin: 0 }}>
            Réception d'e-mails — à activer
          </p>
          <p style={{ fontSize: 12.5, color: C.t3, margin: "8px 0 0", lineHeight: 1.6 }}>
            Pour recevoir les réponses des clients directement dans ce panneau
            et pouvoir y répondre en un clic, il faut activer <strong style={{ color: C.t2 }}>Resend Inbound</strong>{" "}
            (route <code style={{ background: C.l3, padding: "1px 5px", borderRadius: 4 }}>replies@ooble.ca</code>)
            et brancher un webhook <code style={{ background: C.l3, padding: "1px 5px", borderRadius: 4 }}>mail-webhook</code>{" "}
            qui insère les messages entrants dans une table <code style={{ background: C.l3, padding: "1px 5px", borderRadius: 4 }}>mail_messages</code>.
          </p>
          <p style={{ fontSize: 12.5, color: C.t3, margin: "10px 0 0", lineHeight: 1.6 }}>
            L'UI de conversation est prête à être branchée : le composer ci-dessus
            envoie déjà via Resend, il ne restera qu'à afficher les threads.
          </p>
          <ol style={{ margin: "12px 0 0", paddingLeft: 18, fontSize: 12, color: C.t3, lineHeight: 1.7 }}>
            <li>Activer Resend Inbound + créer la route sur <code>replies@ooble.ca</code>.</li>
            <li>Déployer une edge function <code>mail-webhook</code> qui parse les événements Resend et insère dans <code>mail_messages</code>.</li>
            <li>Ajouter la migration <code>mail_threads</code> + <code>mail_messages</code>.</li>
            <li>Débloquer cette vue avec la liste des threads et la vue conversation.</li>
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

  useEffect(() => { setSent(loadSent()); }, []);
  const refreshSent = () => setSent(loadSent());

  const successfulSent = useMemo(() => sent.filter((m) => m.outcome.ok).length, [sent]);
  const failedSent = sent.length - successfulSent;
  const templatesCount = TEMPLATES_META.length;

  const TABS = [
    { id: "compose",    label: "Composer",   count: undefined as number | undefined },
    { id: "sent",       label: "Envoyés",    count: sent.length || undefined },
    { id: "templates",  label: "Templates",  count: templatesCount },
    { id: "inbox",      label: "Réception",  count: undefined },
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
            { label: "Échecs", value: failedSent },
            { label: "Templates", value: templatesCount },
          ]}
          actions={[
            {
              label: "Nouveau message",
              icon: Send,
              primary: true,
              onClick: () => setTab("compose"),
            },
          ]}
        />
      </div>

      <SubTabs tabs={TABS} active={tab} onChange={(id) => setTab(id as SubTab)} />

      {tab === "compose"   && <ComposeView onSent={refreshSent} />}
      {tab === "sent"      && <SentView sent={sent} />}
      {tab === "templates" && <TemplatesView />}
      {tab === "inbox"     && <InboxView />}
    </div>
  );
};

export default MailboxPanel;
