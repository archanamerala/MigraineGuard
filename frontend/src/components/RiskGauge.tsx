import React from 'react';

interface RiskGaugeProps {
  risk: number; // 0-100
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ risk }) => {
  const getColor = () => {
    if (risk < 30) return 'bg-green-500';
    if (risk < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (risk < 30) return 'text-green-600';
    if (risk < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMessage = () => {
    if (risk < 30) return 'Low Risk';
    if (risk < 70) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="text-center">
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={risk < 30 ? '#22c55e' : risk < 70 ? '#eab308' : '#ef4444'}
            strokeWidth="10"
            strokeDasharray={`${(risk / 100) * 283} 283`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          {/* Center text */}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            className={`text-2xl font-bold ${getTextColor()}`}
          >
            {Math.round(risk)}%
          </text>
        </svg>
      </div>
      <div className="mt-2">
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getTextColor()} bg-gray-100`}>
          {getMessage()}
        </span>
      </div>
    </div>
  );
};

export default RiskGauge;