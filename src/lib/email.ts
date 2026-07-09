interface EmailOptions {
  to: string
  subject: string
  html: string
}

const FROM = process.env.SMTP_FROM || "noreply@congosoldes.cg"
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Congo Soldes"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" style="width:100%;max-width:600px;margin:0 auto;padding:20px">
<tr><td style="text-align:center;padding:20px 0">
<img src="${APP_URL}/logo.png" alt="${APP_NAME}" style="height:40px">
</td></tr>
<tr><td style="background:white;border-radius:12px;padding:30px;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
${content}
</td></tr>
<tr><td style="text-align:center;padding:20px;color:#9ca3af;font-size:12px">
<p>&copy; ${new Date().getFullYear()} ${APP_NAME}. Tous droits réservés.</p>
<p>${APP_URL}</p>
</td></tr>
</table>
</body>
</html>`
}

async function send(options: EmailOptions) {
  // In dev, log to console
  if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
    console.log(`[EMAIL] To: ${options.to} | Subject: ${options.subject}`)
    console.log(`[EMAIL] Body preview: ${options.html.slice(0, 200)}...`)
    return
  }

  // In production, use SMTP
  const nodemailer = await import("nodemailer")
  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: `"${APP_NAME}" <${FROM}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}

export async function sendWelcomeEmail(to: string, firstName: string) {
  await send({
    to,
    subject: `Bienvenue sur ${APP_NAME} !`,
    html: layout(`<h1 style="color:#1f2937;font-size:24px;margin:0 0 15px">Bienvenue ${firstName} !</h1>
<p style="color:#6b7280;line-height:1.6">Merci de vous être inscrit sur ${APP_NAME}, la première plateforme congolaise des promotions et bonnes affaires.</p>
<p style="color:#6b7280;line-height:1.6">Explorez les promotions près de chez vous et économisez sur vos achats quotidiens.</p>
<a href="${APP_URL}/promotions" style="display:inline-block;background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:10px">Découvrir les promotions</a>`),
  })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await send({
    to,
    subject: "Réinitialisation de votre mot de passe",
    html: layout(`<h1 style="color:#1f2937;font-size:24px;margin:0 0 15px">Réinitialisation du mot de passe</h1>
<p style="color:#6b7280;line-height:1.6">Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe.</p>
<a href="${resetUrl}" style="display:inline-block;background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:10px">Réinitialiser mon mot de passe</a>
<p style="color:#9ca3af;font-size:12px;margin-top:20px">Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>`),
  })
}

export async function sendShopApprovedEmail(to: string, shopName: string) {
  await send({
    to,
    subject: `Votre boutique "${shopName}" est approuvée !`,
    html: layout(`<h1 style="color:#1f2937;font-size:24px;margin:0 0 15px">Boutique approuvée !</h1>
<p style="color:#6b7280;line-height:1.6">Félicitations ! Votre boutique <strong>${shopName}</strong> a été approuvée par notre équipe.</p>
<p style="color:#6b7280;line-height:1.6">Vous pouvez dès maintenant publier vos promotions et atteindre des milliers de clients à Brazzaville et dans tout le Congo.</p>
<a href="${APP_URL}/commercant/promotions/nouvelle" style="display:inline-block;background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:10px">Publier une promotion</a>`),
  })
}

export async function sendPromotionApprovedEmail(to: string, promotionTitle: string, promotionUrl: string) {
  await send({
    to,
    subject: `Votre promotion "${promotionTitle}" est en ligne !`,
    html: layout(`<h1 style="color:#1f2937;font-size:24px;margin:0 0 15px">Promotion en ligne !</h1>
<p style="color:#6b7280;line-height:1.6">Votre promotion <strong>${promotionTitle}</strong> a été approuvée et est désormais visible par tous les visiteurs.</p>
<a href="${APP_URL}${promotionUrl}" style="display:inline-block;background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:10px">Voir la promotion</a>`),
  })
}

export async function sendPaymentReceivedEmail(to: string, amount: string, planName: string) {
  await send({
    to,
    subject: "Paiement reçu avec succès",
    html: layout(`<h1 style="color:#1f2937;font-size:24px;margin:0 0 15px">Paiement confirmé</h1>
<p style="color:#6b7280;line-height:1.6">Votre paiement de <strong>${amount} FCFA</strong> pour le plan <strong>${planName}</strong> a été reçu avec succès.</p>
<p style="color:#6b7280;line-height:1.6">Votre abonnement est maintenant actif. Profitez de tous les avantages de votre formule !</p>
<a href="${APP_URL}/commercant/abonnement" style="display:inline-block;background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:10px">Gérer mon abonnement</a>`),
  })
}

export async function sendContactConfirmation(to: string, firstName: string) {
  await send({
    to,
    subject: "Nous avons reçu votre message",
    html: layout(`<h1 style="color:#1f2937;font-size:24px;margin:0 0 15px">Message reçu</h1>
<p style="color:#6b7280;line-height:1.6">Bonjour ${firstName},</p>
<p style="color:#6b7280;line-height:1.6">Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais (24-48h ouvrées).</p>
<p style="color:#6b7280;line-height:1.6">Merci de votre confiance !</p>
<p style="color:#6b7280;line-height:1.6">L'équipe ${APP_NAME}</p>`),
  })
}