import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { UploadCloud, FileSpreadsheet, Download, Check, ArrowRight, ArrowLeft, Loader2, AlertTriangle, XCircle, Copy, Users, CircleCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Pill, DemoBadge, Th, Td } from "@/components/app/primitives";
import { institutions, fmt } from "@/lib/mock-data";
import { downloadCsv } from "@/lib/csv";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Data Upload — APAAR Setu" },
      { name: "description", content: "Guided workflow to map, validate and submit institution student data." },
      { property: "og:title", content: "Data Upload — APAAR Setu" },
      { property: "og:description", content: "Simulated bulk upload with field mapping and validation (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UploadPage,
});

const STEPS = ["Select institution & file", "Map fields", "Validate", "Review & submit"];
const FIELDS = [
  { src: "stud_id", target: "Student ID", sample: "AICTE-STU-250412" },
  { src: "apaar_no", target: "APAAR ID", sample: "•••• •••• 3391" },
  { src: "full_name", target: "Full name", sample: "Kavya Menon" },
  { src: "dob", target: "Date of birth", sample: "2006-03-14" },
  { src: "prog_code", target: "Programme", sample: "B.Tech" },
  { src: "caste_cat", target: "Category", sample: "OBC" },
  { src: "adm_year", target: "Enrollment year", sample: "2025" },
];
const TARGETS = ["Student ID", "APAAR ID", "Full name", "Date of birth", "Programme", "Category", "Enrollment year", "— Ignore —"];
const FINDINGS = [
  { icon: Copy, label: "Duplicate APAAR IDs", n: 18, tone: "danger" as const, d: "Same APAAR ID appears more than once in the file." },
  { icon: XCircle, label: "Missing / invalid APAAR", n: 64, tone: "danger" as const, d: "Blank or failing format check (simulated rule)." },
  { icon: Users, label: "Intake excess", n: 22, tone: "warning" as const, d: "B.Tech CSE enrolment exceeds approved intake of 180." },
  { icon: AlertTriangle, label: "Inconsistent data", n: 41, tone: "warning" as const, d: "DOB/enrollment year mismatch or unknown programme codes." },
];
const TOTAL = 4218;

