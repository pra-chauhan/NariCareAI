from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


# Load model and selected features
model = joblib.load("models/pcos_best_model.pkl")
selected_features = joblib.load("models/pcos_selected_features.pkl")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data structure expected from frontend
class PatientData(BaseModel):
    data: dict


@app.post("/predict")
def predict_pcos(patient: PatientData):

    patient_data = patient.data

    # convert to dataframe
    input_df = pd.DataFrame([patient_data])

    # ensure all required features exist
    for feat in selected_features:
        if feat not in input_df.columns:
            input_df[feat] = 0  

    input_df = input_df[selected_features]

    # prediction
    prediction = model.predict(input_df)[0]
    prediction_proba = model.predict_proba(input_df)[0]

    return {
        "prediction": int(prediction),
        "pcos_probability": float(prediction_proba[1]),
        "no_pcos_probability": float(prediction_proba[0])
    }