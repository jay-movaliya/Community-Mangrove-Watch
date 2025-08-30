import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Award,
    Calendar,
    Search,
    Filter,
    MoreVertical,
    Ban,
    CheckCircle
} from 'lucide-react';
import { usersAPI } from '../services/api';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await usersAPI.getAllUsers();
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error loading users:', error);
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
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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
                            <option value="banned">Banned</option>
                        </select>
                    </div>
                </div>
            </div>

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
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                                        user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
                                <MapPin className="h-4 w-4 mr-2" />
                                {user.location}
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
                        <div className="flex space-x-2 mt-4">
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
                        </div>
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