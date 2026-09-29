import type { ComponentType, Journey, JourneyStep } from '@/lib/journey-schema'

export const healthItems = [
  'Accessibility — WCAG 2.2 AA passed',
  'GOV.UK components validated',
  'Content style checked',
  'Route logic verified',
]

export const defaultDescription =
  'Create a journey for applying for a provisional driving licence. Collect the applicant\u2019s personal details and contact information, confirm eligibility, allow supporting documents to be uploaded, then show a check-your-answers page followed by a confirmation screen.'

const componentLabels: Record<ComponentType, string> = {
  paragraph: 'Body text',
  'text-input': 'Text input',
  textarea: 'Character count',
  radios: 'Radios',
  checkboxes: 'Checkboxes',
  'date-input': 'Date input',
  'file-upload': 'File upload',
  'summary-list': 'Summary list',
  button: 'Button',
  confirmation: 'Panel',
}

export function componentLabel(type: ComponentType): string {
  return componentLabels[type] ?? type
}

export function componentTagsForStep(step: JourneyStep | undefined): string[] {
  if (!step) return []
  const base = ['Phase banner', 'Back link']
  const seen = new Set<string>(base)
  for (const component of step.components) {
    seen.add(componentLabel(component.type))
  }
  return Array.from(seen)
}

export function stepToCode(step: JourneyStep | undefined): string {
  if (!step) return '// No page selected'

  const imports = new Set<string>()
  const blocks: string[] = []

  for (const component of step.components) {
    switch (component.type) {
      case 'text-input':
        imports.add('input')
        blocks.push(
          `  {{ govukInput({\n    label: { text: ${JSON.stringify(component.label ?? 'Enter a value')} },${
            component.hint ? `\n    hint: { text: ${JSON.stringify(component.hint)} },` : ''
          }\n    id: "field",\n    name: "field"\n  }) }}`,
        )
        break
      case 'textarea':
        imports.add('character-count')
        blocks.push(
          `  {{ govukCharacterCount({\n    label: { text: ${JSON.stringify(component.label ?? 'Enter details')} },\n    id: "details",\n    name: "details",\n    maxlength: 500\n  }) }}`,
        )
        break
      case 'radios':
        imports.add('radios')
        blocks.push(
          `  {{ govukRadios({\n    name: "choice",\n    fieldset: { legend: { text: ${JSON.stringify(component.label ?? 'Select an option')} } },\n    items: [\n${(component.options ?? ['Yes', 'No'])
            .map((o) => `      { value: ${JSON.stringify(o.toLowerCase())}, text: ${JSON.stringify(o)} }`)
            .join(',\n')}\n    ]\n  }) }}`,
        )
        break
      case 'checkboxes':
        imports.add('checkboxes')
        blocks.push(
          `  {{ govukCheckboxes({\n    name: "options",\n    fieldset: { legend: { text: ${JSON.stringify(component.label ?? 'Select all that apply')} } },\n    items: [\n${(component.options ?? [])
            .map((o) => `      { value: ${JSON.stringify(o.toLowerCase())}, text: ${JSON.stringify(o)} }`)
            .join(',\n')}\n    ]\n  }) }}`,
        )
        break
      case 'date-input':
        imports.add('date-input')
        blocks.push(
          `  {{ govukDateInput({\n    id: "date",\n    fieldset: { legend: { text: ${JSON.stringify(component.label ?? 'Enter a date')} } }${
            component.hint ? `,\n    hint: { text: ${JSON.stringify(component.hint)} }` : ''
          }\n  }) }}`,
        )
        break
      case 'file-upload':
        imports.add('file-upload')
        blocks.push(
          `  {{ govukFileUpload({\n    id: "file",\n    name: "file",\n    label: { text: ${JSON.stringify(component.label ?? 'Upload a file')} }\n  }) }}`,
        )
        break
      case 'summary-list':
        imports.add('summary-list')
        blocks.push(`  {{ govukSummaryList({ rows: rows }) }}`)
        break
      case 'button':
        imports.add('button')
        blocks.push(`  {{ govukButton({ text: ${JSON.stringify(component.text ?? 'Continue')} }) }}`)
        break
      case 'confirmation':
        imports.add('panel')
        blocks.push(
          `  {{ govukPanel({\n    titleText: ${JSON.stringify(step.heading)},\n    text: ${JSON.stringify(component.text ?? 'Your reference number\\nHDJ2123F')}\n  }) }}`,
        )
        break
      case 'paragraph':
      default:
        blocks.push(`  <p class="govuk-body">${component.text ?? ''}</p>`)
        break
    }
  }

  const importLines = Array.from(imports)
    .map((name) => `{% from "govuk/components/${name}/macro.njk" import govuk${toMacro(name)} %}`)
    .join('\n')

  return `{% extends "govuk/template.njk" %}

${importLines}

{% block content %}
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-xl">${step.heading}</h1>
${step.description ? `      <p class="govuk-body-l">${step.description}</p>\n` : ''}${blocks.join('\n\n')}
    </div>
  </div>
{% endblock %}`
}

