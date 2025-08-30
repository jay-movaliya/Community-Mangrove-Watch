import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Activity,
  BarChart3
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
import { reportsAPI, usersAPI } from '../services/api';

const Analytics = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [reportsResponse, usersResponse, monthlyResponse] = await Promise.all([
        reportsAPI.getAllReports(),
        usersAPI.getAllUsers(),
        reportsAPI.getMonthlyReports()
      ]);

      if (reportsResponse.success) {
        setReports(reportsResponse.data || []);
      }
      if (usersResponse.success) {
        setUsers(usersResponse.data || []);
      }
      if (monthlyResponse.success) {
        setMonthlyReports(monthlyResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate real-time analytics
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const acceptedReports = reports.filter(r => r.status === 'accepted').length;
  const rejectedReports = reports.filter(r => r.status === 'rejected').length;
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0);

  // Use real monthly data from API, fallback to sample data if empty
  const monthlyData = monthlyReports.length > 0 ? monthlyReports : [
    { month: 'Jan', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'Feb', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'Mar', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'Apr', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'May', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'Jun', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'Jul', reports: 0, accepted: 0, rejected: 0, pending: 0 },
    { month: 'Current', reports: totalReports, accepted: acceptedReports, rejected: rejectedReports, pending: pendingReports }
  ];

  // Report types from real data
  const reportTypesCount = reports.reduce((acc, report) => {
    const type = report.type || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const reportTypes = Object.entries(reportTypesCount).map(([name, value], index) => ({
    name,
    value,
    color: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'][index % 6]
  }));

  // Top locations from real data
  const locationCounts = reports.reduce((acc, report) => {
    const location = report.location?.name || 'Unknown Location';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const topLocations = Object.entries(locationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([location, count]) => ({ location, reports: count }));

  // Calculate acceptance rate
  const acceptanceRate = totalReports > 0 ? ((acceptedReports / totalReports) * 100).toFixed(1) : 0;
  const userEngagement = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0;

  const kpiCards = [
    {
      title: 'Total Reports',
      value: totalReports.toString(),
      subtitle: `${pendingReports} pending`,
      icon: BarChart3,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: activeUsers.toString(),
      subtitle: `${userEngagement}% engagement`,
      icon: Users,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Acceptance Rate',
      value: `${acceptanceRate}%`,
      subtitle: `${acceptedReports} accepted`,
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Total Points',
      value: totalPoints.toString(),
      subtitle: 'Community rewards',
      icon: Award,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-4 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</p>
                  <p className="text-sm text-gray-500">{kpi.subtitle}</p>
                </div>
                <div className={`${kpi.bgColor} p-3 rounded-xl`}>
                  <Icon className={`h-8 w-8 ${kpi.textColor}`} />
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Reports Trend</h3>
            <button
              onClick={loadAnalyticsData}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, name === 'reports' ? 'Total Reports' : name]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="reports"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.3}
                name="Reports"
              />
              <Area
                type="monotone"
                dataKey="accepted"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                name="Accepted"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.2}
                name="Pending"
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
        {/* Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { status: 'Accepted', count: acceptedReports, color: '#22c55e' },
              { status: 'Pending', count: pendingReports, color: '#f59e0b' },
              { status: 'Rejected', count: rejectedReports, color: '#ef4444' }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Locations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Report Locations</h3>
          <div className="space-y-4">
            {topLocations.length > 0 ? (
              topLocations.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{location.location}</p>
                      <p className="text-sm text-gray-500">{location.reports} reports</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(location.reports / Math.max(...topLocations.map(l => l.reports))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No location data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Quick Stats</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reports Today</span>
              <span className="font-semibold text-gray-900">{reports.filter(r => r.date === new Date().toISOString().split('T')[0]).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Points/User</span>
              <span className="font-semibold text-gray-900">{totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Response Rate</span>
              <span className="font-semibold text-green-600">{totalReports > 0 ? Math.round(((acceptedReports + rejectedReports) / totalReports) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Performance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quality Score</span>
              <span className="font-semibold text-green-600">{acceptanceRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User Retention</span>
              <span className="font-semibold text-blue-600">{userEngagement}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">System Health</span>
              <span className="font-semibold text-green-600">Excellent</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {reports.slice(0, 3).map((report, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${report.status === 'accepted' ? 'bg-green-500' :
                    report.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{report.type}</p>
                  <p className="text-xs text-gray-500">{report.date}</p>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;