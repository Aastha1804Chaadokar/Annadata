import { ChatMessage, AssistantSession } from '@/types/assistant';
import { FarmerProfile } from '@/types/farmer';
import { SoilReportRecord } from '@/types/soil';
import { WeatherData } from '@/types/weather';
import { formatCropDisplay } from '@/lib/cropDataset';
import i18n from '@/lib/i18n/config';

const STORAGE_KEY = 'annadata_ai_chat_history';

export type SupportedLang = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'kn';

export const LANGUAGE_SPEECH_MAP: Record<SupportedLang, { bcp47: string; name: string; nativeName: string }> = {
  en: { bcp47: 'en-IN', name: 'English', nativeName: 'English' },
  hi: { bcp47: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
  mr: { bcp47: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
  bn: { bcp47: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  ta: { bcp47: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  te: { bcp47: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  kn: { bcp47: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
};

export function getLangCode(lang?: string): string {
  const code = (lang || i18n.language || 'en').substring(0, 2) as SupportedLang;
  return LANGUAGE_SPEECH_MAP[code]?.bcp47 || 'hi-IN';
}

interface LocalizedResponseBundle {
  summary: string;
  responseText: string;
  steps?: string[];
  warnings?: string[];
  suggestedFollowUps: string[];
  dosages?: { product: string; amountPerAcre: string; timing: string }[];
}

export function resolveLanguage(
  languageCode?: string,
  profile?: FarmerProfile | null,
  userQuery?: string
): SupportedLang {
  // 1. Explicit argument
  if (languageCode && ['en', 'hi', 'mr', 'bn', 'ta', 'te', 'kn'].includes(languageCode.substring(0, 2))) {
    return languageCode.substring(0, 2) as SupportedLang;
  }

  // 2. Query script detection
  if (userQuery) {
    if (/[\u0900-\u097F]/.test(userQuery)) return 'hi';
    if (/[\u0980-\u09FF]/.test(userQuery)) return 'bn';
    if (/[\u0B80-\u0BFF]/.test(userQuery)) return 'ta';
    if (/[\u0C00-\u0C7F]/.test(userQuery)) return 'te';
    if (/[\u0C80-\u0CFF]/.test(userQuery)) return 'kn';
  }

  // 3. i18next global state
  if (i18n.language && ['en', 'hi', 'mr', 'bn', 'ta', 'te', 'kn'].includes(i18n.language.substring(0, 2))) {
    return i18n.language.substring(0, 2) as SupportedLang;
  }

  // 4. Browser localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('annadata_language');
    if (saved && ['en', 'hi', 'mr', 'ta', 'te', 'kn', 'bn'].includes(saved)) {
      return saved as SupportedLang;
    }
  }

  // 5. Farmer profile preference
  if (profile?.language) {
    const pl = profile.language.toLowerCase();
    if (pl.includes('hindi') || pl.includes('हिन्दी')) return 'hi';
    if (pl.includes('marathi') || pl.includes('मराठी')) return 'mr';
    if (pl.includes('bengali') || pl.includes('বাংলা')) return 'bn';
    if (pl.includes('tamil') || pl.includes('தமிழ்')) return 'ta';
    if (pl.includes('telugu') || pl.includes('తెలుగు')) return 'te';
    if (pl.includes('kannada') || pl.includes('ಕನ್ನಡ')) return 'kn';
    if (pl.includes('english')) return 'en';
  }

  return 'hi'; // Default to Hindi
}

// Multilingual Knowledge Base Generator
export function generateAiResponse(
  userQuery: string,
  profile: FarmerProfile,
  soilReport?: SoilReportRecord | null,
  weather?: WeatherData | null,
  languageCode?: string
): ChatMessage {
  const queryLower = userQuery.toLowerCase().trim();
  const lang = resolveLanguage(languageCode, profile, userQuery);

  const cropStr = profile.currentCrop ? formatCropDisplay(profile.currentCrop) : profile.mainCrop || 'Maize (मक्का)';
  const village = profile.village || 'Aroda';
  const district = profile.district || 'Bhopal';
  const ph = soilReport?.ph || 6.8;
  const nitrogen = soilReport?.nitrogen || 260;
  const phosphorus = soilReport?.phosphorus || 18;
  const potassium = soilReport?.potassium || 290;
  const rainProb = weather?.current.precipitationProb ?? 20;
  const isRainHigh = rainProb > 50;

  let category: ChatMessage['category'] = 'general';
  let bundle: LocalizedResponseBundle;

  // 1. SOIL HEALTH & LAB REPORT QUERIES
  if (
    queryLower.includes('soil') ||
    queryLower.includes('report') ||
    queryLower.includes('ph') ||
    queryLower.includes('मिट्टी') ||
    queryLower.includes('मृदा') ||
    queryLower.includes('माती') ||
    queryLower.includes('মৃত্তিকা') ||
    queryLower.includes('மண்') ||
    queryLower.includes('మట్టి') ||
    queryLower.includes('ಮಣ್ಣು')
  ) {
    category = 'general';
    const bundles: Record<SupportedLang, LocalizedResponseBundle> = {
      en: {
        summary: `Soil Health Analysis for your farm in ${village} (Soil pH: ${ph}):`,
        responseText: `**How to view & interpret your Soil Health Report:**\n\n1. **Your Farm's Active Soil Profile:** Farm at ${village}, ${district} has soil pH **${ph}**, which is optimal for **${cropStr}**.\n2. **Nutrient Status:**\n   • **Nitrogen:** ${nitrogen} kg/ha (Medium)\n   • **Phosphorus:** ${phosphorus} kg/ha (Adequate)\n   • **Potassium:** ${potassium} kg/ha (Sufficient)\n3. **To view full card:** Click **"Soil Health"** in the sidebar to review all chemical parameters or record new laboratory tests.`,
        steps: [
          `1. Navigate to 'Soil Health' tab in your farmer sidebar.`,
          `2. Review active parameters: pH ${ph}, Nitrogen ${nitrogen} kg/ha, Phosphorus ${phosphorus} kg/ha, Potash ${potassium} kg/ha.`,
          `3. Click 'Add Soil Test' to record new laboratory Soil Health Card results.`,
        ],
        warnings: ['Collect soil samples 6 inches deep from 5 zigzag points across the plot before fertilizer application.'],
        suggestedFollowUps: [`How much fertilizer for ${cropStr}?`, 'How to balance soil pH?', 'When to irrigate based on weather?'],
      },
      hi: {
        summary: `खेत स्थान ${village} के लिए मृदा स्वास्थ्य विश्लेषण (मृदा pH: ${ph}):`,
        responseText: `**मृदा स्वास्थ्य रिपोर्ट देखने एवं समझने की विधि:**\n\n1. **वर्तमान खेत स्थिति:** आपके खेत (${village}, ${district}) का मृदा pH **${ph}** है, जो **${cropStr}** के लिए सर्वोत्तम है।\n2. **पोषक तत्व स्थिति:**\n   • **नाइट्रोजन:** ${nitrogen} kg/ha (मध्यम)\n   • **फास्फोरस:** ${phosphorus} kg/ha (संतुलित)\n   • **पोटाश:** ${potassium} kg/ha (पर्याप्त)\n3. **रिपोर्ट देखने के लिए:** बाईं ओर मेनू में **"मृदा स्वास्थ्य (Soil Health)"** पर क्लिक करें। वहां आप लैब रिपोर्ट व फोटो दोनों देख सकते हैं।`,
        steps: [
          `1. 'मृदा स्वास्थ्य (Soil Health)' मेनू पर क्लिक करें।`,
          `2. वर्तमान रिकॉर्ड: pH ${ph} (तटस्थ/अनुकूल), नाइट्रोजन ${nitrogen} kg/ha, फास्फोरस ${phosphorus} kg/ha, पोटाश ${potassium} kg/ha।`,
          `3. यदि नया सॉइल हेल्थ कार्ड प्राप्त हुआ है, तो 'नया मृदा परीक्षण जोड़ें' पर क्लिक करके लैब डेटा दर्ज करें।`,
        ],
        warnings: ['मृदा नमूना हमेशा बुआई से 15-20 दिन पहले खेत के 5 अलग-अलग कोनों से V-आकार में 6 इंच गहराई से लें।'],
        suggestedFollowUps: [`${cropStr} में संतुलित खाद कितनी डालें?`, 'मिट्टी का pH कैसे सुधारें?', 'मौसम के अनुसार सिंचाई कब करें?'],
      },
      mr: {
        summary: `${village} येथील तुमच्या शेतासाठी माती आरोग्य विश्लेषण (माती pH: ${ph}):`,
        responseText: `**माती आरोग्य पत्रिका (Soil Health Card) तपासणी:**\n\n1. **शेताची सद्यस्थिती:** आपल्या शेतातील (${village}, ${district}) मातीचा सामू (pH) **${ph}** असून तो **${cropStr}** पिकासाठी अतिशय अनुकूल आहे.\n2. **अन्नद्रव्य स्थिती:**\n   • **नायट्रोजन:** ${nitrogen} kg/ha (मध्यम)\n   • **फॉस्फरस:** ${phosphorus} kg/ha (योग्य)\n   • **पोटॅश:** ${potassium} kg/ha (मुबलक)\n3. **संपूर्ण अहवाल पाहण्यासाठी:** डाव्या बाजूच्या **"Soil Health"** मेनूवर क्लिक करा.`,
        steps: [
          `1. डाव्या बाजूच्या मेनूमधून 'माती आरोग्य' निवडा.`,
          `2. माती परीक्षण घटक तपासा: सामू ${ph}, नायट्रोजन ${nitrogen} kg/ha.`,
          `3. नवीन चाचणी नोंदवण्यासाठी 'Add Soil Test' वर क्लिक करा.`,
        ],
        warnings: ['खतांचा वापर करण्यापूर्वी शेतातून ५ विविध ठिकाणांवरून ६ इंच खोलीवरील मातीचा नमुना घ्यावा.'],
        suggestedFollowUps: [`${cropStr} पिकासाठी खताची योग्य मात्रा काय आहे?`, 'मातीचा सामू कसा सुधारावा?', 'हवामानानुसार पाणी कधी द्यावे?'],
      },
      bn: {
        summary: `${village} এর আপনার জমির জন্য মৃত্তিকা স্বাস্থ্য বিশ্লেষণ (মাটি pH: ${ph}):`,
        responseText: `**মৃত্তিকা স্বাস্থ্য রিপোর্ট পর্যালোচনা ও পরামর্শ:**\n\n1. **জমির বর্তমান অবস্থা:** আপনার জমির (${village}, ${district}) মাটির pH হল **${ph}**, যা **${cropStr}** ফসলের জন্য আদর্শ।\n2. **পুষ্টি উপাদানের মাত্রা:**\n   • **নাইট্রোজেন:** ${nitrogen} kg/ha (মাঝারি)\n   • **ফসফরাস:** ${phosphorus} kg/ha (সুষম)\n   • **পটাশ:** ${potassium} kg/ha (পর্যাপ্ত)\n3. **সম্পূর্ণ রিপোর্ট দেখতে:** সাইডবারের **"Soil Health"** মেনুতে ক্লিক করুন।`,
        steps: [
          `1. মেনু থেকে 'Soil Health' বিকল্পে যান।`,
          `2. বর্তমান মাটির মান দেখুন: pH ${ph}, নাইট্রোজেন ${nitrogen} kg/ha।`,
          `3. নতুন রিপোর্ট যোগ করতে 'Add Soil Test' ক্লিক করুন।`,
        ],
        warnings: ['সার প্রয়োগের পূর্বে জমির ৫টি ভিন্ন স্থান থেকে ৬ ইঞ্চি গভীরতায় মাটির নমুনা সংগ্রহ করুন।'],
        suggestedFollowUps: [`${cropStr} ফসলে কত সার দিতে হবে?`, 'মাটির pH কীভাবে নিয়ন্ত্রণ করবেন?', 'আবহাওয়া দেখে সেচ কখন দেবেন?'],
      },
      ta: {
        summary: `${village} உங்கள் நிலத்திற்கான மண் பரிசோதனை பகுப்பாய்வு (மண் pH: ${ph}):`,
        responseText: `**மண் வள அட்டை விவரம் மற்றும் வழிகாட்டுதல்:**\n\n1. **நிலத்தின் தற்போதைய நிலை:** உங்கள் பண்ணையின் (${village}, ${district}) மண் pH அளவு **${ph}** ஆக உள்ளது, இது **${cropStr}** பயிருக்கு மிகவும் ஏற்றது.\n2. **ஊட்டச்சத்து அளவு:**\n   • **நைட்ரஜன்:** ${nitrogen} kg/ha (நடுத்தரம்)\n   • **பாஸ்பரஸ்:** ${phosphorus} kg/ha (சரியான அளவு)\n   • **பொட்டாசியம்:** ${potassium} kg/ha (போதுமானது)\n3. **முழு அறிக்கையை பார்க்க:** இடதுபுற மெனுவில் **"Soil Health"** என்பதை கிளிக் செய்யவும்.`,
        steps: [
          `1. 'Soil Health' பக்கத்திற்கு செல்லவும்.`,
          `2. ஊட்டச்சத்து அளவை சரிபார்க்கவும்: pH ${ph}, நைட்ரஜன் ${nitrogen} kg/ha.`,
          `3. புதிய ஆய்வக முடிவுகளை பதிவு செய்ய 'Add Soil Test' அழுத்தவும்.`,
        ],
        warnings: ['உரமிடுவதற்கு முன் நிலத்தின் 5 வெவ்வேறு இடங்களில் இருந்து 6 அங்குல ஆழத்தில் மண் மாதிரி எடுக்கவும்.'],
        suggestedFollowUps: [`${cropStr} பயிருக்கு எவ்வளவு உரம் இட வேண்டும்?`, 'மண் pH சமநிலைப்படுத்துவது எப்படி?', 'வானிலைக்கேற்ப எப்போது பாசனம் செய்ய வேண்டும்?'],
      },
      te: {
        summary: `${village} లోని మీ వ్యవసాయ భూమి నేల పరీక్ష విశ్లేషణ (నేల pH: ${ph}):`,
        responseText: `**భూసార పరీక్ష పత్రం (Soil Health Card) విశ్లేషణ:**\n\n1. **ప్రస్తుత పొలం పరిస్థితి:** మీ పొలం (${village}, ${district}) నేల pH **${ph}**, ఇది **${cropStr}** పంటకు చాలా అనుకూలంగా ఉంది.\n2. **పోషకాల వివరాలు:**\n   • **నత్రజని (Nitrogen):** ${nitrogen} kg/ha (మధ్యస్థం)\n   • **భాస్వరం (Phosphorus):** ${phosphorus} kg/ha (సమతుల్యం)\n   • **పొటాష్ (Potassium):** ${potassium} kg/ha (తగినంత)\n3. **పూర్తి నివేదిక చూడటానికి:** సైడ్‌బార్‌లోని **"Soil Health"** మెనూపై క్లిక్ చేయండి.`,
        steps: [
          `1. సైడ్‌బార్‌లో 'Soil Health' ఎంపిక చేయండి.`,
          `2. నేల పోషకాల స్థాయిని సమీక్షించండి: pH ${ph}, నత్రజని ${nitrogen} kg/ha.`,
          `3. కొత్త ల్యాబ్ ఫలితాలను నమోదు చేయడానికి 'Add Soil Test' పై క్లిక్ చేయండి.`,
        ],
        warnings: ['ఎరువులు వేయడానికి ముందు పొలంలోని 5 వివిధ ప్రదేశాల నుండి 6 అంగుళాల లోతులో మట్టి నమూనా సేకరించండి.'],
        suggestedFollowUps: [`${cropStr} పంటకు ఎరువులు ఎంత మోతాదులో వేయాలి?`, 'నేల pH ని ఎలా సరిచేయాలి?', 'వాతావరణం ప్రకారం నీరు ఎప్పుడు పెట్టాలి?'],
      },
      kn: {
        summary: `${village} ನಲ್ಲಿರುವ ನಿಮ್ಮ ಜಮೀನಿನ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ (ಮಣ್ಣಿನ pH: ${ph}):`,
        responseText: `**ಮಣ್ಣು ಆರೋಗ್ಯ ಪತ್ರಿಕೆ (Soil Health Card) ಮಾಹಿತಿ:**\n\n1. **ಜಮೀನಿನ ಸ್ಥಿತಿ:** ನಿಮ್ಮ ಜಮೀನಿನ (${village}, ${district}) ಮಣ್ಣಿನ pH **${ph}** ಆಗಿದ್ದು, ಇದು **${cropStr}** ಬೆಳೆಗೆ ಅತ್ಯಂತ ಸೂಕ್ತವಾಗಿದೆ.\n2. **ಪೋಷಕಾಂಶಗಳ ಮಟ್ಟ:**\n   • **ಸಾರಜನಕ (Nitrogen):** ${nitrogen} kg/ha (ಮಧ್ಯಮ)\n   • **ರಂಜಕ (Phosphorus):** ${phosphorus} kg/ha (ಸೂಕ್ತ)\n   • **ಪೊಟ್ಯಾಶ್ (Potassium):** ${potassium} kg/ha (ಸಾಕಷ್ಟು)\n3. **ಸಂಪೂರ್ಣ ವರದಿ ನೋಡಲು:** ಮೆನುವಿನಲ್ಲಿ **"Soil Health"** ಕ್ಲಿಕ್ ಮಾಡಿ.`,
        steps: [
          `1. ಮೆನುವಿನಿಂದ 'Soil Health' ಆಯ್ಕೆಮಾಡಿ.`,
          `2. ಮಣ್ಣಿನ ನಿಯತಾಂಕಗಳನ್ನು ವೀಕ್ಷಿಸಿ: pH ${ph}, ಸಾರಜನಕ ${nitrogen} kg/ha.`,
          `3. ಹೊಸ ವರದಿ ದಾಖಲಿಸಲು 'Add Soil Test' ಕ್ಲಿಕ್ ಮಾಡಿ.`,
        ],
        warnings: ['ಗೊಬ್ಬರ ಹಾಕುವ ಮೊದಲು ಜಮೀನಿನ 5 ವಿವಿಧ ಭಾಗಗಳಿಂದ 6 ಇಂಚು ಆಳದಲ್ಲಿ ಮಣ್ಣಿನ ಮಾದರಿ ಸಂಗ್ರಹಿಸಿ.'],
        suggestedFollowUps: [`${cropStr} ಬೆಳೆಗೆ ಎಷ್ಟು ಗೊಬ್ಬರ ಹಾಕಬೇಕು?`, 'ಮಣ್ಣಿನ pH ಸರಿಪಡಿಸುವುದು ಹೇಗೆ?', 'ಹವಾಮಾನದಂತೆ ನೀರಾವರಿ ಯಾವಾಗ ಮಾಡಬೇಕು?'],
      },
    };
    bundle = bundles[lang] || bundles.hi;
  }

  // 2. FERTILIZER & NUTRIENT DOSAGES
  else if (
    queryLower.includes('fertilizer') ||
    queryLower.includes('khad') ||
    queryLower.includes('urea') ||
    queryLower.includes('npk') ||
    queryLower.includes('dap') ||
    queryLower.includes('खाद') ||
    queryLower.includes('उर्वरक') ||
    queryLower.includes('खत') ||
    queryLower.includes('সার') ||
    queryLower.includes('உரம்') ||
    queryLower.includes('ఎరువు') ||
    queryLower.includes('ಗೊಬ್ಬರ')
  ) {
    category = 'fertilizer';
    const dosages = [
      { product: 'DAP (18:46:0)', amountPerAcre: '45-50 kg / acre', timing: 'Basal dose at sowing time' },
      { product: 'Urea (46% N)', amountPerAcre: '30-35 kg / acre', timing: 'Split into 2 top-dressings (25 & 45 days)' },
      { product: 'MOP Potash (60% K)', amountPerAcre: '18-20 kg / acre', timing: 'Basal application at land preparation' },
      { product: 'Zinc Sulphate (21%)', amountPerAcre: '8-10 kg / acre', timing: 'For grain luster and root strength' },
    ];

    const bundles: Record<SupportedLang, LocalizedResponseBundle> = {
      en: {
        summary: `Balanced fertilizer recommendation for ${cropStr} based on soil pH (${ph}):`,
        responseText: `**Fertilizer Dosage for ${cropStr} (${district}, Soil pH ${ph}):**\n\n1. **DAP:** 45-50 kg/acre as basal dose during sowing.\n2. **Urea:** 30-35 kg/acre split into 2 top dressings at 25 and 45 days.\n3. **MOP Potash:** 18-20 kg/acre basal application.\n4. **Zinc Sulphate:** 8-10 kg/acre for robust chlorophyll synthesis and yield.`,
        dosages,
        warnings: ['Never mix Urea and Single Super Phosphate (SSP) in advance.', 'Apply Urea top-dressing only when sufficient soil moisture is present.'],
        suggestedFollowUps: ['How to use organic vermicompost?', 'What are zinc deficiency signs?', 'When to irrigate based on weather?'],
      },
      hi: {
        summary: `${cropStr} फसल के लिए मृदा स्वास्थ्य (pH ${ph}) आधारित संतुलित खाद की सिफारिश:`,
        responseText: `**${cropStr} फसल के लिए अनुशंसित खाद खुराक (${district}, मृदा pH ${ph}):**\n\n1. **डीएपी (DAP):** 45-50 किग्रा प्रति एकड़ (बुआई के समय बेसल डोज)।\n2. **यूरिया:** 30-35 किग्रा प्रति एकड़ (25 व 45 दिन पर दो किस्तों में)।\n3. **म्यूरेट ऑफ पोटाश (MOP):** 18-20 किग्रा प्रति एकड़ (बुआई के समय)।\n4. **जिंक सल्फेट:** 8-10 किग्रा प्रति एकड़ दानों की चमक व बढ़वार हेतु।`,
        dosages,
        warnings: ['यूरिया और सिंगल सुपर फॉस्फेट (SSP) को पहले से मिलाकर न रखें।', 'यूरिया हमेशा खेत में पर्याप्त नमी होने पर ही छिड़कें।'],
        suggestedFollowUps: ['जैविक खाद (वर्मीकंपोस्ट) का प्रयोग कैसे करें?', 'जिंक की कमी के क्या लक्षण हैं?', 'मौसम के अनुसार सिंचाई कब करें?'],
      },
      mr: {
        summary: `${cropStr} पिकासाठी माती परीक्षणानुसार (pH ${ph}) संतुलित खत व्यवस्थापन:`,
        responseText: `**${cropStr} पिकासाठी शिफारस केलेली खतांची मात्रा (${district}, pH ${ph}):**\n\n1. **डीएपी (DAP):** 45-50 किलो प्रति एकर (पेरणीच्या वेळी).\n2. **युरिया:** 30-35 किलो प्रति एकर (25 व 45 दिवसांनी दोन हप्त्यांत).\n3. **पोटॅश (MOP):** 18-20 किलो प्रति एकर (पेरणीच्या वेळी).\n4. **झिंक सल्फेट:** 8-10 किलो प्रति एकर फुटवे आणि दाण्यांच्या पोषणासाठी.`,
        dosages,
        warnings: ['युरिया आणि एसएसपी खत एकत्र साठवून ठेवू नका.', 'युरियाचा वापर नेहमी जमिनीत पुरेसा ओलावा असतानाच करा.'],
        suggestedFollowUps: ['सेंद्रिय गांडूळ खताचा वापर कसा करावा?', 'झिंकच्या कमतरतेची लक्षणे काय आहेत?', 'पाणी व्यवस्थापन कसे करावे?'],
      },
      bn: {
        summary: `${cropStr} ফসলের জন্য সুষম সার প্রয়োগ মাত্রা (মাটি pH ${ph}):`,
        responseText: `**${cropStr} ফসলের জন্য সার প্রয়োগের নিয়মাবলী (${district}, মাটি pH ${ph}):**\n\n1. **ডিএপি (DAP):** প্রতি একরে ৪৫-৫০ কেজি (বপনের সময়)।\n2. **ইউরিয়া:** প্রতি একরে ৩০-৩৫ কেজি (২৫ ও ৪৫ দিনে দুই কিস্তিতে)।\n3. **পটাশ (MOP):** প্রতি একরে ১৮-২০ কেজি (বপনের সময়)।\n4. **জিঙ্ক সালফেট:** প্রতি একরে ৮-১০ কেজি দানার পুষ্টি ও বৃদ্ধির জন্য।`,
        dosages,
        warnings: ['ইউরিয়া এবং এসএসপি সার আগে থেকে মিশিয়ে রাখবেন না।', 'জমিতে উপযুক্ত আর্দ্রতা থাকলেই ইউরিয়া প্রয়োগ করুন।'],
        suggestedFollowUps: ['ভার্মিকম্পোস্ট ব্যবহারের নিয়ম কি?', 'জিঙ্কের ঘাটতির লক্ষণ কি?', 'আবহাওয়া দেখে সেচ কখন দেবেন?'],
      },
      ta: {
        summary: `${cropStr} பயிருக்கான மண் பரிசோதனை அடிப்படையிலான உர பரிந்துரை (pH ${ph}):`,
        responseText: `**${cropStr} பயிருக்கான உர அளவு (${district}, மண் pH ${ph}):**\n\n1. **டிஏபி (DAP):** ஏக்கருக்கு 45-50 கிலோ (விதைப்பின் போது அடி உரமாக).\n2. **யூரியா:** ஏக்கருக்கு 30-35 கிலோ (25 மற்றும் 45 நாட்களில் இரண்டு முறை).\n3. **பொட்டாஷ் (MOP):** ஏக்கருக்கு 18-20 கிலோ (அடி உரமாக).\n4. **துத்தநாக சல்பேட் (Zinc):** ஏக்கருக்கு 8-10 கிலோ.`,
        dosages,
        warnings: ['யூரியா மற்றும் சூப்பர் பாஸ்பேட்டை முன்கூட்டியே கலந்து வைக்க வேண்டாம்.', 'ஈரப்பதம் இருக்கும் போது மட்டுமே யூரியா இடவும்.'],
        suggestedFollowUps: ['மண்புழு உரம் பயன்படுத்துவது எப்படி?', 'துத்தநாக பற்றாக்குறை அறிகுறிகள் என்ன?', 'பாசன நேரம் எப்போது?'],
      },
      te: {
        summary: `${cropStr} పంటకు నేల pH (${ph}) ఆధారిత సమతుల్య ఎరువుల సిఫార్సు:`,
        responseText: `**${cropStr} పంటకు సిఫార్సు చేసిన ఎరువుల మోతాదు (${district}, pH ${ph}):**\n\n1. **డీఏపీ (DAP):** ఎకరానికి 45-50 కిలోలు (విత్తే సమయంలో అడుగు మందుగా).\n2. **యూరియా:** ఎకరానికి 30-35 కిలోలు (25 మరియు 45 రోజులలో రెండు సార్లు).\n3. **పొటాష్ (MOP):** ఎకరానికి 18-20 కిలోలు.\n4. **జింక్ సల్ఫేట్:** ఎకరానికి 8-10 కిలోలు దిగుబడి నాణ్యత కోసం.`,
        dosages,
        warnings: ['యూరియా మరియు సింగిల్ సూపర్ ఫాస్ఫేట్ ముందుగా కలపవద్దు.', 'పొలంలో తగినంత తేమ ఉన్నప్పుడు మాత్రమే యూరియా వేయండి.'],
        suggestedFollowUps: ['వర్మీ కంపోస్ట్ ఎలా వాడాలి?', 'జింక్ లోపం లక్షణాలు ఏమిటి?', 'నీటిపారుదల సమయం ఎప్పుడు?'],
      },
      kn: {
        summary: `${cropStr} ಬೆಳೆಗೆ ಮಣ್ಣಿನ pH (${ph}) ಆಧಾರಿತ ಗೊಬ್ಬರದ ಪ್ರಮಾಣ:`,
        responseText: `**${cropStr} ಬೆಳೆಗೆ ಶಿಫಾರಸು ಮಾಡಲಾದ ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ (${district}, pH ${ph}):**\n\n1. **ಡಿಎಪಿ (DAP):** ಎಕರೆಗೆ 45-50 ಕೆಜಿ (ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ).\n2. **ಯೂರಿಯಾ:** ಎಕರೆಗೆ 30-35 ಕೆಜಿ (25 ಮತ್ತು 45 ದಿನಗಳಲ್ಲಿ ಎರಡು ಕಂತುಗಳಲ್ಲಿ).\n3. **ಪೊಟ್ಯಾಶ್ (MOP):** ಎಕರೆಗೆ 18-20 ಕೆಜಿ.\n4. **ಜಿಂಕ್ ಸಲ್ಫೇಟ್:** ಎಕರೆಗೆ 8-10 ಕೆಜಿ ಕಾಳುಗಳ ಬೆಳವಣಿಗೆಗೆ.`,
        dosages,
        warnings: ['ಯೂರಿಯಾ ಮತ್ತು ಸೂಪರ್ ಫಾಸ್ಫೇಟ್ ಅನ್ನು ಮೊದಲೇ ಮಿಶ್ರಣ ಮಾಡಬೇಡಿ.', 'ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶವಿದ್ದಾಗ ಮಾತ್ರ ಯೂರಿಯಾ ಸಿಂಪಡಿಸಿ.'],
        suggestedFollowUps: ['ಎರೆಹುಳು ಗೊಬ್ಬರ ಬಳಕೆ ಹೇಗೆ?', 'ಜಿಂಕ್ ಕೊರತೆಯ ಲಕ್ಷಣಗಳೇನು?', 'ನೀರಾವರಿ ಯಾವಾಗ ಮಾಡಬೇಕು?'],
      },
    };
    bundle = bundles[lang] || bundles.hi;
  }

  // 3. IRRIGATION & WEATHER FORECAST
  else if (
    queryLower.includes('irrigation') ||
    queryLower.includes('water') ||
    queryLower.includes('rain') ||
    queryLower.includes('सिंचाई') ||
    queryLower.includes('पानी') ||
    queryLower.includes('मौसम') ||
    queryLower.includes('बारिश') ||
    queryLower.includes('पाऊस') ||
    queryLower.includes('বৃষ্টি') ||
    queryLower.includes('மழை') ||
    queryLower.includes('వర్షం') ||
    queryLower.includes('ಮಳೆ')
  ) {
    category = 'irrigation';
    const bundles: Record<SupportedLang, LocalizedResponseBundle> = {
      en: {
        summary: isRainHigh
          ? '⚠️ High rain probability in next 48h. Hold scheduled irrigation.'
          : '✅ Favorable weather conditions for routine crop irrigation.',
        responseText: `**Irrigation Advisory for ${cropStr} (${village}):**\n\n` +
          (isRainHigh
            ? `⚠️ Rain probability is high (**${rainProb}%**). **Hold irrigation** to prevent waterlogging and root rot.`
            : `✅ Rain probability is low (**${rainProb}%**). Proceed with scheduled irrigation if topsoil is dry.`),
        warnings: [isRainHigh ? 'Rain >50%: excess moisture suffocates roots and leaches nitrogen.' : 'Irrigate during morning or evening hours to reduce evaporation loss.'],
        suggestedFollowUps: ['What are the benefits of drip irrigation?', 'Best spray timing before rain?', 'How to inspect crop health?'],
      },
      hi: {
        summary: isRainHigh
          ? '⚠️ आगामी 48 घंटों में भारी बारिश की संभावना के कारण सिंचाई रोकें।'
          : '✅ मौसम अनुकूल है, आवश्यकतानुसार सामान्य सिंचाई की जा सकती है।',
        responseText: `**${cropStr} फसल के लिए सिंचाई परामर्श (${village}):**\n\n` +
          (isRainHigh
            ? `⚠️ आगामी 48 घंटों में **${rainProb}% बारिश की संभावना** है। सिंचाई **तुरंत रोकें** ताकि जलभराव से जड़ें न सड़ें।`
            : `✅ वर्तमान में बारिश की संभावना कम है (${rainProb}%)। यदि ऊपरी मिट्टी सूख गई है तो हल्की सिंचाई करें।`),
        warnings: [isRainHigh ? 'बारिश >50%: अधिक पानी से जड़ें सड़ सकती हैं।' : 'सिंचाई हमेशा सुबह या शाम को करें ताकि वाष्पीकरण से पानी व्यर्थ न हो।'],
        suggestedFollowUps: ['ड्रिप सिंचाई के क्या फायदे हैं?', 'दवाई छिड़काव का सही समय क्या है?', 'फसल स्वास्थ्य कैसे जांचें?'],
      },
      mr: {
        summary: isRainHigh
          ? '⚠️ पुढील ४८ तासांत पावसाची शक्यता असल्याने पाणी देणे थांबवा.'
          : '✅ हवामान कोरडे असून पिकाला गरजेनुसार पाणी द्यावे.',
        responseText: `**${cropStr} पिकासाठी पाणी व्यवस्थापन सल्ला (${village}):**\n\n` +
          (isRainHigh
            ? `⚠️ पुढील ४८ तासांत **${rainProb}% पावसाची शक्यता** आहे. पिकाला पाणी देणे **ताबडतोब थांबवा**.`
            : `✅ पावसाची शक्यता कमी आहे (${rainProb}%). जमीन कोरडी असल्यास हलके पाणी द्यावे.`),
        warnings: ['पावसाचा अंदाज असताना जास्तीचे पाणी दिल्यास मुळे कुजण्याचा धोका असतो.'],
        suggestedFollowUps: ['ठिबक सिंचनाचे फायदे काय?', 'फवारणीची योग्य वेळ कोणती?', 'पिकाचे आरोग्य कसे तपासावे?'],
      },
      bn: {
        summary: isRainHigh
          ? '⚠️ আগামী ৪৮ ঘণ্টায় বৃষ্টির সম্ভাবনা রয়েছে, সেচ বন্ধ রাখুন।'
          : '✅ আবহাওয়া শুষ্ক, জমিতে প্রয়োজনমতো সেচ দিন।',
        responseText: `**${cropStr} ফসলের সেচ পরামর্শ (${village}):**\n\n` +
          (isRainHigh
            ? `⚠️ আগামী ৪৮ ঘণ্টায় **${rainProb}% বৃষ্টির সম্ভাবনা**। জমিতে সেচ **স্থগিত রাখুন**।`
            : `✅ বৃষ্টির সম্ভাবনা কম (${rainProb}%)। মাটির আর্দ্রতা কম থাকলে পরিমিত সেচ দিন।`),
        warnings: ['বৃষ্টির সময় অতিরিক্ত জলে শিকড় পচে যাওয়ার সম্ভাবনা থাকে।'],
        suggestedFollowUps: ['ড্রিপ সেচের সুবিধা কি?', 'স্প্রে করার সঠিক সময় কি?', 'ফসলের রোগ প্রতিরোধ কিভাবে করবেন?'],
      },
      ta: {
        summary: isRainHigh
          ? '⚠️ அடுத்த 48 மணி நேரத்தில் மழை வாய்ப்பு உள்ளது, பாசனத்தை நிறுத்துங்கள்.'
          : '✅ வானிலை சீராக உள்ளது, தேவைக்கேற்ப பாசனம் செய்யலாம்.',
        responseText: `**${cropStr} பயிருக்கான பாசன ஆலோசனை (${village}):**\n\n` +
          (isRainHigh
            ? `⚠️ அடுத்த 48 மணி நேரத்தில் **${rainProb}% மழை பெய்ய வாய்ப்பு** உள்ளது. பாசனத்தை **உடனடியாக நிறுத்துங்கள்**.`
            : `✅ மழை வாய்ப்பு குறைவு (${rainProb}%). மேல் மண் காய்ந்திருந்தால் மிதமான பாசனம் செய்யவும்.`),
        warnings: ['அதிக நீர் தேங்கினால் வேர் அழுகல் நோய் ஏற்படும் அபாயம் உள்ளது.'],
        suggestedFollowUps: ['சொட்டு நீர் பாசன நன்மைகள் என்ன?', 'மருந்து தெளிக்க சரியான நேரம் எது?', 'பயிர் ஆரோக்கியத்தை எப்படி பார்ப்பது?'],
      },
      te: {
        summary: isRainHigh
          ? '⚠️ రాబోయే 48 గంటల్లో వర్ష సూచన ఉంది, నీటిపారుదల నిలిపివేయండి.'
          : '✅ వాతావరణం అనుకూలంగా ఉంది, అవసరమైన నీరు పెట్టవచ్చు.',
        responseText: `**${cropStr} పంటకు నీటిపారుదల సలహా (${village}):**\n\n` +
          (isRainHigh
            ? `⚠️ రాబోయే 48 గంటల్లో **${rainProb}% వర్షం పడే అవకాశం** ఉంది. నీటిపారుదల **వెంటనే ఆపండి**.`
            : `✅ వర్ష సూచన తక్కువగా ఉంది (${rainProb}%). పై నేల ఆరిపోయినట్లయితే తేలికపాటి తడి ఇవ్వండి.`),
        warnings: ['వర్షం ఉన్నప్పుడు అధిక నీరు చేరితే వేరు కుళ్లు తెగులు వచ్చే ప్రమాదం ఉంది.'],
        suggestedFollowUps: ['బిందు సేద్యం ప్రయోజనాలు ఏమిటి?', 'పురుగుమందు పిచికారీ సరైన సమయం ఏది?', 'పంట ఆరోగ్యాన్ని ఎలా పరీక్షించాలి?'],
      },
      kn: {
        summary: isRainHigh
          ? '⚠️ ಮುಂದಿನ 48 ಗಂಟೆಗಳಲ್ಲಿ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ, ನೀರುಣಿಸುವುದನ್ನು ನಿಲ್ಲಿಸಿ.'
          : '✅ ಹವಾಮಾನ ಅನುಕೂಲಕರವಾಗಿದೆ, ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ನೀರುಣಿಸಬಹುದು.',
        responseText: `**${cropStr} ಬೆಳೆಗೆ ನೀರಾವರಿ ಸಲಹೆ (${village}):**\n\n` +
          (isRainHigh
            ? `⚠️ ಮುಂದಿನ 48 ಗಂಟೆಗಳಲ್ಲಿ **${rainProb}% ಮಳೆ ಸಾಧ್ಯತೆ** ಇದೆ. ನೀರಾವರಿಯನ್ನು **ತಕ್ಷಣ ನಿಲ್ಲಿಸಿ**.`
            : `✅ ಮಳೆ ಸಾಧ್ಯತೆ ಕಡಿಮೆ ಇದೆ (${rainProb}%). ಮಣ್ಣು ಒಣಗಿದ್ದರೆ ಲಘು ನೀರುಣಿಸಿ.`),
        warnings: ['ಮಳೆಗಾಲದಲ್ಲಿ ನೀರು ನಿಂತರೆ ಬೇರು ಕೊಳೆಯುವ ಅಪಾಯವಿರುತ್ತದೆ.'],
        suggestedFollowUps: ['ಹನಿ ನೀರಾವರಿಯ ಅನುಕೂಲಗಳೇನು?', 'ಔಷಧ ಸಿಂಪಡಣೆಗೆ ಸರಿಯಾದ ಸಮಯ ಯಾವುದು?', 'ಬೆಳೆ ರೋಗ ತಪಾಸಣೆ ಹೇಗೆ?'],
      },
    };
    bundle = bundles[lang] || bundles.hi;
  }

  // 4. PEST & DISEASE / YELLOW LEAVES
  else if (
    queryLower.includes('pest') ||
    queryLower.includes('disease') ||
    queryLower.includes('yellow') ||
    queryLower.includes('कीट') ||
    queryLower.includes('बीमारी') ||
    queryLower.includes('पीले') ||
    queryLower.includes('रोग') ||
    queryLower.includes('পোকামাকড়') ||
    queryLower.includes('பூச்சி') ||
    queryLower.includes('తెగులు') ||
    queryLower.includes('ಕೀಟ')
  ) {
    category = 'pest';
    const bundles: Record<SupportedLang, LocalizedResponseBundle> = {
      en: {
        summary: `Pest & disease diagnosis and control for ${cropStr}:`,
        responseText: `**${cropStr} Pest & Disease Management:**\n\n1. **Yellowing Leaves:** Frequently triggered by sucking pests (whiteflies/aphids) or nitrogen deficiency.\n2. **Organic Remedy:** Neem Oil (10,000 PPM) @ 500ml/acre in 200L water.\n3. **Targeted Protection:** Thiamethoxam 25% WG @ 80g/acre.\n4. **Photo Diagnosis:** Upload an image in the **Crop Health** module for real-time visual assessment.`,
        dosages: [
          { product: 'Neem Oil (10,000 PPM)', amountPerAcre: '500 ml / 200 L water', timing: 'Early stage sucking pest prevention' },
          { product: 'Thiamethoxam 25% WG', amountPerAcre: '80 g / 150 L water', timing: 'Whitefly, aphid, and jassid control' },
          { product: 'Carbendazim + Mancozeb', amountPerAcre: '300 g / 150 L water', timing: 'Fungal leaf spots and blight' },
        ],
        warnings: ['Do not spray in high wind (>15 km/h) or under direct midday sunlight.'],
        suggestedFollowUps: ['What are Yellow Mosaic Disease symptoms?', 'How to prepare homemade bio-pesticide?', 'Can fertilizer and spray be mixed?'],
      },
      hi: {
        summary: `${cropStr} फसल में कीट एवं रोग नियंत्रण मार्गदर्शन:`,
        responseText: `**${cropStr} फसल सुरक्षा एवं रोग नियंत्रण:**\n\n1. **पत्तियां पीली होने पर:** यह रसचूसक कीटों (सफेद मक्खी/माहू) या नाइट्रोजन की कमी का संकेत हो सकता है।\n2. **जैविक उपचार:** नीम तेल 10,000 PPM (500 मिली/एकड़) का छिड़काव करें।\n3. **रासायनिक दवा:** थायामेथॉक्सम 25% WG (80 ग्राम/एकड़) का स्प्रे करें।\n4. **फोटो जांच:** "Crop Health" मेनू में पत्तों की फोटो अपलोड करके तुरंत जांचें।`,
        dosages: [
          { product: 'नीम तेल (10,000 PPM)', amountPerAcre: '500 मिली / 200 ली पानी', timing: 'रस चूसक कीटों के रोकथाम हेतु' },
          { product: 'थायामेथॉक्सम 25% WG', amountPerAcre: '80 ग्राम / 150 ली पानी', timing: 'सफेद मक्खी व माहू नियंत्रण हेतु' },
          { product: 'कार्बेन्डाजिम + मैंकोजेब', amountPerAcre: '300 ग्राम / 150 ली पानी', timing: 'पत्ती धब्बा व फफूंद रोग हेतु' },
        ],
        warnings: ['तेज हवा या दोपहर की तेज धूप में कीटनाशक का छिड़काव न करें।'],
        suggestedFollowUps: ['पीला मोज़ेक रोग के क्या लक्षण हैं?', 'जैविक कीटनाशक कैसे बनाएं?', 'खाद और दवा साथ में मिला सकते हैं?'],
      },
      mr: {
        summary: `${cropStr} पिकातील कीड व रोग नियंत्रण उपाययोजना:`,
        responseText: `**${cropStr} पीक संरक्षण व उपाय:**\n\n1. **पाने पिवळी पडणे:** रसशोषक किडी (पांढरी माशी/मावा) किंवा नायट्रोजनच्या कमतरतेमुळे होऊ शकते.\n2. **सेंद्रिय उपाय:** निंबोळी अर्क/नीम ऑइल (500 मिली/एकर) फवारावे.\n3. **रासायनिक कीटकनाशक:** थायामेथॉक्सम २५% डब्ल्यूजी (80 ग्रॅम/एकर).\n4. **फोटो तपासणी:** **"Crop Health"** मेनूमध्ये पानांचा फोटो अपलोड करा.`,
        dosages: [
          { product: 'नीम तेल (10,000 PPM)', amountPerAcre: '500 मिली / 200 ली पाणी', timing: 'रसशोषक किडींच्या नियंत्रणासाठी' },
          { product: 'थायामेथॉक्सम 25% WG', amountPerAcre: '80 ग्रॅम / 150 ली पाणी', timing: 'पांढरी माशी व तुडतुडे नियंत्रणासाठी' },
        ],
        warnings: ['दुपारी कडक उन्हात फवारणी करणे टाळावे.'],
        suggestedFollowUps: ['पिवळा मोझॅक रोगाची लक्षणे काय?', 'सेंद्रिय कीटकनाशक कसे बनवावे?', 'पाणी व्यवस्थापन कसे करावे?'],
      },
      bn: {
        summary: `${cropStr} ফসলে পোকা ও রোগ দমন ব্যবস্থাপনা:`,
        responseText: `**${cropStr} ফসল সুরক্ষা ও প্রতিকার:**\n\n1. **পাতা হলুদ হওয়া:** এটি শোষক পোকা (সাদা মাছি) বা নাইট্রোজেনের ঘাটতির কারণে হতে পারে।\n2. **জৈব প্রতিকার:** নিম তেল (৫০০ মিলি/একর) স্প্রে করুন।\n3. **কীটনাশক:** থায়ামেথক্সাম ২৫% ডব্লিউজি (৮০ গ্রাম/একর)।\n4. **ছবি যাচাই:** **"Crop Health"** বিকল্পে পাতার ছবি আপলোড করুন।`,
        dosages: [
          { product: 'নিম তেল (10,000 PPM)', amountPerAcre: '৫০০ মিলি / ২০০ লি জল', timing: 'পোকা দমনের জন্য' },
        ],
        warnings: ['প্রখর রোদে বা বাতাসের বিপরীতে স্প্রে করবেন না।'],
        suggestedFollowUps: ['হলুদ মোজাইক রোগের লক্ষণ কি?', 'জৈব বালাইনাশক কিভাবে বানাবেন?', 'সারের সঠিক মাত্রা কি?'],
      },
      ta: {
        summary: `${cropStr} பயிரில் பூச்சி மற்றும் நோய் மேலாண்மை:`,
        responseText: `**${cropStr} பயிர் பாதுகாப்பு வழிகாட்டல்:**\n\n1. **இலைகள் மஞ்சள் நிறமாதல்:** சாறு உறிஞ்சும் பூச்சிகள் (வெள்ளை ஈ) அல்லது நைட்ரஜன் பற்றாக்குறையின் அறிகுறியாகும்.\n2. **இயற்கை முறை:** வேப்ப எண்ணெய் (500 மி.லி/ஏக்கர்) தெளிக்கவும்.\n3. **பூச்சிக்கொல்லி:** தயாமெதாக்ஸம் 25% WG (80 கிராம்/ஏக்கர்).\n4. **புகைப்பட சோதனை:** **"Crop Health"** பிரிவில் இலை புகைப்படத்தை பதிவேற்றவும்.`,
        dosages: [
          { product: 'வேப்ப எண்ணெய்', amountPerAcre: '500 மி.லி / 200 லி தண்ணீர்', timing: 'பூச்சி கட்டுப்பாடு' },
        ],
        warnings: ['நண்பகல் வெயிலில் மருந்து தெளிக்க வேண்டாம்.'],
        suggestedFollowUps: ['மஞ்சள் தேமல் நோய் அறிகுறிகள் என்ன?', 'இயற்கை பூச்சிக்கொல்லி தயாரிப்பது எப்படி?', 'உரமிடும் முறை என்ன?'],
      },
      te: {
        summary: `${cropStr} పంటలో పురుగులు మరియు తెగుళ్ల నివారణ చర్యలు:`,
        responseText: `**${cropStr} పంట రక్షణ సూచనలు:**\n\n1. **ఆకులు పసుపు రంగులోకి మారడం:** రసం పీల్చే పురుగులు (తెల్ల దోమ) లేదా నత్రజని లోపం వల్ల సంభవించవచ్చు.\n2. **సేంద్రీయ నివారణ:** వేప నూనె (500 మి.లీ/ఎకరాకు) పిచికారీ చేయండి.\n3. **రసాయన మందు:** థయామిథాక్సమ్ 25% WG (80 గ్రాములు/ఎకరాకు).\n4. **ఫోటో పరీక్ష:** **"Crop Health"** విభాగంలో ఆకుల ఫోటో అప్‌లోడ్ చేయండి.`,
        dosages: [
          { product: 'వేప నూనె', amountPerAcre: '500 మి.లీ / 200 లీ నీరు', timing: 'పురుగుల నివారణ' },
        ],
        warnings: ['తీవ్రమైన ఎండ సమయంలో మందులు పిచికారీ చేయవద్దు.'],
        suggestedFollowUps: ['పసుపు తెగులు లక్షణాలు ఏమిటి?', 'సేంద్రీయ పురుగుమందు ఎలా తయారు చేయాలి?', 'నీటిపారుదల సలహా ఏమిటి?'],
      },
      kn: {
        summary: `${cropStr} ಬೆಳೆಯಲ್ಲಿ ಕೀಟ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ ಮಾರ್ಗದರ್ಶನ:`,
        responseText: `**${cropStr} ಬೆಳೆ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಚಿಕಿತ್ಸೆ:**\n\n1. **ಎಲೆಗಳು ಹಳದಿಯಾಗುವುದು:** ರಸಹೀರುವ ಕೀಟಗಳು ಅಥವಾ ಸಾರಜನಕದ ಕೊರತೆಯಿಂದ ಉಂಟಾಗಬಹುದು.\n2. **ಸಾವಯವ ಪರಿಹಾರ:** ಬೇವಿನ ಎಣ್ಣೆ (500 ಮಿ.ಲೀ/ಎಕರೆಗೆ) ಸಿಂಪಡಿಸಿ.\n3. **ಕೀಟನಾಶಕ:** ಥಯಾಮೆಥಾಕ್ಸಮ್ 25% WG (80 ಗ್ರಾಂ/ಎಕರೆಗೆ).\n4. **ಫೋಟೋ ತಪಾಸಣೆ:** **"Crop Health"** ವಿಭಾಗದಲ್ಲಿ ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.`,
        dosages: [
          { product: 'ಬೇವಿನ ಎಣ್ಣೆ', amountPerAcre: '500 ಮಿ.ಲೀ / 200 ಲೀ ನೀರು', timing: 'ಕೀಟ ನಿಯಂತ್ರಣ' },
        ],
        warnings: ['ಬಿಸಿಲಿನಲ್ಲಿ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ.'],
        suggestedFollowUps: ['ಹಳದಿ ರೋಗದ ಲಕ್ಷಣಗಳೇನು?', 'ಸಾವಯವ ಕೀಟನಾಶಕ ತಯಾರಿಸುವುದು ಹೇಗೆ?', 'ಗೊಬ್ಬರದ ಪ್ರಮಾಣ ಎಷ್ಟು?'],
      },
    };
    bundle = bundles[lang] || bundles.hi;
  }

  // 5. CROP RECOMMENDATIONS
  else if (
    queryLower.includes('crop') ||
    queryLower.includes('sow') ||
    queryLower.includes('grow') ||
    queryLower.includes('फसल') ||
    queryLower.includes('बुआई') ||
    queryLower.includes('पीक') ||
    queryLower.includes('ফসল') ||
    queryLower.includes('பயிர்') ||
    queryLower.includes('పంట') ||
    queryLower.includes('ಬೆಳೆ')
  ) {
    category = 'crop_selection';
    const bundles: Record<SupportedLang, LocalizedResponseBundle> = {
      en: {
        summary: `Recommended crops for your farm (${village}, ${district}) with soil pH (${ph}):`,
        responseText: `**Optimal Crop Recommendations for your land:**\n\nBased on your agro-climatic zone in ${district} and soil pH ${ph}:\n• **Rabi Season:** Sharbati Wheat (94% Match) & Gram/Chickpea (91% Match).\n• **Kharif Season:** Maize & Soybean.\n\nOpen the **Crop Recommendation** module in sidebar for automated rule-based rankings.`,
        steps: [
          '1. Kharif: Soybean, Maize, Paddy, Pulses',
          '2. Rabi: Sharbati Wheat, Gram, Mustard',
          '3. Zaid: Moong, Vegetables',
        ],
        suggestedFollowUps: ['What is the best sowing window for Wheat?', 'When to irrigate Gram/Chickpea?', 'How to check Soil Health report?'],
      },
      hi: {
        summary: `खेत स्थान (${village}, ${district}) व मृदा pH (${ph}) के लिए उपयुक्त फसलें:`,
        responseText: `**आपके खेत के लिए सर्वोत्तम फसल सिफारिशें:**\n\nआपके क्षेत्र (${district}) की मिट्टी (pH ${ph}) के आधार पर:\n• **रबी सीजन:** शरबती गेहूँ (94% मैच) और चना (91% मैच)।\n• **खरीफ सीजन:** मक्का (Maize) और सोयाबीन।\n\nविस्तृत रैंकिंग देखने के लिए **"Crop Recommendation"** मेनू पर जाएं।`,
        steps: [
          '1. खरीफ: सोयाबीन, मक्का, धान, उड़द',
          '2. रबी: शरबती गेहूँ, चना, सरसों',
          '3. जायद: मूंग, उड़द, सब्जियां',
        ],
        suggestedFollowUps: ['गेहूँ की बुआई का सही समय क्या है?', 'चना में सिंचाई कब करें?', 'मृदा स्वास्थ्य रिपोर्ट कैसे देखें?'],
      },
      mr: {
        summary: `${village} परिसरासाठी आणि माती सामू (${ph}) नुसार योग्य पिके:`,
        responseText: `**तुमच्या शेतासाठी सर्वोत्तम पीक शिफारसी:**\n\n${district} भागातील मातीनुसार (pH ${ph}):\n• **रब्बी हंगाम:** गहू (९४% जुळणी) आणि हरभरा (९१% जुळणी).\n• **खरीप हंगाम:** सोयाबीन आणि मका.\n\nसविस्तर माहितीसाठी **"Crop Recommendation"** मेनू पहा.`,
        steps: ['१. खरीप: सोयाबीन, मका, भात', '२. रब्बी: गहू, हरभरा, मोहरी'],
        suggestedFollowUps: ['गहू पेरणीची योग्य वेळ कोणती?', 'हरभऱ्याला पाणी कधी द्यावे?', 'माती अहवाल कसा पाहावा?'],
      },
      bn: {
        summary: `${village} অঞ্চলের জন্য উপযুক্ত ফসল নির্বাচন (মাটি pH ${ph}):`,
        responseText: `**আপনার জমির জন্য সেরা ফসলের সুপারিশ:**\n\n${district} অঞ্চলের জলবায়ু ও মাটির মান (pH ${ph}) অনুযায়ী:\n• **রবি মরশুম:** গম (৯৪% মানানসই) এবং ছোলা (৯১% মানানসই)।\n• **খরিফ মরশুম:** ভুট্টা ও সয়াবিন।\n\nবিস্তারিত তালিকার জন্য **"Crop Recommendation"** মেনু দেখুন।`,
        steps: ['১. খরিফ: সয়াবিন, ভুট্টা, ধান', '২. রবি: গম, ছোলা, সরিষা'],
        suggestedFollowUps: ['গম বোনার সেরা সময় কি?', 'ছোলায় সেচ কখন দেবেন?', 'মাটির রিপোর্ট কিভাবে দেখবেন?'],
      },
      ta: {
        summary: `${village} பகுதிக்கு உகந்த பயிர் பரிந்துரை (மண் pH ${ph}):`,
        responseText: `**உங்கள் நிலத்திற்கான சிறந்த பயிர் பரிந்துரைகள்:**\n\n${district} பகுதி மற்றும் மண் pH (${ph}) அடிப்படையில்:\n• **குளிர்காலம் (ரபி):** கோதுமை மற்றும் கொண்டைக்கடலை.\n• **மழைக்காலம் (காரிப்):** மக்காச்சோளம் மற்றும் சோயாபீன்.\n\nமுழுமையான பட்டியலுக்கு **"Crop Recommendation"** மெனுவை பார்க்கவும்.`,
        steps: ['1. காரிப்: மக்காச்சோளம், சோயாபீன், நெல்', '2. ரபி: கோதுமை, கொண்டைக்கடலை'],
        suggestedFollowUps: ['கோதுமை விதைக்க சிறந்த நேரம் எது?', 'பாசனம் எப்போது செய்ய வேண்டும்?', 'மண் வள அட்டை பார்ப்பது எப்படி?'],
      },
      te: {
        summary: `${village} ప్రాంతానికి అనుకూలమైన పంటల సిఫార్సులు (pH ${ph}):`,
        responseText: `**మీ పొలానికి అత్యుత్తమ పంటల సిఫార్సులు:**\n\n${district} నేల రకం మరియు pH (${ph}) ఆధారంగా:\n• **రబీ కాలం:** గోధుమలు (94% అనుకూలం) మరియు శనగలు (91% అనుకూలం).\n• **ఖరీఫ్ కాలం:** మొక్కజొన్న మరియు సోయాబీన్.\n\nమరిన్ని వివరాలకు **"Crop Recommendation"** మెనూ చూడండి.`,
        steps: ['1. ఖరీఫ్: సోయాబీన్, మొక్కజొన్న, వరి', '2. రబీ: గోధుమ, శనగలు, ఆవాలు'],
        suggestedFollowUps: ['గోధుమ విత్తే సరైన సమయం ఏది?', 'శనగ పంటకు నీరు ఎప్పుడు పెట్టాలి?', 'నేల నివేదిక ఎలా చూడాలి?'],
      },
      kn: {
        summary: `${village} ಪ್ರದೇಶಕ್ಕೆ ಸೂಕ್ತವಾದ ಬೆಳೆ ಶಿಫಾರಸುಗಳು (pH ${ph}):`,
        responseText: `**ನಿಮ್ಮ ಜಮೀನಿಗೆ ಉತ್ತಮ ಬೆಳೆ ಶಿಫಾರಸುಗಳು:**\n\n${district} ಮಣ್ಣಿನ pH (${ph}) ಆಧಾರದ ಮೇಲೆ:\n• **ರಬಿ ಹಂಗಾಮು:** ಗೋಧಿ (94% ಹೊಂದಾಣಿಕೆ) ಮತ್ತು ಕಡಲೆ (91% ಹೊಂದಾಣಿಕೆ).\n• **ಖಾರೀಫ್ ಹಂಗಾಮು:** ಜೋಳ ಮತ್ತು ಸೋಯಾಬೀನ್.\n\nಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ **"Crop Recommendation"** ಮೆನು ನೋಡಿ.`,
        steps: ['1. ಖಾರೀಫ್: ಸೋಯಾಬೀನ್, ಜೋಳ, ಭತ್ತ', '2. ರಬಿ: ಗೋಧಿ, ಕಡಲೆ, ಸಾಸಿವೆ'],
        suggestedFollowUps: ['ಗೋಧಿ ಬಿತ್ತನೆಗೆ ಉತ್ತಮ ಸಮಯ ಯಾವುದು?', 'ಕಡಲೆಗೆ ನೀರು ಯಾವಾಗ ನೀಡಬೇಕು?', 'ಮಣ್ಣಿನ ವರದಿ ನೋಡುವುದು ಹೇಗೆ?'],
      },
    };
    bundle = bundles[lang] || bundles.hi;
  }

  // 6. MANDI RATES & MARKET
  else if (
    queryLower.includes('mandi') ||
    queryLower.includes('market') ||
    queryLower.includes('price') ||
    queryLower.includes('rate') ||
    queryLower.includes('मंडी') ||
    queryLower.includes('भाव') ||
    queryLower.includes('बाजार') ||
    queryLower.includes('দর') ||
    queryLower.includes('சந்தை') ||
    queryLower.includes('ధర') ||
    queryLower.includes('ಮಾರುಕಟ್ಟೆ')
  ) {
    category = 'general';
    const dosages = [
      { product: 'Wheat (गेहूँ)', amountPerAcre: '₹ 2,450 - 2,820 / Qtl', timing: 'MSP: ₹ 2,275' },
      { product: 'Soybean (सोयाबीन)', amountPerAcre: '₹ 4,300 - 4,850 / Qtl', timing: 'MSP: ₹ 4,892' },
      { product: 'Maize (मक्का)', amountPerAcre: '₹ 2,150 - 2,400 / Qtl', timing: 'Active trade' },
      { product: 'Gram (चना)', amountPerAcre: '₹ 5,800 - 6,350 / Qtl', timing: 'Strong demand' },
    ];

    const bundles: Record<SupportedLang, LocalizedResponseBundle> = {
      en: {
        summary: `Current APMC Mandi commodity rates around ${district}:`,
        responseText: `**Mandi Price Benchmarks for ${district} region:**\n\n• **Wheat:** ₹ 2,450 - ₹ 2,820 / quintal\n• **Soybean:** ₹ 4,300 - ₹ 4,850 / quintal\n• **Maize:** ₹ 2,150 - ₹ 2,400 / quintal\n• **Gram:** ₹ 5,800 - ₹ 6,350 / quintal\n\nOpen the **Market & Mandi** module for live arrivals.`,
        dosages,
        suggestedFollowUps: ['What is the best selling window?', 'What should be grain moisture for storage?', 'What is recommended fertilizer?'],
      },
      hi: {
        summary: `${district} व नजदीकी APMC मंडियों में प्रमुख फसलों के ताजा भाव:`,
        responseText: `**${district} क्षेत्र मंडी भाव संकेत:**\n\n• **गेहूँ:** ₹ 2,450 - ₹ 2,820 प्रति क्विंटल\n• **सोयाबीन:** ₹ 4,300 - ₹ 4,850 प्रति क्विंटल\n• **मक्का:** ₹ 2,150 - ₹ 2,400 प्रति क्विंटल\n• **चना:** ₹ 5,800 - ₹ 6,350 प्रति क्विंटल\n\nविस्तृत मंडी लिस्ट के लिए **"Market & Mandi"** मेनू पर क्लिक करें।`,
        dosages,
        suggestedFollowUps: ['फसल बेचने का सही समय क्या है?', 'भंडारण में नमी कितनी होनी चाहिए?', 'खाद की सही खुराक क्या है?'],
      },
      mr: {
        summary: `${district} परिसरातील बाजार समित्यांचे चालू बाजारभाव:`,
        responseText: `**${district} कृषी उत्पन्न बाजार समिती (APMC) दर:**\n\n• **गहू:** ₹ २,४५० - ₹ २,८२० प्रति क्विंटल\n• **सोयाबीन:** ₹ ४,३०० - ₹ ४,८५० प्रति क्विंटल\n• **मका:** ₹ २,१५० - ₹ २,४०० प्रति क्विंटल\n• **हरभरा:** ₹ ५,८०० - ₹ ६,३५० प्रति क्विंटल\n\nअधिक माहितीसाठी **"Market & Mandi"** मेनू पहा.`,
        dosages,
        suggestedFollowUps: ['माल विकण्याची योग्य वेळ कोणती?', 'साठवणुकीसाठी ओलावा किती असावा?', 'खतांची मात्रा काय असावी?'],
      },
      bn: {
        summary: `${district} এলাকার বর্তমান মাণ্ডি ও বাজার দর:`,
        responseText: `**${district} অঞ্চলের বাজারদর তথ্য:**\n\n• **গম:** ₹ ২,৪৫০ - ₹ ২,৮২০ প্রতি কুইন্টাল\n• **সয়াবিন:** ₹ ৪,৩০০ - ₹ ৪,৮৫০ প্রতি কুইন্টাল\n• **ভুট্টা:** ₹ ২,১৫০ - ₹ ২,৪০০ প্রতি কুইন্টাল\n• **ছোলা:** ₹ ৫,৮০০ - ₹ ৬,৩৫০ প্রতি কুইন্টাল\n\nবিস্তারিত জানতে **"Market & Mandi"** বিকল্পে যান।`,
        dosages,
        suggestedFollowUps: ['ফসল বিক্রির সঠিক সময় কি?', 'সংরক্ষণ আর্দ্রতা কত হওয়া উচিত?', 'সারের সুপারিশ কি?'],
      },
      ta: {
        summary: `${district} சந்தை விலை நிலவரம்:`,
        responseText: `**${district} மண்டல சந்தை விலை விவரங்கள்:**\n\n• **கோதுமை:** ₹ 2,450 - ₹ 2,820 / குவிண்டால்\n• **சோயாபீன்:** ₹ 4,300 - ₹ 4,850 / குவிண்டால்\n• **மக்காச்சோளம்:** ₹ 2,150 - ₹ 2,400 / குவிண்டால்\n• **கொண்டைக்கடலை:** ₹ 5,800 - ₹ 6,350 / குவிண்டால்\n\nமேலும் அறிய **"Market & Mandi"** மெனுவை பார்க்கவும்.`,
        dosages,
        suggestedFollowUps: ['விற்பனை செய்ய சிறந்த நேரம் எது?', 'தானிய ஈரப்பதம் எவ்வளவு இருக்க வேண்டும்?', 'உர பரிந்துரை என்ன?'],
      },
      te: {
        summary: `${district} ప్రాంత మార్కెట్ యార్డ్ ధరల వివరాలు:`,
        responseText: `**${district} వ్యవసాయ మార్కెట్ ధరలు:**\n\n• **గోధుమలు:** ₹ 2,450 - ₹ 2,820 / క్వింటాల్\n• **సోయాబీన్:** ₹ 4,300 - ₹ 4,850 / క్వింటాల్\n• **మొక్కజొన్న:** ₹ 2,150 - ₹ 2,400 / క్వింటాల్\n• **శనగలు:** ₹ 5,800 - ₹ 6,350 / క్వింటాల్\n\nపూర్తి వివరాలకు **"Market & Mandi"** చూడండి.`,
        dosages,
        suggestedFollowUps: ['పంట అమ్మడానికి సరైన సమయం ఏది?', 'నిల్వలో తేమ శాతం ఎంత ఉండాలి?', 'ఎరువుల సిఫార్సు ఏమిటి?'],
      },
      kn: {
        summary: `${district} ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ದರಗಳು:`,
        responseText: `**${district} ಎಪಿಎಂಸಿ ದರ ವಿವರಗಳು:**\n\n• **ಗೋಧಿ:** ₹ 2,450 - ₹ 2,820 / ಕ್ವಿಂಟಾಲ್\n• **ಸೋಯಾಬೀನ್:** ₹ 4,300 - ₹ 4,850 / ಕ್ವಿಂಟಾಲ್\n• **ಜೋಳ:** ₹ 2,150 - ₹ 2,400 / ಕ್ವಿಂಟಾಲ್\n• **ಕಡಲೆ:** ₹ 5,800 - ₹ 6,350 / ಕ್ವಿಂಟಾಲ್\n\nಹೆಚ್ಚಿನ ವಿವರಗಳಿಗೆ **"Market & Mandi"** ನೋಡಿ.`,
        dosages,
        suggestedFollowUps: ['ಬೆಳೆ ಮಾರಾಟಕ್ಕೆ ಉತ್ತಮ ಸಮಯ ಯಾವುದು?', 'ಧಾನ್ಯದ ತೇವಾಂಶ ಎಷ್ಟಿರಬೇಕು?', 'ಗೊಬ್ಬರದ ಶಿಫಾರಸು ಏನು?'],
      },
    };
    bundle = bundles[lang] || bundles.hi;
  }

  // 7. GENERAL / GREETING
  else {
    category = 'general';
    const bundles: Record<SupportedLang, LocalizedResponseBundle> = {
      en: {
        summary: `Annadata AI Assistant — Synced with your ${cropStr} farm profile:`,
        responseText: `Hello! I am your **Annadata AI Farming Voice Assistant**.\n\nI am synchronized with your **${cropStr}** farm profile (Location: ${village}, ${district}, Soil pH ${ph}):\n\n• **Soil Health Analysis:** pH ${ph}, Nitrogen, Phosphorus & Potash\n• **Balanced Fertilizer Dosages:** Urea, DAP, MOP & Micronutrients\n• **Weather-Guided Irrigation:** Sowing & spray safety\n• **Pest & Disease Control:** Organic & targeted remedies\n• **Mandi Prices:** Regional market benchmarks\n\nFeel free to speak your query or tap any suggested question below!`,
        suggestedFollowUps: ['How to view soil health report?', `How much fertilizer for ${cropStr}?`, 'When to irrigate based on weather?', 'How to control pests?'],
      },
      hi: {
        summary: `अन्नदाता एआई सहायक — आपकी ${cropStr} फसल प्रोफाइल के साथ जुड़ा हुआ है:`,
        responseText: `नमस्ते! मैं आपका **अन्नदाता एआई कृषि वाणी सहायक** हूँ।\n\nमैं आपकी **${cropStr}** फसल (खेत स्थान: ${village}, ${district}, मृदा pH ${ph}) के आधार पर आपकी सहायता कर सकता हूँ:\n\n• **मृदा स्वास्थ्य रिपोर्ट:** pH ${ph}, नाइट्रोजन, फास्फोरस व पोटाश\n• **संतुलित खाद खुराक:** यूरिया, डीएपी, पोटाश एवं जिंक\n• **मौसम आधारित सिंचाई सलाह:** आगामी बारिश के अनुसार\n• **कीट व बीमारी नियंत्रण:** पीला मोज़ेक एवं रसचूसक कीट उपचार\n• **मंडी भाव:** नजदीकी APMC मंडियों के ताजा भाव\n\nकृपया बोलकर या लिखकर अपना सवाल पूछें या नीचे दिए गए सुझावों में से चुनें!`,
        suggestedFollowUps: ['मृदा स्वास्थ्य रिपोर्ट कैसे देखें?', `${cropStr} में कितना खाद डालें?`, 'मौसम के अनुसार सिंचाई कब करें?', 'कीट नियंत्रण कैसे करें?'],
      },
      mr: {
        summary: `अन्नदाता एआय सहाय्यक — आपल्या ${cropStr} शेतीशी जोडलेला आहे:`,
        responseText: `नमस्कार! मी आपला **अन्नदाता एआय शेती वाणी सहाय्यक** आहे.\n\nमी आपल्या **${cropStr}** पिकाच्या (${village}, ${district}, माती सामू ${ph}) माहितीनुसार मार्गदर्शन करू शकतो:\n\n• **माती आरोग्य पत्रिका:** सामू ${ph}, नायट्रोजन, फॉस्फरस व पोटॅश\n• **संतुलित खत व्यवस्थापन:** युरिया, डीएपी, पोटॅश आणि झिंक\n• **हवामानानुसार सिंचन सल्ला:** आगामी पावसाच्या अंदाजानुसार\n• **कीड व रोग नियंत्रण:** पांढरी माशी व पाने पिवळी पडण्यावरील उपाय\n• **बाजारभाव:** जवळच्या कृषी उत्पन्न बाजार समित्यांचे दर\n\nकृपया आपला प्रश्न बोला किंवा खालील पर्यायांमधून निवडा!`,
        suggestedFollowUps: ['माती आरोग्य अहवाल कसा पाहावा?', `${cropStr} पिकाला किती खत द्यावे?`, 'हवामानानुसार पाणी कधी द्यावे?', 'कीड नियंत्रण कसे करावे?'],
      },
      bn: {
        summary: `অন্নদাতা এআই সহকারী — আপনার ${cropStr} জমির তথ্যের সাথে সংযুক্ত:`,
        responseText: `নমস্কার! আমি আপনার **অন্নদাতা এআই কৃষি ভয়েস সহকারী**।\n\nআমি আপনার **${cropStr}** ফসলের (${village}, ${district}, মাটি pH ${ph}) তথ্যের ভিত্তিতে পরামর্শ দিতে প্রস্তুত:\n\n• **মৃত্তিকা স্বাস্থ্য রিপোর্ট:** pH ${ph}, নাইট্রোজেন, ফসফরাস ও পটাশ\n• **সুষম সার প্রয়োগ:** ইউরিয়া, ডিএপি ও পটাশ\n• **আবহাওয়াভিত্তিক সেচ পরামর্শ:** বৃষ্টির পূর্বাভাস অনুযায়ী\n• **পোকা ও রোগবালাই দমন:** জৈব ও আধুনিক প্রতিকার\n• **বাজারদর:** স্থানীয় মাণ্ডির প্রতিদিনের দর\n\nদয়া করে আপনার প্রশ্ন মুখে বলুন বা নিচের বিকল্পগুলি থেকে নির্বাচন করুন!`,
        suggestedFollowUps: ['মাটির রিপোর্ট কিভাবে দেখবেন?', `${cropStr} ফসলে কত সার দিতে হবে?`, 'আবহাওয়া দেখে সেচ কখন দেবেন?', 'কীটপতঙ্গ নিয়ন্ত্রণ করবেন কিভাবে?'],
      },
      ta: {
        summary: `அன்னதாதா AI உதவியாளர் — உங்கள் ${cropStr} பயிர் விவரங்களுடன் இணைக்கப்பட்டுள்ளது:`,
        responseText: `வணக்கம்! நான் உங்கள் **அன்னதாதா AI விவசாய குரல் உதவியாளர்**.\n\nஉங்கள் **${cropStr}** பயிர் (${village}, ${district}, மண் pH ${ph}) அடிப்படையில் வழிகாட்ட நான் தயாராக உள்ளேன்:\n\n• **மண் வள பகுப்பாய்வு:** pH ${ph}, நைட்ரஜன், பாஸ்பரஸ், பொட்டாசியம்\n• **சரியான உர பரிந்துரை:** யூரியா, டிஏபி, பொட்டாஷ்\n• **வானிலை சார்ந்த பாசன ஆலோசனை:** மழை முன்னறிவிப்புடன்\n• **பூச்சி மற்றும் நோய் கட்டுப்பாடு:** இயற்கை மற்றும் இலக்கு தீர்வுகள்\n• **சந்தை விலை நிலவரம்:** நேரடி மண்டல வரத்து\n\nஉங்கள் கேள்வியை பேசுங்கள் அல்லது கீழே உள்ள விருப்பங்களில் இருந்து தேர்வு செய்யவும்!`,
        suggestedFollowUps: ['மண் வள அறிக்கையை பார்ப்பது எப்படி?', `${cropStr} பயிருக்கு எவ்வளவு உரம் இட வேண்டும்?`, 'பாசனம் எப்போது செய்ய வேண்டும்?', 'பூச்சி கட்டுப்பாடு செய்வது எப்படி?'],
      },
      te: {
        summary: `అన్నదాత AI సహాయకుడు — మీ ${cropStr} పంట వివరాలతో అనుసంధానించబడింది:`,
        responseText: `నమస్కారం! నేను మీ **అన్నదాత AI వ్యవసాయ వాయిస్ అసిస్టెంట్**.\n\nమీ **${cropStr}** పంట (${village}, ${district}, నేల pH ${ph}) ఆధారంగా మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాను:\n\n• **భూసార పరీక్ష విశ్లేషణ:** pH ${ph}, నత్రజని, భాస్వరం, పొటాష్\n• **సమతుల్య ఎరువుల మోతాదు:** యూరియా, డీఏపీ, పొటాష్ మరియు జింక్\n• **వాతావరణ ఆధారిత నీటిపారుదల:** వర్ష సూచనలతో\n• **పురుగులు మరియు తెగుళ్ల నివారణ:** సేంద్రీయ మరియు రసాయన మందులు\n• **మార్కెట్ ధరలు:** తాజా మార్కెట్ యార్డ్ ధరలు\n\nదయచేసి మీ ప్రశ్నను మాట్లాడండి లేదా క్రింది ప్రశ్నలలో ఒకదాన్ని ఎంచుకోండి!`,
        suggestedFollowUps: ['నేల నివేదిక ఎలా చూడాలి?', `${cropStr} పంటకు ఎంత ఎరువు వేయాలి?`, 'నీరు ఎప్పుడు పెట్టాలి?', 'పురుగుల నివారణ ఎలా చేయాలి?'],
      },
      kn: {
        summary: `ಅನ್ನದಾತ AI ಸಹಾಯಕ — ನಿಮ್ಮ ${cropStr} ಬೆಳೆ ವಿವರಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಗೊಂಡಿದೆ:`,
        responseText: `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **ಅನ್ನದಾತ AI ಕೃಷಿ ಧ್ವನಿ ಸಹಾಯಕ**.\n\nನಿಮ್ಮ **${cropStr}** ಬೆಳೆ (${village}, ${district}, ಮಣ್ಣಿನ pH ${ph}) ಆಧರಿಸಿ ಮಾಹಿತಿ ನೀಡಲು ಸಿದ್ಧನಿದ್ದೇನೆ:\n\n• **ಮಣ್ಣು ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ:** pH ${ph}, ಸಾರಜನಕ, ರಂಜಕ, ಪೊಟ್ಯಾಶ್\n• **ಸಮತೋಲಿತ ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ:** ಯೂರಿಯಾ, ಡಿಎಪಿ ಮತ್ತು ಪೊಟ್ಯಾಶ್\n• **ಹವಾಮಾನ ಆಧಾರಿತ ನೀರಾವರಿ ಸಲಹೆ:** ಮಳೆಯ ಮುನ್ಸೂಚನೆ ಆಧರಿಸಿ\n• **ಕೀಟ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ:** ಸಾವಯವ ಹಾಗೂ ರಾಸಾಯನಿಕ ಚಿಕಿತ್ಸೆ\n• **ಮಾರುಕಟ್ಟೆ ದರಗಳು:** ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ದರಗಳು\n\nದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮಾತನಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ಆಯ್ಕೆಗಳನ್ನು ಬಳಸಿ!`,
        suggestedFollowUps: ['ಮಣ್ಣಿನ ವರದಿ ನೋಡುವುದು ಹೇಗೆ?', `${cropStr} ಬೆಳೆಗೆ ಎಷ್ಟು ಗೊಬ್ಬರ ಹಾಕಬೇಕು?`, 'ನೀರಾವರಿ ಯಾವಾಗ ಮಾಡಬೇಕು?', 'ಕೀಟ ನಿಯಂತ್ರಣ ಹೇಗೆ ಮಾಡುವುದು?'],
      },
    };
    bundle = bundles[lang] || bundles.hi;
  }

  return {
    id: `msg_${Date.now()}`,
    sender: 'assistant',
    text: bundle.responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    language: lang,
    category,
    structuredData: {
      summary: bundle.summary,
      dosages: bundle.dosages,
      warnings: bundle.warnings,
      steps: bundle.steps,
    },
    suggestedFollowUps: bundle.suggestedFollowUps,
  };
}

// Session persistence helpers
export function getSavedChatHistory(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ChatMessage[];
  } catch (e) {
    return [];
  }
}

export function saveChatHistory(messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save chat history', e);
  }
}

export function clearChatHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear chat history', e);
  }
}

// Dynamically converts existing message conversation into newly selected language
export function retranslateMessages(
  messages: ChatMessage[],
  profile: FarmerProfile,
  soilReport?: SoilReportRecord | null,
  weather?: WeatherData | null,
  targetLang: SupportedLang = 'hi'
): ChatMessage[] {
  return messages.map((msg) => {
    if (msg.sender === 'user') return msg;

    let topicQuery = 'hello';
    if (msg.category === 'fertilizer') topicQuery = 'fertilizer';
    else if (msg.category === 'irrigation') topicQuery = 'irrigation';
    else if (msg.category === 'pest') topicQuery = 'pest';
    else if (msg.category === 'crop_selection') topicQuery = 'crop';
    else if (
      msg.text.includes('मंडी') ||
      msg.text.includes('Mandi') ||
      msg.text.includes('APMC') ||
      msg.text.includes('बाजार') ||
      msg.text.includes('दर')
    ) {
      topicQuery = 'mandi';
    } else if (
      msg.text.includes('pH') ||
      msg.text.includes('Soil') ||
      msg.text.includes('मिट्टी') ||
      msg.text.includes('मृदा') ||
      msg.text.includes('माती')
    ) {
      topicQuery = 'soil';
    }

    const fresh = generateAiResponse(topicQuery, profile, soilReport, weather, targetLang);
    return {
      ...fresh,
      id: msg.id,
      timestamp: msg.timestamp,
    };
  });
}

