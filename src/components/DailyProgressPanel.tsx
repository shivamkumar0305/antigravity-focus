import { useAppStore } from '../store';
import { Target, Flame } from 'lucide-react';

function ProgressRing({ percentage, size = 160, stroke = 8 }: { percentage: number, size?: number, stroke?: number }) {
  const normalizedRadius = (size / 2) - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Cap at 100% for visual
  const safePercentage = Math.min(100, percentage);
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={size} width={size} className="transform -rotate-90">
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="#007AFF"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

export function DailyProgressPanel() {
  const { todayStats, streak } = useAppStore();
  
  const percentage = todayStats.goalMinutes > 0 
    ? (todayStats.completedMinutes / todayStats.goalMinutes) * 100 
    : 0;

  return (
    <div className="glass-card p-6 flex flex-col h-full bg-opacity-50">
      <h3 className="text-lg font-medium text-gray-200 mb-6">Today</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <ProgressRing percentage={percentage} />
        <div className="mt-6 text-center">
          <p className="text-2xl font-semibold">{todayStats.completedMinutes} <span className="text-gray-400 text-base font-normal">/ {todayStats.goalMinutes} min</span></p>
          <p className="text-sm text-gray-500 mt-1">Focus Time</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Flame size={16} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Streak</p>
            <p className="font-medium">{streak} days</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Target size={16} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Daily Goal</p>
            <p className="font-medium">{todayStats.goalMinutes}m</p>
          </div>
        </div>
      </div>
    </div>
  );
}
