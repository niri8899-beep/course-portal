import { sql } from '@/lib/db'

const CARDCOM_API = 'https://secure.cardcom.solutions/api/v11'

export const COURSE_PRICE = 79
export const COURSE_NAME = 'קורס דיגיטלי - אנגלית בקלות'

function terminal(): number {
  const t = process.env.CARDCOM_TERMINAL
  if (!t) throw new Error('CARDCOM_TERMINAL is not set')
  return Number(t)
}

function apiName(): string {
  const n = process.env.CARDCOM_API_NAME
  if (!n) throw new Error('CARDCOM_API_NAME is not set')
  return n
}

// Base URL of the portal, used to build redirect / webhook URLs that
// Cardcom calls. Falls back to the request origin when the env var is unset.
export function portalBaseUrl(reqOrigin?: string): string {
  return (
    process.env.PORTAL_BASE_URL ??
    reqOrigin ??
    'https://course-portal-iota.vercel.app'
  ).replace(/\/$/, '')
}

type CreatePageArgs = {
  email: string
  baseUrl: string
}

type CreatePageResult =
  | { ok: true; lowProfileId: string; url: string }
  | { ok: false; error: string }

// Creates a Cardcom hosted payment page (Low Profile) for the course.
// Charges the card and issues a tax invoice/receipt emailed to the customer.
export async function createPaymentPage(
  args: CreatePageArgs
): Promise<CreatePageResult> {
  const { email, baseUrl } = args

  const payload = {
    TerminalNumber: terminal(),
    ApiName: apiName(),
    Amount: COURSE_PRICE,
    Operation: 'ChargeAndCreateDocument',
    ProductName: COURSE_NAME,
    ReturnValue: email,
    Language: 'he',
    ISOCoinId: 1,
    SuccessRedirectUrl: `${baseUrl}/payment-success`,
    FailedRedirectUrl: `${baseUrl}/purchase?failed=1&email=${encodeURIComponent(email)}`,
    WebHookUrl: `${baseUrl}/api/cardcom-webhook`,
    Document: {
      Name: email,
      Email: email,
      IsSendByEmail: true,
      Products: [
        {
          Description: COURSE_NAME,
          UnitCost: COURSE_PRICE,
          Quantity: 1,
        },
      ],
    },
  }

  let data: any
  try {
    const res = await fetch(`${CARDCOM_API}/LowProfile/Create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    data = await res.json()
  } catch {
    return { ok: false, error: 'שגיאת תקשורת מול שירות התשלומים' }
  }

  if (data?.ResponseCode !== 0 || !data?.LowProfileId || !data?.Url) {
    return {
      ok: false,
      error: data?.Description || 'יצירת דף התשלום נכשלה',
    }
  }

  return { ok: true, lowProfileId: data.LowProfileId, url: data.Url }
}

// Asks Cardcom for the authoritative result of a payment page. Never trust
// browser-side query params — this is the source of truth.
async function getLpResult(lowProfileId: string): Promise<any | null> {
  try {
    const res = await fetch(`${CARDCOM_API}/LowProfile/GetLpResult`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        TerminalNumber: terminal(),
        ApiName: apiName(),
        LowProfileId: lowProfileId,
      }),
    })
    return await res.json()
  } catch {
    return null
  }
}

type ActivateResult =
  | { ok: true; email: string }
  | { ok: false; error: string }

// Verifies a payment with Cardcom and, if it succeeded, marks the purchase
// paid and activates the buyer's account. Idempotent: safe to call from both
// the webhook and the success page, in any order, any number of times.
export async function verifyAndActivate(
  lowProfileId: string
): Promise<ActivateResult> {
  const rows = await sql`
    SELECT email, status FROM purchases WHERE low_profile_id = ${lowProfileId}
  `
  if (rows.length === 0) {
    return { ok: false, error: 'רכישה לא נמצאה' }
  }
  const email: string = rows[0].email

  if (rows[0].status === 'paid') {
    return { ok: true, email }
  }

  const result = await getLpResult(lowProfileId)
  if (!result || result.ResponseCode !== 0) {
    return { ok: false, error: 'התשלום לא אומת' }
  }

  await sql`
    UPDATE purchases
    SET status = 'paid', paid_at = NOW()
    WHERE low_profile_id = ${lowProfileId}
  `
  await sql`
    UPDATE users SET status = 'active' WHERE email = ${email}
  `

  return { ok: true, email }
}
