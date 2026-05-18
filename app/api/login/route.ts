import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyPassword } from '@/lib/hash'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'חסרים פרטים' }, { status: 400 })
    }

    const norm = String(email).toLowerCase().trim()
    const rows = await sql`SELECT password_hash, status FROM users WHERE email = ${norm}`

    if (rows.length === 0 || !verifyPassword(password, rows[0].password_hash)) {
      return NextResponse.json({ success: false, error: 'אימייל או סיסמה שגויים' })
    }

    if (rows[0].status === 'pending') {
      return NextResponse.json({
        success: false,
        error: 'התשלום עדיין לא אומת. אם השלמת את הרכישה, נסו שוב בעוד רגע.',
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('login error', err)
    return NextResponse.json({ success: false, error: 'שגיאת שרת' }, { status: 500 })
  }
}
