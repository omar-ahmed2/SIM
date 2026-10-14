import React from 'react'

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string
  className?: string
  size?: number | string
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size, style, ...props }) => {
  return (
    <span
      className={`material-symbols-outlined select-none inline-block align-middle ${className}`}
      style={{
        fontSize: size ? (typeof size === 'number' ? `${size}px` : size) : undefined,
        lineHeight: 1,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  )
}
