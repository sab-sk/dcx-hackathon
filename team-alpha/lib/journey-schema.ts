import { z } from 'zod'

export const componentTypes = [
  'paragraph',
  'text-input',
  'textarea',
  'radios',
  'checkboxes',
  'date-input',
  'file-upload',
  'summary-list',
  'button',
  'confirmation',
] as const

export const stepStatuses = ['complete', 'in-progress', 'not-started'] as const

// Fields are nullable (not optional): OpenAI structured-output strict mode
// requires every property to be present in "required", so optional keys are
// rejected. Absent values are represented as null.
export const journeyComponentSchema = z.object({
  type: z.enum(componentTypes),
  label: z.string().nullable(),
  hint: z.string().nullable(),
  text: z.string().nullable(),
  options: z.array(z.string()).nullable(),
})

export const journeyStepSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  status: z.enum(stepStatuses),
  url: z.string(),
  pageTitle: z.string(),
  heading: z.string(),
  description: z.string(),
  components: z.array(journeyComponentSchema),
})

export const journeySchema = z.object({
  title: z.string(),
  health: z.number().int().min(0).max(100),
  steps: z.array(journeyStepSchema).min(1),
})

export type ComponentType = (typeof componentTypes)[number]
export type StepStatus = (typeof stepStatuses)[number]
export type JourneyComponent = z.infer<typeof journeyComponentSchema>
export type JourneyStep = z.infer<typeof journeyStepSchema>
export type Journey = z.infer<typeof journeySchema>

function str(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'page'
  )
}

function deriveHealth(steps: JourneyStep[]): number {
  if (steps.length === 0) return 0
  const withComponents = steps.filter((step) => step.components.length > 0).length
  return clamp(Math.round(60 + (withComponents / steps.length) * 35), 0, 100)
}

/**
 * Turns arbitrary uploaded JSON into a valid Journey. Accepts the strict shape
 * as-is, and otherwise coerces a loose object (missing ids/status/urls,
 * `pages` instead of `steps`, optional component fields) into a mocked-up
 * structure. Throws an Error with a user-facing message when it cannot.
 */
export function normalizeJourney(input: unknown): Journey {
  const strict = journeySchema.safeParse(input)
  if (strict.success) return strict.data

  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new Error('The JSON must be an object describing a journey.')
  }

  const obj = input as Record<string, unknown>
  const rawSteps = Array.isArray(obj.steps)
    ? obj.steps
    : Array.isArray(obj.pages)
      ? obj.pages
      : null

  if (!rawSteps || rawSteps.length === 0) {
    throw new Error('The JSON must include a non-empty "steps" (or "pages") array.')
  }

  const steps: JourneyStep[] = rawSteps.map((raw, index) => {
    const s = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>
    const title = str(s.title) ?? str(s.name) ?? str(s.pageTitle) ?? `Page ${index + 1}`
    const rawComponents = Array.isArray(s.components) ? s.components : []

    const components: JourneyComponent[] = rawComponents.map((rc) => {
      const c = (typeof rc === 'object' && rc !== null ? rc : {}) as Record<string, unknown>
      const type = (componentTypes as readonly string[]).includes(c.type as string)
        ? (c.type as ComponentType)
        : 'paragraph'
      return {
        type,
        label: str(c.label),
        hint: str(c.hint),
        text: str(c.text),
        options: Array.isArray(c.options) ? c.options.map((option) => String(option)) : null,
      }
    })

    return {
      id: typeof s.id === 'number' ? s.id : index + 1,
      title,
      status: (stepStatuses as readonly string[]).includes(s.status as string)
        ? (s.status as StepStatus)
        : 'not-started',
      url: str(s.url) ?? `/${slugify(title)}`,
      pageTitle: str(s.pageTitle) ?? title,
      heading: str(s.heading) ?? title,
      description: str(s.description) ?? '',
      components,
    }
  })

  const title = str(obj.title) ?? str(obj.name) ?? 'Uploaded journey'
  const health =
    typeof obj.health === 'number' ? clamp(Math.round(obj.health), 0, 100) : deriveHealth(steps)

  return journeySchema.parse({ title, health, steps })
}
