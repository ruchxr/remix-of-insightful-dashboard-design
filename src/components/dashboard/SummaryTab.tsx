import { FilterBar } from "./FilterBar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useFilters, monthlyHorizonOptions } from "@/hooks/useFilters";
import { useMemo } from "react";

// Line multiplier for different treatment lines
const getLineMultiplier = (line: string): number => {
  switch (line) {
    case "1l": return 1.0;
    case "2l": return 0.75;
    case "3l": return 0.55;
    case "4l": return 0.35;
    default: return 1.0; // "all"
  }
};

// Base monthly data for different brands
const baseChartData = {
  "brand-a": {
    "net-revenue": [
      { month: "Jan-25", jun25: 26, nov25: 26 },
      { month: "Feb-25", jun25: 24, nov25: 24 },
      { month: "Mar-25", jun25: 27, nov25: 27 },
      { month: "Apr-25", jun25: 29, nov25: 29 },
      { month: "May-25", jun25: 30, nov25: 28 },
      { month: "Jun-25", jun25: 30, nov25: 28 },
      { month: "Jul-25", jun25: 34, nov25: 32 },
      { month: "Aug-25", jun25: 33, nov25: 31 },
      { month: "Sep-25", jun25: 35, nov25: 33 },
      { month: "Oct-25", jun25: 36, nov25: 36 },
      { month: "Nov-25", jun25: 31, nov25: 32 },
      { month: "Dec-25", jun25: 36, nov25: 37 },
      { month: "Jan-26", jun25: 37, nov25: 38 },
      { month: "Feb-26", jun25: 38, nov25: 38 },
      { month: "Mar-26", jun25: 39, nov25: 39 },
      { month: "Apr-26", jun25: 39, nov25: 40 },
      { month: "May-26", jun25: 40, nov25: 41 },
      { month: "Jun-26", jun25: 41, nov25: 42 },
      { month: "Jul-26", jun25: 42, nov25: 42 },
      { month: "Aug-26", jun25: 43, nov25: 43 },
    ],
    "market-share": [
      { month: "Jan-25", jun25: 5, nov25: 5 },
      { month: "Feb-25", jun25: 6, nov25: 6 },
      { month: "Mar-25", jun25: 7, nov25: 6 },
      { month: "Apr-25", jun25: 8, nov25: 7 },
      { month: "May-25", jun25: 9, nov25: 8 },
      { month: "Jun-25", jun25: 10, nov25: 9 },
      { month: "Jul-25", jun25: 11, nov25: 10 },
      { month: "Aug-25", jun25: 12, nov25: 11 },
      { month: "Sep-25", jun25: 13, nov25: 12 },
      { month: "Oct-25", jun25: 14, nov25: 13 },
      { month: "Nov-25", jun25: 15, nov25: 14 },
      { month: "Dec-25", jun25: 16, nov25: 15 },
      { month: "Jan-26", jun25: 17, nov25: 16 },
      { month: "Feb-26", jun25: 18, nov25: 17 },
      { month: "Mar-26", jun25: 19, nov25: 18 },
      { month: "Apr-26", jun25: 20, nov25: 19 },
      { month: "May-26", jun25: 21, nov25: 20 },
      { month: "Jun-26", jun25: 22, nov25: 21 },
      { month: "Jul-26", jun25: 23, nov25: 22 },
      { month: "Aug-26", jun25: 24, nov25: 23 },
    ],
  },
  "brand-b": {
    "net-revenue": [
      { month: "Jan-25", jun25: 18, nov25: 17 },
      { month: "Feb-25", jun25: 19, nov25: 18 },
      { month: "Mar-25", jun25: 20, nov25: 19 },
      { month: "Apr-25", jun25: 21, nov25: 20 },
      { month: "May-25", jun25: 22, nov25: 21 },
      { month: "Jun-25", jun25: 23, nov25: 22 },
      { month: "Jul-25", jun25: 24, nov25: 23 },
      { month: "Aug-25", jun25: 25, nov25: 24 },
      { month: "Sep-25", jun25: 26, nov25: 25 },
      { month: "Oct-25", jun25: 27, nov25: 26 },
      { month: "Nov-25", jun25: 28, nov25: 27 },
      { month: "Dec-25", jun25: 29, nov25: 28 },
      { month: "Jan-26", jun25: 30, nov25: 29 },
      { month: "Feb-26", jun25: 31, nov25: 30 },
      { month: "Mar-26", jun25: 32, nov25: 31 },
      { month: "Apr-26", jun25: 33, nov25: 32 },
      { month: "May-26", jun25: 34, nov25: 33 },
      { month: "Jun-26", jun25: 35, nov25: 34 },
      { month: "Jul-26", jun25: 36, nov25: 35 },
      { month: "Aug-26", jun25: 37, nov25: 36 },
    ],
    "market-share": [
      { month: "Jan-25", jun25: 8, nov25: 7 },
      { month: "Feb-25", jun25: 9, nov25: 8 },
      { month: "Mar-25", jun25: 10, nov25: 9 },
      { month: "Apr-25", jun25: 11, nov25: 10 },
      { month: "May-25", jun25: 12, nov25: 11 },
      { month: "Jun-25", jun25: 13, nov25: 12 },
      { month: "Jul-25", jun25: 14, nov25: 13 },
      { month: "Aug-25", jun25: 15, nov25: 14 },
      { month: "Sep-25", jun25: 16, nov25: 15 },
      { month: "Oct-25", jun25: 17, nov25: 16 },
      { month: "Nov-25", jun25: 18, nov25: 17 },
      { month: "Dec-25", jun25: 19, nov25: 18 },
      { month: "Jan-26", jun25: 20, nov25: 19 },
      { month: "Feb-26", jun25: 21, nov25: 20 },
      { month: "Mar-26", jun25: 22, nov25: 21 },
      { month: "Apr-26", jun25: 23, nov25: 22 },
      { month: "May-26", jun25: 24, nov25: 23 },
      { month: "Jun-26", jun25: 25, nov25: 24 },
      { month: "Jul-26", jun25: 26, nov25: 25 },
      { month: "Aug-26", jun25: 27, nov25: 26 },
    ],
  },
  "brand-c": {
    "net-revenue": [
      { month: "Jan-25", jun25: 45, nov25: 44 },
      { month: "Feb-25", jun25: 46, nov25: 45 },
      { month: "Mar-25", jun25: 47, nov25: 46 },
      { month: "Apr-25", jun25: 48, nov25: 47 },
      { month: "May-25", jun25: 49, nov25: 48 },
      { month: "Jun-25", jun25: 50, nov25: 49 },
      { month: "Jul-25", jun25: 51, nov25: 50 },
      { month: "Aug-25", jun25: 52, nov25: 51 },
      { month: "Sep-25", jun25: 53, nov25: 52 },
      { month: "Oct-25", jun25: 54, nov25: 53 },
      { month: "Nov-25", jun25: 55, nov25: 54 },
      { month: "Dec-25", jun25: 56, nov25: 55 },
      { month: "Jan-26", jun25: 57, nov25: 56 },
      { month: "Feb-26", jun25: 58, nov25: 57 },
      { month: "Mar-26", jun25: 59, nov25: 58 },
      { month: "Apr-26", jun25: 60, nov25: 59 },
      { month: "May-26", jun25: 61, nov25: 60 },
      { month: "Jun-26", jun25: 62, nov25: 61 },
      { month: "Jul-26", jun25: 63, nov25: 62 },
      { month: "Aug-26", jun25: 64, nov25: 63 },
    ],
    "market-share": [
      { month: "Jan-25", jun25: 12, nov25: 11 },
      { month: "Feb-25", jun25: 13, nov25: 12 },
      { month: "Mar-25", jun25: 14, nov25: 13 },
      { month: "Apr-25", jun25: 15, nov25: 14 },
      { month: "May-25", jun25: 16, nov25: 15 },
      { month: "Jun-25", jun25: 17, nov25: 16 },
      { month: "Jul-25", jun25: 18, nov25: 17 },
      { month: "Aug-25", jun25: 19, nov25: 18 },
      { month: "Sep-25", jun25: 20, nov25: 19 },
      { month: "Oct-25", jun25: 21, nov25: 20 },
      { month: "Nov-25", jun25: 22, nov25: 21 },
      { month: "Dec-25", jun25: 23, nov25: 22 },
      { month: "Jan-26", jun25: 24, nov25: 23 },
      { month: "Feb-26", jun25: 25, nov25: 24 },
      { month: "Mar-26", jun25: 26, nov25: 25 },
      { month: "Apr-26", jun25: 27, nov25: 26 },
      { month: "May-26", jun25: 28, nov25: 27 },
      { month: "Jun-26", jun25: 29, nov25: 28 },
      { month: "Jul-26", jun25: 30, nov25: 29 },
      { month: "Aug-26", jun25: 31, nov25: 30 },
    ],
  },
};

