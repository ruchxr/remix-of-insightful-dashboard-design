import { useState, useCallback, useMemo } from "react";

export interface FilterState {
  brand: string;
  indication: string;
  metric: string;
  line: string;
  scenario: string;
  scenarios: string[]; // Multi-select scenarios
  scenarioFrom?: string;
  scenarioTo?: string;
  granularity: string;
  horizonStart: string;
  horizonEnd: string;
}

export const metricOptions = [
  { value: "net-revenue", label: "Net Revenue" },
  { value: "market-share", label: "Market Share" },
  { value: "compliance", label: "Compliance" },
  { value: "dose-month", label: "Dose/Month" },
  { value: "access-percent", label: "Access %" },
  { value: "wac-price", label: "WAC Price" },
  { value: "discount", label: "Discount" },
];

export const scenarioOptions = [
  { value: "jun25", label: "Jun'25" },
  { value: "nov25", label: "Nov'25" },
];

export const monthlyHorizonOptions = [
  { value: "jan-25", label: "Jan-25" },
  { value: "feb-25", label: "Feb-25" },
  { value: "mar-25", label: "Mar-25" },
  { value: "apr-25", label: "Apr-25" },
  { value: "may-25", label: "May-25" },
  { value: "jun-25", label: "Jun-25" },
  { value: "jul-25", label: "Jul-25" },
  { value: "aug-25", label: "Aug-25" },
  { value: "sep-25", label: "Sep-25" },
  { value: "oct-25", label: "Oct-25" },
  { value: "nov-25", label: "Nov-25" },
  { value: "dec-25", label: "Dec-25" },
  { value: "jan-26", label: "Jan-26" },
  { value: "feb-26", label: "Feb-26" },
  { value: "mar-26", label: "Mar-26" },
  { value: "apr-26", label: "Apr-26" },
  { value: "may-26", label: "May-26" },
  { value: "jun-26", label: "Jun-26" },
  { value: "jul-26", label: "Jul-26" },
  { value: "aug-26", label: "Aug-26" },
];

export const annualHorizonOptions = [
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
  { value: "2028", label: "2028" },
  { value: "2029", label: "2029" },
  { value: "2030", label: "2030" },
];

export function useFilters(variant: "summary" | "assumptions" | "waterfall" = "summary") {
  const [filters, setFilters] = useState<FilterState>({
    brand: "brand-a",
    indication: "indication-a",
    metric: variant === "waterfall" ? "total-demand" : "net-revenue",
    line: variant === "assumptions" ? "1l" : "all",
    scenario: "jun-nov",
    scenarios: ["jun25", "nov25"], // Default to both scenarios selected
    scenarioFrom: "jun25",
    scenarioTo: "nov25",
    granularity: "monthly",
    horizonStart: "jan-25",
    horizonEnd: variant === "waterfall" ? "dec-25" : "aug-26",
  });

  const horizonOptions = useMemo(() => {
    return filters.granularity === "annually" ? annualHorizonOptions : monthlyHorizonOptions;
  }, [filters.granularity]);

  const updateFilter = useCallback((key: keyof FilterState, value: string | string[]) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Reset horizon values when granularity changes
      if (key === "granularity" && typeof value === "string") {
        if (value === "annually") {
          newFilters.horizonStart = "2025";
          newFilters.horizonEnd = "2026";
        } else {
          newFilters.horizonStart = "jan-25";
          newFilters.horizonEnd = variant === "waterfall" ? "dec-25" : "aug-26";
        }
      }
      
      return newFilters;
    });
  }, [variant]);

  const getDisplayHorizon = useCallback(() => {
    if (filters.granularity === "annually") {
      return `${filters.horizonStart} - ${filters.horizonEnd}`;
    }
    const startOption = monthlyHorizonOptions.find(o => o.value === filters.horizonStart);
    const endOption = monthlyHorizonOptions.find(o => o.value === filters.horizonEnd);
    return `${startOption?.label || filters.horizonStart} - ${endOption?.label || filters.horizonEnd}`;
  }, [filters]);

  const getBrandLabel = useCallback(() => {
    switch (filters.brand) {
      case "brand-a": return "Brand A";
      case "brand-b": return "Brand B";
      case "brand-c": return "Brand C";
      default: return "Brand A";
    }
  }, [filters.brand]);

  const getMetricLabel = useCallback(() => {
    const option = metricOptions.find(o => o.value === filters.metric);
    if (option) return option.label;
    if (filters.metric === "total-demand") return "Total Demand";
    return "Net Revenue";
  }, [filters.metric]);

  const getScenarioLabel = useCallback(() => {
    switch (filters.scenario) {
      case "jun-nov": return "Jun'25 & Nov'25";
      case "jun25": return "Jun'25";
      case "nov25": return "Nov'25";
      default: return "Jun'25 & Nov'25";
    }
  }, [filters.scenario]);

  return {
    filters,
    updateFilter,
    horizonOptions,
    getDisplayHorizon,
    getBrandLabel,
    getMetricLabel,
    getScenarioLabel,
  };
}
