import { Skeleton } from "@/components/ui/skeleton";
import { 
  Thermometer, 
  Droplets, 
  TrendingUp, 
  Sun,
  Cloud,
  CloudRain
} from "lucide-react";

interface WeatherIndicatorProps {
  type: "comfort" | "humidity_status" | "pressure_trend" | "forecast";
  value: string;
  isLoading: boolean;
}

export default function WeatherIndicator({ type, value, isLoading }: WeatherIndicatorProps) {
  // Determine icon and label based on type
  const getIndicatorDetails = () => {
    switch (type) {
      case "comfort":
        return {
          icon: <Thermometer className="text-2xl text-primary" />,
          label: "Comfort Level"
        };
      case "humidity_status":
        return {
          icon: <Droplets className="text-2xl text-secondary" />,
          label: "Humidity Status"
        };
      case "pressure_trend":
        return {
          icon: <TrendingUp className="text-2xl text-primary" />,
          label: "Pressure Trend"
        };
      case "forecast":
        return {
          icon: getWeatherIcon(value),
          label: "Weather Indication"
        };
      default:
        return {
          icon: <Thermometer className="text-2xl text-primary" />,
          label: "Status"
        };
    }
  };

  function getWeatherIcon(forecast: string) {
    if (forecast.includes("Clear")) {
      return <Sun className="text-2xl text-[#FF9800]" />;
    } else if (forecast.includes("Rain")) {
      return <CloudRain className="text-2xl text-[#1E88E5]" />;
    } else {
      return <Cloud className="text-2xl text-[#78909C]" />;
    }
  }

  const { icon, label } = getIndicatorDetails();

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-center">
      <div className="mr-3">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        {isLoading ? (
          <Skeleton className="h-5 w-24" />
        ) : (
          <div className="font-medium">{value}</div>
        )}
      </div>
    </div>
  );
}
