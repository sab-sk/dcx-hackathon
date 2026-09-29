import { generateObject } from 'ai'
import { journeySchema } from '@/lib/journey-schema'

export const maxDuration = 60

const systemPrompt = `You are a GOV.UK service design expert. You generate structured, standards-compliant government service journeys that follow the GOV.UK Design System and the GOV.UK service manual.

Rules:
- Produce a logical sequence of pages a citizen moves through to complete the service.
- Always start with a start/guidance page and end with a confirmation page.
- Include a "Check your answers" page (summary-list) before the confirmation where appropriate.
- Give each step a sequential numeric id starting at 1.
- Use realistic, kebab-case relative URLs beginning with "/".
- Use plain-English, sentence case headings written in the GOV.UK content style.
- The first page should typically be "complete", the current working page "in-progress", and later pages "not-started".
- Only use these component types: paragraph, text-input, textarea, radios, checkboxes, date-input, file-upload, summary-list, button, confirmation.
- Every input component should have a clear label; add a hint where it helps. Use "text" for paragraph/button/confirmation content and "options" for radios/checkboxes.
- health is an integer 0-100 reflecting how complete and well-formed the journey is.`

export async function POST(request: Request) {
  let description: unknown

  try {
    const body = await request.json()
    description = body?.description
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (typeof description !== 'string' || description.trim().length === 0) {
    return Response.json(
      { error: 'Please enter a journey description before generating.' },
      { status: 400 },
    )
  }

  try {
    const { object } = await generateObject({
      model: 'openai/gpt-4.1-mini',
      schema: journeySchema,
      system: systemPrompt,
      prompt: `Generate a complete GOV.UK service journey for the following service description:\n\n"""${description.trim()}"""`,
    })

    return Response.json(object)
  } catch (error) {
    console.error('[v0] generate-journey error:', error)
    return Response.json(
      { error: 'Something went wrong while generating the journey. Please try again.' },
      { status: 500 },
    )
  }
}
