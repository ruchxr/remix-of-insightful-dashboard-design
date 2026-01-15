import { FilterBar } from "./FilterBar";
import { useFilters } from "@/hooks/useFilters";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

// Sample sensitivity data for tornado chart - varies by line
const sensitivityDataByLine: Record<string, { name: string; min: number; max: number }[]> = {
  "all": [
    { name: "GTN", min: -335, max: 335 },
    { name: "Price", min: -110, max: 209 },
    { name: "Compliance Rate", min: -55, max: 105 },
    { name: "Avg Vials", min: -147, max: 147 },
    { name: "Market Share", min: -330, max: 363 },
    { name: "Treatment Rate", min: -142, max: 242 },
    { name: "Diagnosis Rate", min: -142, max: 214 },
  ],
  "1l": [
    { name: "GTN", min: -280, max: 290 },
    { name: "Price", min: -95, max: 180 },
    { name: "Compliance Rate", min: -45, max: 85 },
    { name: "Avg Vials", min: -120, max: 125 },
    { name: "Market Share", min: -275, max: 310 },
    { name: "Treatment Rate", min: -115, max: 195 },
    { name: "Diagnosis Rate", min: -110, max: 175 },
  ],
  "2l": [
    { name: "GTN", min: -250, max: 260 },
    { name: "Price", min: -85, max: 165 },
    { name: "Compliance Rate", min: -40, max: 78 },
    { name: "Avg Vials", min: -105, max: 110 },
    { name: "Market Share", min: -240, max: 280 },
    { name: "Treatment Rate", min: -100, max: 170 },
    { name: "Diagnosis Rate", min: -95, max: 155 },
  ],
  "3l": [
    { name: "GTN", min: -200, max: 210 },
    { name: "Price", min: -70, max: 135 },
    { name: "Compliance Rate", min: -32, max: 62 },
    { name: "Avg Vials", min: -85, max: 90 },
    { name: "Market Share", min: -195, max: 225 },
    { name: "Treatment Rate", min: -80, max: 138 },
    { name: "Diagnosis Rate", min: -78, max: 125 },
  ],
  "4l+": [
    { name: "GTN", min: -150, max: 160 },
    { name: "Price", min: -52, max: 100 },
    { name: "Compliance Rate", min: -25, max: 48 },
    { name: "Avg Vials", min: -65, max: 70 },
    { name: "Market Share", min: -145, max: 170 },
    { name: "Treatment Rate", min: -60, max: 105 },
    { name: "Diagnosis Rate", min: -58, max: 95 },
  ],
};

export function SensitivityTab() {
  const { filters, updateFilter, horizonOptions, getDisplayHorizon } = useFilters("summary");

  // Get data based on selected line filter and apply horizon-based scaling
  const sensitivityData = useMemo(() => {
    const baseData = sensitivityDataByLine[filters.line] || sensitivityDataByLine["all"];
    
    // Apply a scaling factor based on horizon range for demo purposes
    // Earlier start dates or longer ranges = larger sensitivity values
    const startYear = filters.granularity === "annually" 
      ? parseInt(filters.horizonStart) 
      : parseInt(filters.horizonStart.split("-")[1]) + 2000;
    const endYear = filters.granularity === "annually"
      ? parseInt(filters.horizonEnd)
      : parseInt(filters.horizonEnd.split("-")[1]) + 2000;
    
    const yearRange = endYear - startYear + 1;
    const scaleFactor = 0.7 + (yearRange * 0.15); // Scale based on horizon length
    
    return baseData.map(item => ({
      name: item.name,
      min: Math.round(item.min * scaleFactor),
      max: Math.round(item.max * scaleFactor),
    }));
  }, [filters.line, filters.horizonStart, filters.horizonEnd, filters.granularity]);

  // Transform data for diverging tornado chart (single bar per row)
  const chartData = useMemo(() => {
    return sensitivityData.map(item => ({
      name: item.name,
      min: item.min,
      max: item.max,
      range: item.max - item.min,
    }));
  }, [sensitivityData]);

  // Calculate domain
  const xDomain = useMemo(() => {
    const allMins = sensitivityData.map(d => d.min);
    const allMaxs = sensitivityData.map(d => d.max);
    const minVal = Math.min(...allMins);
    const maxVal = Math.max(...allMaxs);
    const absMax = Math.max(Math.abs(minVal), Math.abs(maxVal));
    return [-Math.ceil(absMax / 100) * 100, Math.ceil(absMax / 100) * 100];
  }, [sensitivityData]);

  // Custom bar with diverging effect
  const CustomDivergingBar = (props: any) => {
    const { x, y, width, height, payload, background } = props;
    const chartWidth = background?.width || width;
    const chartX = background?.x || x;
    
    // Calculate center position (0 point)
    const range = xDomain[1] - xDomain[0];
    const centerX = chartX + (Math.abs(xDomain[0]) / range) * chartWidth;
    
    // Calculate bar positions
    const minX = chartX + ((payload.min - xDomain[0]) / range) * chartWidth;
    const maxX = chartX + ((payload.max - xDomain[0]) / range) * chartWidth;
    
    return (
      <g>
        {/* Min bar (left of center) */}
        <rect
          x={minX}
          y={y}
          width={centerX - minX}
          height={height}
          fill="hsl(235 65% 35%)"
        />
        {/* Max bar (right of center) */}
        <rect
          x={centerX}
          y={y}
          width={maxX - centerX}
          height={height}
          fill="hsl(235 55% 50%)"
        />
        {/* Min label */}
        <text
          x={minX - 8}
          y={y + height / 2}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={11}
          fill="hsl(var(--foreground))"
        >
          -${Math.abs(payload.min)}
        </text>
        {/* Max label */}
        <text
          x={maxX + 8}
          y={y + height / 2}
          textAnchor="start"
          dominantBaseline="middle"
          fontSize={11}
          fill="hsl(var(--foreground))"
        >
          ${payload.max}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <FilterBar 
        variant="summary" 
        filters={filters} 
        onFilterChange={updateFilter}
        horizonOptions={horizonOptions}
      />
      
      <div className="flex-1 p-6 bg-background overflow-auto">
        <div className="bg-card rounded border border-border p-6">
          {/* Header with title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Sensitivity Analysis - {getDisplayHorizon()}
            </h2>
          </div>

          {/* Tornado Chart */}
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 80, left: 100, bottom: 40 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis 
                type="number"
                domain={xDomain}
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis 
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "hsl(0 70% 45%)", fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <ReferenceLine x={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
              
              {/* Custom diverging bar */}
              <Bar 
                dataKey="range" 
                shape={<CustomDivergingBar />}
                background={{ fill: 'transparent' }}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(235 65% 35%)" }}></div>
              <span className="text-sm text-muted-foreground">Min</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(235 55% 50%)" }}></div>
              <span className="text-sm text-muted-foreground">Max</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
