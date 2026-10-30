import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark, Server, GraduationCap, FileLock2, Copy, Eye, EyeOff, RefreshCw, Webhook } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Pill, DemoBadge, Th, Td, statusTone } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "API & Integrations — APAAR Setu" },
      { name: "description", content: "Concept and sandbox integrations with AICTE portal, institution ERP, ABC and DigiLocker." },
      { property: "og:title", content: "API & Integrations — APAAR Setu" },
      { property: "og:description", content: "Sandbox API keys, webhooks and proposed integrations (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IntegrationsPage,
});

const cards = [
  { i: Landmark, n: "AICTE Portal", d: "Institution master, approvals and intake data.", s: "Sandbox", tone: "info" as const },
  { i: Server, n: "Institution ERP / SIS", d: "Scheduled push of enrolment records via REST.", s: "Sandbox", tone: "info" as const },
  { i: GraduationCap, n: "APAAR / Academic Bank of Credits", d: "Identity lookup & credit linkage.", s: "Proposed", tone: "warning" as const },
  { i: FileLock2, n: "DigiLocker", d: "Consent-based document issuance.", s: "Proposed", tone: "warning" as const },
];
const events = [
  { e: "record.verified", t: "09:12:41", c: 200, ms: 142 },
  { e: "batch.submitted", t: "09:08:03", c: 200, ms: 211 },
  { e: "anomaly.created", t: "08:57:19", c: 200, ms: 98 },
  { e: "record.verified", t: "08:41:55", c: 502, ms: 3004 },
  { e: "institution.synced", t: "08:30:00", c: 200, ms: 176 },
];
const KEY = "sk_sandbox_apsetu_7f3a9c21e84b4d0f";

function IntegrationsPage() {
  const [show, setShow] = useState(false);
  const [key, setKey] = useState(KEY);
  return (
    <>
      <PageHeader title="API & Integrations" description="Integration concepts and sandbox endpoints. None of these are live connections." actions={<DemoBadge label="Concept / Sandbox" />} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.n} className="card-surface flex flex-col p-5">
            <div className="flex items-start justify-between"><div className="grid size-10 place-items-center rounded-lg bg-muted"><c.i className="size-5" /></div><Pill tone={c.tone}>{c.s}</Pill></div>
            <p className="mt-4 text-sm font-semibold">{c.n}</p>
            <p className="mt-1 flex-1 text-xs text-muted-foreground">{c.d}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => toast.info(`${c.n}: ${c.s === "Proposed" ? "concept only — no connection available" : "sandbox ping OK (simulated)"}`)}>{c.s === "Proposed" ? "View concept" : "Test connection"}</Button>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Sandbox API key" description="Demo key — not valid against any real service">
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5 font-mono text-sm">
            <span className="flex-1 truncate">{show ? key : `${key.slice(0, 14)}••••••••••••${key.slice(-4)}`}</span>
            <button aria-label={show ? "Hide key" : "Show key"} className="rounded p-1 hover:bg-muted" onClick={() => setShow(!show)}>{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
            <button aria-label="Copy key" className="rounded p-1 hover:bg-muted" onClick={() => { navigator.clipboard?.writeText(key); toast.success("Key copied"); }}><Copy className="size-4" /></button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Scopes: records:read, batches:write · Created 12 Sep 2026</span>
            <Button size="sm" variant="ghost" onClick={() => { setKey(`sk_sandbox_apsetu_${Math.random().toString(16).slice(2, 18)}`); toast.success("Key rotated (logged)"); }}><RefreshCw className="size-3.5" /> Rotate</Button>
          </div>
        </Panel>

        <Panel title="Webhook events" description="https://erp.demo-institute.local/hooks/apaar" bodyClassName="p-0" action={<Webhook className="size-4 text-muted-foreground" />}>
          <table className="w-full">
            <thead className="border-b bg-muted/40"><tr><Th>Event</Th><Th>Time</Th><Th>Status</Th><Th className="text-right">Latency</Th></tr></thead>
            <tbody className="divide-y">
              {events.map((e, i) => (
                <tr key={i}><Td className="font-mono text-xs">{e.e}</Td><Td className="text-xs text-muted-foreground">{e.t}</Td><Td><Pill tone={statusTone(e.c === 200 ? "Success" : "Denied")}>{e.c}</Pill></Td><Td className="text-right text-xs tabular">{e.ms} ms</Td></tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel className="mt-6" title="Docs snippets" description="Illustrative sandbox API">
        <Tabs defaultValue="curl">
          <TabsList><TabsTrigger value="curl">cURL</TabsTrigger><TabsTrigger value="js">JavaScript</TabsTrigger><TabsTrigger value="hook">Webhook payload</TabsTrigger></TabsList>
          {[
            ["curl", `curl https://sandbox.apaarsetu.example/v1/records/verify \\\n  -H "Authorization: Bearer sk_sandbox_…" \\\n  -d '{"student_id":"AICTE-STU-250000","consent_ref":"CNS-8812"}'`],
            ["js", `const res = await fetch("https://sandbox.apaarsetu.example/v1/batches", {\n  method: "POST",\n  headers: { Authorization: \`Bearer \${KEY}\` },\n  body: formData, // CSV or XLSX\n});\nconst { batch_id, status } = await res.json();`],
            ["hook", `{\n  "event": "record.verified",\n  "student_id": "AICTE-STU-250000",\n  "apaar_last4": "3391",\n  "outcome": "match",\n  "simulated": true\n}`],
          ].map(([v, code]) => (
            <TabsContent key={v} value={v}>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-sidebar p-4 font-mono text-xs leading-relaxed text-sidebar-foreground">{code}</pre>
            </TabsContent>
          ))}
        </Tabs>
      </Panel>
    </>
  );
}
