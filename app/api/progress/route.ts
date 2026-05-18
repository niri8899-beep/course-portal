import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email')
    if (!email) return NextResponse.json({ completed: [] })

    const norm = email.toLowerCase().trim()
    const rows = await sql`SELECT lesson_key FROM progress WHERE email = ${norm}`
    return NextResponse.json({ completed: rows.map(r => r.lesson_key) })
  } catch (err) {
    console.error('progress GET error', err)
    return NextResponse.json({ completed: [] }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, moduleId, lessonId } = await req.json()
    if (!email || moduleId == null || lessonId == null) {
      return NextResponse.json({ ok: false, error: 'חסרים פרטים' }, { status: 400 })
    }

    const norm = String(email).toLowerCase().trim()
    const key = `${moduleId}_${lessonId}`
    await sql`
      INSERT INTO progress (email, lesson_key) VALUES (${norm}, ${key})
      ON CONFLICT (email, lesson_key) DO NOTHING
    `
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('progress POST error', err)
    return NextResponse.json({ ok: false, error: 'שגיאת שרת' }, { status: 500 })
  }
}
