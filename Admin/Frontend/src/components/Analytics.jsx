import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MapPin, 
  Clock,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const Analytics = () => {
  // Sample data for analytics
  const monthlyReports = [
    { month: 'Jan', reports: 45, accepted: 32, rejected: 8, pending: 5 },
    { month: 'Feb', reports: 52, accepted: 38, rejected: 9, pending: 5 },
    { month: 'Mar', reports: 48, accepted: 35, rejected: 7, pending: 6 },
    { month: 'Apr', reports: 61, accepted: 44, rejected: 10, pending: 7 },
    { month: 'May', reports: 55, accepted: 40, rejected: 9, pending: 6 },
    { month: 'Jun', reports: 67, accepted: 48, rejected: 12, pending: 7 }
  ];

  const reportTypes = [
    { name: 'Illegal Cutting', value: 45, color: '#ef4444' },
    { name: 'Waste Dumping', value: 32, color: '#f59e0b' },
    { name: 'Pollution', value: 28, color: '#8b5cf6' },
    { name: 'Other', value: 15, color: '#6b7280' }
  ];

  const locationData = [
    { location: 'Sundarbans', reports: 34, severity: 'high' },
    { location: 'Cox\'s Bazar', reports: 28, severity: 'medium' },
    { location: 'Khulna', reports: 22, severity: 'high' },
    { location: 'Teknaf', reports: 18, severity: 'low' },
    { location: 'Dhaka Coast', reports: 15, severity: 'medium' }
  ];

  const responseTimeData = [
    { day: 'Mon', avgTime: 2.3 },
    { day: 'Tue', avgTime: 1.8 },
    { day: 'Wed', avgTime: 2.1 },
    { day: 'Thu', avgTime: 1.9 },
    { day: 'Fri', avgTime: 2.4 },
    { day: 'Sat', avgTime: 3.1 },
    { day: 'Sun', avgTime: 2.8 }
  ];

  const kpiCards = [
    {
      title: 'Average Response Time',
      value: '2.3 hours',
      change: '-15%',
      changeType: 'decrease',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'User Engagement',
      value: '89%',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Report Accuracy',
      value: '94.2%',
      change: '+3%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Critical Incidents',
      value: '23',
      change: '+8%',
      changeType: 'increase',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.changeType === 'increase' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`bg-${kpi.color}-50 p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 text-${kpi.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Reports Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Reports Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyReports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="reports" 
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Report Types Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {reportTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {reportTypes.map((type, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: type.color }}
                ></div>
                <span className="text-sm text-gray-600">{type.name} ({type.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Reports by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="location" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="reports" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Response Time */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Response Time (Hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="avgTime" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Statistics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Location-wise Detailed Statistics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Reports
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acceptance Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Response Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locationData.map((location, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{location.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {location.reports}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      location.severity === 'high' ? 'bg-red-100 text-red-800' :
                      location.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {location.severity.charAt(0).toUpperCase() + location.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.floor(Math.random() * 20 + 75)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(Math.random() * 2 + 1).toFixed(1)}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;