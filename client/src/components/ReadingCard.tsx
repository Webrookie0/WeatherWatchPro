import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { getTemperatureColor } from "@/lib/utils";

interface ReadingCardProps {
  title: string;
  value: number | null | undefined;
  unit: string;
  description: string;
  icon: ReactNode;
  colorBasedOnValue?: boolean;
}

export default function ReadingCard({ 
  title, 
  value, 
  unit, 
  description, 
  icon,
  colorBasedOnValue = false
}: ReadingCardProps) {
  const formattedValue = value !== null && value !== undefined 
    ? `${value.toFixed(1)}${unit}`
    : 'N/A';
  
  const valueColor = colorBasedOnValue && value !== null && value !== undefined
    ? getTemperatureColor(value)
    : 'text-foreground';

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
          <div className="text-2xl">{icon}</div>
        </div>
      </div>
      <div className="px-4 py-6 flex flex-col items-center">
        <div className={`text-4xl font-bold mb-1 ${valueColor}`}>
          {formattedValue}
        </div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </Card>
  );
}
