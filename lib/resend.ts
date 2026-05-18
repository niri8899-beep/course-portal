import { Resend } from 'resend'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'אנגלית בקלות <onboarding@resend.dev>'

function resetEmailHtml(resetUrl: string): string {
  return `
  <div dir="rtl" style="font-family: Arial, 'Segoe UI', sans-serif; background:#f5f0e6; padding:32px;">
    <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:20px; padding:32px; border:1px solid #e8dfc9;">
      <h1 style="color:#3b2f1a; font-size:20px; margin:0 0 8px;">אנגלית בקלות</h1>
      <h2 style="color:#1f2937; font-size:16px; margin:0 0 16px;">איפוס סיסמה</h2>
      <p style="color:#4b5563; font-size:14px; line-height:1.6;">
        קיבלנו בקשה לאיפוס הסיסמה לחשבון שלך. לחצו על הכפתור כדי להגדיר סיסמה חדשה.
        הקישור תקף לשעה אחת.
      </p>
      <a href="${resetUrl}"
         style="display:inline-block; margin:20px 0; background:#b8860b; color:#ffffff;
                text-decoration:none; font-weight:bold; padding:12px 28px; border-radius:12px;">
        איפוס סיסמה
      </a>
      <p style="color:#9ca3af; font-size:12px; line-height:1.6;">
        אם לא ביקשתם לאפס את הסיסמה, אפשר להתעלם מהודעה זו.
      </p>
    </div>
  </div>`
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'איפוס סיסמה - אנגלית בקלות',
    html: resetEmailHtml(resetUrl),
  })

  if (error) {
    throw new Error(error.message)
  }
}
