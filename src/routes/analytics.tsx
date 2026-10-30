import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, FileText, FileBarChart, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app/primitives";
import { ACADEMIC_YEARS, CATEGORIES, PROGRAMMES, STATES, compact, fmt } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";
import { downloadCsv } from "@/lib/csv";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics & Reports — APAAR Setu" },
      { name: "description", content: "Enrolment trends, category distribution and intake utilization by state." },
      { property: "og:title", content: "Analytics & Reports — APAAR Setu" },
      { property: "og:description", content: "Filterable analytics and exportable reports on student data (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

const tooltipStyle = { borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 };
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 997, 7);

function AnalyticsPage() {
  const app = useAppState();
  const [state, setState] = useState("all");
  const [prog, setProg] = useState("all");
  const factor = useMemo(() => {
    let f = 1;
    if (state !== "all") f *= 0.06 + (hash(state) % 10) / 100;
    if (prog !== "all") f *= 0.1 + (hash(prog) % 30) / 100;
    if (app.year !== "2025–26") f *= app.year === "2024–25" ? 0.89 : 0.78;
    return f;
  }, [state, prog, app.year]);

  const trend = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"].map((y, i) => ({ year: y, enrolment: Math.round((1.62e6 + i * 0.2e6 + (i % 2) * 40000) * factor), female: Math.round((0.48e6 + i * 0.075e6) * factor) }));
  const cats = CATEGORIES.map((c, i) => ({ name: c, value: Math.round([41, 29, 15, 7, 8][i] * factor * 1000) }));
  const util = STATES.slice(0, 9).map((s) => { const h = hash(s + prog + app.year); return { state: s.length > 12 ? s.split(" ").map((w) => w[0]).join("") : s, util: 78 + (h % 30) }; });
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

  const exportCsv = () => {
    downloadCsv(`apaar-setu-report-${app.year}.csv`, util.map((u, i) => ({ academic_year: app.year, state: STATES[i], programme: prog === "all" ? "All" : prog, utilization_pct: u.util, enrolment: Math.round(trend[6].enrolment / 9) })));
    toast.success("Report exported", { description: "CSV generated from mock data." });
  };

  const reports = [
    { i: FileBarChart, t: "Enrolment summary", d: "Programme & state-wise enrolment for the selected year" },
    { i: ShieldCheck, t: "APAAR linkage compliance", d: "Institutions below 85% APAAR linkage" },
    { i: FileSpreadsheet, t: "Intake utilization", d: "Approved vs actual intake by programme" },
    { i: FileText, t: "Reservation & category", d: "Category-wise distribution against norms" },
  ];

  return (
    <>
      <PageHeader title="Analytics & Reports" description="Aggregated, anonymised indicators — no individual records are shown"
        actions={<Button onClick={exportCsv}><Download className="size-4" /> Export CSV</Button>} />

      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border bg-card p-3">
        <Select value={app.year} onValueChange={app.setYear}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent>{ACADEMIC_YEARS.map((y) => <SelectItem key={y} value={y}>AY {y}</SelectItem>)}</SelectContent></Select>
        <Select value={state} onValueChange={setState}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All states</SelectItem>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select value={prog} onValueChange={setProg}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All programmes</SelectItem>{PROGRAMMES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        {(state !== "all" || prog !== "all") && <Button variant="ghost" onClick={() => { setState("all"); setProg("all"); }}>Reset</Button>}
        <span className="ml-auto self-center text-xs text-muted-foreground">Total enrolment <b className="text-foreground tabular">{fmt(trend[6].enrolment)}</b></span>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Enrolment trend" description="Total and female enrolment, 2019–2025">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={trend} margin={{ left: -10 }}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.2} /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.25} /><stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickFormatter={compact} tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="enrolment" name="Total" stroke="var(--chart-1)" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="female" name="Female" stroke="var(--chart-2)" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Category distribution" description="Share of enrolled students">
          <div className="h-48">
            <ResponsiveContainer><PieChart><Pie data={cats} dataKey="value" innerRadius={50} outerRadius={78} paddingAngle={2} stroke="none">{cats.map((c, i) => <Cell key={c.name} fill={colors[i]} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} /></PieChart></ResponsiveContainer>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {cats.map((c, i) => <li key={c.name} className="flex items-center gap-2"><span className="size-2.5 rounded-sm" style={{ background: colors[i] }} /><span className="text-muted-foreground">{c.name}</span><span className="ml-auto font-medium tabular">{[41, 29, 15, 7, 8][i]}%</span></li>)}
          </ul>
        </Panel>
        <Panel className="xl:col-span-3" title="Intake utilization by state" description="Enrolled as % of approved intake · 100% = full">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={util} margin={{ left: -10 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="state" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" interval={0} />
                <YAxis domain={[0, 120]} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="util" name="Utilization" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {util.map((u) => <Cell key={u.state} fill={u.util > 100 ? "var(--chart-4)" : "var(--chart-1)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold">Standard reports</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reports.map((r) => (
          <div key={r.t} className="card-surface flex flex-col p-5">
            <r.i className="size-5 text-primary" />
            <p className="mt-3 text-sm font-semibold">{r.t}</p>
            <p className="mt-1 flex-1 text-xs text-muted-foreground">{r.d}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={exportCsv}><Download className="size-3.5" /> Download</Button>
          </div>
        ))}
      </div>
    </>
  );
}
