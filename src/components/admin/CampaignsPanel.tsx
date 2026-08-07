/**
 * Panneau « Campagnes » du back-office.
 *
 * Envoi d'e-mails marketing en masse avec segmentation, 3 designs
 * professionnels prêts à l'emploi, aperçu live desktop/mobile, et
 * historique local des envois avec métriques.
 *
 * Segments : tous les clients, KYC approuvés, KYC en attente, comptes
 * entreprise. Chaque segment est calculé à la volée depuis l'annuaire
 * client (fetchClientDirectory).
 *
 * Designs : announcement (sobre éditorial), promotion (hero coloré),
 * update (newsletter dense). Rendus HTML bulletproof côté client.
 *
 * Envoi : boucle sur les destinataires avec substitution des variables
 * client ({{prenom}}, {{email}}). Un envoi par client, tracé dans
 * localStorage pour l'historique.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Megaphone, Send, Users, Sparkles, Eye, Bold, Italic, Link as LinkIcon,
  List, ListOrdered, Heading2, Quote, Minus, Check, AlertTriangle,
  Loader2, Smartphone, Monitor, ArrowLeft, Building2, ShieldCheck,
  Clock, Mail,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { sendCustomEmail } from "@/lib/email";
import {
  fetchClientDirectory, type ClientDirectoryEntry,
} from "@/lib/adminClient";
import {
  markdownToHtml, wrapSelection, insertAtCursor, prefixLines,
  substituteVars,
} from "@/lib/mailComposer";
import {
  loadCampaigns, saveCampaign, SEGMENT_LABEL, DESIGN_LABEL,
  type CampaignRecord, type CampaignSegment, type CampaignDesign,
} from "@/lib/campaigns";
import { renderCampaign } from "@/lib/campaignDesigns";
import AdminHero from "./AdminHero";
import { SubTabs } from "./AdminBits";
import { C, FONT, card, sH, inputStyle } from "./adminTheme";

type SubTab = "compose" | "history";

const dateFmt = new Intl.DateTimeFormat("fr-CA", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
});

// ─── Filtrage par segment ────────────────────────────────────

function filterBySegment(
  clients: ClientDirectoryEntry[],
  segment: CampaignSegment,
): ClientDirectoryEntry[] {
  switch (segment) {
    case "all":          return clients;
    case "kyc_approved": return clients.filter((c) => c.kycStatus === "approved");
    case "kyc_pending":  return clients.filter((c) => c.kycStatus === "pending" || c.kycStatus === "not_started");
    case "business":     return clients.filter((c) => c.accountType === "business");
    case "manual":       return [];
  }
}

// ─── Panneau principal ───────────────────────────────────────

const CampaignsPanel = () => {
  const [tab, setTab] = useState<SubTab>("compose");
  const [clients, setClients] = useState<ClientDirectoryEntry[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);

  useEffect(() => {
    fetchClientDirectory().then((c) => { setClients(c); setClientsLoading(false); });
    setCampaigns(loadCampaigns());
  }, []);

  const refreshHistory = () => setCampaigns(loadCampaigns());
  const successful = useMemo(
    () => campaigns.reduce((n, c) => n + c.stats.ok, 0),
    [campaigns],
  );

  const TABS = [
    { id: "compose", label: "Composer" },
    { id: "history", label: "Historique", count: campaigns.length || undefined },
  ];

  return (
    <div className="space-y-4">
      <div className="lg:max-w-[620px]">
        <AdminHero
          eyebrow="Campagnes"
          value={campaigns.length}
          unit={campaigns.length > 1 ? "campagnes" : "campagne"}
          stats={[
            { label: "E-mails envoyés", value: successful },
            { label: "Contacts",        value: clientsLoading ? "…" : clients.length },
            { label: "Segments",        value: 4 },
          ]}
          actions={[
            { label: "Nouvelle campagne", icon: Megaphone, primary: true, onClick: () => setTab("compose") },
          ]}
        />
      </div>

      <SubTabs tabs={TABS} active={tab} onChange={(id) => setTab(id as SubTab)} />

      {tab === "compose" && (
        <CampaignComposer
          clients={clients}
          clientsLoading={clientsLoading}
          onSent={() => { refreshHistory(); setTab("history"); }}
        />
      )}
      {tab === "history" && (
        <CampaignHistory campaigns={campaigns} />
      )}
    </div>
  );
};

export default CampaignsPanel;

// ─── Composer de campagne ────────────────────────────────────

interface ComposerProps {
  clients: ClientDirectoryEntry[];
  clientsLoading: boolean;
  onSent: () => void;
}

function CampaignComposer({ clients, clientsLoading, onSent }: ComposerProps) {
  const { session } = useAuth();
  const author = session?.user?.email ?? "staff";

  const [name, setName] = useState("");
  const [segment, setSegment] = useState<CampaignSegment>("kyc_approved");
  const [design, setDesign] = useState<CampaignDesign>("announcement");
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [eyebrow, setEyebrow] = useState("");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [feedback, setFeedback] = useState<null | { kind: "ok" | "err"; text: string }>(null);
  const [confirming, setConfirming] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const recipients = useMemo(
    () => filterBySegment(clients, segment),
    [clients, segment],
  );

  // Aperçu : on prend le premier destinataire pour personnaliser les
  // variables {{prenom}}, {{email}} — s'il n'y en a pas, on affiche
  // avec des placeholders lisibles.
  const previewClient = recipients[0];
  const previewVars = previewClient
    ? { prenom: previewClient.firstName || "Client", email: previewClient.email }
    : { prenom: "Client", email: "client@exemple.ca" };

  const previewHtml = useMemo(() => {
    if (!headline.trim()) return null;
    const bodyText = substituteVars(body || "", previewVars);
    const bodyHtml = markdownToHtml(bodyText);
    return renderCampaign(design, {
      preheader: preheader || subject || "",
      eyebrow: eyebrow || undefined,
      headline: substituteVars(headline, previewVars),
      bodyHtml,
      ctaLabel: ctaLabel || undefined,
      ctaUrl: ctaUrl || undefined,
    });
  }, [design, preheader, subject, eyebrow, headline, body, ctaLabel, ctaUrl, previewVars]);

  const canSend = name.trim().length > 0
    && subject.trim().length > 0
    && headline.trim().length > 0
    && body.trim().length > 0
    && recipients.length > 0
    && segment !== "manual";

  const send = async () => {
    if (!canSend || busy) return;
    setBusy(true);
    setFeedback(null);
    setProgress({ done: 0, total: recipients.length });

    let ok = 0;
    let failed = 0;
    let lastError: string | undefined;

    for (let i = 0; i < recipients.length; i++) {
      const r = recipients[i];
      const vars = { prenom: r.firstName || "Client", email: r.email };
      const subj = substituteVars(subject.trim(), vars);
      const html = renderCampaign(design, {
        preheader: preheader || subject,
        eyebrow: eyebrow || undefined,
        headline: substituteVars(headline, vars),
        bodyHtml: markdownToHtml(substituteVars(body, vars)),
        ctaLabel: ctaLabel || undefined,
        ctaUrl: ctaUrl || undefined,
      });

      const res = await sendCustomEmail({
        to: r.email,
        subject: subj,
        html,
        text: substituteVars(body, vars),
      });
      if (res.error) { failed += 1; lastError = res.error; }
      else ok += 1;
      setProgress({ done: i + 1, total: recipients.length });
    }

    saveCampaign({
      id: crypto.randomUUID(),
      name: name.trim(),
      segment,
      design,
      subject: subject.trim(),
      preheader,
      body,
      sentAt: new Date().toISOString(),
      sentBy: author,
      stats: { total: recipients.length, ok, failed },
    });

    setBusy(false);
    setProgress(null);
    setConfirming(false);
    if (failed === 0) {
      setFeedback({ kind: "ok", text: `Campagne envoyée à ${ok} destinataires.` });
      // Reset des champs après un envoi propre.
      setName(""); setSubject(""); setPreheader(""); setEyebrow("");
      setHeadline(""); setBody(""); setCtaLabel(""); setCtaUrl("");
      onSent();
    } else if (ok === 0) {
      setFeedback({ kind: "err", text: lastError ?? "Échec de tous les envois." });
    } else {
      setFeedback({ kind: "err", text: `${ok} envoyés, ${failed} en échec (${lastError ?? "cause inconnue"}).` });
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

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      {/* ─── Colonne de gauche : formulaire ────────────── */}
      <div style={{ ...card, padding: 0, fontFamily: FONT }}>
        {/* Nom + segment */}
        <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.bds}` }}>
          <Field label="Nom de la campagne (interne)">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Lancement Solana"
              style={{ ...inputStyle, fontSize: 16 }}
            />
          </Field>
          <div style={{ height: 12 }} />
          <Field label="Segment de destinataires">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(["all", "kyc_approved", "kyc_pending", "business"] as CampaignSegment[]).map((s) => {
                const active = segment === s;
                const count = filterBySegment(clients, s).length;
                const Icon = s === "kyc_approved" ? ShieldCheck : s === "business" ? Building2 : s === "kyc_pending" ? Clock : Users;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSegment(s)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "8px 12px", borderRadius: 9,
                      background: active ? C.accentSoft : "transparent",
                      border: `1px solid ${active ? C.accentBd : C.bd}`,
                      color: active ? C.t1 : C.t2,
                      fontSize: 12, fontFamily: FONT, cursor: "pointer",
                      transition: "all 0.12s",
                    }}
                  >
                    <Icon style={{ width: 12, height: 12 }} strokeWidth={1.7} />
                    {SEGMENT_LABEL[s]}
                    <span style={{
                      fontSize: 10.5, color: active ? C.t2 : C.t3,
                      background: active ? "rgba(255,255,255,0.05)" : C.l3,
                      padding: "1px 6px", borderRadius: 4,
                    }}>
                      {clientsLoading ? "…" : count}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        {/* Design */}
        <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.bds}` }}>
          <Field label="Style visuel">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {(["announcement", "promotion", "update"] as CampaignDesign[]).map((d) => {
                const active = design === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDesign(d)}
                    style={{
                      padding: "12px 10px", borderRadius: 10,
                      background: active ? C.accentSoft : "transparent",
                      border: `1px solid ${active ? C.accentBd : C.bd}`,
                      color: active ? C.t1 : C.t2,
                      fontSize: 12, fontFamily: FONT, cursor: "pointer",
                      textAlign: "left", transition: "all 0.12s",
                    }}
                  >
                    <DesignPreviewChip design={d} />
                    <div style={{ marginTop: 8, fontWeight: 400 }}>{DESIGN_LABEL[d]}</div>
                    <div style={{ fontSize: 10.5, color: C.t3, marginTop: 2 }}>
                      {d === "announcement" ? "Sobre, éditorial" : d === "promotion" ? "Hero coloré" : "Newsletter dense"}
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        {/* Sujet + preheader */}
        <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.bds}`, display: "grid", gap: 12 }}>
          <Field label="Objet de l'e-mail">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ce que le client voit dans sa boîte"
              style={{ ...inputStyle, fontSize: 16 }}
            />
          </Field>
          <Field label="Preheader">
            <input
              type="text"
              value={preheader}
              onChange={(e) => setPreheader(e.target.value)}
              placeholder="Aperçu court sous l'objet"
              style={{ ...inputStyle, fontSize: 16 }}
            />
          </Field>
        </div>

        {/* Contenu */}
        <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.bds}`, display: "grid", gap: 12 }}>
          <Field label="Eyebrow (petit chapeau)">
            <input
              type="text"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              placeholder="Ex : NOUVEAU · MISE À JOUR · OFFRE"
              style={{ ...inputStyle, fontSize: 16 }}
            />
          </Field>
          <Field label="Titre principal">
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Le message clé de la campagne"
              style={{ ...inputStyle, fontSize: 16, fontWeight: 500 }}
            />
          </Field>
          <div>
            <div style={{ ...sH, marginBottom: 6 }}>Corps du message</div>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 2,
              padding: "6px", marginBottom: 6,
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${C.bd}`, borderRadius: 9,
            }}>
              <ToolbarBtn title="Titre" onClick={withRef((t) => prefixLines(t, "## "))}>
                <Heading2 style={{ width: 13, height: 13 }} strokeWidth={1.7} />
              </ToolbarBtn>
              <ToolbarBtn title="Gras" onClick={withRef((t) => wrapSelection(t, "**"))}>
                <Bold style={{ width: 13, height: 13 }} strokeWidth={2} />
              </ToolbarBtn>
              <ToolbarBtn title="Italique" onClick={withRef((t) => wrapSelection(t, "*"))}>
                <Italic style={{ width: 13, height: 13 }} strokeWidth={1.7} />
              </ToolbarBtn>
              <ToolbarBtn title="Liste" onClick={withRef((t) => prefixLines(t, "- "))}>
                <List style={{ width: 13, height: 13 }} strokeWidth={1.7} />
              </ToolbarBtn>
              <ToolbarBtn title="Liste numérotée" onClick={withRef((t) => prefixLines(t, "1. "))}>
                <ListOrdered style={{ width: 13, height: 13 }} strokeWidth={1.7} />
              </ToolbarBtn>
              <ToolbarBtn title="Citation" onClick={withRef((t) => prefixLines(t, "> "))}>
                <Quote style={{ width: 13, height: 13 }} strokeWidth={1.7} />
              </ToolbarBtn>
              <ToolbarBtn title="Lien" onClick={insertLink}>
                <LinkIcon style={{ width: 13, height: 13 }} strokeWidth={1.7} />
              </ToolbarBtn>
              <ToolbarBtn title="Séparateur" onClick={withRef((t) => insertAtCursor(t, "\n\n---\n\n"))}>
                <Minus style={{ width: 13, height: 13 }} strokeWidth={1.7} />
              </ToolbarBtn>
              <ToolbarBtn title="{{prenom}}" onClick={withRef((t) => insertAtCursor(t, "{{prenom}}"))}>
                <span style={{ fontSize: 10, fontFamily: FONT, padding: "0 3px" }}>{"{{prenom}}"}</span>
              </ToolbarBtn>
            </div>
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Bonjour {{prenom}},&#10;&#10;Écrivez le contenu principal ici. Utilisez la barre d'outils pour la mise en forme."
              rows={8}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${C.bd}`, borderRadius: 9,
                padding: "12px 14px", color: C.t1,
                fontFamily: FONT, fontSize: 16, lineHeight: 1.6,
                outline: "none", resize: "vertical",
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.bds}`, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
            <Field label="Libellé du bouton">
              <input
                type="text"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="Ex : Acheter"
                style={{ ...inputStyle, fontSize: 16 }}
              />
            </Field>
            <Field label="URL du bouton">
              <input
                type="text"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://ooble.ca/…"
                spellCheck={false}
                autoCapitalize="none"
                style={{ ...inputStyle, fontSize: 16 }}
              />
            </Field>
          </div>
        </div>

        {/* Envoi */}
        <div style={{ padding: "16px 18px" }}>
          {feedback && (
            <div style={{
              marginBottom: 12, padding: "10px 14px", borderRadius: 9,
              background: feedback.kind === "ok" ? "rgba(255,255,255,0.05)" : "rgba(200,60,60,0.10)",
              border: `1px solid ${feedback.kind === "ok" ? C.accentBd : "rgba(200,60,60,0.3)"}`,
              color: feedback.kind === "ok" ? C.t1 : "#f2c1c1",
              fontSize: 12.5, display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              {feedback.kind === "ok"
                ? <Check style={{ width: 13, height: 13 }} strokeWidth={2} />
                : <AlertTriangle style={{ width: 13, height: 13 }} strokeWidth={2} />}
              {feedback.text}
            </div>
          )}
          {progress && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: C.t2, marginBottom: 4 }}>
                <span>Envoi en cours…</span>
                <span>{progress.done} / {progress.total}</span>
              </div>
              <div style={{ height: 4, background: C.l3, borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${(progress.done / progress.total) * 100}%`,
                  background: C.accent, transition: "width 0.2s",
                }} />
              </div>
            </div>
          )}

          {confirming ? (
            <div style={{
              padding: "12px 14px", borderRadius: 9,
              background: "rgba(255,255,255,0.03)", border: `1px solid ${C.bd}`,
              display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ fontSize: 12.5, color: C.t1 }}>
                Envoyer <strong>{name || "cette campagne"}</strong> à <strong>{recipients.length} client{recipients.length > 1 ? "s" : ""}</strong> ?
                <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>
                  Un e-mail par destinataire, personnalisé avec son prénom.
                </div>
              </div>
              <div style={{ display: "inline-flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={busy}
                  style={{
                    height: 34, padding: "0 14px", borderRadius: 8, border: `1px solid ${C.bd}`,
                    background: "transparent", color: C.t2,
                    fontSize: 12, fontFamily: FONT, cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={send}
                  disabled={busy}
                  style={{
                    height: 34, padding: "0 16px", borderRadius: 8, border: "none",
                    background: C.accent, color: "#111",
                    fontSize: 12, fontFamily: FONT, cursor: busy ? "default" : "pointer",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}
                >
                  {busy
                    ? <Loader2 style={{ width: 13, height: 13, animation: "spin 1s linear infinite" }} />
                    : <Send style={{ width: 13, height: 13 }} strokeWidth={2} />}
                  Confirmer l'envoi
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              disabled={!canSend}
              style={{
                height: 40, padding: "0 20px", borderRadius: 9, border: "none",
                background: canSend ? C.accent : C.l3,
                color: canSend ? "#111" : C.t3,
                fontSize: 13, fontFamily: FONT,
                display: "inline-flex", alignItems: "center", gap: 7,
                cursor: canSend ? "pointer" : "default", transition: "background 0.15s",
              }}
            >
              <Sparkles style={{ width: 14, height: 14 }} strokeWidth={2} />
              Envoyer à {recipients.length} destinataire{recipients.length > 1 ? "s" : ""}
            </button>
          )}
        </div>
      </div>

      {/* ─── Colonne de droite : preview ──────────────── */}
      <div style={{ ...card, padding: 0, fontFamily: FONT, position: "sticky", top: 16, alignSelf: "start" }}>
        <div style={{
          padding: "12px 18px", borderBottom: `1px solid ${C.bds}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={sH}>
            <Eye style={{ width: 12, height: 12, display: "inline", marginRight: 6, marginBottom: -1 }} />
            Aperçu
          </span>
          <div style={{ display: "inline-flex", gap: 4, padding: 3, background: C.l3, borderRadius: 7 }}>
            {([
              { mode: "desktop" as const, icon: Monitor, label: "Bureau" },
              { mode: "mobile" as const, icon: Smartphone, label: "Mobile" },
            ]).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPreviewMode(mode)}
                title={label}
                style={{
                  height: 24, width: 26, borderRadius: 5, border: "none",
                  background: previewMode === mode ? C.l1 : "transparent",
                  color: previewMode === mode ? C.t1 : C.t3,
                  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.12s",
                }}
              >
                <Icon style={{ width: 12, height: 12 }} strokeWidth={1.7} />
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: 16, background: "#e9e6df", minHeight: 500, maxHeight: 720, overflow: "auto" }}>
          {previewHtml ? (
            <div style={{
              maxWidth: previewMode === "mobile" ? 360 : "100%",
              margin: previewMode === "mobile" ? "0 auto" : "0",
              transition: "max-width 0.2s",
            }}>
              <iframe
                title="Aperçu campagne"
                srcDoc={previewHtml}
                style={{
                  width: "100%", height: 640, border: "none", borderRadius: 12,
                  background: "#fff", boxShadow: "0 12px 32px -12px rgba(20,20,20,0.15)",
                }}
              />
            </div>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 400, color: "#8a97a0", fontSize: 13, fontFamily: FONT,
              textAlign: "center", padding: 20,
            }}>
              <div>
                <Mail style={{ width: 24, height: 24, opacity: 0.4, marginBottom: 8 }} strokeWidth={1.4} />
                <div>Renseignez au minimum un titre pour voir l'aperçu du rendu.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Historique des campagnes ────────────────────────────────

function CampaignHistory({ campaigns }: { campaigns: CampaignRecord[] }) {
  const [selected, setSelected] = useState<CampaignRecord | null>(null);

  if (campaigns.length === 0) {
    return (
      <div style={{ ...card, padding: 40, textAlign: "center", fontFamily: FONT }}>
        <Megaphone style={{ width: 22, height: 22, color: C.t3, opacity: 0.5, margin: "0 auto 8px", display: "block" }} strokeWidth={1.6} />
        <p style={{ fontSize: 12.5, color: C.t3, margin: 0 }}>
          Aucune campagne envoyée pour le moment.
        </p>
      </div>
    );
  }

  if (selected) {
    const bodyHtml = renderCampaign(selected.design, {
      preheader: selected.preheader || selected.subject,
      headline: selected.subject,
      bodyHtml: markdownToHtml(selected.body),
    });
    return (
      <div style={{ ...card, fontFamily: FONT }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.bds}`, display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={() => setSelected(null)}
            style={{
              width: 30, height: 30, borderRadius: 7,
              background: "transparent", border: `1px solid ${C.bds}`,
              color: C.t2, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} strokeWidth={1.7} />
          </button>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: C.t1, fontSize: 13.5, fontWeight: 500 }}>{selected.name}</div>
            <div style={{ color: C.t3, fontSize: 11, marginTop: 2 }}>
              {SEGMENT_LABEL[selected.segment]} · {DESIGN_LABEL[selected.design]} · {dateFmt.format(new Date(selected.sentAt))}
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 18px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, borderBottom: `1px solid ${C.bds}` }}>
          <Metric label="Cible" value={selected.stats.total} />
          <Metric label="Envoyés" value={selected.stats.ok} />
          <Metric label="Échecs" value={selected.stats.failed} />
          <Metric label="Réussite" value={selected.stats.total > 0 ? `${Math.round((selected.stats.ok / selected.stats.total) * 100)}%` : "—"} />
        </div>
        <div style={{ padding: 16, background: "#e9e6df" }}>
          <iframe
            title="Aperçu"
            srcDoc={bodyHtml}
            style={{ width: "100%", height: 600, border: "none", borderRadius: 12, background: "#fff" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={card}>
      {campaigns.map((c, i) => (
        <button
          key={c.id}
          type="button"
          onClick={() => setSelected(c)}
          style={{
            display: "flex", width: "100%", alignItems: "center", gap: 12,
            padding: "14px 18px", textAlign: "left",
            borderBottom: i < campaigns.length - 1 ? `1px solid ${C.bds}` : "none",
            background: "transparent", border: "none", cursor: "pointer",
            fontFamily: FONT, transition: "background 0.12s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: C.l3, border: `1px solid ${C.bds}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.t2,
          }}>
            <Megaphone style={{ width: 14, height: 14 }} strokeWidth={1.7} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, color: C.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {c.name}
            </div>
            <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>
              {SEGMENT_LABEL[c.segment]} · {c.stats.ok}/{c.stats.total} envoyés
            </div>
          </div>
          <div style={{ fontSize: 10.5, color: C.t3, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
            {dateFmt.format(new Date(c.sentAt))}
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Petites briques ─────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ ...sH, marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}

function ToolbarBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        minWidth: 28, height: 28, borderRadius: 6, padding: "0 6px",
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

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div style={{ ...sH, marginBottom: 4 }}>{label}</div>
      <div style={{ color: C.t1, fontSize: 20, fontWeight: 300, letterSpacing: "-0.01em", fontFamily: FONT, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
    </div>
  );
}

// Petite vignette de style dans le sélecteur de design.
function DesignPreviewChip({ design }: { design: CampaignDesign }) {
  const styles: Record<CampaignDesign, React.CSSProperties> = {
    announcement: { background: "#f4f1ea", borderTop: "3px solid #2FA39B" },
    promotion: { background: "linear-gradient(135deg,#0F3A43,#12474F)", borderTop: "3px solid #7FD4C9" },
    update: { background: "#ffffff", borderTop: "3px solid #0F3A43" },
  };
  return (
    <div style={{
      height: 34, borderRadius: 6, ...styles[design],
      border: `1px solid ${C.bds}`, borderTopWidth: 3,
    }} />
  );
}
