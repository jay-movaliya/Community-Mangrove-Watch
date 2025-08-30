import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Leaf, Shield, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error and success when user starts typing
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            console.log('🔐 Attempting login for:', formData.email);
            
            // Call the real admin login API
            const result = await authAPI.adminLogin(formData.email, formData.password);
            console.log('📡 Login API response:', result);

            if (result.success) {
                console.log('✅ Login API successful!');
                
                // Login successful - prepare user data
                const userData = {
                    email: formData.email,
                    name: result.data.name || result.data.admin_name || 'Admin User',
                    role: result.data.role || result.data.admin_role || 'Administrator',
                    id: result.data.id || result.data.admin_id,
                    loginTime: new Date().toISOString(),
                    lastActivity: new Date().toISOString(),
                    ...result.data
                };
                
                console.log('👤 Prepared user data:', userData);
                console.log('🎯 Calling onLogin callback to redirect to dashboard...');
                
                // This will trigger the redirect to dashboard
                onLogin(userData);
            } else {
                // Login failed
                console.log('❌ Login failed:', result.message);
                setError(result.message || 'Invalid email or password');
            }
        } catch (err) {
            console.error('❌ Login error:', err);
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                setError('Network error. Please check your internet connection.');
            } else if (err.message.includes('JSON')) {
                setError('Server response error. Please try again.');
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-60 h-60 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100 rounded-full opacity-10"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                <Leaf className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <h1 className="text-xl font-bold text-white mb-1">Mangrove Watch</h1>
                        <p className="text-green-100 text-sm font-medium">Admin Dashboard</p>
                    </div>

                    {/* Login Form */}
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center mb-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <Shield className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome Back</h2>
                            <p className="text-gray-600 text-sm">Sign in to access the admin dashboard</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500"
                                        placeholder="Enter your email address"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500"
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>



                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                    </div>
                </div>

        
            </div>
        </div>
    );
};

export default Login;