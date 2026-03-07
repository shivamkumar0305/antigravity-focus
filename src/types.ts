export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface Session {
  id: string;
  timestamp: number; // Start time
  durationMinutes: number; // Configured duration
  actualDurationMinutes: number; // Actual time spent focusing
  taskId?: string; // Optional linked task
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  completedMinutes: number;
  goalMinutes: number;
}

export interface Settings {
  dailyGoalMinutes: number;
  skipBreaks: boolean;
  defaultSessionDuration: number;
}
