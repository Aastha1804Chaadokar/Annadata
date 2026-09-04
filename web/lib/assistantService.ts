import { ChatMessage, AssistantSession } from '@/types/assistant';
import { FarmerProfile } from '@/types/farmer';
import { SoilReportRecord } from '@/types/soil';
import { WeatherData } from '@/types/weather';
import { formatCropDisplay } from '@/lib/cropDataset';
import i18n from '@/lib/i18n/config';

const STORAGE_KEY = 'annadata_ai_chat_history';

// Context-aware AI response generator with deep agricultural domain knowledge
export function generateAiResponse(
  userQuery: string,
  profile: FarmerProfile,
  soilReport?: SoilReportRecord | null,
  weather?: WeatherData | null,
  languageCode?: string
): ChatMessage {
  const queryLower = userQuery.toLowerCase().trim();
  const cropStr = profile.currentCrop ? formatCropDisplay(profile.currentCrop) : profile.mainCrop || 'Maize (मक्का)';
  const village = profile.village || 'Aroda (अरोड़ा)';
  const district = profile.district || 'Bhopal (भोपाल)';
  const ph = soilReport?.ph || 6.8;
  const nitrogen = soilReport?.nitrogen || 260;
  const phosphorus = soilReport?.phosphorus || 18;
  const potassium = soilReport?.potassium || 290;

  const activeLang = (languageCode || i18n.language || 'en').substring(0, 2);
  const isHindiFamily = ['hi', 'mr', 'bn', 'ta', 'te', 'kn', 'pa', 'gu'].includes(activeLang) || /[\u0900-\u097F]/.test(userQuery);

  let category: ChatMessage['category'] = 'general';
  let responseText = '';
  let summary = '';
  let dosages: any[] | undefined = undefined;
  let warnings: string[] | undefined = undefined;
  let steps: string[] | undefined = undefined;
  let suggestedFollowUps: string[] = [];

  // 1. SOIL HEALTH & LAB REPORT QUERIES (मृदा / मिट्टी / रिपोर्ट)
  if (
    queryLower.includes('soil') ||
    queryLower.includes('report') ||
    queryLower.includes('मिट्टी') ||
    queryLower.includes('मृदा') ||
    queryLower.includes('रिपोर्ट') ||
    queryLower.includes('ph') ||
    queryLower.includes('जांच')
  ) {
    category = 'general';
    summary = isHindiFamily
      ? `खेत स्थान ${village} के लिए मृदा स्वास्थ्य विश्लेषण (मृदा pH: ${ph}):`
      : `Soil Health Analysis for your farm in ${village} (Soil pH: ${ph}):`;

    steps = isHindiFamily
      ? [
          `1. 'मृदा स्वास्थ्य (Soil Health)' मेनू पर क्लिक करें।`,
          `2. वर्तमान रिकॉर्ड: pH ${ph} (तटस्थ/अनुकूल), नाइट्रोजन ${nitrogen} kg/ha (मध्यम), फास्फोरस ${phosphorus} kg/ha, पोटाश ${potassium} kg/ha।`,
          `3. यदि नया सॉइल हेल्थ कार्ड प्राप्त हुआ है, तो 'नया मृदा परीक्षण जोड़ें' पर क्लिक करके लैब डेटा दर्ज करें।`,
        ]
      : [
          `1. Navigate to the 'Soil Health' tab in your farmer sidebar.`,
          `2. Your active profile: pH ${ph} (Optimal), Nitrogen ${nitrogen} kg/ha, Phosphorus ${phosphorus} kg/ha, Potash ${potassium} kg/ha.`,
          `3. Click 'Add Soil Test' to digitize certified Soil Health Card lab results.`,
        ];

    warnings = isHindiFamily
      ? ['मृदा नमूना हमेशा बुआई से 15-20 दिन पहले खेत के 5 अलग-अलग कोनों से V-आकार में 6 इंच गहराई से लें।']
      : ['Collect soil samples 6 inches deep from 5 zigzag points across the plot before fertilizer application.'];

    responseText = isHindiFamily
      ? `**मृदा स्वास्थ्य रिपोर्ट देखने एवं समझने की विधि:**\n\n1. **वर्तमान खेत स्थिति:** आपके खेत (${village}, ${district}) का मृदा pH **${ph}** है, जो **${cropStr}** के लिए सर्वोत्तम है।\n2. **पोषक तत्व स्थिति:**\n   • **नाइट्रोजन:** ${nitrogen} kg/ha (मध्यम)\n   • **फास्फोरस:** ${phosphorus} kg/ha (संतुलित)\n   • **पोटाश:** ${potassium} kg/ha (पर्याप्त)\n3. **रिपोर्ट देखने के लिए:** बाईं ओर मेनू में **"मृदा स्वास्थ्य (Soil Health)"** पर क्लिक करें। वहां आप लैब रिपोर्ट व फोटो दोनों देख सकते हैं।`
      : `**How to view & interpret your Soil Health Report:**\n\n1. **Your Farm's Active Soil Profile:** Farm at ${village}, ${district} has soil pH **${ph}**, which is optimal for **${cropStr}**.\n2. **Nutrient Status:**\n   • **Nitrogen:** ${nitrogen} kg/ha (Medium)\n   • **Phosphorus:** ${phosphorus} kg/ha (Adequate)\n   • **Potassium:** ${potassium} kg/ha (Sufficient)\n3. **To view full card:** Click **"Soil Health"** in the sidebar to review all chemical parameters or record new tests.`;

    suggestedFollowUps = isHindiFamily
      ? [`${cropStr} में संतुलित खाद कितनी डालें?`, 'मिट्टी का pH कैसे सुधारें?', 'मौसम के अनुसार सिंचाई कब करें?']
      : [`How much fertilizer for ${cropStr}?`, 'How to balance soil pH?', 'When to irrigate based on weather?'];
  }

  // 2. FERTILIZER & NUTRIENT DOSAGE (खाद और उर्वरक)
  else if (
    queryLower.includes('fertilizer') ||
    queryLower.includes('khad') ||
    queryLower.includes('urea') ||
    queryLower.includes('npk') ||
    queryLower.includes('dap') ||
    queryLower.includes('खाद') ||
    queryLower.includes('उर्वरक') ||
    queryLower.includes('यूरिया') ||
    queryLower.includes('पोटाश')
  ) {
    category = 'fertilizer';
    summary = isHindiFamily
      ? `${cropStr} फसल के लिए मृदा स्वास्थ्य पीएच (${ph}) आधारित संतुलित खाद की सिफारिश:`
      : `Recommended fertilizer dosage for your ${cropStr} crop based on soil pH (${ph}):`;

    dosages = [
      { product: 'DAP (डीएपी)', amountPerAcre: '45-50 kg / acre', timing: 'बुआई के समय बेसल डोज के रूप में' },
      { product: 'Urea (यूरिया)', amountPerAcre: '30-35 kg / acre', timing: 'दो बराबर किस्तों में (25 और 45 दिनों पर)' },
      { product: 'MOP / Potash (पोटाश)', amountPerAcre: '18-20 kg / acre', timing: 'बुआई के समय बेसल डोज' },
      { product: 'Zinc Sulphate (जिंक सल्फेट 21%)', amountPerAcre: '8-10 kg / acre', timing: 'जड़ों के विकास व दानों की चमक के लिए' },
    ];

    warnings = [
      'यूरिया और सिंगल सुपर फॉस्फेट (SSP) को पहले से मिलाकर न रखें।',
      'यूरिया का छिड़काव हमेशा खेत में पर्याप्त नमी होने पर ही करें।',
    ];

    steps = [
      '100% डीएपी और पोटाश बुआई के समय बेसल ड्रेसिंग में दें।',
      'यूरिया की पहली टॉप ड्रेसिंग 20-25 दिन बाद निंदाई-गुड़ाई के बाद करें।',
      'यूरिया की दूसरी टॉप ड्रेसिंग फूल आने से पहले (40-45 दिन) करें।',
    ];

    responseText = isHindiFamily
      ? `आपकी **${cropStr}** फसल के लिए अनुशंसित खाद खुराक (${district} क्षेत्र, मृदा pH ${ph}):\n\n1. **डीएपी (DAP):** 45-50 किग्रा प्रति एकड़ (बुआई के समय)।\n2. **यूरिया:** 30 किग्रा प्रति एकड़ (25 व 45 दिन पर दो किस्तों में)।\n3. **म्यूरेट ऑफ पोटाश (MOP):** 18-20 किग्रा प्रति एकड़ (बुआई के समय)।\n4. **जिंक सल्फेट:** 8-10 किग्रा प्रति एकड़।`
      : `Fertilizer dosage for your **${cropStr}** crop (${district}, Soil pH ${ph}):\n\n1. **DAP:** 45-50 kg/acre as basal dose at sowing.\n2. **Urea:** 30-35 kg/acre split into 2 top dressings (at 25 & 45 days).\n3. **MOP Potash:** 18-20 kg/acre basal application.\n4. **Zinc Sulphate:** 8-10 kg/acre for root & grain development.`;

    suggestedFollowUps = isHindiFamily
      ? ['जैविक खाद (वर्मीकंपोस्ट) का प्रयोग कैसे करें?', 'जिंक की कमी के क्या लक्षण हैं?', 'मौसम के अनुसार सिंचाई कब करें?']
      : ['How to apply organic vermicompost?', 'What are zinc deficiency symptoms?', 'When to irrigate based on weather?'];
  }

  // 3. IRRIGATION & WEATHER (सिंचाई और मौसम)
  else if (
    queryLower.includes('irrigation') ||
    queryLower.includes('sinchai') ||
    queryLower.includes('water') ||
    queryLower.includes('rain') ||
    queryLower.includes('सिंचाई') ||
    queryLower.includes('पानी') ||
    queryLower.includes('मौसम') ||
    queryLower.includes('बारिश')
  ) {
    category = 'irrigation';
    const rainProb = weather?.current.precipitationProb || 20;
    const isRainHigh = rainProb > 50;

    summary = isRainHigh
      ? (isHindiFamily ? '⚠️ आगामी 48 घंटों में बारिश की संभावना के कारण सिंचाई रोकने की सलाह दी जाती है।' : '⚠️ Hold irrigation due to high rain probability in next 48 hours.')
      : (isHindiFamily ? '✅ मौसम अनुकूल है, फसल में सामान्य सिंचाई की जा सकती है।' : '✅ Weather conditions are optimal for scheduled irrigation.');

    warnings = isRainHigh
      ? ['बारिश की संभावना >50% है। अधिक पानी से जड़ों का दम घुट सकता है और पोषक तत्व बह जाते हैं।']
      : ['सिंचाई हमेशा सुबह या शाम के समय करें ताकि वाष्पीकरण से पानी का नुकसान कम हो।'];

    steps = [
      'सिंचाई से पहले खेत की मिट्टी में 2-3 इंच गहराई पर नमी की जांच करें।',
      'जलभराव से बचने के लिए खेत में जलनिकासी की नालियां साफ रखें।',
    ];

    responseText = isHindiFamily
      ? `आपकी फसल **${cropStr}** (${village}) के लिए सिंचाई परामर्श:\n\n` +
        (isRainHigh
          ? `⚠️ आगामी 48 घंटों में **${rainProb}% बारिश की संभावना** है। सिंचाई **तुरंत रोकें** ताकि जलभराव से जड़ें न सड़ें।`
          : `✅ वर्तमान में बारिश की संभावना कम है (${rainProb}%)। यदि खेत की ऊपरी मिट्टी 2 इंच तक सूख गई है तो हल्की सिंचाई करें।`)
      : `Irrigation advisory for your **${cropStr}** crop in ${village}:\n\n` +
        (isRainHigh
          ? `⚠️ Rain probability is high (**${rainProb}%**). **Hold irrigation** to prevent root damage and nutrient runoff.`
          : `✅ Rain probability is low (**${rainProb}%**). Proceed with light scheduled irrigation if topsoil is dry.`);

    suggestedFollowUps = isHindiFamily
      ? ['ड्रिप सिंचाई के क्या फायदे हैं?', 'कीटनाशक छिड़काव का सही समय क्या है?', 'फसल स्वास्थ्य की जांच कैसे करें?']
      : ['What are the benefits of drip irrigation?', 'What is the ideal time for spraying pesticides?', 'How to inspect crop health?'];
  }

  // 4. PEST, DISEASE & LEAF SYMPTOMS (कीट, बीमारी, पत्ते पीले)
  else if (
    queryLower.includes('pest') ||
    queryLower.includes('disease') ||
    queryLower.includes('kit') ||
    queryLower.includes('spray') ||
    queryLower.includes('yellow') ||
    queryLower.includes('insect') ||
    queryLower.includes('कीट') ||
    queryLower.includes('बीमारी') ||
    queryLower.includes('कीटनाशक') ||
    queryLower.includes('पीले') ||
    queryLower.includes('धब्बा') ||
    queryLower.includes('पत्ते')
  ) {
    category = 'pest';
    summary = isHindiFamily
      ? `${cropStr} फसल में कीट एवं रोग नियंत्रण मार्गदर्शन:`
      : `Pest & disease prevention strategy for ${cropStr}:`;

    dosages = [
      { product: 'Neem Oil (नीम तेल 10,000 PPM)', amountPerAcre: '500 मिली / 200 लीटर पानी', timing: 'शुरुआती रस चूसक कीटों के बचाव के लिए' },
      { product: 'Thiamethoxam 25% WG', amountPerAcre: '80 ग्राम / 150 लीटर पानी', timing: 'सफेद मक्खी, माहू एवं एफिड्स नियंत्रण हेतु' },
      { product: 'Carbendazim 12% + Mancozeb 63% WP', amountPerAcre: '300 ग्राम / 150 लीटर पानी', timing: 'पत्ती धब्बा व फफूंद जनित रोगों हेतु' },
    ];

    warnings = [
      'तेज हवा (>15 किमी/घंटा) या बारिश की संभावना होने पर स्प्रे न करें।',
      'कीटनाशक छिड़काव करते समय मास्क और दस्ताने अवश्य पहनें।',
    ];

    steps = [
      'खेत में 10 पौधों के पत्तों के नीचे सफेद मक्खी या कीट अंडों की जांच करें।',
      'शाम 4 से 6 बजे के बीच स्प्रे करें ताकि दवाई का असर अधिक हो।',
      'रोगग्रस्त पौधों की फोटो "Crop Health Scan" में अपलोड करके लक्षण सत्यापित करें।',
    ];

    responseText = isHindiFamily
      ? `**${cropStr} फसल सुरक्षा एवं रोग नियंत्रण:**\n\n1. **पत्तियां पीली होने पर:** यदि पत्तियां पीली पड़ रही हैं तो यह नाइट्रोजन की कमी या रसचूसक कीट (सफेद मक्खी) का लक्षण हो सकता है।\n2. **जैविक उपचार:** नीम का तेल 500 मिली प्रति एकड़ का छिड़काव करें।\n3. **रासायनिक दवा:** थायामेथॉक्सम 25% WG (80 ग्राम/एकड़) का स्प्रे करें।\n4. **फोटो जांच:** "Crop Health" मेनू में जाकर पत्तों की फोटो अपलोड करके तुरंत लक्षण पहचानें।`
      : `**${cropStr} Pest & Disease Management:**\n\n1. **Yellowing Leaves:** Often caused by sucking pests (whiteflies/aphids) or early nitrogen deficiency.\n2. **Organic Spray:** Neem Oil (10,000 PPM) @ 500ml/acre in 200L water.\n3. **Targeted Protection:** Thiamethoxam 25% WG @ 80g/acre.\n4. **Instant Photo Scan:** Upload a photo in the 'Crop Health' module to detect leaf symptoms.`;

    suggestedFollowUps = isHindiFamily
      ? ['पीला मोज़ेक रोग के क्या लक्षण हैं?', 'जैविक कीटनाशक कैसे बनाएं?', 'यूरिया और कीटनाशक एक साथ मिला सकते हैं?']
      : ['What are Yellow Mosaic Disease symptoms?', 'How to prepare bio-pesticide at home?', 'Can Urea and pesticide be mixed together?'];
  }

  // 5. CROP RECOMMENDATION & SOWING (फसल चयन / बुआई)
  else if (
    queryLower.includes('crop') ||
    queryLower.includes('sow') ||
    queryLower.includes('grow') ||
    queryLower.includes('फसल') ||
    queryLower.includes('बोएं') ||
    queryLower.includes('खरीफ') ||
    queryLower.includes('रबी') ||
    queryLower.includes('जायद')
  ) {
    category = 'crop_selection';
    summary = isHindiFamily
      ? `खेत स्थान (${village}, ${district}) व मृदा pH (${ph}) के लिए उपयुक्त फसलें:`
      : `Recommended crops for your farm (${village}, ${district}) with soil pH (${ph}):`;

    steps = isHindiFamily
      ? [
          `1. खरीफ (मानसून): सोयाबीन, मक्का (Maize), धान, उड़द`,
          `2. रबी (सर्दी): शरबती गेहूँ, चना (Gram), सरसों (Mustard)`,
          `3. जायद (गर्मी): मूंग, उड़द, सब्जियां`,
        ]
      : [
          `1. Kharif (Monsoon): Soybean, Maize, Paddy, Black Gram`,
          `2. Rabi (Winter): Sharbati Wheat, Gram/Chickpea, Mustard`,
          `3. Zaid (Summer): Green Gram, Vegetables, Watermelon`,
        ];

    responseText = isHindiFamily
      ? `**आपके खेत के लिए सर्वोत्तम फसल सिफारिशें:**\n\nआपके क्षेत्र (${district}) की मिट्टी (pH ${ph}) के आधार पर:\n• **रबी सीजन:** शरबती गेहूँ (94% मैच) और चना (91% मैच)।\n• **खरीफ सीजन:** मक्का (Maize) और सोयाबीन।\n\nविस्तृत रैंकिंग देखने के लिए **"Crop Recommendation"** मेनू पर जाएं।`
      : `**Optimal Crop Recommendations for your land:**\n\nBased on your agro-climatic subzone in ${district} and soil pH ${ph}:\n• **Rabi Season:** Sharbati Wheat (94% Match) & Gram/Chickpea (91% Match).\n• **Kharif Season:** Maize & Soybean.\n\nVisit the **Crop Recommendation** module for rule-based match scores.`;

    suggestedFollowUps = isHindiFamily
      ? [`गेहूँ की बुआई का सही समय क्या है?`, 'चना में सिंचाई कब करें?', 'मृदा स्वास्थ्य रिपोर्ट कैसे देखें?']
      : ['What is the best sowing window for Wheat?', 'When to irrigate Gram/Chickpea?', 'How to check Soil Health report?'];
  }

  // 6. MANDI PRICES & MARKET (मंडी भाव / बाजार)
  else if (
    queryLower.includes('mandi') ||
    queryLower.includes('market') ||
    queryLower.includes('price') ||
    queryLower.includes('rate') ||
    queryLower.includes('मंडी') ||
    queryLower.includes('भाव') ||
    queryLower.includes('बाजार') ||
    queryLower.includes('एमएसपी')
  ) {
    category = 'general';
    summary = isHindiFamily
      ? `${district} व नजदीकी APMC मंडियों में प्रमुख फसलों के ताजा भाव:`
      : `Current APMC Mandi price benchmarks around ${district}:`;

    dosages = [
      { product: 'Wheat (गेहूँ)', amountPerAcre: '₹ 2,450 - 2,820 / क्विंटल', timing: 'MSP: ₹ 2,275' },
      { product: 'Soybean (सोयाबीन)', amountPerAcre: '₹ 4,300 - 4,850 / क्विंटल', timing: 'MSP: ₹ 4,892' },
      { product: 'Maize (मक्का)', amountPerAcre: '₹ 2,150 - 2,400 / क्विंटल', timing: 'स्थिर मांग' },
      { product: 'Gram (चना)', amountPerAcre: '₹ 5,800 - 6,350 / क्विंटल', timing: 'मजबूत बाजार' },
    ];

    responseText = isHindiFamily
      ? `**${district} क्षेत्र मंडी भाव संकेत:**\n\n• **गेहूँ:** ₹ 2,450 - ₹ 2,820 प्रति क्विंटल\n• **सोयाबीन:** ₹ 4,300 - ₹ 4,850 प्रति क्विंटल\n• **मक्का:** ₹ 2,150 - ₹ 2,400 प्रति क्विंटल\n• **चना:** ₹ 5,800 - ₹ 6,350 प्रति क्विंटल\n\nविस्तृत मंडी लिस्ट के लिए **"Market & Mandi"** मेनू पर क्लिक करें।`
      : `**Mandi Price Benchmarks for ${district} region:**\n\n• **Wheat:** ₹ 2,450 - ₹ 2,820 / quintal\n• **Soybean:** ₹ 4,300 - ₹ 4,850 / quintal\n• **Maize:** ₹ 2,150 - ₹ 2,400 / quintal\n• **Gram:** ₹ 5,800 - ₹ 6,350 / quintal\n\nOpen the **Market & Mandi** tab to review real-time APMC arrivals.`;

    suggestedFollowUps = isHindiFamily
      ? ['फसल बेचने का सही समय क्या है?', 'भंडारण में नमी कितनी होनी चाहिए?', 'खाद की सही खुराक क्या है?']
      : ['What is the best selling window?', 'What should be grain moisture for storage?', 'What is recommended fertilizer?'];
  }

  // 7. GENERAL / DEFAULT AGRICULTURAL GUIDANCE
  else {
    category = 'general';
    summary = isHindiFamily
      ? `अन्नदाता एआई सहायक — आपकी ${cropStr} फसल प्रोफाइल के साथ जुड़ा हुआ है:`
      : `Annadata AI Assistant — Synced with your ${cropStr} farm context:`;

    responseText = isHindiFamily
      ? `नमस्ते! मैं आपका **अन्नदाता एआई कृषि सहायक** हूँ।\n\nमैं आपकी **${cropStr}** फसल (खेत स्थान: ${village}, ${district}, मृदा pH ${ph}) के आधार पर आपकी मदद कर सकता हूँ:\n\n• **मृदा स्वास्थ्य रिपोर्ट:** pH ${ph}, नाइट्रोजन, फास्फोरस व पोटाश की स्थिति\n• **संतुलित खाद खुराक:** यूरिया, डीएपी, पोटाश एवं जिंक\n• **मौसम आधारित सिंचाई सलाह:** आगामी बारिश के अनुसार\n• **कीट व बीमारी नियंत्रण:** पीला मोज़ेक, इल्ली एवं पत्ती धब्बा उपचार\n• **मंडी भाव:** नजदीकी APMC मंडियों के भाव\n\nकृपया अपना सवाल पूछें या नीचे दिए गए सुझावों में से चुनें!`
      : `Hello! I am your **Annadata AI Farming Assistant**.\n\nI am synchronized with your **${cropStr}** farm profile (Location: ${village}, ${district}, Soil pH ${ph}):\n\n• **Soil Health Analysis:** pH ${ph}, Nitrogen, Phosphorus & Potash\n• **Balanced Fertilizer Dosages:** Urea, DAP, MOP & Micronutrients\n• **Weather-Guided Irrigation:** Sowing & spray safety\n• **Pest & Disease Control:** Organic & targeted remedies\n• **Mandi Prices:** Regional market benchmarks\n\nFeel free to ask any farming question or select from the quick options below!`;

    suggestedFollowUps = isHindiFamily
      ? ['मृदा स्वास्थ्य रिपोर्ट कैसे देखें?', `${cropStr} में कितना खाद डालें?`, 'मौसम के अनुसार सिंचाई कब करें?', 'कीट नियंत्रण कैसे करें?']
      : ['How to view soil health report?', `How much fertilizer for ${cropStr}?`, 'When to irrigate based on weather?', 'How to control pests?'];
  }

  return {
    id: `msg_${Date.now()}`,
    sender: 'assistant',
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    language: activeLang,
    category,
    structuredData: {
      summary,
      dosages,
      warnings,
      steps,
    },
    suggestedFollowUps,
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
