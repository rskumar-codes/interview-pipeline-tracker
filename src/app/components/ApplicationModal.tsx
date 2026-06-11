import { useState, useEffect } from "react";
import { Application, ApplicationStatus, STATUS_CONFIG } from "./types";
import { X, Plus, Trash2 } from "lucide-react";

interface ApplicationModalProps {
  application?: Application | null;
  onSave: (app: Application) => void;
  onClose: () => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

const EMPTY: Omit<Application, "id"> = {
  company: { id: "", name: "", industry: "", size: "", website: "" },
  role: "",
  status: "applied",
  appliedDate: new Date().toISOString().split("T")[0],
  location: "",
  remote: false,
  stages: [],
  notes: "",
  priority: "medium",
  lastActivity: new Date().toISOString().split("T")[0],
};

export function ApplicationModal({ application, onSave, onClose }: ApplicationModalProps) {
  const [form, setForm] = useState<Omit<Application, "id">>(application ? { ...application } : { ...EMPTY });
  const [salaryEnabled, setSalaryEnabled] = useState(!!application?.salary);

  useEffect(() => {
    setForm(application ? { ...application } : { ...EMPTY });
    setSalaryEnabled(!!application?.salary);
  }, [application]);

  const handleSave = () => {
    if (!form.company.name || !form.role) return;
    onSave({
      ...form,
      id: application?.id ?? generateId(),
      company: { ...form.company, id: application?.company.id ?? generateId() },
      salary: salaryEnabled ? form.salary : undefined,
    });
    onClose();
  };

  const addStage = () => {
    setForm(f => ({
      ...f,
      stages: [...f.stages, { id: generateId(), name: "", date: "", notes: "", completed: false, type: "other" }],
    }));
  };

  const updateStage = (i: number, patch: Partial<Application["stages"][0]>) => {
    setForm(f => ({ ...f, stages: f.stages.map((s, idx) => idx === i ? { ...s, ...patch } : s) }));
  };

  const removeStage = (i: number) => {
    setForm(f => ({ ...f, stages: f.stages.filter((_, idx) => idx !== i) }));
  };

  const inputCls = "w-full px-3 py-2 text-sm bg-input-background border border-border rounded text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors";
  const labelCls = "block text-xs text-muted-foreground uppercase tracking-widest mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-foreground">{application ? "Edit Application" : "Add Application"}</h2>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Company */}
          <div>
            <p className="text-xs font-medium text-foreground uppercase tracking-widest mb-3">Company</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Company Name *</label>
                <input className={inputCls} value={form.company.name} onChange={e => setForm(f => ({ ...f, company: { ...f.company, name: e.target.value } }))} placeholder="Stripe" />
              </div>
              <div>
                <label className={labelCls}>Industry</label>
                <input className={inputCls} value={form.company.industry} onChange={e => setForm(f => ({ ...f, company: { ...f.company, industry: e.target.value } }))} placeholder="Fintech" />
              </div>
              <div>
                <label className={labelCls}>Company Size</label>
                <select className={inputCls} value={form.company.size} onChange={e => setForm(f => ({ ...f, company: { ...f.company, size: e.target.value } }))}>
                  <option value="">Select size</option>
                  {["1-50", "50-200", "200-500", "500-1000", "1000-5000", "5000+"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Website</label>
                <input className={inputCls} value={form.company.website ?? ""} onChange={e => setForm(f => ({ ...f, company: { ...f.company, website: e.target.value } }))} placeholder="stripe.com" />
              </div>
            </div>
          </div>

          {/* Role */}
          <div>
            <p className="text-xs font-medium text-foreground uppercase tracking-widest mb-3">Role</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Job Title *</label>
                <input className={inputCls} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Senior Software Engineer" />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select className={inputCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ApplicationStatus }))}>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Priority</label>
                <select className={inputCls} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as "high" | "medium" | "low" }))}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Applied Date</label>
                <input type="date" className={inputCls} value={form.appliedDate} onChange={e => setForm(f => ({ ...f, appliedDate: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Location</label>
                <input className={inputCls} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="San Francisco, CA" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remote"
                  checked={form.remote}
                  onChange={e => setForm(f => ({ ...f, remote: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="remote" className="text-sm text-foreground cursor-pointer">Remote position</label>
              </div>
              <div>
                <label className={labelCls}>Job URL</label>
                <input className={inputCls} value={form.jobUrl ?? ""} onChange={e => setForm(f => ({ ...f, jobUrl: e.target.value }))} placeholder="https://..." />
              </div>
            </div>
          </div>

          {/* Salary */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <input type="checkbox" id="salary-toggle" checked={salaryEnabled} onChange={e => setSalaryEnabled(e.target.checked)} className="w-4 h-4 accent-primary" />
              <label htmlFor="salary-toggle" className="text-xs font-medium text-foreground uppercase tracking-widest cursor-pointer">Salary Range</label>
            </div>
            {salaryEnabled && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Min</label>
                  <input type="number" className={inputCls} value={form.salary?.min ?? ""} onChange={e => setForm(f => ({ ...f, salary: { ...f.salary!, min: +e.target.value, max: f.salary?.max ?? 0, currency: f.salary?.currency ?? "USD" } }))} placeholder="150000" />
                </div>
                <div>
                  <label className={labelCls}>Max</label>
                  <input type="number" className={inputCls} value={form.salary?.max ?? ""} onChange={e => setForm(f => ({ ...f, salary: { ...f.salary!, max: +e.target.value, min: f.salary?.min ?? 0, currency: f.salary?.currency ?? "USD" } }))} placeholder="200000" />
                </div>
                <div>
                  <label className={labelCls}>Currency</label>
                  <select className={inputCls} value={form.salary?.currency ?? "USD"} onChange={e => setForm(f => ({ ...f, salary: { ...f.salary!, currency: e.target.value } }))}>
                    {["USD", "EUR", "GBP", "CAD", "AUD"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Stages */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-foreground uppercase tracking-widest">Interview Stages</p>
              <button onClick={addStage} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded transition-colors" style={{ color: "var(--primary)", background: "rgba(45,212,191,0.1)" }}>
                <Plus size={12} />Add Stage
              </button>
            </div>
            <div className="space-y-3">
              {form.stages.map((stage, i) => (
                <div key={stage.id} className="bg-secondary border border-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={stage.completed}
                      onChange={e => updateStage(i, { completed: e.target.checked })}
                      className="w-4 h-4 accent-primary shrink-0"
                    />
                    <input
                      className="flex-1 bg-transparent text-sm text-foreground outline-none border-b border-transparent focus:border-primary/50 transition-colors"
                      value={stage.name}
                      onChange={e => updateStage(i, { name: e.target.value })}
                      placeholder="Stage name"
                    />
                    <select
                      className="text-xs bg-input-background border border-border rounded px-2 py-1 text-foreground outline-none"
                      value={stage.type}
                      onChange={e => updateStage(i, { type: e.target.value as any })}
                    >
                      {["phone", "technical", "behavioral", "onsite", "other"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input
                      type="date"
                      className="text-xs bg-input-background border border-border rounded px-2 py-1 text-foreground outline-none"
                      value={stage.date}
                      onChange={e => updateStage(i, { date: e.target.value })}
                    />
                    <button onClick={() => removeStage(i)} className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <input
                    className="w-full bg-transparent text-xs text-muted-foreground outline-none"
                    value={stage.notes}
                    onChange={e => updateStage(i, { notes: e.target.value })}
                    placeholder="Notes about this stage…"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any additional notes about this application…"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.company.name || !form.role}
            className="px-5 py-2 text-sm rounded font-medium transition-all disabled:opacity-40"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {application ? "Save Changes" : "Add Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
