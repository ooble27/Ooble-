// Layout Ooble pour les e-mails « custom » écrits depuis le back-office.
//
// Sobre, monochrome, lisible sur tous les clients mail. Header : « Ooble » en
// lettres, pas d'image (moins d'échec de rendu). Corps : blanc, typographie
// système. Footer discret avec mention légale + lien contact.
//
// Volontairement minimal : aucun gradient, aucune couleur d'accent, un seul
// filet de séparation. Aligné sur le vocabulaire visuel du site.

interface WrapArgs {
  bodyHtml: string;
  assetBase: string;
}

/**
 * Enveloppe le corps HTML produit par le back-office dans le layout Ooble.
 * `bodyHtml` est inséré tel quel — le staff est déjà responsable de son
 * contenu (le composer côté admin filtre les balises non permises).
 */
export function wrapCustomBody({ bodyHtml, assetBase: _ }: WrapArgs): string {
  const year = new Date().getFullYear();
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Ooble</title>
<style>
  body { margin: 0; background: #f6f6f4; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #111; line-height: 1.55; }
  a { color: #111; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 2px; }
  .wrap { max-width: 560px; margin: 0 auto; padding: 32px 20px 40px; }
  .card { background: #ffffff; border-radius: 14px; box-shadow: 0 1px 0 rgba(0,0,0,0.02), 0 12px 32px -12px rgba(20,20,20,0.08); overflow: hidden; }
  .head { padding: 22px 28px 16px; }
  .brand { font-size: 15px; letter-spacing: 0.14em; text-transform: uppercase; color: #111; font-weight: 500; }
  .body { padding: 4px 28px 28px; font-size: 15px; color: #1a1a1a; }
  .body p { margin: 0 0 14px; }
  .body p:last-child { margin-bottom: 0; }
  .body h1, .body h2, .body h3 { font-weight: 500; letter-spacing: -0.01em; margin: 22px 0 10px; }
  .body h1 { font-size: 20px; }
  .body h2 { font-size: 17px; }
  .body h3 { font-size: 15px; }
  .body ul, .body ol { margin: 0 0 14px; padding-left: 20px; }
  .body li { margin: 3px 0; }
  .body blockquote { margin: 12px 0; padding: 4px 14px; border-left: 2px solid #d0d0cc; color: #555; }
  .body code { background: #f0f0ed; padding: 1px 5px; border-radius: 4px; font-size: 13.5px; }
  .body hr { border: 0; border-top: 1px solid #ececea; margin: 20px 0; }
  .body .btn { display: inline-block; background: #111; color: #fff !important; padding: 11px 18px; border-radius: 8px; text-decoration: none; font-size: 14px; }
  .foot { padding: 18px 28px 22px; border-top: 1px solid #ececea; color: #7c7c78; font-size: 12px; line-height: 1.55; }
  .foot a { color: #7c7c78; }
  .sig { padding: 18px 28px 4px; color: #333; font-size: 14.5px; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <span class="brand">Ooble</span>
      </div>
      <div class="body">
        ${bodyHtml}
      </div>
      <div class="foot">
        Ooble Technologies — Canada · ${year}<br />
        Vous recevez cet e-mail parce que vous avez un compte sur Ooble.
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Version texte brut minimaliste dérivée du HTML.
 * Suffit à améliorer l'anti-spam : les gros fournisseurs préfèrent qu'un
 * `text/plain` accompagne le HTML même sommaire.
 */
export function htmlToText(html: string): string {
  return html
    // Bloc-level → saut de ligne
    .replace(/<\/(p|div|h1|h2|h3|li|blockquote)>/gi, "\n")
    // <br> → saut
    .replace(/<br\s*\/?>/gi, "\n")
    // Liens : garder le texte + URL
    .replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "$2 ($1)")
    // Puces
    .replace(/<li[^>]*>/gi, "• ")
    // Retirer toutes les balises restantes
    .replace(/<[^>]+>/g, "")
    // Décoder les entités HTML basiques
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Nettoyer les sauts de ligne multiples
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
