import i18n from '@/lib/i18n/config';

export interface CurrentCropOption {
  cropId: string;
  cropName: string;
  cropNameHi: string;
  category: string;
  translations?: Record<string, string>;
}

export const CROP_CATEGORIES = [
  'CEREALS',
  'PULSES',
  'OILSEEDS',
  'COMMERCIAL CROPS',
  'VEGETABLES',
  'FRUITS',
  'OTHER',
] as const;

export const CURRENT_CROP_DATASET: CurrentCropOption[] = [
  // CEREALS
  { cropId: 'wheat', cropName: 'Wheat', cropNameHi: 'गेहूं', category: 'CEREALS', translations: { en: 'Wheat', hi: 'गेहूं', mr: 'गहू', ta: 'கோதுமை', te: 'గోధుమ', kn: 'ಗೋಧಿ', bn: 'গম' } },
  { cropId: 'rice', cropName: 'Rice', cropNameHi: 'धान / चावल', category: 'CEREALS', translations: { en: 'Rice', hi: 'धान / चावल', mr: 'तांदूळ', ta: 'அரிசி', te: 'వరి', kn: 'అక్కి', bn: 'ধান / চাল' } },
  { cropId: 'maize', cropName: 'Maize', cropNameHi: 'मक्का', category: 'CEREALS', translations: { en: 'Maize', hi: 'मक्का', mr: 'मका', ta: 'மக்காச்சோளம்', te: 'మొక్కజొన్న', kn: 'మెక్కెజోళ', bn: 'ভুট্টা' } },
  { cropId: 'barley', cropName: 'Barley', cropNameHi: 'जौ', category: 'CEREALS', translations: { en: 'Barley', hi: 'जौ', mr: 'सातू', ta: 'பார்லி', te: 'బార్లీ', kn: 'బార్లి', bn: 'বার্লি' } },
  { cropId: 'bajra', cropName: 'Bajra', cropNameHi: 'बाजरा', category: 'CEREALS', translations: { en: 'Bajra', hi: 'बाजरा', mr: 'बाजरी', ta: 'கம்பு', te: 'సజ్జలు', kn: 'సజ్జె', bn: 'বাজরা' } },
  { cropId: 'jowar', cropName: 'Jowar', cropNameHi: 'ज्वार', category: 'CEREALS', translations: { en: 'Jowar', hi: 'ज्वार', mr: 'ज्वारी', ta: 'சோளம்', te: 'జొన్నలు', kn: 'జోళ', bn: 'জোয়ার' } },
  { cropId: 'ragi', cropName: 'Ragi', cropNameHi: 'रागी', category: 'CEREALS', translations: { en: 'Ragi', hi: 'रागी', mr: 'नाचणी', ta: 'கேழ்வரகு', te: 'రాగులు', kn: 'రాగి', bn: 'রাগি' } },

  // PULSES
  { cropId: 'soybean', cropName: 'Soybean', cropNameHi: 'सोयाबीन', category: 'PULSES', translations: { en: 'Soybean', hi: 'सोयाबीन', mr: 'सोयाबीन', ta: 'சோயாபீன்', te: 'సోయాబీన్', kn: 'సోయాబీన్', bn: 'সয়াবিন' } },
  { cropId: 'gram', cropName: 'Gram', cropNameHi: 'चना', category: 'PULSES', translations: { en: 'Gram', hi: 'चना', mr: 'हरभरा', ta: 'கொண்டைக்கடலை', te: 'శనగలు', kn: 'కడలె', bn: 'ছোলা' } },
  { cropId: 'pigeon_pea', cropName: 'Pigeon Pea', cropNameHi: 'अरहर / तूर', category: 'PULSES', translations: { en: 'Pigeon Pea', hi: 'अरहर / तूर', mr: 'तूर', ta: 'துவரை', te: 'కందులు', kn: 'తోరి', bn: 'অড়হর' } },
  { cropId: 'lentil', cropName: 'Lentil', cropNameHi: 'मसूर', category: 'PULSES', translations: { en: 'Lentil', hi: 'मसूर', mr: 'मसूर', ta: 'மைசூர் பருப்பு', te: 'మసూర్', kn: 'మసూర్', bn: 'মসুর' } },
  { cropId: 'moong', cropName: 'Moong', cropNameHi: 'मूंग', category: 'PULSES', translations: { en: 'Moong', hi: 'मूंग', mr: 'मूग', ta: 'பாசிப்பயறு', te: 'పెసలు', kn: 'హెసరుబేళె', bn: 'মুগ' } },
  { cropId: 'urad', cropName: 'Urad', cropNameHi: 'उड़द', category: 'PULSES', translations: { en: 'Urad', hi: 'उड़द', mr: 'उडीद', ta: 'உளுந்து', te: 'మినుములు', kn: 'ఉద్దినుబేళె', bn: 'উড়াদ' } },

  // OILSEEDS
  { cropId: 'mustard', cropName: 'Mustard', cropNameHi: 'सरसों', category: 'OILSEEDS', translations: { en: 'Mustard', hi: 'सरसों', mr: 'मोहरी', ta: 'கடுகு', te: 'ఆవాలు', kn: 'సాసివె', bn: 'সর্ষে' } },
  { cropId: 'groundnut', cropName: 'Groundnut', cropNameHi: 'मूंगफली', category: 'OILSEEDS', translations: { en: 'Groundnut', hi: 'मूंगफली', mr: 'भुईमूग', ta: 'நிலக்கடலை', te: 'వేరుశనగ', kn: 'శెంగ', bn: 'চীনাবাদাম' } },
  { cropId: 'sunflower', cropName: 'Sunflower', cropNameHi: 'सूरजमुखी', category: 'OILSEEDS', translations: { en: 'Sunflower', hi: 'सूरजमुखी', mr: 'सूर्यफूल', ta: 'சூரியகாந்தி', te: 'పొద్దుతిరుగుడు', kn: 'సూర్యకాంతి', bn: 'সূর্যমুখী' } },
  { cropId: 'sesame', cropName: 'Sesame', cropNameHi: 'तिल', category: 'OILSEEDS', translations: { en: 'Sesame', hi: 'तिल', mr: 'तीळ', ta: 'எள்', te: 'నువ్వులు', kn: 'ఎళ్ళు', bn: 'তিল' } },

  // COMMERCIAL CROPS
  { cropId: 'cotton', cropName: 'Cotton', cropNameHi: 'कपास', category: 'COMMERCIAL CROPS', translations: { en: 'Cotton', hi: 'कपास', mr: 'कापूस', ta: 'பருத்தி', te: 'పత్తి', kn: 'హత్తి', bn: 'তুলা' } },
  { cropId: 'sugarcane', cropName: 'Sugarcane', cropNameHi: 'गन्ना', category: 'COMMERCIAL CROPS', translations: { en: 'Sugarcane', hi: 'गन्ना', mr: 'ऊस', ta: 'கரும்பு', te: 'చెరకు', kn: 'కబ్బిన', bn: 'আখ' } },
  { cropId: 'tobacco', cropName: 'Tobacco', cropNameHi: 'तंबाकू', category: 'COMMERCIAL CROPS', translations: { en: 'Tobacco', hi: 'तंबाकू', mr: 'तंबाकू', ta: 'புகையிலை', te: 'పగాకు', kn: 'తంబాకు', bn: 'তামাক' } },

  // VEGETABLES
  { cropId: 'potato', cropName: 'Potato', cropNameHi: 'आलू', category: 'VEGETABLES', translations: { en: 'Potato', hi: 'आलू', mr: 'बटाटा', ta: 'உருளைக்கிழங்கு', te: 'బంగాళాదుంప', kn: 'ఆలూగడ్డె', bn: 'আলু' } },
  { cropId: 'tomato', cropName: 'Tomato', cropNameHi: 'टमाटर', category: 'VEGETABLES', translations: { en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो', ta: 'தக்காளி', te: 'టమాటా', kn: 'టొమేటో', bn: 'টমেটো' } },
  { cropId: 'onion', cropName: 'Onion', cropNameHi: 'प्याज', category: 'VEGETABLES', translations: { en: 'Onion', hi: 'प्याज', mr: 'कांदा', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ', kn: 'ఈరుళ్ళి', bn: 'পিঁয়াজ' } },
  { cropId: 'garlic', cropName: 'Garlic', cropNameHi: 'लहसुन', category: 'VEGETABLES', translations: { en: 'Garlic', hi: 'लहसुन', mr: 'लसूण', ta: 'பூண்டு', te: 'వెల్లుల్లి', kn: 'బెళ్ళుళ్ళి', bn: 'রসুন' } },
  { cropId: 'chilli', cropName: 'Chilli', cropNameHi: 'मिर्च', category: 'VEGETABLES', translations: { en: 'Chilli', hi: 'मिर्च', mr: 'मिरची', ta: 'மிளகாய்', te: 'మిరపకాయ', kn: 'మెణసినకాయి', bn: 'মরিচ' } },
  { cropId: 'brinjal', cropName: 'Brinjal', cropNameHi: 'बैंगन', category: 'VEGETABLES', translations: { en: 'Brinjal', hi: 'बैंगन', mr: 'वांगी', ta: 'கத்திரிக்காய்', te: 'వంకాయ', kn: 'బదనెకాయి', bn: 'বেগুন' } },
  { cropId: 'okra', cropName: 'Okra', cropNameHi: 'भिंडी', category: 'VEGETABLES', translations: { en: 'Okra', hi: 'भिंडी', mr: 'भेंडी', ta: 'வெண்டைக்காய்', te: 'బెండకాయ', kn: 'బెండెకాయి', bn: 'ঢ্যাঁড়শ' } },

  // FRUITS
  { cropId: 'mango', cropName: 'Mango', cropNameHi: 'आम', category: 'FRUITS', translations: { en: 'Mango', hi: 'आम', mr: 'आंबा', ta: 'மாம்பழம்', te: 'మామిడి', kn: 'మావినహణ్ణు', bn: 'আম' } },
  { cropId: 'banana', cropName: 'Banana', cropNameHi: 'केला', category: 'FRUITS', translations: { en: 'Banana', hi: 'केला', mr: 'केळी', ta: 'வாழைப்பழம்', te: 'అరటి', kn: 'బాళెహణ్ణు', bn: 'কলা' } },
  { cropId: 'orange', cropName: 'Orange', cropNameHi: 'संतरा', category: 'FRUITS', translations: { en: 'Orange', hi: 'संतरा', mr: 'संत्री', ta: 'ஆரஞ்சு', te: 'కమలా', kn: 'కిత్తళె', bn: 'কমলা' } },
  { cropId: 'guava', cropName: 'Guava', cropNameHi: 'अमरूद', category: 'FRUITS', translations: { en: 'Guava', hi: 'अमरूद', mr: 'पेरू', ta: 'கொய்யா', te: 'జామకాయ', kn: 'సీబెహణ్ణు', bn: 'পেয়ারা' } },
  { cropId: 'papaya', cropName: 'Papaya', cropNameHi: 'पपीता', category: 'FRUITS', translations: { en: 'Papaya', hi: 'पपीता', mr: 'पपई', ta: 'பப்பாளி', te: 'బొప్పాయి', kn: 'పరంగిహణ్ణు', bn: 'পেঁপে' } },

  // OTHER
  { cropId: 'other', cropName: 'Other', cropNameHi: 'अन्य', category: 'OTHER', translations: { en: 'Other', hi: 'अन्य', mr: 'इतर', ta: 'மற்றவை', te: 'ఇతర', kn: 'ఇతర', bn: 'অন্যান্য' } },
];

export function getCropOptionById(cropId: string): CurrentCropOption | undefined {
  return CURRENT_CROP_DATASET.find((c) => c.cropId === cropId);
}

export function formatCropDisplay(crop?: {
  cropId?: string;
  cropName?: string;
  cropNameHi?: string;
  customCropName?: string;
}): string {
  if (!crop) return 'Not specified';
  if (crop.cropId === 'other' && crop.customCropName) {
    return `${crop.customCropName} (Other / अन्य)`;
  }

  const opt = getCropOptionById(crop.cropId || '');
  const activeLng = i18n.language ? i18n.language.substring(0, 2) : 'en';

  if (opt && opt.translations && opt.translations[activeLng]) {
    const localizedName = opt.translations[activeLng];
    if (localizedName !== crop.cropName) {
      return `${crop.cropName} (${localizedName})`;
    }
  }

  if (crop.cropName && crop.cropNameHi) {
    return `${crop.cropName} (${crop.cropNameHi})`;
  }
  return crop.cropName || 'Not specified';
}
