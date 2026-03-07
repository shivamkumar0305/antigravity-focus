import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { ViewType } from './components/Sidebar';
import { FocusView } from './views/FocusView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('focus');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--background)]">
      {/* Background ambient light effects could go here */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Main Layout */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative z-10">
        <div className="h-full w-full max-w-6xl mx-auto p-8">
          {currentView === 'focus' && <FocusView />}
          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
}

export default App;
