import { WeatherData, CurrentWeather, HourlyForecastItem, DailyForecastItem, AgriAdvisories } from '@/types/weather';
import { FarmerProfile } from '@/types/farmer';

// WMO Weather Interpretation Code Map
export function mapWmoCode(code: number): { condition: string; iconName: string } {
  if (code === 0) return { condition: 'Clear Sky (साफ मौसम)', iconName: 'Sun' };
  if (code === 1 || code === 2) return { condition: 'Partly Cloudy (आंशिक बादल)', iconName: 'CloudSun' };
  if (code === 3) return { condition: 'Overcast (छाए हुए बादल)', iconName: 'Cloud' };
  if (code === 45 || code === 48) return { condition: 'Fog / Mist (कोहरा)', iconName: 'CloudFog' };
  if (code >= 51 && code <= 55) return { condition: 'Light Drizzle (बूंदाबांदी)', iconName: 'CloudDrizzle' };
  if (code >= 61 && code <= 65) return { condition: 'Moderate Rain (बारिश)', iconName: 'CloudRain' };
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers (तेज बारिश)', iconName: 'CloudRainWind' };
  if (code >= 95) return { condition: 'Thunderstorm (बिजली और आंधी)', iconName: 'CloudLightning' };
  return { condition: 'Partly Cloudy (आंशिक बादल)', iconName: 'CloudSun' };
}

// Generate Agricultural Advisories
export function generateAgriAdvisories(
  currentTemp: number,
  humidity: number,
  windSpeed: number,
  next48hRainProbMax: number,
  rainSumNext2Days: number,
  cropName?: string
): AgriAdvisories {
  const cropStr = cropName || 'Soybean';

  // 1. IRRIGATION ADVISORY
  let irrigation: AgriAdvisories['irrigation'];
  if (next48hRainProbMax > 60 || rainSumNext2Days > 5) {
    irrigation = {
      status: 'HOLD',
      title: 'Hold Irrigation (सिंचाई रोकें)',
      message: `Rain expected in next 48 hours (${next48hRainProbMax}% probability, ~${rainSumNext2Days.toFixed(1)}mm rain).`,
      recommendation: `Delay flood or drip irrigation for your ${cropStr} crop to prevent waterlogging and nitrogen leaching.`,
      details: [
        'Precipitation chance is over 60% in your village area.',
        'Saves energy & pumping cost.',
        'Prevents root rot and fungal soil diseases.',
      ],
    };
  } else if (currentTemp > 32 && humidity < 40) {
    irrigation = {
      status: 'URGENT',
      title: 'Irrigation Required (सिंचाई की आवश्यकता)',
      message: `High temperature (${currentTemp}°C) and low humidity (${humidity}%).`,
      recommendation: `Apply light drip or evening sprinkler irrigation to avoid heat stress on ${cropStr}.`,
      details: [
        'High moisture evaporation rate observed.',
        'Irrigate during early morning or late evening hours to maximize absorption.',
      ],
    };
  } else {
    irrigation = {
      status: 'OPTIMAL',
      title: 'Optimal Moisture (सामान्य सिंचाई)',
      message: 'Soil moisture is expected to remain stable with moderate weather conditions.',
      recommendation: `Normal irrigation routine can be followed as per your ${cropStr} field schedule.`,
      details: [
        'No heavy rainfall forecast in next 48h.',
        'Favorable temperature range for root uptake.',
      ],
    };
  }

  // 2. SPRAYING ADVISORY
  let spraying: AgriAdvisories['spraying'];
  if (windSpeed > 18) {
    spraying = {
      status: 'AVOID',
      title: 'Avoid Foliar Spray (छिड़काव न करें)',
      message: `High wind speed detected (${windSpeed.toFixed(1)} km/h).`,
      recommendation: `Do NOT apply chemical pesticides, insecticides or liquid fertilizers now. High wind causes chemical drift.`,
      details: [
        'Wind speed exceeds safe threshold (15-18 km/h).',
        'Chemical drift reduces efficiency and causes damage to neighboring fields.',
      ],
    };
  } else if (next48hRainProbMax > 50) {
    spraying = {
      status: 'CAUTION',
      title: 'Spray with Caution (सावधानी बरतें)',
      message: `Chance of rain within 24-48 hours (${next48hRainProbMax}%).`,
      recommendation: `If spraying pesticide on ${cropStr}, use a rain-sticker / adjuvant or postpone until after rain.`,
      details: [
        'Rain within 6 hours of spraying will wash off non-systemic chemicals.',
        'Ensure 4-6 hours dry window post spraying.',
      ],
    };
  } else {
    spraying = {
      status: 'GOOD',
      title: 'Ideal Spray Window (छिड़काव का सही समय)',
      message: `Calm wind (${windSpeed.toFixed(1)} km/h) and no heavy rain expected today.`,
      recommendation: `Good conditions for applying foliar spray, micronutrients, or pest control treatments on ${cropStr}.`,
      details: [
        'Low wind drift risk.',
        'Optimal temperature for systemic absorption.',
      ],
    };
  }

  // 3. HARVESTING ADVISORY
  let harvesting: AgriAdvisories['harvesting'];
  if (rainSumNext2Days > 8 || next48hRainProbMax > 70) {
    harvesting = {
      status: 'UNSUITABLE',
      title: 'Unfavorable for Harvest (कटाई के लिए अनुकूल नहीं)',
      message: `Rain or high humidity expected in next 2 days.`,
      recommendation: `Keep harvested produce covered in dry storage. Avoid threshing during rain showers.`,
      details: [
        'High moisture increases grain spoilage risk.',
        'Ensure tarpaulins are ready for open crops.',
      ],
    };
  } else {
    harvesting = {
      status: 'SUITABLE',
      title: 'Favorable Field Conditions (खेत कार्य अनुकूल)',
      message: 'Dry atmosphere and sunny/partly cloudy weather.',
      recommendation: `Ideal time for field harvesting, land preparation, sowing, and sun-drying harvested grains.`,
      details: [
        'Good sunshine hours for moisture reduction.',
        'Optimal ground tractor mobility.',
      ],
    };
  }

  return { irrigation, spraying, harvesting };
}

