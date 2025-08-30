import React, { useState, useEffect } from 'react';
import { BarChart3, Activity } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import StatsCards from './StatsCards';
import ReportsMap from './ReportsMap';
import ReportsTable from './ReportsTable';
import Charts from './Charts';
import UsersManagement from './UsersManagement';
import Analytics from './Analytics';
import { sessionUtils, reportsAPI } from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    acceptedReports: 0,
    rejectedReports: 0
  });

  // Session validation and data loading
  useEffect(() => {
    // Check session validity on component mount
    if (!sessionUtils.isSessionValid()) {
      console.warn('Invalid session detected, logging out...');
      onLogout();
      return;
    }

    // Set up session timeout check (every 5 minutes)
    const sessionCheckInterval = setInterval(() => {
      if (!sessionUtils.isSessionValid()) {
        console.warn('Session expired, logging out...');
        onLogout();
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Track user activity
    const handleUserActivity = () => {
      sessionUtils.updateSessionActivity();
    };

    // Add activity listeners
    document.addEventListener('mousedown', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('scroll', handleUserActivity);

    // Cleanup interval and listeners on unmount
    return () => {
      clearInterval(sessionCheckInterval);
      document.removeEventListener('mousedown', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('scroll', handleUserActivity);
    };
  }, [onLogout]);

  // Load real data from API
  useEffect(() => {
    const loadReportsData = async () => {
      try {
        setIsLoadingReports(true);
        console.log('📡 Loading reports data from API...');
        const result = await reportsAPI.getAllReports();

        if (result.success && result.data && Array.isArray(result.data)) {
          console.log('✅ Reports loaded successfully:', result.data.length, 'reports');
          setReports(result.data);

          // Calculate stats from real data with null checks
          const validReports = result.data.filter(r => r && typeof r === 'object');
          const totalReports = validReports.length;
          const pendingReports = validReports.filter(r => r.status === 'pending').length;
          const acceptedReports = validReports.filter(r => r.status === 'accepted').length;
          const rejectedReports = validReports.filter(r => r.status === 'rejected').length;

          setStats({
            totalReports,
            pendingReports,
            acceptedReports,
            rejectedReports
          });

          console.log('📊 Stats calculated:', {
            totalReports,
            pendingReports,
            acceptedReports,
            rejectedReports
          });
        } else {
          console.log('❌ Failed to load reports:', result.message);
          // Set empty data as fallback
          setReports([]);
          setStats({
            totalReports: 0,
            pendingReports: 0,
            acceptedReports: 0,
            rejectedReports: 0
          });
        }
      } catch (error) {
        console.error('❌ Error loading reports:', error);
        // Set empty data as fallback
        setReports([]);
        setStats({
          totalReports: 0,
          pendingReports: 0,
          acceptedReports: 0,
          rejectedReports: 0
        });
      } finally {
        setIsLoadingReports(false);
      }
    };

    loadReportsData();
  }, []);

  const handleReportAction = async (reportId, action) => {
    if (!Array.isArray(reports)) return;

    try {
      console.log('🔄 Processing report action:', { reportId, action });
      
      // Call the real API
      const result = await reportsAPI.updateReportStatus(reportId, action);
      
      if (result.success) {
        console.log('✅ Report status updated successfully');
        
        // Update local state only if API call was successful
        setReports(prevReports =>
          prevReports.map(report =>
            report && report.id === reportId
              ? { ...report, status: action }
              : report
          )
        );

        // Update stats with null checks
        const updatedReports = reports.map(report =>
          report && report.id === reportId
            ? { ...report, status: action }
            : report
        ).filter(Boolean);

        const validReports = updatedReports.filter(r => r && typeof r === 'object');
        const pendingReports = validReports.filter(r => r.status === 'pending').length;
        const acceptedReports = validReports.filter(r => r.status === 'accepted').length;
        const rejectedReports = validReports.filter(r => r.status === 'rejected').length;

        setStats(prev => ({
          ...prev,
          pendingReports,
          acceptedReports,
          rejectedReports
        }));

        // Show success message (you can add a toast notification here)
        console.log('📊 Stats updated:', { pendingReports, acceptedReports, rejectedReports });
        
      } else {
        console.error('❌ Failed to update report status:', result.message);
        // You can add error handling here (show toast notification, etc.)
        alert(`Failed to ${action} report: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error updating report status:', error);
      alert(`Error updating report status: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Admin'}! 👋</h1>
                    <p className="text-green-100 text-lg">Here's what's happening with mangrove conservation today.</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">94.2%</p>
                        <p className="text-sm text-green-100">Report Accuracy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <StatsCards stats={stats} />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Map Section - Takes 2/3 of the space */}
                <div className="xl:col-span-2">
                  <ReportsMap reports={reports} isLoading={isLoadingReports} />
                </div>

                {/* Quick Charts Section - Takes 1/3 of the space */}
                <div className="xl:col-span-1">
                  <div className="space-y-6">
                    {/* Quick Stats Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">Quick Overview</h3>
                            <p className="text-sm text-gray-500">Key metrics at a glance</p>
                          </div>
                        </div>
                      </div>

                      {/* Mini Stats */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-700">Accepted</span>
                          </div>
                          <span className="text-xl font-bold text-green-600">
                            {Array.isArray(reports) ? reports.filter(r => r && r.status === 'accepted').length : 0}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="font-medium text-gray-700">Pending</span>
                          </div>
                          <span className="text-xl font-bold text-yellow-600">
                            {Array.isArray(reports) ? reports.filter(r => r && r.status === 'pending').length : 0}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="font-medium text-gray-700">Rejected</span>
                          </div>
                          <span className="text-xl font-bold text-red-600">
                            {Array.isArray(reports) ? reports.filter(r => r && r.status === 'rejected').length : 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Activity className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                            <p className="text-sm text-gray-500">Latest report updates</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {isLoadingReports ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                            <span className="ml-2 text-sm text-gray-500">Loading reports...</span>
                          </div>
                        ) : reports && Array.isArray(reports) && reports.length > 0 ? (
                          reports.slice(0, 3).map((report, index) => {
                            // Ensure report is valid object
                            if (!report || typeof report !== 'object') {
                              return null;
                            }

                            // Safely get location name
                            let locationName = 'Unknown Location';
                            if (report.location) {
                              if (typeof report.location === 'string') {
                                locationName = report.location;
                              } else if (typeof report.location === 'object' && report.location.name) {
                                locationName = report.location.name;
                              }
                            }

                            return (
                              <div key={report.id || index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className={`w-2 h-2 rounded-full ${report.status === 'accepted' ? 'bg-green-500' :
                                  report.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 truncate">
                                    {String(report.type || 'Unknown Type')}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {String(locationName)}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {String(report.date || 'No Date')}
                                </span>
                              </div>
                            );
                          }).filter(Boolean)
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500">No reports available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Width Charts Section */}
              <div className="mt-8">
                <Charts reports={reports} />
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Reports Management</h1>
                <p className="text-blue-100">Review and manage incident reports from the community</p>
              </div>
              <ReportsTable
                reports={reports}
                onReportAction={handleReportAction}
              />
            </div>
          )}

          {activeTab === 'map' && (
            <div className="h-[calc(100vh-140px)]">
              <ReportsMap reports={reports} fullScreen={true} isLoading={isLoadingReports} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
                <p className="text-purple-100">Comprehensive insights and data visualization</p>
              </div>
              <Analytics />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Community Management</h1>
                <p className="text-indigo-100">Manage community members and their activities</p>
              </div>
              <UsersManagement />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;