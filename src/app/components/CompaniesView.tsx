import { Application } from "./types";
import { StatusBadge } from "./StatusBadge";
import { ExternalLink, Building2 } from "lucide-react";

interface CompaniesViewProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
}

export function CompaniesView({ applications, onSelectApplication }: CompaniesViewProps) {
  const companies = Array.from(
    applications.reduce((map, app) => {
      const key = app.company.id;
      if (!map.has(key)) map.set(key, { company: app.company, apps: [] });
      map.get(key)!.apps.push(app);
      return map;
    }, new Map<string, { company: Application["company"]; apps: Application[] }>()).values()
  );

  const industries = Array.from(new Set(applications.map(a => a.company.industry))).sort();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6 border-b border-border">
        <h1 className="text-foreground">Companies</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{companies.length} companies tracked</p>
      </div>

      {/* Industry breakdown */}
      <div className="px-8 py-4 border-b border-border flex items-center gap-3 flex-wrap">
        {industries.map(ind => {
          const count = applications.filter(a => a.company.industry === ind).length;
          return (
            <div key={ind} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded text-xs">
              <span className="text-foreground">{ind}</span>
              <span className="text-muted-foreground">({count})</span>
            </div>
          );
        })}
      </div>

      <div className="px-8 py-6 grid grid-cols-2 gap-4">
        {companies.map(({ company, apps }) => {
          const latestApp = [...apps].sort((a, b) => b.lastActivity.localeCompare(a.lastActivity))[0];
          const hasOffer = apps.some(a => a.status === "offer");
          const hasActive = apps.some(a => !["rejected", "withdrawn"].includes(a.status));

          return (
            <div
              key={company.id}
              className="bg-card border border-border rounded-lg overflow-hidden"
              style={hasOffer ? { borderColor: "rgba(74,222,128,0.3)" } : {}}
            >
              <div className="px-5 py-4 flex items-start justify-between border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center">
                    <Building2 size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{company.name}</p>
                    <p className="text-xs text-muted-foreground">{company.industry} · {company.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {company.website && (
                    <a
                      href={`https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: hasOffer ? "#4ade80" : hasActive ? "var(--primary)" : "#334155" }}
                  />
                </div>
              </div>
              <div className="p-4 space-y-2">
                {apps.map(app => (
                  <button
                    key={app.id}
                    onClick={() => onSelectApplication(app)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded bg-secondary hover:bg-muted transition-colors text-left"
                  >
                    <div>
                      <p className="text-xs text-foreground">{app.role}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{app.lastActivity}</p>
                    </div>
                    <StatusBadge status={app.status} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
