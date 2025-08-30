// API service for Mangrove Watch application
const API_BASE_URL = 'https://manishkumardev.me/mangrove';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reportsAPI = {
  // Get all reports
  getAllReports: async () => {
    await delay(500);
    return {
      success: true,
      data: [
        {
          id: 1,
          type: 'Illegal Cutting',
          location: { lat: 23.8103, lng: 90.4125, name: 'Sundarbans, Bangladesh' },
          reporter: 'John Doe',
          date: '2025-01-15',
          status: 'pending',
          severity: 'high',
          description: 'Large scale mangrove cutting observed near the main waterway',
          image: 'https://via.placeholder.com/300x200/22c55e/ffffff?text=Mangrove+Cutting',
          points: 50,
          reporterEmail: 'john.doe@email.com',
          reporterPhone: '+880123456789'
        },
        {
          id: 2,
          type: 'Waste Dumping',
          location: { lat: 22.3569, lng: 91.7832, name: 'Cox\'s Bazar, Bangladesh' },
          reporter: 'Jane Smith',
          date: '2025-01-14',
          status: 'accepted',
          severity: 'medium',
          description: 'Plastic waste and debris dumped in mangrove area affecting marine life',
          image: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Waste+Dumping',
          points: 30,
          reporterEmail: 'jane.smith@email.com',
          reporterPhone: '+880987654321'
        },
        {
          id: 3,
          type: 'Illegal Cutting',
          location: { lat: 21.4272, lng: 92.0058, name: 'Teknaf, Bangladesh' },
          reporter: 'Mike Johnson',
          date: '2025-01-13',
          status: 'rejected',
          severity: 'low',
          description: 'Suspected illegal cutting activity - turned out to be natural tree fall',
          image: 'https://via.placeholder.com/300x200/6b7280/ffffff?text=False+Report',
          points: 0,
          reporterEmail: 'mike.johnson@email.com',
          reporterPhone: '+880555666777'
        },
        {
          id: 4,
          type: 'Pollution',
          location: { lat: 22.8456, lng: 89.5403, name: 'Khulna, Bangladesh' },
          reporter: 'Sarah Wilson',
          date: '2025-01-12',
          status: 'pending',
          severity: 'high',
          description: 'Chemical pollution detected in water, fish dying in large numbers',
          image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Water+Pollution',
          points: 40,
          reporterEmail: 'sarah.wilson@email.com',
          reporterPhone: '+880111222333'
        },
        {
          id: 5,
          type: 'Waste Dumping',
          location: { lat: 23.7104, lng: 90.4074, name: 'Dhaka Coast, Bangladesh' },
          reporter: 'Alex Brown',
          date: '2025-01-11',
          status: 'accepted',
          severity: 'medium',
          description: 'Industrial waste dumped near mangrove coastline',
          image: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Industrial+Waste',
          points: 35,
          reporterEmail: 'alex.brown@email.com',
          reporterPhone: '+880444555666'
        }
      ]
    };
  },

  // Update report status
  updateReportStatus: async (reportId, status) => {
    await delay(300);
    return {
      success: true,
      message: `Report ${reportId} ${status} successfully`
    };
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
  }
};

export const usersAPI = {
  // Get all users
  getAllUsers: async () => {
    await delay(400);
    return {
      success: true,
      data: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+880123456789',
          totalReports: 12,
          acceptedReports: 8,
          points: 240,
          joinDate: '2024-11-15',
          status: 'active',
          location: 'Dhaka, Bangladesh'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+880987654321',
          totalReports: 8,
          acceptedReports: 6,
          points: 180,
          joinDate: '2024-12-01',
          status: 'active',
          location: 'Chittagong, Bangladesh'
        }
      ]
    };
  }
};

// Admin authentication API
export const authAPI = {
  // Admin login
  adminLogin: async (email, password) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/login/admin_login.php`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data || data,
          message: data.message || 'Login successful'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Admin logout
  adminLogout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/logout.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      return {
        success: data.success || true,
        message: data.message || 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
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