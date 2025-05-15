import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  WeatherData,
  WeatherInterpretation,
  ComfortLevel,
  WeatherStatus,
  PressureTrend,
  WeatherIndication,
  HistoricalData,
  ChartDataPoint
} from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(timestamp: string | Date): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

export function formatDate(timestamp: string | Date): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateTime(timestamp: string | Date): string {
  const date = new Date(timestamp);
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function getTimeAgo(timestamp: string | Date): string {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

export function formatUptimeString(seconds: number): string {
  if (seconds < 60) return `${seconds} seconds`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
}

export function getSignalStrengthLabel(dbm: number | null | undefined): string {
  if (dbm === null || dbm === undefined) return 'Unknown';
  
  if (dbm >= -50) return 'Excellent';
  if (dbm >= -60) return 'Very Good';
  if (dbm >= -70) return 'Good';
  if (dbm >= -80) return 'Fair';
  if (dbm >= -90) return 'Poor';
  return 'Very Poor';
}

export function getTemperatureColor(temp: number | null | undefined): string {
  if (temp === null || temp === undefined) return 'text-neutral';
  
  if (temp < 0) return 'text-blue-500';
  if (temp < 10) return 'text-blue-400';
  if (temp < 15) return 'text-cyan-500';
  if (temp < 20) return 'text-cyan-400';
  if (temp < 25) return 'text-green-500';
  if (temp < 30) return 'text-yellow-500';
  if (temp < 35) return 'text-orange-500';
  return 'text-red-500';
}

export function interpretWeatherData(data: WeatherData): WeatherInterpretation {
  // Default values for when we don't have sufficient data
  const defaultInterpretation: WeatherInterpretation = {
    comfort: { level: 'Unknown', description: 'Insufficient data to determine comfort level' },
    humidityStatus: { status: 'Unknown', description: 'Insufficient data to determine humidity status' },
    pressureTrend: { trend: 'Unknown', description: 'Insufficient data to determine pressure trend' },
    weatherIndication: { indication: 'Unknown', description: 'Insufficient data to provide weather indication' }
  };

  // Early return if no temperature or humidity data
  if (data.temperatureDHT === null && data.temperatureBMP === null || data.humidity === null) {
    return defaultInterpretation;
  }

  // Use available temperature (prefer DHT as primary)
  const temp = data.temperatureDHT !== null ? data.temperatureDHT : data.temperatureBMP!;
  const humidity = data.humidity!;

  // Comfort level determination
  let comfort: ComfortLevel;
  if (temp < 10) {
    comfort = { level: 'Cold', description: 'The temperature is uncomfortably cold' };
  } else if (temp < 18) {
    comfort = { level: 'Cool', description: 'The temperature is cool' };
  } else if (temp < 24) {
    if (humidity < 40) {
      comfort = { level: 'Slightly Dry', description: 'Comfortable temperature but low humidity' };
    } else if (humidity > 60) {
      comfort = { level: 'Slightly Humid', description: 'Comfortable temperature but high humidity' };
    } else {
      comfort = { level: 'Comfortable', description: 'Ideal temperature and humidity conditions' };
    }
  } else if (temp < 28) {
    if (humidity > 65) {
      comfort = { level: 'Warm and Humid', description: 'Warm with high humidity, may feel uncomfortable' };
    } else {
      comfort = { level: 'Warm', description: 'Warm but generally comfortable' };
    }
  } else {
    if (humidity > 60) {
      comfort = { level: 'Hot and Humid', description: 'Hot with high humidity, feels very uncomfortable' };
    } else {
      comfort = { level: 'Hot', description: 'Hot conditions, may be uncomfortable' };
    }
  }

  // Humidity status
  let humidityStatus: WeatherStatus;
  if (humidity < 30) {
    humidityStatus = { status: 'Very Dry', description: 'Air is very dry, may cause discomfort' };
  } else if (humidity < 40) {
    humidityStatus = { status: 'Dry', description: 'Air is dry' };
  } else if (humidity < 60) {
    humidityStatus = { status: 'Normal', description: 'Humidity is in the comfortable range' };
  } else if (humidity < 70) {
    humidityStatus = { status: 'Humid', description: 'Air is humid' };
  } else {
    humidityStatus = { status: 'Very Humid', description: 'Air is very humid, may cause discomfort' };
  }

  // Simple pressure interpretation (normally would use historical data to determine trend)
  let pressureTrend: PressureTrend;
  if (data.pressure === null) {
    pressureTrend = { trend: 'Unknown', description: 'No pressure data available' };
  } else if (data.pressure < 1000) {
    pressureTrend = { trend: 'Low', description: 'Atmospheric pressure is low' };
  } else if (data.pressure > 1020) {
    pressureTrend = { trend: 'High', description: 'Atmospheric pressure is high' };
  } else {
    pressureTrend = { trend: 'Normal', description: 'Atmospheric pressure is normal' };
  }

  // Simple weather indication based on pressure and humidity
  let weatherIndication: WeatherIndication;
  if (data.pressure === null) {
    weatherIndication = { indication: 'Unknown', description: 'Insufficient data for weather prediction' };
  } else if (data.pressure < 1000 && humidity > 70) {
    weatherIndication = { indication: 'Likely Rain', description: 'Low pressure and high humidity often indicate rain' };
  } else if (data.pressure > 1020 && humidity < 40) {
    weatherIndication = { indication: 'Likely Clear', description: 'High pressure and low humidity often indicate clear weather' };
  } else if (data.pressure > 1010) {
    weatherIndication = { indication: 'Stable', description: 'Current conditions suggest stable weather' };
  } else {
    weatherIndication = { indication: 'Changing', description: 'Conditions may be changing soon' };
  }

  return {
    comfort,
    humidityStatus,
    pressureTrend,
    weatherIndication
  };
}

// Function to extract historical data from an array of weather readings
export function extractHistoricalData(data: WeatherData[]): HistoricalData {
  const temperatureDHT: ChartDataPoint[] = [];
  const temperatureBMP: ChartDataPoint[] = [];
  const humidity: ChartDataPoint[] = [];
  const pressure: ChartDataPoint[] = [];

  // Sort data by timestamp (oldest first)
  const sortedData = [...data].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  for (const reading of sortedData) {
    const time = formatTime(reading.timestamp);
    
    if (reading.temperatureDHT !== null) {
      temperatureDHT.push({ time, value: reading.temperatureDHT });
    }
    
    if (reading.temperatureBMP !== null) {
      temperatureBMP.push({ time, value: reading.temperatureBMP });
    }
    
    if (reading.humidity !== null) {
      humidity.push({ time, value: reading.humidity });
    }
    
    if (reading.pressure !== null) {
      pressure.push({ time, value: reading.pressure });
    }
  }

  return {
    temperatureDHT,
    temperatureBMP,
    humidity,
    pressure
  };
}
