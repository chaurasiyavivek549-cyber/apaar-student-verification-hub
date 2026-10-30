import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Users, XCircle, FileQuestion, CheckCircle2, Lightbulb, Building2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Pill, EmptyState, statusTone } from "@/components/app/primitives";
import { anomalies as seed, fmt, type Anomaly } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/anomalies")({
  head: () => ({
    meta: [
      { title: "Anomaly Centre — APAAR Setu" },
      { name: "description", content: "Explainable queue of duplicate, intake breach and data quality anomalies." },
      { property: "og:title", content: "Anomaly Centre — APAAR Setu" },
      { property: "og:description", content: "Review and resolve flagged student data issues (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnomalyPage,
});

const typeIcon = { "Duplicate across institutions": Copy, "Intake breach": Users, "Invalid APAAR": XCircle, "Missing fields": FileQuestion };

function AnomalyPage() {
  const [items, setItems] = useState<Anomaly[]>(seed);
  const [sev, setSev] = useState("All");
  const [type, setType] = useState("all");
  const [showReviewed, setShowReviewed] = useState(false);

  const list = items.filter((a) => (sev === "All" || a.severity === sev) && (type === "all" || a.type === type) && (showReviewed || !a.reviewed));
  const count = (s: string) => items.filter((a) => !a.reviewed && (s === "All" || a.severity === s)).length;
  const toggle = (id: string) => {
    const a = items.find((x) => x.id === id)!;
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, reviewed: !x.reviewed } : x)));
    toast.success(a.reviewed ? `${id} reopened` : `${id} marked reviewed`, { action: a.reviewed ? undefined : { label: "Undo", onClick: () => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, reviewed: false } : x))) } });
  };

  return (
    <>
      <PageHeader title="Anomaly Centre" description="Explainable detections from the rule & matching engine" />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={sev} onValueChange={setSev}>
          <TabsList>
            {["All", "Critical", "High", "Medium"].map((s) => (
              <TabsTrigger key={s} value={s} className="gap-1.5">{s}<span className="rounded-full bg-muted-foreground/15 px-1.5 text-[10px] tabular">{count(s)}</span></TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-56 bg-card"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All issue types</SelectItem>{Object.keys(typeIcon).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setShowReviewed(!showReviewed)}>{showReviewed ? "Hide reviewed" : "Show reviewed"}</Button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card-surface"><EmptyState title="Queue clear" description="No open anomalies match these filters. Nice work." /></div>
      ) : (
        <div className="space-y-3">
          {list.map((a) => {
            const Icon = typeIcon[a.type];
            return (
              <article key={a.id} className={cn("card-surface border-l-4 p-5 transition", a.severity === "Critical" ? "border-l-destructive" : a.severity === "High" ? "border-l-warning" : "border-l-info", a.reviewed && "opacity-60")}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted"><Icon className="size-5 text-foreground/70" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone={statusTone(a.severity)}>{a.severity}</Pill>
                      <span className="text-xs text-muted-foreground">{a.type}</span>
                      <span className="font-mono text-xs text-muted-foreground">· {a.id} · {a.detected}</span>
                      {a.reviewed && <Pill tone="success" dot={false}>Reviewed</Pill>}
                    </div>
                    <h3 className="mt-2 font-semibold">{a.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground"><span className="font-medium text-foreground">Why flagged: </span>{a.reason}</p>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Building2 className="size-3.5" /> {a.institution}</span>
                      <span><b className="text-foreground tabular">{fmt(a.impacted)}</b> impacted records</span>
                    </div>
                    <div className="mt-3 flex gap-2 rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground"><Lightbulb className="mt-0.5 size-4 shrink-0" /> {a.action}</div>
                  </div>
                  <div className="flex shrink-0 gap-2 lg:flex-col">
                    <Button size="sm" variant={a.reviewed ? "outline" : "default"} onClick={() => toggle(a.id)}>
                      {a.reviewed ? <><RotateCcw className="size-4" /> Reopen</> : <><CheckCircle2 className="size-4" /> Mark reviewed</>}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast.info(`Escalated ${a.id} to regional office (demo)`)}>Escalate</Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
