import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Droplets } from "lucide-react";

interface HumidityCardProps {
  humidity?: number;
  isLoading: boolean;
}

export default function HumidityCard({ humidity, isLoading }: HumidityCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Humidity</h3>
          <Droplets className="text-secondary" />
        </div>
      </div>
      <div className="px-4 py-6 flex flex-col items-center">
        {isLoading || typeof humidity === 'undefined' ? (
          <Skeleton className="h-10 w-28 mb-1" />
        ) : (
          <div className="text-4xl font-bold text-secondary mb-1">
            {Math.round(humidity)}%
          </div>
        )}
        <div className="text-sm text-gray-500">Relative humidity</div>
      </div>
    </Card>
  );
}
