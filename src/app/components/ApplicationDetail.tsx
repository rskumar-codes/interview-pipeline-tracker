import { Application, STATUS_CONFIG, PRIORITY_CONFIG } from "./types";
import { StatusBadge } from "./StatusBadge";
import { X, ExternalLink, MapPin, Wifi, DollarSign, CheckCircle2, Circle, Edit2, Trash2, Calendar } from "lucide-react";

interface ApplicationDetailProps {
  application: Application;
  onClose: () => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

const STAGE_TYPE_COLORS: Record<string, string> = {
  phone: "#38bdf8",
  technical: "#fb923c",
  behavioral: "#a78bfa",
  onsite: "#818cf8",
  other: "#64748b",
};

export function ApplicationDetail({ application: app, onClose, onEdit, onDelete }: ApplicationDetailProps) {
  const completedStages = app.stages.filter(s => s.completed).length;

  return (
    <div className="w-96 shrink-0 border-l border-border bg-card flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-start justify-between sticky top-0 bg-card z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
            <span className="text-base font-bold text-foreground">{app.company.name[0]}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{app.company.name}</p>
            <p className="text-xs text-muted-foreground">{app.company.industry}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(app)} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Edit2 size={13} />
          </button>
          <button onClick={() => { onDelete(app.id); onClose(); }} className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors">
            <Trash2 size={13} />
          </button>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-5">
        {/* Role + status */}
        <div>
          <h2 className="text-foreground">{app.role}</h2>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <StatusBadge status={app.status} />
            <span
              className="text-xs font-medium px-2 py-0.5 rounded"
              style={{
                color: PRIORITY_CONFIG[app.priority].color,
                background: `${PRIORITY_CONFIG[app.priority].color}18`,
                border: `1px solid ${PRIORITY_CONFIG[app.priority].color}30`,
              }}
            >
              {PRIORITY_CONFIG[app.priority].label} Priority
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {app.remote ? <Wifi size={12} /> : <MapPin size={12} />}
            <span>{app.remote ? `Remote${app.location ? ` · ${app.location}` : ""}` : app.location}</span>
          </div>
          {app.salary && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign size={12} />
              <span>{app.salary.currency} {app.salary.min.toLocaleString()} – {app.salary.max.toLocaleString()}</span>
            </div>
          )}
          {app.appliedDate && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar size={12} />
              <span>Applied {app.appliedDate}</span>
            </div>
          )}
          {app.jobUrl && (
            <a
              href={app.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs transition-colors"
              style={{ color: "var(--primary)" }}
            >
              <ExternalLink size={12} />
              <span>View Job Posting</span>
            </a>
          )}
        </div>

        {/* Interview stages */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-foreground text-xs uppercase tracking-widest">Interview Stages</h4>
            {app.stages.length > 0 && (
              <span className="text-xs text-muted-foreground">{completedStages}/{app.stages.length} done</span>
            )}
          </div>
          {app.stages.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No interview stages recorded yet.</p>
          ) : (
            <div className="space-y-2.5 relative">
              <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />
              {app.stages.map((stage, i) => (
                <div key={stage.id} className="flex gap-3 relative">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 border"
                    style={stage.completed
                      ? { background: "rgba(45,212,191,0.15)", borderColor: "rgba(45,212,191,0.5)" }
                      : { background: "var(--secondary)", borderColor: "var(--border)" }
                    }
                  >
                    {stage.completed
                      ? <CheckCircle2 size={11} style={{ color: "var(--primary)" }} />
                      : <Circle size={11} className="text-muted-foreground" />
                    }
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${stage.completed ? "text-foreground" : "text-muted-foreground"}`}>{stage.name}</p>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ color: STAGE_TYPE_COLORS[stage.type], background: `${STAGE_TYPE_COLORS[stage.type]}18` }}
                      >
                        {stage.type}
                      </span>
                    </div>
                    {stage.date && <p className="text-[11px] text-muted-foreground mt-0.5">{stage.date}</p>}
                    {stage.notes && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{stage.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        {app.notes && (
          <div>
            <h4 className="text-foreground text-xs uppercase tracking-widest mb-2">Notes</h4>
            <p className="text-xs text-muted-foreground leading-relaxed bg-secondary border border-border rounded p-3">{app.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
