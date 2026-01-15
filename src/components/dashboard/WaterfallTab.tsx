import { FilterBar } from "./FilterBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { useFilters } from "@/hooks/useFilters";
import { useMemo } from "react";

// Base waterfall data for different brands and metrics
const baseWaterfallData = {
  "brand-a": {
    "total-demand": {
      "jun25-nov25": [
        { name: "Jun'25", value: 215.8, type: "base" },
        { name: "Demand", value: 37.4, type: "increase" },
        { name: "Inventory & Pricing", value: -5.2, type: "decrease" },
        { name: "Nov'25", value: 248.0, type: "base" },
      ],
      "nov25-jun25": [
        { name: "Nov'25", value: 248.0, type: "base" },
        { name: "Demand", value: -37.4, type: "decrease" },
        { name: "Inventory & Pricing", value: 5.2, type: "increase" },
        { name: "Jun'25", value: 215.8, type: "base" },
      ],
    },
    "net-revenue": {
      "jun25-nov25": [
        { name: "Jun'25", value: 180.5, type: "base" },
        { name: "Volume Growth", value: 25.3, type: "increase" },
        { name: "Price Impact", value: -8.1, type: "decrease" },
        { name: "Nov'25", value: 197.7, type: "base" },
      ],
      "nov25-jun25": [
        { name: "Nov'25", value: 197.7, type: "base" },
        { name: "Volume Growth", value: -25.3, type: "decrease" },
        { name: "Price Impact", value: 8.1, type: "increase" },
        { name: "Jun'25", value: 180.5, type: "base" },
      ],
    },
  },
  "brand-b": {
    "total-demand": {
      "jun25-nov25": [
        { name: "Jun'25", value: 145.2, type: "base" },
        { name: "Demand", value: 22.8, type: "increase" },
        { name: "Inventory & Pricing", value: -3.5, type: "decrease" },
        { name: "Nov'25", value: 164.5, type: "base" },
      ],
      "nov25-jun25": [
        { name: "Nov'25", value: 164.5, type: "base" },
        { name: "Demand", value: -22.8, type: "decrease" },
        { name: "Inventory & Pricing", value: 3.5, type: "increase" },
        { name: "Jun'25", value: 145.2, type: "base" },
      ],
    },
    "net-revenue": {
      "jun25-nov25": [
        { name: "Jun'25", value: 120.3, type: "base" },
        { name: "Volume Growth", value: 18.5, type: "increase" },
        { name: "Price Impact", value: -5.2, type: "decrease" },
        { name: "Nov'25", value: 133.6, type: "base" },
      ],
      "nov25-jun25": [
        { name: "Nov'25", value: 133.6, type: "base" },
        { name: "Volume Growth", value: -18.5, type: "decrease" },
        { name: "Price Impact", value: 5.2, type: "increase" },
        { name: "Jun'25", value: 120.3, type: "base" },
      ],
    },
  },
  "brand-c": {
    "total-demand": {
      "jun25-nov25": [
        { name: "Jun'25", value: 320.5, type: "base" },
        { name: "Demand", value: 48.2, type: "increase" },
        { name: "Inventory & Pricing", value: -12.3, type: "decrease" },
        { name: "Nov'25", value: 356.4, type: "base" },
      ],
      "nov25-jun25": [
        { name: "Nov'25", value: 356.4, type: "base" },
        { name: "Demand", value: -48.2, type: "decrease" },
        { name: "Inventory & Pricing", value: 12.3, type: "increase" },
        { name: "Jun'25", value: 320.5, type: "base" },
      ],
    },
    "net-revenue": {
      "jun25-nov25": [
        { name: "Jun'25", value: 275.8, type: "base" },
        { name: "Volume Growth", value: 42.1, type: "increase" },
        { name: "Price Impact", value: -15.5, type: "decrease" },
        { name: "Nov'25", value: 302.4, type: "base" },
      ],
      "nov25-jun25": [
        { name: "Nov'25", value: 302.4, type: "base" },
        { name: "Volume Growth", value: -42.1, type: "decrease" },
        { name: "Price Impact", value: 15.5, type: "increase" },
        { name: "Jun'25", value: 275.8, type: "base" },
      ],
    },
  },
};

const getBarColor = (type: string) => {
  switch (type) {
    case "base":
      return "hsl(var(--chart-base))";
    case "increase":
      return "hsl(var(--chart-increase))";
    case "decrease":
      return "hsl(var(--chart-decrease))";
    default:
      return "hsl(var(--chart-primary))";
  }
};

