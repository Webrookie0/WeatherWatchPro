import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { HistoricalWeatherData } from "@shared/schema";

interface HistoryChartProps {
  type: "temperature" | "humidity_pressure";
  data: HistoricalWeatherData[];
  isLoading: boolean;
}

export default function HistoryChart({ type, data, isLoading }: HistoryChartProps) {
  const formattedData = useRef<any[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Format timestamp to readable format
      formattedData.current = data.map(item => {
        const date = new Date(item.timestamp);
        return {
          ...item,
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      });
    }
  }, [data]);

  const renderTemperatureChart = () => (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={formattedData.current}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="temperature_dht"
          name="DHT11 Temperature (°C)"
          stroke="#FF9800"
          fill="rgba(255, 152, 0, 0.1)"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="temperature_bmp"
          name="BMP180 Temperature (°C)"
          stroke="#00BCD4"
          fill="rgba(0, 188, 212, 0.1)"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderHumidityPressureChart = () => (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={formattedData.current}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis yAxisId="left" domain={[0, 100]} />
        <YAxis yAxisId="right" orientation="right" domain={[980, 1040]} />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="humidity"
          name="Humidity (%)"
          stroke="#29B6F6"
          fill="rgba(41, 182, 246, 0.1)"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="pressure"
          name="Pressure (hPa)"
          stroke="#1E88E5"
          fill="rgba(30, 136, 229, 0.1)"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const title = type === "temperature" ? "Temperature History" : "Humidity & Pressure History";

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="h-64">
          {type === "temperature" ? renderTemperatureChart() : renderHumidityPressureChart()}
        </div>
      )}
    </Card>
  );
}
