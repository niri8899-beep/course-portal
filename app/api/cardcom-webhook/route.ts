import { NextRequest, NextResponse } from 'next/server'
import { verifyAndActivate } from '@/lib/cardcom'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Cardcom calls this URL after a payment page is completed. The payload is
// not trusted directly — verifyAndActivate re-checks the result with Cardcom.
export async function POST(req: NextRequest) {
  try {
    let lowProfileId: string | undefined

    const contentType = req.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body = await req.json()
      lowProfileId = body?.LowProfileId ?? body?.lowProfileId
    } else {
      const form = await req.formData()
      lowProfileId =
        (form.get('LowProfileId') as string) ||
        (form.get('lowprofileid') as string) ||
        (form.get('lowprofilecode') as string) ||
        undefined
    }

    if (!lowProfileId) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    await verifyAndActivate(lowProfileId)

    // Always 200 so Cardcom does not keep retrying.
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('cardcom-webhook error', err)
    return NextResponse.json({ ok: true })
  }
}
