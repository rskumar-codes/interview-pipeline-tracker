import { useState } from "react";
import { Application, ApplicationStatus, STATUS_CONFIG, PRIORITY_CONFIG } from "./types";
import { StatusBadge } from "./StatusBadge";
import { Search, Filter, ArrowUpDown, ChevronUp, ChevronDown, MapPin, Wifi, DollarSign } from "lucide-react";

interface ApplicationsViewProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  onEditApplication: (app: Application) => void;
  onDeleteApplication: (id: string) => void;
}

type SortKey = "company" | "role" | "status" | "appliedDate" | "lastActivity" | "priority";
type SortDir = "asc" | "desc";

export function ApplicationsView({ applications, onSelectApplication, onEditApplication, onDeleteApplication }: ApplicationsViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [sortKey, setSortKey] = useState<SortKey>("lastActivity");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [contextMenu, setContextMenu] = useState<{ appId: string; x: number; y: number } | null>(null);

  const filtered = applications
    .filter(a => {
      const q = search.toLowerCase();
      if (q && !a.company.name.toLowerCase().includes(q) && !a.role.toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (priorityFilter !== "all" && a.priority !== priorityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let av: string = "", bv: string = "";
      if (sortKey === "company") { av = a.company.name; bv = b.company.name; }
      else if (sortKey === "role") { av = a.role; bv = b.role; }
      else if (sortKey === "status") { av = STATUS_CONFIG[a.status].order.toString(); bv = STATUS_CONFIG[b.status].order.toString(); }
      else if (sortKey === "appliedDate") { av = a.appliedDate; bv = b.appliedDate; }
      else if (sortKey === "lastActivity") { av = a.lastActivity; bv = b.lastActivity; }
      else if (sortKey === "priority") {
        const po = { high: 0, medium: 1, low: 2 };
        av = po[a.priority].toString(); bv = po[b.priority].toString();
      }
      const cmp = av.localeCompare(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={12} className="text-muted-foreground" />;
    return sortDir === "asc" ? <ChevronUp size={12} style={{ color: "var(--primary)" }} /> : <ChevronDown size={12} style={{ color: "var(--primary)" }} />;
  };

  return (
    <div className="flex-1 overflow-y-auto" onClick={() => setContextMenu(null)}>
      <div className="px-8 py-6 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Applications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} of {applications.length} applications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 flex items-center gap-3 border-b border-border">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company or role…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-secondary border border-border rounded text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ApplicationStatus | "all")}
            className="text-sm bg-secondary border border-border rounded px-2.5 py-2 text-foreground outline-none focus:border-primary/50"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as "all" | "high" | "medium" | "low")}
            className="text-sm bg-secondary border border-border rounded px-2.5 py-2 text-foreground outline-none focus:border-primary/50"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="px-8 py-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {(["company", "role", "status", "priority", "appliedDate", "lastActivity"] as SortKey[]).map(col => (
                <th key={col} className="text-left pb-2.5">
                  <button
                    onClick={() => handleSort(col)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
                  >
                    {col === "appliedDate" ? "Applied" : col === "lastActivity" ? "Last Activity" : col.charAt(0).toUpperCase() + col.slice(1)}
                    <SortIcon col={col} />
                  </button>
                </th>
              ))}
              <th className="text-left pb-2.5 text-xs text-muted-foreground uppercase tracking-widest">Location</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(app => (
              <tr
                key={app.id}
                className="group hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => onSelectApplication(app)}
                onContextMenu={e => { e.preventDefault(); setContextMenu({ appId: app.id, x: e.clientX, y: e.clientY }); }}
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-secondary border border-border flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-foreground">{app.company.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{app.company.name}</p>
                      <p className="text-[11px] text-muted-foreground">{app.company.industry}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <p className="text-sm text-foreground">{app.role}</p>
                  {app.salary && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                      <DollarSign size={9} />
                      {(app.salary.min / 1000).toFixed(0)}k–{(app.salary.max / 1000).toFixed(0)}k
                    </p>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <StatusBadge status={app.status} size="sm" />
                </td>
                <td className="py-3 pr-4">
                  <span
                    className="text-xs font-medium"
                    style={{ color: PRIORITY_CONFIG[app.priority].color }}
                  >
                    {PRIORITY_CONFIG[app.priority].label}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs text-muted-foreground">{app.appliedDate || "—"}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs text-muted-foreground">{app.lastActivity}</span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {app.remote ? <Wifi size={11} /> : <MapPin size={11} />}
                    <span className="truncate max-w-[100px]">{app.remote ? "Remote" : app.location.split(",")[0]}</span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => { e.stopPropagation(); onEditApplication(app); }}
                      className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground bg-secondary border border-border rounded transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No applications match your filters.
          </div>
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-popover border border-border rounded-lg shadow-xl py-1 min-w-[140px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          {[
            { label: "View Details", action: () => { const a = applications.find(x => x.id === contextMenu.appId); if (a) onSelectApplication(a); setContextMenu(null); } },
            { label: "Edit", action: () => { const a = applications.find(x => x.id === contextMenu.appId); if (a) onEditApplication(a); setContextMenu(null); } },
            { label: "Delete", action: () => { onDeleteApplication(contextMenu.appId); setContextMenu(null); }, danger: true },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-secondary ${item.danger ? "text-destructive" : "text-foreground"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
