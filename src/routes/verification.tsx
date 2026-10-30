import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ShieldCheck, Loader2, CheckCircle2, XCircle, Clock, Database, Building2, GraduationCap, CalendarDays, FileCheck2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Pill, DemoBadge, EmptyState, statusTone } from "@/components/app/primitives";
import { students, maskApaar, type Student } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verification")({
  head: () => ({
    meta: [
      { title: "Verification — APAAR Setu" },
      { name: "description", content: "Verification workbench to check student records against APAAR identity (simulated)." },
      { property: "og:title", content: "Verification — APAAR Setu" },
      { property: "og:description", content: "Search by student or APAAR ID and run a simulated verification." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerificationPage,
});

type Result = { outcome: "Match" | "Mismatch" | "Consent required"; checks: { label: string; ok: boolean }[]; at: string };

function VerificationPage() {
  const [q, setQ] = useState("");
  const [rec, setRec] = useState<Student | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const find = (term = q) => {
    const t = term.trim().toLowerCase().replace(/\s/g, "");
    const s = students.find((x) => x.studentId.toLowerCase() === t || x.apaarId === t || x.studentId.toLowerCase().endsWith(t));
    setRec(s ?? null); setNotFound(!s); setResult(null);
  };

  const verify = () => {
    if (!rec) return;
    setRunning(true);
    setTimeout(() => {
      const consentOk = rec.consent === "Granted";
      const flagged = rec.status === "Flagged";
      setResult({
        outcome: !consentOk ? "Consent required" : flagged ? "Mismatch" : "Match",
        checks: [
          { label: "APAAR ID format", ok: true },
          { label: "Name & DOB match", ok: !flagged },
          { label: "Institution enrolment active", ok: true },
          { label: "No duplicate enrolment", ok: !flagged },
          { label: "Student consent on record", ok: consentOk },
        ],
        at: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      });
      setRunning(false);
      toast.success("Verification completed (simulated)");
    }, 1200);
  };

  const samples = [students[0], students.find((s) => s.status === "Flagged")!, students.find((s) => s.consent !== "Granted")!];

  return (
    <>
      <PageHeader title="Verification workbench" description="Look up a record and run a simulated identity check" actions={<DemoBadge label="Simulated verification · not connected to APAAR" />} />

      <Panel className="mb-6">
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); find(); }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Enter Student ID (e.g. AICTE-STU-250000) or 12-digit APAAR ID" className="h-11 pl-9" />
          </div>
          <Button type="submit" className="h-11">Look up record</Button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          Try:
          {samples.map((s) => (
            <button key={s.id} className="rounded-md border bg-muted/40 px-2 py-1 font-mono hover:bg-muted" onClick={() => { setQ(s.studentId); find(s.studentId); }}>{s.studentId}</button>
          ))}
        </div>
      </Panel>

      {notFound && <Panel><EmptyState title="No record found" description="Check the identifier and try again. Only the demo sample is searchable." /></Panel>}

      {!rec && !notFound && (
        <Panel><EmptyState title="Search to begin" description="Results show consent status, record provenance and a verification summary." /></Panel>
      )}

      {rec && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel className="lg:col-span-2" title={rec.name} description={rec.studentId} action={<Pill tone={statusTone(rec.status)}>{rec.status}</Pill>}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { i: ShieldCheck, l: "APAAR ID", v: <span className="font-mono">{maskApaar(rec.apaarId)}</span> },
                { i: Building2, l: "Institution", v: rec.institution },
                { i: GraduationCap, l: "Programme", v: rec.programme },
                { i: CalendarDays, l: "Enrollment year", v: rec.enrollmentYear },
                { i: Clock, l: "Last verified", v: rec.verifiedAt ?? "Never" },
                { i: Database, l: "Record source", v: rec.source },
              ].map((r) => (
                <div key={r.l} className="flex gap-3 rounded-lg border p-3">
                  <r.i className="mt-0.5 size-4 text-muted-foreground" />
                  <div><p className="text-xs text-muted-foreground">{r.l}</p><p className="text-sm font-medium">{r.v}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <h3 className="mb-3 text-sm font-semibold">Record provenance</h3>
              <ol className="space-y-3 border-l pl-4 text-sm">
                <li><p className="font-medium">Created via {rec.source}</p><p className="text-xs text-muted-foreground">{rec.enrollmentYear}-07-14 · by institution nodal officer</p></li>
                <li><p className="font-medium">Schema validation passed</p><p className="text-xs text-muted-foreground">Automated rule engine v2.3</p></li>
                <li><p className="font-medium">{rec.status === "Flagged" ? "Flagged by anomaly engine" : "Published to registry"}</p><p className="text-xs text-muted-foreground">{rec.verifiedAt ?? "Awaiting verification"}</p></li>
              </ol>
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel title="Consent status">
              <div className="flex items-center justify-between">
                <Pill tone={statusTone(rec.consent)}>{rec.consent}</Pill>
                <span className="text-xs text-muted-foreground">Purpose: academic verification</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{rec.consent === "Granted" ? "Student consent recorded via institution portal. Valid for AY 2025–26." : "Verification cannot proceed without explicit student consent."}</p>
            </Panel>

            <Panel title="Verification result" action={<DemoBadge label="Simulated" />}>
              {!result ? (
                <Button className="w-full" onClick={verify} disabled={running}>
                  {running ? <><Loader2 className="size-4 animate-spin" /> Verifying…</> : <><FileCheck2 className="size-4" /> Run verification</>}
                </Button>
              ) : (
                <div>
                  <div className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-sm font-semibold ${result.outcome === "Match" ? "bg-success/10 text-success" : result.outcome === "Mismatch" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning-foreground"}`}>
                    {result.outcome === "Match" ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />} {result.outcome}
                  </div>
                  <ul className="space-y-2">
                    {result.checks.map((c) => (
                      <li key={c.label} className="flex items-center gap-2 text-sm">
                        {c.ok ? <CheckCircle2 className="size-4 text-success" /> : <XCircle className="size-4 text-destructive" />}
                        <span className={c.ok ? "" : "text-destructive"}>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[11px] text-muted-foreground">Timestamp {result.at} · simulated result, not a real APAAR response</p>
                  <Button variant="outline" size="sm" className="mt-3 w-full" onClick={verify}>Re-run</Button>
                </div>
              )}
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}
