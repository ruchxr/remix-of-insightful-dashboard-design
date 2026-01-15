import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/hooks/useFilters";

interface FilterBarProps {
  variant?: "summary" | "assumptions" | "waterfall";
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  horizonOptions: { value: string; label: string }[];
}

export function FilterBar({ variant = "summary", filters, onFilterChange, horizonOptions }: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 bg-card border-b border-border flex-wrap">
      {/* Brand Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground border-b border-foreground inline-block w-fit">Brand</label>
        <Select value={filters.brand} onValueChange={(v) => onFilterChange("brand", v)}>
          <SelectTrigger className="w-28 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brand-a">Brand A</SelectItem>
            <SelectItem value="brand-b">Brand B</SelectItem>
            <SelectItem value="brand-c">Brand C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Indication Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground border-b border-foreground inline-block w-fit">Indication</label>
        <Select value={filters.indication} onValueChange={(v) => onFilterChange("indication", v)}>
          <SelectTrigger className="w-32 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="indication-a">Indication A</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metric Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground border-b border-foreground inline-block w-fit">
          {variant === "waterfall" ? "Chart Type" : "Metric"}
        </label>
        <Select value={filters.metric} onValueChange={(v) => onFilterChange("metric", v)}>
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {variant === "waterfall" ? (
              <>
                <SelectItem value="total-demand">Total Demand</SelectItem>
                <SelectItem value="net-revenue">Net Revenue</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="net-revenue">Net Revenue</SelectItem>
                <SelectItem value="market-share">Market Share, C...</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Line Filter (not shown for waterfall) */}
      {variant !== "waterfall" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground border-b border-foreground inline-block w-fit">Line</label>
          <Select value={filters.line} onValueChange={(v) => onFilterChange("line", v)}>
            <SelectTrigger className="w-20 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="1l">1L</SelectItem>
              <SelectItem value="2l">2L</SelectItem>
              <SelectItem value="3l">3L</SelectItem>
              <SelectItem value="4l">4L</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Scenario Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground border-b border-foreground inline-block w-fit">Scenario</label>
        {variant === "waterfall" ? (
          <div className="flex items-center gap-2">
            <Select value={filters.scenarioFrom} onValueChange={(v) => onFilterChange("scenarioFrom", v)}>
              <SelectTrigger className="w-24 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jun25">Jun'25</SelectItem>
                <SelectItem value="nov25">Nov'25</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">vs</span>
            <Select value={filters.scenarioTo} onValueChange={(v) => onFilterChange("scenarioTo", v)}>
              <SelectTrigger className="w-24 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jun25">Jun'25</SelectItem>
                <SelectItem value="nov25">Nov'25</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <Select value={filters.scenario} onValueChange={(v) => onFilterChange("scenario", v)}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jun-nov">Jun'25, Nov'25</SelectItem>
              <SelectItem value="jun25">Jun'25</SelectItem>
              <SelectItem value="nov25">Nov'25</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Granularity Filter (not shown for waterfall) */}
      {variant !== "waterfall" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground border-b border-foreground inline-block w-fit">Granularity</label>
          <Select value={filters.granularity} onValueChange={(v) => onFilterChange("granularity", v)}>
            <SelectTrigger className="w-28 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Horizon - Start and End Dropdowns */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground border-b border-foreground inline-block w-fit">Horizon</label>
        <div className="flex items-center gap-2">
          <Select value={filters.horizonStart} onValueChange={(v) => onFilterChange("horizonStart", v)}>
            <SelectTrigger className="w-24 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {horizonOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">to</span>
          <Select value={filters.horizonEnd} onValueChange={(v) => onFilterChange("horizonEnd", v)}>
            <SelectTrigger className="w-24 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {horizonOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Export Button */}
      <Button 
        variant="outline" 
        className="ml-auto h-8 px-4 border-2 border-foreground text-foreground font-medium hover:bg-muted"
      >
        Export Data
      </Button>
    </div>
  );
}
