import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

type ActiveTab = 'dashboard' | 'map' | 'soil' | 'crops' | 'weather' | 'ai' | 'market';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeLang, setActiveLang] = useState('hi');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState({ lat: 22.9734, lng: 75.8118, village: 'अरोड़ा गांव (Aroda)', district: 'भोपाल (Bhopal)' });
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'नमस्ते! मैं आपका अन्नदाता एआई सहायक हूँ। मक्का (Maize) फसल के लिए खाद, सिंचाई या बीमारी संबंधी प्रश्न पूछें।',
    },
  ]);

  const handleDetectGPS = () => {
    setGpsLoading(true);
    setTimeout(() => {
      setGpsCoords({
        lat: 23.2599,
        lng: 77.4126,
        village: 'अरोड़ा फार्म (Aroda Farm)',
        district: 'भोपाल, मध्य प्रदेश (Bhopal, MP)',
      });
      setGpsLoading(false);
    }, 1200);
  };

  const handleSendAi = (queryText?: string) => {
    const textToSend = queryText || aiQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user' as const, text: textToSend };
    setAiChat((prev) => [...prev, userMsg]);
    setAiQuery('');

    setTimeout(() => {
      let reply = 'आपकी फसल के लिए मृदा pH 6.8 अनुकूल है। मौसम अनुसार 25 किग्रा यूरिया प्रति एकड़ दें।';
      if (textToSend.includes('मृदा') || textToSend.includes('soil') || textToSend.includes('रिपोर्ट')) {
        reply = 'मृदा स्वास्थ्य विश्लेषण: नाइट्रोजन (260 kg/ha - मध्यम), फास्फोरस (18 kg/ha), पोटाश (290 kg/ha - पर्याप्त)।';
      } else if (textToSend.includes('सिंचाई') || textToSend.includes('water') || textToSend.includes('rain')) {
        reply = 'मौसम चेतावनी: आगामी 48 घंटों में 20% बारिश संभावना है। सामान्य हल्की सिंचाई की जा सकती है।';
      } else if (textToSend.includes('पीले') || textToSend.includes('कीट') || textToSend.includes('spray')) {
        reply = 'पत्तियां पीली होने पर 500 मिली नीम तेल (10,000 PPM) प्रति 200L पानी में घोलकर शाम को स्प्रे करें।';
      }
      setAiChat((prev) => [...prev, { sender: 'bot' as const, text: reply }]);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#173F2A" />

      {/* TOP NATIVE APP HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brandTitle}>🌾 ANNADATA</Text>
            <Text style={styles.brandSubtitle}>अन्नदाता • Har Kisan, Har Fasal</Text>
          </View>
          <View style={styles.langPicker}>
            {['hi', 'en', 'mr'].map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => setActiveLang(lang)}
                style={[styles.langBtn, activeLang === lang && styles.langBtnActive]}
              >
                <Text style={[styles.langText, activeLang === lang && styles.langTextActive]}>
                  {lang === 'hi' ? 'हिन्दी' : lang === 'mr' ? 'मराठी' : 'EN'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Farmer Info Strip */}
        <View style={styles.farmerStrip}>
          <View style={styles.farmerBadge}>
            <Text style={styles.farmerName}>👤 Minty (किसान)</Text>
            <Text style={styles.farmerLoc}>📍 {gpsCoords.village}, {gpsCoords.district}</Text>
          </View>
          <View style={styles.cropBadge}>
            <Text style={styles.cropBadgeText}>🌱 मक्का (12 एकड़)</Text>
          </View>
        </View>
      </View>

      {/* MAIN CONTENT AREA BY TAB */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <View style={styles.tabContent}>
            {/* Morning Greeting */}
            <View style={styles.cardPrimary}>
              <Text style={styles.cardPrimaryBadge}>आज की कृषि स्थिति • TODAY</Text>
              <Text style={styles.cardPrimaryTitle}>सुप्रभात, अन्नदाता!</Text>
              <Text style={styles.cardPrimaryText}>
                मौसम साफ है (28°C) • मिट्टी में पर्याप्त नमी • मक्का वृद्धि चरण
              </Text>
            </View>

            {/* Quick 4-Grid Dashboard Metrics */}
            <View style={styles.grid2x2}>
              <TouchableOpacity style={styles.metricCard} onPress={() => setActiveTab('soil')}>
                <Text style={styles.metricIcon}>🧪</Text>
                <Text style={styles.metricTitle}>मृदा स्वास्थ्य (Soil)</Text>
                <Text style={styles.metricValue}>pH 6.8 (उत्तम)</Text>
                <Text style={styles.metricSub}>नाइट्रोजन: मध्यम</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.metricCard} onPress={() => setActiveTab('weather')}>
                <Text style={styles.metricIcon}>☁️</Text>
                <Text style={styles.metricTitle}>मौसम (Weather)</Text>
                <Text style={styles.metricValue}>28°C • धूप</Text>
                <Text style={styles.metricSub}>बारिश: 20%</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.metricCard} onPress={() => setActiveTab('crops')}>
                <Text style={styles.metricIcon}>🌾</Text>
                <Text style={styles.metricTitle}>फसल चयन (Crops)</Text>
                <Text style={styles.metricValue}>गेहूँ / चना</Text>
                <Text style={styles.metricSub}>94% उपयुक्तता</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.metricCard} onPress={() => setActiveTab('market')}>
                <Text style={styles.metricIcon}>💰</Text>
                <Text style={styles.metricTitle}>मंडी भाव (Mandi)</Text>
                <Text style={styles.metricValue}>₹ 2,450/q</Text>
                <Text style={styles.metricSub}>गेहूँ (MSP ₹ 2,275)</Text>
              </TouchableOpacity>
            </View>

            {/* AI Assistant Quick Banner */}
            <TouchableOpacity style={styles.aiBanner} onPress={() => setActiveTab('ai')}>
              <View style={styles.aiBannerLeft}>
                <Text style={styles.aiBannerIcon}>🤖</Text>
                <View>
                  <Text style={styles.aiBannerTitle}>अन्नदाता AI से पूछें</Text>
                  <Text style={styles.aiBannerSub}>खाद, बीमारी व मौसम की तत्काल जानकारी</Text>
                </View>
              </View>
              <Text style={styles.aiBannerArrow}>→</Text>
            </TouchableOpacity>

            {/* GPS Farm Location Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardHeaderTitle}>📍 खेत का जीपीएस स्थान</Text>
                <TouchableOpacity onPress={handleDetectGPS} style={styles.btnSmallAccent}>
                  <Text style={styles.btnSmallAccentText}>{gpsLoading ? 'जांच...' : 'GPS रिफ्रेश'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardBodyText}>
                अक्षांश: {gpsCoords.lat.toFixed(4)}° N • देशांतर: {gpsCoords.lng.toFixed(4)}° E
              </Text>
              <Text style={styles.cardSubText}>
                क्षेत्र: {gpsCoords.village}, {gpsCoords.district} (मालवा एग्रो-क्लाइमैटिक जोन)
              </Text>
            </View>
          </View>
        )}

        {/* TAB 2: FARM MAP */}
        {activeTab === 'map' && (
          <View style={styles.tabContent}>
            <View style={styles.cardPrimary}>
              <Text style={styles.cardPrimaryBadge}>HYPER-LOCAL GEOCODING</Text>
              <Text style={styles.cardPrimaryTitle}>Farm GPS Coordinates</Text>
              <Text style={styles.cardPrimaryText}>
                Accurately pinpoint plot boundaries and calibrate agro-climatic subzones.
              </Text>
            </View>

            <View style={styles.mapMockBox}>
              <Text style={styles.mapPinIcon}>📍</Text>
              <Text style={styles.mapCoordsText}>{gpsCoords.lat}° N, {gpsCoords.lng}° E</Text>
              <Text style={styles.mapSubText}>Plot Area: 12.0 Acres • Satellite Calibrated</Text>
              <TouchableOpacity style={styles.btnPrimary} onPress={handleDetectGPS}>
                <Text style={styles.btnPrimaryText}>{gpsLoading ? 'Detecting GPS...' : '📍 Update My GPS Location'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Farm Details</Text>
              <Text style={styles.cardBodyText}>• Village: {gpsCoords.village}</Text>
              <Text style={styles.cardBodyText}>• District: {gpsCoords.district}</Text>
              <Text style={styles.cardBodyText}>• Irrigation: Canal & Tube-well</Text>
              <Text style={styles.cardBodyText}>• Soil Type: Deep Black Cotton Soil</Text>
            </View>
          </View>
        )}

        {/* TAB 3: SOIL HEALTH */}
        {activeTab === 'soil' && (
          <View style={styles.tabContent}>
            <View style={styles.cardPrimary}>
              <Text style={styles.cardPrimaryBadge}>SOIL HEALTH CARD DATA</Text>
              <Text style={styles.cardPrimaryTitle}>मृदा परीक्षण रिपोर्ट (Soil Card)</Text>
              <Text style={styles.cardPrimaryText}>
                लैब प्रमाणित पोषक तत्व स्तर एवं संतुलित खाद परामर्श।
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>प्रमुख रासायनिक मापदंड (Nutrients)</Text>
              
              <View style={styles.soilRow}>
                <Text style={styles.soilLabel}>मृदा pH</Text>
                <Text style={styles.soilVal}>6.8</Text>
                <Text style={styles.soilStatusGreen}>उत्तम (Neutral)</Text>
              </View>

              <View style={styles.soilRow}>
                <Text style={styles.soilLabel}>उपलब्ध नाइट्रोजन (N)</Text>
                <Text style={styles.soilVal}>260 kg/ha</Text>
                <Text style={styles.soilStatusYellow}>मध्यम (Medium)</Text>
              </View>

              <View style={styles.soilRow}>
                <Text style={styles.soilLabel}>उपलब्ध फास्फोरस (P)</Text>
                <Text style={styles.soilVal}>18 kg/ha</Text>
                <Text style={styles.soilStatusYellow}>मध्यम (Medium)</Text>
              </View>

              <View style={styles.soilRow}>
                <Text style={styles.soilLabel}>उपलब्ध पोटाश (K)</Text>
                <Text style={styles.soilVal}>290 kg/ha</Text>
                <Text style={styles.soilStatusGreen}>पर्याप्त (High)</Text>
              </View>

              <View style={styles.soilRow}>
                <Text style={styles.soilLabel}>ऑर्गेनिक कार्बन (OC)</Text>
                <Text style={styles.soilVal}>0.62 %</Text>
                <Text style={styles.soilStatusYellow}>संतुलित</Text>
              </View>
            </View>

            <View style={styles.cardNotice}>
              <Text style={styles.noticeTitle}>🛡️ वैज्ञानिक प्रमाणिकता</Text>
              <Text style={styles.noticeText}>
                सॉइल हेल्थ कार्ड की लैब जांच के आधार पर ही यूरिया और डीएपी की मात्रा निर्धारित करें।
              </Text>
            </View>
          </View>
        )}

        {/* TAB 4: CROPS */}
        {activeTab === 'crops' && (
          <View style={styles.tabContent}>
            <View style={styles.cardPrimary}>
              <Text style={styles.cardPrimaryBadge}>AGRONOMIC SUITABILITY</Text>
              <Text style={styles.cardPrimaryTitle}>फसल सिफारिशें (Crop Matches)</Text>
              <Text style={styles.cardPrimaryText}>
                मिट्टी, सिंचाई एवं मौसम अनुसार अनुकूलित फसलें।
              </Text>
            </View>

            {/* Crop Recommendation Cards */}
            <View style={styles.cropCard}>
              <View style={styles.cropCardHeader}>
                <View>
                  <Text style={styles.cropName}>शरबती गेहूँ (Sharbati Wheat)</Text>
                  <Text style={styles.cropSeason}>रबी सीजन • काली दोमट मिट्टी</Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>94%</Text>
                </View>
              </View>
              <Text style={styles.cropReason}>• पोटाश का स्तर दानों के भराव हेतु उत्तम</Text>
              <Text style={styles.cropReason}>• मंडी मांग एवं सरकारी एमएसपी सुरक्षित</Text>
            </View>

            <View style={styles.cropCard}>
              <View style={styles.cropCardHeader}>
                <View>
                  <Text style={styles.cropName}>देशी चना / ग्राम (Gram/Chickpea)</Text>
                  <Text style={styles.cropSeason}>रबी सीजन • कम पानी की आवश्यकता</Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>91%</Text>
                </View>
              </View>
              <Text style={styles.cropReason}>• मिट्टी में नाइट्रोजन स्थिरीकरण (रिफ्रेश)</Text>
              <Text style={styles.cropReason}>• मक्का के बाद फसल चक्र हेतु सर्वोत्तम</Text>
            </View>

            <View style={styles.cropCard}>
              <View style={styles.cropCardHeader}>
                <View>
                  <Text style={styles.cropName}>पीला सरसों (Mustard)</Text>
                  <Text style={styles.cropSeason}>रबी सीजन • उच्च तेल प्रतिशत</Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>86%</Text>
                </View>
              </View>
              <Text style={styles.cropReason}>• पाला सहनशील एवं कम लागत</Text>
            </View>
          </View>
        )}

        {/* TAB 5: WEATHER */}
        {activeTab === 'weather' && (
          <View style={styles.tabContent}>
            <View style={styles.cardPrimary}>
              <Text style={styles.cardPrimaryBadge}>MICRO-CLIMATE TELEMETRY</Text>
              <Text style={styles.cardPrimaryTitle}>खेत मौसम पूर्वानुमान (Weather)</Text>
              <Text style={styles.cardPrimaryText}>
                Open-Meteo उपग्रह आधारित 7-दिवसीय कृषि पूर्वानुमान।
              </Text>
            </View>

            <View style={styles.weatherHeroCard}>
              <Text style={styles.weatherTemp}>28°C</Text>
              <Text style={styles.weatherCondition}>☀️ साफ मौसम (Clear Sky)</Text>
              <Text style={styles.weatherDetails}>
                हवा: 11 km/h • नमी: 58% • वर्षा संभावना: 20%
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>कृषि परामर्श (Advisories)</Text>
              <View style={styles.advisoryItem}>
                <Text style={styles.advisoryIcon}>💧</Text>
                <View style={styles.advisoryTextCol}>
                  <Text style={styles.advisoryHead}>सिंचाई सलाह</Text>
                  <Text style={styles.advisoryBody}>वर्तमान में बारिश कम है। खेत में हल्की सिंचाई कर सकते हैं।</Text>
                </View>
              </View>

              <View style={styles.advisoryItem}>
                <Text style={styles.advisoryIcon}>💨</Text>
                <View style={styles.advisoryTextCol}>
                  <Text style={styles.advisoryHead}>छिड़काव सलाह</Text>
                  <Text style={styles.advisoryBody}>हवा की गति 11 km/h है। कीटनाशक स्प्रे के लिए मौसम अनुकूल है।</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* TAB 6: AI ASSISTANT */}
        {activeTab === 'ai' && (
          <View style={styles.tabContent}>
            <View style={styles.cardPrimary}>
              <Text style={styles.cardPrimaryBadge}>MULTILINGUAL AI CHAT</Text>
              <Text style={styles.cardPrimaryTitle}>अन्नदाता AI कृषि सहायक</Text>
              <Text style={styles.cardPrimaryText}>
                अपनी भाषा में खाद, सिंचाई, कीट व मंडी संबंधी कोई भी सवाल पूछें।
              </Text>
            </View>

            {/* Quick Prompt Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
              {[
                'मृदा स्वास्थ्य रिपोर्ट कैसे देखें?',
                'मक्का में खाद की सही मात्रा?',
                'सिंचाई कब करें?',
                'पत्ते पीले क्यों हो रहे हैं?',
              ].map((chip, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.chipBtn}
                  onPress={() => handleSendAi(chip)}
                >
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Chat Log */}
            <View style={styles.chatBox}>
              {aiChat.map((msg, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.chatBubble,
                    msg.sender === 'user' ? styles.chatBubbleUser : styles.chatBubbleBot,
                  ]}
                >
                  <Text
                    style={[
                      styles.chatText,
                      msg.sender === 'user' ? styles.chatTextUser : styles.chatTextBot,
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              ))}
            </View>

            {/* Input Bar */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="यहाँ सवाल लिखें (उदा. खाद, सिंचाई)..."
                placeholderTextColor="#889988"
                value={aiQuery}
                onChangeText={setAiQuery}
              />
              <TouchableOpacity style={styles.btnSend} onPress={() => handleSendAi()}>
                <Text style={styles.btnSendText}>पूछें</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 7: MANDI MARKET */}
        {activeTab === 'market' && (
          <View style={styles.tabContent}>
            <View style={styles.cardPrimary}>
              <Text style={styles.cardPrimaryBadge}>APMC MANDI RATES</Text>
              <Text style={styles.cardPrimaryTitle}>मंडी भाव एवं रुझान (Market)</Text>
              <Text style={styles.cardPrimaryText}>
                भोपाल एवं निकटवर्ती मंडियों के ताज़ा न्यूनतम व अधिकतम भाव।
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>प्रमुख जिंस भाव (Bhopal Mandi)</Text>

              <View style={styles.mandiItem}>
                <View>
                  <Text style={styles.mandiCrop}>गेहूँ (Wheat - Sharbati)</Text>
                  <Text style={styles.mandiSub}>सरकारी एमएसपी: ₹ 2,275 / q</Text>
                </View>
                <Text style={styles.mandiPrice}>₹ 2,450 - 2,820</Text>
              </View>

              <View style={styles.mandiItem}>
                <View>
                  <Text style={styles.mandiCrop}>सोयाबीन (Soybean - Yellow)</Text>
                  <Text style={styles.mandiSub}>सरकारी एमएसपी: ₹ 4,892 / q</Text>
                </View>
                <Text style={styles.mandiPrice}>₹ 4,300 - 4,850</Text>
              </View>

              <View style={styles.mandiItem}>
                <View>
                  <Text style={styles.mandiCrop}>मक्का (Maize / Corn)</Text>
                  <Text style={styles.mandiSub}>मांग: स्थिर</Text>
                </View>
                <Text style={styles.mandiPrice}>₹ 2,150 - 2,400</Text>
              </View>

              <View style={styles.mandiItem}>
                <View>
                  <Text style={styles.mandiCrop}>चना (Gram / Chickpea)</Text>
                  <Text style={styles.mandiSub}>मांग: उच्च</Text>
                </View>
                <Text style={styles.mandiPrice}>₹ 5,800 - 6,350</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* BOTTOM NATIVE TAB NAVIGATION BAR */}
      <View style={styles.tabBar}>
        {[
          { id: 'dashboard' as const, label: 'होम', icon: '🏠' },
          { id: 'soil' as const, label: 'मिट्टी', icon: '🧪' },
          { id: 'crops' as const, label: 'फसल', icon: '🌾' },
          { id: 'weather' as const, label: 'मौसम', icon: '☁️' },
          { id: 'ai' as const, label: 'AI सहायक', icon: '🤖' },
          { id: 'market' as const, label: 'मंडी', icon: '💰' },
          { id: 'map' as const, label: 'नक्शा', icon: '🗺️' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF3',
  },
  header: {
    backgroundColor: '#173F2A',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    color: '#D8B45A',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  langPicker: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 3,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  langBtnActive: {
    backgroundColor: '#D8B45A',
  },
  langText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  langTextActive: {
    color: '#173F2A',
  },
  farmerStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  farmerBadge: {
    flex: 1,
  },
  farmerName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  farmerLoc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    marginTop: 1,
  },
  cropBadge: {
    backgroundColor: '#EEF5E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cropBadgeText: {
    color: '#173F2A',
    fontSize: 11,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
  },
  tabContent: {
    gap: 14,
  },
  cardPrimary: {
    backgroundColor: '#173F2A',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPrimaryBadge: {
    color: '#D8B45A',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardPrimaryTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  cardPrimaryText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    lineHeight: 18,
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: (width - 42) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3EADF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  metricIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  metricTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5F6F62',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#173F2A',
    marginBottom: 2,
  },
  metricSub: {
    fontSize: 10,
    color: '#3F7D3A',
    fontWeight: '700',
  },
  aiBanner: {
    backgroundColor: '#FAF7EE',
    borderWidth: 1,
    borderColor: 'rgba(216,180,90,0.4)',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  aiBannerIcon: {
    fontSize: 24,
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#173F2A',
  },
  aiBannerSub: {
    fontSize: 10,
    color: '#5F6F62',
    marginTop: 1,
  },
  aiBannerArrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#173F2A',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3EADF',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#173F2A',
    marginBottom: 8,
  },
  cardBodyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#20251F',
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 11,
    color: '#5F6F62',
    lineHeight: 16,
  },
  btnSmallAccent: {
    backgroundColor: '#D8B45A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  btnSmallAccentText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#172018',
  },
  mapMockBox: {
    backgroundColor: '#EEF5E8',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCECCF',
    marginVertical: 4,
  },
  mapPinIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  mapCoordsText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#173F2A',
  },
  mapSubText: {
    fontSize: 11,
    color: '#3F7D3A',
    fontWeight: '700',
    marginVertical: 8,
  },
  btnPrimary: {
    backgroundColor: '#173F2A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  soilRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4EC',
  },
  soilLabel: {
    fontSize: 12,
    color: '#354038',
    flex: 1,
    fontWeight: '600',
  },
  soilVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#172018',
    marginRight: 10,
  },
  soilStatusGreen: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  soilStatusYellow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardNotice: {
    backgroundColor: '#FFF8E8',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(216,180,90,0.3)',
  },
  noticeTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9A7048',
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 10,
    color: '#5F6F62',
    lineHeight: 14,
  },
  cropCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3EADF',
    marginBottom: 4,
  },
  cropCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#173F2A',
  },
  cropSeason: {
    fontSize: 10,
    color: '#5F6F62',
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: '#EEF5E8',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#3F7D3A',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#173F2A',
  },
  cropReason: {
    fontSize: 11,
    color: '#3F7D3A',
    lineHeight: 16,
  },
  weatherHeroCard: {
    backgroundColor: '#EEF5E8',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCECCF',
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: '900',
    color: '#173F2A',
  },
  weatherCondition: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3F7D3A',
    marginVertical: 4,
  },
  weatherDetails: {
    fontSize: 11,
    color: '#5F6F62',
  },
  advisoryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginVertical: 6,
  },
  advisoryIcon: {
    fontSize: 20,
  },
  advisoryTextCol: {
    flex: 1,
  },
  advisoryHead: {
    fontSize: 12,
    fontWeight: '800',
    color: '#173F2A',
  },
  advisoryBody: {
    fontSize: 11,
    color: '#5F6F62',
    lineHeight: 15,
  },
  chipsRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  chipBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E3EADF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipText: {
    fontSize: 11,
    color: '#173F2A',
    fontWeight: '700',
  },
  chatBox: {
    minHeight: 180,
    maxHeight: 240,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3EADF',
    marginVertical: 6,
  },
  chatBubble: {
    padding: 10,
    borderRadius: 14,
    marginVertical: 4,
    maxWidth: '85%',
  },
  chatBubbleUser: {
    backgroundColor: '#173F2A',
    alignSelf: 'flex-end',
  },
  chatBubbleBot: {
    backgroundColor: '#EEF5E8',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#DCECCF',
  },
  chatText: {
    fontSize: 12,
    lineHeight: 16,
  },
  chatTextUser: {
    color: '#ffffff',
    fontWeight: '600',
  },
  chatTextBot: {
    color: '#172018',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#D7E4D1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 12,
    color: '#173F2A',
  },
  btnSend: {
    backgroundColor: '#173F2A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  btnSendText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  mandiItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4EC',
  },
  mandiCrop: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173F2A',
  },
  mandiSub: {
    fontSize: 10,
    color: '#667267',
    marginTop: 2,
  },
  mandiPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#b45309',
  },
  bottomSpacer: {
    height: 80,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E3EADF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 6,
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#173F2A',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#667267',
  },
  tabLabelActive: {
    color: '#173F2A',
    fontWeight: '900',
  },
});