export function SummaryTab() {
  const { filters, updateFilter, horizonOptions, getDisplayHorizon, getBrandLabel, getMetricLabel } = useFilters("summary");

  // Filter and aggregate data based on filters
  const { chartData, tableData, tableMonths } = useMemo(() => {
    const brandData = baseChartData[filters.brand as keyof typeof baseChartData] || baseChartData["brand-a"];
    const metricData = brandData[filters.metric as keyof typeof brandData] || brandData["net-revenue"];

    // Get month indices for filtering
    const startIdx = monthlyHorizonOptions.findIndex(o => o.value === filters.horizonStart);
    const endIdx = monthlyHorizonOptions.findIndex(o => o.value === filters.horizonEnd);
    
    let filteredData = metricData;
    let months: string[] = [];

    if (filters.granularity === "annually") {
      // Aggregate to annual data
      const startYear = parseInt(filters.horizonStart);
      const endYear = parseInt(filters.horizonEnd);
      const annualData: { month: string; jun25: number; nov25: number }[] = [];
      
      for (let year = startYear; year <= endYear; year++) {
        const yearData = metricData.filter(d => d.month.includes(year.toString().slice(-2)));
        if (yearData.length > 0) {
          // Apply line multiplier for demo purposes
          const lineMultiplier = getLineMultiplier(filters.line);
          const avgJun = Math.round(yearData.reduce((sum, d) => sum + d.jun25, 0) / yearData.length * lineMultiplier);
          const avgNov = Math.round(yearData.reduce((sum, d) => sum + d.nov25, 0) / yearData.length * lineMultiplier);
          annualData.push({ month: year.toString(), jun25: avgJun, nov25: avgNov });
        }
      }
      filteredData = annualData;
      months = annualData.map(d => d.month);
    } else {
      // Filter by horizon range and apply line multiplier
      const lineMultiplier = getLineMultiplier(filters.line);
      filteredData = metricData.slice(startIdx, endIdx + 1).map(d => ({
        ...d,
        jun25: Math.round(d.jun25 * lineMultiplier),
        nov25: Math.round(d.nov25 * lineMultiplier),
      }));
      months = filteredData.map(d => d.month);
    }

    // Generate table data based on scenario selection
    const unit = filters.metric === "net-revenue" ? "$" : "";
    const suffix = filters.metric === "market-share" ? "%" : "";
    
    let tableRows: Record<string, string[]> = {};
    if (filters.scenario === "jun-nov" || filters.scenario === "jun25") {
      tableRows["Jun'25"] = filteredData.map(d => `${unit}${d.jun25}${suffix}`);
    }
    if (filters.scenario === "jun-nov" || filters.scenario === "nov25") {
      tableRows["Nov'25"] = filteredData.map(d => `${unit}${d.nov25}${suffix}`);
    }

    return { chartData: filteredData, tableData: tableRows, tableMonths: months };
  }, [filters]);

  const yAxisDomain = useMemo(() => {
    if (filters.metric === "market-share") {
      return [0, 35];
    }
    const allValues = chartData.flatMap(d => [d.jun25, d.nov25]);
    const max = Math.max(...allValues);
    return [0, Math.ceil(max / 10) * 10 + 10];
  }, [chartData, filters.metric]);

  const showJun25 = filters.scenario === "jun-nov" || filters.scenario === "jun25";
  const showNov25 = filters.scenario === "jun-nov" || filters.scenario === "nov25";

  return (
    <div className="flex flex-col h-full">
      <FilterBar 
        variant="summary" 
        filters={filters} 
        onFilterChange={updateFilter}
        horizonOptions={horizonOptions}
      />
      
      <div className="flex-1 p-6 bg-background overflow-auto">
        {/* Chart Section */}
        <div className="bg-card rounded border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-center text-foreground mb-4">
            {getMetricLabel()} {filters.metric === "net-revenue" ? "($M)" : "(%)"} - {getBrandLabel()} ({getDisplayHorizon()})
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis 
                tickFormatter={(value) => filters.metric === "market-share" ? `${value}%` : `$${value}`}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                domain={yAxisDomain}
              />
              <Tooltip 
                formatter={(value: number) => [
                  filters.metric === "market-share" ? `${value}%` : `$${value}M`, 
                  ""
                ]}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "4px"
                }}
              />
              <Legend />
              {showJun25 && (
                <Line 
                  type="monotone" 
                  dataKey="jun25" 
                  stroke="hsl(var(--chart-primary))" 
                  strokeWidth={2}
                  dot={false}
                  name="Jun'25"
                />
              )}
              {showNov25 && (
                <Line 
                  type="monotone" 
                  dataKey="nov25" 
                  stroke="hsl(var(--chart-secondary))" 
                  strokeWidth={2}
                  dot={false}
                  name="Nov'25"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-900 text-dashboard-table-header-foreground">
                <th className="px-3 py-2 text-left font-semibold sticky left-0 bg-dashboard-table-header"></th>
                {tableMonths.map((month) => (
                  <th key={month} className="px-3 py-2 text-center font-semibold whitespace-nowrap">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(tableData).map(([scenario, values], idx) => (
                <tr key={scenario} className={idx % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                  <td className="px-3 py-2 font-medium text-foreground sticky left-0 bg-inherit border-r border-border">
                    {scenario}
                  </td>
                  {values.map((value, i) => (
                    <td key={i} className="px-3 py-2 text-center text-foreground">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
