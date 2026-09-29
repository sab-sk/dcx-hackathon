export function PageIntro() {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-4xl font-bold tracking-tight text-balance text-foreground">
        Create a new service journey
      </h2>
      <p className="max-w-2xl text-[12px] font-normal leading-[18px] text-pretty text-muted-foreground">
        Describe the service you need in plain language. The builder generates a complete,
        accessible journey using the GOV.UK Design System.
      </p>
    </section>
  )
}
