import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Moon, Activity, Smartphone, Droplets, Coffee, Utensils, Calendar, Sun } from 'lucide-react';

const LogLifestyle: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split('T')[0],
    sleep_hours: 7,
    sleep_quality: 'Average',
    stress_level: 5,
    activity_level: 5,
    screen_time: 4,
    water_intake: 2,
    caffeine_mg: 100,
    alcohol: false,
    meals_skipped: 0,
    notes: ''
  });

  const sleepQualityOptions = ['Poor', 'Fair', 'Average', 'Good', 'Excellent'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please login first');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('lifestyle_logs').insert({
      user_id: user.id,
      ...formData,
      logged_at: new Date().toISOString()
    });

    setLoading(false);
    if (error) {
      console.error('Error:', error);
      alert('Failed to save log');
    } else {
      alert('Lifestyle log saved successfully!');
      navigate('/history');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Log Lifestyle Data</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-sm p-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Log Date</label>
          <input type="date" value={formData.log_date} onChange={(e) => setFormData({ ...formData, log_date: e.target.value })} className="w-full p-2 border rounded-lg" required />
        </div>

        {/* Sleep */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Moon className="w-4 h-4" /> Sleep</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Hours of Sleep: {formData.sleep_hours}h</label>
              <input type="range" value={formData.sleep_hours} onChange={(e) => setFormData({ ...formData, sleep_hours: parseFloat(e.target.value) })} min="0" max="12" step="0.5" className="w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Sleep Quality</label>
              <select value={formData.sleep_quality} onChange={(e) => setFormData({ ...formData, sleep_quality: e.target.value })} className="w-full p-2 border rounded-lg">
                {sleepQualityOptions.map(q => <option key={q}>{q}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Stress & Activity */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Activity className="w-4 h-4" /> Stress & Activity</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Stress Level: {formData.stress_level}/10</label>
              <input type="range" value={formData.stress_level} onChange={(e) => setFormData({ ...formData, stress_level: parseInt(e.target.value) })} min="1" max="10" className="w-full" />
              <div className="flex justify-between text-xs"><span>Low</span><span>Moderate</span><span>High</span></div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Physical Activity: {formData.activity_level}/10</label>
              <input type="range" value={formData.activity_level} onChange={(e) => setFormData({ ...formData, activity_level: parseInt(e.target.value) })} min="1" max="10" className="w-full" />
              <div className="flex justify-between text-xs"><span>Sedentary</span><span>Very Active</span></div>
            </div>
          </div>
        </div>

        {/* Screen Time */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Screen Time</h3>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Hours on Screens: {formData.screen_time}h</label>
            <input type="range" value={formData.screen_time} onChange={(e) => setFormData({ ...formData, screen_time: parseFloat(e.target.value) })} min="0" max="16" step="0.5" className="w-full" />
          </div>
        </div>

        {/* Hydration & Diet */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Droplets className="w-4 h-4" /> Hydration & Diet</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Water Intake: {formData.water_intake}L</label>
              <input type="range" value={formData.water_intake} onChange={(e) => setFormData({ ...formData, water_intake: parseFloat(e.target.value) })} min="0" max="5" step="0.5" className="w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Caffeine: {formData.caffeine_mg}mg</label>
              <input type="range" value={formData.caffeine_mg} onChange={(e) => setFormData({ ...formData, caffeine_mg: parseInt(e.target.value) })} min="0" max="400" step="25" className="w-full" />
              <div className="text-xs text-gray-500">~95mg per cup of coffee, ~47mg per cup of tea</div>
            </div>
            <div>
              <label className="flex items-center gap-2"><Coffee className="w-4 h-4" /> Alcohol Consumed</label>
              <input type="checkbox" checked={formData.alcohol} onChange={(e) => setFormData({ ...formData, alcohol: e.target.checked })} className="mt-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Meals Skipped: {formData.meals_skipped}</label>
              <input type="range" value={formData.meals_skipped} onChange={(e) => setFormData({ ...formData, meals_skipped: parseInt(e.target.value) })} min="0" max="5" className="w-full" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
          <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Anything else noteworthy about your day..." />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Lifestyle Log'}
        </button>
      </form>
    </div>
  );
};

export default LogLifestyle;