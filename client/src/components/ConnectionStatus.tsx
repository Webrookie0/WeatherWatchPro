import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
  lastUpdate: string;
}

export default function ConnectionStatus({ isConnected, lastUpdate }: ConnectionStatusProps) {
  return (
    <div className="bg-card rounded-lg shadow-md p-4 mb-6 flex items-center">
      <div className="flex items-center">
        {isConnected ? (
          <>
            <span className="flex h-3 w-3 relative mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
              Connected to sensor
            </span>
          </>
        ) : (
          <>
            <span className="flex h-3 w-3 relative mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
              Disconnected
            </span>
          </>
        )}
      </div>
      <div className="ml-auto flex items-center">
        <span className="material-icons text-gray-500 mr-1">schedule</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: {lastUpdate}</span>
      </div>
    </div>
  );
}
