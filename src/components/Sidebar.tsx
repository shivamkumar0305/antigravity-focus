import { Timer, BarChart2, Settings } from 'lucide-react';

export type ViewType = 'focus' | 'analytics' | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'focus' as ViewType, label: 'Focus', icon: Timer },
    { id: 'analytics' as ViewType, label: 'Analytics', icon: BarChart2 },
    { id: 'settings' as ViewType, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-64 h-full glass-panel flex flex-col px-4 py-8 select-none">
      <div className="mb-10 px-4">
        <h1 className="text-xl font-semibold tracking-tight">Focus Sessions</h1>
      </div>
      
      <div className="flex flex-col gap-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = currentView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 border-none outline-none ${
                isActive 
                  ? 'bg-blue-500/10 text-blue-500 font-medium' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-blue-500' : ''} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-auto px-4 pb-4">
        <div className="text-xs text-gray-600 dark:text-gray-500">v1.0.0</div>
      </div>
    </nav>
  );
}
