import { InsertWeatherData, WeatherData } from "@shared/schema";

export interface IStorage {
  saveWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  getCurrentWeatherData(): Promise<WeatherData | undefined>;
  getHistoricalData(hours: number): Promise<WeatherData[]>;
}

export class MemStorage implements IStorage {
  private weatherData: WeatherData[];
  private currentId: number;

  constructor() {
    this.weatherData = [];
    this.currentId = 1;
  }

  async saveWeatherData(data: InsertWeatherData): Promise<WeatherData> {
    const id = this.currentId++;
    const timestamp = new Date();
    
    const weatherData: WeatherData = {
      id,
      ...data,
      timestamp,
    };
    
    // Add to the beginning of the array for efficient recent data retrieval
    this.weatherData.unshift(weatherData);
    
    // Keep only the last 1000 entries (about 8 hours if updated every 30 seconds)
    if (this.weatherData.length > 1000) {
      this.weatherData = this.weatherData.slice(0, 1000);
    }
    
    return weatherData;
  }

  async getCurrentWeatherData(): Promise<WeatherData | undefined> {
    // Return the most recent data
    return this.weatherData[0];
  }

  async getHistoricalData(hours: number = 24): Promise<WeatherData[]> {
    const now = new Date();
    const earliestTime = new Date(now.getTime() - hours * 60 * 60 * 1000);
    
    // Filter data within the requested time range
    const filteredData = this.weatherData.filter(
      data => data.timestamp > earliestTime
    );
    
    // We want the data ordered from oldest to newest for charts
    return [...filteredData].reverse();
  }
}

export const storage = new MemStorage();
