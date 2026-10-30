import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, Building2, Users, ShieldCheck, AlertTriangle, UploadCloud, CheckCircle2, Flag, Landmark, ArrowRight, Activity } from "lucide-react";
import { Panel, Pill, Meter, Th, Td, statusTone } from "@/components/app/primitives";
import { compact, fmt, institutions, kpis, monthlySubmissions, recentActivity, sparks, verificationSplit } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — APAAR Setu" },
      { name: "description", content: "National dashboard of AICTE student records, APAAR verification status and data quality." },
      { property: "og:title", content: "Overview — APAAR Setu" },
      { property: "og:description", content: "National student identity dashboard for AICTE-approved institutions (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

const tooltipStyle = { borderRadius: 8, border: "1px solid var(--border)", boxShadow: "var(--shadow-elevated-v)", fontSize: 12 };

function Spark({ data, color }: { data: number[]; color: string }) {
  const d = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={d} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={`sp-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`var(--${color})`} stopOpacity={0.25} />
            <stop offset="100%" stopColor={`var(--${color})`} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={`var(--${color})`} strokeWidth={1.75} fill={`url(#sp-${color})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function Kpi({ label, value, delta, up, good, icon: Icon, spark, color, note }: {
  label: string; value: string; delta: string; up: boolean; good: boolean; icon: typeof Users; spark: number[]; color: string; note?: string;
}) {
  return (
    <div className="card-surface p-5 transition hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <div className="grid size-8 place-items-center rounded-md bg-muted"><Icon className="size-4 text-foreground/70" /></div>
      </div>
      <p className="mt-3 text-[28px] font-semibold leading-none tracking-tight tabular">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className={cn("inline-flex items-center gap-0.5 font-medium", good ? "text-success" : "text-destructive")}>
          {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}{delta}
        </span>
        <span className="text-muted-foreground">{note ?? "vs last AY"}</span>
      </div>
      <div className="mt-3"><Spark data={spark} color={color} /></div>
    </div>
  );
}

const activityIcon = { upload: UploadCloud, verify: CheckCircle2, flag: Flag, onboard: Landmark };

function Overview() {
  const { year } = useAppState();
  const total = verificationSplit.reduce((a, b) => a + b.value, 0);
  const top = [...institutions].sort((a, b) => b.enrolled - a.enrolled).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good afternoon, Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">National student identity • AICTE-approved institutions</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border bg-card px-4 py-2.5 text-xs">
          <span className="flex items-center gap-2">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" /><span className="relative size-2 rounded-full bg-success" /></span>
            <span className="font-semibold uppercase tracking-wider text-muted-foreground">System status</span>
            <span className="font-medium text-success">Operational</span>
          </span>
          <span className="h-4 w-px bg-border" />
          <span className="text-muted-foreground">Last sync <span className="font-medium text-foreground">2 min ago</span></span>
          <span className="h-4 w-px bg-border" />
          <span className="font-medium">AY {year}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total Institutions" value={fmt(kpis.institutions)} delta="+4.8%" up good icon={Building2} spark={sparks.institutions} color="chart-1" />
        <Kpi label="Student Records" value="2.84M" delta="+12.6%" up good icon={Users} spark={sparks.students} color="chart-5" />
        <Kpi label="APAAR Verified" value="2.61M" delta="91.9%" up good icon={ShieldCheck} spark={sparks.verified} color="chart-2" note="of all records" />
        <Kpi label="Validation Issues" value={fmt(kpis.issues)} delta="Needs attention" up={false} good={false} icon={AlertTriangle} spark={sparks.issues} color="chart-4" note="" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Enrolment submissions" description="Monthly records submitted vs APAAR-verified, Jan–Jun"
          action={<div className="flex gap-4 text-xs text-muted-foreground"><span><b className="text-foreground tabular">2.84M</b> submitted</span><span><b className="text-foreground tabular">2.61M</b> verified</span></div>}>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={monthlySubmissions} barGap={4} margin={{ left: -10 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickFormatter={compact} tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Bar dataKey="submitted" name="Submitted" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="verified" name="Verified" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Verification status" description="All student records, AY to date">
          <div className="relative h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={verificationSplit} dataKey="value" innerRadius={58} outerRadius={80} paddingAngle={2} stroke="none">
                  {verificationSplit.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div><p className="text-2xl font-semibold tabular">91.9%</p><p className="text-[11px] text-muted-foreground">verified</p></div>
            </div>
          </div>
          <ul className="mt-4 space-y-2.5">
            {verificationSplit.map((s) => (
              <li key={s.name} className="flex items-center gap-3 text-sm">
                <span className="size-2.5 rounded-sm" style={{ background: s.color }} />
                <span className="flex-1 text-muted-foreground">{s.name}</span>
                <span className="font-medium tabular">{compact(s.value)}</span>
                <span className="w-12 text-right text-xs text-muted-foreground tabular">{((s.value / total) * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold">Priority actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "247", t: "Intake breaches", d: "Programmes enrolling beyond AICTE-approved intake.", tone: "border-l-destructive", to: "/anomalies" as const },
            { n: "1,382", t: "Missing APAAR IDs", d: "Records submitted without a linked APAAR identifier.", tone: "border-l-warning", to: "/students" as const },
            { n: "86", t: "Cross-institution matches", d: "Same identity active at more than one institution.", tone: "border-l-info", to: "/anomalies" as const },
          ].map((p) => (
            <Link key={p.t} to={p.to} className={cn("card-surface group flex items-start justify-between gap-3 border-l-4 p-5 transition hover:shadow-elevated", p.tone)}>
              <div>
                <p className="text-2xl font-semibold tabular">{p.n}</p>
                <p className="mt-0.5 text-sm font-medium">{p.t}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.d}</p>
              </div>
              <ArrowRight className="mt-1 size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Data quality & compliance" description="National averages, AY to date">
          <div className="space-y-5">
            {[
              { l: "APAAR linked", v: 91.9, tone: "success" as const },
              { l: "Institution submissions", v: 84.3, tone: "primary" as const },
              { l: "Intake compliance", v: 97.1, tone: "success" as const },
              { l: "Consent captured", v: 88.6, tone: "warning" as const },
            ].map((m) => (
              <div key={m.l}>
                <div className="mb-1.5 flex justify-between text-sm"><span className="text-muted-foreground">{m.l}</span><span className="font-medium tabular">{m.v}%</span></div>
                <Meter value={m.v} tone={m.tone} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent activity" className="xl:col-span-1" action={<Link to="/audit" className="text-xs font-medium text-primary hover:underline">View audit log</Link>}>
          <ol className="relative space-y-5 before:absolute before:inset-y-1 before:left-[15px] before:w-px before:bg-border">
            {recentActivity.map((a, i) => {
              const Icon = activityIcon[a.kind];
              return (
                <li key={i} className="relative flex gap-3">
                  <span className={cn("relative z-10 grid size-8 shrink-0 place-items-center rounded-full border bg-card", a.kind === "flag" && "text-destructive", a.kind === "verify" && "text-success")}>
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                  </div>
                  <span className="whitespace-nowrap text-[11px] text-muted-foreground">{a.time}</span>
                </li>
              );
            })}
          </ol>
        </Panel>

        <Panel title="Submission pipeline" description="Records moving through validation today">
          <div className="space-y-4">
            {[
              { l: "Received", v: 48210 }, { l: "Schema validated", v: 46980 }, { l: "APAAR matched (simulated)", v: 44105 }, { l: "Published to registry", v: 43870 },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center gap-3">
                <span className="grid size-6 place-items-center rounded-full bg-muted text-[11px] font-semibold">{i + 1}</span>
                <span className="flex-1 text-sm text-muted-foreground">{s.l}</span>
                <span className="text-sm font-medium tabular">{fmt(s.v)}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-xs text-accent-foreground"><Activity className="size-3.5" /> 91.0% end-to-end pass rate</div>
          </div>
        </Panel>
      </div>

      <Panel title="Top institutions by enrolment" bodyClassName="p-0" action={<Link to="/institutions" className="text-xs font-medium text-primary hover:underline">All institutions</Link>}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/40"><tr><Th>Institution</Th><Th>State</Th><Th className="text-right">Approved intake</Th><Th className="text-right">Enrolled</Th><Th>Utilization</Th><Th>Status</Th></tr></thead>
            <tbody className="divide-y">
              {top.map((i) => {
                const u = (i.enrolled / i.approvedIntake) * 100;
                return (
                  <tr key={i.id} className="hover:bg-muted/40">
                    <Td><p className="font-medium">{i.name}</p><p className="font-mono text-[11px] text-muted-foreground">{i.aicteId}</p></Td>
                    <Td className="text-muted-foreground">{i.state}</Td>
                    <Td className="text-right tabular">{fmt(i.approvedIntake)}</Td>
                    <Td className="text-right tabular">{fmt(i.enrolled)}</Td>
                    <Td><div className="flex w-36 items-center gap-2"><Meter value={u} tone={u > 100 ? "danger" : u > 92 ? "warning" : "success"} /><span className="w-10 text-xs tabular">{u.toFixed(0)}%</span></div></Td>
                    <Td><Pill tone={statusTone(i.status)}>{i.status}</Pill></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
