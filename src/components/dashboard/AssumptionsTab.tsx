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

// ✅ Overwritten base data with the provided Jun'25 / Nov'25 dataset (includes Mono + Combo, Dose/Month, Access %)
const baseTableData: Record<string, MetricRow[]> = {
  "brand-a": [
    // -------------------------
    // Jun'25
    // -------------------------
    {
      scenario: "Jun'25",
      metric: "Market Share",
      lot: "1L",
      regime: "Mono",
      actualsTill: "Actuals till Sep'25",
      values: ["2%", "3%", "3%", "3%", "4%", "4%", "6%", "7%", "7%", "7%", "8%", "9%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%"],
    },
    {
      scenario: "Jun'25",
      metric: "Market Share",
      lot: "1L",
      regime: "Combo",
      actualsTill: "Actuals till Sep'25",
      values: ["4%", "5%", "5%", "5%", "6%", "6%", "8%", "9%", "9%", "9%", "10%", "11%", "7%", "7%", "7%", "7%", "7%", "7%", "7%", "7%"],
    },
    {
      scenario: "Jun'25",
      metric: "Compliance",
      lot: "",
      regime: "",
      actualsTill: "Actuals till Sep'25",
      values: ["0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85", "0.85"],
    },
    {
      scenario: "Jun'25",
      metric: "Dose/Month",
      lot: "",
      regime: "",
      actualsTill: "Actuals till Sep'25",
      values: ["4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1"],
    },
    {
      scenario: "Jun'25",
      metric: "Access %",
      lot: "",
      regime: "",
      actualsTill: "Actuals till Sep'25",
      values: ["100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%"],
    },
    {
      scenario: "Jun'25",
      metric: "WAC Price",
      lot: "",
      regime: "",
      actualsTill: "Actuals till Sep'25",
      values: ["2513", "2513", "2513", "2513", "2513", "2513", "2564", "2564", "2564", "2564", "2564", "2564", "2615", "2615", "2615", "2615", "2615", "2615", "2667", "2667"],
    },
    {
      scenario: "Jun'25",
      metric: "Discount",
      lot: "",
      regime: "",
      actualsTill: "Actuals till Sep'25",
      values: ["0.2", "0.2", "0.2", "0.2", "0.2", "0.2", "0.19", "0.19", "0.19", "0.19", "0.19", "0.19", "0.2", "0.2", "0.2", "0.2", "0.2", "0.2", "0.21", "0.21"],
    },
    {
      scenario: "Jun'25",
      metric: "Net Revenue",
      lot: "",
      regime: "",
      actualsTill: "Actuals till Sep'25",
      values: ["$73", "$65", "$70", "$71", "$71", "$72", "$77", "$74", "$77", "$82", "$75", "$91", "$84", "$73", "$77", "$75", "$73", "$72", "$74", "$70"],
    },

    // -------------------------
    // Nov'25
    // -------------------------
    {
      scenario: "Nov'25",
      metric: "Market Share",
      lot: "1L",
      regime: "Mono",
      actualsTill: "Actuals till Sep'25",
      values: ["2%", "2%", "2%", "3%", "4%", "5%", "7%", "7%", "7%", "8%", "8%", "10%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%"],
    },
    {
      scenario: "Nov'25",
      metric: "Market Share",
      lot: "1L",
      regime: "Combo",
      actualsTill: "Actuals till Sep'25",
      values: ["4%", "4%", "4%", "5%", "6%", "7%", "9%", "9%", "9%", "10%", "11%", "13%", "8%", "8%", "8%", "8%", "8%", "8%", "8%", "8%"],
    },
    {
      scenario: "Nov'25",
      metric: "Compliance",
      lot: "",
      regime: "",
      actualsTill: "Actuals till Sep'25",
      values: ["85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%", "85%"],
    },
    {
      scenario: "Nov'25",
      metric: "Dose/Month",
      lot: "",
      regime: "",
      actualsTill: "Actuals till Sep'25",
      values: ["4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1", "4.1"],
    },
    {
      scenario: "Nov'25",
      metric: "Access %",
      lot: "",
      regime: "",
      actualsTill: "Actuals till Sep'25",
      values: ["100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%", "100%"],
    },
    {
      scenario: "Nov'25",
      metric: "WAC Price",
      lot: "",
      regime: "",
      actualsTill: "Actuals till Sep'25",
      values: ["$2,513", "$2,513", "$2,513", "$2,513", "$2,513", "$2,513", "$2,564", "$2,564", "$2,564", "$2,564", "$2,564", "$2,564", "$2,615", "$2,615", "$2,615", "$2,615", "$2,615", "$2,615", "$2,667", "$2,667"],
    },
    {
      scenario: "Nov'25",
      metric: "Discount",
      lot: "",
      regime: "",
      actualsTill: "Actuals till Sep'25",
      values: ["20%", "20%", "20%", "20%", "20%", "20%", "20%", "20%", "20%", "20%", "20%", "20%", "21%", "21%", "21%", "21%", "21%", "21%", "21%", "21%"],
    },
    {
      scenario: "Nov'25",
      metric: "Net Revenue",
      lot: "",
      regime: "",
      actualsTill: "Actuals till Sep'25",
      values: ["$73", "$65", "$70", "$71", "$71", "$72", "$77", "$74", "$79", "$83", "$73", "$90", "$82", "$79", "$80", "$77", "$74", "$72", "$76", "$79"],
    },
  ],

  // Mirroring brand-a to preserve existing filter behavior without breaking UI
  "brand-b": [],
  "brand-c": [],
};

