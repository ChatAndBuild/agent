import React, { useEffect, useState } from 'react';
import { Brain, Menu, Bell, User, BarChart, Database } from 'lucide-react';

const Header: React.FC = () => {
  const [sourceCount, setSourceCount] = useState(90000000);
  
  // Simulate increasing source count - matching the same logic in DataSourcesVisualizer
  useEffect(() => {
    const interval = setInterval(() => {
      setSourceCount(prev => prev + Math.floor(Math.random() * 10));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format the large number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm border-b border-white/20 sticky top-0 z-20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg text-white">
              <Brain className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">ChatAndBuild Agents</span>
            <div className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs font-medium text-white tech-label">Beta</div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <a href="#" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-white font-medium bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
              <BarChart className="h-4 w-4 text-white" />
              <span>Dashboard</span>
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-md transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <div className="absolute top-0 right-0 h-2 w-2 bg-red-400 rounded-full"></div>
            </div>
            
            <div className="flex items-center gap-2 border border-white/30 rounded-full pl-2 pr-1 py-1 bg-white/10">
              <span className="text-sm font-medium text-white">Admin</span>
              <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
            </div>
            
            <button className="md:hidden text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-md transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
