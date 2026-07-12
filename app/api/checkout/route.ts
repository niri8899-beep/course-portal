import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { hashPassword } from '@/lib/hash'
import { createPaymentPage, portalBaseUrl } from '@/lib/cardcom'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone } = await req.json()
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

    // An already-active account means the course was already purchased.
    const existing = await sql`SELECT status FROM users WHERE email = ${norm}`
    if (existing.length > 0 && existing[0].status === 'active') {
      return NextResponse.json(
        { success: false, error: 'כבר רכשת את הקורס עם כתובת זו. אפשר להתחבר.' },
        { status: 409 }
      )
    }

    const passwordHash = hashPassword(password)

    // Create the account as 'pending', or refresh the password if the buyer
    // is retrying after an earlier unfinished payment.
    if (existing.length === 0) {
      await sql`
        INSERT INTO users (email, password_hash, password_changed, status)
        VALUES (${norm}, ${passwordHash}, TRUE, 'pending')
      `
    } else {
      await sql`
        UPDATE users
        SET password_hash = ${passwordHash}, password_changed = TRUE
        WHERE email = ${norm}
      `
    }

    const baseUrl = portalBaseUrl(req.nextUrl.origin)
    const page = await createPaymentPage({ email: norm, baseUrl })
    if (!page.ok) {
      return NextResponse.json({ success: false, error: page.error }, { status: 502 })
    }

    await sql`
      INSERT INTO purchases (low_profile_id, email, amount, status, name, phone)
      VALUES (${page.lowProfileId}, ${norm}, 79, 'created', ${name || null}, ${phone || null})
      ON CONFLICT (low_profile_id) DO NOTHING
    `

    return NextResponse.json({ success: true, paymentUrl: page.url })
  } catch (err) {
    console.error('checkout error', err)
    return NextResponse.json({ success: false, error: 'שגיאת שרת' }, { status: 500 })
  }
}
