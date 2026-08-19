# Annadata System Architecture Document

This document outlines the planned high-level technical architecture and microservices design for the **Annadata** platform (*"Har Kisan, Har Fasal, Har Faisla."*).

---

## 🏛️ High-Level System Architecture

```
                               ┌───────────────────────────┐
                               │   Farmer Mobile App       │
                               │  (React Native + Expo)    │
                               └─────────────┬─────────────┘
                                             │
                                             │ REST / WebSocket
                                             ▼
┌──────────────────────────┐   ┌───────────────────────────┐
│   Web & Admin Portal     ├──►│  Node.js + Express API    │
│       (Next.js)          │   │      Backend Gateway      │
└──────────────────────────┘   └─────────────┬─────────────┘
                                             │
                     ┌───────────────────────┼───────────────────────┐
                     │                       │                       │
                     ▼                       ▼                       ▼
          ┌────────────────────┐   ┌───────────────────┐   ┌───────────────────┐
          │   MongoDB Database │   │   AI / ML Services│   │ External APIs     │
          │    (Mongoose ORM)  │   │  (Python / FastAPI│   │ (IMD Weather,     │
          └────────────────────┘   └───────────────────┘   │ Agmarknet Mandi)  │
                                                           └───────────────────┘
```

---

## 🔄 Data & Communication Flow

1. **Client Tier**:
   - **Farmer Mobile Application (React Native / Expo)**: Primary interface for farmers offering multilingual voice/text guidance, camera capture for crop diagnostic tools, offline data caching, and simplified navigation.
   - **Web & Admin Portal (Next.js)**: Dashboard for agricultural experts, administrators, extension officers, and analytical reports.

2. **Backend API Gateway (Node.js + Express + TypeScript)**:
   - Central entry point responsible for request authentication, authorization, rate limiting, validation, request routing, and business logic execution.

3. **Persistence Layer (MongoDB)**:
   - Document-based database capturing farmer profiles, farm boundaries, soil health records, diagnostic history, and advisory logs.

4. **Machine Learning Tier (Python + FastAPI)**:
   - Dedicated asynchronous microservices performing heavy computational tasks, such as Computer Vision model inference for crop leaf disease detection, soil card OCR analysis, and recommendation pipelines.

5. **External Integrations**:
   - Integration with government weather APIs (e.g., India Meteorological Department), open market Mandi price data (Agmarknet), SMS/IVR telephony providers (Twilio/Exotel), and voice synthesis/recognition models.

---

## 🧩 Planned Future Services & Modules

The platform backend is modularly structured to evolve into distinct domain services:

| Service / Module | Responsibility |
| :--- | :--- |
| **1. Farmer Service** | Manages farmer onboarding, profile data, language preferences, location metadata, and authentication state. |
| **2. Farm Service** | Handles farm land records, soil type, irrigation sources, farm geolocation boundaries, and active crop cycles. |
| **3. Soil Health Service** | Parses and stores Soil Health Card values (NPK, pH, EC, organic carbon, micronutrients) and tracks soil health history over time. |
| **4. Crop Recommendation Service** | Computes optimal crop varieties and crop rotation suggestions based on soil health, season, agro-climatic zone, and market demand forecasts. |
| **5. Weather Service** | Ingests hyper-local weather data, rain probability, humidity, and generates proactive agricultural weather advisories. |
| **6. AI Agent Service** | Orchestrates conversational LLM agents tailored with agricultural domain knowledge and multilingual prompt engineering. |
| **7. Voice / IVR Service** | Manages speech-to-text (STT), text-to-speech (TTS), and telephony IVR interfaces for feature phone users. |
| **8. Market Information Service** | Tracks daily Mandi rates across districts, historical price trends, and buyer-seller connections. |
| **9. Expert Service** | Manages query queuing, escalation pathways, and expert advice routing for complex farm issues. |
| **10. Notification Service** | Delivers timely push notifications, SMS alerts, and WhatsApp advisories for urgent weather or pest alerts. |

---

## 🛡️ Non-Functional Requirements & Security Guidelines

- **Zero Hardcoded Secrets**: All environment variables must be managed via `.env` files and secured secret managers.
- **Multilingual Support**: Internationalization (i18n) built at core model levels supporting major Indian languages.
- **Low-Bandwidth Resilience**: Mobile app optimized to function gracefully under degraded 2G/3G connectivity.
- **Strict Data Privacy**: Protecting farmer personal information and location data in compliance with data privacy regulations.
