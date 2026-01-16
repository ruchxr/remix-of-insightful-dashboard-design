import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useMemo, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface WaterfallDrilldownProps {
  onBack: () => void;
  filters: {
    brand: string;
    indication: string;
    scenarioFrom?: string;
    scenarioTo?: string;
    horizonStart: string;
    horizonEnd: string;
  };
  getBrandLabel: () => string;
}

// Detailed demand breakdown data matching the screenshot layout
const demandBreakdownData = {
  "brand-a": {
    "jun25-nov25": [
      { name: "Jun'25", value: 89.0, type: "base" },
      { name: "1L Market Pt", value: -0.9, type: "decrease" },
      { name: "1L Share", value: 0.8, type: "increase" },
      { name: "1L Persistency", value: 0.9, type: "increase" },
      { name: "2L Market Pt", value: -0.1, type: "decrease" },
      { name: "2L Share", value: 4.1, type: "increase" },
      { name: "3L+ Market Pt", value: 3.3, type: "increase" },
      { name: "3L+ Share", value: 5.1, type: "increase" },
      { name: "Nov'25", value: 102.9, type: "base" },
    ],
    "nov25-jun25": [
      { name: "Nov'25", value: 102.9, type: "base" },
      { name: "1L Market Pt", value: 0.9, type: "increase" },
      { name: "1L Share", value: -0.8, type: "decrease" },
      { name: "1L Persistency", value: -0.9, type: "decrease" },
      { name: "2L Market Pt", value: 0.1, type: "increase" },
      { name: "2L Share", value: -4.1, type: "decrease" },
      { name: "3L+ Market Pt", value: -3.3, type: "decrease" },
      { name: "3L+ Share", value: -5.1, type: "decrease" },
      { name: "Jun'25", value: 89.0, type: "base" },
    ],
  },
  "brand-b": {
    "jun25-nov25": [
      { name: "Jun'25", value: 65.2, type: "base" },
      { name: "1L Market Pt", value: -0.5, type: "decrease" },
      { name: "1L Share", value: 1.2, type: "increase" },
      { name: "1L Persistency", value: 0.6, type: "increase" },
      { name: "2L Market Pt", value: -0.2, type: "decrease" },
      { name: "2L Share", value: 2.8, type: "increase" },
      { name: "3L+ Market Pt", value: 2.1, type: "increase" },
      { name: "3L+ Share", value: 3.4, type: "increase" },
      { name: "Nov'25", value: 74.6, type: "base" },
    ],
    "nov25-jun25": [
      { name: "Nov'25", value: 74.6, type: "base" },
      { name: "1L Market Pt", value: 0.5, type: "increase" },
      { name: "1L Share", value: -1.2, type: "decrease" },
      { name: "1L Persistency", value: -0.6, type: "decrease" },
      { name: "2L Market Pt", value: 0.2, type: "increase" },
      { name: "2L Share", value: -2.8, type: "decrease" },
      { name: "3L+ Market Pt", value: -2.1, type: "decrease" },
      { name: "3L+ Share", value: -3.4, type: "decrease" },
      { name: "Jun'25", value: 65.2, type: "base" },
    ],
  },
  "brand-c": {
    "jun25-nov25": [
      { name: "Jun'25", value: 145.5, type: "base" },
      { name: "1L Market Pt", value: -1.2, type: "decrease" },
      { name: "1L Share", value: 2.1, type: "increase" },
      { name: "1L Persistency", value: 1.5, type: "increase" },
      { name: "2L Market Pt", value: -0.3, type: "decrease" },
      { name: "2L Share", value: 6.2, type: "increase" },
      { name: "3L+ Market Pt", value: 4.8, type: "increase" },
      { name: "3L+ Share", value: 7.2, type: "increase" },
      { name: "Nov'25", value: 165.8, type: "base" },
    ],
    "nov25-jun25": [
      { name: "Nov'25", value: 165.8, type: "base" },
      { name: "1L Market Pt", value: 1.2, type: "increase" },
      { name: "1L Share", value: -2.1, type: "decrease" },
      { name: "1L Persistency", value: -1.5, type: "decrease" },
      { name: "2L Market Pt", value: 0.3, type: "increase" },
      { name: "2L Share", value: -6.2, type: "decrease" },
      { name: "3L+ Market Pt", value: -4.8, type: "decrease" },
      { name: "3L+ Share", value: -7.2, type: "decrease" },
      { name: "Jun'25", value: 145.5, type: "base" },
    ],
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

export function WaterfallDrilldown({ onBack, filters, getBrandLabel }: WaterfallDrilldownProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    const element = chartRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`demand-breakdown-${getBrandLabel()}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const { processedData, yDomain } = useMemo(() => {
    const brandData = demandBreakdownData[filters.brand as keyof typeof demandBreakdownData] || demandBreakdownData["brand-a"];
    const scenarioKey = `${filters.scenarioFrom}-${filters.scenarioTo}` as keyof typeof brandData;
    const data = brandData[scenarioKey] || brandData["jun25-nov25"];

    // Calculate cumulative positions for waterfall effect
    const processed = data.map((item, index) => {
      if (index === 0) {
        return { ...item, start: 0, displayValue: item.value };
      }
      if (index === data.length - 1) {
        return { ...item, start: 0, displayValue: item.value };
      }
      
      let cumSum = data[0].value;
      for (let i = 1; i < index; i++) {
        cumSum += data[i].value;
      }
      
      if (item.type === "decrease") {
        return { ...item, start: cumSum + item.value, displayValue: Math.abs(item.value) };
      }
      return { ...item, start: cumSum, displayValue: Math.abs(item.value) };
    });

    // Calculate Y-axis domain
    const allValues = data.map(d => d.value);
    const maxVal = Math.max(...allValues.map(Math.abs));
    const baseValue = data[0].value;
    const minDomain = Math.floor((baseValue - 10) / 5) * 5;
    const maxDomain = Math.ceil((maxVal + 10) / 5) * 5;

    return { 
      processedData: processed,
      yDomain: [Math.max(75, minDomain), Math.max(110, maxDomain)] as [number, number]
    };
  }, [filters]);

  const getScenarioLabel = (scenario: string | undefined) => {
    switch (scenario) {
      case "jun25": return "Jun'25";
      case "nov25": return "Nov'25";
      default: return "Jun'25";
    }
  };

  const getIndicationLabel = () => {
    switch (filters.indication) {
      case "indication-a": return "Indication A";
      case "indication-b": return "Indication B";
      case "indication-c": return "Indication C";
      case "all": return "All Indications";
      default: return "Indication A";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Back button header */}
      <div className="px-6 py-4 bg-card border-b border-border flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center gap-2 text-sm hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Waterfall
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExportPDF}
          className="h-8 px-4 bg-blue-900 text-white font-medium hover:bg-white hover:text-blue-900"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>
      
      <div className="flex-1 p-6 bg-background overflow-auto" ref={chartRef}>
        <div className="bg-card rounded border border-border p-6" id="drilldown-chart">
          <h2 className="text-xl font-semibold text-center text-foreground mb-6">
            Bridge Analysis - {getIndicationLabel()} - ({getScenarioLabel(filters.scenarioFrom)} vs {getScenarioLabel(filters.scenarioTo)})
          </h2>
          
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={processedData} 
              margin={{ top: 30, right: 50, left: 50, bottom: 40 }}
              barCategoryGap="15%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                interval={0}
                angle={0}
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toFixed(1)}`}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                domain={yDomain}
                tickCount={7}
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
                  content: ({ x, y, width, index }: any) => {
                    const item = processedData[index];
                    if (!item) return null;
                    const displayText = item.type === 'decrease' 
                      ? `-$${item.displayValue.toFixed(1)}` 
                      : `$${item.displayValue.toFixed(1)}`;
                    return (
                      <text 
                        x={x + width / 2} 
                        y={y - 8} 
                        textAnchor="middle" 
                        fill="hsl(var(--foreground))"
                        fontSize={11}
                        fontWeight={500}
                      >
                        {displayText}
                      </text>
                    );
                  }
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
