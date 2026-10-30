import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Minus, ShieldCheck, Lock, Clock, Archive } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Th, Td } from "@/components/app/primitives";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — APAAR Setu" },
      { name: "description", content: "Role-based access, consent, security and retention settings." },
      { property: "og:title", content: "Settings — APAAR Setu" },
      { property: "og:description", content: "Least-privilege roles, privacy and retention policies (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const ROLES = ["AICTE Admin", "Institution Admin", "Verifier", "Auditor"];
const PERMS: [string, boolean[]][] = [
  ["View national dashboard", [true, false, false, true]],
  ["Upload institution data", [false, true, false, false]],
  ["View masked records", [true, true, true, true]],
  ["Reveal full APAAR ID", [true, false, true, false]],
  ["Run verification", [true, false, true, false]],
  ["Resolve anomalies", [true, false, true, false]],
  ["Export reports", [true, true, false, true]],
  ["View audit logs", [true, false, false, true]],
  ["Manage roles & API keys", [true, false, false, false]],
];

function SettingsPage() {
  const [prefs, setPrefs] = useState({ consentRequired: true, maskDefault: true, purposeOnReveal: true, notifyStudent: false, mfa: true, ipAllow: false });
  const [timeout, setTimeoutV] = useState("15");
  const set = (k: keyof typeof prefs) => (v: boolean) => { setPrefs((p) => ({ ...p, [k]: v })); toast.success("Setting updated (local demo)"); };

  const Row = ({ k, t, d }: { k: keyof typeof prefs; t: string; d: string }) => (
    <div className="flex items-start justify-between gap-4 py-3">
      <div><p className="text-sm font-medium">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
      <Switch checked={prefs[k]} onCheckedChange={set(k)} aria-label={t} />
    </div>
  );

  return (
    <>
      <PageHeader title="Settings" description="Access control, privacy and governance policies" />
      <Panel title="Role-based access" description="Least-privilege matrix — each role sees only what its function requires" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/40"><tr><Th>Permission</Th>{ROLES.map((r) => <Th key={r} className="text-center">{r}</Th>)}</tr></thead>
            <tbody className="divide-y">
              {PERMS.map(([p, v]) => (
                <tr key={p}><Td>{p}</Td>{v.map((ok, i) => <Td key={i} className="text-center">{ok ? <Check className="mx-auto size-4 text-success" aria-label="Allowed" /> : <Minus className="mx-auto size-4 text-muted-foreground/50" aria-label="Not allowed" />}</Td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Consent & privacy" action={<ShieldCheck className="size-4 text-success" />} bodyClassName="divide-y px-5 py-2">
          <Row k="consentRequired" t="Require consent before verification" d="Block verification if student consent is not on record." />
          <Row k="maskDefault" t="Mask APAAR IDs by default" d="Show only the last 4 digits across the app." />
          <Row k="purposeOnReveal" t="Require purpose on reveal" d="Prompt for a stated purpose; logged to audit trail." />
          <Row k="notifyStudent" t="Notify student on access" d="Send a notice when a verifier views a record (proposed)." />
        </Panel>
        <Panel title="Session & security" action={<Lock className="size-4 text-muted-foreground" />} bodyClassName="divide-y px-5 py-2">
          <Row k="mfa" t="Enforce multi-factor authentication" d="Required for all admin and verifier roles." />
          <Row k="ipAllow" t="Restrict to allow-listed networks" d="Only permit access from registered office IP ranges." />
          <div className="flex items-center justify-between gap-4 py-3">
            <div><p className="text-sm font-medium">Idle session timeout</p><p className="text-xs text-muted-foreground">Sign out inactive sessions automatically.</p></div>
            <Select value={timeout} onValueChange={(v) => { setTimeoutV(v); toast.success(`Timeout set to ${v} minutes`); }}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>{["5", "15", "30", "60"].map((m) => <SelectItem key={m} value={m}>{m} minutes</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </Panel>
      </div>

      <Panel className="mt-6" title="Data retention policy" description="Descriptive policy for this prototype">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { i: Archive, t: "Student records", d: "Retained for programme duration + 7 years, then archived in anonymised form." },
            { i: Clock, t: "Upload files", d: "Raw files purged within 30 days after successful validation." },
            { i: ShieldCheck, t: "Audit logs", d: "Append-only, retained for 10 years for accountability and RTI." },
          ].map((p) => (
            <div key={p.t} className="rounded-lg border p-4"><p.i className="size-5 text-primary" /><p className="mt-3 text-sm font-semibold">{p.t}</p><p className="mt-1 text-xs text-muted-foreground">{p.d}</p></div>
          ))}
        </div>
        <div className="mt-4 flex justify-end"><Button onClick={() => toast.success("Policy saved locally (demo)")}>Save policies</Button></div>
      </Panel>
    </>
  );
}