// Fetch live weather data from Open-Meteo with mock fallback
export async function getWeatherData(profile: FarmerProfile): Promise<WeatherData> {
  const lat = profile.latitude || 22.9734; // Default Indore lat
  const lng = profile.longitude || 75.8577; // Default Indore lng
  const locationName = `${profile.village || 'Sanwer'}, ${profile.district || 'Indore'}, ${profile.state || 'Madhya Pradesh'}`;
  const cropName = profile.currentCrop ? profile.currentCrop.cropName : profile.mainCrop || 'Soybean';

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo HTTP status ${res.status}`);

    const data = await res.json();

    const curr = data.current;
    const wmo = mapWmoCode(curr.weather_code || 0);

    const currentWeather: CurrentWeather = {
      temperature: Math.round(curr.temperature_2m),
      apparentTemperature: Math.round(curr.apparent_temperature || curr.temperature_2m),
      humidity: curr.relative_humidity_2m || 55,
      windSpeed: Math.round(curr.wind_speed_10m || 10),
      windDirection: curr.wind_direction_10m || 180,
      precipitationProb: Math.round(data.daily?.precipitation_probability_max?.[0] || 20),
      condition: wmo.condition,
      conditionCode: curr.weather_code || 0,
      uvIndex: 6,
      pressure: Math.round(curr.surface_pressure || 1012),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Hourly next 24h
    const hourly: HourlyForecastItem[] = [];
    if (data.hourly && data.hourly.time) {
      for (let i = 0; i < Math.min(24, data.hourly.time.length); i += 2) {
        const timeStr = new Date(data.hourly.time[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const hwmo = mapWmoCode(data.hourly.weather_code[i] || 0);
        hourly.push({
          time: timeStr,
          temp: Math.round(data.hourly.temperature_2m[i]),
          rainProb: Math.round(data.hourly.precipitation_probability?.[i] || 0),
          windSpeed: Math.round(data.hourly.wind_speed_10m?.[i] || 5),
          condition: hwmo.condition,
          conditionCode: data.hourly.weather_code[i] || 0,
        });
      }
    }

    // Daily next 7 days
    const daily: DailyForecastItem[] = [];
    if (data.daily && data.daily.time) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 0; i < Math.min(7, data.daily.time.length); i++) {
        const d = new Date(data.daily.time[i]);
        const dayName = i === 0 ? 'Today' : days[d.getDay()];
        const dwmo = mapWmoCode(data.daily.weather_code[i] || 0);
        daily.push({
          date: data.daily.time[i],
          dayName,
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          precipitationProb: Math.round(data.daily.precipitation_probability_max?.[i] || 15),
          rainSum: Number((data.daily.precipitation_sum?.[i] || 0).toFixed(1)),
          condition: dwmo.condition,
          conditionCode: data.daily.weather_code[i] || 0,
        });
      }
    }

    const rainSum2Days = (daily[0]?.rainSum || 0) + (daily[1]?.rainSum || 0);
    const maxRainProb2Days = Math.max(daily[0]?.precipitationProb || 0, daily[1]?.precipitationProb || 0);

    const advisories = generateAgriAdvisories(
      currentWeather.temperature,
      currentWeather.humidity,
      currentWeather.windSpeed,
      maxRainProb2Days,
      rainSum2Days,
      cropName
    );

    return {
      latitude: lat,
      longitude: lng,
      locationName,
      current: currentWeather,
      hourly,
      daily,
      advisories,
      isMockData: false,
    };
  } catch (err) {
    console.warn('Live weather fetch failed, returning mock fallback data:', err);
    return getMockWeatherData(lat, lng, locationName, cropName);
  }
}

// Fallback Mock Weather Generator
export function getMockWeatherData(lat: number, lng: number, locationName: string, cropName?: string): WeatherData {
  const current: CurrentWeather = {
    temperature: 28,
    apparentTemperature: 29,
    humidity: 62,
    windSpeed: 12,
    windDirection: 210,
    precipitationProb: 25,
    condition: 'Partly Cloudy (आंशिक बादल)',
    conditionCode: 2,
    uvIndex: 7,
    pressure: 1012,
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const hourly: HourlyForecastItem[] = [
    { time: '08:00', temp: 24, rainProb: 10, windSpeed: 8, condition: 'Clear Sky', conditionCode: 0 },
    { time: '10:00', temp: 27, rainProb: 15, windSpeed: 10, condition: 'Partly Cloudy', conditionCode: 1 },
    { time: '12:00', temp: 30, rainProb: 20, windSpeed: 14, condition: 'Partly Cloudy', conditionCode: 2 },
    { time: '14:00', temp: 31, rainProb: 30, windSpeed: 16, condition: 'Overcast', conditionCode: 3 },
    { time: '16:00', temp: 29, rainProb: 25, windSpeed: 12, condition: 'Partly Cloudy', conditionCode: 2 },
    { time: '18:00', temp: 26, rainProb: 15, windSpeed: 9, condition: 'Clear Sky', conditionCode: 0 },
    { time: '20:00', temp: 24, rainProb: 10, windSpeed: 7, condition: 'Clear Sky', conditionCode: 0 },
  ];

  const daily: DailyForecastItem[] = [
    { date: 'Today', dayName: 'Today', tempMax: 31, tempMin: 22, precipitationProb: 25, rainSum: 0.2, condition: 'Partly Cloudy', conditionCode: 2 },
    { date: 'Tomorrow', dayName: 'Thu', tempMax: 29, tempMin: 21, precipitationProb: 65, rainSum: 8.5, condition: 'Moderate Rain', conditionCode: 61 },
    { date: 'Day 3', dayName: 'Fri', tempMax: 27, tempMin: 20, precipitationProb: 40, rainSum: 2.1, condition: 'Light Drizzle', conditionCode: 51 },
    { date: 'Day 4', dayName: 'Sat', tempMax: 30, tempMin: 22, precipitationProb: 15, rainSum: 0.0, condition: 'Clear Sky', conditionCode: 0 },
    { date: 'Day 5', dayName: 'Sun', tempMax: 32, tempMin: 23, precipitationProb: 10, rainSum: 0.0, condition: 'Clear Sky', conditionCode: 0 },
    { date: 'Day 6', dayName: 'Mon', tempMax: 31, tempMin: 22, precipitationProb: 20, rainSum: 0.5, condition: 'Partly Cloudy', conditionCode: 1 },
    { date: 'Day 7', dayName: 'Tue', tempMax: 30, tempMin: 21, precipitationProb: 30, rainSum: 1.2, condition: 'Partly Cloudy', conditionCode: 2 },
  ];

  const advisories = generateAgriAdvisories(28, 62, 12, 65, 8.7, cropName);

  return {
    latitude: lat,
    longitude: lng,
    locationName,
    current,
    hourly,
    daily,
    advisories,
    isMockData: true,
  };
}
