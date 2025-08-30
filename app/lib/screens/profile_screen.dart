import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'login_screen.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _userName = 'User';
  String _userEmail = '';
  String _userType = 'Citizen';
  String _userPhone = '';
  int _userPoints = 0;
  int _userComplaints = 0;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Get email from SharedPreferences
      final userData = await AuthService.getUserData();
      final email = userData['email'];
      
      print('SharedPreferences userData: $userData');
      print('Email from SharedPreferences: $email');

      if (email != null && email.isNotEmpty) {
        // Fetch profile data from API
        final result = await ApiService.getUserProfile(email: email);
        print('Profile API result: $result');

        if (result['success']) {
          final responseData = result['data'];
          
          // Handle nested data structure properly
          Map<String, dynamic> userApiData;
          int complaints = 0;
          
          if (responseData.containsKey('data') && responseData['data'] is Map) {
            // API returns: {"data": {"user": {...}, "complaints": 0}}
            final nestedData = responseData['data'];
            userApiData = nestedData['user'] ?? {};
            complaints = nestedData['complaints'] ?? 0;
          } else if (responseData.containsKey('user')) {
            // Direct user data: {"user": {...}, "complaints": 0}
            userApiData = responseData['user'];
            complaints = responseData['complaints'] ?? 0;
          } else {
            // Fallback to responseData itself
            userApiData = responseData;
            complaints = responseData['complaints'] ?? 0;
          }
          
          print('User API data: $userApiData');
          print('Complaints: $complaints');
          print('Name from API: ${userApiData['name']}');
          
          setState(() {
            _userName = userApiData['name']?.toString() ?? userData['name'] ?? 'User';
            _userEmail = email;
            _userType = userApiData['type']?.toString() ?? userData['userType'] ?? 'Citizen';
            _userPhone = userApiData['phone_no']?.toString() ?? userData['phone'] ?? '';
            _userPoints = int.tryParse(userApiData['points']?.toString() ?? '0') ?? 0;
            _userComplaints = complaints is int ? complaints : int.tryParse(complaints.toString()) ?? 0;
            _isLoading = false;
          });
          
          // Save updated user data to SharedPreferences
          await AuthService.saveUserData(
            name: _userName,
            email: _userEmail,
            userType: _userType,
            phone: _userPhone,
          );
          
        } else {
          // Fallback to local data if API fails
          print('API failed, using local data: ${userData['name']}');
          setState(() {
            _userName = userData['name'] ?? 'User';
            _userEmail = email;
            _userType = userData['userType'] ?? 'Citizen';
            _userPhone = userData['phone'] ?? '';
            _errorMessage = result['error'];
            _isLoading = false;
          });
        }
      } else {
        setState(() {
          _errorMessage = 'No user data found';
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Profile loading error: $e');
      setState(() {
        _errorMessage = 'Failed to load profile: $e';
        _isLoading = false;
      });
    }
  }

  String _getInitials(String name) {
    List<String> names = name.split(' ');
    String initials = '';
    for (int i = 0; i < names.length && i < 2; i++) {
      if (names[i].isNotEmpty) {
        initials += names[i][0].toUpperCase();
      }
    }
    return initials.isEmpty ? 'U' : initials;
  }

  Widget _buildInfoCard(String title, String value, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF4CAF50).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: const Color(0xFF4CAF50),
              size: 20,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF2E7D32),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Text(
          'Logout',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        content: Text(
          'Are you sure you want to logout?',
          style: GoogleFonts.poppins(),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: Text(
              'Cancel',
              style: GoogleFonts.poppins(
                color: Colors.grey[600],
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          TextButton(
            onPressed: () async {
              Navigator.of(context).pop();

              // Clear user data from SharedPreferences
              await AuthService.logout();

              // Navigate to login screen
              if (mounted) {
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(
                    builder: (context) => const LoginScreen(),
                  ),
                  (route) => false,
                );
              }
            },
            child: Text(
              'Logout',
              style: GoogleFonts.poppins(
                color: Colors.red,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Profile',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF4CAF50),
        foregroundColor: Colors.white,
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadUserProfile,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                color: Color(0xFF4CAF50),
              ),
            )
          : _errorMessage != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 64,
                        color: Colors.grey[400],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Failed to load profile',
                        style: GoogleFonts.poppins(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 8),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          _errorMessage!,
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: _loadUserProfile,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF4CAF50),
                          foregroundColor: Colors.white,
                        ),
                        child: Text(
                          'Retry',
                          style: GoogleFonts.poppins(),
                        ),
                      ),
                    ],
                  ),
                )
              : SingleChildScrollView(
                  child: Column(
                    children: [
                      // Profile header
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [Color(0xFF4CAF50), Colors.white],
                            stops: [0.0, 0.6],
                          ),
                        ),
                        child: Column(
                          children: [
                            // Profile card
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.1),
                                    blurRadius: 20,
                                    offset: const Offset(0, 10),
                                  ),
                                ],
                              ),
                              child: Column(
                                children: [
                                  // Profile picture
                                  CircleAvatar(
                                    radius: 50,
                                    backgroundColor: const Color(0xFF4CAF50),
                                    child: Text(
                                      _getInitials(_userName),
                                      style: GoogleFonts.poppins(
                                        fontSize: 32,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 20),

                                  // User name
                                  Text(
                                    _userName,
                                    style: GoogleFonts.poppins(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: const Color(0xFF2E7D32),
                                    ),
                                  ),
                                  const SizedBox(height: 8),

                                  // User type badge
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 8,
                                    ),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF4CAF50)
                                          .withValues(alpha: 0.1),
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(
                                          Icons.person,
                                          size: 16,
                                          color: Color(0xFF4CAF50),
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          _userType,
                                          style: GoogleFonts.poppins(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w600,
                                            color: const Color(0xFF2E7D32),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            
                            const SizedBox(height: 20),
                            
                            // Statistics cards
                            Row(
                              children: [
                                Expanded(
                                  child: Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(12),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withValues(alpha: 0.1),
                                          blurRadius: 10,
                                          offset: const Offset(0, 5),
                                        ),
                                      ],
                                    ),
                                    child: Column(
                                      children: [
                                        Icon(
                                          Icons.stars,
                                          color: Colors.amber[600],
                                          size: 28,
                                        ),
                                        const SizedBox(height: 8),
                                        Text(
                                          _userPoints.toString(),
                                          style: GoogleFonts.poppins(
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold,
                                            color: const Color(0xFF2E7D32),
                                          ),
                                        ),
                                        Text(
                                          'Points',
                                          style: GoogleFonts.poppins(
                                            fontSize: 12,
                                            color: Colors.grey[600],
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(12),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withValues(alpha: 0.1),
                                          blurRadius: 10,
                                          offset: const Offset(0, 5),
                                        ),
                                      ],
                                    ),
                                    child: Column(
                                      children: [
                                        Icon(
                                          Icons.report,
                                          color: Colors.blue[600],
                                          size: 28,
                                        ),
                                        const SizedBox(height: 8),
                                        Text(
                                          _userComplaints.toString(),
                                          style: GoogleFonts.poppins(
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold,
                                            color: const Color(0xFF2E7D32),
                                          ),
                                        ),
                                        Text(
                                          'Complaints',
                                          style: GoogleFonts.poppins(
                                            fontSize: 12,
                                            color: Colors.grey[600],
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),

                      // Profile details
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Profile Information',
                              style: GoogleFonts.poppins(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF2E7D32),
                              ),
                            ),
                            const SizedBox(height: 16),

                            // Email info
                            _buildInfoCard(
                              'Email Address',
                              _userEmail,
                              Icons.email_outlined,
                            ),

                            // Phone info (if available)
                            if (_userPhone.isNotEmpty)
                              _buildInfoCard(
                                'Phone Number',
                                _userPhone,
                                Icons.phone_outlined,
                              ),

                            // User type info
                            _buildInfoCard(
                              'Account Type',
                              _userType,
                              Icons.account_circle_outlined,
                            ),

                            // Points info
                            _buildInfoCard(
                              'Points',
                              _userPoints.toString(),
                              Icons.stars_outlined,
                            ),

                            // Complaints info
                            _buildInfoCard(
                              'Total Complaints',
                              _userComplaints.toString(),
                              Icons.report_outlined,
                            ),

                            const SizedBox(height: 30),

                            // Logout button
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: () => _showLogoutDialog(context),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.red,
                                  foregroundColor: Colors.white,
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 16),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(Icons.logout),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Logout',
                                      style: GoogleFonts.poppins(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}