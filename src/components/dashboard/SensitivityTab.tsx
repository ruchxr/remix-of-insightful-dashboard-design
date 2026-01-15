import { FilterBar } from "./FilterBar";
import { useFilters } from "@/hooks/useFilters";

export function SensitivityTab() {
  const { filters, updateFilter, horizonOptions } = useFilters("summary");

  return (
    <div className="flex flex-col h-full">
      <FilterBar 
        variant="summary" 
        filters={filters} 
        onFilterChange={updateFilter}
        horizonOptions={horizonOptions}
      />
      
      <div className="flex-1 p-6 bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <h2 className="text-xl font-semibold mb-2">Sensitivity Analysis</h2>
          <p>Coming soon - sensitivity analysis charts and data will appear here.</p>
        </div>
      </div>
    </div>
  );
}
