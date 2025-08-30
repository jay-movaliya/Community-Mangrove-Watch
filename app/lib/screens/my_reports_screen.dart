import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MyReportsScreen extends StatefulWidget {
  const MyReportsScreen({super.key});

  @override
  State<MyReportsScreen> createState() => _MyReportsScreenState();
}

class _MyReportsScreenState extends State<MyReportsScreen> {
  final List<Map<String, dynamic>> _reports = [
    {
      'id': 'RPT001',
      'type': 'Illegal Dumping',
      'location': 'Mangrove Area - Sector 5',
      'status': 'Pending',
      'date': '2024-01-15',
      'points': 0,
      'description': 'Large amount of plastic waste dumped near the water edge',
      'statusColor': Colors.orange,
      'icon': Icons.report_problem,
    },
    {
      'id': 'RPT002',
      'type': 'Tree Cutting',
      'location': 'Mangrove Area - Sector 2',
      'status': 'Accepted',
      'date': '2024-01-14',
      'points': 50,
      'description': 'Several mangrove trees cut down for construction',
      'statusColor': const Color(0xFF4CAF50),
      'icon': Icons.content_cut,
    },
    {
      'id': 'RPT003',
      'type': 'Waste Disposal',
      'location': 'Mangrove Area - Sector 8',
      'status': 'Under Investigation',
      'date': '2024-01-12',
      'points': 0,
      'description': 'Chemical waste containers found in the area',
      'statusColor': Colors.blue,
      'icon': Icons.delete,
    },
    {
      'id': 'RPT004',
      'type': 'Construction Activity',
      'location': 'Mangrove Area - Sector 3',
      'status': 'Rejected',
      'date': '2024-01-10',
      'points': 0,
      'description': 'Unauthorized construction near protected area',
      'statusColor': Colors.red,
      'icon': Icons.construction,
    },
    {
      'id': 'RPT005',
      'type': 'Illegal Dumping',
      'location': 'Mangrove Area - Sector 7',
      'status': 'Accepted',
      'date': '2024-01-08',
      'points': 50,
      'description': 'Household waste dumped in conservation area',
      'statusColor': const Color(0xFF4CAF50),
      'icon': Icons.report_problem,
    },
  ];

  String _selectedFilter = 'All';
  final List<String> _filterOptions = [
    'All',
    'Pending',
    'Accepted',
    'Under Investigation',
    'Rejected',
  ];

  List<Map<String, dynamic>> get _filteredReports {
    if (_selectedFilter == 'All') {
      return _reports;
    }
    return _reports
        .where((report) => report['status'] == _selectedFilter)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'My Reports',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF4CAF50),
        foregroundColor: Colors.white,
        automaticallyImplyLeading: false,
      ),
      body: Column(
        children: [
          // Stats header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF4CAF50), Colors.white],
                stops: [0.0, 1.0],
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'Total Reports',
                    _reports.length.toString(),
                    Icons.report,
                    const Color(0xFF2196F3),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildStatCard(
                    'Accepted',
                    _reports
                        .where((r) => r['status'] == 'Accepted')
                        .length
                        .toString(),
                    Icons.check_circle,
                    const Color(0xFF4CAF50),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildStatCard(
                    'Total Points',
                    _reports
                        .fold<int>(
                          0,
                          (sum, report) => sum + (report['points'] as int),
                        )
                        .toString(),
                    Icons.stars,
                    const Color(0xFFFF9800),
                  ),
                ),
              ],
            ),
          ),

          // Filter section
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Row(
              children: [
                Text(
                  'Filter: ',
                  style: GoogleFonts.poppins(
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF2E7D32),
                  ),
                ),
                Expanded(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children:
                          _filterOptions.map((filter) {
                            final isSelected = _selectedFilter == filter;
                            return Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: FilterChip(
                                label: Text(
                                  filter,
                                  style: GoogleFonts.poppins(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color:
                                        isSelected
                                            ? Colors.white
                                            : const Color(0xFF2E7D32),
                                  ),
                                ),
                                selected: isSelected,
                                onSelected: (selected) {
                                  setState(() {
                                    _selectedFilter = filter;
                                  });
                                },
                                selectedColor: const Color(0xFF4CAF50),
                                backgroundColor: Colors.grey[200],
                                checkmarkColor: Colors.white,
                              ),
                            );
                          }).toList(),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Reports list
          Expanded(
            child:
                _filteredReports.isEmpty
                    ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.inbox, size: 64, color: Colors.grey[400]),
                          const SizedBox(height: 16),
                          Text(
                            'No reports found',
                            style: GoogleFonts.poppins(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey[600],
                            ),
                          ),
                          Text(
                            'Try adjusting your filter',
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              color: Colors.grey[500],
                            ),
                          ),
                        ],
                      ),
                    )
                    : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: _filteredReports.length,
                      itemBuilder: (context, index) {
                        final report = _filteredReports[index];
                        return _buildReportCard(report);
                      },
                    ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF2E7D32),
            ),
          ),
          Text(
            title,
            style: GoogleFonts.poppins(fontSize: 10, color: Colors.grey[600]),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildReportCard(Map<String, dynamic> report) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: report['statusColor'].withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  report['icon'],
                  color: report['statusColor'],
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          report['type'],
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF2E7D32),
                          ),
                        ),
                        const Spacer(),
                        Text(
                          report['id'],
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                    Text(
                      report['location'],
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          Text(
            report['description'],
            style: GoogleFonts.poppins(fontSize: 14, color: Colors.grey[700]),
          ),

          const SizedBox(height: 12),

          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: report['statusColor'].withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  report['status'],
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: report['statusColor'],
                  ),
                ),
              ),
              const Spacer(),
              if (report['points'] > 0)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFF9800).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.stars,
                        size: 14,
                        color: Color(0xFFFF9800),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '+${report['points']} pts',
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFFFF9800),
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(width: 8),
              Text(
                report['date'],
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: Colors.grey[500],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
