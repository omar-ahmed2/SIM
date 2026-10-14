export type UserRole = 'doctor' | 'nurse' | 'admin' | 'biomed'

export interface ClinicianUser {
  id: string
  name: string
  email: string
  role: string
  department: string
  licenseNumber?: string
  hospitalName: string
  rememberWorkstation?: boolean
  createdAt: string
  avatarUrl?: string
}

export interface SignInCredentials {
  email: string
  password: string
  rememberWorkstation: boolean
}

export interface SignUpData {
  fullName: string
  email: string
  licenseNumber: string
  department: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface FormErrors {
  [key: string]: string | undefined
}
