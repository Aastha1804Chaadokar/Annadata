# Annadata Machine Learning Service (`ml/`)

Dedicated microservice for agricultural AI and Machine Learning model inference built with **Python 3.10+** and **FastAPI**.

---

## 🔬 Service Responsibilities (Planned Future Scope)

- **Plant Disease Diagnostics**: Computer Vision model inference (leaf photo analysis).
- **Soil Health Card OCR & Analytics**: Extraction of Soil Health Card parameters.
- **Crop Recommendation Pipeline**: Machine learning algorithm based on soil composition, region, season, and rainfall.

---

## ⚙️ Local Setup & Execution

1. **Create Python Virtual Environment**
   ```bash
   python -m venv venv
   ```

2. **Activate Virtual Environment**
   - **Windows**:
     ```powershell
     .\venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Development Server**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. **Verify Endpoint**
   - Health check: `http://localhost:8000/health`
   - OpenAPI Docs: `http://localhost:8000/docs`
