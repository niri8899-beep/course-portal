const USERS_KEY = 'cp_users'
const CURRENT_USER_KEY = 'cp_current_user'
const DEFAULT_PASSWORD = '12345'

interface StoredUser {
  email: string
  password: string
  passwordChanged: boolean
}

function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as StoredUser[]
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function login(
  email: string,
  password: string
): { success: boolean; needsPasswordChange: boolean; error?: string } {
  const users = getUsers()
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase())

  if (!existing) {
    if (password !== DEFAULT_PASSWORD) {
      return { success: false, needsPasswordChange: false, error: 'אימייל או סיסמה שגויים' }
    }
    users.push({ email, password: DEFAULT_PASSWORD, passwordChanged: false })
    saveUsers(users)
    localStorage.setItem(CURRENT_USER_KEY, email)
    return { success: true, needsPasswordChange: true }
  }

  if (existing.password !== password) {
    return { success: false, needsPasswordChange: false, error: 'אימייל או סיסמה שגויים' }
  }

  localStorage.setItem(CURRENT_USER_KEY, email)
  return { success: true, needsPasswordChange: !existing.passwordChanged }
}

export function changePassword(newPassword: string): boolean {
  const email = getCurrentUser()
  if (!email) return false
  const users = getUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return false
  user.password = newPassword
  user.passwordChanged = true
  saveUsers(users)
  return true
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getCurrentUser(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CURRENT_USER_KEY)
}
