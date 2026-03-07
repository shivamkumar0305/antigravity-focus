import { useState } from 'react';
import { format } from 'date-fns';
import type { Task, Session, DailyStats, Settings } from './types';

// Default App Settings
export const DEFAULT_SETTINGS: Settings = {
  dailyGoalMinutes: 120, // 2 hours
  skipBreaks: false,
  defaultSessionDuration: 25,
};

// Generic hook to sync state with localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage', error);
    }
  };

  return [storedValue, setValue] as const;
}

// App Store Hook
export function useAppStore() {
  const [settings, setSettings] = useLocalStorage<Settings>('focus_settings', DEFAULT_SETTINGS);
  const [tasks, setTasks] = useLocalStorage<Task[]>('focus_tasks', []);
  const [sessions, setSessions] = useLocalStorage<Session[]>('focus_sessions', []);
  const [statsHistory, setStatsHistory] = useLocalStorage<DailyStats[]>('focus_stats_history', []);

  // Compute Today's Stats
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  const todayStats: DailyStats = statsHistory.find(s => s.date === todayStr) || {
    date: todayStr,
    completedMinutes: 0,
    goalMinutes: settings.dailyGoalMinutes,
  };

  const updateTodayStats = (minutesToAdd: number) => {
    setStatsHistory(prev => {
      const existing = prev.find(s => s.date === todayStr);
      if (existing) {
        return prev.map(s => 
          s.date === todayStr 
            ? { ...s, completedMinutes: s.completedMinutes + minutesToAdd, goalMinutes: settings.dailyGoalMinutes }
            : s
        );
      } else {
        return [...prev, { date: todayStr, completedMinutes: minutesToAdd, goalMinutes: settings.dailyGoalMinutes }];
      }
    });
  };

  // Add Session Record
  const addSession = (session: Session) => {
    setSessions(prev => [session, ...prev]);
  };

  // Task Handlers
  const addTask = (title: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      completed: false,
      createdAt: Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };
  
  const deleteTask = (taskId: string) => {
     setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Derived Values
  const getStreak = () => {
    // Simple streak calculation: count consecutive days where completedMinutes >= goalMinutes (or just > 0 for simpler streak)
    // We'll count consecutive days > 0 for motivation.
    let streak = 0;
    const sortedStats = [...statsHistory].sort((a, b) => b.date.localeCompare(a.date));
    
    // Check if today is active
    
    for (const stat of sortedStats) {
      // Simplify logic for demo purposes: just count backward
      if (stat.completedMinutes > 0) {
        streak++;
      } else {
        break; 
      }
    }
    
    // If today hasn't started but yesterday was active, streak is maintained.
    // A robust impl would check actual date gaps.
    return streak;
  };

  return {
    settings,
    setSettings,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    sessions,
    addSession,
    todayStats,
    updateTodayStats,
    statsHistory,
    streak: getStreak(),
  };
}
