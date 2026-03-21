import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { predict } from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity, Cloud, Droplets, Thermometer, Wind, Clock, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
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
    meals_skipped: 1,
    medication: ''
  });

  // Generate hourly risk data (mock for demo - will be replaced with real data)
  const hourlyData = [
    { hour: 'Now', risk: prediction?.risk_score || 8 },
    { hour: '9PM', risk: 12 },
    { hour: '10PM', risk: 10 },
    { hour: '11PM', risk: 8 },
    { hour: '12AM', risk: 5 },
    { hour: '1AM', risk: 4 },
    { hour: '2AM', risk: 4 },
    { hour: '3AM', risk: 5 },
    { hour: '4AM', risk: 6 },
    { hour: '5AM', risk: 8 },
    { hour: '6AM', risk: 12 },
    { hour: '7AM', risk: 18 },
    { hour: '8AM', risk: 22 },
    { hour: '9AM', risk: 25 },
    { hour: '10AM', risk: 28 },
    { hour: '11AM', risk: 30 },
    { hour: '12PM', risk: 32 },
    { hour: '1PM', risk: 35 },
    { hour: '2PM', risk: 38 },
    { hour: '3PM', risk: 42 },
    { hour: '4PM', risk: 40 },
    { hour: '5PM', risk: 35 },
    { hour: '6PM', risk: 28 },
    { hour: '7PM', risk: 18 },
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
    
    const fetchWeather = async () => {
      try {
        const response = await fetch('http://localhost:8000/weather', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: 'London' })
        });
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Weather fetch error:', error);
      }
    };
    fetchWeather();
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const result = await predict(formData);
      setPrediction(result);
      
      if (user) {
        await supabase.from('prediction_history').insert({
          user_id: user.id,
          ...formData,
          risk_score: result.risk_score,
          risk_level: result.risk_level,
          created_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Failed to get prediction');
    }
    setLoading(false);
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: parseFloat(value) });
  };

  const getRiskColor = (risk) => {
    if (risk < 35) return 'text-green-600';
    if (risk < 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBgColor = (risk) => {
    if (risk < 35) return 'bg-green-100 border-green-200';
    if (risk < 65) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋</h1>
        <p className="text-blue-100">Here's your health overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Today's Migraine Risk</div>
          <div className={`text-3xl font-bold ${prediction ? getRiskColor(prediction.risk_score) : 'text-gray-600'}`}>
            {prediction ? `${prediction.risk_score}%` : '--'}
          </div>
          <div className="text-sm text-gray-500">Confidence: {prediction ? `${(prediction.confidence * 100).toFixed(0)}%` : '--'}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">This Week</div>
          <div className="text-3xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-500">Migraines</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">This Month</div>
          <div className="text-3xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-500">Migraines</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Avg Severity</div>
          <div className="text-3xl font-bold text-blue-600">0/10</div>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Input Your Data</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Hours: {formData.sleep_hours}h</label>
              <input type="range" value={formData.sleep_hours} onChange={(e) => handleChange('sleep_hours', e.target.value)} min="0" max="12" step="0.5" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stress Level: {formData.stress_level}/10</label>
              <input type="range" value={formData.stress_level} onChange={(e) => handleChange('stress_level', e.target.value)} min="1" max="10" step="1" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Physical Activity: {formData.activity_level}/10</label>
              <input type="range" value={formData.activity_level} onChange={(e) => handleChange('activity_level', e.target.value)} min="1" max="10" step="1" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Screen Time: {formData.screen_time}h</label>
              <input type="range" value={formData.screen_time} onChange={(e) => handleChange('screen_time', e.target.value)} min="0" max="16" step="0.5" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medication Taken</label>
              <input type="text" value={formData.medication} onChange={(e) => setFormData({ ...formData, medication: e.target.value })} placeholder="e.g., Ibuprofen, Sumatriptan" className="w-full p-2 border rounded-lg" />
            </div>
          </div>

          {/* Environmental Factors */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-semibold mb-3">Environmental Factors</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-500">Temperature (°C)</label><input type="number" value={formData.temperature} onChange={(e) => handleChange('temperature', e.target.value)} className="w-full p-1 border rounded" /></div>
              <div><label className="text-xs text-gray-500">Humidity (%)</label><input type="number" value={formData.humidity} onChange={(e) => handleChange('humidity', e.target.value)} className="w-full p-1 border rounded" /></div>
              <div><label className="text-xs text-gray-500">Air Pressure (hPa)</label><input type="number" value={formData.pressure} onChange={(e) => handleChange('pressure', e.target.value)} className="w-full p-1 border rounded" /></div>
              <div><label className="text-xs text-gray-500">Air Quality Index</label><input type="number" value={formData.air_quality} onChange={(e) => handleChange('air_quality', e.target.value)} className="w-full p-1 border rounded" /></div>
            </div>
          </div>

          <button onClick={handlePredict} disabled={loading} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Predicting...' : 'Predict Migraine Risk'}
          </button>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prediction Results */}
          {prediction && (
            <div className={`rounded-xl p-6 ${getRiskBgColor(prediction.risk_score)} border`}>
              <h3 className="text-xl font-bold mb-4">Prediction Results</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div><div className="text-sm text-gray-600">Risk Score</div><div className="text-3xl font-bold">{prediction.risk_score}%</div></div>
                <div><div className="text-sm text-gray-600">Risk Level</div><div className={`text-2xl font-bold ${getRiskColor(prediction.risk_score)}`}>{prediction.risk_level}</div></div>
                <div><div className="text-sm text-gray-600">Confidence</div><div className="text-2xl font-bold">{(prediction.confidence * 100).toFixed(0)}%</div></div>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="font-semibold mb-2">Personalized Suggestions:</p>
                <ul className="space-y-1">
                  {prediction.risk_score > 50 && <li>⚠️ High risk detected - consider resting and staying hydrated</li>}
                  {formData.medication && <li>💊 Continue with {formData.medication} as prescribed</li>}
                  <li>💧 Drink at least 8 glasses of water today</li>
                  {formData.sleep_hours < 7 && <li>😴 Try to get more sleep tonight (aim for 7-8 hours)</li>}
                </ul>
              </div>
            </div>
          )}

          {/* Weather Card */}
          {weather && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Cloud className="w-5 h-5" /> Current Weather</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center"><Thermometer className="w-5 h-5 mx-auto text-blue-600" /><div className="text-lg font-bold">{weather.temperature}°C</div><div className="text-xs text-gray-500">Temperature</div></div>
                <div className="text-center"><Droplets className="w-5 h-5 mx-auto text-blue-600" /><div className="text-lg font-bold">{weather.humidity}%</div><div className="text-xs text-gray-500">Humidity</div></div>
                <div className="text-center"><Wind className="w-5 h-5 mx-auto text-blue-600" /><div className="text-lg font-bold">{weather.pressure} hPa</div><div className="text-xs text-gray-500">Pressure</div></div>
                <div className="text-center"><Cloud className="w-5 h-5 mx-auto text-blue-600" /><div className="text-lg font-bold capitalize">{weather.city}</div><div className="text-xs text-gray-500">Location</div></div>
              </div>
            </div>
          )}

          {/* 24-Hour Risk Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5" /> 24-Hour Risk Trend (Based on Your Data)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="risk" stroke="#ef4444" fill="url(#riskGradient)" />
                <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs">Low (0-35%)</span></span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span className="text-xs">Medium (36-65%)</span></span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs">High (66-100%)</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}