import React from 'react';

export default function Home() {
  return (
    <main>
      <header>
        <h1>🌾 ANNADATA (अन्नदाता)</h1>
        <p>"Har Kisan, Har Fasal, Har Faisla."</p>
        <span className="badge">Day 1 - Foundation Ready</span>
      </header>

      <div className="container">
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Platform Overview</h2>
          <p style={{ marginTop: '0.5rem' }}>
            Annadata is an India-focused agricultural technology platform built to empower farmers with data-driven decision making across soil health, crop recommendations, weather guidance, and market information.
          </p>
        </div>

        <h2>Monorepo Services</h2>
        <div className="grid">
          <div className="card">
            <h3>📱 Mobile App</h3>
            <p>React Native & Expo foundation tailored for Indian farmers with clean navigation and high readability.</p>
          </div>

          <div className="card">
            <h3>🌐 Web Portal</h3>
            <p>Next.js platform foundation for landing pages, admin dashboards, and agricultural expert access.</p>
          </div>

          <div className="card">
            <h3>⚙️ Backend REST API</h3>
            <p>Node.js, Express, and TypeScript API gateway connected to MongoDB database infrastructure.</p>
          </div>

          <div className="card">
            <h3>🤖 ML Service Foundation</h3>
            <p>Python & FastAPI microservice structure for future computer vision and advisory models.</p>
          </div>
        </div>
      </div>

      <footer>
        <p>© 2026 Annadata Project • Monorepo Architecture Foundation</p>
      </footer>
    </main>
  );
}