export function WaterfallTab() {
  const { filters, updateFilter, horizonOptions, getBrandLabel, getMetricLabel, getDisplayHorizon } = useFilters("waterfall");

  const { waterfallData, processedData, yDomain } = useMemo(() => {
    const brandData = baseWaterfallData[filters.brand as keyof typeof baseWaterfallData] || baseWaterfallData["brand-a"];
    const metricData = brandData[filters.metric as keyof typeof brandData] || brandData["total-demand"];
    
    // Determine scenario comparison key
    const scenarioKey = `${filters.scenarioFrom}-${filters.scenarioTo}` as keyof typeof metricData;
    const data = metricData[scenarioKey] || metricData["jun25-nov25"];

    // Apply horizon-based scaling for demo
    const startMonth = filters.horizonStart;
    const endMonth = filters.horizonEnd;
    const monthsCount = horizonOptions.findIndex(o => o.value === endMonth) - 
                        horizonOptions.findIndex(o => o.value === startMonth) + 1;
    const scaleFactor = 0.8 + (Math.min(monthsCount, 12) * 0.02); // Scale based on horizon length

    const scaledData = data.map(item => ({
      ...item,
      value: Math.round(item.value * scaleFactor * 10) / 10
    }));

    // Calculate cumulative positions for waterfall effect
    const processed = scaledData.map((item, index) => {
      if (index === 0) {
        return { ...item, start: 0, displayValue: item.value };
      }
      if (index === scaledData.length - 1) {
        return { ...item, start: 0, displayValue: item.value };
      }
      
      let cumSum = scaledData[0].value;
      for (let i = 1; i < index; i++) {
        cumSum += scaledData[i].value;
      }
      
      if (item.type === "decrease") {
        return { ...item, start: cumSum + item.value, displayValue: Math.abs(item.value) };
      }
      return { ...item, start: cumSum, displayValue: item.value };
    });

    // Calculate Y-axis domain
    const allValues = scaledData.map(d => d.value);
    const maxVal = Math.max(...allValues.map(Math.abs));
    const minDomain = Math.floor((Math.min(...allValues) - 20) / 10) * 10;
    const maxDomain = Math.ceil((maxVal + 30) / 10) * 10;

    return { 
      waterfallData: scaledData, 
      processedData: processed,
      yDomain: [Math.max(0, minDomain), maxDomain] as [number, number]
    };
  }, [filters, horizonOptions]);

  const getScenarioLabel = (scenario: string | undefined) => {
    switch (scenario) {
      case "jun25": return "Jun'25";
      case "nov25": return "Nov'25";
      default: return "Jun'25";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <FilterBar 
        variant="waterfall" 
        filters={filters} 
        onFilterChange={updateFilter}
        horizonOptions={horizonOptions}
      />
      
      <div className="flex-1 p-6 bg-background overflow-auto">
        <div className="bg-card rounded border border-border p-6">
          <h2 className="text-xl font-semibold text-center text-foreground mb-6">
            Bridge Analysis – {getBrandLabel()} - {getMetricLabel()} ({getScenarioLabel(filters.scenarioFrom)} vs {getScenarioLabel(filters.scenarioTo)}) | {getDisplayHorizon()}
          </h2>
          
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={processedData} 
              margin={{ top: 30, right: 50, left: 50, bottom: 40 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toFixed(1)}`}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                domain={yDomain}
              />
              <ReferenceLine y={yDomain[0]} stroke="hsl(var(--border))" />
              
              {/* Invisible bar for stacking */}
              <Bar dataKey="start" stackId="a" fill="transparent" />
              
              {/* Visible bar */}
              <Bar 
                dataKey="displayValue" 
                stackId="a"
                radius={[2, 2, 0, 0]}
                label={{
                  position: 'top',
                  formatter: (value: number) => {
                    const item = processedData.find(d => d.displayValue === value);
                    if (!item) return '';
                    if (item.type === 'decrease') return `-$${value.toFixed(1)}`;
                    return `$${value.toFixed(1)}`;
                  },
                  fill: 'hsl(var(--foreground))',
                  fontSize: 12,
                  fontWeight: 500
                }}
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.type)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(var(--chart-base))" }} />
              <span className="text-sm text-foreground">Base</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(var(--chart-increase))" }} />
              <span className="text-sm text-foreground">Increase</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(var(--chart-decrease))" }} />
              <span className="text-sm text-foreground">Decrease</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
