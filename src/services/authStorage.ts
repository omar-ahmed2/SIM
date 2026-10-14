import type { ClinicianUser } from '../types/auth'

const STORAGE_KEY_ACTIVE_USER = 'simai_active_user'
const STORAGE_KEY_REGISTERED = 'simai_registered_clinicians'
const STORAGE_KEY_CREDENTIALS = 'simai_credentials'
const STORAGE_KEY_REMEMBERED = 'simai_remembered_accounts'

/**
 * Standard default demo account for immediate clinical review
 */
export const DEFAULT_DEMO_CLINICIAN: ClinicianUser = {
  id: 'user_demo_01',
  name: 'Dr. Sarah Jenkins, MD',
  email: 'dr.smith@childrenshospital.org',
  role: 'Doctor / Neonatologist',
  department: 'NICU Level III / IV Intensive Care',
  licenseNumber: 'NPI-194820129',
  hospitalName: "Children's Pavilion Hospital",
  createdAt: new Date().toISOString(),
  rememberWorkstation: true,
}

export const authStorage = {
  getActiveUser(): ClinicianUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ACTIVE_USER)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  setActiveUser(user: ClinicianUser): void {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(user))
      // Automatically keep in remembered accounts
      this.addRememberedAccount(user)
    } catch {
      // ignore quota errors
    }
  },

  clearActiveUser(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER)
    } catch {
      // ignore
    }
  },

  getRegisteredUsers(): ClinicianUser[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_REGISTERED)
      const list: ClinicianUser[] = data ? JSON.parse(data) : []
      // Ensure demo account is present
      if (!list.some((u) => u.email.toLowerCase() === DEFAULT_DEMO_CLINICIAN.email.toLowerCase())) {
        return [DEFAULT_DEMO_CLINICIAN, ...list]
      }
      return list
    } catch {
      return [DEFAULT_DEMO_CLINICIAN]
    }
  },

  saveRegisteredUser(user: ClinicianUser, password?: string): void {
    try {
      const users = this.getRegisteredUsers().filter(
        (u) => u.email.toLowerCase() !== user.email.toLowerCase()
      )
      users.push(user)
      localStorage.setItem(STORAGE_KEY_REGISTERED, JSON.stringify(users))

      if (password) {
        this.saveCredentials(user.email, password)
      }
    } catch {
      // ignore
    }
  },

  getCredentials(email: string): string | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CREDENTIALS)
      const map = data ? JSON.parse(data) : {}
      const normEmail = email.trim().toLowerCase()
      if (normEmail === DEFAULT_DEMO_CLINICIAN.email.toLowerCase() && !map[normEmail]) {
        return 'password123'
      }
      return map[normEmail] || null
    } catch {
      return null
    }
  },

  saveCredentials(email: string, password: string): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CREDENTIALS)
      const map = data ? JSON.parse(data) : {}
      map[email.trim().toLowerCase()] = password
      localStorage.setItem(STORAGE_KEY_CREDENTIALS, JSON.stringify(map))
    } catch {
      // ignore
    }
  },

  getRememberedAccounts(): ClinicianUser[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_REMEMBERED)
      const list: ClinicianUser[] = data ? JSON.parse(data) : []
      return list
    } catch {
      return []
    }
  },

  addRememberedAccount(user: ClinicianUser): void {
    try {
      const list = this.getRememberedAccounts().filter(
        (u) => u.email.toLowerCase() !== user.email.toLowerCase()
      )
      // Put most recently used at the top
      list.unshift(user)
      localStorage.setItem(STORAGE_KEY_REMEMBERED, JSON.stringify(list.slice(0, 5)))
    } catch {
      // ignore
    }
  },

  removeRememberedAccount(email: string): void {
    try {
      const list = this.getRememberedAccounts().filter(
        (u) => u.email.toLowerCase() !== email.toLowerCase()
      )
      localStorage.setItem(STORAGE_KEY_REMEMBERED, JSON.stringify(list))
    } catch {
      // ignore
    }
  },
}
