import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  MapPin, 
  Users, 
  BarChart3,
  Shield,
  Leaf,
  ChevronRight,
  Activity,
  Award,
  TrendingUp
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, user }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      badge: null,
      description: 'Main overview & insights'
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: FileText, 
      badge: '23',
      description: 'Manage incident reports'
    },
    { 
      id: 'map', 
      label: 'Map View', 
      icon: MapPin, 
      badge: null,
      description: 'Geographic visualization'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      badge: null,
      description: 'Data insights & trends'
    },
    { 
      id: 'users', 
      label: 'Community', 
      icon: Users, 
      badge: '1.2k',
      description: 'User management'
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 w-72 shadow-xl flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
            <Leaf className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Mangrove Watch</h1>
            <p className="text-sm text-gray-500 font-medium">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-1">
              <Activity className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs font-semibold text-gray-700">156</p>
            <p className="text-xs text-gray-500">Reports</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-1">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs font-semibold text-gray-700">1.2k</p>
            <p className="text-xs text-gray-500">Users</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg mx-auto mb-1">
              <Award className="h-4 w-4 text-yellow-600" />
            </div>
            <p className="text-xs font-semibold text-gray-700">94%</p>
            <p className="text-xs text-gray-500">Accuracy</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full group relative flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 transform ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:bg-white hover:shadow-md hover:scale-102'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-white bg-opacity-20' 
                        : 'bg-gray-100 group-hover:bg-green-100'
                    }`}>
                      <Icon className={`h-5 w-5 transition-colors ${
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-600 group-hover:text-green-600'
                      }`} />
                    </div>
                    <div>
                      <span className={`font-semibold text-sm ${
                        isActive ? 'text-white' : 'text-gray-700'
                      }`}>
                        {item.label}
                      </span>
                      {(isHovered || isActive) && (
                        <p className={`text-xs transition-opacity duration-200 ${
                          isActive ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        isActive 
                          ? 'bg-white bg-opacity-20 text-white' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${
                      isActive 
                        ? 'text-white transform rotate-90' 
                        : 'text-gray-400 group-hover:text-green-500'
                    }`} />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin Info */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl">
          <div className="relative">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-full">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
          </div>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;