function UploadPage() {
  const [step, setStep] = useState(0);
  const [inst, setInst] = useState("");
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [drag, setDrag] = useState(false);
  const [mapping, setMapping] = useState(FIELDS.map((f) => f.target));
  const [progress, setProgress] = useState(0);
  const [validating, setValidating] = useState(false);
  const [ack, setAck] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = (name: string, bytes: number) => {
    if (!/\.(csv|xlsx)$/i.test(name)) return toast.error("Only CSV or XLSX files are supported");
    setFile({ name, size: `${(bytes / 1024).toFixed(0)} KB` });
    toast.success("File staged locally", { description: "Contents are not read or uploaded in this demo." });
  };

  const runValidation = () => {
    setValidating(true); setProgress(0);
    const t = setInterval(() => setProgress((p) => {
      if (p >= 100) { clearInterval(t); setValidating(false); return 100; }
      return p + 8;
    }), 120);
  };

  const issues = FINDINGS.reduce((a, b) => a + b.n, 0);
  const reset = () => { setStep(0); setFile(null); setInst(""); setProgress(0); setAck(false); setDone(false); };

  return (
    <>
      <PageHeader title="Data Upload" description="Bulk-submit enrolment records for validation against AICTE rules" actions={<>
        <DemoBadge />
        <Button variant="outline" onClick={() => { downloadCsv("apaar-setu-template.csv", [{ stud_id: "AICTE-STU-000001", apaar_no: "000000000000", full_name: "Sample Student", dob: "2006-01-01", prog_code: "B.Tech", caste_cat: "General", adm_year: "2025" }]); toast.success("Sample template downloaded"); }}><Download className="size-4" /> Sample template</Button>
      </>} />

      <ol className="mb-6 grid gap-2 sm:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s} className={cn("flex items-center gap-3 rounded-lg border bg-card px-4 py-3", i === step && "border-ring ring-2 ring-ring/20")}>
            <span className={cn("grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold", i < step || done ? "bg-success text-success-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {i < step || done ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className={cn("text-sm", i === step ? "font-semibold" : "text-muted-foreground")}>{s}</span>
          </li>
        ))}
      </ol>

      {done ? (
        <Panel>
          <div className="flex flex-col items-center py-10 text-center">
            <div className="mb-4 grid size-14 place-items-center rounded-full bg-success/10"><CircleCheck className="size-7 text-success" /></div>
            <h2 className="text-lg font-semibold">Batch submitted (simulated)</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">Batch BATCH-7741 · {fmt(TOTAL - issues)} clean records queued for verification, {issues} returned to the institution for correction. Nothing left your browser.</p>
            <Button className="mt-6" onClick={reset}>Start new upload</Button>
          </div>
        </Panel>
      ) : (
        <Panel>
          {step === 0 && (
            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Institution</label>
                  <Select value={inst} onValueChange={setInst}>
                    <SelectTrigger><SelectValue placeholder="Choose institution" /></SelectTrigger>
                    <SelectContent>{institutions.slice(0, 15).map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg bg-muted/60 p-4 text-xs text-muted-foreground">
                  <p className="mb-1 font-medium text-foreground">Privacy note</p>
                  Files are never transmitted in this prototype. Use the demo dataset to explore the validation flow.
                </div>
              </div>
              <div>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) accept(f.name, f.size); }}
                  className={cn("flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition", drag ? "border-ring bg-accent" : "border-border bg-muted/30")}
                >
                  <div className="mb-3 grid size-12 place-items-center rounded-full bg-card shadow-card"><UploadCloud className="size-5 text-primary" /></div>
                  <p className="text-sm font-medium">Drag & drop CSV or XLSX</p>
                  <p className="mt-1 text-xs text-muted-foreground">Up to 50 MB · UTF-8 encoded</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>Browse files</Button>
                    <Button size="sm" variant="secondary" onClick={() => { setFile({ name: "demo_enrolment_ay2025-26.csv", size: "612 KB" }); if (!inst) setInst(institutions[0].id); toast.success("Demo dataset loaded"); }}>Use demo dataset</Button>
                  </div>
                  <input ref={inputRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) accept(f.name, f.size); }} />
                </div>
                {file && (
                  <div className="mt-4 flex items-center gap-3 rounded-lg border p-3">
                    <FileSpreadsheet className="size-8 text-success" />
                    <div className="flex-1"><p className="text-sm font-medium">{file.name}</p><p className="text-xs text-muted-foreground">{file.size} · {fmt(TOTAL)} rows detected (simulated)</p></div>
                    <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Remove</Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">We auto-detected 7 columns. Confirm how each maps to the APAAR Setu schema.</p>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full">
                  <thead className="border-b bg-muted/40"><tr><Th>Source column</Th><Th>Sample value</Th><Th /><Th>Target field</Th><Th>Status</Th></tr></thead>
                  <tbody className="divide-y">
                    {FIELDS.map((f, i) => (
                      <tr key={f.src}>
                        <Td className="font-mono text-xs">{f.src}</Td>
                        <Td className="text-muted-foreground">{f.sample}</Td>
                        <Td><ArrowRight className="size-4 text-muted-foreground" /></Td>
                        <Td>
                          <Select value={mapping[i]} onValueChange={(v) => setMapping((m) => m.map((x, j) => (j === i ? v : x)))}>
                            <SelectTrigger className="h-8 w-48"><SelectValue /></SelectTrigger>
                            <SelectContent>{TARGETS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                          </Select>
                        </Td>
                        <Td>{mapping[i] === "— Ignore —" ? <Pill tone="neutral">Ignored</Pill> : <Pill tone="success">Mapped</Pill>}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              {progress < 100 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  {validating ? <Loader2 className="mb-3 size-8 animate-spin text-primary" /> : <FileSpreadsheet className="mb-3 size-8 text-muted-foreground" />}
                  <p className="text-sm font-medium">{validating ? "Running validation rules…" : "Ready to validate " + fmt(TOTAL) + " records"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Schema · APAAR format · duplicates · intake limits · consistency</p>
                  {validating ? <Progress value={progress} className="mt-5 w-72" /> : <Button className="mt-5" onClick={runValidation}>Run validation</Button>}
                </div>
              ) : (
                <div>
                  <div className="mb-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">Total rows</p><p className="text-2xl font-semibold tabular">{fmt(TOTAL)}</p></div>
                    <div className="rounded-lg border border-success/30 bg-success/5 p-4"><p className="text-xs text-muted-foreground">Passed</p><p className="text-2xl font-semibold text-success tabular">{fmt(TOTAL - issues)}</p></div>
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4"><p className="text-xs text-muted-foreground">Issues found</p><p className="text-2xl font-semibold text-destructive tabular">{issues}</p></div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {FINDINGS.map((f) => (
                      <div key={f.label} className="flex gap-3 rounded-lg border p-4">
                        <f.icon className={cn("mt-0.5 size-5", f.tone === "danger" ? "text-destructive" : "text-warning")} />
                        <div className="flex-1"><div className="flex justify-between"><p className="text-sm font-medium">{f.label}</p><Pill tone={f.tone}>{f.n}</Pill></div><p className="mt-1 text-xs text-muted-foreground">{f.d}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <dl className="grid gap-4 rounded-lg border p-4 text-sm sm:grid-cols-2">
                <div><dt className="text-xs text-muted-foreground">Institution</dt><dd className="font-medium">{institutions.find((i) => i.id === inst)?.name}</dd></div>
                <div><dt className="text-xs text-muted-foreground">File</dt><dd className="font-medium">{file?.name}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Records to publish</dt><dd className="font-medium tabular">{fmt(TOTAL - issues)}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Returned for correction</dt><dd className="font-medium tabular text-destructive">{issues}</dd></div>
              </dl>
              <label className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 text-sm">
                <Checkbox checked={ack} onCheckedChange={(v) => setAck(!!v)} className="mt-0.5" />
                <span>I confirm student consent has been obtained for sharing these records, and understand this is a simulated submission.</span>
              </label>
            </div>
          )}

          <div className="mt-6 flex justify-between border-t pt-4">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft className="size-4" /> Back</Button>
            {step < 3 ? (
              <Button disabled={(step === 0 && (!file || !inst)) || (step === 2 && progress < 100)} onClick={() => setStep(step + 1)}>Continue <ArrowRight className="size-4" /></Button>
            ) : (
              <Button disabled={!ack} onClick={() => { setDone(true); toast.success("Batch submitted (simulated)"); }}>Submit batch</Button>
            )}
          </div>
        </Panel>
      )}
    </>
  );
}
