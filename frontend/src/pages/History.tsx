import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ExportButton from '../components/ExportButton';
import { Trash2 } from 'lucide-react';

const History: React.FC = () => {
  const [migraineLogs, setMigraineLogs] = useState<any[]>([]);
  const [lifestyleLogs, setLifestyleLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'migraine' | 'lifestyle'>('migraine');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [migraine, lifestyle] = await Promise.all([
      supabase.from('migraine_logs').select('*').eq('user_id', user.id).order('logged_at', { ascending: false }),
      supabase.from('lifestyle_logs').select('*').eq('user_id', user.id).order('logged_at', { ascending: false })
    ]);

    setMigraineLogs(migraine.data || []);
    setLifestyleLogs(lifestyle.data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string, table: string) => {
    if (!confirm('Delete this entry?')) return;

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) {
      if (table === 'migraine_logs') {
        setMigraineLogs(prev => prev.filter(l => l.id !== id));
      } else {
        setLifestyleLogs(prev => prev.filter(l => l.id !== id));
      }
    } else {
      alert('Failed to delete');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">History</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('migraine')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'migraine' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Migraine Logs
          </button>
          <button
            onClick={() => setActiveTab('lifestyle')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'lifestyle' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Lifestyle Logs
          </button>
          <ExportButton 
            data={activeTab === 'migraine' ? migraineLogs : lifestyleLogs} 
            filename={`${activeTab}_logs_${new Date().toISOString().split('T')[0]}`}
            label="Export CSV"
          />
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'migraine' && migraineLogs.length === 0 && (
          <p className="text-gray-500 text-center py-8">No migraine logs found.</p>
        )}
        {activeTab === 'lifestyle' && lifestyleLogs.length === 0 && (
          <p className="text-gray-500 text-center py-8">No lifestyle logs found.</p>
        )}

        {activeTab === 'migraine' && migraineLogs.map((log) => (
          <div key={log.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                    log.severity <= 3 ? 'bg-green-100 text-green-800' :
                    log.severity <= 7 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Severity: {log.severity}/10
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(log.logged_at).toLocaleString()}
                  </span>
                </div>
                {log.symptoms && log.symptoms.length > 0 && (
                  <p><span className="font-medium">Symptoms:</span> {Array.isArray(log.symptoms) ? log.symptoms.join(', ') : log.symptoms}</p>
                )}
                {log.triggers && log.triggers.length > 0 && (
                  <p><span className="font-medium">Triggers:</span> {Array.isArray(log.triggers) ? log.triggers.join(', ') : log.triggers}</p>
                )}
                {log.medication && <p><span className="font-medium">Medication:</span> {log.medication}</p>}
                {log.notes && <p className="text-gray-600"><span className="font-medium">Notes:</span> {log.notes}</p>}
              </div>
              <button
                onClick={() => handleDelete(log.id, 'migraine_logs')}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'lifestyle' && lifestyleLogs.map((log) => (
          <div key={log.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(log.logged_at).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">Sleep:</span> {log.sleep_hours}h</p>
                  <p><span className="font-medium">Stress:</span> {log.stress_level}/10</p>
                  <p><span className="font-medium">Activity:</span> {log.activity_level}/10</p>
                  <p><span className="font-medium">Screen Time:</span> {log.screen_time}h</p>
                  <p><span className="font-medium">Water:</span> {log.water_intake} glasses</p>
                  <p><span className="font-medium">Caffeine:</span> {log.caffeine_intake} cups</p>
                  <p><span className="font-medium">Meals Skipped:</span> {log.meals_skipped}</p>
                </div>
                {log.notes && <p className="text-gray-600 text-sm"><span className="font-medium">Notes:</span> {log.notes}</p>}
              </div>
              <button
                onClick={() => handleDelete(log.id, 'lifestyle_logs')}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;