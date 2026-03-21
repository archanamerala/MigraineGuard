from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="MigraineGuard API")

# CORS middleware
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

# Load model and scaler
model = None
scaler = None
feature_names = ['sleep_hours', 'stress_level', 'activity_level', 'screen_time',
                 'temperature', 'humidity', 'pressure', 'air_quality',
                 'caffeine_intake', 'water_intake', 'meals_skipped']

try:
    if os.path.exists(model_path) and os.path.exists(scaler_path):
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        print("✅ Model loaded successfully!")
        print(f"📊 Features: {', '.join(feature_names)}")
    else:
        print(f"❌ Model files not found at {model_path}")
        print("Please run python train_model.py first")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# Request models
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

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "MigraineGuard API is running",
        "status": "healthy",
        "model_loaded": model is not None
    }

# Prediction endpoint - THIS IS WHAT WAS MISSING!
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
        
        # Get prediction probability
        probability = model.predict_proba(features_scaled)[0][1]
        risk_score = float(probability * 100)
        
        # Determine risk level
        if risk_score < 30:
            risk_level = "Low"
        elif risk_score < 70:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        # Get feature importance
        if hasattr(model, 'feature_importances_'):
            global_importance = model.feature_importances_
            contributions = []
            for i, name in enumerate(feature_names):
                contrib = global_importance[i] * abs(features_scaled[0][i])
                contributions.append((name, contrib))
            contributions.sort(key=lambda x: -abs(x[1]))
            top_contributors = contributions[:3]
        else:
            global_importance = [0] * len(feature_names)
            top_contributors = []
        
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
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Weather endpoint
@app.post("/weather")
async def get_weather(data: WeatherInput):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        # Return mock data for testing
        return {
            "temperature": 22.5,
            "humidity": 65,
            "pressure": 1013,
            "city": data.city,
            "mock": True
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
        return {
            "temperature": 22.5,
            "humidity": 65,
            "pressure": 1013,
            "city": data.city,
            "error": str(e),
            "mock": True
        }

# Feature importance endpoint
@app.get("/feature-importance")
async def get_feature_importance():
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if hasattr(model, 'feature_importances_'):
        importance = model.feature_importances_
        return {
            "features": [{"name": name, "importance": round(imp, 3)} for name, imp in zip(feature_names, importance)]
        }
    else:
        return {"features": []}