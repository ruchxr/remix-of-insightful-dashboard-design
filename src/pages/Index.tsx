import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SummaryTab } from "@/components/dashboard/SummaryTab";
import { AssumptionsTab } from "@/components/dashboard/AssumptionsTab";
import { WaterfallTab } from "@/components/dashboard/WaterfallTab";
import { SensitivityTab } from "@/components/dashboard/SensitivityTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Summary");

  const renderTab = () => {
    switch (activeTab) {
      case "Summary":
        return <SummaryTab />;
      case "Assumptions":
        return <AssumptionsTab />;
      case "Waterfall":
        return <WaterfallTab />;
      case "Sensitivity":
        return <SensitivityTab />;
      default:
        return <SummaryTab />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderTab()}
      </div>
    </div>
  );
};

export default Index;
