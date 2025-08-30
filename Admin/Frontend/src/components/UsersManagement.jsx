import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Award,
    Calendar,
    Search,
    Filter,
    MoreVertical,
    Ban,
    CheckCircle,
    RefreshCw
} from 'lucide-react';
import { usersAPI } from '../services/api';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await usersAPI.getAllUsers();
            if (response.success) {
                setUsers(response.data);
            } else {
                setError(response.message || 'Failed to load users');
            }
        } catch (error) {
            console.error('Error loading users:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={loadUsers}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Users Management</h2>
                        <p className="text-sm text-gray-600">Manage community reporters and their activities</p>
                    </div>
                    <button
                        onClick={loadUsers}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="all">All Users</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            {users.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Users</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {users.filter(user => user.status === 'active').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <Award className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Points</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {users.reduce((sum, user) => sum + user.points, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Mail className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {users.reduce((sum, user) => sum + user.totalReports, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <User className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.status === 'active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                {user.email}
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                {user.phone}
                            </div>

                    

                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                Joined {user.joinDate}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-lg font-semibold text-gray-800">{user.totalReports}</p>
                                <p className="text-xs text-gray-500">Total Reports</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold text-green-600">{user.acceptedReports}</p>
                                <p className="text-xs text-gray-500">Accepted</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center">
                                    <Award className="h-4 w-4 text-yellow-500 mr-1" />
                                    <p className="text-lg font-semibold text-yellow-600">{user.points}</p>
                                </div>
                                <p className="text-xs text-gray-500">Points</p>
                            </div>
                        </div>

                        {/* Actions */}
                        {/* <div className="flex space-x-2 mt-4">
                            {user.status === 'active' ? (
                                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                    <Ban className="h-4 w-4" />
                                    <span className="text-sm">Suspend</span>
                                </button>
                            ) : (
                                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm">Activate</span>
                                </button>
                            )}
                        </div> */}
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No users found matching your criteria</p>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;