import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/dashboard/header";
import Footer from "@/components/dashboard/footer";
import ConnectionStatus from "@/components/dashboard/connection-status";
import TemperatureCard from "@/components/dashboard/temperature-card";
import HumidityCard from "@/components/dashboard/humidity-card";
import PressureCard from "@/components/dashboard/pressure-card";
import GaugeDisplay from "@/components/dashboard/gauge-display";
import HistoryChart from "@/components/dashboard/history-chart";
import WeatherIndicator from "@/components/dashboard/weather-indicator";
import DeviceInfo from "@/components/dashboard/device-info";
import { Card } from "@/components/ui/card";
import { WeatherData, HistoricalWeatherData } from "@shared/schema";

export default function Home() {
  // Fetch latest weather data
  const { data: currentData, isLoading: isLoadingCurrent, refetch: refetchCurrent } = useQuery<WeatherData>({
    queryKey: ['/api/weather/current'],
  });

  // Fetch historical weather data
  const { data: historicalData, isLoading: isLoadingHistory } = useQuery<HistoricalWeatherData[]>({
    queryKey: ['/api/weather/history'],
  });

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Set up automatic refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchCurrent();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetchCurrent]);

  // Update lastUpdate time when we get new data
  useEffect(() => {
    if (currentData) {
      setLastUpdate(new Date());
    }
  }, [currentData]);
  
  // No sensor reading indicator
  const noSensorData = !currentData || isLoadingCurrent;

  // Calculate comfort level based on temperature and humidity
  const getComfortLevel = () => {
    if (!currentData) return "Unknown";
    
    const temp = Number(currentData.temperature_dht);
    const humidity = Number(currentData.humidity);
    
    if (temp < 18) return "Cold";
    if (temp > 28) return "Hot";
    if (humidity < 30) return "Dry";
    if (humidity > 70) return "Humid";
    return "Comfortable";
  };

  // Get humidity status text
  const getHumidityStatus = () => {
    if (!currentData) return "Unknown";
    
    const humidity = Number(currentData.humidity);
    
    if (humidity < 30) return "Very Dry";
    if (humidity < 40) return "Dry";
    if (humidity < 60) return "Normal";
    if (humidity < 70) return "Humid";
    return "Very Humid";
  };

  // Get pressure trend based on latest readings
  const getPressureTrend = () => {
    if (!historicalData || historicalData.length < 2) return "Unknown";
    
    const latest = historicalData[historicalData.length - 1].pressure ? Number(historicalData[historicalData.length - 1].pressure) : 0;
    const previous = historicalData[historicalData.length - 2].pressure ? Number(historicalData[historicalData.length - 2].pressure) : 0;
    
    if (Math.abs(latest - previous) < 1) return "Stable";
    return latest > previous ? "Rising" : "Falling";
  };

  // Get weather indication based on pressure and trend
  const getWeatherIndication = () => {
    if (!currentData || !currentData.pressure) return "Unknown";
    
    const pressure = Number(currentData.pressure);
    const trend = getPressureTrend();
    
    if (pressure > 1022 && trend === "Rising") return "Clear Weather";
    if (pressure > 1022 && trend === "Falling") return "Clear, Changing";
    if (pressure > 1009 && pressure <= 1022 && trend === "Rising") return "Fair Weather";
    if (pressure > 1009 && pressure <= 1022 && trend === "Falling") return "Possible Rain";
    if (pressure <= 1009 && trend === "Rising") return "Clearing";
    if (pressure <= 1009 && trend === "Falling") return "Rain Likely";
    
    return "Moderate Conditions";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Connection Status */}
        <ConnectionStatus 
          isConnected={!!currentData && !isLoadingCurrent}
          lastUpdate={lastUpdate}
        />

        {/* Current Readings */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Readings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TemperatureCard 
            sensor="DHT11" 
            temperature={currentData?.temperature_dht ? Number(currentData.temperature_dht) : undefined} 
            isLoading={isLoadingCurrent} 
          />
          <TemperatureCard 
            sensor="BMP180" 
            temperature={currentData?.temperature_bmp ? Number(currentData.temperature_bmp) : undefined} 
            isLoading={isLoadingCurrent} 
            sensorType="secondary"
          />
          <HumidityCard 
            humidity={currentData?.humidity ? Number(currentData.humidity) : undefined} 
            isLoading={isLoadingCurrent} 
          />
          <PressureCard 
            pressure={currentData?.pressure ? Number(currentData.pressure) : undefined} 
            isLoading={isLoadingCurrent} 
          />
        </div>

        {/* Gauges Section */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sensor Visualizations</h2>
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <GaugeDisplay
              type="temperature_dht"
              value={currentData?.temperature_dht}
              min={0}
              max={50}
              label="Temperature (DHT11)"
              unit="°C"
              isLoading={isLoadingCurrent}
            />
            <GaugeDisplay
              type="temperature_bmp"
              value={currentData?.temperature_bmp}
              min={0}
              max={50}
              label="Temperature (BMP180)"
              unit="°C"
              isLoading={isLoadingCurrent}
            />
            <GaugeDisplay
              type="humidity"
              value={currentData?.humidity}
              min={0}
              max={100}
              label="Humidity"
              unit="%"
              isLoading={isLoadingCurrent}
            />
            <GaugeDisplay
              type="pressure"
              value={currentData?.pressure}
              min={980}
              max={1040}
              label="Pressure"
              unit="hPa"
              isLoading={isLoadingCurrent}
            />
          </div>
        </Card>

        {/* Historical Data Section */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">24-Hour History</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <HistoryChart
            type="temperature"
            data={historicalData || []}
            isLoading={isLoadingHistory}
          />
          <HistoryChart
            type="humidity_pressure"
            data={historicalData || []}
            isLoading={isLoadingHistory}
          />
        </div>

        {/* Weather Information */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Weather Interpretation</h2>
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <WeatherIndicator
              type="comfort"
              value={getComfortLevel()}
              isLoading={isLoadingCurrent}
            />
            <WeatherIndicator
              type="humidity_status"
              value={getHumidityStatus()}
              isLoading={isLoadingCurrent}
            />
            <WeatherIndicator
              type="pressure_trend"
              value={getPressureTrend()}
              isLoading={isLoadingHistory}
            />
            <WeatherIndicator
              type="forecast"
              value={getWeatherIndication()}
              isLoading={isLoadingCurrent || isLoadingHistory}
            />
          </div>
        </Card>

        {/* ESP8266 Info Section */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Device Information</h2>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DeviceInfo
              type="id"
              value={currentData?.device_id || "Unknown"}
              isLoading={isLoadingCurrent}
            />
            <DeviceInfo
              type="uptime"
              value={currentData?.uptime || "Unknown"}
              isLoading={isLoadingCurrent}
            />
            <DeviceInfo
              type="signal"
              value={currentData?.signal_strength ? `${currentData.signal_strength} dBm` : "Unknown"}
              isLoading={isLoadingCurrent}
            />
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
