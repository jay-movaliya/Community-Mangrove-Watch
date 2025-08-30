import React, { useState } from 'react';
import { 
  Eye, 
  Check, 
  X, 
  Filter, 
  Download, 
  MapPin, 
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const ReportsTable = ({ reports, onReportAction }) => {
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Reports Management</h2>
            <p className="text-sm text-gray-600 mt-2 font-medium">Review and manage all incident reports from the community</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            {/* Export */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reporter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={report.image}
                        alt="Report"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{report.type}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {report.description}
                      </div>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {report.date}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="font-medium">{report.location.name}</div>
                      <div className="text-xs text-gray-500">
                        {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="font-medium">{report.reporter}</div>
                      <div className="text-xs text-gray-500">Points: {report.points}</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(report.status)}
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(report.severity)}`}>
                    {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onReportAction(report.id, 'accepted')}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Accept Report"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onReportAction(report.id, 'rejected')}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Reject Report"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Report Details</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedReport.image}
                    alt="Report"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-lg font-semibold text-gray-800">{selectedReport.type}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-800">{selectedReport.location.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedReport.location.lat.toFixed(6)}, {selectedReport.location.lng.toFixed(6)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reporter</label>
                    <p className="text-gray-800">{selectedReport.reporter}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p className="text-gray-800">{selectedReport.date}</p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(selectedReport.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedReport.status)}`}>
                          {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Severity</label>
                      <div className="mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(selectedReport.severity)}`}>
                          {selectedReport.severity.charAt(0).toUpperCase() + selectedReport.severity.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-800 mt-1">{selectedReport.description}</p>
              </div>
              
              {selectedReport.status === 'pending' && (
                <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      onReportAction(selectedReport.id, 'accepted');
                      setSelectedReport(null);
                    }}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Check className="h-4 w-4" />
                    <span>Accept Report</span>
                  </button>
                  <button
                    onClick={() => {
                      onReportAction(selectedReport.id, 'rejected');
                      setSelectedReport(null);
                    }}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject Report</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;