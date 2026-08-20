export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

export const DEMO_CROP_RECOMMENDATION = {
  cropName: 'Soybean (सोयाबीन)',
  scientificName: 'Glycine max',
  suitabilityScore: 92,
  season: 'Kharif (Monsoon)',
  factors: [
    { label: 'Soil Type', value: 'Black Clay Loam', match: 'Ideal' },
    { label: 'Weather Forecast', value: 'Moderate Rainfall (750mm)', match: 'High' },
    { label: 'Market Outlook', value: '₹4,850 / Quintal (Bullish)', match: 'Favorable' },
    { label: 'Water Requirement', value: 'Medium (Rainfed compatible)', match: 'Optimal' },
  ],
  disclaimer: 'Demonstration model output. Connects to future Annadata ML inference engine at /api/crops.',
};

export const DEMO_WEATHER_ADVISORY = {
  location: 'Indore Region, Madhya Pradesh',
  temperature: 30,
  humidity: 68,
  rainProbability: 70,
  forecastWindow: 'Next 24 Hours',
  advisoryText: 'High probability of evening rain shower. Postpone pesticide spraying and check soil moisture before planning next irrigation cycle.',
  disclaimer: 'Demo weather metrics. Integrates with localized IMD weather stream at /api/weather.',
};

export const DEMO_SOIL_CARD = {
  parameters: [
    { key: 'N', name: 'Nitrogen', value: '210 kg/ha', status: 'Low', target: '280 kg/ha', color: '#3F7D3A' },
    { key: 'P', name: 'Phosphorus', value: '18 kg/ha', status: 'Medium', target: '20 kg/ha', color: '#E8B94A' },
    { key: 'K', name: 'Potassium', value: '310 kg/ha', status: 'High', target: '250 kg/ha', color: '#9A7048' },
    { key: 'pH', name: 'Soil pH', value: '6.8', status: 'Optimal', target: '6.5 - 7.5', color: '#3F7D3A' },
    { key: 'OC', name: 'Organic Carbon', value: '0.52%', status: 'Medium', target: '0.75%', color: '#E8B94A' },
  ],
  notice: 'Important: Photograph analysis cannot replace certified laboratory Soil Health Cards. Always use official SHC test reports for precise fertilizer dosage calculation.',
};

export const DEMO_VOICE_CHAT = {
  query: 'मेरे खेत के लिए आज क्या करना चाहिए?',
  queryEnglish: 'What should I do for my farm today?',
  response: 'आज शाम बारिश की 70% संभावना है। सिंचाई रोकें और जल निकासी (drainage) की व्यवस्था जांच लें।',
  responseEnglish: 'There is a 70% chance of rain this evening. Pause irrigation and verify field drainage channels.',
};

export const ACCESS_CHANNELS = [
  {
    id: 'smartphone',
    title: 'Smartphone App',
    subtitle: 'Rich Visual & Camera Diagnostics',
    description: 'High-contrast UI designed for direct sun readability, camera-based leaf disease scan, interactive weather maps, and soil card scanner.',
    icon: 'Smartphone',
    badge: 'Full Visual Experience',
    color: '#3F7D3A',
  },
  {
    id: 'ivr',
    title: 'Basic Phone IVR',
    subtitle: 'Toll-Free Voice Helpline',
    description: 'Dial in from any basic keypad phone. Speak in your local dialect to receive automated weather alerts, crop recommendations, and market rates.',
    icon: 'PhoneCall',
    badge: '100% Offline Access',
    color: '#9A7048',
  },
  {
    id: 'sms',
    title: 'SMS & WhatsApp',
    subtitle: 'Text-Based Localized Alerts',
    description: 'Get daily morning micro-advisories, mandi price updates, and storm warnings directly on SMS without needing internet connectivity.',
    icon: 'MessageSquare',
    badge: 'Instant Alerts',
    color: '#E8B94A',
  },
];
