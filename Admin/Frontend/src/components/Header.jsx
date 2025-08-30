import React from 'react';
import { Search, User, LogOut, HelpCircle, Activity, Clock } from 'lucide-react';

const Header = ({ user, onLogout }) => {

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <input
              type="text"
              placeholder="Search reports, users, locations..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-sm font-medium placeholder-gray-500"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="hidden md:flex items-center space-x-4 mr-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700">System Online</span>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">2.3h Avg Response</span>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500 font-medium">{user?.role || 'Administrator'}</p>
            </div>
            
            <div className="relative group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg cursor-pointer transform transition-transform group-hover:scale-105">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>
            
            <button 
              onClick={onLogout}
              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group relative"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;