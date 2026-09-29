'use client'

import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { JourneyStep, StepStatus } from '@/lib/journey-schema'

const statusLabel: Record<StepStatus, string> = {
  complete: 'Complete',
  'in-progress': 'In progress',
  'not-started': 'Not started',
}

const statusStyle: Record<StepStatus, string> = {
  complete: 'text-success',
  'in-progress': 'text-primary',
  'not-started': 'text-muted-foreground',
}

export function JourneyStepper({
  steps,
  selectedId,
  onSelect,
}: {
  steps: JourneyStep[]
  selectedId: number
  onSelect: (id: number) => void
}) {
  return (
    <ol className="flex flex-col gap-2">
      {steps.map((step, index) => {
        const isSelected = step.id === selectedId
        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onSelect(step.id)}
              aria-current={isSelected ? 'step' : undefined}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                isSelected
                  ? 'border-primary bg-accent'
                  : 'border-transparent hover:border-border hover:bg-muted',
              )}
            >
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                  step.status === 'complete'
                    ? 'bg-success text-success-foreground'
                    : isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                )}
              >
                {step.status === 'complete' ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-foreground">{step.title}</span>
                <span className={cn('text-xs font-medium', statusStyle[step.status])}>
                  {statusLabel[step.status]}
                </span>
              </span>
              <ChevronRight
                className={cn(
                  'size-4 shrink-0 transition-colors',
                  isSelected ? 'text-primary' : 'text-border group-hover:text-muted-foreground',
                )}
                aria-hidden="true"
              />
            </button>
          </li>
        )
      })}
    </ol>
  )
}
