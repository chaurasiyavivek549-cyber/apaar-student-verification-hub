import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FlaskConical, Inbox } from "lucide-react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, description, action, children, className, bodyClassName }: {
  title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string;
}) {
  return (
    <section className={cn("card-surface", className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

const tones = {
  success: "bg-success/10 text-success ring-success/20",
  warning: "bg-warning/15 text-warning-foreground ring-warning/30",
  danger: "bg-destructive/10 text-destructive ring-destructive/20",
  info: "bg-info/10 text-info ring-info/20",
  neutral: "bg-muted text-muted-foreground ring-border",
  primary: "bg-primary/8 text-primary ring-primary/15",
} as const;
export type Tone = keyof typeof tones;

export function Pill({ tone = "neutral", children, dot = true, className }: { tone?: Tone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", tones[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export const statusTone = (s: string): Tone =>
  ({ Verified: "success", Submitted: "success", Success: "success", Granted: "success", Healthy: "success",
     Pending: "warning", Partial: "warning", Warning: "warning", High: "warning",
     Flagged: "danger", Overdue: "danger", Denied: "danger", Critical: "danger", Withdrawn: "danger",
     Medium: "info" } as Record<string, Tone>)[s] ?? "neutral";

export function DemoBadge({ label = "Demo · Simulated" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-warning/60 bg-warning/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-warning-foreground">
      <FlaskConical className="size-3" /> {label}
    </span>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="mb-3 rounded-full bg-muted p-3"><Inbox className="size-5 text-muted-foreground" /></div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

export function Meter({ value, tone = "primary" }: { value: number; tone?: "primary" | "success" | "warning" | "danger" }) {
  const bg = { primary: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-destructive" }[tone];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full transition-all", bg)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("h-10 whitespace-nowrap px-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", className)}>{children}</th>;
}
export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-middle text-sm", className)}>{children}</td>;
}
