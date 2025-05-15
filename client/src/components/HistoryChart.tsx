import { Card } from "@/components/ui/card";
import { ChartDataPoint } from "@/lib/types";
import { useEffect, useRef } from "react";
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale } from "chart.js";

// Register Chart.js components
Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, CategoryScale, Tooltip, Legend);

interface ChartDataset {
  label: string;
  data: ChartDataPoint[];
  borderColor: string;
  backgroundColor: string;
  yAxisID?: string;
}

interface HistoryChartProps {
  title: string;
  datasets: ChartDataset[];
  dualAxis?: boolean;
  y1Min?: number;
  y1Max?: number;
}

export default function HistoryChart({ 
  title, 
  datasets,
  dualAxis = false,
  y1Min = 0,
  y1Max = 100
}: HistoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare chart data
    const labels = datasets[0]?.data.map(point => point.time) || [];
    
    const chartData = {
      labels,
      datasets: datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data.map(point => point.value),
        borderColor: dataset.borderColor,
        backgroundColor: dataset.backgroundColor,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        yAxisID: dataset.yAxisID
      }))
    };

    // Configure chart
    const config = {
      type: 'line' as const,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            position: 'left' as const,
            title: {
              display: true,
              text: dualAxis ? 'Humidity (%)' : 'Temperature (°C)'
            },
            min: 0,
            max: dualAxis ? 100 : undefined
          },
          ...(dualAxis ? {
            y1: {
              position: 'right' as const,
              title: {
                display: true,
                text: 'Pressure (hPa)'
              },
              min: y1Min,
              max: y1Max,
              grid: {
                drawOnChartArea: false
              }
            }
          } : {})
        }
      }
    };

    // Create new chart
    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [datasets, dualAxis, y1Min, y1Max]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium text-foreground mb-4">{title}</h3>
      <div className="h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </Card>
  );
}
