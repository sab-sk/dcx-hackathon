'use client'

import { useState } from 'react'
import { Download, Eye, FileJson, Code2, Rocket, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { componentTagsForStep, stepToCode } from '@/lib/journey-data'
import type { Journey } from '@/lib/journey-schema'
import { StatusBadge } from './status-badge'
import { JourneyStepper } from './journey-stepper'
import { JourneyHealth } from './journey-health'
import { GovUkPreview } from './govuk-preview'
import { ComponentsUsed } from './components-used'

type TabId = 'preview' | 'json' | 'code'

const tabs: { id: TabId; label: string; icon: typeof Eye }[] = [
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'json', label: 'JSON', icon: FileJson },
  { id: 'code', label: 'Code', icon: Code2 },
]

export function GeneratedWorkspace({
  journey,
  selectedId,
  onSelect,
}: {
  journey: Journey
  selectedId: number
  onSelect: (id: number) => void
}) {
  const [activeTab, setActiveTab] = useState<TabId>('preview')
  const [isGeneratingApp, setIsGeneratingApp] = useState(false)
  const [appError, setAppError] = useState<string | null>(null)

  const selectedStep = journey.steps.find((step) => step.id === selectedId) ?? journey.steps[0]
  const journeyJson = JSON.stringify(journey, null, 2)
  const journeyCode = stepToCode(selectedStep)

  function handleDownload() {
    const blob = new Blob([JSON.stringify(journey, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const slug = journey.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    link.download = `${slug || 'journey'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  async function handleGenerateApp() {
    if (isGeneratingApp) return
    setIsGeneratingApp(true)
    setAppError(null)
    try {
      const { generateAppZip } = await import('@/lib/generate-app')
      const blob = await generateAppZip(journey)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'gds-journey-app.zip'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('[v0] generate app error', err)
      setAppError('Could not generate the application. Please try again.')
    } finally {
      setIsGeneratingApp(false)
    }
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-2xl font-bold tracking-tight text-foreground">
          Generated journey workspace
        </h3>
        <p className="text-[12px] font-normal leading-[18px] text-muted-foreground">
          Review each generated page, inspect the output, and check the journey health.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%]">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6 border-b border-border p-6 lg:border-r lg:border-b-0 lg:p-7">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold tracking-wide uppercase text-muted-foreground">
                Journey pages
              </h4>
              <StatusBadge tone="blue">{journey.steps.length} pages</StatusBadge>
            </div>

            <JourneyStepper steps={journey.steps} selectedId={selectedStep.id} onSelect={onSelect} />

            <JourneyHealth progress={journey.health} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col p-6 lg:p-7">
            <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div
                role="tablist"
                aria-label="Generated output"
                className="flex w-fit items-center gap-1 rounded-xl bg-muted p-1"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = tab.id === activeTab
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                        isActive
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge tone="green">
                  <span className="size-2 rounded-full bg-success" aria-hidden="true" />
                  Generated
                </StatusBadge>
                <Button
                  variant="outline"
                  size="lg"
                  type="button"
                  onClick={handleDownload}
                  className="h-10 gap-2 px-4 text-sm"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download JSON
                </Button>
              </div>
            </div>

            <div className="pt-6">
              {activeTab === 'preview' && (
                <GovUkPreview step={selectedStep} serviceTitle={journey.title} />
              )}
              {activeTab === 'json' && (
                <pre className="max-h-[520px] overflow-auto rounded-xl border border-border bg-foreground p-5 font-mono text-sm leading-relaxed text-background">
                  {journeyJson}
                </pre>
              )}
              {activeTab === 'code' && (
                <pre className="max-h-[520px] overflow-auto rounded-xl border border-border bg-foreground p-5 font-mono text-sm leading-relaxed text-background">
                  {journeyCode}
                </pre>
              )}
            </div>

            <div className="pt-6">
              <ComponentsUsed tags={componentTagsForStep(selectedStep)} />
            </div>

            <div className="pt-6">
              <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Rocket className="size-4 text-primary" aria-hidden="true" />
                    Generate application
                  </h4>
                  <p className="text-[12px] font-normal leading-[18px] text-muted-foreground">
                    Export the whole journey as a complete, runnable React application with routing,
                    pages and validation.
                  </p>
                </div>
                <Button
                  type="button"
                  size="lg"
                  onClick={handleGenerateApp}
                  disabled={isGeneratingApp}
                  className="h-11 shrink-0 gap-2 px-5 text-sm"
                >
                  {isGeneratingApp ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Rocket className="size-4" aria-hidden="true" />
                  )}
                  {isGeneratingApp ? 'Generating app...' : 'Generate app'}
                </Button>
              </div>
              {appError ? (
                <p
                  role="alert"
                  className="mt-2 text-[12px] font-normal leading-[18px] text-destructive"
                >
                  {appError}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
