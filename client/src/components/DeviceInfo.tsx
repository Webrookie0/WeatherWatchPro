import { Card } from "@/components/ui/card";

interface DeviceInfoProps {
  title: string;
  value: string;
}

export default function DeviceInfo({ title, value }: DeviceInfoProps) {
  return (
    <Card className="border border-border p-4">
      <div className="text-sm text-muted-foreground mb-1">{title}</div>
      <div className="font-medium text-foreground">{value}</div>
    </Card>
  );
}
