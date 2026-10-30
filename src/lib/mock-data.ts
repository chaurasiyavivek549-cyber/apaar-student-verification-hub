// Seeded, fictional demo data. Nothing here reflects real students or institutions.

export type SubmissionStatus = "Submitted" | "Pending" | "Overdue" | "Partial";
export type VerificationStatus = "Verified" | "Pending" | "Flagged";
export type Severity = "Critical" | "High" | "Medium";

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const r = rng(42);
const pick = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)];

export const STATES = [
  "Maharashtra", "Tamil Nadu", "Karnataka", "Uttar Pradesh", "Telangana",
  "Andhra Pradesh", "Gujarat", "Rajasthan", "West Bengal", "Madhya Pradesh", "Kerala", "Delhi",
] as const;
export const PROGRAMMES = ["B.Tech", "M.Tech", "MBA", "MCA", "Diploma", "B.Arch", "PGDM"] as const;
export const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"] as const;
export const ACADEMIC_YEARS = ["2025–26", "2024–25", "2023–24"] as const;

const instPrefixes = ["Sri Venkateswara", "Rajiv Gandhi", "Shivaji", "Vidya Bharati", "Govind Ballabh", "Saraswati", "Lokmanya Tilak", "Dr. Ambedkar", "Pune", "Chennai", "Bengaluru", "Hyderabad", "Kalinga", "Narmada", "Ganga", "Malabar", "Thapar", "Sardar Patel", "Bhoj", "Annamalai", "Jadavpur", "Coimbatore", "Indore", "Nagpur"];
const instSuffixes = ["Institute of Technology", "College of Engineering", "Institute of Management", "Polytechnic", "Engineering College", "School of Architecture", "University of Technology"];

export interface Programme { name: string; intake: number; enrolled: number }
export interface Institution {
  id: string; name: string; aicteId: string; state: string; city: string;
  programmes: Programme[]; approvedIntake: number; enrolled: number;
  status: SubmissionStatus; lastSync: string; type: "Private" | "Government" | "Aided";
}

export const institutions: Institution[] = Array.from({ length: 36 }, (_, i) => {
  const progs = PROGRAMMES.filter(() => r() > 0.45).slice(0, 4);
  if (!progs.length) progs.push("B.Tech");
  const programmes = progs.map((p) => {
    const intake = Math.round((60 + r() * 540) / 30) * 30;
    const enrolled = Math.round(intake * (0.72 + r() * 0.36));
    return { name: p, intake, enrolled };
  });
  const approvedIntake = programmes.reduce((a, b) => a + b.intake, 0);
  const enrolled = programmes.reduce((a, b) => a + b.enrolled, 0);
  const state = pick(STATES);
  const hrs = Math.floor(r() * 96);
  return {
    id: `inst-${i + 1}`,
    name: `${instPrefixes[i % instPrefixes.length]} ${pick(instSuffixes)}`,
    aicteId: `1-${(41000000 + Math.floor(r() * 899999)).toString()}`,
    state, city: state,
    programmes, approvedIntake, enrolled,
    status: pick(["Submitted", "Submitted", "Submitted", "Pending", "Partial", "Overdue"] as const),
    lastSync: hrs < 1 ? "Just now" : hrs < 24 ? `${hrs}h ago` : `${Math.floor(hrs / 24)}d ago`,
    type: pick(["Private", "Private", "Government", "Aided"] as const),
  };
});

const first = ["Aarav", "Ananya", "Vivaan", "Diya", "Arjun", "Isha", "Reyansh", "Kavya", "Sai", "Meera", "Rohan", "Priya", "Kabir", "Sneha", "Aditya", "Fatima", "Harpreet", "Lakshmi", "Nikhil", "Tanvi", "Imran", "Pooja", "Siddharth", "Zoya", "Varun", "Neha", "Karthik", "Riya"];
const last = ["Sharma", "Iyer", "Reddy", "Patel", "Khan", "Singh", "Nair", "Das", "Gupta", "Menon", "Joshi", "Kulkarni", "Bose", "Verma", "Pillai", "Chauhan", "Rao", "Mehta"];

export interface Student {
  id: string; studentId: string; apaarId: string; name: string; institutionId: string; institution: string;
  programme: string; category: string; status: VerificationStatus; enrollmentYear: number;
  consent: "Granted" | "Pending" | "Withdrawn"; verifiedAt: string | null; gender: "F" | "M";
  source: "Institution ERP" | "Bulk CSV" | "AICTE Portal";
}

