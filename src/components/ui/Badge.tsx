import React from 'react'

export type BadgeVariant = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'error' | 'surface'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  pulseDot?: boolean
  dotColor?: string
  children: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'surface',
  pulseDot = false,
  dotColor,
  children,
  className = '',
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    surface: 'bg-surface-container text-on-surface border border-outline-variant/30',
    primary: 'bg-primary-fixed text-on-primary-fixed border border-primary/20',
    secondary: 'bg-secondary-fixed text-on-secondary-fixed border border-secondary/20',
    tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/20',
    warning: 'bg-warning-container text-on-warning border border-warning/30',
    error: 'bg-error-container text-on-error-container border border-error/20',
  }

  const defaultDotColor: Record<BadgeVariant, string> = {
    surface: 'bg-primary',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    tertiary: 'bg-tertiary',
    warning: 'bg-warning',
    error: 'bg-error',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {pulseDot && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              dotColor || defaultDotColor[variant]
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              dotColor || defaultDotColor[variant]
            }`}
          />
        </span>
      )}
      {children}
    </span>
  )
}
