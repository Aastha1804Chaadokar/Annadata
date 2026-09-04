# 📱 Annadata (अन्नदाता) Farmer Mobile Application

React Native + Expo native mobile app designed with high-contrast typography, large touch targets, multilingual translation (Hindi, Marathi, English), GPS geolocation, Soil Health Card NPK parsing, and an integrated AI voice assistant.

---

## 🚀 Features

- **🌾 Daily Farmer Dashboard**: Today's weather, crop stage alerts, and quick action tiles.
- **📍 Hyper-Local Farm GPS Geocoding**: Detect and calibrate farm plot coordinates.
- **🧪 Soil Health Card NPK Analyzer**: Visual breakdown of pH, Nitrogen, Phosphorus, Potash, and Organic Carbon with balanced fertilizer dosage.
- **🌱 Crop Recommendation Engine**: Rule-based agronomic suitability matching for Kharif, Rabi, and Zaid seasons.
- **☁️ Weather Telemetry**: 48-hour rainfall probability, humidity, and spray safety advisories.
- **🤖 AI Voice Assistant**: Multilingual voice advice for fertilizer dosages, yellowing leaf symptoms, and irrigation schedules.
- **💰 APMC Mandi Rates Tracker**: Real-time commodity benchmark rates vs government MSP.

---

## 🏃 How to Run on Your Mobile Phone

### 1. Install Expo Go on your Phone
- **Android**: Install [Expo Go from Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iPhone**: Install [Expo Go from Apple App Store](https://apps.apple.com/app/expo-go/id982107779)

### 2. Start the Development Server
From the repository root or `mobile/` directory:

```bash
# In the mobile directory
cd mobile
npx expo start
```

### 3. Open on Your Phone
- Scan the QR code displayed in your terminal using the **Expo Go** app (Android) or **Camera** (iOS).

---

## 📦 Building Standalone Android APK

To build a standalone installable Android APK file:

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Log in to your Expo account
eas login

# 3. Configure EAS build
eas build:configure

# 4. Build APK for Android
eas build -p android --profile preview
```
Once the cloud build finishes (~5 minutes), EAS will provide a direct download link for the `.apk` file to install on any Android phone.
