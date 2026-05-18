import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { hashPassword } from '@/lib/hash'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'חסרים פרטים' }, { status: 400 })
    }
    if (String(password).length < 6) {
      return NextResponse.json({ success: false, error: 'הסיסמה חייבת להכיל לפחות 6 תווים' }, { status: 400 })
    }

    const norm = String(email).toLowerCase().trim()
    const rows = await sql`SELECT email FROM users WHERE email = ${norm}`
    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'המשתמש לא נמצא' }, { status: 404 })
    }

    await sql`
      UPDATE users
      SET password_hash = ${hashPassword(password)}, password_changed = TRUE
      WHERE email = ${norm}
    `
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('change-password error', err)
    return NextResponse.json({ success: false, error: 'שגיאת שרת' }, { status: 500 })
  }
}
