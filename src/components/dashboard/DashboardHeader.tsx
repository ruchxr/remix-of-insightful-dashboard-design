import { cn } from "@/lib/utils";
import ProcLogo from "@/assets/proc-logo.png";

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ["Summary", "Assumptions", "Waterfall", "Sensitivity"];

export function DashboardHeader({ activeTab, onTabChange }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-8">
        {/* Page Title with Company Logo Placeholder */}
        <div className="flex items-center gap-3">
            <img
              src={ProcLogo}
              alt="ProcDNA Logo"
              className="w-12 h-12 object-contain mr-6"
            />
          <h1 className="text-2xl font-bold text-foreground">{activeTab}</h1>
        </div>
        
        {/* Tableau Logo Placeholder */}
        <div className="flex items-center gap-1">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-primary rounded-sm" />
            <div className="w-2.5 h-2.5 bg-primary rounded-sm" />
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm" />
          </div>
          <span className="text-lg font-light tracking-wide text-muted-foreground ml-1">
            t<span className="text-orange-500">a</span>bleau
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "px-6 py-2 text-sm font-medium rounded-sm transition-colors",
              activeTab === tab
                ? "bg-blue-900 text-primary-foreground"
                : "bg-white text-foreground hover:bg-blue-900 hover:text-white"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
