import { DailyBarChart, WeeklySummary, StreakHeatmap, AllTimeStats } from '../components/AnalyticsComponents';

export function AnalyticsView() {
  return (
    <div className="h-full flex flex-col pt-4">
      <header className="mb-8 pl-1">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-gray-400 mt-1">Track your progress and consistency over time.</p>
      </header>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="min-h-[300px]">
          <DailyBarChart />
        </div>
        <div className="min-h-[300px]">
          <WeeklySummary />
        </div>
        <div className="min-h-[300px] lg:col-span-2">
          <StreakHeatmap />
        </div>
        <div className="min-h-[300px] lg:col-span-2">
          <AllTimeStats />
        </div>
      </div>
    </div>
  );
}
