const CURRENT_USER_KEY = 'cp_current_user'

async function authRequest(
  path: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (!data.success) {
      return { success: false, error: data.error ?? 'אירעה שגיאה' }
    }

    localStorage.setItem(CURRENT_USER_KEY, email.toLowerCase().trim())
    return { success: true }
  } catch {
    return { success: false, error: 'שגיאת חיבור לשרת' }
  }
}

export function login(email: string, password: string) {
  return authRequest('/api/login', email, password)
}

export function register(email: string, password: string) {
  return authRequest('/api/register', email, password)
}

export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!data.success) {
      return { success: false, error: data.error ?? 'אירעה שגיאה' }
    }
    return { success: true }
  } catch {
    return { success: false, error: 'שגיאת חיבור לשרת' }
  }
}

export async function resetPassword(
  token: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    if (!data.success) {
      return { success: false, error: data.error ?? 'אירעה שגיאה' }
    }
    return { success: true }
  } catch {
    return { success: false, error: 'שגיאת חיבור לשרת' }
  }
}

export async function changePassword(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!data.success) {
      return { success: false, error: data.error ?? 'אירעה שגיאה' }
    }
    return { success: true }
  } catch {
    return { success: false, error: 'שגיאת חיבור לשרת' }
  }
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getCurrentUser(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CURRENT_USER_KEY)
}
