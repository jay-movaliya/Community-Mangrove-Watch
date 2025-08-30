// API service for Mangrove Watch application
const API_BASE_URL = 'https://manishkumardev.me/mangrove';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Utility function to make authenticated API requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const sessionToken = sessionStorage.getItem('mangrove_session_token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  };

  if (sessionToken) {
    headers['Authorization'] = `Bearer ${sessionToken}`;
  }

  return fetch(url, {
    ...options,
    headers
  });
};

// Session management utilities
export const sessionUtils = {
  // Check if user session is valid
  isSessionValid: () => {
    const user = sessionStorage.getItem('mangrove_admin_user');
    const token = sessionStorage.getItem('mangrove_session_token');

    if (!user) {
      return false;
    }

    try {
      const userData = JSON.parse(user);
      const loginTime = userData.loginTime;

      // Check if session is older than 24 hours
      if (loginTime) {
        const sessionAge = Date.now() - new Date(loginTime).getTime();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (sessionAge > maxAge) {
          console.warn('Session expired due to age');
          sessionUtils.clearSession();
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error validating session:', error);
      sessionUtils.clearSession();
      return false;
    }
  },

  // Get current user from session
  getCurrentUser: () => {
    try {
      const user = sessionStorage.getItem('mangrove_admin_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user session:', error);
      sessionStorage.removeItem('mangrove_admin_user');
      return null;
    }
  },

  // Clear all session data
  clearSession: () => {
    console.log('🧹 Clearing all session data...');
    sessionStorage.removeItem('mangrove_admin_user');
    sessionStorage.removeItem('mangrove_session_token');
    console.log('✅ Session cleared');
  },

  // Update session timestamp
  updateSessionActivity: () => {
    const user = sessionUtils.getCurrentUser();
    if (user) {
      user.lastActivity = new Date().toISOString();
      sessionStorage.setItem('mangrove_admin_user', JSON.stringify(user));
      console.log('🔄 Session activity updated:', user.lastActivity);
    }
  }
};

export const reportsAPI = {
  // Get all reports from real API
  getAllReports: async () => {
    try {
      console.log('📡 Fetching reports from API...');

      const response = await fetch(`${API_BASE_URL}/admin/fetch.php`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('📥 Reports API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 Reports API Response data:', data);

      // Check for success in multiple formats
      const isSuccess = data.success === true || data.status === 'success';

      if (isSuccess && data.data) {
        console.log('✅ Reports fetched successfully:', data.data.length, 'reports');

        // Transform the data to match frontend format
        const transformedReports = data.data.map(report => {
          // Handle location data properly
          let locationData;
          if (typeof report.location === 'string') {
            locationData = {
              lat: 0,
              lng: 0,
              name: report.location
            };
          } else if (report.location && typeof report.location === 'object') {
            locationData = {
              lat: parseFloat(report.location.lat) || 0,
              lng: parseFloat(report.location.lng) || 0,
              name: report.location.name || 'Unknown Location'
            };
          } else {
            locationData = {
              lat: 0,
              lng: 0,
              name: 'Unknown Location'
            };
          }

          return {
            id: report.id,
            type: report.type || 'Unknown',
            location: locationData,
            reporter: report.reporter || 'Anonymous',
            date: report.date || new Date().toISOString().split('T')[0],
            status: report.status || 'pending',
            description: report.discription || report.description || 'No description provided',
            image: report.image ? `https://manishkumardev.me/mangrove/${report.image}` : 'https://via.placeholder.com/300x200/22c55e/ffffff?text=Report+Image',
            points: parseInt(report.point || report.points) || 0,
            reporterEmail: report.email || '',
            reporterPhone: report.phone || ''
          };
        });

        console.log('🔄 Transformed reports:', transformedReports);

        return {
          success: true,
          data: transformedReports,
          message: data.message || 'Reports fetched successfully'
        };
      } else {
        console.log('❌ Failed to fetch reports or no data');
        return {
          success: false,
          data: [],
          message: data.message || 'Failed to fetch reports'
        };
      }
    } catch (error) {
      console.error('❌ Reports API error:', error);
      return {
        success: false,
        data: [],
        message: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Update report status using real API
  updateReportStatus: async (reportId, status) => {
    try {
      console.log('📡 Updating report status:', { reportId, status });

      const response = await fetch(`${API_BASE_URL}/admin/accept_reject.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: reportId,
          status: status
        })
      });

      console.log('📥 Update Status API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 Update Status API Response data:', data);

      // Check for success
      const isSuccess = data.success === true || data.status === 'success';

      if (isSuccess) {
        console.log('✅ Report status updated successfully');
        return {
          success: true,
          message: data.message || `Report ${status} successfully`
        };
      } else {
        console.log('❌ Failed to update report status');
        return {
          success: false,
          message: data.message || 'Failed to update report status'
        };
      }
    } catch (error) {
      console.error('❌ Update Status API error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    await delay(200);
    return {
      success: true,
      data: {
        totalReports: 156,
        pendingReports: 23,
        acceptedReports: 98,
        rejectedReports: 35,
        totalUsers: 1247,
        activeUsers: 89,
        totalPoints: 15670,
        averageResponseTime: '2.3 hours'
      }
    };
  },

  // Get monthly reports data from real API
  getMonthlyReports: async () => {
    try {
      console.log('📡 Fetching monthly reports from API...');

      const response = await fetch(`${API_BASE_URL}/admin/monthly_report.php`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('📥 Monthly Reports API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Monthly Reports API Response data:', data);

      // Check for success
      const isSuccess = data.success === true || data.status === 'success';

      if (isSuccess && data.data) {
        console.log('✅ Monthly reports fetched successfully:', data.data.length, 'months');

        return {
          success: true,
          data: data.data,
          message: data.message || 'Monthly reports fetched successfully'
        };
      } else {
        console.log('❌ Failed to fetch monthly reports or no data');
        return {
          success: false,
          data: [],
          message: data.message || 'Failed to fetch monthly reports'
        };
      }
    } catch (error) {
      console.error('❌ Monthly Reports API error:', error);
      return {
        success: false,
        data: [],
        message: 'Network error. Please check your connection and try again.'
      };
    }
  }
};

export const usersAPI = {
  // Get all users from real API
  getAllUsers: async () => {
    try {
      console.log('📡 Fetching users from API...');

      const response = await fetch(`${API_BASE_URL}/admin/user.php`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('📥 Users API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('👥 Users API Response data:', data);

      // Check for success
      const isSuccess = data.success === true || data.status === 'success';

      if (isSuccess && data.data) {
        console.log('✅ Users fetched successfully:', data.data.length, 'users');

        // Transform the data to match frontend format
        const transformedUsers = data.data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          totalReports: user.totalReports || 0,
          acceptedReports: user.acceptedReports || 0,
          points: user.points || 0,
          joinDate: user.joinDate,
          status: user.status === 1 ? 'active' : 'inactive'
        }));

        console.log('🔄 Transformed users:', transformedUsers);

        return {
          success: true,
          data: transformedUsers,
          message: data.message || 'Users fetched successfully'
        };
      } else {
        console.log('❌ Failed to fetch users or no data');
        return {
          success: false,
          data: [],
          message: data.message || 'Failed to fetch users'
        };
      }
    } catch (error) {
      console.error('❌ Users API error:', error);
      return {
        success: false,
        data: [],
        message: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    await delay(300);
    return {
      success: true,
      message: `User ${userId} ${status} successfully`
    };
  }
};

// Admin authentication API
export const authAPI = {
  // Admin login
  adminLogin: async (email, password) => {
    try {
      console.log('📡 Making login API request to:', `${API_BASE_URL}/login/admin_login.php`);

      const loginData = {
        email: email,
        password: password
      };

      console.log('📤 Sending login data:', { email, password: '***' });

      const response = await fetch(`${API_BASE_URL}/login/admin_login.php`, {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('📥 Response status:', response.status, response.statusText);

      const data = await response.json();
      console.log('📋 Response data:', data);

      // Check for success in multiple formats: data.success OR data.status === 'success'
      const isSuccess = response.ok && (data.success === true || data.status === 'success');

      if (isSuccess) {
        console.log('✅ Login API successful');

        // Store session data if provided by server
        if (data.session_token) {
          sessionStorage.setItem('mangrove_session_token', data.session_token);
          console.log('🔑 Session token stored:', data.session_token.substring(0, 10) + '...');
        } else {
          console.log('⚠️ No session token provided by server');
        }

        return {
          success: true,
          data: data.data || data,
          message: data.message || 'Login successful'
        };
      } else {
        console.log('❌ Login API failed:', data.message || 'Unknown error');
        console.log('📡 Login API response:', { success: false, message: data.message || 'Login failed' });
        return {
          success: false,
          message: data.message || 'Invalid email or password'
        };
      }
    } catch (error) {
      console.error('❌ Login API error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Admin logout
  adminLogout: async () => {
    try {
      const sessionToken = sessionStorage.getItem('mangrove_session_token');
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Include session token if available
      if (sessionToken) {
        headers['Authorization'] = `Bearer ${sessionToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/login/logout.php`, {
        method: 'POST',
        headers: headers,
      });

      const data = await response.json();

      // Clear session storage regardless of response
      sessionStorage.removeItem('mangrove_session_token');
      sessionStorage.removeItem('mangrove_admin_user');

      return {
        success: data.success || true,
        message: data.message || 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      // Clear session storage even on error
      sessionStorage.removeItem('mangrove_session_token');
      sessionStorage.removeItem('mangrove_admin_user');

      return {
        success: true, // Always return success for logout
        message: 'Logged out'
      };
    }
  }
};

export default {
  reportsAPI,
  usersAPI,
  authAPI
};