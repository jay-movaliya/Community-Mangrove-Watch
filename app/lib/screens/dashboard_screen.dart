import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'report_incident_screen.dart';
import 'my_reports_screen.dart';
import 'profile_screen.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with TickerProviderStateMixin {
  int _currentIndex = 0;
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;

  final List<Widget> _screens = [
    const HomeTab(),
    const MyReportsScreen(),
    const ProfileScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeInOut),
    );
    // Start the initial animation
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _fadeController.forward();
      }
    });
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  void _onTabChanged(int index) {
    if (index != _currentIndex) {
      setState(() {
        _currentIndex = index;
      });
      // Reset and restart the fade animation
      _fadeController.reset();
      _fadeController.forward();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: _screens[_currentIndex],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          child: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: _onTabChanged,
            type: BottomNavigationBarType.fixed,
            selectedItemColor: const Color(0xFF4CAF50),
            unselectedItemColor: Colors.grey[600],
            selectedLabelStyle: GoogleFonts.poppins(
              fontWeight: FontWeight.w600,
              fontSize: 12,
            ),
            unselectedLabelStyle: GoogleFonts.poppins(fontSize: 12),
            backgroundColor: Colors.white,
            elevation: 0,
            items: [
              BottomNavigationBarItem(
                icon: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color:
                    _currentIndex == 0
                        ? const Color(0xFF4CAF50).withOpacity(0.1)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.home_rounded,
                    size: _currentIndex == 0 ? 26 : 24,
                  ),
                ),
                label: 'Home',
              ),
              BottomNavigationBarItem(
                icon: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color:
                    _currentIndex == 1
                        ? const Color(0xFF4CAF50).withOpacity(0.1)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.assessment_rounded,
                    size: _currentIndex == 1 ? 26 : 24,
                  ),
                ),
                label: 'Reports',
              ),
              BottomNavigationBarItem(
                icon: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color:
                    _currentIndex == 2
                        ? const Color(0xFF4CAF50).withOpacity(0.1)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.person_rounded,
                    size: _currentIndex == 2 ? 26 : 24,
                  ),
                ),
                label: 'Profile',
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> with TickerProviderStateMixin {
  String _userName = 'Guardian';
  String _userEmail = '';
  int _userPoints = 0;
  bool _isLoading = true;
  List<Map<String, dynamic>> _recentReports = [];

  late AnimationController _welcomeController;
  late AnimationController _actionsController;
  late AnimationController _activityController;

  late Animation<double> _welcomeAnimation;
  late Animation<double> _actionsAnimation;
  late Animation<double> _activityAnimation;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _loadUserData();
    _loadRecentReports();
  }

  void _initializeAnimations() {
    _welcomeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _actionsController = AnimationController(
      duration: const Duration(milliseconds: 700),
      vsync: this,
    );
    _activityController = AnimationController(
      duration: const Duration(milliseconds: 900),
      vsync: this,
    );

    _welcomeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _welcomeController, curve: Curves.easeOutCubic),
    );
    _actionsAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _actionsController, curve: Curves.easeOutCubic),
    );
    _activityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _activityController, curve: Curves.easeOutCubic),
    );

    _startAnimations();
  }

  void _startAnimations() async {
    if (!mounted) return;

    await Future.delayed(const Duration(milliseconds: 100));
    if (mounted) _welcomeController.forward();

    await Future.delayed(const Duration(milliseconds: 200));
    if (mounted) _actionsController.forward();

    await Future.delayed(const Duration(milliseconds: 200));
    if (mounted) _activityController.forward();
  }

  @override
  void dispose() {
    _welcomeController.dispose();
    _actionsController.dispose();
    _activityController.dispose();
    super.dispose();
  }

  Future<void> _loadUserData() async {
    try {
      final userData = await AuthService.getUserData();
      final email = userData['email'];

      setState(() {
        _userName = userData['name'] ?? 'Guardian';
        _userEmail = email ?? '';
        _userPoints = int.tryParse(userData['points'] ?? '0') ?? 0;
      });

      // Try to fetch fresh data from API
      if (email != null && email.isNotEmpty) {
        try {
          final result = await ApiService.getUserProfile(email: email);
          if (result['success']) {
            final responseData = result['data'];
            Map<String, dynamic> userApiData;

            if (responseData.containsKey('data') &&
                responseData['data'] is Map) {
              // API returns: {"data": {"user": {...}, "complaints": 0}}
              final nestedData = responseData['data'];
              userApiData = nestedData['user'] ?? {};
            } else if (responseData.containsKey('user')) {
              // Direct user data: {"user": {...}, "complaints": 0}
              userApiData = responseData['user'];
            } else {
              // Fallback to responseData itself
              userApiData = responseData;
            }

            setState(() {
              _userName = userApiData['name']?.toString() ?? _userName;
              _userPoints =
                  int.tryParse(userApiData['points']?.toString() ?? '0') ??
                      _userPoints;
              _isLoading = false;
            });

            // Update SharedPreferences with fresh data
            await AuthService.saveUserData(
              name: _userName,
              email: _userEmail,
              userType:
              userApiData['type']?.toString() ??
                  userData['userType'] ??
                  'Citizen',
              phone:
              userApiData['phone_no']?.toString() ??
                  userData['phone'] ??
                  '',
            );
          } else {
            setState(() {
              _isLoading = false;
            });
          }
        } catch (e) {
          print('Error loading fresh user data: $e');
          setState(() {
            _isLoading = false;
          });
        }
      } else {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading user data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _loadRecentReports() async {
    try {
      final userEmail = await AuthService.getUserEmail();
      if (userEmail == null) return;

      final result = await ApiService.getUserReports(email: userEmail);

      if (result['success']) {
        final responseData = result['data'];
        final reportsData = responseData['data'] as List<dynamic>;

        // Take only the first 3 reports for recent activity
        final recentReports =
        reportsData.take(3).map((report) {
          return {
            'title': '${report['type']} Reported',
            'location':
            '${report['location']['lat']}, ${report['location']['lng']}',
            'status': _getStatusText(report['status']),
            'icon': _getTypeIcon(report['type']),
            'statusColor': _getStatusColor(report['status']),
            'time': _getTimeAgo(report['date']),
          };
        }).toList();

        setState(() {
          _recentReports = recentReports;
        });
      }
    } catch (e) {
      print('Error loading recent reports: $e');
    }
  }

  String _getStatusText(String status) {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'Accepted (+50 points)';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Under Review';
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'accepted':
        return const Color(0xFF4CAF50);
      case 'pending':
        return Colors.orange;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.blue;
    }
  }

  IconData _getTypeIcon(String type) {
    switch (type.toLowerCase()) {
      case 'wood cutting':
        return Icons.content_cut;
      case 'dumping':
        return Icons.delete;
      case 'illegal dumping':
        return Icons.report_problem;
      default:
        return Icons.report;
    }
  }

  String _getTimeAgo(String date) {
    try {
      // Parse date in format "DD-MM-YYYY"
      final parts = date.split('-');
      if (parts.length == 3) {
        final day = int.parse(parts[0]);
        final month = int.parse(parts[1]);
        final year = int.parse(parts[2]);

        final reportDate = DateTime(year, month, day);
        final now = DateTime.now();
        final difference = now.difference(reportDate);

        if (difference.inDays == 0) {
          return 'Today';
        } else if (difference.inDays == 1) {
          return '1 day ago';
        } else if (difference.inDays < 7) {
          return '${difference.inDays} days ago';
        } else if (difference.inDays < 30) {
          final weeks = (difference.inDays / 7).floor();
          return '$weeks week${weeks > 1 ? 's' : ''} ago';
        } else {
          final months = (difference.inDays / 30).floor();
          return '$months month${months > 1 ? 's' : ''} ago';
        }
      }
    } catch (e) {
      print('Error parsing date: $e');
    }
    return 'Recently';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              const Color(0xFF4CAF50),
              const Color(0xFF4CAF50).withOpacity(0.8),
              Colors.white,
            ],
            stops: const [0.0, 0.3, 0.8],
          ),
        ),
        child: SafeArea(
          child: CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // App Bar
              SliverAppBar(
                expandedHeight: 120,
                floating: false,
                pinned: true,
                backgroundColor: Colors.transparent,
                elevation: 0,
                flexibleSpace: FlexibleSpaceBar(
                  title: FadeTransition(
                    opacity: _welcomeAnimation,
                    child: Text(
                      'MangroveWatch',
                      style: GoogleFonts.poppins(
                        fontWeight: FontWeight.bold,
                        fontSize: 24,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  background: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          const Color(0xFF4CAF50),
                          const Color(0xFF4CAF50).withOpacity(0.8),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // Content
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Welcome card
                      FadeTransition(
                        opacity: _welcomeAnimation,
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 20,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [
                                          const Color(0xFF4CAF50),
                                          const Color(0xFF2E7D32),
                                        ],
                                      ),
                                      borderRadius: BorderRadius.circular(16),
                                      boxShadow: [
                                        BoxShadow(
                                          color: const Color(
                                            0xFF4CAF50,
                                          ).withOpacity(0.3),
                                          blurRadius: 10,
                                          offset: const Offset(0, 5),
                                        ),
                                      ],
                                    ),
                                    child: const Icon(
                                      Icons.eco_rounded,
                                      color: Colors.white,
                                      size: 32,
                                    ),
                                  ),
                                  const SizedBox(width: 20),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Welcome back,',
                                          style: GoogleFonts.poppins(
                                            fontSize: 16,
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                        Text(
                                          _userName,
                                          style: GoogleFonts.poppins(
                                            fontSize: 24,
                                            fontWeight: FontWeight.bold,
                                            color: const Color(0xFF2E7D32),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 20),
                              Container(
                                padding: const EdgeInsets.all(20),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      const Color(0xFF4CAF50).withOpacity(0.1),
                                      const Color(0xFF2E7D32).withOpacity(0.05),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: const Color(
                                      0xFF4CAF50,
                                    ).withOpacity(0.2),
                                    width: 1,
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF4CAF50),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: const Icon(
                                        Icons.stars_rounded,
                                        color: Colors.white,
                                        size: 24,
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            'Your Points',
                                            style: GoogleFonts.poppins(
                                              fontSize: 14,
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                          _isLoading
                                              ? Text(
                                            'Loading...',
                                            style: GoogleFonts.poppins(
                                              fontSize: 20,
                                              fontWeight: FontWeight.bold,
                                              color: const Color(
                                                0xFF2E7D32,
                                              ),
                                            ),
                                          )
                                              : Text(
                                            '$_userPoints',
                                            style: GoogleFonts.poppins(
                                              fontSize: 28,
                                              fontWeight: FontWeight.bold,
                                              color: const Color(
                                                0xFF2E7D32,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 30),

                      // Quick actions
                      FadeTransition(
                        opacity: _actionsAnimation,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Quick Actions',
                              style: GoogleFonts.poppins(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF2E7D32),
                              ),
                            ),
                            const SizedBox(height: 20),
                            Center(
                              child: _buildActionCard(
                                context,
                                'Report Incident',
                                'Take photo & report environmental issues',
                                Icons.camera_alt_rounded,
                                const Color(0xFF4CAF50),
                                    () {
                                  Navigator.of(context).push(
                                    PageRouteBuilder(
                                      pageBuilder:
                                          (
                                          context,
                                          animation,
                                          secondaryAnimation,
                                          ) => const ReportIncidentScreen(),
                                      transitionsBuilder: (
                                          context,
                                          animation,
                                          secondaryAnimation,
                                          child,
                                          ) {
                                        return SlideTransition(
                                          position: Tween<Offset>(
                                            begin: const Offset(1.0, 0.0),
                                            end: Offset.zero,
                                          ).animate(
                                            CurvedAnimation(
                                              parent: animation,
                                              curve: Curves.easeInOut,
                                            ),
                                          ),
                                          child: child,
                                        );
                                      },
                                      transitionDuration: const Duration(
                                        milliseconds: 300,
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 30),

                      // Recent activity
                      FadeTransition(
                        opacity: _activityAnimation,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  'Recent Activity',
                                  style: GoogleFonts.poppins(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    color: const Color(0xFF2E7D32),
                                  ),
                                ),
                                const Spacer(),
                                if (_recentReports.isNotEmpty)
                                  TextButton.icon(
                                    onPressed: () {
                                      // Navigate to reports screen
                                      final dashboardState =
                                      context
                                          .findAncestorStateOfType<
                                          _DashboardScreenState
                                      >();
                                      if (dashboardState != null) {
                                        dashboardState._onTabChanged(1);
                                      }
                                    },
                                    icon: const Icon(
                                      Icons.arrow_forward_ios,
                                      size: 16,
                                    ),
                                    label: Text(
                                      'View All',
                                      style: GoogleFonts.poppins(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                        color: const Color(0xFF4CAF50),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 20),

                            // Show real recent reports or fallback to empty state
                            _recentReports.isEmpty
                                ? Container(
                              padding: const EdgeInsets.all(30),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 10,
                                    offset: const Offset(0, 5),
                                  ),
                                ],
                              ),
                              child: Column(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(20),
                                    decoration: BoxDecoration(
                                      color: Colors.grey[100],
                                      shape: BoxShape.circle,
                                    ),
                                    child: Icon(
                                      Icons.history_rounded,
                                      size: 48,
                                      color: Colors.grey[400],
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  Text(
                                    'No recent activity',
                                    style: GoogleFonts.poppins(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Start by reporting an incident to see your activity here',
                                    style: GoogleFonts.poppins(
                                      fontSize: 14,
                                      color: Colors.grey[500],
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                              ),
                            )
                                : Column(
                              children:
                              _recentReports.asMap().entries.map((
                                  entry,
                                  ) {
                                final index = entry.key;
                                final report = entry.value;
                                return AnimatedContainer(
                                  duration: Duration(
                                    milliseconds: 300 + (index * 100),
                                  ),
                                  margin: EdgeInsets.only(
                                    bottom:
                                    index ==
                                        _recentReports.length -
                                            1
                                        ? 0
                                        : 16,
                                  ),
                                  child: _buildActivityCard(
                                    report['title'],
                                    report['location'],
                                    report['status'],
                                    report['icon'],
                                    report['statusColor'],
                                    report['time'],
                                  ),
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionCard(
      BuildContext context,
      String title,
      String subtitle,
      IconData icon,
      Color color,
      VoidCallback onTap,
      ) {
    return Hero(
      tag: 'action_card',
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: [color, color.withOpacity(0.8)]),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(icon, color: Colors.white, size: 36),
                ),
                const SizedBox(height: 16),
                Text(
                  title,
                  style: GoogleFonts.poppins(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  subtitle,
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: Colors.white.withOpacity(0.9),
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildActivityCard(
      String title,
      String location,
      String status,
      IconData icon,
      Color statusColor,
      String time,
      ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: statusColor, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF2E7D32),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  location,
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    status,
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: statusColor,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                time,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: Colors.grey[500],
                ),
              ),
              const SizedBox(height: 8),
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: statusColor,
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
