import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, Minus } from 'lucide-react';
import { useAppStore } from '../store';

// A simple circular progress component using SVG
function CircularProgress({ percentage, label, sublabel }: { percentage: number, label: string, sublabel?: string }) {
  const radius = 120;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="rgba(255,255,255,0.08)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#007AFF"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-5xl font-semibold tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {label}
        </span>
        {sublabel && (
          <span className="text-gray-400 mt-2 text-sm uppercase tracking-widest">{sublabel}</span>
        )}
      </div>
    </div>
  );
}

export function FocusTimerPanel() {
  const { settings, addSession, updateTodayStats } = useAppStore();
  const [duration, setDuration] = useState(settings.defaultSessionDuration); // in minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [isActive, setIsActive] = useState(false);
  
  // Track last minute update to avoid over-counting in fast modes,
  // but for real implementation we just add 1 minute every 60 seconds of real-time passing.
  const secondsElapsedThisMinute = useRef(0);

  useEffect(() => {
    // Reset timer when duration changes, but only if not active
    if (!isActive) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isActive]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        secondsElapsedThisMinute.current += 1;
        
        // Every 60 seconds of active focus, update the daily stats immediately
        if (secondsElapsedThisMinute.current === 60) {
          updateTodayStats(1);
          secondsElapsedThisMinute.current = 0;
        }
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Session finished
      setIsActive(false);
      addSession({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now() - duration * 60 * 1000,
        durationMinutes: duration,
        actualDurationMinutes: duration
      });
      // Any remaining seconds (if we paused/started) wouldn't be enough for a full minute,
      // but maybe we could round up. For now, exact minutes are tracked.
      secondsElapsedThisMinute.current = 0;
      setTimeLeft(duration * 60);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, duration, addSession, updateTodayStats]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const stopTimer = () => {
    setIsActive(false);
    
    // Save partial session if they worked more than 1 minute
    const minutesFocused = duration - Math.ceil(timeLeft / 60);
    if (minutesFocused > 0) {
      addSession({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now() - (duration * 60 - timeLeft) * 1000,
        durationMinutes: duration,
        actualDurationMinutes: minutesFocused
      });
      // The daily stats were being updated minute-by-minute, so no need to add here.
    }
    
    secondsElapsedThisMinute.current = 0;
    setTimeLeft(duration * 60);
  };

  const adjustDuration = (amount: number) => {
    if (!isActive) {
      setDuration(prev => Math.max(1, Math.min(120, prev + amount)));
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const progressPercentage = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="glass-card p-8 flex flex-col items-center justify-between h-full relative overflow-hidden">
      {/* Subtle top background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-blue-500/5 blur-3xl pointer-events-none" />
      
      <div className="w-full flex justify-between items-center mb-4 z-10">
        <h3 className="text-lg font-medium text-gray-200">Focus Session</h3>
        <span className="text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full font-medium">
          {isActive ? 'In Progress' : 'Ready'}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 py-6">
        <CircularProgress 
          percentage={progressPercentage} 
          label={timeString} 
          sublabel="Focus" 
        />
        
        {!isActive && (
          <div className="flex items-center gap-6 mt-8">
            <button 
              onClick={() => adjustDuration(-5)}
              className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors border-none bg-transparent"
            >
              <Minus size={20} />
            </button>
            <span className="text-gray-300 font-medium">{duration} min</span>
            <button 
              onClick={() => adjustDuration(5)}
              className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors border-none bg-transparent"
            >
              <Plus size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center gap-4 mt-4 z-10">
        <button
          onClick={toggleTimer}
          className={`flex-1 max-w-[200px] py-3.5 px-6 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            isActive 
              ? 'bg-white/5 text-white hover:bg-white/10 border border-white/10' 
              : 'bg-[#007AFF] text-white hover:bg-[#0066d6] shadow-[0_0_20px_rgba(0,122,255,0.3)]'
          }`}
        >
          {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        
        {isActive && (
          <button
            onClick={stopTimer}
            className="py-3.5 px-4 rounded-full bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center"
            title="Stop Timer"
          >
            <Square size={16} fill="currentColor" />
          </button>
        )}
      </div>
    </div>
  );
}
