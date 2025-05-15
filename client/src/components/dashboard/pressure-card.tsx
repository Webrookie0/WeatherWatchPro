import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Gauge } from "lucide-react";

interface PressureCardProps {
  pressure?: number;
  isLoading: boolean;
}

export default function PressureCard({ pressure, isLoading }: PressureCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Pressure</h3>
          <Gauge className="text-primary" />
        </div>
      </div>
      <div className="px-4 py-6 flex flex-col items-center">
        {isLoading || typeof pressure === 'undefined' ? (
          <Skeleton className="h-10 w-36 mb-1" />
        ) : (
          <div className="text-4xl font-bold text-primary mb-1">
            {pressure.toFixed(2)} hPa
          </div>
        )}
        <div className="text-sm text-gray-500">Atmospheric pressure</div>
      </div>
    </Card>
  );
}
