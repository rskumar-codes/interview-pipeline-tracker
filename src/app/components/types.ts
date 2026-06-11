export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "phone_screen"
  | "technical"
  | "onsite"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  website?: string;
  logo?: string;
}

export interface InterviewStage {
  id: string;
  name: string;
  date: string;
  notes: string;
  completed: boolean;
  type: "phone" | "technical" | "behavioral" | "onsite" | "other";
}

export interface Application {
  id: string;
  company: Company;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  salary?: { min: number; max: number; currency: string };
  location: string;
  remote: boolean;
  stages: InterviewStage[];
  notes: string;
  jobUrl?: string;
  priority: "high" | "medium" | "low";
  lastActivity: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string; order: number }> = {
  wishlist:     { label: "Wishlist",      color: "#94a3b8", bg: "rgba(148,163,184,0.12)", order: 0 },
  applied:      { label: "Applied",       color: "#818cf8", bg: "rgba(129,140,248,0.12)", order: 1 },
  phone_screen: { label: "Phone Screen",  color: "#38bdf8", bg: "rgba(56,189,248,0.12)",  order: 2 },
  technical:    { label: "Technical",     color: "#fb923c", bg: "rgba(251,146,60,0.12)",  order: 3 },
  onsite:       { label: "On-site",       color: "#a78bfa", bg: "rgba(167,139,250,0.12)", order: 4 },
  offer:        { label: "Offer",         color: "#4ade80", bg: "rgba(74,222,128,0.12)",  order: 5 },
  rejected:     { label: "Rejected",      color: "#f87171", bg: "rgba(248,113,113,0.12)", order: 6 },
  withdrawn:    { label: "Withdrawn",     color: "#64748b", bg: "rgba(100,116,139,0.12)", order: 7 },
};

export const PRIORITY_CONFIG = {
  high:   { label: "High",   color: "#f87171" },
  medium: { label: "Medium", color: "#fb923c" },
  low:    { label: "Low",    color: "#64748b" },
};
