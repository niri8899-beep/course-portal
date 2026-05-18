import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { generateResetToken } from '@/lib/token'
import { sendPasswordResetEmail } from '@/lib/resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TOKEN_TTL_MINUTES = 60

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ success: false, error: 'חסרים פרטים' }, { status: 400 })
    }

    const norm = String(email).toLowerCase().trim()
    const users = await sql`SELECT email FROM users WHERE email = ${norm}`

    if (users.length > 0) {
      const { token, tokenHash } = generateResetToken()
      const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000)

      await sql`
        INSERT INTO password_resets (token_hash, email, expires_at)
        VALUES (${tokenHash}, ${norm}, ${expiresAt.toISOString()})
      `

      const resetUrl = `${req.nextUrl.origin}/reset-password?token=${token}`
      try {
        await sendPasswordResetEmail(norm, resetUrl)
      } catch (mailErr) {
        // Don't reveal account existence or mail-config issues to the caller.
        console.error('forgot-password email send failed', mailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('forgot-password error', err)
    return NextResponse.json({ success: false, error: 'שגיאת שרת' }, { status: 500 })
  }
}
