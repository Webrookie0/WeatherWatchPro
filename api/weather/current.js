// Dedicated serverless function for current weather data
import pkg from '@neondatabase/serverless';
const { neon } = pkg;

// Create database client
const client = neon(process.env.DATABASE_URL);

// Utility to format weather data
function formatWeatherData(rawData) {
  if (!rawData) return null;
  
  return {
    device_id: rawData.device_id,
    temperature_dht: parseFloat(rawData.temperature_dht),
    temperature_bmp: rawData.temperature_bmp ? parseFloat(rawData.temperature_bmp) : null,
    humidity: parseFloat(rawData.humidity),
    pressure: rawData.pressure ? parseFloat(rawData.pressure) : null,
    signal_strength: rawData.signal_strength,
    uptime: rawData.uptime,
    timestamp: rawData.timestamp
  };
}

// Handler for /api/weather/current
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Connect to the database
    await client.connect();
    
    const result = await client.query(`
      SELECT * FROM weather_data
      ORDER BY timestamp DESC
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No weather data available" });
    }
    
    return res.status(200).json(formatWeatherData(result.rows[0]));
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  } finally {
    // Close the database connection
    await client.end();
  }
} 