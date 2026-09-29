import { ShieldCheck, Check } from 'lucide-react'
import { healthItems } from '@/lib/journey-data'

export function JourneyHealth({ progress = 82 }: { progress?: number }) {
  return (
    <div className="rounded-2xl border border-success-muted bg-success-muted/40 p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <div className="flex flex-col">
          <h4 className="text-sm font-bold text-foreground">Journey health</h4>
          <p className="text-xs font-medium text-success">Healthy — ready to review</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Completeness</span>
          <span className="font-semibold text-foreground">{progress}%</span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-background"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Journey completeness"
        >
          <div className="h-full rounded-full bg-success" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {healthItems.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-foreground">
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
              <Check className="size-3" aria-hidden="true" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
