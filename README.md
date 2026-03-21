Current working prototype video link - https://drive.google.com/file/d/1mrKkBeaq9cZV366pLbz6snwF7Gzo3lGY/view?usp=sharing


# 🌸 NariCareAI – AI Powered Early PCOS Risk Screening Platform

NariCareAI is an **AI-driven early PCOS risk screening platform** designed to help women detect potential Polycystic Ovary Syndrome (PCOS) risks and take preventive action through lifestyle guidance.

The project aims to improve **women's health awareness, early screening, and preventive care** using machine learning and open-source technologies.

---

# 🚨 Problem

Polycystic Ovary Syndrome (PCOS) affects **nearly 1 in 5 women worldwide**, yet many cases remain **undiagnosed for years**.

Common challenges include:

- Lack of awareness about early symptoms
- Delayed diagnosis due to expensive medical tests
- Limited access to preventive health tools
- Existing applications mostly focus on **period tracking rather than early AI-based risk screening**

Early detection and lifestyle intervention can significantly improve long-term health outcomes.

---

# 💡 Solution

**NariCareAI** provides an **AI-powered screening system** that allows women to assess their potential PCOS risk and receive actionable lifestyle recommendations.

The platform analyzes health indicators and symptoms using **machine learning models** to generate a **PCOS risk score**, explain the factors influencing the prediction, and provide preventive health insights.

---

# ✨ Key Features

- 🔍 **AI-Based PCOS Risk Prediction**  
  Predicts the likelihood of PCOS using machine learning models.

- 🧠 **Dual Screening System**  
  - Basic screening using lifestyle and symptom inputs  
  - Advanced screening using clinical indicators

- 📊 **Explainable AI Insights**  
  SHAP analysis explains the factors contributing to prediction results.

- **Diet Generation**
  Based on the health output of the user. LLM based diet generation by considering pcos friendly foods.

- 🩺**Doctor Consultation** - telecommunication.
  User can show the report to doctor so far they have done on the app and doctor can read that.

- 🩺 **Health Dashboard**  
  Displays risk scores, contributing health factors, and health indicators.

- 🧘 **Lifestyle Recommendations**  
  Personalized suggestions including diet, exercise, yoga, and preventive health practices.

---

# 🏗 System Architecture

User (Web / Mobile Browser)
          │
          ▼
Frontend Layer (React + TypeScript)
UI Forms • Dashboard • Risk Report
          │
          ▼
API Layer (FastAPI Backend)
Authentication • Input Validation • API Gateway
          │
          ▼
AI Prediction Engine
(XGBoost / Random Forest / Gradient Boosting)
          │
          ▼
Explainable AI Layer
(SHAP Feature Importance)
          │
          ▼
Health Recommendation Engine
Diet Plan • Exercise • Lifestyle Suggestions
          │
          ▼
Data Layer
User Data • Model Files • Health Dataset


---

# ⚙️ Tech Stack

## Frontend
- React (TypeScript)

## Backend
- FastAPI

## Machine Learning
- XGBoost
- Random Forest
- Gradient Boosting

## Explainable AI
- SHAP (SHapley Additive Explanations)

## Data Processing
- Python
- Pandas
- NumPy
- Scikit-learn

---

# 📂 Dataset

The machine learning models were trained using a **publicly available PCOS dataset sourced from Kaggle**.

The dataset is used strictly for **research, educational, and prototype development purposes**.

---

# 🚀 Installation & Setup

Clone the repository:

```bash
git clone https://github.com/yourusername/NariCareAI.git
cd NariCareAI
```
# Backend Setup
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
# Backend will run on:
http://127.0.0.1:8000

# Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
# Frontend will run on:
http://localhost:5173

### 🤝 Contributing
We welcome contributions from developers, researchers, and healthcare enthusiasts who are passionate about improving women's health through technology.

# Ways to contribute:
Improve machine learning models
Enhance UI/UX
Add new health features
Improve documentation
Optimize performance

# Steps to contribute
Fork the repository
Create a new branch
`git checkout -b feature/your-feature-name`
Commit your changes
`git commit -m "Added new feature"`
Push to your fork
`git push origin feature/your-feature-name`
Create a Pull Request

### 🌍 Open Source Vision
NariCareAI is designed as an open-source women's health initiative.
Our goal is to encourage collaboration between:
Developers
Data scientists
Healthcare researchers
Women’s health advocates

Together we can build better, accessible digital health tools for women worldwide.

### 🛣 Future Integrations.
Future improvements planned:
🩺 After teleconsultaion with doctor - based on the meeting we  can provide a user-friendly languae summary. 
⌚ Wearable device integration
🤖 AI health assistant chatbot
📊 Advanced health analytics dashboard
🧬 Improved PCOS detection models
🌐 Multi-language support for global accessibility
📱 Mobile application (Android & iOS)

### ⚠️ Disclaimer
NariCareAI is intended for educational and preliminary screening purposes only.
This project does not provide medical diagnosis and should not replace consultation with qualified healthcare professionals.
Users experiencing symptoms should seek advice from a licensed healthcare provider.

### 👩‍💻 Author
Pragya
B.Tech Computer Science Student
Women in Tech Hackathon Participant

### ⭐ Support the Project
If you find this project useful, please consider:
⭐ Starring the repository
🍴 Forking the project
🤝 Contributing to development

Together we can build better AI-powered healthcare tools for women.