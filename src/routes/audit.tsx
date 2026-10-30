import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Pill, Th, Td, EmptyState, statusTone } from "@/components/app/primitives";
import { auditLog } from "@/lib/mock-data";
import { downloadCsv } from "@/lib/csv";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit Logs — APAAR Setu" },
      { name: "description", content: "Immutable trail of every access and action on student data." },
      { property: "og:title", content: "Audit Logs — APAAR Setu" },
      { property: "og:description", content: "Filterable audit trail of actors, actions and outcomes (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [outcome, setOutcome] = useState("all");
  const roles = [...new Set(auditLog.map((a) => a.role))];
  const rows = useMemo(() => auditLog.filter((a) => (role === "all" || a.role === role) && (outcome === "all" || a.outcome === outcome) && (!q || `${a.actor} ${a.action} ${a.entity}`.toLowerCase().includes(q.toLowerCase()))), [q, role, outcome]);

  return (
    <>
      <PageHeader title="Audit Logs" description="Append-only record of access to student data · IPs are fictional"
        actions={<Button variant="outline" onClick={() => { downloadCsv("audit-log.csv", rows.map(({ id, ...r }) => ({ id, ...r }))); toast.success(`Exported ${rows.length} entries`); }}><Download className="size-4" /> Export</Button>} />
      <div className="mb-4 flex items-center gap-2 rounded-lg border bg-accent px-4 py-2.5 text-sm text-accent-foreground"><ShieldCheck className="size-4" /> Every APAAR reveal, export and verification is logged with actor, purpose and outcome.</div>
      <Panel bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actor, action or entity" className="pl-9" /></div>
          <Select value={role} onValueChange={setRole}><SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All roles</SelectItem>{roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
          <Select value={outcome} onValueChange={setOutcome}><SelectTrigger className="md:w-40"><SelectValue /></SelectTrigger><SelectContent>{["all", "Success", "Warning", "Denied"].map((r) => <SelectItem key={r} value={r}>{r === "all" ? "All outcomes" : r}</SelectItem>)}</SelectContent></Select>
        </div>
        {rows.length === 0 ? <EmptyState title="No log entries" description="No entries match these filters." /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/40"><tr><Th>Timestamp</Th><Th>Actor</Th><Th>Action</Th><Th>Entity</Th><Th>IP</Th><Th>Outcome</Th></tr></thead>
              <tbody className="divide-y">
                {rows.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/40">
                    <Td className="whitespace-nowrap font-mono text-xs text-muted-foreground">{a.timestamp}</Td>
                    <Td><p className="font-medium">{a.actor}</p><p className="text-[11px] text-muted-foreground">{a.role}</p></Td>
                    <Td>{a.action}</Td>
                    <Td className="font-mono text-xs">{a.entity}</Td>
                    <Td className="font-mono text-xs text-muted-foreground">{a.ip}</Td>
                    <Td><Pill tone={statusTone(a.outcome)}>{a.outcome}</Pill></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
