import { Lock } from 'lucide-react'
import type { JourneyComponent, JourneyStep } from '@/lib/journey-schema'

const inputClass =
  'h-11 w-full rounded-none border-2 border-input bg-background px-3 text-base text-foreground outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-focus'

function PreviewComponent({ component, index }: { component: JourneyComponent; index: number }) {
  const fieldId = `preview-field-${index}`

  switch (component.type) {
    case 'paragraph':
      return <p className="text-base leading-relaxed text-foreground">{component.text}</p>

    case 'text-input':
      return (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={fieldId} className="text-base font-semibold text-foreground">
            {component.label}
          </label>
          {component.hint ? (
            <span className="text-sm text-muted-foreground">{component.hint}</span>
          ) : null}
          <input id={fieldId} type="text" className={`${inputClass} max-w-md`} />
        </div>
      )

    case 'textarea':
      return (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={fieldId} className="text-base font-semibold text-foreground">
            {component.label}
          </label>
          {component.hint ? (
            <span className="text-sm text-muted-foreground">{component.hint}</span>
          ) : null}
          <textarea
            id={fieldId}
            rows={4}
            className="w-full resize-y rounded-none border-2 border-input bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-focus"
          />
        </div>
      )

    case 'radios':
      return (
        <fieldset className="flex flex-col gap-3 border-0 p-0">
          <legend className="text-base font-semibold text-foreground">{component.label}</legend>
          <div className="flex flex-col gap-2.5">
            {(component.options ?? ['Yes', 'No']).map((option, i) => (
              <label key={option} className="flex items-center gap-3 text-base text-foreground">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-foreground">
                  {i === 0 ? <span className="size-4 rounded-full bg-foreground" /> : null}
                </span>
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      )

    case 'checkboxes':
      return (
        <fieldset className="flex flex-col gap-3 border-0 p-0">
          <legend className="text-base font-semibold text-foreground">{component.label}</legend>
          <div className="flex flex-col gap-2.5">
            {(component.options ?? []).map((option) => (
              <label key={option} className="flex items-center gap-3 text-base text-foreground">
                <span className="size-9 shrink-0 rounded-none border-2 border-foreground" />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      )

    case 'date-input':
      return (
        <fieldset className="flex flex-col gap-2 border-0 p-0">
          <legend className="text-base font-semibold text-foreground">{component.label}</legend>
          {component.hint ? (
            <span className="text-sm text-muted-foreground">{component.hint}</span>
          ) : null}
          <div className="mt-1 flex gap-4">
            {['Day', 'Month', 'Year'].map((part) => (
              <div key={part} className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">{part}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`${inputClass} ${part === 'Year' ? 'w-20' : 'w-14'}`}
                />
              </div>
            ))}
          </div>
        </fieldset>
      )

    case 'file-upload':
      return (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={fieldId} className="text-base font-semibold text-foreground">
            {component.label}
          </label>
          {component.hint ? (
            <span className="text-sm text-muted-foreground">{component.hint}</span>
          ) : null}
          <input
            id={fieldId}
            type="file"
            className="text-base text-foreground file:mr-4 file:rounded-none file:border-2 file:border-foreground file:bg-muted file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground"
          />
        </div>
      )

    case 'summary-list':
      return (
        <dl className="divide-y divide-border border-t border-border">
          {(component.options ?? ['Your answer']).map((row) => (
            <div key={row} className="flex items-start justify-between gap-4 py-3">
              <dt className="text-base font-semibold text-foreground">{row}</dt>
              <dd className="text-base text-muted-foreground">Provided</dd>
              <dd className="shrink-0">
                <span className="text-base text-primary underline underline-offset-4">Change</span>
              </dd>
            </div>
          ))}
        </dl>
      )

    case 'button':
      return (
        <button
          type="button"
          className="inline-flex h-12 w-fit items-center justify-center rounded-sm bg-success px-6 text-base font-semibold text-success-foreground shadow-[0_2px_0_#002d18] transition-colors hover:bg-success/90"
        >
          {component.text ?? 'Continue'}
        </button>
      )

    case 'confirmation':
      return (
        <div className="rounded-sm bg-success px-6 py-8 text-center text-success-foreground">
          <p className="text-2xl font-bold">
            {(component.text ?? '').split('\n')[0] || 'Application complete'}
          </p>
          {(component.text ?? '').split('\n')[1] ? (
            <p className="mt-2 text-3xl font-bold">{(component.text ?? '').split('\n')[1]}</p>
          ) : null}
        </div>
      )

    default:
      return null
  }
}

export function GovUkPreview({
  step,
  serviceTitle,
}: {
  step: JourneyStep
  serviceTitle: string
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      {/* Browser frame */}
      <div className="flex items-center gap-3 border-b border-border bg-muted px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-border" />
          <span className="size-3 rounded-full bg-border" />
          <span className="size-3 rounded-full bg-border" />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
          <Lock className="size-3.5 text-success" aria-hidden="true" />
          <span className="truncate">www.gov.uk{step.url}</span>
        </div>
      </div>

      {/* GOV.UK page */}
      <div className="bg-background">
        {/* Black masthead */}
        <div className="bg-foreground px-6 py-3.5">
          <span className="text-lg font-bold tracking-tight text-background">GOV.UK</span>
        </div>
        {/* Blue nav strip */}
        <div className="border-b-4 border-primary bg-background px-6 py-3">
          <span className="text-base font-semibold text-foreground">{serviceTitle}</span>
        </div>

        <div className="px-6 py-8 md:px-10">
          {/* Phase banner */}
          <div className="mb-8 flex items-center gap-3 border-b border-border pb-4">
            <span className="inline-flex items-center rounded-sm bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
              Beta
            </span>
            <p className="text-sm text-muted-foreground">
              This is a new service — your feedback will help us to improve it.
            </p>
          </div>

          <a
            href="#"
            className="mb-6 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
          >
            &lsaquo; Back
          </a>

          <div className="max-w-xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              {step.heading}
            </h1>
            {step.description ? (
              <p className="mt-2 text-base text-muted-foreground">{step.description}</p>
            ) : null}

            <div className="mt-8 flex flex-col gap-6">
              {step.components.map((component, index) => (
                <PreviewComponent key={index} component={component} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
