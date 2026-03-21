from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
import requests
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

app = FastAPI(title="MigraineGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model paths
model_path = 'app/models/saved/migraine_model.pkl'
scaler_path = 'app/models/saved/scaler.pkl'
features_path = 'app/models/saved/feature_columns.pkl'

# Load model and scaler
try:
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    feature_columns = joblib.load(features_path)
    print("✅ Model loaded successfully!")
    print(f"📊 Features: {', '.join(feature_columns)}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None
    scaler = None
    feature_columns = None

class PredictionInput(BaseModel):
    sleep_hours: float
    stress_level: float
    activity_level: float
    screen_time: float
    temperature: float
    humidity: float
    pressure: float
    air_quality: float
    caffeine_intake: float
    water_intake: float
    meals_skipped: int

class WeatherInput(BaseModel):
    city: str = "London"

class PredictionResult(BaseModel):
    risk_score: float
    risk_level: str
    confidence: float
    feature_importance: dict

@app.get("/")
async def root():
    return {
        "message": "MigraineGuard API is running",
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.post("/predict")
async def predict(data: PredictionInput):
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Prepare features
        features = np.array([[
            data.sleep_hours,
            data.stress_level,
            data.activity_level,
            data.screen_time,
            data.temperature,
            data.humidity,
            data.pressure,
            data.air_quality,
            data.caffeine_intake,
            data.water_intake,
            data.meals_skipped
        ]])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Make prediction
        probability = model.predict_proba(features_scaled)[0][1]
        prediction = model.predict(features_scaled)[0]
        
        risk_score = float(probability * 100)
        
        if risk_score < 30:
            risk_level = "Low"
        elif risk_score < 70:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        # Feature importance
        global_importance = model.feature_importances_
        contributions = []
        feature_names = ['sleep_hours', 'stress_level', 'activity_level', 'screen_time',
                         'temperature', 'humidity', 'pressure', 'air_quality',
                         'caffeine_intake', 'water_intake', 'meals_skipped']
        
        for i, name in enumerate(feature_names):
            contrib = global_importance[i] * abs(features_scaled[0][i])
            contributions.append((name, contrib))
        
        contributions.sort(key=lambda x: -abs(x[1]))
        top_contributors = contributions[:3]
        
        return {
            "risk_score": round(risk_score, 1),
            "risk_level": risk_level,
            "confidence": round(probability, 2),
            "feature_importance": {
                "global": {name: round(imp, 3) for name, imp in zip(feature_names, global_importance)},
                "top_contributors": [{"feature": f, "impact": round(c, 3)} for f, c in top_contributors]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/weather")
async def get_weather(data: WeatherInput):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    
    # Return mock data if no API key (for testing)
    if not api_key:
        return {
            "temperature": 22.5,
            "humidity": 65,
            "pressure": 1013,
            "city": data.city,
            "mock": True,
            "message": "Using mock weather data. Add OPENWEATHER_API_KEY to .env file for real data."
        }
    
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={data.city}&appid={api_key}&units=metric"
        response = requests.get(url)
        response.raise_for_status()
        weather_data = response.json()
        
        return {
            "temperature": weather_data["main"]["temp"],
            "humidity": weather_data["main"]["humidity"],
            "pressure": weather_data["main"]["pressure"],
            "city": data.city,
            "description": weather_data["weather"][0]["description"]
        }
    except Exception as e:
        # Return mock data on error
        return {
            "temperature": 22.5,
            "humidity": 65,
            "pressure": 1013,
            "city": data.city,
            "error": str(e),
            "mock": True
        }

@app.get("/feature-importance")
async def get_feature_importance():
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    feature_names = ['sleep_hours', 'stress_level', 'activity_level', 'screen_time',
                     'temperature', 'humidity', 'pressure', 'air_quality',
                     'caffeine_intake', 'water_intake', 'meals_skipped']
    
    importance = model.feature_importances_
    return {
        "features": [{"name": name, "importance": round(imp, 3)} for name, imp in zip(feature_names, importance)]
    }
    