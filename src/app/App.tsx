import { useState } from "react";
import { Application } from "./components/types";
import { MOCK_APPLICATIONS } from "./components/mock-data";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ApplicationsView } from "./components/ApplicationsView";
import { TimelineView } from "./components/TimelineView";
import { CompaniesView } from "./components/CompaniesView";
import { ApplicationDetail } from "./components/ApplicationDetail";
import { ApplicationModal } from "./components/ApplicationModal";

type View = "dashboard" | "applications" | "timeline" | "companies";

export default function App() {
  {/* MARKER-MAKE-KIT-INVOKED */}
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [modalApp, setModalApp] = useState<Application | null | undefined>(undefined);

  const handleSave = (app: Application) => {
    setApplications(prev => {
      const idx = prev.findIndex(a => a.id === app.id);
      if (idx >= 0) return prev.map(a => a.id === app.id ? app : a);
      return [app, ...prev];
    });
    setSelectedApp(app);
  };

  const handleDelete = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    if (selectedApp?.id === id) setSelectedApp(null);
  };

  const handleSelectApp = (app: Application) => {
    setSelectedApp(app);
    if (activeView === "timeline" || activeView === "companies") setActiveView("applications");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        activeView={activeView}
        onViewChange={v => { setActiveView(v); setSelectedApp(null); }}
        onAddApplication={() => setModalApp(null)}
        totalApplications={applications.length}
      />

      <div className="flex-1 flex min-w-0 overflow-hidden">
        {activeView === "dashboard" && (
          <Dashboard
            applications={applications}
            onSelectApplication={app => { setSelectedApp(app); setActiveView("applications"); }}
          />
        )}
        {activeView === "applications" && (
          <ApplicationsView
            applications={applications}
            onSelectApplication={setSelectedApp}
            onEditApplication={app => setModalApp(app)}
            onDeleteApplication={handleDelete}
          />
        )}
        {activeView === "timeline" && (
          <TimelineView
            applications={applications}
            onSelectApplication={handleSelectApp}
          />
        )}
        {activeView === "companies" && (
          <CompaniesView
            applications={applications}
            onSelectApplication={handleSelectApp}
          />
        )}

        {selectedApp && activeView === "applications" && (
          <ApplicationDetail
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onEdit={app => setModalApp(app)}
            onDelete={handleDelete}
          />
        )}
      </div>

      {modalApp !== undefined && (
        <ApplicationModal
          application={modalApp}
          onSave={handleSave}
          onClose={() => setModalApp(undefined)}
        />
      )}
    </div>
  );
}