export const students: Student[] = Array.from({ length: 120 }, (_, i) => {
  const inst = pick(institutions);
  const status = pick(["Verified", "Verified", "Verified", "Verified", "Pending", "Flagged"] as const);
  const fn = pick(first);
  const day = 1 + Math.floor(r() * 28);
  const apaar = Array.from({ length: 12 }, () => Math.floor(r() * 10)).join("");
  return {
    id: `stu-${i + 1}`,
    studentId: `AICTE-STU-${(250000 + i * 37).toString()}`,
    apaarId: apaar,
    name: `${fn} ${pick(last)}`,
    institutionId: inst.id, institution: inst.name,
    programme: pick(inst.programmes).name,
    category: pick(CATEGORIES),
    status,
    enrollmentYear: pick([2022, 2023, 2024, 2025]),
    consent: status === "Flagged" ? pick(["Pending", "Withdrawn", "Granted"] as const) : pick(["Granted", "Granted", "Granted", "Pending"] as const),
    verifiedAt: status === "Verified" ? `2026-${String(1 + Math.floor(r() * 9)).padStart(2, "0")}-${String(day).padStart(2, "0")} ${String(9 + Math.floor(r() * 8)).padStart(2, "0")}:${String(Math.floor(r() * 60)).padStart(2, "0")} IST` : null,
    gender: ["Ananya", "Diya", "Isha", "Kavya", "Meera", "Priya", "Sneha", "Fatima", "Lakshmi", "Tanvi", "Pooja", "Zoya", "Neha", "Riya"].includes(fn) ? "F" : "M",
    source: pick(["Institution ERP", "Bulk CSV", "AICTE Portal"] as const),
  };
});

export const maskApaar = (id: string) => `•••• •••• ${id.slice(8)}`;
export const formatApaar = (id: string) => `${id.slice(0, 4)} ${id.slice(4, 8)} ${id.slice(8)}`;

export const kpis = {
  institutions: 8462, students: 2_840_000, verified: 2_610_000, issues: 12408,
};

export const monthlySubmissions = [
  { month: "Jan", submitted: 312000, verified: 281000 },
  { month: "Feb", submitted: 356000, verified: 322000 },
  { month: "Mar", submitted: 401000, verified: 368000 },
  { month: "Apr", submitted: 468000, verified: 429000 },
  { month: "May", submitted: 552000, verified: 507000 },
  { month: "Jun", submitted: 751000, verified: 703000 },
];

export const verificationSplit = [
  { name: "Verified", value: 2_610_000, color: "var(--chart-2)" },
  { name: "Pending", value: 168_000, color: "var(--chart-3)" },
  { name: "Flagged", value: 62_000, color: "var(--chart-4)" },
];

export const sparks = {
  institutions: [7900, 8010, 8120, 8200, 8290, 8380, 8462],
  students: [2.21, 2.33, 2.42, 2.51, 2.6, 2.72, 2.84],
  verified: [1.98, 2.08, 2.18, 2.29, 2.4, 2.5, 2.61],
  issues: [16800, 15900, 15100, 14200, 13600, 12900, 12408],
};

export interface Anomaly {
  id: string; type: "Duplicate across institutions" | "Intake breach" | "Invalid APAAR" | "Missing fields";
  severity: Severity; title: string; reason: string; impacted: number; institution: string;
  action: string; detected: string; reviewed: boolean;
}

export const anomalies: Anomaly[] = [
  { id: "ANM-20931", type: "Duplicate across institutions", severity: "Critical", title: "Same APAAR ID enrolled at 2 institutions", reason: "APAAR ID ending •••• 4417 appears in active B.Tech enrolments at two institutions in different states for the same semester.", impacted: 2, institution: institutions[2].name, action: "Request enrolment proof from both institutions; freeze scholarship disbursal pending review.", detected: "12 min ago", reviewed: false },
  { id: "ANM-20928", type: "Intake breach", severity: "Critical", title: "MBA enrolment exceeds approved intake by 38%", reason: "Approved intake 120, submitted enrolments 166. Exceeds 10% tolerance threshold set by AICTE norms.", impacted: 46, institution: institutions[5].name, action: "Issue show-cause notice; verify admission records for 46 excess students.", detected: "48 min ago", reviewed: false },
  { id: "ANM-20917", type: "Invalid APAAR", severity: "High", title: "Checksum failure on 214 APAAR IDs", reason: "214 IDs in bulk upload fail format/checksum validation (simulated rule). Likely transcription errors in source ERP export.", impacted: 214, institution: institutions[8].name, action: "Return batch to institution for correction via ERP re-sync.", detected: "2h ago", reviewed: false },
  { id: "ANM-20904", type: "Duplicate across institutions", severity: "High", title: "Name + DOB match across 3 institutions", reason: "Fuzzy match (score 0.97) on name, date of birth and guardian name with different APAAR IDs.", impacted: 3, institution: institutions[11].name, action: "Escalate to verifier for identity resolution.", detected: "3h ago", reviewed: false },
  { id: "ANM-20899", type: "Missing fields", severity: "Medium", title: "Category field blank for 1,028 records", reason: "Mandatory 'category' field missing; impacts reservation compliance reporting.", impacted: 1028, institution: institutions[14].name, action: "Send automated reminder; auto-close when ERP re-sync completes.", detected: "5h ago", reviewed: false },
  { id: "ANM-20885", type: "Intake breach", severity: "High", title: "Diploma intake exceeded by 18%", reason: "Approved intake 180, enrolled 212 across two shifts.", impacted: 32, institution: institutions[17].name, action: "Verify second-shift approval letter.", detected: "7h ago", reviewed: false },
  { id: "ANM-20871", type: "Invalid APAAR", severity: "Medium", title: "APAAR IDs with leading zeros stripped", reason: "Spreadsheet formatting removed leading zeros on 57 IDs (11 digits found).", impacted: 57, institution: institutions[20].name, action: "Auto-fix suggestion available; confirm with institution.", detected: "9h ago", reviewed: false },
  { id: "ANM-20862", type: "Missing fields", severity: "Medium", title: "Enrollment year missing for lateral entries", reason: "Lateral-entry students submitted without enrollment year.", impacted: 88, institution: institutions[23].name, action: "Map to programme start year using ERP rule.", detected: "1d ago", reviewed: false },
  { id: "ANM-20850", type: "Duplicate across institutions", severity: "Critical", title: "Bulk duplicate cluster detected (86 matches)", reason: "86 APAAR IDs from one institution also appear as active at affiliated sister institutions.", impacted: 86, institution: institutions[26].name, action: "Open joint inquiry; notify regional office.", detected: "1d ago", reviewed: false },
  { id: "ANM-20841", type: "Intake breach", severity: "Medium", title: "M.Tech intake 6% above approval", reason: "Within tolerance but trending upward for 3 cycles.", impacted: 4, institution: institutions[29].name, action: "Monitor; no immediate action required.", detected: "2d ago", reviewed: true },
];

