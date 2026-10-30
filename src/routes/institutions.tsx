import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, Building2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Pill, Meter, Th, Td, EmptyState, statusTone } from "@/components/app/primitives";
import { institutions, STATES, fmt, type Institution } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { downloadCsv } from "@/lib/csv";

export const Route = createFileRoute("/institutions")({
  head: () => ({
    meta: [
      { title: "Institutions — APAAR Setu" },
      { name: "description", content: "AICTE-approved institutions, intake, enrolment and submission status." },
      { property: "og:title", content: "Institutions — APAAR Setu" },
      { property: "og:description", content: "Searchable directory of AICTE institutions with intake utilization (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InstitutionsPage,
});

function InstitutionsPage() {
  const [q, setQ] = useState("");
  const [state, setState] = useState("all");
  const [status, setStatus] = useState("all");
  const [sel, setSel] = useState<Institution | null>(null);

  const rows = useMemo(() => institutions.filter((i) =>
    (state === "all" || i.state === state) && (status === "all" || i.status === status) &&
    (!q || `${i.name} ${i.aicteId}`.toLowerCase().includes(q.toLowerCase()))), [q, state, status]);

  return (
    <>
      <PageHeader title="Institutions" description={`${institutions.length} institutions shown in this demo sample of 8,462 nationally`}
        actions={<Button variant="outline" onClick={() => { downloadCsv("institutions.csv", rows.map((i) => ({ name: i.name, aicte_id: i.aicteId, state: i.state, intake: i.approvedIntake, enrolled: i.enrolled, status: i.status }))); toast.success(`Exported ${rows.length} institutions`); }}><Download className="size-4" /> Export CSV</Button>} />

      <Panel bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or AICTE ID" className="pl-9" />
          </div>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="md:w-48"><SelectValue placeholder="State" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All states</SelectItem>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="md:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>{["all", "Submitted", "Pending", "Partial", "Overdue"].map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All statuses" : s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {rows.length === 0 ? <EmptyState title="No institutions match" description="Try clearing filters or a different search." /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/40"><tr><Th>Institution</Th><Th>AICTE ID</Th><Th>State</Th><Th>Programmes</Th><Th className="text-right">Intake</Th><Th className="text-right">Enrolled</Th><Th>Submission</Th><Th>Last sync</Th></tr></thead>
              <tbody className="divide-y">
                {rows.map((i) => (
                  <tr key={i.id} onClick={() => setSel(i)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSel(i)} className="cursor-pointer hover:bg-muted/40 focus:bg-muted/40 focus:outline-none">
                    <Td><p className="font-medium">{i.name}</p><p className="text-[11px] text-muted-foreground">{i.type}</p></Td>
                    <Td className="font-mono text-xs text-muted-foreground">{i.aicteId}</Td>
                    <Td className="text-muted-foreground">{i.state}</Td>
                    <Td><div className="flex flex-wrap gap-1">{i.programmes.map((p) => <span key={p.name} className="rounded bg-muted px-1.5 py-0.5 text-[11px]">{p.name}</span>)}</div></Td>
                    <Td className="text-right tabular">{fmt(i.approvedIntake)}</Td>
                    <Td className={`text-right tabular ${i.enrolled > i.approvedIntake ? "font-semibold text-destructive" : ""}`}>{fmt(i.enrolled)}</Td>
                    <Td><Pill tone={statusTone(i.status)}>{i.status}</Pill></Td>
                    <Td className="whitespace-nowrap text-xs text-muted-foreground">{i.lastSync}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {sel && (
            <>
              <SheetHeader>
                <div className="mb-2 grid size-10 place-items-center rounded-lg bg-muted"><Building2 className="size-5" /></div>
                <SheetTitle>{sel.name}</SheetTitle>
                <SheetDescription className="flex items-center gap-1"><MapPin className="size-3" /> {sel.state} · <span className="font-mono">{sel.aicteId}</span></SheetDescription>
              </SheetHeader>
              <div className="space-y-6 px-4 pb-6">
                <div className="grid grid-cols-3 gap-3">
                  {[["Approved intake", fmt(sel.approvedIntake)], ["Enrolled", fmt(sel.enrolled)], ["Utilization", `${((sel.enrolled / sel.approvedIntake) * 100).toFixed(0)}%`]].map(([l, v]) => (
                    <div key={l} className="rounded-lg border p-3"><p className="text-[11px] text-muted-foreground">{l}</p><p className="mt-1 text-lg font-semibold tabular">{v}</p></div>
                  ))}
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Programme breakdown</h3>
                  <div className="space-y-4">
                    {sel.programmes.map((p) => {
                      const u = (p.enrolled / p.intake) * 100;
                      return (
                        <div key={p.name}>
                          <div className="mb-1.5 flex justify-between text-sm"><span className="font-medium">{p.name}</span><span className="text-muted-foreground tabular">{p.enrolled} / {p.intake}</span></div>
                          <Meter value={u} tone={u > 100 ? "danger" : u > 92 ? "warning" : "success"} />
                          {u > 100 && <p className="mt-1 text-xs text-destructive">Exceeds approved intake by {p.enrolled - p.intake}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <span className="text-muted-foreground">Submission status</span><Pill tone={statusTone(sel.status)}>{sel.status}</Pill>
                </div>
                <Button className="w-full" onClick={() => toast.success("Reminder queued (demo)", { description: `Nudge sent to ${sel.name} nodal officer.` })}>Send submission reminder</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
