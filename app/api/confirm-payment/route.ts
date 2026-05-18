import { NextRequest, NextResponse } from 'next/server'
import { verifyAndActivate } from '@/lib/cardcom'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Called by the payment-success page so account activation does not depend on
// the webhook's timing. Shares the same idempotent logic as the webhook.
export async function POST(req: NextRequest) {
  try {
    const { lowProfileId } = await req.json()
    if (!lowProfileId) {
      return NextResponse.json({ success: false, error: 'חסר מזהה תשלום' }, { status: 400 })
    }

    const result = await verifyAndActivate(String(lowProfileId))
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error })
    }

    return NextResponse.json({ success: true, email: result.email })
  } catch (err) {
    console.error('confirm-payment error', err)
    return NextResponse.json({ success: false, error: 'שגיאת שרת' }, { status: 500 })
  }
}
