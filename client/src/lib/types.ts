export interface WeatherData {
  id: number;
  deviceId: string;
  temperatureDHT: number | null;
  temperatureBMP: number | null;
  humidity: number | null;
  pressure: number | null;
  timestamp: string;
  signalStrength?: number | null;
  uptime?: number | null;
}

export interface Device {
  id: number;
  deviceId: string;
  name: string | null;
  lastSeen: string;
}

export interface ComfortLevel {
  level: string;
  description: string;
}

export interface WeatherStatus {
  status: string;
  description: string;
}

export interface PressureTrend {
  trend: string;
  description: string;
}

export interface WeatherIndication {
  indication: string;
  description: string;
}

export interface WeatherInterpretation {
  comfort: ComfortLevel;
  humidityStatus: WeatherStatus;
  pressureTrend: PressureTrend;
  weatherIndication: WeatherIndication;
}

export interface GaugeData {
  value: number;
  min: number;
  max: number;
  suffix: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface HistoricalData {
  temperatureDHT: ChartDataPoint[];
  temperatureBMP: ChartDataPoint[];
  humidity: ChartDataPoint[];
  pressure: ChartDataPoint[];
}
