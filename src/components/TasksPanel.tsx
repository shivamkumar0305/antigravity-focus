import React, { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../store';

export function TasksPanel() {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { tasks, addTask, toggleTask, deleteTask } = useAppStore();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col h-64 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-200">Tasks</h3>
        <span className="text-xs text-gray-500 font-medium bg-white/5 px-2 py-1 rounded">
          {tasks.filter(t => t.completed).length} / {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-2">
        {tasks.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">
            No tasks yet. Add one below.
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-white/5 hover:bg-white/5 transition-all ${task.completed ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    task.completed 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-gray-500 hover:border-gray-300 transparent'
                  }`}
                >
                  {task.completed && <Check size={12} strokeWidth={3} />}
                </button>
                <span className={`truncate text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                  {task.title}
                </span>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddTask} className="relative mt-auto">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
        <button 
          type="submit"
          disabled={!newTaskTitle.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
        </button>
      </form>
    </div>
  );
}
