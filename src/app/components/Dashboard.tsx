import { useState } from "react";
import { Application, STATUS_CONFIG, ApplicationStatus } from "./types";
import { StatusBadge } from "./StatusBadge";
import { TrendingUp, Clock, Award, XCircle, BarChart2, Activity } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface DashboardProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
}

const STAT_CARDS = (apps: Application[]) => {
  const active = apps.filter(a => !["rejected", "withdrawn"].includes(a.status));
  const offers = apps.filter(a => a.status === "offer");
  const rejected = apps.filter(a => a.status === "rejected");
  const interviews = apps.filter(a => ["phone_screen", "technical", "onsite"].includes(a.status));
  return [
    { label: "Active Applications", value: active.length, icon: Activity, color: "#818cf8", sub: "in pipeline" },
    { label: "In Interviews", value: interviews.length, icon: Clock, color: "#38bdf8", sub: "active rounds" },
    { label: "Offers Received", value: offers.length, icon: Award, color: "#4ade80", sub: "awaiting decision" },
    { label: "Rejected", value: rejected.length, icon: XCircle, color: "#f87171", sub: "closed out" },
  ];
};

export function Dashboard({ applications, onSelectApplication }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "stats">("overview");

  const stats = STAT_CARDS(applications);

  const statusCounts = Object.keys(STATUS_CONFIG).map(s => ({
    name: STATUS_CONFIG[s as ApplicationStatus].label,
    count: applications.filter(a => a.status === s).length,
    color: STATUS_CONFIG[s as ApplicationStatus].color,
  })).filter(s => s.count > 0);

  const recentActivity = [...applications]
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
    .slice(0, 5);

  const highPriority = applications.filter(a => a.priority === "high" && !["rejected", "withdrawn", "offer"].includes(a.status));

  const conversionData = [
    { stage: "Applied", count: applications.filter(a => a.status !== "wishlist").length },
    { stage: "Phone", count: applications.filter(a => ["phone_screen","technical","onsite","offer"].includes(a.status)).length },
    { stage: "Technical", count: applications.filter(a => ["technical","onsite","offer"].includes(a.status)).length },
    { stage: "On-site", count: applications.filter(a => ["onsite","offer"].includes(a.status)).length },
    { stage: "Offer", count: applications.filter(a => a.status === "offer").length },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6 border-b border-border">
        <h1 className="text-foreground">Interview Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track and manage your job applications</p>
      </div>

      {/* Stat cards */}
      <div className="px-8 py-6 grid grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-semibold text-foreground mt-1">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </div>
              <div className="w-9 h-9 rounded flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-8">
        <div className="flex gap-0 border-b border-border">
          {(["overview", "stats"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm capitalize border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "stats" ? <span className="flex items-center gap-1.5"><BarChart2 size={13} />Analytics</span> : "Overview"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="px-8 py-6 grid grid-cols-3 gap-6">
          {/* Recent activity */}
          <div className="col-span-2 bg-card border border-border rounded-lg">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h3 className="text-sm text-foreground">Recent Activity</h3>
              <span className="text-xs text-muted-foreground">Last updated</span>
            </div>
            <div className="divide-y divide-border">
              {recentActivity.map(app => (
                <button
                  key={app.id}
                  onClick={() => onSelectApplication(app)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-secondary transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded bg-secondary border border-border flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-foreground">{app.company.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{app.role}</p>
                    <p className="text-xs text-muted-foreground">{app.company.name}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    <StatusBadge status={app.status} size="sm" />
                    <span className="text-xs text-muted-foreground">{app.lastActivity}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* High priority */}
          <div className="bg-card border border-border rounded-lg">
            <div className="px-5 py-3.5 border-b border-border">
              <h3 className="text-sm text-foreground flex items-center gap-2">
                <TrendingUp size={13} style={{ color: "var(--primary)" }} />
                High Priority
              </h3>
            </div>
            <div className="p-4 space-y-2.5">
              {highPriority.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No high-priority applications in pipeline</p>
              )}
              {highPriority.map(app => (
                <button
                  key={app.id}
                  onClick={() => onSelectApplication(app)}
                  className="w-full bg-secondary border border-border rounded p-3 hover:border-primary/40 transition-colors text-left"
                >
                  <p className="text-sm text-foreground">{app.company.name}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{app.role}</p>
                  <div className="mt-2">
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="px-8 py-6 grid grid-cols-2 gap-6">
          {/* Pipeline funnel */}
          <div className="bg-card border border-border rounded-lg">
            <div className="px-5 py-3.5 border-b border-border">
              <h3 className="text-sm text-foreground">Pipeline Funnel</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Applications by stage progression</p>
            </div>
            <div className="p-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionData} layout="vertical" barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="stage" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
                  <Tooltip
                    contentStyle={{ background: "#1e2530", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#e2e8f0", fontSize: 12 }}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="count" fill="#2dd4bf" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status breakdown */}
          <div className="bg-card border border-border rounded-lg">
            <div className="px-5 py-3.5 border-b border-border">
              <h3 className="text-sm text-foreground">Status Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Current application statuses</p>
            </div>
            <div className="p-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusCounts}
                    cx="40%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {statusCounts.map((entry, i) => (
                      <Cell key={i} fill={entry.color} opacity={0.85} />
                    ))}
                  </Pie>
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ fontSize: 11, color: "#94a3b8" }}>{value}</span>}
                  />
                  <Tooltip
                    contentStyle={{ background: "#1e2530", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#e2e8f0", fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Response rate */}
          <div className="bg-card border border-border rounded-lg col-span-2">
            <div className="px-5 py-3.5 border-b border-border">
              <h3 className="text-sm text-foreground">Key Metrics</h3>
            </div>
            <div className="p-5 grid grid-cols-4 gap-4">
              {[
                {
                  label: "Response Rate",
                  value: applications.filter(a => a.status !== "applied" && a.status !== "wishlist").length,
                  total: applications.filter(a => a.status !== "wishlist").length,
                  unit: "%",
                  calc: (v: number, t: number) => t === 0 ? "0" : Math.round(v / t * 100).toString(),
                },
                {
                  label: "Interview Rate",
                  value: applications.filter(a => ["phone_screen","technical","onsite","offer"].includes(a.status)).length,
                  total: applications.filter(a => a.status !== "wishlist").length,
                  unit: "%",
                  calc: (v: number, t: number) => t === 0 ? "0" : Math.round(v / t * 100).toString(),
                },
                {
                  label: "Offer Rate",
                  value: applications.filter(a => a.status === "offer").length,
                  total: applications.filter(a => a.status !== "wishlist").length,
                  unit: "%",
                  calc: (v: number, t: number) => t === 0 ? "0" : Math.round(v / t * 100).toString(),
                },
                {
                  label: "Avg Stages",
                  value: applications.reduce((acc, a) => acc + a.stages.length, 0),
                  total: applications.length || 1,
                  unit: "",
                  calc: (v: number, t: number) => (v / t).toFixed(1),
                },
              ].map(({ label, value, total, unit, calc }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-semibold text-foreground">{calc(value, total)}{unit}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