export const recentActivity = [
  { kind: "upload", title: "Bulk upload processed", detail: `${institutions[0].name} · 4,218 records`, time: "4 min ago" },
  { kind: "verify", title: "Batch verification completed", detail: "12,940 records matched (simulated)", time: "22 min ago" },
  { kind: "flag", title: "Duplicate APAAR flagged", detail: `${institutions[2].name} · ANM-20931`, time: "41 min ago" },
  { kind: "onboard", title: "Institution onboarded", detail: `${institutions[9].name}, ${institutions[9].state}`, time: "1h ago" },
  { kind: "upload", title: "ERP sync completed", detail: `${institutions[4].name} · 1,102 records`, time: "2h ago" },
] as const;

export interface AuditEntry { id: string; actor: string; role: string; action: string; entity: string; timestamp: string; ip: string; outcome: "Success" | "Denied" | "Warning" }
const actors = [["Admin (You)", "AICTE Admin"], ["R. Krishnan", "Verifier"], ["S. Banerjee", "Auditor"], ["M. Qureshi", "Institution Admin"], ["System", "Automation"], ["P. Deshmukh", "Institution Admin"]] as const;
const actions = ["Viewed student record", "Revealed APAAR ID", "Bulk upload submitted", "Verification run", "Anomaly marked reviewed", "Exported report", "API key rotated", "Role permission changed", "Login", "Failed login attempt"];
export const auditLog: AuditEntry[] = Array.from({ length: 40 }, (_, i) => {
  const [actor, role] = pick(actors);
  const action = pick(actions);
  const mins = i * 23 + Math.floor(r() * 20);
  const d = new Date(Date.UTC(2026, 9, 30, 9, 0) - mins * 60000);
  return {
    id: `AUD-${88400 - i}`, actor, role, action,
    entity: action.includes("student") || action.includes("APAAR") ? pick(students).studentId : action.includes("upload") ? `BATCH-${7700 + i}` : action.includes("Anomaly") ? pick(anomalies).id : action.includes("report") ? "RPT-Enrolment-Q2" : "—",
    timestamp: d.toISOString().replace("T", " ").slice(0, 16) + " UTC",
    ip: `10.${Math.floor(r() * 250)}.${Math.floor(r() * 250)}.${Math.floor(r() * 250)}`,
    outcome: action === "Failed login attempt" ? "Denied" : action === "Revealed APAAR ID" ? "Warning" : "Success",
  };
});

export const notificationsSeed = [
  { id: "n1", title: "Critical: duplicate APAAR cluster", body: "86 cross-institution matches need review.", time: "12m", unread: true },
  { id: "n2", title: "Intake breach detected", body: "247 programmes exceed approved intake.", time: "1h", unread: true },
  { id: "n3", title: "Weekly report ready", body: "Enrolment summary for AY 2025–26.", time: "3h", unread: true },
  { id: "n4", title: "ERP sync restored", body: "Institution ERP sandbox connection healthy.", time: "1d", unread: false },
];

export const fmt = (n: number) => n.toLocaleString("en-IN");
export const compact = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e5 ? 0 : 1)}K` : String(n);
