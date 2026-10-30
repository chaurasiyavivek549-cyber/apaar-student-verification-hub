import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Building2, Users, UploadCloud, ShieldCheck, AlertTriangle, BarChart3,
  Plug, ScrollText, Settings, Bell, HelpCircle, Search, Menu, ChevronRight, LogOut, User,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAppState } from "@/lib/app-state";
import { ACADEMIC_YEARS, anomalies } from "@/lib/mock-data";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/institutions", label: "Institutions", icon: Building2 },
  { to: "/students", label: "Student Registry", icon: Users },
  { to: "/upload", label: "Data Upload", icon: UploadCloud },
  { to: "/verification", label: "Verification", icon: ShieldCheck },
  { to: "/anomalies", label: "Anomaly Centre", icon: AlertTriangle, badge: anomalies.filter((a) => !a.reviewed).length },
  { to: "/analytics", label: "Analytics & Reports", icon: BarChart3 },
  { to: "/integrations", label: "API & Integrations", icon: Plug },
  { to: "/audit", label: "Audit Logs", icon: ScrollText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Logo() {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <div className="grid size-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M3 17c3-6 15-6 18 0" /><path d="M6 17v3M12 13v7M18 17v3" /><circle cx="12" cy="6" r="2.2" />
        </svg>
      </div>
      <div className="leading-tight">
        <p className="text-[15px] font-semibold tracking-tight text-sidebar-accent-foreground">APAAR Setu</p>
        <p className="text-[10.5px] text-sidebar-muted">AICTE Student Data Intelligence</p>
      </div>
    </div>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Logo />
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4" aria-label="Main">
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted">Workspace</p>
        {NAV.map((item) => {
          const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              {active && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sidebar-primary" />}
              <Icon className={cn("size-4", active ? "text-sidebar-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground")} />
              <span className="flex-1">{item.label}</span>
              {"badge" in item && item.badge ? (
                <span className="rounded-full bg-destructive/90 px-1.5 text-[10px] font-semibold text-destructive-foreground">{item.badge}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/60 p-3">
          <div className="grid size-9 place-items-center rounded-full bg-sidebar-primary/20 text-xs font-semibold text-sidebar-primary">AA</div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-sidebar-accent-foreground">AICTE Admin</p>
            <p className="truncate text-[11px] text-sidebar-muted">Central Monitoring</p>
          </div>
          <span className="size-2 rounded-full bg-sidebar-primary" title="Session active" />
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { year, setYear, notifications, markAllRead, search, setSearch } = useAppState();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = NAV.find((n) => (n.to === "/" ? path === "/" : path.startsWith(n.to)));
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen w-full">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block"><SidebarNav /></aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 border-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur sm:px-6">
          <button className="rounded-md p-2 hover:bg-muted lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
            <Menu className="size-5" />
          </button>
          <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm md:flex">
            <span className="text-muted-foreground">APAAR Setu</span>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">{current?.label ?? "Page"}</span>
          </nav>

          <form
            className="relative ml-auto w-full max-w-xs"
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/students" }); }}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students, IDs, institutions…"
              aria-label="Global search"
              className="h-9 w-full rounded-md border bg-card pl-9 pr-12 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border bg-muted px-1.5 text-[10px] text-muted-foreground sm:block">↵</kbd>
          </form>

          <Select value={year} onValueChange={(v) => { setYear(v); toast.success(`Academic year switched to ${v}`); }}>
            <SelectTrigger className="hidden h-9 w-[130px] bg-card sm:flex" aria-label="Academic year"><SelectValue /></SelectTrigger>
            <SelectContent>{ACADEMIC_YEARS.map((y) => <SelectItem key={y} value={y}>AY {y}</SelectItem>)}</SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <button className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={`Notifications, ${unread} unread`}>
                <Bell className="size-[18px]" />
                {unread > 0 && <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">{unread}</span>}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <button className="text-xs font-medium text-accent-foreground hover:underline" onClick={markAllRead}>Mark all read</button>
              </div>
              <ul className="max-h-80 divide-y overflow-y-auto">
                {notifications.map((n) => (
                  <li key={n.id} className="flex gap-3 px-4 py-3 hover:bg-muted/50">
                    <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.unread ? "bg-destructive" : "bg-border")} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.body}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{n.time}</span>
                  </li>
                ))}
              </ul>
              <Link to="/anomalies" className="block border-t px-4 py-2.5 text-center text-xs font-medium text-primary hover:bg-muted/50">Open Anomaly Centre</Link>
            </PopoverContent>
          </Popover>

          <button className="hidden rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground sm:block" aria-label="Help" onClick={() => setHelpOpen(true)}>
            <HelpCircle className="size-[18px]" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="grid size-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">AA</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel><p className="text-sm">AICTE Admin</p><p className="text-xs font-normal text-muted-foreground">admin@demo.aicte.local</p></DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}><User className="size-4" /> Profile & roles</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/audit" })}><ScrollText className="size-4" /> My activity</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info("Demo prototype — there is no real session to sign out of.")}><LogOut className="size-4" /> Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="border-b border-warning/30 bg-warning/10 px-4 py-1.5 text-center text-[11.5px] text-warning-foreground sm:px-6">
          Frontend prototype with fictional data. No real APAAR validation, government integration or data persistence.
        </div>

        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help & shortcuts</DialogTitle>
            <DialogDescription>APAAR Setu demo prototype guide.</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use the sidebar to switch between modules — no page reloads.</li>
            <li>• Global search jumps to the Student Registry with your query.</li>
            <li>• APAAR IDs are masked by default; revealing is logged to the audit trail.</li>
            <li>• Uploads, verifications and integrations are simulated in the browser.</li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
