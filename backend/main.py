from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Load models
advanced_model = joblib.load("models/pcos_best_model.pkl")
advanced_features = joblib.load("models/pcos_selected_features.pkl")

basic_model = joblib.load("models/pcos_basic_model.pkl")
basic_features = joblib.load("models/pcos_basic_features.pkl")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientData(BaseModel):
    data: dict


# -------------------------
# BASIC SCREENING
# -------------------------

@app.post("/predict-basic")
def predict_basic(patient: PatientData):

    patient_data = patient.data
    input_df = pd.DataFrame([patient_data])

    for feat in basic_features:
        if feat not in input_df.columns:
            input_df[feat] = 0

    input_df = input_df[basic_features]

    prob = basic_model.predict_proba(input_df)[0][1]

    return {
        "mode": "basic",
        "pcos_probability": float(prob)
    }


# -------------------------
# ADVANCED SCREENING
# -------------------------

@app.post("/predict-advanced")
def predict_advanced(patient: PatientData):

    patient_data = patient.data
    input_df = pd.DataFrame([patient_data])

    for feat in advanced_features:
        if feat not in input_df.columns:
            input_df[feat] = 0

    input_df = input_df[advanced_features]

    prediction = advanced_model.predict(input_df)[0]
    prob = advanced_model.predict_proba(input_df)[0][1]

    return {
        "mode": "advanced",
        "prediction": int(prediction),
        "pcos_probability": float(prob)
    }