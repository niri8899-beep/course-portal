import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { hashPassword } from '@/lib/hash'
import { hashToken } from '@/lib/token'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) {
      return NextResponse.json({ success: false, error: 'חסרים פרטים' }, { status: 400 })
    }
    if (String(password).length < 6) {
      return NextResponse.json(
        { success: false, error: 'הסיסמה חייבת להכיל לפחות 6 תווים' },
        { status: 400 }
      )
    }

    const tokenHash = hashToken(String(token))
    const rows = await sql`
      SELECT email, expires_at, used FROM password_resets WHERE token_hash = ${tokenHash}
    `
    const reset = rows[0]
    if (!reset || reset.used || new Date(reset.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'הקישור אינו תקין או שפג תוקפו' },
        { status: 400 }
      )
    }

    await sql`
      UPDATE users SET password_hash = ${hashPassword(password)} WHERE email = ${reset.email}
    `
    await sql`
      UPDATE password_resets SET used = true WHERE email = ${reset.email} AND used = false
    `

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('reset-password error', err)
    return NextResponse.json({ success: false, error: 'שגיאת שרת' }, { status: 500 })
  }
}
