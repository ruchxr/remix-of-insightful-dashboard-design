import { cn } from "@/lib/utils";

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
          <div className="w-10 h-10 bg-muted border border-border rounded flex items-center justify-center text-xs text-muted-foreground font-medium">
            Logo
          </div>
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
                ? "bg-dashboard-tab-active text-primary-foreground"
                : "bg-dashboard-tab-inactive text-foreground hover:bg-muted"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
