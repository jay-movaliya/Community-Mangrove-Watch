import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Calendar } from 'lucide-react';
import { reportsAPI } from '../services/api';

const Charts = ({ reports }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMonthlyData();
  }, []);

  const loadMonthlyData = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getMonthlyReports();
      if (response.success && response.data) {
        setMonthlyData(response.data);
      }
    } catch (error) {
      console.error('Error loading monthly data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Use real monthly data or fallback
  const chartMonthlyData = monthlyData.length > 0 ? monthlyData : [
    { month: 'Jan', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'Feb', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'Mar', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'Apr', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'May', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'Jun', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'Jul', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'Current', reports: reports.length, accepted: reports.filter(r => r.status === 'accepted').length, rejected: reports.filter(r => r.status === 'rejected').length, pending: reports.filter(r => r.status === 'pending').length }
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
            <AreaChart data={chartMonthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
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

  
    </div>
  );
};

export default Charts;