// If you want brand-b/brand-c to also show the same dataset, uncomment these:
// baseTableData["brand-b"] = baseTableData["brand-a"];
// baseTableData["brand-c"] = baseTableData["brand-a"];

export function AssumptionsTab() {
  const { filters, updateFilter, horizonOptions, getDisplayHorizon, getBrandLabel } = useFilters("assumptions");

  const { tableData, tableMonths } = useMemo(() => {
    const brandData =
      baseTableData[filters.brand] && baseTableData[filters.brand].length > 0
        ? baseTableData[filters.brand]
        : baseTableData["brand-a"];

    // Get month indices for filtering
    const startIdx = monthlyHorizonOptions.findIndex((o) => o.value === filters.horizonStart);
    const endIdx = monthlyHorizonOptions.findIndex((o) => o.value === filters.horizonEnd);

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

      // For annual, we'll show representative values
      filteredData = brandData.map((row) => ({
        ...row,
        values: months.map((year) => {
          const yearShort = year.slice(-2);
          const monthIndices = monthlyHorizonOptions
            .map((m, i) => ({ ...m, idx: i }))
            .filter((m) => m.label.includes(yearShort));

          if (monthIndices.length > 0 && row.values[monthIndices[0].idx]) {
            return row.values[monthIndices[0].idx];
          }
          return "-";
        }),
      }));
    } else {
      // Monthly filtering
      months = monthlyHorizonOptions.slice(startIdx, endIdx + 1).map((o) => o.label);
      filteredData = brandData.map((row) => ({
        ...row,
        values: row.values.slice(startIdx, endIdx + 1),
      }));
    }

    // Filter by selected scenarios (multi-select)
    if (filters.scenarios.length > 0 && filters.scenarios.length < 2) {
      const scenarioMap: Record<string, string> = {
        "jun25": "Jun'25",
        "nov25": "Nov'25"
      };
      const selectedScenario = scenarioMap[filters.scenarios[0]];
      if (selectedScenario) {
        filteredData = filteredData.filter((row) => row.scenario === selectedScenario);
      }
    }

    // Filter by line (lot)
    if (filters.line !== "all") {
      const lineLabel = filters.line.toUpperCase();
      filteredData = filteredData.map((row) => ({
        ...row,
        lot: row.lot === "1L" ? lineLabel : row.lot,
      }));
    }

    return { tableData: filteredData, tableMonths: months };
  }, [filters]);

  // Group rows by scenario
  const jun25Rows = tableData.filter((row) => row.scenario === "Jun'25");
  const nov25Rows = tableData.filter((row) => row.scenario === "Nov'25");

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
                <th className="px-2 py-2 text-left font-semibold sticky left-0 bg-dashboard-table-header z-10">
                  Scenario
                </th>
                <th className="px-2 py-2 text-left font-semibold">Metric</th>
                <th className="px-2 py-2 text-center font-semibold border-b border-dashboard-table-header-foreground/30">
                  LoT
                </th>
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
              {jun25Rows.length > 0 &&
                jun25Rows.map((row, idx) => (
                  <tr key={`jun-${idx}`} className={idx % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                    {idx === 0 ? (
                      <td
                        rowSpan={jun25Rows.length}
                        className="px-2 py-2 font-medium text-foreground sticky left-0 bg-inherit border-r border-border align-top"
                      >
                        {row.scenario}
                      </td>
                    ) : null}
                    <td className="px-2 py-2 text-foreground whitespace-nowrap">{row.metric}</td>
                    <td className="px-2 py-2 text-center text-muted-foreground">{row.lot}</td>
                    <td className="px-2 py-2 text-center text-muted-foreground">{row.regime}</td>
                    <td className="px-2 py-2 text-center text-muted-foreground text-xs whitespace-nowrap">
                      {row.actualsTill}
                    </td>
                    {row.values.map((value, i) => (
                      <td key={i} className="px-2 py-2 text-center text-foreground whitespace-nowrap">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}

              {/* Separator - only show if both scenarios visible */}
              {jun25Rows.length > 0 && nov25Rows.length > 0 && <tr className="h-2 bg-border/50" />}

              {/* Nov'25 Section */}
              {nov25Rows.length > 0 &&
                nov25Rows.map((row, idx) => (
                  <tr key={`nov-${idx}`} className={idx % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                    {idx === 0 ? (
                      <td
                        rowSpan={nov25Rows.length}
                        className="px-2 py-2 font-medium text-foreground sticky left-0 bg-inherit border-r border-border align-top"
                      >
                        {row.scenario}
                      </td>
                    ) : null}
                    <td className="px-2 py-2 text-foreground whitespace-nowrap">{row.metric}</td>
                    <td className="px-2 py-2 text-center text-muted-foreground">{row.lot}</td>
                    <td className="px-2 py-2 text-center text-muted-foreground">{row.regime}</td>
                    <td className="px-2 py-2 text-center text-muted-foreground text-xs whitespace-nowrap">
                      {row.actualsTill}
                    </td>
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
