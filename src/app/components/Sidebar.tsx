import { LayoutDashboard, ListTodo, Clock, Building2, Plus, Target } from "lucide-react";

type View = "dashboard" | "applications" | "timeline" | "companies";

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  onAddApplication: () => void;
  totalApplications: number;
}

const NAV_ITEMS: { view: View; label: string; icon: React.ElementType }[] = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "applications", label: "Applications", icon: ListTodo },
  { view: "timeline", label: "Timeline", icon: Clock },
  { view: "companies", label: "Companies", icon: Building2 },
];

export function Sidebar({ activeView, onViewChange, onAddApplication, totalApplications }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-border bg-sidebar h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: "rgba(45,212,191,0.15)" }}>
            <Target size={15} style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-foreground">Pipeline</div>
            <div className="text-[10px] text-muted-foreground tracking-wide">Interview Tracker</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
          const active = activeView === view;
          return (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-all ${
                active
                  ? "bg-sidebar-accent text-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <Icon size={15} style={active ? { color: "var(--primary)" } : {}} />
              <span>{label}</span>
              {view === "applications" && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-sidebar-border text-muted-foreground">
                  {totalApplications}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Add button */}
      <div className="px-3 pb-5">
        <button
          onClick={onAddApplication}
          className="w-full flex items-center justify-center gap-2 py-2 rounded text-sm font-medium transition-all"
          style={{ background: "rgba(45,212,191,0.12)", color: "var(--primary)", border: "1px solid rgba(45,212,191,0.2)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(45,212,191,0.2)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(45,212,191,0.12)")}
        >
          <Plus size={14} />
          Add Application
        </button>
      </div>
    </aside>
  );
}
