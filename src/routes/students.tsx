import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Eye, EyeOff, ShieldAlert, Lock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Pill, Th, Td, EmptyState, DemoBadge, statusTone } from "@/components/app/primitives";
import { students, CATEGORIES, PROGRAMMES, maskApaar, formatApaar, type Student } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "Student Registry — APAAR Setu" },
      { name: "description", content: "Privacy-first registry of student records with masked APAAR IDs." },
      { property: "og:title", content: "Student Registry — APAAR Setu" },
      { property: "og:description", content: "Search and review student records with consent and verification status (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const { search, setSearch } = useAppState();
  const [prog, setProg] = useState("all");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [reveal, setReveal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [sel, setSel] = useState<Student | null>(null);
  const [page, setPage] = useState(0);
  const per = 15;

  const rows = useMemo(() => students.filter((s) =>
    (prog === "all" || s.programme === prog) && (cat === "all" || s.category === cat) && (status === "all" || s.status === status) &&
    (!search || `${s.name} ${s.studentId} ${s.institution} ${s.apaarId}`.toLowerCase().includes(search.toLowerCase()))), [search, prog, cat, status]);
  const pages = Math.max(1, Math.ceil(rows.length / per));
  const view = rows.slice(page * per, page * per + per);
  const apaar = (id: string) => (reveal ? formatApaar(id) : maskApaar(id));

  return (
    <>
      <PageHeader title="Student Registry" description="Showing a fictional sample of 120 records from 2.84M national records"
        actions={
          <label className="flex items-center gap-2.5 rounded-md border bg-card px-3 py-2 text-sm">
            {reveal ? <Eye className="size-4 text-warning-foreground" /> : <Lock className="size-4 text-muted-foreground" />}
            Reveal APAAR IDs
            <Switch checked={reveal} onCheckedChange={(v) => (v ? setConfirm(true) : (setReveal(false), toast("APAAR IDs masked again")))} aria-label="Reveal APAAR IDs" />
          </label>
        } />

      {reveal && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2.5 text-sm text-warning-foreground">
          <ShieldAlert className="size-4" /> APAAR IDs are visible. This access is recorded in the audit trail. <DemoBadge label="Fictional IDs" />
        </div>
      )}

      <Panel bodyClassName="p-0">
        <div className="grid gap-3 border-b p-4 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search name, student ID, institution" className="pl-9" />
          </div>
          <Select value={prog} onValueChange={(v) => { setProg(v); setPage(0); }}><SelectTrigger className="md:w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All programmes</SelectItem>{PROGRAMMES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
          <Select value={cat} onValueChange={(v) => { setCat(v); setPage(0); }}><SelectTrigger className="md:w-36"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All categories</SelectItem>{CATEGORIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}><SelectTrigger className="md:w-36"><SelectValue /></SelectTrigger>
            <SelectContent>{["all", "Verified", "Pending", "Flagged"].map((p) => <SelectItem key={p} value={p}>{p === "all" ? "All statuses" : p}</SelectItem>)}</SelectContent></Select>
        </div>
        {view.length === 0 ? <EmptyState title="No students found" description="Adjust filters or search terms." /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/40"><tr><Th>Student</Th><Th>APAAR ID</Th><Th>Institution</Th><Th>Programme</Th><Th>Category</Th><Th>Consent</Th><Th>Status</Th><Th /></tr></thead>
              <tbody className="divide-y">
                {view.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/40">
                    <Td><p className="font-medium">{s.name}</p><p className="font-mono text-[11px] text-muted-foreground">{s.studentId}</p></Td>
                    <Td className="whitespace-nowrap font-mono text-xs">{apaar(s.apaarId)}</Td>
                    <Td className="max-w-56 truncate text-muted-foreground">{s.institution}</Td>
                    <Td>{s.programme}</Td>
                    <Td className="text-muted-foreground">{s.category}</Td>
                    <Td><Pill tone={statusTone(s.consent)} dot={false}>{s.consent}</Pill></Td>
                    <Td><Pill tone={statusTone(s.status)}>{s.status}</Pill></Td>
                    <Td><Button size="sm" variant="ghost" onClick={() => setSel(s)}>View</Button></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
          <span>{rows.length} records · page {page + 1} of {pages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button size="sm" variant="outline" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </Panel>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reveal APAAR identifiers?</AlertDialogTitle>
            <AlertDialogDescription>APAAR IDs are sensitive personal identifiers. Only reveal them for a legitimate verification purpose. This demo uses fictional IDs, and the action would be logged against your account.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep masked</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setReveal(true); toast.warning("APAAR reveal logged to audit trail (demo)"); }}>Reveal & log access</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent className="sm:max-w-lg">
          {sel && (
            <>
              <DialogHeader>
                <DialogTitle>{sel.name}</DialogTitle>
                <DialogDescription className="font-mono">{sel.studentId}</DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                {[
                  ["APAAR ID", <span key="a" className="font-mono">{apaar(sel.apaarId)}</span>],
                  ["Verification", <Pill key="v" tone={statusTone(sel.status)}>{sel.status}</Pill>],
                  ["Institution", sel.institution], ["Programme", sel.programme],
                  ["Category", sel.category], ["Enrollment year", sel.enrollmentYear],
                  ["Consent", <Pill key="c" tone={statusTone(sel.consent)} dot={false}>{sel.consent}</Pill>], ["Source", sel.source],
                  ["Verified at", sel.verifiedAt ?? "—"],
                ].map(([k, v]) => (
                  <div key={String(k)}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>
                ))}
              </dl>
              {!reveal && <p className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground"><EyeOff className="size-3.5" /> APAAR masked. Use the registry toggle to reveal with audit logging.</p>}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
