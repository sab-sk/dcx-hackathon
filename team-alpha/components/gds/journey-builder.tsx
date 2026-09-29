'use client'

import { useState } from 'react'
import { defaultDescription, defaultJourney } from '@/lib/journey-data'
import type { Journey } from '@/lib/journey-schema'
import { JourneyDescription } from './journey-description'
import { GeneratedWorkspace } from './generated-workspace'

export function JourneyBuilder() {
  const [description, setDescription] = useState(defaultDescription)
  const [journey, setJourney] = useState<Journey>(defaultJourney)
  const [selectedId, setSelectedId] = useState<number>(defaultJourney.steps[2]?.id ?? defaultJourney.steps[0].id)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    if (isGenerating) return

    if (description.trim().length === 0) {
      setError('Please enter a journey description before generating.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) {
        let message = 'Something went wrong while generating the journey. Please try again.'
        try {
          const data = await response.json()
          if (data?.error) message = data.error
        } catch {
          /* keep default message */
        }
        setError(message)
        return
      }

      const generated: Journey = await response.json()
      setJourney(generated)
      setSelectedId(generated.steps[0]?.id ?? 1)
    } catch {
      setError('Could not reach the journey generator. Check your connection and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  function handleReset() {
    setDescription('')
    setJourney(defaultJourney)
    setSelectedId(defaultJourney.steps[0].id)
    setError(null)
  }

  function handleUpload(uploaded: Journey) {
    setJourney(uploaded)
    setSelectedId(uploaded.steps[0]?.id ?? 1)
    setError(null)
  }

  return (
    <>
      <JourneyDescription
        value={description}
        onChange={(next) => {
          setDescription(next)
          if (error) setError(null)
        }}
        onGenerate={handleGenerate}
        onReset={handleReset}
        onUpload={handleUpload}
        isGenerating={isGenerating}
        error={error}
      />
      <GeneratedWorkspace journey={journey} selectedId={selectedId} onSelect={setSelectedId} />
    </>
  )
}
