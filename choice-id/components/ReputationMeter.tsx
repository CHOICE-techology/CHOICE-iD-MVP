
import React from 'react';

interface ReputationMeterProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const ReputationMeter: React.FC<ReputationMeterProps> = ({ 
  score, 
  size = 160, 
  strokeWidth = 12 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 30) return '#EF4444'; // Red
    if (s < 60) return '#F59E0B'; // Yellow
    return '#00E5FF'; // Primary Cyan
  };

  const color = getColor(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-200 dark:text-slate-800"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          style={{ 
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease'
          }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black tracking-tighter" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-widest text-gray opacity-60">
          Score
        </span>
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};
