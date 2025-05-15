import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
  lastUpdate: Date | null;
}

export default function ConnectionStatus({ isConnected, lastUpdate }: ConnectionStatusProps) {
  // Format the last update time
  const formatLastUpdate = () => {
    if (!lastUpdate) return "Never";
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) {
      return "Just now";
    } else if (diffSec < 3600) {
      const minutes = Math.floor(diffSec / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return lastUpdate.toLocaleTimeString();
    }
  };

  return (
    <Card className="p-4 mb-6 flex items-center">
      <div className="flex items-center">
        <span className="flex h-3 w-3 relative mr-2">
          {isConnected ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          )}
        </span>
        <span className="text-sm text-gray-700">
          {isConnected ? "Connected to sensor" : "Disconnected"}
        </span>
      </div>
      <div className="ml-auto flex items-center">
        <Clock className="h-4 w-4 text-gray-500 mr-1" />
        <span className="text-sm text-gray-500">
          Last updated: {formatLastUpdate()}
        </span>
      </div>
    </Card>
  );
}
