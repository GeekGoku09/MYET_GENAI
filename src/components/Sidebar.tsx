import React from 'react';
import { UserProfile } from '../types';
import { Home, Newspaper, Eye, Activity, Brain, Bookmark, Settings, LogOut, TrendingUp } from 'lucide-react';

interface SidebarProps {
  user: UserProfile;
  activeSection: string;
  setActiveSection: (section: string) => void;
  onReset: () => void;
}

export default function Sidebar({ user, activeSection, setActiveSection, onReset }: SidebarProps) {
  const navItems = [
    { id: 'briefing', label: 'My Briefing', icon: Home },
    { id: 'feed', label: 'My Feed', icon: Newspaper },
    { id: 'watchlist', label: 'My Watchlist', icon: Eye },
    { id: 'markets', label: 'Market Pulse', icon: Activity },
    { id: 'digest', label: 'AI Digest', icon: Brain },
    { id: 'saved', label: 'Saved Stories', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-[240px] h-screen bg-[#12121A] border-r border-[#2A2A3A] flex flex-col p-6 fixed left-0 top-0 z-20">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl italic tracking-tighter">ET</div>
        <h1 className="text-xl font-bold tracking-tight">My ET</h1>
      </div>

      <div className="flex items-center gap-3 p-3 bg-[#1A1A26] rounded-2xl mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
          {user.name.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-sm truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.role}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeSection === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-gray-400 hover:bg-[#1A1A26] hover:text-gray-200'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-[#2A2A3A] space-y-4">
        <div className="p-4 bg-[#1A1A26] rounded-2xl border border-[#2A2A3A]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Intelligence Score</span>
            <span className="text-xs font-bold text-blue-400">87%</span>
          </div>
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-blue-500 w-[87%]" />
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
            <TrendingUp size={10} />
            <span>+12% vs last week</span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-400/10 transition-all"
        >
          <LogOut size={18} />
          Reset Newsroom
        </button>
      </div>
    </div>
  );
}
