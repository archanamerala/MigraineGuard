import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, Activity, AlertCircle, Droplets, Brain, Eye, Wind, Coffee } from 'lucide-react';

const LogMigraine: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    started_at: new Date().toISOString().slice(0, 16),
    ended_at: '',
    severity: 5,
    pain_location: [] as string[],
    symptoms: [] as string[],
    triggers: [] as string[],
    medication: '',
    notes: ''
  });

  const painLocations = ['Left temple', 'Right temple', 'Behind eyes', 'Forehead', 'Back of head', 'Whole head', 'One side'];
  const symptomList = ['Throbbing pain', 'Sensitivity to light', 'Sensitivity to sound', 'Nausea', 'Vomiting', 'Blurred vision', 'Aura', 'Dizziness', 'Neck stiffness', 'Fatigue'];
  const triggerList = ['Stress', 'Lack of sleep', 'Skipped meal', 'Dehydration', 'Weather change', 'Bright lights', 'Loud noise', 'Alcohol', 'Caffeine', 'Hormonal changes', 'Screen time', 'Exercise'];

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert('Please login first');
    setLoading(false);
    return;
  }

  // Prepare data with correct field names
  const dataToSave = {
    user_id: user.id,
    log_date: formData.log_date,
    sleep_hours: formData.sleep_hours,
    sleep_quality: formData.sleep_quality,
    stress_level: formData.stress_level,
    activity_level: formData.activity_level,
    screen_time: formData.screen_time,
    water_intake: formData.water_intake,
    caffeine_mg: formData.caffeine_mg,
    alcohol: formData.alcohol,
    meals_skipped: formData.meals_skipped,
    notes: formData.notes,
    logged_at: new Date().toISOString()
  };

  console.log('Saving lifestyle log:', dataToSave); // Debug log

  const { error } = await supabase
    .from('lifestyle_logs')
    .insert([dataToSave]);

  setLoading(false);
  if (error) {
    console.error('Error saving lifestyle log:', error);
    alert(`Failed to save: ${error.message}`);
  } else {
    alert('Lifestyle log saved successfully!');
    navigate('/history');
  }
};
  const toggleArrayItem = (array: string[], setter: Function, item: string) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Log Migraine Episode</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-sm p-6">
        {/* Date & Time */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Started</label>
            <input type="datetime-local" value={formData.started_at} onChange={(e) => setFormData({ ...formData, started_at: e.target.value })} className="w-full p-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Ended (optional)</label>
            <input type="datetime-local" value={formData.ended_at} onChange={(e) => setFormData({ ...formData, ended_at: e.target.value })} className="w-full p-2 border rounded-lg" />
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> Pain Severity</label>
          <input type="range" value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })} min="1" max="10" step="1" className="w-full" />
          <div className="flex justify-between text-sm mt-1"><span>Mild</span><span className="font-bold">{formData.severity}/10</span><span>Extreme</span></div>
        </div>

        {/* Pain Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Brain className="w-4 h-4" /> Pain Location</label>
          <div className="flex flex-wrap gap-2">
            {painLocations.map(loc => (
              <button key={loc} type="button" onClick={() => toggleArrayItem(formData.pain_location, (v: any) => setFormData({ ...formData, pain_location: v }), loc)} className={`px-3 py-1 rounded-full text-sm transition ${formData.pain_location.includes(loc) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{loc}</button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Symptoms</label>
          <div className="flex flex-wrap gap-2">
            {symptomList.map(sym => (
              <button key={sym} type="button" onClick={() => toggleArrayItem(formData.symptoms, (v: any) => setFormData({ ...formData, symptoms: v }), sym)} className={`px-3 py-1 rounded-full text-sm transition ${formData.symptoms.includes(sym) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{sym}</button>
            ))}
          </div>
        </div>

        {/* Triggers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Wind className="w-4 h-4" /> Possible Triggers</label>
          <div className="flex flex-wrap gap-2">
            {triggerList.map(trig => (
              <button key={trig} type="button" onClick={() => toggleArrayItem(formData.triggers, (v: any) => setFormData({ ...formData, triggers: v }), trig)} className={`px-3 py-1 rounded-full text-sm transition ${formData.triggers.includes(trig) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{trig}</button>
            ))}
          </div>
        </div>

        {/* Medication */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Coffee className="w-4 h-4" /> Medication taken (optional)</label>
          <input type="text" value={formData.medication} onChange={(e) => setFormData({ ...formData, medication: e.target.value })} placeholder="e.g., Ibuprofen, Sumatriptan" className="w-full p-2 border rounded-lg" />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
          <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Any other details you want to remember..." />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Migraine Log'}
        </button>
      </form>
    </div>
  );
};

export default LogMigraine;