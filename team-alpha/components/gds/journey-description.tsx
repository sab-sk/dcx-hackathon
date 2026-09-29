'use client'

import { useRef, useState } from 'react'
import {
  Sparkles,
  RotateCcw,
  Lightbulb,
  Loader2,
  AlertCircle,
  PenLine,
  FileJson,
  Upload,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { normalizeJourney, type Journey } from '@/lib/journey-schema'

const placeholder =
  'e.g. Build a journey for citizens to apply for a provisional driving licence. Collect personal details, contact information, check eligibility, allow document uploads, show a check-your-answers page, and confirm the application.'

type Mode = 'describe' | 'upload'

export function JourneyDescription({
  value,
  onChange,
  onGenerate,
  onReset,
  onUpload,
  isGenerating,
  error,
}: {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  onReset: () => void
  onUpload: (journey: Journey) => void
  isGenerating: boolean
  error: string | null
}) {
  const [mode, setMode] = useState<Mode>('describe')
  const [fileName, setFileName] = useState<string | null>(null)
  const [parsedJourney, setParsedJourney] = useState<Journey | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const invalid = Boolean(error) && value.trim().length === 0

  async function readFile(file: File) {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const journey = normalizeJourney(data)
      setParsedJourney(journey)
      setFileName(file.name)
      setParseError(null)
    } catch (err) {
      setParsedJourney(null)
      setFileName(file.name)
      setParseError(
        err instanceof SyntaxError
          ? 'That file is not valid JSON. Check the formatting and try again.'
          : err instanceof Error
            ? err.message
            : 'Could not read the JSON file.',
      )
    }
  }

  function clearUpload() {
    setFileName(null)
    setParsedJourney(null)
    setParseError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const tabs: { id: Mode; label: string; icon: typeof PenLine }[] = [
    { id: 'describe', label: 'Describe', icon: PenLine },
    { id: 'upload', label: 'Upload JSON', icon: FileJson },
  ]

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-2xl font-bold tracking-tight text-foreground">Journey description</h3>
        <p className="text-[12px] font-normal leading-[18px] text-muted-foreground">
          Describe the service in your own words, or upload a JSON file to mock up the structure.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div role="tablist" aria-label="Journey input method" className="flex gap-1 border-b border-border px-4 pt-3 md:px-6">
          {tabs.map((tab) => {
            const active = mode === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                id={`tab-${tab.id}`}
                aria-selected={active}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setMode(tab.id)}
                disabled={isGenerating}
                className={`-mb-px flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-4 focus-visible:ring-focus disabled:opacity-60 ${
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {mode === 'describe' ? (
          <div role="tabpanel" id="panel-describe" aria-labelledby="tab-describe">
            <div className="p-6 md:p-8">
              <label htmlFor="journey-description" className="mb-3 block text-sm font-semibold text-foreground">
                Describe your service journey
              </label>
              <textarea
                id="journey-description"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                rows={6}
                aria-invalid={invalid}
                disabled={isGenerating}
                className={`w-full resize-y rounded-xl border-2 bg-background px-4 py-3 text-base leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-4 focus-visible:ring-focus disabled:opacity-60 ${
                  invalid ? 'border-destructive focus-visible:border-destructive' : 'border-input focus-visible:border-primary'
                }`}
              />
            </div>

            <div className="flex flex-col gap-4 border-t border-border px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              <p className="flex items-start gap-2 text-[12px] font-normal leading-[18px] text-muted-foreground md:items-center">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary md:mt-0" aria-hidden="true" />
                AI will structure pages, validate accessibility, and map GOV.UK components automatically.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  type="button"
                  onClick={onReset}
                  disabled={isGenerating}
                  className="h-11 gap-2 px-4 text-base"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Reset
                </Button>
                <Button
                  size="lg"
                  type="button"
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="h-11 gap-2 bg-success px-5 text-base text-success-foreground hover:bg-success/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Generating journey...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" aria-hidden="true" />
                      Generate journey
                    </>
                  )}
                </Button>
              </div>
            </div>

            {error ? (
              <div
                role="alert"
                className="flex items-start gap-2 border-t border-destructive/30 bg-destructive/5 px-6 py-4 text-sm font-medium text-destructive md:px-8"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {error}
              </div>
            ) : null}
          </div>
        ) : (
          <div role="tabpanel" id="panel-upload" aria-labelledby="tab-upload">
            <div className="p-6 md:p-8">
              <span className="mb-3 block text-sm font-semibold text-foreground">Upload a journey JSON file</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault()
                  setIsDragging(false)
                  const file = event.dataTransfer.files?.[0]
                  if (file) void readFile(file)
                }}
                className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center outline-none transition-colors focus-visible:ring-4 focus-visible:ring-focus ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-input bg-background hover:border-primary/60'
                }`}
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Upload className="size-5" aria-hidden="true" />
                </span>
                <span className="text-base font-semibold text-foreground">
                  {fileName ?? 'Choose a .json file or drag it here'}
                </span>
                <span className="text-[12px] font-normal leading-[18px] text-muted-foreground">
                  We map your JSON to GOV.UK pages and components. Missing details are filled in automatically.
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) void readFile(file)
                }}
              />

              {parsedJourney ? (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm font-medium text-success">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    Parsed <strong>{parsedJourney.steps.length}</strong>{' '}
                    {parsedJourney.steps.length === 1 ? 'page' : 'pages'} from{' '}
                    <span className="font-semibold">{parsedJourney.title}</span>. Select build to mock it up.
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-4 border-t border-border px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              <p className="flex items-start gap-2 text-[12px] font-normal leading-[18px] text-muted-foreground md:items-center">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary md:mt-0" aria-hidden="true" />
                Accepts a journey with a <code className="font-mono">steps</code> or{' '}
                <code className="font-mono">pages</code> array. Component fields are optional.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  type="button"
                  onClick={clearUpload}
                  disabled={isGenerating || (!fileName && !parsedJourney && !parseError)}
                  className="h-11 gap-2 px-4 text-base"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Clear
                </Button>
                <Button
                  size="lg"
                  type="button"
                  onClick={() => parsedJourney && onUpload(parsedJourney)}
                  disabled={isGenerating || !parsedJourney}
                  className="h-11 gap-2 bg-success px-5 text-base text-success-foreground hover:bg-success/90"
                >
                  <FileJson className="size-4" aria-hidden="true" />
                  Build from JSON
                </Button>
              </div>
            </div>

            {parseError ? (
              <div
                role="alert"
                className="flex items-start gap-2 border-t border-destructive/30 bg-destructive/5 px-6 py-4 text-sm font-medium text-destructive md:px-8"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {parseError}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