function toMacro(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

type LooseComponent = {
  type: ComponentType
  label?: string
  hint?: string
  text?: string
  options?: string[]
}

type LooseStep = Omit<JourneyStep, 'components'> & { components: LooseComponent[] }

const rawDefaultSteps: LooseStep[] = [
    {
      id: 1,
      title: 'Start page',
      status: 'complete',
      url: '/apply-provisional-licence/start',
      pageTitle: 'Apply for a provisional driving licence',
      heading: 'Apply for a provisional driving licence',
      description: 'Use this service to apply for your first provisional driving licence for a car, moped or motorcycle.',
      components: [
        {
          type: 'paragraph',
          text: 'It takes around 15 minutes to apply. You will need your identity documents and a way to pay the £34 fee.',
        },
        { type: 'button', text: 'Start now' },
      ],
    },
    {
      id: 2,
      title: 'Personal details',
      status: 'complete',
      url: '/apply-provisional-licence/personal-details',
      pageTitle: 'Your personal details',
      heading: 'Your personal details',
      description: 'We need these to check your identity against our records.',
      components: [
        { type: 'text-input', label: 'Full name', hint: 'As shown on your passport' },
        { type: 'date-input', label: 'Date of birth', hint: 'For example, 27 3 2007' },
      ],
    },
    {
      id: 3,
      title: 'Contact information',
      status: 'in-progress',
      url: '/apply-provisional-licence/contact-information',
      pageTitle: 'Contact information',
      heading: 'Contact information',
      description: 'We will only use this to contact you about your application.',
      components: [
        {
          type: 'text-input',
          label: 'Email address',
          hint: 'We will send a confirmation to this address.',
        },
        { type: 'text-input', label: 'UK telephone number' },
      ],
    },
    {
      id: 4,
      title: 'Eligibility questions',
      status: 'not-started',
      url: '/apply-provisional-licence/eligibility',
      pageTitle: 'Check your eligibility',
      heading: 'Check your eligibility',
      description: 'Answer a few questions so we can confirm you can apply.',
      components: [
        {
          type: 'radios',
          label: 'Do you currently hold a driving licence from another country?',
          options: ['Yes', 'No'],
        },
      ],
    },
    {
      id: 5,
      title: 'Upload supporting documents',
      status: 'not-started',
      url: '/apply-provisional-licence/documents',
      pageTitle: 'Upload supporting documents',
      heading: 'Upload supporting documents',
      description: 'Upload a photo or scan of your proof of identity.',
      components: [
        {
          type: 'file-upload',
          label: 'Upload proof of identity',
          hint: 'The file must be a JPG, PNG or PDF and smaller than 10MB.',
        },
      ],
    },
    {
      id: 6,
      title: 'Check your answers',
      status: 'not-started',
      url: '/apply-provisional-licence/check-answers',
      pageTitle: 'Check your answers',
      heading: 'Check your answers before sending your application',
      description: '',
      components: [
        {
          type: 'summary-list',
          options: ['Full name', 'Date of birth', 'Email address', 'UK telephone number'],
        },
        { type: 'button', text: 'Accept and send' },
      ],
    },
    {
      id: 7,
      title: 'Confirmation',
      status: 'not-started',
      url: '/apply-provisional-licence/confirmation',
      pageTitle: 'Application complete',
      heading: 'Application complete',
      description: '',
      components: [
        { type: 'confirmation', text: 'Your reference number\nHDJ2123F' },
        {
          type: 'paragraph',
          text: 'We have sent you a confirmation email. We will contact you within 10 working days.',
        },
      ],
    },
]

export const defaultJourney: Journey = {
  title: 'Apply for a provisional driving licence',
  health: 82,
  steps: rawDefaultSteps.map((step) => ({
    ...step,
    components: step.components.map((component) => ({
      type: component.type,
      label: component.label ?? null,
      hint: component.hint ?? null,
      text: component.text ?? null,
      options: component.options ?? null,
    })),
  })),
}
