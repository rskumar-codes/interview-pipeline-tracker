import { Application, STATUS_CONFIG, ApplicationStatus } from "./types";
import { StatusBadge } from "./StatusBadge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface TimelineViewProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
}

const PIPELINE_STAGES: ApplicationStatus[] = ["wishlist", "applied", "phone_screen", "technical", "onsite", "offer"];

export function TimelineView({ applications, onSelectApplication }: TimelineViewProps) {
  const activeApps = applications.filter(a => !["rejected", "withdrawn"].includes(a.status));
  const closedApps = applications.filter(a => ["rejected", "withdrawn"].includes(a.status));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6 border-b border-border">
        <h1 className="text-foreground">Pipeline Timeline</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Visual overview of your interview pipeline</p>
      </div>

      {/* Stage legend */}
      <div className="px-8 py-4 border-b border-border overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {PIPELINE_STAGES.map((stage, i) => {
            const config = STATUS_CONFIG[stage];
            const count = activeApps.filter(a => a.status === stage).length;
            return (
              <div key={stage} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5 px-6 py-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ background: config.bg, border: `1px solid ${config.color}50`, color: config.color }}
                  >
                    {count}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{config.label}</span>
                </div>
                {i < PIPELINE_STAGES.length - 1 && (
                  <div className="w-8 h-px bg-border" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Active pipeline by stage */}
        {PIPELINE_STAGES.map(stage => {
          const stageApps = activeApps.filter(a => a.status === stage);
          if (stageApps.length === 0) return null;
          const config = STATUS_CONFIG[stage];
          return (
            <div key={stage}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${config.color}60, transparent)` }} />
                <span
                  className="text-xs font-medium uppercase tracking-widest px-3 py-1 rounded"
                  style={{ color: config.color, background: config.bg }}
                >
                  {config.label}
                </span>
                <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${config.color}60, transparent)` }} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {stageApps.map(app => (
                  <ApplicationCard key={app.id} app={app} onClick={() => onSelectApplication(app)} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Closed */}
        {closedApps.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-widest px-3 py-1 rounded text-muted-foreground bg-secondary">
                Closed
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-3 gap-3 opacity-60">
              {closedApps.map(app => (
                <ApplicationCard key={app.id} app={app} onClick={() => onSelectApplication(app)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationCard({ app, onClick }: { app: Application; onClick: () => void }) {
  const completedStages = app.stages.filter(s => s.completed).length;
  const totalStages = app.stages.length;
  const nextStage = app.stages.find(s => !s.completed);

  return (
    <button
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-all text-left group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-secondary border border-border flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-foreground">{app.company.name[0]}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-tight">{app.company.name}</p>
            <p className="text-[11px] text-muted-foreground">{app.company.industry}</p>
          </div>
        </div>
        <StatusBadge status={app.status} size="sm" />
      </div>

      <p className="text-xs text-muted-foreground mb-3 truncate">{app.role}</p>

      {/* Stage progress */}
      {totalStages > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Stages</span>
            <span className="text-[10px] text-muted-foreground">{completedStages}/{totalStages}</span>
          </div>
          <div className="flex gap-1">
            {app.stages.map(stage => (
              <div
                key={stage.id}
                className="h-1 flex-1 rounded-full"
                style={{
                  background: stage.completed ? "var(--primary)" : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
          {nextStage && (
            <div className="flex items-center gap-1.5 mt-2">
              <Clock size={11} className="text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">{nextStage.name}</span>
              {nextStage.date && (
                <span className="text-[11px] text-muted-foreground">· {nextStage.date}</span>
              )}
            </div>
          )}
        </div>
      )}

      {totalStages === 0 && (
        <div className="flex items-center gap-1.5">
          <Circle size={11} className="text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">No stages yet</span>
        </div>
      )}

      {app.status === "offer" && (
        <div className="flex items-center gap-1.5 mt-2">
          <CheckCircle2 size={11} style={{ color: "#4ade80" }} />
          <span className="text-[11px]" style={{ color: "#4ade80" }}>Offer received</span>
        </div>
      )}
    </button>
  );
}
