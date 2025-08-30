import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, Filter } from 'lucide-react';

const Charts = ({ reports }) => {

  // Prepare data for charts
  const reportsByType = reports.reduce((acc, report) => {
    acc[report.type] = (acc[report.type] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.entries(reportsByType).map(([type, count]) => ({
    type: type.replace(' ', '\n'),
    count,
    fullType: type
  }));

  const statusData = [
    { 
      name: 'Pending', 
      value: reports.filter(r => r.status === 'pending').length, 
      color: '#f59e0b',
      gradient: 'from-yellow-400 to-orange-500'
    },
    { 
      name: 'Accepted', 
      value: reports.filter(r => r.status === 'accepted').length, 
      color: '#10b981',
      gradient: 'from-green-400 to-green-600'
    },
    { 
      name: 'Rejected', 
      value: reports.filter(r => r.status === 'rejected').length, 
      color: '#ef4444',
      gradient: 'from-red-400 to-red-600'
    }
  ];

  // Enhanced weekly trend data
  const weeklyData = [
    { week: 'Week 1', reports: 12, accepted: 8, rejected: 2, pending: 2 },
    { week: 'Week 2', reports: 19, accepted: 14, rejected: 3, pending: 2 },
    { week: 'Week 3', reports: 8, accepted: 6, rejected: 1, pending: 1 },
    { week: 'Week 4', reports: 15, accepted: 11, rejected: 2, pending: 2 },
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };



  return (
    <div className="space-y-8">
      {/* Charts Grid - Horizontal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Reports by Type */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <BarChart3 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">By Type</h3>
                <p className="text-xs text-gray-500">Categories</p>
              </div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={typeData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="type" 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#barGradient)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <PieChartIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">Status</h3>
                <p className="text-xs text-gray-500">Distribution</p>
              </div>
            </div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <defs>
                {statusData.map((entry, index) => (
                  <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.6}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${index})`}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">Trends</h3>
                <p className="text-xs text-gray-500">Weekly</p>
              </div>
            </div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="reports" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fill="url(#areaGradient)"
                name="Total Reports"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-lg font-bold text-green-700">+15%</p>
          <p className="text-xs text-green-600 font-medium">Growth Rate</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2">
            <Activity className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-lg font-bold text-blue-700">54</p>
          <p className="text-xs text-blue-600 font-medium">This Month</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-xl">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2">
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-lg font-bold text-purple-700">13.5</p>
          <p className="text-xs text-purple-600 font-medium">Avg/Week</p>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-xl">
          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mx-auto mb-2">
            <Filter className="h-4 w-4 text-orange-600" />
          </div>
          <p className="text-lg font-bold text-orange-700">94.2%</p>
          <p className="text-xs text-orange-600 font-medium">Accuracy</p>
        </div>
      </div>
    </div>
  );
};

export default Charts;