// Centralized mock data for the FBI-style UI (frontend-only for now)
// NOTE: This is mocked data. We'll wire it to backend APIs later per contracts.md

export const opsMetrics = [
  {
    id: "open_cases",
    label: "Open Cases",
    value: 47,
    delta: +6,
  },
  {
    id: "active_ops",
    label: "Active Ops",
    value: 12,
    delta: +2,
  },
  {
    id: "alerts_today",
    label: "Alerts Today",
    value: 19,
    delta: -3,
  },
  {
    id: "resolution_rate",
    label: "Resolution Rate",
    value: 86,
    delta: +4,
    isPercent: true,
  },
];

export const intelFeed = [
  {
    id: "i-001",
    time: "08:12",
    title: "License plate match near Sector 7",
    severity: "high",
    tags: ["ANPR", "vehicle"],
  },
  {
    id: "i-002",
    time: "08:26",
    title: "ATM fraud pattern detected",
    severity: "medium",
    tags: ["financial", "pattern"],
  },
  {
    id: "i-003",
    time: "09:03",
    title: "Irregular comms burst on known channel",
    severity: "critical",
    tags: ["radio", "signal"],
  },
  {
    id: "i-004",
    time: "09:41",
    title: "Face match at transit hub",
    severity: "high",
    tags: ["facial", "transit"],
  },
  {
    id: "i-005",
    time: "10:02",
    title: "Anonymous tip - warehouse meetup",
    severity: "low",
    tags: ["tip", "warehouse"],
  },
];

export const caseFiles = [
  {
    id: "C-7821",
    title: "Operation Blackline",
    status: "active",
    priority: "P1",
    owner: "A. Shaw",
    updated: "2h ago",
    notes: 14,
  },
  {
    id: "C-5512",
    title: "Courier Sting",
    status: "active",
    priority: "P2",
    owner: "D. Reyes",
    updated: "1h ago",
    notes: 7,
  },
  {
    id: "C-1189",
    title: "Wire Sweep",
    status: "backlog",
    priority: "P3",
    owner: "T. Khan",
    updated: "4d ago",
    notes: 3,
  },
  {
    id: "C-2230",
    title: "Safehouse Audit",
    status: "backlog",
    priority: "P2",
    owner: "E. Chen",
    updated: "1d ago",
    notes: 2,
  },
  {
    id: "C-4423",
    title: "Ghost Ledger",
    status: "archived",
    priority: "P4",
    owner: "S. Patel",
    updated: "21d ago",
    notes: 23,
  },
];

export const timeline = [
  {
    id: "t-01",
    time: "07:45",
    type: "ingest",
    text: "Surveillance batch processed (482 frames).",
  },
  {
    id: "t-02",
    time: "08:10",
    type: "match",
    text: "License plate partial match confidence 0.79.",
  },
  {
    id: "t-03",
    time: "08:55",
    type: "dispatch",
    text: "Team BRAVO dispatched to perimeter.",
  },
  {
    id: "t-04",
    time: "09:34",
    type: "update",
    text: "Case C-5512 priority raised to P2.",
  },
  {
    id: "t-05",
    time: "10:11",
    type: "secure",
    text: "New classified memo uploaded.",
  },
];

export const agents = [
  { code: "A1", name: "Alpha" },
  { code: "B2", name: "Bravo" },
  { code: "C3", name: "Charlie" },
  { code: "D4", name: "Delta" },
];