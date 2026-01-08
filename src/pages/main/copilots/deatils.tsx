import * as React from "react";

interface CopilotConfig {
  id: string;
  title: string;
  autoSave: boolean;
  searchMethod: string;
  location: string;
  jobMatch?: string;
  filters: string;
  copilotStatus: boolean;
  hasOptimize?: boolean;
}

const copilots: CopilotConfig[] = [
  {
    id: "1",
    title: "Accountant, Accounting Manager, Accoun...",
    autoSave: true,
    searchMethod: "Job Titles",
    location: "Remote Barbados, Remote Belize, Rem...",
    jobMatch: "Highest",
    filters: "Seniority, Job Language, Keywords",
    copilotStatus: true,
    hasOptimize: true,
  },
  {
    id: "2",
    title: "Accountant, Accounting Manager, Accoun...",
    autoSave: true,
    searchMethod: "Job Titles",
    location: "",
    filters: "",
    copilotStatus: false,
  },
  {
    id: "3",
    title: "Account Manager, Admin, Client Success ...",
    autoSave: true,
    searchMethod: "Job Titles",
    location: "Remote Worldwide, Anywhere in United...",
    filters: "Seniority, Time Zone",
    copilotStatus: false,
  },
];

function CopilotCard({ config }: { config: CopilotConfig }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-purple-200 px-4 py-3">
        <h3 className="text-gray-900 font-medium truncate">{config.title}</h3>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Auto-Save Jobs</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Search Method: {config.searchMethod}</span>
        </div>

        {config.location && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="truncate">{config.location}</span>
          </div>
        )}

        {config.jobMatch && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Job Match: {config.jobMatch}</span>
          </div>
        )}

        {config.filters && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>{config.filters}</span>
          </div>
        )}
      </div>


      <div className="px-4 pb-4 flex items-center justify-between border-t pt-4">
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
          <span>Edit Configuration</span>
        </button>
        
        {config.hasOptimize && (
          <button className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-md text-sm font-medium hover:bg-amber-200">
            <span>Optimize</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function Page(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {copilots.map((copilot) => (
            <CopilotCard key={copilot.id} config={copilot} />
          ))}
        </div>

        <div className="bg-purple-100 rounded-lg p-4 flex items-center justify-center gap-2">
          <span className="text-2xl">🎉</span>
          <span className="text-gray-700">
            Your copilots have saved <span className="font-bold">47</span> jobs since Mar 15 2025
          </span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Guides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-gray-200">
            <button className="px-6 py-4 text-center text-gray-700 hover:bg-gray-50 transition-colors">
              How copilot works
            </button>
            <button className="px-6 py-4 text-center text-gray-700 hover:bg-gray-50 transition-colors">
              How to train your copilot
            </button>
            <button className="px-6 py-4 text-center text-gray-700 hover:bg-gray-50 transition-colors">
              How to apply to external jobs
            </button>
            <button className="px-6 py-4 text-center text-gray-700 hover:bg-gray-50 transition-colors">
              FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}