import * as React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

export function Button({ variant='default', className='', ...props }: Props) {
  const base = 'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 rounded-2xl'
  const styles = {
    default: 'bg-black text-white hover:opacity-90',
    outline: 'border border-black/30 hover:bg-black/5',
    ghost: 'hover:bg-black/5',
  } as const
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />
}
