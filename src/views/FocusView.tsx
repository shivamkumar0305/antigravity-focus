import { FocusTimerPanel } from '../components/FocusTimerPanel';
import { DailyProgressPanel } from '../components/DailyProgressPanel';
import { TasksPanel } from '../components/TasksPanel';

export function FocusView() {
  return (
    <div className="h-full flex flex-col pt-4">
      <header className="mb-8 pl-1">
        <h2 className="text-3xl font-bold tracking-tight">Focus</h2>
        <p className="text-gray-400 mt-1">Ready to get some work done?</p>
      </header>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-h-[400px]">
          <FocusTimerPanel />
        </div>
        <div className="min-h-[400px]">
          <DailyProgressPanel />
        </div>
      </div>
      
      <div className="mt-2">
        <TasksPanel />
      </div>
    </div>
  );
}
