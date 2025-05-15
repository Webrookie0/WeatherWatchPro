import { Skeleton } from "@/components/ui/skeleton";

interface DeviceInfoProps {
  type: "id" | "uptime" | "signal";
  value: string;
  isLoading: boolean;
}

export default function DeviceInfo({ type, value, isLoading }: DeviceInfoProps) {
  // Determine label based on type
  const getLabel = () => {
    switch (type) {
      case "id":
        return "Device ID";
      case "uptime":
        return "Uptime";
      case "signal":
        return "Signal Strength";
      default:
        return "Info";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-sm text-gray-500 mb-1">{getLabel()}</div>
      {isLoading ? (
        <Skeleton className="h-5 w-32" />
      ) : (
        <div className="font-medium">{value}</div>
      )}
    </div>
  );
}
