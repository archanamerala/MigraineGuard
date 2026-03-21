import React, { useState, useEffect } from 'react';
import { predictMigraine, checkHealth } from '../services/api';
import { supabase } from '../services/supabase';

const PredictionTool: React.FC = () => {
  const [formData, setFormData] = useState({
    sleep_hours: 7,
    stress_level: 5,
    activity_level: 5,
    screen_time: 6,
    temperature: 22,
    humidity: 50,
    pressure: 1013,
    air_quality: 50,
    caffeine_intake: 2,
    water_intake: 6,
    meals_skipped: 1
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      await checkHealth();
      setBackendStatus('online');
    } catch (err) {
      setBackendStatus('offline');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Sending data to backend:', formData);
      const result = await predictMigraine(formData);
      console.log('Received prediction:', result);
      setPrediction(result);
      
      // Save to database if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const { error } = await supabase
            .from('prediction_history')
            .insert([
              {
                user_id: user.id,
                risk_score: result.risk_score,
                risk_level: result.risk_level,
                confidence: result.confidence,
                input_data: formData
              }
            ]);
          
          if (error) {
            console.error('Error saving to Supabase:', error);
          } else {
            console.log('✅ Prediction saved to database!');
          }
        } catch (err) {
          console.error('Failed to save prediction:', err);
        }
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to get prediction. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value)
    });
  };

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800 border border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'High': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Migraine Risk Prediction Tool</h2>
      
      {/* Backend Status Indicator */}
      {backendStatus === 'checking' && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent mr-2"></div>
            Checking backend connection...
          </div>
        </div>
      )}
      
      {backendStatus === 'offline' && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <div className="font-medium mb-2">⚠️ Backend server is not running</div>
          <div className="text-sm">Please start your backend server with:</div>
          <div className="mt-2 p-2 bg-red-100 rounded font-mono text-xs">
            cd D:\MigraineGuard\backend<br />
            venv\Scripts\activate<br />
            uvicorn app.main:app --reload --port 8000
          </div>
        </div>
      )}
      
      {backendStatus === 'online' && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            Backend connected successfully! Ready to predict.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Sleep Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleep Hours: <span className="text-blue-600 font-bold">{formData.sleep_hours}</span>
            </label>
            <input
              type="range"
              name="sleep_hours"
              value={formData.sleep_hours}
              onChange={handleChange}
              min="0"
              max="12"
              step="0.5"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>12</span>
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stress Level: <span className="text-blue-600 font-bold">{formData.stress_level}</span>
            </label>
            <input
              type="range"
              name="stress_level"
              value={formData.stress_level}
              onChange={handleChange}
              min="1"
              max="10"
              step="1"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Level: <span className="text-blue-600 font-bold">{formData.activity_level}</span>
            </label>
            <input
              type="range"
              name="activity_level"
              value={formData.activity_level}
              onChange={handleChange}
              min="1"
              max="10"
              step="1"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          {/* Screen Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screen Time: <span className="text-blue-600 font-bold">{formData.screen_time}h</span>
            </label>
            <input
              type="range"
              name="screen_time"
              value={formData.screen_time}
              onChange={handleChange}
              min="0"
              max="16"
              step="0.5"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>16</span>
            </div>
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature: <span className="text-blue-600 font-bold">{formData.temperature}°C</span>
            </label>
            <input
              type="range"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              min="-10"
              max="45"
              step="0.5"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-10°C</span>
              <span>45°C</span>
            </div>
          </div>

          {/* Humidity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Humidity: <span className="text-blue-600 font-bold">{formData.humidity}%</span>
            </label>
            <input
              type="range"
              name="humidity"
              value={formData.humidity}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Pressure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pressure: <span className="text-blue-600 font-bold">{formData.pressure}hPa</span>
            </label>
            <input
              type="range"
              name="pressure"
              value={formData.pressure}
              onChange={handleChange}
              min="950"
              max="1050"
              step="1"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>950</span>
              <span>1050</span>
            </div>
          </div>

          {/* Air Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Air Quality: <span className="text-blue-600 font-bold">{formData.air_quality}</span>
            </label>
            <input
              type="range"
              name="air_quality"
              value={formData.air_quality}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>100</span>
            </div>
          </div>

          {/* Caffeine Intake */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caffeine: <span className="text-blue-600 font-bold">{formData.caffeine_intake}cups</span>
            </label>
            <input
              type="range"
              name="caffeine_intake"
              value={formData.caffeine_intake}
              onChange={handleChange}
              min="0"
              max="10"
              step="1"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          {/* Water Intake */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Water: <span className="text-blue-600 font-bold">{formData.water_intake}glasses</span>
            </label>
            <input
              type="range"
              name="water_intake"
              value={formData.water_intake}
              onChange={handleChange}
              min="0"
              max="15"
              step="1"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>15</span>
            </div>
          </div>

          {/* Meals Skipped */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meals Skipped: <span className="text-blue-600 font-bold">{formData.meals_skipped}</span>
            </label>
            <input
              type="range"
              name="meals_skipped"
              value={formData.meals_skipped}
              onChange={handleChange}
              min="0"
              max="5"
              step="1"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>5</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || backendStatus !== 'online'}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            backendStatus === 'online' 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
              Calculating...
            </span>
          ) : (
            'Predict Migraine Risk'
          )}
        </button>
      </form>

      {prediction && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Prediction Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Risk Score</div>
              <div className="text-3xl font-bold text-blue-600">
                {prediction.risk_score?.toFixed(1) || 'N/A'}%
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Risk Level</div>
              <div className={`inline-block px-4 py-2 rounded-lg font-bold ${getRiskBadgeClass(prediction.risk_level)}`}>
                {prediction.risk_level || 'N/A'}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Confidence</div>
              <div className="text-2xl font-bold text-blue-600">
                {(prediction.confidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {prediction.feature_importance && (
            <div className="mt-4">
              <h4 className="font-semibold mb-3">Key Contributing Factors:</h4>
              <div className="space-y-3">
                {Object.entries(prediction.feature_importance)
                  .sort(([, a]: any, [, b]: any) => b - a)
                  .slice(0, 5)
                  .map(([feature, importance]: [string, any]) => (
                    <div key={feature}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{feature.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-blue-600">{(importance * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(100, Math.abs(importance * 10))}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionTool;