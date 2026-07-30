const F = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const M = "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace";

const cta = (href: string, label: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:28px 0 4px;">` +
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>` +
  `<td align="center" style="background:#14201f;border-radius:12px;">` +
  `<a href="${href}" target="_blank" style="display:inline-block;padding:14px 34px;font-family:${F};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">` +
  `${label}</a></td></tr></table></td></tr></table>`;

const row = (label: string, value: string, mono = false) =>
  `<tr>` +
  `<td style="padding:10px 0;border-bottom:1px solid #f0f2f2;font-family:${F};font-size:13px;color:#8a97a0;vertical-align:top;">${label}</td>` +
  `<td style="padding:10px 0;border-bottom:1px solid #f0f2f2;font-family:${mono ? M : F};font-size:${mono ? "12.5px" : "14px"};font-weight:600;color:#14201f;text-align:right;vertical-align:top;word-break:break-all;">${value}</td>` +
  `</tr>`;

const rows = (pairs: [string, string, boolean?][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 4px;">` +
  pairs.map(([l, v, m]) => row(l, v, !!m)).join("") +
  `</table>`;

const warn = (text: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFF9EC;border:1px solid #F3E2B8;border-radius:12px;margin:16px 0 0;">` +
  `<tr><td style="padding:12px 16px;font-family:${F};font-size:12.5px;line-height:1.55;color:#7a5c15;">${text}</td></tr></table>`;

function wrap(preheader: string, title: string, content: string, unsub = false): string {
  return `<!doctype html>
<html lang="fr"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light only"/><meta name="x-apple-disable-message-reformatting"/>
<title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f6f6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#f4f6f6;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6f6;">
<tr><td align="center" style="padding:0;">

<!-- Bande sombre -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0F3A43;">
<tr><td align="center" style="padding:32px 14px 48px;">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:100%;">
  <tr><td style="font-family:${F};font-size:24px;font-weight:800;letter-spacing:-.03em;color:#ffffff;">
    ooble<span style="color:#2FA39B;">.</span>
  </td></tr></table>
</td></tr></table>

<!-- Carte -->
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:100%;margin-top:-28px;">
<tr><td style="background:#ffffff;border-radius:20px;padding:32px 34px 36px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
  ${content}
</td></tr></table>

<!-- Pied -->
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:100%;">
<tr><td style="padding:24px 14px 36px;text-align:center;">
  <p style="margin:0;font-family:${F};font-size:12px;line-height:1.6;color:#8a97a0;">
    Ooble · Achat &amp; vente d'USDT en dollars canadiens<br/>
    Paiement par Interac e-Transfer · Plateforme non-custodial
  </p>${unsub ? `
  <p style="margin:10px 0 0;font-family:${F};font-size:12px;color:#8a97a0;">
    <a href="{{unsubscribeUrl}}" style="color:#8a97a0;text-decoration:underline;">Se désabonner</a>
  </p>` : ""}
  <p style="margin:10px 0 0;font-family:${F};font-size:11px;color:#b0b8bc;">© {{year}} Ooble Technologies Inc.</p>
</td></tr></table>

</td></tr></table>
</body></html>`;
}

const eyebrow = (text: string) =>
  `<p style="margin:0 0 8px;font-family:${F};font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#2FA39B;">${text}</p>`;

const h1 = (text: string) =>
  `<h1 style="margin:0 0 14px;font-family:${F};font-size:22px;line-height:1.3;font-weight:800;letter-spacing:-.02em;color:#14201f;">${text}</h1>`;

const p = (text: string) =>
  `<p style="margin:0 0 0;font-family:${F};font-size:14.5px;line-height:1.65;color:#475467;">${text}</p>`;

export const TEMPLATES: Record<string, string> = {
  welcome: wrap(
    "Votre compte Ooble est prêt.",
    "Bienvenue sur Ooble",
    eyebrow("Bienvenue") +
    h1("Bienvenue sur Ooble, {{firstName}}") +
    p("Votre compte est créé. Achetez et vendez de l'USDT en dollars canadiens, réglé par Interac e-Transfer — de façon simple, rapide et non-custodial.") +
    rows([
      ["USDT uniquement", "6 réseaux au choix"],
      ["Paiement", "Interac e-Transfer"],
      ["Modèle", "Non-custodial"],
    ]) +
    cta("{{verifyUrl}}", "Vérifier mon adresse"),
  ),

  "order-buy": wrap(
    "Réglez {{cadAmount}} CAD par Interac pour recevoir {{usdtAmount}} USDT.",
    "Payez par Interac pour recevoir vos USDT",
    eyebrow("Ordre d'achat") +
    h1("Payez par Interac pour recevoir vos USDT") +
    p("Envoyez un virement Interac e-Transfer avec les informations ci-dessous. Dès réception, nous envoyons vos USDT à votre adresse.") +
    rows([
      ["Référence", "{{ref}}", true],
      ["Montant à payer", "{{cadAmount}} CAD"],
      ["Vous recevrez", "{{usdtAmount}} USDT"],
      ["Réseau", "{{network}}"],
      ["Destinataire Interac", "{{interacRecipient}}", true],
    ]) +
    warn("Indiquez la référence <strong>{{ref}}</strong> dans le message de votre e-Transfer. Le taux est garanti 15 minutes.") +
    cta("{{orderUrl}}", "Voir ma commande"),
  ),

  "order-sell": wrap(
    "Envoyez {{usdtAmount}} USDT pour recevoir {{cadAmount}} CAD par Interac.",
    "Envoyez vos USDT pour recevoir vos dollars",
    eyebrow("Ordre de vente") +
    h1("Envoyez vos USDT pour recevoir vos dollars") +
    p("Transférez vos USDT à l'adresse ci-dessous. Dès confirmation sur la blockchain, vous recevez vos CAD par Interac e-Transfer.") +
    rows([
      ["Référence", "{{ref}}", true],
      ["Vous envoyez", "{{usdtAmount}} USDT"],
      ["Vous recevrez", "{{cadAmount}} CAD"],
      ["Réseau", "{{network}}"],
      ["Adresse de dépôt", "{{depositAddress}}", true],
    ]) +
    warn("Envoyez uniquement de l'USDT sur le réseau <strong>{{network}}</strong>. Un autre réseau entraînerait la perte des fonds.") +
    cta("{{orderUrl}}", "Voir ma commande"),
  ),

  "payment-received": wrap(
    "Paiement de {{amount}} confirmé — traitement en cours.",
    "Paiement reçu",
    eyebrow("Paiement reçu") +
    h1("Nous avons bien reçu votre paiement") +
    p("Votre paiement est confirmé. Notre équipe traite votre commande — vous recevrez vos USDT très bientôt.") +
    rows([
      ["Référence", "{{ref}}", true],
      ["Montant reçu", "{{amount}}"],
      ["Vous recevrez", "{{usdtAmount}} USDT"],
      ["Statut", "En traitement"],
    ]) +
    cta("{{orderUrl}}", "Suivre ma commande"),
  ),

  "order-completed": wrap(
    "Transaction {{ref}} terminée avec succès.",
    "Transaction terminée",
    eyebrow("Terminé") +
    h1("Votre transaction est terminée") +
    p("C'est réglé — voici le récapitulatif de votre transaction.") +
    rows([
      ["Référence", "{{ref}}", true],
      ["{{summaryLabel}}", "{{summaryValue}}"],
      ["Réseau", "{{network}}"],
      ["Hash de transaction", "{{txHash}}", true],
    ]) +
    cta("{{orderUrl}}", "Voir le reçu"),
  ),

  newsletter: wrap(
    "{{bodyIntro}}",
    "{{headline}}",
    eyebrow("{{eyebrow}}") +
    h1("{{headline}}") +
    p("{{bodyIntro}}") +
    `<div style="margin:16px 0 0;font-family:${F};font-size:14.5px;line-height:1.65;color:#475467;">{{bodyHtml}}</div>` +
    cta("{{ctaUrl}}", "{{ctaLabel}}"),
    true,
  ),
};

export const SUBJECTS: Record<string, string> = {
  welcome: "Bienvenue sur Ooble",
  "order-buy": "Votre ordre d'achat Ooble ({{ref}})",
  "order-sell": "Votre ordre de vente Ooble ({{ref}})",
  "payment-received": "Paiement reçu — on traite votre commande ({{ref}})",
  "order-completed": "Transaction terminée ({{ref}})",
  newsletter: "{{subjectLine}}",
};
