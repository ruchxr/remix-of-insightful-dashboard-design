import { FilterBar } from "./FilterBar";
import { useFilters, monthlyHorizonOptions } from "@/hooks/useFilters";
import { useMemo } from "react";

interface MetricRow {
  scenario: string;
  metric: string;
  lot: string;
  regime: string;
  actualsTill: string;
  values: string[];
}

// Base data for different brands
const baseTableData: Record<string, MetricRow[]> = {
  "brand-a": [
    { scenario: "Jun'25", metric: "Market Share", lot: "1L", regime: "Mono", actualsTill: "Actuals till Sep'25", values: ["2%", "3%", "3%", "3%", "4%", "4%", "6%", "7%", "7%", "7%", "8%", "9%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%"] },
    { scenario: "Jun'25", metric: "Compliance", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%"] },
    { scenario: "Jun'25", metric: "WAC Price", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["$2,513", "$2,513", "$2,513", "$2,513", "$2,513", "$2,513", "$2,564", "$2,564", "$2,564", "$2,564", "$2,564", "$2,615", "$2,615", "$2,615", "$2,615", "$2,615", "$2,615", "$2,667", "$2,667", "$2,667"] },
    { scenario: "Jun'25", metric: "Discount", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["20%", "20%", "20%", "20%", "20%", "20%", "19%", "19%", "19%", "19%", "19%", "20%", "20%", "20%", "20%", "20%", "21%", "21%", "21%", "21%"] },
    { scenario: "Jun'25", metric: "Net Revenue", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["$73", "$65", "$70", "$71", "$71", "$72", "$77", "$74", "$77", "$82", "$75", "$91", "$84", "$73", "$77", "$75", "$73", "$72", "$74", "$70"] },
    { scenario: "Nov'25", metric: "Market Share", lot: "1L", regime: "Mono", actualsTill: "Actuals till Sep'25", values: ["2%", "2%", "2%", "3%", "4%", "5%", "7%", "7%", "7%", "8%", "8%", "10%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%"] },
    { scenario: "Nov'25", metric: "Compliance", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%"] },
    { scenario: "Nov'25", metric: "WAC Price", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["$2,513", "$2,513", "$2,513", "$2,513", "$2,513", "$2,513", "$2,564", "$2,564", "$2,564", "$2,564", "$2,564", "$2,615", "$2,615", "$2,615", "$2,615", "$2,615", "$2,615", "$2,667", "$2,667", "$2,667"] },
    { scenario: "Nov'25", metric: "Discount", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["20%", "20%", "20%", "20%", "20%", "20%", "20%", "20%", "20%", "20%", "20%", "20%", "21%", "21%", "21%", "21%", "21%", "21%", "21%", "21%"] },
    { scenario: "Nov'25", metric: "Net Revenue", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["$73", "$65", "$70", "$71", "$71", "$72", "$77", "$74", "$79", "$83", "$73", "$90", "$82", "$79", "$80", "$77", "$74", "$72", "$76", "$79"] },
  ],
  "brand-b": [
    { scenario: "Jun'25", metric: "Market Share", lot: "1L", regime: "Mono", actualsTill: "Actuals till Sep'25", values: ["3%", "4%", "4%", "4%", "5%", "5%", "7%", "8%", "8%", "8%", "9%", "10%", "6%", "6%", "6%", "6%", "6%", "6%", "6%", "6%"] },
    { scenario: "Jun'25", metric: "Compliance", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["80%", "80%", "80%", "80%", "80%", "80%", "82%", "82%", "82%", "82%", "82%", "82%", "84%", "84%", "84%", "84%", "84%", "84%", "84%", "84%"] },
    { scenario: "Jun'25", metric: "WAC Price", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["$1,800", "$1,800", "$1,800", "$1,800", "$1,800", "$1,800", "$1,850", "$1,850", "$1,850", "$1,850", "$1,850", "$1,900", "$1,900", "$1,900", "$1,900", "$1,900", "$1,900", "$1,950", "$1,950", "$1,950"] },
    { scenario: "Jun'25", metric: "Discount", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["18%", "18%", "18%", "18%", "18%", "18%", "17%", "17%", "17%", "17%", "17%", "18%", "18%", "18%", "18%", "18%", "19%", "19%", "19%", "19%"] },
    { scenario: "Jun'25", metric: "Net Revenue", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["$55", "$50", "$52", "$53", "$54", "$55", "$58", "$56", "$59", "$62", "$57", "$70", "$65", "$58", "$61", "$59", "$58", "$57", "$59", "$56"] },
    { scenario: "Nov'25", metric: "Market Share", lot: "1L", regime: "Mono", actualsTill: "Actuals till Sep'25", values: ["3%", "3%", "3%", "4%", "5%", "6%", "8%", "8%", "8%", "9%", "9%", "11%", "6%", "6%", "6%", "6%", "6%", "6%", "6%", "6%"] },
    { scenario: "Nov'25", metric: "Compliance", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["80%", "80%", "80%", "80%", "80%", "80%", "82%", "82%", "82%", "82%", "82%", "82%", "84%", "84%", "84%", "84%", "84%", "84%", "84%", "84%"] },
    { scenario: "Nov'25", metric: "WAC Price", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["$1,800", "$1,800", "$1,800", "$1,800", "$1,800", "$1,800", "$1,850", "$1,850", "$1,850", "$1,850", "$1,850", "$1,900", "$1,900", "$1,900", "$1,900", "$1,900", "$1,900", "$1,950", "$1,950", "$1,950"] },
    { scenario: "Nov'25", metric: "Discount", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["18%", "18%", "18%", "18%", "18%", "18%", "18%", "18%", "18%", "18%", "18%", "18%", "19%", "19%", "19%", "19%", "19%", "19%", "19%", "19%"] },
    { scenario: "Nov'25", metric: "Net Revenue", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["$55", "$50", "$52", "$53", "$54", "$55", "$58", "$56", "$60", "$63", "$55", "$69", "$62", "$60", "$61", "$59", "$57", "$55", "$58", "$60"] },
  ],
  "brand-c": [
    { scenario: "Jun'25", metric: "Market Share", lot: "1L", regime: "Mono", actualsTill: "Actuals till Sep'25", values: ["5%", "6%", "6%", "6%", "7%", "7%", "9%", "10%", "10%", "10%", "11%", "12%", "8%", "8%", "8%", "8%", "8%", "8%", "8%", "8%"] },
    { scenario: "Jun'25", metric: "Compliance", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%"] },
    { scenario: "Jun'25", metric: "WAC Price", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["$3,200", "$3,200", "$3,200", "$3,200", "$3,200", "$3,200", "$3,280", "$3,280", "$3,280", "$3,280", "$3,280", "$3,360", "$3,360", "$3,360", "$3,360", "$3,360", "$3,360", "$3,440", "$3,440", "$3,440"] },
    { scenario: "Jun'25", metric: "Discount", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["15%", "15%", "15%", "15%", "15%", "15%", "14%", "14%", "14%", "14%", "14%", "15%", "15%", "15%", "15%", "15%", "16%", "16%", "16%", "16%"] },
    { scenario: "Jun'25", metric: "Net Revenue", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["$95", "$88", "$92", "$94", "$95", "$96", "$102", "$98", "$101", "$107", "$99", "$118", "$110", "$96", "$101", "$99", "$96", "$94", "$97", "$92"] },
    { scenario: "Nov'25", metric: "Market Share", lot: "1L", regime: "Mono", actualsTill: "Actuals till Sep'25", values: ["5%", "5%", "5%", "6%", "7%", "8%", "10%", "10%", "10%", "11%", "11%", "13%", "8%", "8%", "8%", "8%", "8%", "8%", "8%", "8%"] },
    { scenario: "Nov'25", metric: "Compliance", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%", "90%"] },
    { scenario: "Nov'25", metric: "WAC Price", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["$3,200", "$3,200", "$3,200", "$3,200", "$3,200", "$3,200", "$3,280", "$3,280", "$3,280", "$3,280", "$3,280", "$3,360", "$3,360", "$3,360", "$3,360", "$3,360", "$3,360", "$3,440", "$3,440", "$3,440"] },
    { scenario: "Nov'25", metric: "Discount", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["15%", "15%", "15%", "15%", "15%", "15%", "15%", "15%", "15%", "15%", "15%", "15%", "16%", "16%", "16%", "16%", "16%", "16%", "16%", "16%"] },
    { scenario: "Nov'25", metric: "Net Revenue", lot: "", regime: "", actualsTill: "Actuals till Sep'25", values: ["$95", "$88", "$92", "$94", "$95", "$96", "$102", "$98", "$103", "$108", "$95", "$117", "$107", "$103", "$104", "$101", "$97", "$94", "$99", "$103"] },
  ],
};

export function AssumptionsTab() {
  const { filters, updateFilter, horizonOptions, getDisplayHorizon, getBrandLabel } = useFilters("assumptions");

  const { tableData, tableMonths } = useMemo(() => {
    const brandData = baseTableData[filters.brand] || baseTableData["brand-a"];
    
    // Get month indices for filtering
    const startIdx = monthlyHorizonOptions.findIndex(o => o.value === filters.horizonStart);
    const endIdx = monthlyHorizonOptions.findIndex(o => o.value === filters.horizonEnd);

    let months: string[] = [];
    let filteredData: MetricRow[] = [];

    if (filters.granularity === "annually") {
      // Aggregate to annual - simplified for demo
      const startYear = parseInt(filters.horizonStart);
      const endYear = parseInt(filters.horizonEnd);
      months = [];
      for (let year = startYear; year <= endYear; year++) {
        months.push(year.toString());
      }
      
      // For annual, we'll show averaged/representative values
      filteredData = brandData.map(row => ({
        ...row,
        values: months.map((year) => {
          // Find values for months in this year and take first one as representative
          const yearShort = year.slice(-2);
          const monthIndices = monthlyHorizonOptions
            .map((m, i) => ({ ...m, idx: i }))
            .filter(m => m.label.includes(yearShort));
          if (monthIndices.length > 0 && row.values[monthIndices[0].idx]) {
            return row.values[monthIndices[0].idx];
          }
          return "-";
        }),
      }));
    } else {
      // Monthly filtering
      months = monthlyHorizonOptions.slice(startIdx, endIdx + 1).map(o => o.label);
      filteredData = brandData.map(row => ({
        ...row,
        values: row.values.slice(startIdx, endIdx + 1),
      }));
    }

    // Filter by scenario
    if (filters.scenario === "jun25") {
      filteredData = filteredData.filter(row => row.scenario === "Jun'25");
    } else if (filters.scenario === "nov25") {
      filteredData = filteredData.filter(row => row.scenario === "Nov'25");
    }

    // Filter by line (lot)
    if (filters.line !== "all") {
      const lineLabel = filters.line.toUpperCase();
      filteredData = filteredData.map(row => ({
        ...row,
        lot: row.lot === "1L" ? lineLabel : row.lot,
      }));
    }

    return { tableData: filteredData, tableMonths: months };
  }, [filters]);

  // Group rows by scenario
  const jun25Rows = tableData.filter(row => row.scenario === "Jun'25");
  const nov25Rows = tableData.filter(row => row.scenario === "Nov'25");

  return (
    <div className="flex flex-col h-full">
      <FilterBar 
        variant="assumptions" 
        filters={filters} 
        onFilterChange={updateFilter}
        horizonOptions={horizonOptions}
      />
      
      <div className="flex-1 p-6 bg-background overflow-auto">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Assumptions - {getBrandLabel()} ({getDisplayHorizon()})
          </h2>
        </div>
        
        <div className="bg-card rounded border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-dashboard-table-header text-dashboard-table-header-foreground">
                <th className="px-2 py-2 text-left font-semibold sticky left-0 bg-dashboard-table-header z-10">Scenario</th>
                <th className="px-2 py-2 text-left font-semibold">Metric</th>
                <th className="px-2 py-2 text-center font-semibold border-b border-dashboard-table-header-foreground/30">LoT</th>
                <th className="px-2 py-2 text-center font-semibold">Regime</th>
                <th className="px-2 py-2 text-center font-semibold">Actuals till</th>
                {tableMonths.map((month) => (
                  <th key={month} className="px-2 py-2 text-center font-semibold whitespace-nowrap">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Jun'25 Section */}
              {jun25Rows.length > 0 && jun25Rows.map((row, idx) => (
                <tr key={`jun-${idx}`} className={idx % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                  {idx === 0 ? (
                    <td rowSpan={jun25Rows.length} className="px-2 py-2 font-medium text-foreground sticky left-0 bg-inherit border-r border-border align-top">
                      {row.scenario}
                    </td>
                  ) : null}
                  <td className="px-2 py-2 text-foreground whitespace-nowrap">{row.metric}</td>
                  <td className="px-2 py-2 text-center text-muted-foreground">{row.lot}</td>
                  <td className="px-2 py-2 text-center text-muted-foreground">{row.regime}</td>
                  <td className="px-2 py-2 text-center text-muted-foreground text-xs whitespace-nowrap">{row.actualsTill}</td>
                  {row.values.map((value, i) => (
                    <td key={i} className="px-2 py-2 text-center text-foreground whitespace-nowrap">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Separator - only show if both scenarios visible */}
              {jun25Rows.length > 0 && nov25Rows.length > 0 && (
                <tr className="h-2 bg-border/50" />
              )}
              
              {/* Nov'25 Section */}
              {nov25Rows.length > 0 && nov25Rows.map((row, idx) => (
                <tr key={`nov-${idx}`} className={idx % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                  {idx === 0 ? (
                    <td rowSpan={nov25Rows.length} className="px-2 py-2 font-medium text-foreground sticky left-0 bg-inherit border-r border-border align-top">
                      {row.scenario}
                    </td>
                  ) : null}
                  <td className="px-2 py-2 text-foreground whitespace-nowrap">{row.metric}</td>
                  <td className="px-2 py-2 text-center text-muted-foreground">{row.lot}</td>
                  <td className="px-2 py-2 text-center text-muted-foreground">{row.regime}</td>
                  <td className="px-2 py-2 text-center text-muted-foreground text-xs whitespace-nowrap">{row.actualsTill}</td>
                  {row.values.map((value, i) => (
                    <td key={i} className="px-2 py-2 text-center text-foreground whitespace-nowrap">
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
