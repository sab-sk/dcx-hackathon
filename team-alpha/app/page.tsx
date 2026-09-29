import { SiteHeader } from '@/components/gds/site-header'
import { PageIntro } from '@/components/gds/page-intro'
import { JourneyBuilder } from '@/components/gds/journey-builder'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-[1440px] flex-col gap-12 px-6 pt-6 pb-12 md:px-10 md:pt-8 md:pb-16">
        <PageIntro />
        <JourneyBuilder />
      </main>
    </div>
  )
}
