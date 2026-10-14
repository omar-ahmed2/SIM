import React, { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import type { ClinicianUser, FormErrors } from '../../types/auth'
import { authStorage } from '../../services/authStorage'

interface SignUpFormProps {
  onSuccess: (registeredEmail: string) => void
  onSwitchToSignIn: () => void
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSuccess,
  onSwitchToSignIn,
}) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [department, setDepartment] = useState('NICU Level III / IV Intensive Care')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Full clinical name and title are required'
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter your full professional title'
    }

    if (!email.trim()) {
      newErrors.email = 'Institutional email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid hospital email address'
    } else {
      // Check if email already registered
      const registeredUsers = authStorage.getRegisteredUsers()
      if (
        registeredUsers.some(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        )
      ) {
        newErrors.email = 'This email is already registered. Please sign in.'
      }
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to HIPAA data governance guidelines'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)

    setTimeout(() => {
      // Create new clinician user object
      const newUser: ClinicianUser = {
        id: `user_${Date.now()}`,
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        role: department.includes('Nursing') ? 'NICU Nurse' : 'Doctor / Neonatologist',
        department,
        licenseNumber: licenseNumber.trim() || 'NPI-Pending',
        hospitalName: 'Children’s Pavilion Hospital',
        createdAt: new Date().toISOString(),
      }

      // Persist user and credentials via authStorage
      authStorage.saveRegisteredUser(newUser, password)
      authStorage.addRememberedAccount(newUser)

      setIsLoading(false)
      onSuccess(newUser.email)
    }, 800)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
      {/* Full Name & Title */}
      <Input
        label="Full Name & Title"
        placeholder="Dr. Sarah Jenkins, MD"
        leftIcon="person"
        value={fullName}
        onChange={(e) => {
          setFullName(e.target.value)
          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }))
        }}
        error={errors.fullName}
        required
      />

      {/* Email & License / NPI in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Hospital Email"
          type="email"
          placeholder="s.jenkins@hospital.org"
          leftIcon="mail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
          }}
          error={errors.email}
          required
        />

        <Input
          label="Medical License / NPI #"
          placeholder="NPI-194820129"
          leftIcon="badge"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          subLabel="Optional"
        />
      </div>

      {/* Password & Confirm Password (2 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          error={errors.password}
          required
          autoComplete="new-password"
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
          }}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />
      </div>

      {/* Terms & HIPAA Checkbox */}
      <div className="flex flex-col gap-1 pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => {
              setAgreeToTerms(e.target.checked)
              if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }))
            }}
            className="w-4 h-4 mt-0.5 rounded text-primary border-outline-variant focus:ring-primary/30 cursor-pointer shrink-0"
          />
          <span className="text-xs text-on-surface-variant font-medium leading-relaxed">
            I agree to the Clinical Data Governance Policy and HIPAA Protected Health Information (PHI)
            compliance guidelines.
          </span>
        </label>
        {errors.terms && (
          <p className="text-xs text-error font-medium flex items-center gap-1 mt-0.5" role="alert">
            <Icon name="error" size={14} />
            <span>{errors.terms}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2 min-h-46px shadow-sm hover:shadow"
        isLoading={isLoading}
        iconRight={isLoading ? undefined : 'verified_user'}
      >
        Create Account &amp; Activate Credentials
      </Button>

      {/* Switch to Sign In Prompt */}
      <p className="text-center text-xs text-on-surface-variant pt-2">
        Already have verified credentials?{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-bold text-primary hover:underline cursor-pointer"
        >
          Sign In here
        </button>
      </p>
    </form>
  )
}
