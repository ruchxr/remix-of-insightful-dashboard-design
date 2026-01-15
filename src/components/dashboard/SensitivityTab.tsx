import { FilterBar } from "./FilterBar";
import { useFilters } from "@/hooks/useFilters";
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample sensitivity data for tornado chart
const sensitivityData = [
  { name: "GTN", min: -335, max: 335 },
  { name: "Price", min: -110, max: 209 },
  { name: "Compliance Rate", min: -55, max: 105 },
  { name: "Avg Vials", min: -147, max: 147 },
  { name: "Market Share", min: -330, max: 363 },
  { name: "Treatment Rate", min: -142, max: 242 },
  { name: "Diagnosis Rate", min: -142, max: 214 },
];

export function SensitivityTab() {
  const { filters, updateFilter, horizonOptions } = useFilters("summary");
  const [selectedYear, setSelectedYear] = useState("2025");

  // Transform data for the tornado chart
  const chartData = useMemo(() => {
    return sensitivityData.map(item => ({
      name: item.name,
      min: item.min,
      max: item.max,
      minDisplay: `$${Math.abs(item.min)}`,
      maxDisplay: `$${item.max}`,
    }));
  }, []);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded p-2 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${Math.abs(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom label for bars
  const renderCustomLabel = (props: any, isMin: boolean) => {
    const { x, y, width, height, value } = props;
    if (value === 0) return null;
    
    const labelX = isMin ? x - 5 : x + width + 5;
    const labelValue = isMin ? `-$${Math.abs(value)}` : `$${value}`;
    
    return (
      <text
        x={labelX}
        y={y + height / 2}
        fill="hsl(var(--foreground))"
        textAnchor={isMin ? "end" : "start"}
        dominantBaseline="middle"
        fontSize={12}
      >
        {labelValue}
      </text>
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
          {/* Header with title and year selector */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Sensitivity Analysis - Jun'25
            </h2>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
                <SelectItem value="2028">2028</SelectItem>
                <SelectItem value="2029">2029</SelectItem>
                <SelectItem value="2030">2030</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tornado Chart */}
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 80, left: 100, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis 
                type="number"
                domain={[-400, 400]}
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis 
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "hsl(var(--chart-tornado-label))" }}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={0} stroke="hsl(var(--border))" strokeWidth={2} />
              
              {/* Min bars (negative - left side) - dark blue */}
              <Bar 
                dataKey="min" 
                fill="hsl(235 65% 35%)"
                radius={[0, 0, 0, 0]}
                label={(props) => renderCustomLabel(props, true)}
              />
              
              {/* Max bars (positive - right side) - dark blue as well for consistency */}
              <Bar 
                dataKey="max" 
                fill="hsl(235 65% 45%)"
                radius={[0, 0, 0, 0]}
                label={(props) => renderCustomLabel(props, false)}
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
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(235 65% 45%)" }}></div>
              <span className="text-sm text-muted-foreground">Max</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
