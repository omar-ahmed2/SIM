import React, { forwardRef } from 'react'
import { Icon } from './Icon'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  subLabel?: string
  leftIcon?: string
  rightIcon?: string
  onRightIconClick?: () => void
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      subLabel,
      leftIcon,
      rightIcon,
      onRightIconClick,
      error,
      helperText,
      id,
      className = '',
      type = 'text',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7)
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label and SubLabel / Badge */}
        {(label || subLabel) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={inputId}
                className="text-xs font-bold text-on-surface select-none"
              >
                {label}
                {props.required && <span className="text-error ml-0.5">*</span>}
              </label>
            )}
            {subLabel && (
              <span className="text-[11px] font-normal text-on-surface-variant">
                {subLabel}
              </span>
            )}
          </div>
        )}

        {/* Input Wrapper with Icons */}
        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className="absolute left-3.5 text-outline text-[20px] pointer-events-none flex items-center justify-center text-on-surface-variant"
              aria-hidden="true"
            >
              <Icon name={leftIcon} size={20} />
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full h-11 rounded-xl border bg-surface-container-lowest text-on-surface text-sm placeholder:text-outline/70 outline-none transition-all duration-200 ${
              leftIcon ? 'pl-11' : 'pl-3.5'
            } ${rightIcon ? 'pr-11' : 'pr-3.5'} ${
              error
                ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                : 'border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20'
            } ${disabled ? 'bg-surface-container opacity-60 cursor-not-allowed' : ''} ${className}`}
            {...props}
          />

          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              disabled={disabled}
              className="absolute right-3.5 text-outline hover:text-on-surface focus-visible:outline-none focus-visible:text-primary transition-colors flex items-center justify-center"
              tabIndex={onRightIconClick ? 0 : -1}
              aria-label="Toggle input action"
            >
              <Icon name={rightIcon} size={20} />
            </button>
          )}
        </div>

        {/* Validation Error Message */}
        {error && (
          <p id={errorId} className="text-xs text-error font-medium flex items-center gap-1 mt-0.5" role="alert">
            <Icon name="error" size={14} />
            <span>{error}</span>
          </p>
        )}

        {/* Helper Text */}
        {!error && helperText && (
          <p id={helperId} className="text-[11px] text-on-surface-variant mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
