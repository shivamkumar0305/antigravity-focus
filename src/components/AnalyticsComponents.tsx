import { useMemo } from 'react';
import { useAppStore } from '../store';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { Activity, Trophy, Clock, CalendarDays } from 'lucide-react';

export function DailyBarChart() {
  const { statsHistory } = useAppStore();
  
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const stat = statsHistory.find(s => s.date === dateStr);
      return {
        date,
        dayName: format(date, 'EEE'),
        completedMinutes: stat?.completedMinutes || 0,
        goalMinutes: stat?.goalMinutes || 120, // default if not set
      };
    });
  }, [statsHistory]);

  const maxMinutes = Math.max(...last7Days.map(d => d.completedMinutes), 120);

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-200 mb-6 flex items-center gap-2">
        <Activity size={18} className="text-blue-500" />
        Activity (Last 7 Days)
      </h3>
      
      <div className="flex-1 flex items-end justify-between gap-2 mt-4 pb-2">
        {last7Days.map((day, i) => {
          const heightPct = Math.min(100, (day.completedMinutes / maxMinutes) * 100);
          const isToday = i === 6;
          
          return (
            <div key={day.dayName} className="flex flex-col items-center gap-2 flex-1 group">
              <div className="w-full flex justify-center relative h-40">
                <div className="absolute bottom-0 w-8 md:w-12 bg-white/5 rounded-t-md h-full"></div>
                <div 
                  className={`absolute bottom-0 w-8 md:w-12 rounded-t-md transition-all duration-700 ease-out group-hover:opacity-80
                    ${isToday ? 'bg-blue-500 shadow-[0_0_15px_rgba(0,122,255,0.4)]' : 'bg-blue-500/60'}`}
                  style={{ height: `${heightPct}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity text-center z-10 pointer-events-none">
                    {day.completedMinutes}m
                  </div>
                </div>
              </div>
              <span className={`text-xs ${isToday ? 'text-blue-400 font-bold' : 'text-gray-500'}`}>
                {day.dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WeeklySummary() {
  const { statsHistory } = useAppStore();
  
  const weeklyStats = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
    const end = endOfWeek(today, { weekStartsOn: 1 });
    
    let totalMinutes = 0;
    let daysActive = 0;
    let bestDay = 0;
    
    // Filter stats to current week
    const thisWeekStats = statsHistory.filter(s => {
      const date = new Date(s.date);
      return date >= start && date <= end;
    });

    thisWeekStats.forEach(stat => {
      totalMinutes += stat.completedMinutes;
      if (stat.completedMinutes > 0) daysActive++;
      if (stat.completedMinutes > bestDay) bestDay = stat.completedMinutes;
    });

    return {
      totalHours: (totalMinutes / 60).toFixed(1),
      avgPerDay: daysActive > 0 ? Math.round(totalMinutes / daysActive) : 0,
      bestDay: bestDay,
    };
  }, [statsHistory]);

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-200 mb-6 flex items-center gap-2">
        <CalendarDays size={18} className="text-purple-500" />
        This Week
      </h3>
      
      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <span className="text-gray-400">Total Focus</span>
          <span className="text-2xl font-semibold">{weeklyStats.totalHours} <span className="text-base text-gray-500 font-normal">hrs</span></span>
        </div>
        
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <span className="text-gray-400">Daily Average</span>
          <span className="text-xl font-medium">{weeklyStats.avgPerDay} <span className="text-base text-gray-500 font-normal">min/day</span></span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Best Day</span>
          <span className="text-xl font-medium">{weeklyStats.bestDay} <span className="text-base text-gray-500 font-normal">min</span></span>
        </div>
      </div>
    </div>
  );
}

export function StreakHeatmap() {
  const { statsHistory } = useAppStore();
  
  // Generate last 60 days
  const heatmapData = useMemo(() => {
    return Array.from({ length: 90 }).map((_, i) => {
      const date = subDays(new Date(), 89 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const stat = statsHistory.find(s => s.date === dateStr);
      return {
        date,
        minutes: stat?.completedMinutes || 0
      };
    });
  }, [statsHistory]);

  return (
    <div className="glass-card p-6 h-full flex flex-col w-full overflow-hidden">
      <h3 className="text-lg font-medium text-gray-200 mb-6 flex items-center gap-2">
        <Activity size={18} className="text-green-500" />
        Consistency Heatmap (90 Days)
      </h3>
      
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="flex flex-wrap gap-1.5 justify-center mt-2 w-full max-w-[600px]">
          {heatmapData.map((d, i) => {
            let colorClass = 'bg-white/5'; // Level 0
            if (d.minutes > 0) colorClass = 'bg-blue-900/40 border border-blue-500/20'; // Level 1
            if (d.minutes >= 30) colorClass = 'bg-blue-800/60 border border-blue-500/30'; // Level 2
            if (d.minutes >= 60) colorClass = 'bg-blue-600/80 border border-blue-500/50'; // Level 3
            if (d.minutes >= 120) colorClass = 'bg-blue-500 shadow-[0_0_8px_rgba(0,122,255,0.4)] border border-blue-400 w-[14px] h-[14px]'; // Level 4
            
            return (
              <div 
                key={i} 
                title={`${format(d.date, 'MMM d, yyyy')}: ${d.minutes}m`}
                className={`w-3 h-3 rounded-[2px] cursor-pointer hover:border-white/50 transition-colors ${colorClass}`} 
              />
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex justify-end items-center gap-2 text-xs text-gray-500">
        <span>Less</span>
        <div className="w-3 h-3 rounded-[2px] bg-white/5"></div>
        <div className="w-3 h-3 rounded-[2px] bg-blue-900/40"></div>
        <div className="w-3 h-3 rounded-[2px] bg-blue-600/80"></div>
        <div className="w-3 h-3 rounded-[2px] bg-blue-500"></div>
        <span>More</span>
      </div>
    </div>
  );
}

export function AllTimeStats() {
  const { sessions, statsHistory, streak } = useAppStore();
  
  const allTimeHours = useMemo(() => {
    const totalMinutes = sessions.reduce((acc, s) => acc + s.actualDurationMinutes, 0);
    return (totalMinutes / 60).toFixed(1);
  }, [sessions]);

  // Find longest streak based on contiguous days in statsHistory > 0.
  // Not perfect logic for gaps, but sufficient for local tracker.
  let currentStreak = 0;
  let maxStreak = 0;
  
  const sortedStats = [...statsHistory].sort((a,b) => a.date.localeCompare(b.date));
  for (const stat of sortedStats) {
      if (stat.completedMinutes > 0) {
          currentStreak++;
          if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
          currentStreak = 0;
      }
  }

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-200 mb-6 flex items-center gap-2">
        <Trophy size={18} className="text-yellow-500" />
        All-Time Milestones
      </h3>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="bg-white/5 rounded-xl p-4 flex flex-col justify-center items-center text-center">
            <Clock size={24} className="text-gray-400 mb-2" />
            <p className="text-2xl font-semibold">{allTimeHours}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Hours</p>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 flex flex-col justify-center items-center text-center">
            <Activity size={24} className="text-gray-400 mb-2" />
            <p className="text-2xl font-semibold">{sessions.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Sessions</p>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 flex flex-col justify-center items-center text-center col-span-2">
            <div className="flex items-center gap-4 w-full px-4">
              <Trophy size={32} className="text-yellow-500" />
              <div className="text-left">
                <p className="text-3xl font-bold">{Math.max(maxStreak, streak)} <span className="text-sm font-normal text-gray-400">days</span></p>
                <p className="text-sm text-gray-400">Longest Streak</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
