import { cn } from '@/lib/utils'

type BadgeTone = 'blue' | 'green' | 'grey'

const toneStyles: Record<BadgeTone, string> = {
  blue: 'bg-accent text-accent-foreground',
  green: 'bg-success-muted text-success',
  grey: 'bg-muted text-muted-foreground',
}

export function StatusBadge({
  children,
  tone = 'blue',
  className,
}: {
  children: React.ReactNode
  tone?: BadgeTone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
