import { Puzzle, BookMarked } from 'lucide-react'

export function ComponentsUsed({ tags }: { tags: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-5">
      <div className="flex flex-col gap-1">
        <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Puzzle className="size-4 text-primary" aria-hidden="true" />
          Components used
        </h4>
        <p className="text-[12px] font-normal leading-[18px] text-muted-foreground">
          Detected on this page. For reference only.
        </p>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs font-medium text-muted-foreground">
        <BookMarked className="size-3.5" aria-hidden="true" />
        Design system reference: GOV.UK Frontend v5.4.0
      </div>
    </div>
  )
}
