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

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    acceptedReports: 0,
    rejectedReports: 0
  });

  // Dummy data for demonstration
  useEffect(() => {
    const dummyReports = [
      {
        id: 1,
        type: 'Illegal Cutting',
        location: { lat: 23.8103, lng: 90.4125, name: 'Sundarbans, Bangladesh' },
        reporter: 'John Doe',
        date: '2025-01-15',
        status: 'pending',
        severity: 'high',
        description: 'Large scale mangrove cutting observed',
        image: '/api/placeholder/300/200',
        points: 50
      },
      {
        id: 2,
        type: 'Waste Dumping',
        location: { lat: 22.3569, lng: 91.7832, name: 'Cox\'s Bazar, Bangladesh' },
        reporter: 'Jane Smith',
        date: '2025-01-14',
        status: 'accepted',
        severity: 'medium',
        description: 'Plastic waste dumped in mangrove area',
        image: '/api/placeholder/300/200',
        points: 30
      },
      {
        id: 3,
        type: 'Illegal Cutting',
        location: { lat: 21.4272, lng: 92.0058, name: 'Teknaf, Bangladesh' },
        reporter: 'Mike Johnson',
        date: '2025-01-13',
        status: 'rejected',
        severity: 'low',
        description: 'Suspected illegal cutting activity',
        image: '/api/placeholder/300/200',
        points: 0
      },
      {
        id: 4,
        type: 'Pollution',
        location: { lat: 22.8456, lng: 89.5403, name: 'Khulna, Bangladesh' },
        reporter: 'Sarah Wilson',
        date: '2025-01-12',
        status: 'pending',
        severity: 'high',
        description: 'Chemical pollution detected in water',
        image: '/api/placeholder/300/200',
        points: 40
      },
      {
        id: 5,
        type: 'Waste Dumping',
        location: { lat: 23.7104, lng: 90.4074, name: 'Dhaka, Bangladesh' },
        reporter: 'Alex Brown',
        date: '2025-01-11',
        status: 'accepted',
        severity: 'medium',
        description: 'Industrial waste near mangrove coast',
        image: '/api/placeholder/300/200',
        points: 35
      }
    ];

    setReports(dummyReports);
    
    const totalReports = dummyReports.length;
    const pendingReports = dummyReports.filter(r => r.status === 'pending').length;
    const acceptedReports = dummyReports.filter(r => r.status === 'accepted').length;
    const rejectedReports = dummyReports.filter(r => r.status === 'rejected').length;

    setStats({
      totalReports,
      pendingReports,
      acceptedReports,
      rejectedReports
    });
  }, []);

  const handleReportAction = (reportId, action) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === reportId 
          ? { ...report, status: action }
          : report
      )
    );

    // Update stats
    const updatedReports = reports.map(report => 
      report.id === reportId 
        ? { ...report, status: action }
        : report
    );
    
    const pendingReports = updatedReports.filter(r => r.status === 'pending').length;
    const acceptedReports = updatedReports.filter(r => r.status === 'accepted').length;
    const rejectedReports = updatedReports.filter(r => r.status === 'rejected').length;

    setStats(prev => ({
      ...prev,
      pendingReports,
      acceptedReports,
      rejectedReports
    }));
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
                  <ReportsMap reports={reports} />
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
                          <span className="text-xl font-bold text-green-600">{reports.filter(r => r.status === 'accepted').length}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="font-medium text-gray-700">Pending</span>
                          </div>
                          <span className="text-xl font-bold text-yellow-600">{reports.filter(r => r.status === 'pending').length}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="font-medium text-gray-700">Rejected</span>
                          </div>
                          <span className="text-xl font-bold text-red-600">{reports.filter(r => r.status === 'rejected').length}</span>
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
                        {reports.slice(0, 3).map((report, index) => (
                          <div key={report.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className={`w-2 h-2 rounded-full ${
                              report.status === 'accepted' ? 'bg-green-500' :
                              report.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{report.type}</p>
                              <p className="text-xs text-gray-500">{report.location.name}</p>
                            </div>
                            <span className="text-xs text-gray-400">{report.date}</span>
                          </div>
                        ))}
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
              <ReportsMap reports={reports} fullScreen={true} />
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