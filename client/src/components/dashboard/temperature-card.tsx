import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Thermometer } from "lucide-react";

interface TemperatureCardProps {
  sensor: "DHT11" | "BMP180";
  temperature?: number;
  isLoading: boolean;
  sensorType?: "primary" | "secondary";
}

export default function TemperatureCard({ sensor, temperature, isLoading, sensorType = "primary" }: TemperatureCardProps) {
  const colorClass = sensorType === "primary" ? "text-[#FF9800]" : "text-[#00BCD4]";
  const sensorDescription = sensorType === "primary" ? "Primary temperature sensor" : "Secondary temperature sensor";

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Temperature ({sensor})</h3>
          <Thermometer className={colorClass} />
        </div>
      </div>
      <div className="px-4 py-6 flex flex-col items-center">
        {isLoading || typeof temperature === 'undefined' ? (
          <Skeleton className="h-10 w-28 mb-1" />
        ) : (
          <div className={`text-4xl font-bold ${colorClass} mb-1`}>
            {temperature.toFixed(1)}°C
          </div>
        )}
        <div className="text-sm text-gray-500">{sensorDescription}</div>
      </div>
    </Card>
  );
}
