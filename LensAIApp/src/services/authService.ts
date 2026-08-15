import type { User } from '../types'

const STORAGE_KEY = 'lensai-auth-user'

const mockUser: User = {
  id: 'user-123',
  name: 'User',
  email: 'user@lensaai.com',
}

const readStoredUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as User
    return parsed && parsed.email ? parsed : null
  } catch {
    return null
  }
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim()

    if (!normalizedEmail || !password.trim()) {
      throw new Error('Email and password are required.')
    }

    const user: User = {
      ...mockUser,
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0] || 'User',
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    }

    return user
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  },

  isAuthenticated(): boolean {
    return Boolean(authService.getCurrentUser())
  },

  getCurrentUser(): User | null {
    return readStoredUser()
  },
}
