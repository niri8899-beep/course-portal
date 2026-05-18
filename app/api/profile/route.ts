import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email')
    if (!email) {
      return NextResponse.json({ error: 'חסר אימייל' }, { status: 400 })
    }

    const norm = email.toLowerCase().trim()
    const users = await sql`SELECT email, password_changed, created_at FROM users WHERE email = ${norm}`
    if (users.length === 0) {
      return NextResponse.json({ error: 'המשתמש לא נמצא' }, { status: 404 })
    }

    const progress = await sql`
      SELECT lesson_key, completed_at FROM progress
      WHERE email = ${norm}
      ORDER BY completed_at DESC
    `

    return NextResponse.json({
      email: users[0].email,
      passwordChanged: users[0].password_changed,
      createdAt: users[0].created_at,
      completedCount: progress.length,
      lastActivity: progress[0]?.completed_at ?? null,
    })
  } catch (err) {
    console.error('profile GET error', err)
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 })
  }
}
