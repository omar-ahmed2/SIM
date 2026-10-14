import React, { useState, useEffect } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import type { ClinicianUser, FormErrors } from '../../types/auth'
import { authStorage } from '../../services/authStorage'

interface SignInFormProps {
  onSuccess: (user: ClinicianUser) => void
  onSwitchToSignUp: () => void
  prefillEmail?: string
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onSuccess,
  onSwitchToSignUp,
  prefillEmail = '',
}) => {
  const [rememberedAccounts, setRememberedAccounts] = useState<ClinicianUser[]>([])
  const [selectedQuickUser, setSelectedQuickUser] = useState<ClinicianUser | null>(null)
  const [isUsingAnotherAccount, setIsUsingAnotherAccount] = useState(false)

  const [email, setEmail] = useState(prefillEmail)
  const [password, setPassword] = useState('')
  const [rememberWorkstation, setRememberWorkstation] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [accountNotFound, setAccountNotFound] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load remembered accounts on mount
  useEffect(() => {
    const accounts = authStorage.getRememberedAccounts()
    setRememberedAccounts(accounts)

    // If prefillEmail is given, select that account if remembered or default to manual form
    if (prefillEmail) {
      setEmail(prefillEmail)
      setIsUsingAnotherAccount(true)
    } else if (accounts.length > 0) {
      setSelectedQuickUser(accounts[0])
      setEmail(accounts[0].email)
    }
  }, [prefillEmail])

  // Validate form inputs
  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    setGeneralError(null)
    setAccountNotFound(false)

    const targetEmail = selectedQuickUser && !isUsingAnotherAccount ? selectedQuickUser.email : email

    if (!targetEmail.trim()) {
      newErrors.email = 'Institutional email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail.trim())) {
      newErrors.email = 'Please enter a valid hospital email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)

    setTimeout(() => {
      const targetEmail =
        selectedQuickUser && !isUsingAnotherAccount
          ? selectedQuickUser.email.trim().toLowerCase()
          : email.trim().toLowerCase()

      const registeredUsers = authStorage.getRegisteredUsers()
      const matchedUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === targetEmail
      )

      if (!matchedUser) {
        setIsLoading(false)
        setAccountNotFound(true)
        setGeneralError(
          `No medical account found with email "${targetEmail}". Please verify your credentials or create a new clinician account.`
        )
        return
      }

      // Check password
      const storedPassword = authStorage.getCredentials(targetEmail) || 'password123'
      if (password !== storedPassword) {
        setIsLoading(false)
        setErrors((prev) => ({
          ...prev,
          password: 'Incorrect password. Please verify or use password reset.',
        }))
        return
      }

      // Authentication Successful!
      const activeUser: ClinicianUser = {
        ...matchedUser,
        rememberWorkstation,
      }

      authStorage.setActiveUser(activeUser)
      setIsLoading(false)
      onSuccess(activeUser)
    }, 600)
  }

  const handleSelectQuickAccount = (acc: ClinicianUser) => {
    setSelectedQuickUser(acc)
    setEmail(acc.email)
    setPassword('')
    setErrors({})
    setGeneralError(null)
    setIsUsingAnotherAccount(false)
  }

  const hasQuickAccount = Boolean(selectedQuickUser && !isUsingAnotherAccount)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4.5" noValidate>
      {/* General Error Notice / Account Not Found Alert */}
      {generalError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-error-container/60 border border-error/30 text-on-error-container flex flex-col gap-2.5 animate-in fade-in-50"
        >
          <div className="flex items-start gap-2.5">
            <Icon name="error" size={20} className="text-error shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-medium leading-relaxed">
              {generalError}
            </div>
          </div>

          {accountNotFound && (
            <div className="flex items-center justify-end pt-1 border-t border-error/20">
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-xs font-bold text-error hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Create New Clinician Account</span>
                <Icon name="arrow_forward" size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* QUICK ACCOUNT SWITCHER (When a saved account is available) */}
      {hasQuickAccount && selectedQuickUser && (
        <div className="bg-surface-container-low border border-primary/20 rounded-2xl p-4.5 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Icon name="verified_user" size={14} className="text-primary" />
              <span>Remembered Clinician Account</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setIsUsingAnotherAccount(true)
                setSelectedQuickUser(null)
              }}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Use another account
            </button>
          </div>

          {/* Active Quick Account Pill */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
            <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary font-bold text-base flex items-center justify-center shrink-0 border border-primary/20 shadow-2xs">
              {selectedQuickUser.name.charAt(0) || 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-sm text-on-surface truncate">
                {selectedQuickUser.name}
              </div>
              <div className="text-xs text-on-surface-variant truncate">
                {selectedQuickUser.role || 'Neonatologist'} • {selectedQuickUser.department}
              </div>
              <div className="text-[11px] font-mono text-outline truncate mt-0.5">
                {selectedQuickUser.email}
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary shrink-0 animate-pulse" title="Ready to authenticate" />
          </div>

          {/* Other Remembered Accounts List if multiple exist */}
          {rememberedAccounts.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-[11px] text-on-surface-variant shrink-0 font-medium">Switch:</span>
              {rememberedAccounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSelectQuickAccount(acc)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all shrink-0 cursor-pointer ${
                    acc.email === selectedQuickUser.email
                      ? 'bg-primary text-on-primary border-primary font-semibold'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border-outline-variant/30'
                  }`}
                >
                  {acc.name.split(' ')[0]} ({acc.email.split('@')[0]})
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STANDARD INPUTS (When entering another account or manually) */}
      {(!hasQuickAccount || isUsingAnotherAccount) && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface">Enter Credentials</span>
            {rememberedAccounts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedQuickUser(rememberedAccounts[0])
                  setIsUsingAnotherAccount(false)
                }}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
              >
                <Icon name="arrow_back" size={14} />
                <span>Back to {rememberedAccounts[0].name.split(' ')[0]}</span>
              </button>
            )}
          </div>

          {/* Hospital Email Input */}
          <Input
            label="Hospital / Institutional Email"
            subLabel="Verified Medical ID"
            type="email"
            placeholder="dr.smith@childrenshospital.org"
            leftIcon="mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
              if (generalError) setGeneralError(null)
            }}
            error={errors.email}
            required
            autoComplete="email"
          />
        </>
      )}

      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-on-surface" htmlFor="password-input">
            {hasQuickAccount ? `Password for ${selectedQuickUser?.name.split(' ')[0]}` : 'Password'} <span className="text-error">*</span>
          </label>
          <button
            type="button"
            onClick={() =>
              alert(
                'Password reset instructions have been dispatched to your institutional medical email.'
              )
            }
            className="text-xs font-semibold text-primary hover:underline transition-all"
          >
            Forgot password?
          </button>
        </div>

        <Input
          id="password-input"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          leftIcon="lock"
          rightIcon={showPassword ? 'visibility_off' : 'visibility'}
          onRightIconClick={() => setShowPassword(!showPassword)}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          error={errors.password}
          required
          autoComplete="current-password"
        />
      </div>

      {/* Remember Workstation & Shift Info */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberWorkstation}
            onChange={(e) => setRememberWorkstation(e.target.checked)}
            className="w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary/30 cursor-pointer"
          />
          <span className="text-xs text-on-surface-variant font-medium">
            Remember this workstation for 12 hours
          </span>
        </label>
        <span className="text-xs text-on-surface-variant hidden sm:inline-flex items-center gap-1 font-medium">
          <Icon name="lock_clock" size={14} className="text-on-surface-variant" />
          12h Shift
        </span>
      </div>

      {/* Primary CTA Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2 min-h-46px shadow-sm hover:shadow"
        isLoading={isLoading}
        iconRight={isLoading ? undefined : 'arrow_forward'}
      >
        {hasQuickAccount
          ? `Sign In as ${selectedQuickUser?.name.split(' ')[0] || 'Clinician'}`
          : 'Sign In to Clinical Console'}
      </Button>
    </form>
  )
}
export default SignInForm
