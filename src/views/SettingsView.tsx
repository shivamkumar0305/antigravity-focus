import React from 'react';
import { useAppStore, DEFAULT_SETTINGS } from '../store';
import { Save, RefreshCw } from 'lucide-react';

export function SettingsView() {
  const { settings, setSettings } = useAppStore();
  
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dailyGoal = Number(formData.get('dailyGoal')) || DEFAULT_SETTINGS.dailyGoalMinutes;
    const defaultDuration = Number(formData.get('defaultDuration')) || DEFAULT_SETTINGS.defaultSessionDuration;
    const skipBreaks = formData.get('skipBreaks') === 'on';
    
    setSettings({
      dailyGoalMinutes: dailyGoal,
      defaultSessionDuration: defaultDuration,
      skipBreaks
    });
    
    // Quick visual feedback
    const btn = document.getElementById('save-btn');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Saved</span>';
      btn.classList.add('bg-green-600');
      btn.classList.remove('bg-blue-600');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-600');
        btn.classList.add('bg-blue-600');
      }, 2000);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      window.localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="h-full flex flex-col pt-4 overflow-y-auto">
      <header className="mb-8 pl-1">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-gray-400 mt-1">Configure your focus sessions experience.</p>
      </header>
      
      <div className="max-w-2xl w-full">
        <form onSubmit={handleSave} className="glass-card p-8 flex flex-col gap-6">
          <h3 className="text-lg font-medium border-b border-white/10 pb-4">Preferences</h3>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="dailyGoal" className="text-sm font-medium text-gray-300">
                Daily Goal (minutes)
              </label>
              <input 
                type="number" 
                id="dailyGoal"
                name="dailyGoal"
                defaultValue={settings.dailyGoalMinutes}
                min={1}
                max={1440}
                className="bg-black/20 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 w-full md:w-1/2"
              />
              <p className="text-xs text-gray-500">How many minutes do you want to focus each day?</p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="defaultDuration" className="text-sm font-medium text-gray-300">
                Default Session Duration (minutes)
              </label>
              <input 
                type="number" 
                id="defaultDuration"
                name="defaultDuration"
                defaultValue={settings.defaultSessionDuration}
                min={1}
                max={120}
                className="bg-black/20 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 w-full md:w-1/2"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  id="skipBreaks"
                  name="skipBreaks"
                  defaultChecked={settings.skipBreaks}
                  className="peer sr-only"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 transition-colors"></div>
              </div>
              <label htmlFor="skipBreaks" className="text-sm font-medium text-gray-300 cursor-pointer select-none">
                Skip Breaks
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button 
              id="save-btn"
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2 border-none"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>

        <div className="mt-8 glass-card p-8 border border-red-500/20 bg-red-500/5">
          <h3 className="text-lg font-medium text-red-400 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-400 mb-4">
            Resetting your data will permanently delete all your tasks, stats history, and sessions.
          </p>
          <button 
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
}
