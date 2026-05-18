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

    const norm = String(email).toLowerCase().trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm)) {
      return NextResponse.json({ success: false, error: 'כתובת אימייל לא תקינה' }, { status: 400 })
    }
    if (String(password).length < 6) {
      return NextResponse.json({ success: false, error: 'הסיסמה חייבת להכיל לפחות 6 תווים' }, { status: 400 })
    }

    const existing = await sql`SELECT email FROM users WHERE email = ${norm}`
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'כתובת האימייל כבר רשומה' }, { status: 409 })
    }

    // Accounts are created only through a paid purchase (see /api/checkout).
    // This endpoint will not create a free account without a paid purchase.
    const paid = await sql`
      SELECT 1 FROM purchases WHERE email = ${norm} AND status = 'paid' LIMIT 1
    `
    if (paid.length === 0) {
      return NextResponse.json(
        { success: false, error: 'יש לרכוש את הקורס כדי לפתוח חשבון' },
        { status: 403 }
      )
    }

    await sql`
      INSERT INTO users (email, password_hash, password_changed, status)
      VALUES (${norm}, ${hashPassword(password)}, TRUE, 'active')
    `

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('register error', err)
    return NextResponse.json({ success: false, error: 'שגיאת שרת' }, { status: 500 })
  }
}
