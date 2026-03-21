# 🧠 MigraineGuard - AI-Powered Migraine Prediction System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.10+-green.svg)](https://python.org)
[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org)

> Predict your migraine risk with 95.85% accuracy using advanced machine learning

## 🎯 Features

- **AI-Powered Predictions** - Random Forest model with 95.85% accuracy
- **Weather Integration** - Real-time weather data affects predictions
- **Lifestyle Tracking** - Log sleep, stress, activity, and more
- **Interactive Dashboard** - Beautiful charts and risk visualization
- **Personalized Insights** - Get customized recommendations
- **CSV Export** - Download your data for sharing with doctors

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| FastAPI | Backend API |
| scikit-learn | Machine Learning |
| React + TypeScript | Frontend UI |
| Tailwind CSS | Styling |
| Supabase | Database & Auth |
| Recharts | Data Visualization |

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python train_model.py
uvicorn app:app --reload --port 8000
