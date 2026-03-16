# NariCareAI – Project Documentation
## AI-Powered Early PCOS Risk Screening Platform

---

# 1. Introduction

NariCareAI is an AI-driven healthcare platform designed to assist women in **early screening and preventive management of Polycystic Ovary Syndrome (PCOS)**.

The platform combines **machine learning, explainable AI, and preventive health recommendations** to help women identify possible risk factors associated with PCOS and receive lifestyle guidance for better health management.

The system is built using **Free and Open Source Software (FOSS)** technologies to ensure accessibility, transparency, and community collaboration.

NariCareAI is designed as a **screening and awareness tool**, helping women take proactive steps toward better health.

---

# 2. Problem Statement

Polycystic Ovary Syndrome (PCOS) is one of the most common hormonal disorders affecting women of reproductive age.

Studies suggest that **approximately 1 in 5 women may suffer from PCOS**, yet a large number of cases remain **undiagnosed for years**.

### Key Challenges

**Delayed Diagnosis**
Many women ignore early symptoms such as irregular menstrual cycles, acne, or sudden weight gain.

**Limited Access to Screening Tools**
Diagnosis typically requires blood tests or ultrasound scans, which may not be easily accessible.

**Low Awareness**
Women often become aware of PCOS only after severe symptoms develop.

**Existing Applications Focus on Tracking**
Most apps only track menstrual cycles but do not provide **AI-driven early risk prediction or explainable insights.**

---

# 3. Proposed Solution

NariCareAI addresses these challenges by providing an **AI-powered risk screening platform** that analyzes health and lifestyle indicators to estimate the likelihood of PCOS.

The platform provides users with:

• A **PCOS risk score** based on machine learning analysis  
• **Explainable insights** showing contributing health factors  
• **Preventive lifestyle recommendations**

The goal is to support **early awareness and preventive health management**, not replace professional medical diagnosis.

---

# 4. Target Users

## Primary Users

• Women aged 15–40  
• Students and working professionals  
• Women experiencing symptoms such as irregular periods or hormonal imbalance

## Secondary Users

• Healthcare researchers studying PCOS  
• Public health organizations  
• Women's health communities

---

# 5. Technology Stack

The project uses modern **open-source technologies**.

## Frontend
React with TypeScript

Responsibilities:
• User interface
• Symptom input forms
• Health dashboard

## Backend
FastAPI (Python)

Responsibilities:
• API request handling
• Data validation
• Machine learning model integration

## Machine Learning Models

The system uses ensemble learning algorithms:

• XGBoost  
• Random Forest  
• Gradient Boosting

The best performing model achieved:

Accuracy: ~92.7%  
F1 Score: ~0.886  
ROC-AUC: ~0.943

## Explainable AI

SHAP (SHapley Additive Explanations) is used to explain model predictions and highlight the factors contributing to PCOS risk.

## Data Processing

Python libraries used:

• Pandas  
• NumPy  
• Scikit-learn

## Dataset

The machine learning models were trained using a **public PCOS dataset sourced from Kaggle**, used for research and educational purposes.

---

# 6. System Architecture

The platform follows a layered architecture separating user interaction, backend services, and AI prediction systems.

                ┌────────────────────────────┐
                │        User Device         │
                │  Web Browser / Mobile UI  │
                └─────────────┬─────────────┘
                              │
                              ▼
                ┌────────────────────────────┐
                │        Frontend Layer      │
                │  React + TypeScript UI    │
                │  Forms • Dashboard • UX   │
                └─────────────┬─────────────┘
                              │ REST API
                              ▼
                ┌────────────────────────────┐
                │        Backend Layer       │
                │        FastAPI Server      │
                │ Input Validation           │
                │ Feature Processing         │
                └─────────────┬─────────────┘
                              │
                ┌─────────────▼─────────────┐
                │     ML Prediction Layer    │
                │  XGBoost / Random Forest   │
                │  Gradient Boosting Model   │
                └─────────────┬─────────────┘
                              │
                              ▼
                ┌────────────────────────────┐
                │    Explainable AI Layer    │
                │      SHAP Analysis         │
                │  Feature Importance        │
                └─────────────┬─────────────┘
                              │
                              ▼
                ┌────────────────────────────┐
                │ Health Recommendation      │
                │ Diet • Exercise • Yoga     │
                │ Preventive Health Tips     │
                └─────────────┬─────────────┘
                              │
                              ▼
                ┌────────────────────────────┐
                │        Data Layer          │
                │ Kaggle PCOS Dataset        │
                │ Model Artifacts (.pkl)     │
                │ User Health Records        │
                └────────────────────────────┘

This architecture enables scalability and modular development for future improvements.

---

# 7. Current Features

## 1. AI-Based PCOS Risk Prediction

Users can enter health-related data including:

• Age  
• Weight and BMI  
• Menstrual cycle information  
• Hormonal indicators  
• Lifestyle factors  

The trained model analyzes these features and predicts the **probability of PCOS risk**.

---

## 2. Dual Screening System

NariCareAI supports two screening modes.

### Basic Screening
Uses lifestyle and symptom-based inputs to estimate early risk.

### Advanced Screening
Allows users to include clinical indicators for more accurate predictions.

---

## 3. Explainable AI Insights

The system uses SHAP to display **which features influenced the prediction**.

This improves trust and transparency in the AI model.

Example insights may include:

• Irregular menstrual cycle  
• Weight gain  
• Hormonal imbalance indicators

---

## 4. Health Risk Dashboard

The dashboard displays:

• PCOS risk score  
• Influencing health factors  
• Preventive lifestyle recommendations

---

## 5. Lifestyle Recommendations

Based on prediction results, users receive suggestions related to:

• Diet and nutrition  
• Exercise routines  
• Yoga and stress reduction  
• Preventive health practices

---

# 8. Impact and Benefits

NariCareAI contributes to women's healthcare by providing:

## Early Awareness

Women can identify potential health risks before symptoms become severe.

## Preventive Healthcare

The system promotes healthier lifestyle choices that may help manage PCOS risk factors.

## Accessible Screening

Preliminary risk analysis is possible without immediate medical tests.

## Open Source Collaboration

As an open-source platform, developers and researchers can contribute to improving the system.

---

# 9. Future Integrations

The platform can be expanded with additional features in future versions.

## Mobile Application

Develop Android and iOS versions for greater accessibility.

## Wearable Device Integration

Integrate with fitness trackers to monitor:

• Activity levels  
• Sleep patterns  
• Heart rate  

## Healthcare Provider Integration

Enable connections with healthcare professionals for consultation and diagnosis.

## Research Data Contribution

Allow users to share anonymized health data to support future research and better AI models.

## AI Health Assistant

An AI chatbot could help answer women's health questions and provide guidance.

---

# 10. Disclaimer

NariCareAI is intended for **educational and preliminary screening purposes only**.

It **does not provide medical diagnosis** and should not replace consultation with qualified healthcare professionals.

Users experiencing symptoms or health concerns should consult a licensed medical practitioner.

---

# Conclusion

NariCareAI demonstrates how **machine learning, open-source technologies, and preventive healthcare approaches** can be combined to support women's health awareness.

By enabling early screening and offering actionable health insights, the platform aims to empower women with better knowledge and control over their health.

---