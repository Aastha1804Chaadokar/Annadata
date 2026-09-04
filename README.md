# Annadata (अन्नदाता)

> **"Har Kisan, Har Fasal, Har Faisla."**

---

## 🌾 Project Description

**Annadata** is an India-focused agricultural technology platform built to empower farmers with timely, actionable, data-driven decisions throughout the farming lifecycle. By combining soil health intelligence, weather-based agricultural guidance, crop disease diagnostics, local market pricing, and intuitive Indian-language voice and text interactions, Annadata bridges the gap between modern agricultural science and ground-level farming practices.

---

## 🔭 Vision

To become the most trusted digital companion for every Indian farmer by democratizing access to agricultural expertise, intelligent crop advisory, and market transparency—regardless of language, technology literacy, or phone hardware.

---

## 🚀 Planned Major Features

1. **Soil Health & Soil Health Card Analysis**: Automated parsing of Soil Health Card parameters (N, P, K, pH, micronutrients) with customized soil management plans.
2. **Crop Recommendation**: Intelligent crop selection models based on soil composition, region, season, water availability, and historical market trends.
3. **Weather-Based Agricultural Guidance**: Real-time localized weather alerts, rain forecasts, and actionable advisory for irrigation, sowing, and harvesting.
4. **Crop Image & Disease Diagnostics**: Computer-vision powered plant disease detection from leaf photographs with recommended organic and chemical treatments.
5. **AI Agricultural Assistant**: Multilingual AI conversational agent tuned for agricultural advice and Indian farming contexts.
6. **Indian-Language Text & Voice Interaction**: Full support for voice inputs and text in regional Indian languages (Hindi, Marathi, Punjabi, Gujarati, Telugu, Tamil, Kannada, etc.).
7. **Keypad-Phone & IVR Access**: Interactive Voice Response (IVR) and SMS support ensuring accessibility for farmers using feature/keypad phones.
8. **Market Information & Mandi Rates**: Real-time commodity price tracking across government and local mandis with price trend forecasts.
9. **Expert Assistance**: Escalation pathway connecting farmers with agricultural scientists and local extension officers for complex queries.
10. **Smart Notifications**: Proactive alerts for weather changes, pest outbreaks, fertilizer application windows, and mandi rate spikes.

---

## 🚀 Quick Deployment

- **Backend (Render)**: Deploy via Render Blueprint [`render.yaml`](./render.yaml) or Web Service.
- **Frontend (Vercel)**: Import repository and deploy Next.js frontend with 1 click.
- 📖 **Full Step-by-Step Guide**: Read the [Deployment Guide (DEPLOYMENT.md)](./DEPLOYMENT.md).

---

## 🛠️ Technology Stack

| Service | Technology | Description |
| :--- | :--- | :--- |
| **Mobile App** | React Native, Expo, TypeScript | Mobile application designed for farmers with high readability and large touch targets |
| **Web Portal** | Next.js (App Router), React, TypeScript | Web portal for landing page, future admin dashboard, and expert assistance |
| **Backend API** | Node.js, Express, TypeScript | High-performance RESTful API gateway and core microservices orchestrator |
| **Database** | MongoDB, Mongoose | Flexible document database for farmer profiles, soil cards, crops, and logs |
| **ML Services** | Python, FastAPI | Dedicated microservices for soil analysis, disease detection, and crop recommendation models |

---

## 📍 Current Development Status

**Status: Day 1 - Foundation**

Today's focus is establishing a clean, modular, scalable monorepo structure. No domain-specific feature APIs, mock data, or AI models are implemented on Day 1.

---

## 📁 Project Structure

```
Annadata/
├── mobile/       # React Native + Expo farmer mobile app (TypeScript)
├── web/          # Next.js web application and future admin/expert portal (TypeScript)
├── backend/      # Node.js + Express REST API (TypeScript + MongoDB/Mongoose)
├── ml/           # Python / FastAPI machine learning services foundation
├── docs/         # Product and technical architecture documentation
│   └── ARCHITECTURE.md
├── .gitignore    # Root Git ignore rule set
├── README.md     # Project documentation
└── package.json  # Root package file with npm workspace configuration
```

---

## ⚡ Basic Setup Instructions

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Python**: v3.10 or higher (for `ml/` service)
- **MongoDB**: Local instance or MongoDB Atlas connection string

### Quickstart

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Aastha1804Chaadokar/Annadata.git
   cd Annadata
   ```

2. **Install Workspace Dependencies**
   ```bash
   npm install
   ```

3. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   npm run dev
   ```
   *Health Check endpoint available at `http://localhost:5000/api/v1/health`*

4. **Web Setup**
   ```bash
   cd ../web
   cp .env.example .env
   npm run dev
   ```
   *Web application accessible at `http://localhost:3000`*

5. **Mobile Setup**
   ```bash
   cd ../mobile
   cp .env.example .env
   npm run start
   ```

6. **ML Service Setup**
   ```bash
   cd ../ml
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   # source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```
   *ML Health Check accessible at `http://localhost:8000/health`*

---

## 🗺️ Future Roadmap

- **Phase 1 (Foundation)**: Core infrastructure, authentication, profile management, and database schema modeling.
- **Phase 2 (Core Advisory)**: Weather integration, Soil Health Card digitizer, and basic crop advisory.
- **Phase 3 (AI & ML)**: FastAPI integration for image-based disease diagnostic models and AI assistant.
- **Phase 4 (Market & Voice)**: Real-time Mandi price feeds, voice UI integration, and IVR fallback gateway.
- **Phase 5 (Expert Ecosystem)**: Farmer-expert connect portal and community platform.

---

## 📜 License

This project is licensed under the MIT License.
