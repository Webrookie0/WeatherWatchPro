import { useEffect, useState } from "react";
import { Cloud, CloudLightning } from "lucide-react";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString();
  
  // Format date as Day, Month Date, Year
  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <header className="bg-primary-dark text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-3 md:mb-0">
          <CloudLightning className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold">ESP8266 Weather Station</h1>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xl font-medium">{formattedTime}</div>
          <div className="text-sm opacity-90">{formattedDate}</div>
        </div>
      </div>
    </header>
  );
}
