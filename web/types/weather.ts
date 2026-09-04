export interface CurrentWeather {
  temperature: number; // °C
  apparentTemperature: number; // Feels like °C
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: number; // degrees
  precipitationProb: number; // %
  condition: string; // e.g. 'Partly Cloudy', 'Heavy Rain'
  conditionCode: number; // WMO Weather code
  uvIndex: number;
  pressure: number; // hPa
  updatedAt: string;
}

export interface HourlyForecastItem {
  time: string; // e.g. "14:00"
  temp: number;
  rainProb: number;
  windSpeed: number;
  condition: string;
  conditionCode: number;
}

export interface DailyForecastItem {
  date: string; // "2026-08-27"
  dayName: string; // "Thu"
  tempMax: number;
  tempMin: number;
  precipitationProb: number;
  rainSum: number; // mm
  condition: string;
  conditionCode: number;
}

export interface AgriAdvisoryItem {
  status: 'OPTIMAL' | 'GOOD' | 'HOLD' | 'CAUTION' | 'AVOID' | 'URGENT' | 'SUITABLE' | 'UNSUITABLE';
  title: string;
  message: string;
  recommendation: string;
  details: string[];
}

export interface AgriAdvisories {
  irrigation: AgriAdvisoryItem;
  spraying: AgriAdvisoryItem;
  harvesting: AgriAdvisoryItem;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  locationName: string; // e.g. "Sanwer, Indore, Madhya Pradesh"
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  advisories: AgriAdvisories;
  isMockData?: boolean;
}
