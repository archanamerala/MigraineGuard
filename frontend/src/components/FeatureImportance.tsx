import React from 'react';

interface FeatureImportanceProps {
  global: Record<string, number>;
  topContributors?: { feature: string; impact: number }[];
}

const FeatureImportance: React.FC<FeatureImportanceProps> = ({ global, topContributors }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Key Factors Affecting Risk</h3>
      
      {topContributors && topContributors.length > 0 && (
        <div className="space-y-2">
          {topContributors.map((item) => (
            <div key={item.feature} className="flex items-center justify-between">
              <span className="text-sm capitalize text-gray-600">
                {item.feature.replace(/_/g, ' ')}:
              </span>
              <span className={`text-sm font-medium ${item.impact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {item.impact > 0 ? '+' : ''}{item.impact.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      <details className="text-sm text-gray-500">
        <summary className="cursor-pointer hover:text-gray-700">View all factors</summary>
        <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
          {Object.entries(global).map(([name, imp]) => (
            <div key={name} className="flex justify-between">
              <span className="capitalize">{name.replace(/_/g, ' ')}</span>
              <span className="font-mono">{(imp * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

export default FeatureImportance;