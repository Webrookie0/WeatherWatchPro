import { InsertWeatherData, WeatherData, weatherData } from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte } from "drizzle-orm";

export interface IStorage {
  saveWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  getCurrentWeatherData(): Promise<WeatherData | undefined>;
  getHistoricalData(hours: number): Promise<WeatherData[]>;
}

export class DatabaseStorage implements IStorage {
  async saveWeatherData(data: InsertWeatherData): Promise<WeatherData> {
    // Convert numeric fields to strings for database compatibility
    const dataToInsert = {
      ...data,
      temperature_dht: String(data.temperature_dht),
      humidity: String(data.humidity),
      ...(data.temperature_bmp !== undefined && { temperature_bmp: String(data.temperature_bmp) }),
      ...(data.pressure !== undefined && { pressure: String(data.pressure) }),
      ...(data.signal_strength !== undefined && { signal_strength: String(data.signal_strength) }),
    };
    
    // Insert the data into the database
    const [result] = await db
      .insert(weatherData)
      .values([dataToInsert])
      .returning();
      
    return result;
  }

  async getCurrentWeatherData(): Promise<WeatherData | undefined> {
    // Get the most recent data
    const results = await db
      .select()
      .from(weatherData)
      .orderBy(desc(weatherData.timestamp))
      .limit(1);
      
    return results.length > 0 ? results[0] : undefined;
  }

  async getHistoricalData(hours: number = 24): Promise<WeatherData[]> {
    const now = new Date();
    const earliestTime = new Date(now.getTime() - hours * 60 * 60 * 1000);
    
    // Get data within the time range
    const results = await db
      .select()
      .from(weatherData)
      .where(gte(weatherData.timestamp, earliestTime))
      .orderBy(weatherData.timestamp);
      
    return results;
  }
}

export const storage = new DatabaseStorage();
