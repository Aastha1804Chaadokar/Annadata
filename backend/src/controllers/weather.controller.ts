import { Request, Response } from 'express';

export const getWeatherForecast = async (req: Request, res: Response): Promise<void> => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 22.9734;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : 75.8577;
    const cropName = (req.query.crop as string) || 'Soybean';

    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    const response = await fetch(openMeteoUrl);
    if (!response.ok) {
      throw new Error(`Open-Meteo responded with status ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json({
      success: true,
      latitude: lat,
      longitude: lng,
      cropName,
      weather: data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch weather forecast',
    });
  }
};
