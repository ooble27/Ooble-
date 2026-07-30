const F = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const M = "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace";

const cta = (href: string, label: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:24px 0 0;">` +
  `<a href="${href}" target="_blank" class="btn" style="display:inline-block;padding:13px 30px;font-family:${F};font-size:15px;font-weight:700;color:#ffffff;background:#14201f;text-decoration:none;border-radius:10px;">` +
  `${label}</a></td></tr></table>`;

const row = (label: string, value: string, mono = false) =>
  `<tr>` +
  `<td class="rl" style="padding:10px 0;border-bottom:1px solid #edeef0;font-family:${F};font-size:13px;color:#8a97a0;vertical-align:top;">${label}</td>` +
  `<td class="rv" style="padding:10px 0;border-bottom:1px solid #edeef0;font-family:${mono ? M : F};font-size:${mono ? "12.5px" : "14px"};font-weight:600;color:#14201f;text-align:right;vertical-align:top;word-break:break-all;">${value}</td>` +
  `</tr>`;

const rows = (pairs: [string, string, boolean?][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;">` +
  pairs.map(([l, v, m]) => row(l, v, !!m)).join("") +
  `</table>`;

const warn = (text: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="wb" style="background:#FFF9EC;border:1px solid #F3E2B8;border-radius:10px;margin:16px 0 0;">` +
  `<tr><td class="wt" style="padding:12px 16px;font-family:${F};font-size:12.5px;line-height:1.55;color:#7a5c15;">${text}</td></tr></table>`;

const eyebrow = (text: string) =>
  `<p style="margin:0 0 6px;font-family:${F};font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#2FA39B;">${text}</p>`;

const h1 = (text: string) =>
  `<h1 class="hd" style="margin:0 0 12px;font-family:${F};font-size:21px;line-height:1.3;font-weight:800;letter-spacing:-.02em;color:#14201f;">${text}</h1>`;

const p = (text: string) =>
  `<p class="bt" style="margin:0;font-family:${F};font-size:14.5px;line-height:1.65;color:#475467;">${text}</p>`;

function wrap(preheader: string, title: string, content: string, unsub = false): string {
  return `<!doctype html>
<html lang="fr"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light dark"/><meta name="supported-color-schemes" content="light dark"/>
<meta name="x-apple-disable-message-reformatting"/>
<title>${title}</title>
<style>
:root{color-scheme:light dark}
@media(prefers-color-scheme:dark){
.lg{color:#f0f1f2 !important}
.hd{color:#f0f1f2 !important}
.bt{color:#a8adb4 !important}
.rl{color:#7a7f86 !important;border-color:#2e3135 !important}
.rv{color:#e4e6e8 !important;border-color:#2e3135 !important}
.btn{background:#ffffff !important;color:#14201f !important}
.wb{background:#2a2517 !important;border-color:#44391a !important}
.wt{color:#d4b44a !important}
.ft{color:#5a5f65 !important}
.dv{border-color:#2e3135 !important}
}
</style>
</head>
<body style="margin:0;padding:0;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:100%;">
<tr><td style="padding:32px 20px 0;">
  <p class="lg" style="margin:0;font-family:${F};font-size:22px;font-weight:800;letter-spacing:-.03em;color:#14201f;">ooble<span style="color:#2FA39B;">.</span></p>
</td></tr>
<tr><td style="padding:24px 20px 0;">
  ${content}
</td></tr>
<tr><td style="padding:32px 20px 32px;">
  <hr class="dv" style="border:none;border-top:1px solid #edeef0;margin:0 0 20px;"/>
  <p class="ft" style="margin:0;font-family:${F};font-size:12px;line-height:1.6;color:#8a97a0;">
    Ooble &middot; Achat &amp; vente d'USDT en dollars canadiens<br/>
    Paiement par Interac e-Transfer &middot; Plateforme non-custodial
  </p>${unsub ? `
  <p style="margin:10px 0 0;font-family:${F};font-size:12px;">
    <a href="{{unsubscribeUrl}}" class="ft" style="color:#8a97a0;text-decoration:underline;">Se désabonner</a>
  </p>` : ""}
  <p class="ft" style="margin:10px 0 0;font-family:${F};font-size:11px;color:#b0b8bc;">&copy; {{year}} Ooble Technologies Inc.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

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
    `<div class="bt" style="margin:16px 0 0;font-family:${F};font-size:14.5px;line-height:1.65;color:#475467;">{{bodyHtml}}</div>` +
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
