import React from 'react'

interface ButtonProps {
  'children': React.ReactNode
  'onClick'?: () => void
  'disabled'?: boolean
  'variant'?: 'primary' | 'secondary' | 'neutral'
  'className'?: string
  'aria-label'?: string
}

export const Button = ({
  children,
  onClick,
  disabled = false,
  variant = 'neutral',
  className = ''
}: ButtonProps) => {
  const baseClasses =
    'px-6 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900'

  const variantClasses = {
    primary: disabled
      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
      : 'bg-amber-700 hover:bg-amber-600 text-amber-100',
    secondary: 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200',
    neutral: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
