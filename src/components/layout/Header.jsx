import React from 'react';
import { Vote, Info, Calendar, MapPin, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-600 rounded-lg text-white">
            <Vote size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 hidden sm:inline">VoteSmart</span>
        </div>
        
        <nav className="flex items-center gap-1 sm:gap-4">
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
            <Calendar size={18} />
            <span className="hidden md:inline">Timeline</span>
          </button>
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
            <MapPin size={18} />
            <span className="hidden md:inline">Polling</span>
          </button>
          <button className="p-2 text-primary-600 bg-primary-50 rounded-lg flex items-center gap-2 text-sm font-medium">
            <Sparkles size={18} />
            <span className="hidden md:inline">AI Buster</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
