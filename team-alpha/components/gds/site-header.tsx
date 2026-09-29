import { Sparkles } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-5">
          <img
            src="/govuk-crown.svg"
            alt="GOV.UK"
            width={48}
            height={48}
            className="size-12 shrink-0 select-none rounded-md"
          />
          <div className="h-10 w-px bg-border" aria-hidden="true" />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              GDS Journey Builder
            </h1>
            <p className="max-w-md text-[11px] font-normal leading-[18px] text-muted-foreground">
              AI-powered generation of accessible, standards-compliant service journeys.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
          <Sparkles className="size-4" aria-hidden="true" />
          AI generation enabled
        </div>
      </div>
    </header>
  )
}
