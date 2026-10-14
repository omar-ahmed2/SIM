import React from 'react'
import { Icon } from './Icon'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'light'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  iconLeft?: string
  iconRight?: string
  isLoading?: boolean
  asLink?: boolean
  href?: string
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  isLoading = false,
  asLink = false,
  href,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none select-none'

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px]',
  }

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-primary-container text-on-primary shadow-sm hover:bg-primary active:bg-primary-fixed-dim/20',
    secondary:
      'bg-surface-container-lowest text-on-surface border border-outline-variant/60 shadow-xs hover:bg-surface-container hover:border-outline-variant',
    outline:
      'bg-transparent text-primary border border-primary/30 hover:bg-primary/5 hover:border-primary',
    ghost:
      'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
    light:
      'bg-surface-container-lowest text-primary shadow-md hover:bg-surface-container hover:text-primary-container',
  }

  const content = (
    <>
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : iconLeft ? (
        <Icon name={iconLeft} size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
      ) : null}
      <span>{children}</span>
      {iconRight && !isLoading && (
        <Icon name={iconRight} size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
      )}
    </>
  )

  if (asLink && href) {
    return (
      <a
        href={href}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  )
}
