import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:geolocator/geolocator.dart';
import 'package:camera/camera.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'dart:developer' as developer;
import '../services/api_service.dart';
import 'camera_screen.dart';

class ReportIncidentScreen extends StatefulWidget {
  const ReportIncidentScreen({super.key});

  @override
  State<ReportIncidentScreen> createState() => _ReportIncidentScreenState();
}

class _ReportIncidentScreenState extends State<ReportIncidentScreen> {
  final _descriptionController = TextEditingController();
  final _customLocationController = TextEditingController();
  final _latitudeController = TextEditingController();
  final _longitudeController = TextEditingController();
  String _selectedIncidentType = 'Illegal Dumping';
  bool _hasPhoto = false;
  bool _locationFetched = false;
  bool _isSubmitting = false;
  bool _useCustomLocation = false;
  String? _capturedImagePath;
  double? _latitude;
  double? _longitude;
  String _locationAddress = '';
  bool _isLoadingLocation = false;
  final ImagePicker _picker = ImagePicker();

  final List<String> _incidentTypes = [
    'Illegal Dumping',
    'Wood Cutting'
  ];

  @override
  void initState() {
    super.initState();
    _fetchLocation();
  }

  @override
  void dispose() {
    _descriptionController.dispose();
    _customLocationController.dispose();
    _latitudeController.dispose();
    _longitudeController.dispose();
    super.dispose();
  }

  Future<void> _fetchLocation() async {
    if (!mounted) return;

    setState(() {
      _isLoadingLocation = true;
      _locationFetched = false;
    });

    try {
      // Check location permission first
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw Exception('Location permissions denied by user');
        }
      }

      if (permission == LocationPermission.deniedForever) {
        throw Exception(
          'Location permissions permanently denied. Please enable in settings.',
        );
      }

      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw Exception('Location services disabled. Please enable GPS.');
      }

      // Get current position with better error handling
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: const Duration(seconds: 15),
      ).timeout(
        const Duration(seconds: 20),
        onTimeout: () {
          throw Exception('Location request timed out. Please try again.');
        },
      );

      if (!mounted) return;

      setState(() {
        _latitude = position.latitude;
        _longitude = position.longitude;
        _locationFetched = true;
        _isLoadingLocation = false;
        _locationAddress =
            'Lat: ${_latitude!.toStringAsFixed(6)}, Lng: ${_longitude!.toStringAsFixed(6)}';
      });

      developer.log('Location fetched successfully: $_latitude, $_longitude');
    } catch (e) {
      developer.log('Location error: $e');
      if (!mounted) return;

      setState(() {
        _locationFetched = false;
        _isLoadingLocation = false;
        _locationAddress = 'Failed: ${e.toString()}';
      });

      // Show user-friendly error message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Location Error: ${e.toString()}',
              style: GoogleFonts.poppins(fontSize: 12),
            ),
            backgroundColor: Colors.orange,
            action: SnackBarAction(
              label: 'Retry',
              textColor: Colors.white,
              onPressed: _fetchLocation,
            ),
          ),
        );
      }
    }
  }

  Future<void> _showImageSourceDialog() async {
    if (!mounted) return;

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return SafeArea(
          child: Container(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Select Image Source',
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Flexible(
                      child: _buildImageSourceOption(
                        icon: Icons.camera_alt,
                        label: 'Camera',
                        onTap: () {
                          Navigator.pop(context);
                          _takePhoto();
                        },
                      ),
                    ),
                    const SizedBox(width: 16),
                    Flexible(
                      child: _buildImageSourceOption(
                        icon: Icons.photo_library,
                        label: 'Gallery',
                        onTap: () {
                          Navigator.pop(context);
                          _pickImageFromGallery();
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildImageSourceOption({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        constraints: const BoxConstraints(minWidth: 100, maxWidth: 140),
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
        decoration: BoxDecoration(
          color: const Color(0xFF4CAF50).withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF4CAF50), width: 1),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 36, color: const Color(0xFF4CAF50)),
            const SizedBox(height: 6),
            Text(
              label,
              style: GoogleFonts.poppins(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF2E7D32),
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickImageFromGallery() async {
    try {
      // Use image picker without explicit permission requests
      // The image_picker plugin handles permissions internally on modern Android
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (image != null && mounted) {
        setState(() {
          _hasPhoto = true;
          _capturedImagePath = image.path;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Image selected successfully!',
              style: GoogleFonts.poppins(),
            ),
            backgroundColor: const Color(0xFF4CAF50),
          ),
        );
      } else {
        // User cancelled the picker
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('No image selected', style: GoogleFonts.poppins()),
              backgroundColor: Colors.orange,
            ),
          );
        }
      }
    } catch (e) {
      developer.log('Gallery picker error: $e');
      if (mounted) {
        // Provide user-friendly error messages
        String errorMessage;
        bool showSettingsButton = false;

        if (e.toString().toLowerCase().contains('permission')) {
          errorMessage =
              'Gallery access permission needed. Please allow photo access in settings.';
          showSettingsButton = true;
        } else if (e.toString().toLowerCase().contains('denied')) {
          errorMessage =
              'Gallery access was denied. Please enable photo permissions in app settings.';
          showSettingsButton = true;
        } else {
          errorMessage =
              'Unable to access gallery. Please try again or use camera instead.';
        }

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              errorMessage,
              style: GoogleFonts.poppins(fontSize: 14),
            ),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 4),
            action:
                showSettingsButton
                    ? SnackBarAction(
                      label: 'Settings',
                      textColor: Colors.white,
                      onPressed: () async {
                        await openAppSettings();
                      },
                    )
                    : SnackBarAction(
                      label: 'Camera',
                      textColor: Colors.white,
                      onPressed: () {
                        _takePhoto();
                      },
                    ),
          ),
        );
      }
    }
  }

  Future<void> _takePhoto() async {
    try {
      // Check camera permission
      var cameraStatus = await Permission.camera.status;
      if (cameraStatus.isDenied) {
        cameraStatus = await Permission.camera.request();
        if (cameraStatus.isDenied) {
          throw Exception('Camera permission denied');
        }
      }

      // Get available cameras
      final cameras = await availableCameras();
      if (cameras.isEmpty) {
        throw Exception('No cameras available on this device');
      }

      if (!mounted) return;

      // Navigate to camera screen
      final imagePath = await Navigator.of(context).push<String>(
        MaterialPageRoute(
          builder: (context) => CameraScreen(camera: cameras.first),
        ),
      );

      if (imagePath != null && mounted) {
        setState(() {
          _hasPhoto = true;
          _capturedImagePath = imagePath;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Photo captured successfully!',
              style: GoogleFonts.poppins(),
            ),
            backgroundColor: const Color(0xFF4CAF50),
          ),
        );
      }
    } catch (e) {
      developer.log('Camera error: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Camera error: ${e.toString()}',
              style: GoogleFonts.poppins(),
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _submitReport() async {
    if (!_hasPhoto) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Please add a photo first',
            style: GoogleFonts.poppins(),
          ),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Check location requirements
    if (_useCustomLocation) {
      if (_customLocationController.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Please enter a custom location description',
              style: GoogleFonts.poppins(),
            ),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }

      // Validate coordinates if provided
      if (_latitudeController.text.trim().isNotEmpty ||
          _longitudeController.text.trim().isNotEmpty) {
        final latText = _latitudeController.text.trim();
        final lngText = _longitudeController.text.trim();

        if (latText.isEmpty || lngText.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Please enter both latitude and longitude, or leave both empty',
                style: GoogleFonts.poppins(),
              ),
              backgroundColor: Colors.red,
            ),
          );
          return;
        }

        final lat = double.tryParse(latText);
        final lng = double.tryParse(lngText);

        if (lat == null || lng == null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Please enter valid latitude and longitude values',
                style: GoogleFonts.poppins(),
              ),
              backgroundColor: Colors.red,
            ),
          );
          return;
        }

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Latitude must be between -90 and 90, longitude between -180 and 180',
                style: GoogleFonts.poppins(),
              ),
              backgroundColor: Colors.red,
            ),
          );
          return;
        }
      }
    } else if (!_locationFetched) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Location is required. Please wait for GPS or use custom location.',
            style: GoogleFonts.poppins(),
          ),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      // Prepare report data
      double? reportLat;
      double? reportLng;

      if (_useCustomLocation) {
        // Use custom coordinates if provided, otherwise null
        if (_latitudeController.text.trim().isNotEmpty &&
            _longitudeController.text.trim().isNotEmpty) {
          reportLat = double.tryParse(_latitudeController.text.trim());
          reportLng = double.tryParse(_longitudeController.text.trim());
        }
      } else {
        // Use GPS coordinates
        reportLat = _latitude;
        reportLng = _longitude;
      }

      // Check if we have coordinates for prediction
      if (reportLat == null || reportLng == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Coordinates are required for prediction. Please provide latitude and longitude.',
              style: GoogleFonts.poppins(),
            ),
            backgroundColor: Colors.red,
          ),
        );
        setState(() {
          _isSubmitting = false;
        });
        return;
      }

      developer.log('Calling prediction API with lat: $reportLat, lng: $reportLng, image: $_capturedImagePath');

      // Call prediction API
      final predictionResult = await ApiService.predictIncident(
        latitude: reportLat,
        longitude: reportLng,
        imagePath: _capturedImagePath!,
      );

      if (!mounted) return;

      setState(() {
        _isSubmitting = false;
      });

      if (predictionResult['success']) {
        // Show prediction results
        final predictionData = predictionResult['data'];
        _showPredictionResults(predictionData, reportLat, reportLng);
      } else {
        // Show error
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Prediction failed: ${predictionResult['error']}',
              style: GoogleFonts.poppins(),
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isSubmitting = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Failed to submit report: ${e.toString()}',
            style: GoogleFonts.poppins(),
          ),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _showPredictionResults(Map<String, dynamic> predictionData, double lat, double lng) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Row(
          children: [
            const Icon(Icons.analytics, color: Color(0xFF4CAF50)),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                'Prediction Results',
                style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Location info
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Location: ${lat.toStringAsFixed(6)}, ${lng.toStringAsFixed(6)}',
                      style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                    Text(
                      'Time: ${DateTime.now().toString().split('.')[0]}',
                      style: GoogleFonts.poppins(fontSize: 12),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              
              // Prediction results
              Text(
                'AI Analysis Results:',
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF2E7D32),
                ),
              ),
              const SizedBox(height: 8),
              
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF4CAF50).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFF4CAF50), width: 1),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Display prediction results based on API response structure
                    if (predictionData.containsKey('prediction'))
                      Text(
                        'Prediction: ${predictionData['prediction']}',
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    if (predictionData.containsKey('confidence'))
                      Text(
                        'Confidence: ${(predictionData['confidence'] * 100).toStringAsFixed(1)}%',
                        style: GoogleFonts.poppins(fontSize: 12),
                      ),
                    if (predictionData.containsKey('class'))
                      Text(
                        'Detected Class: ${predictionData['class']}',
                        style: GoogleFonts.poppins(fontSize: 12),
                      ),
                    if (predictionData.containsKey('message'))
                      Text(
                        'Message: ${predictionData['message']}',
                        style: GoogleFonts.poppins(fontSize: 12),
                      ),
                    
                    // If no specific fields, show raw data
                    if (!predictionData.containsKey('prediction') && 
                        !predictionData.containsKey('class') &&
                        !predictionData.containsKey('message'))
                      Text(
                        predictionData.toString(),
                        style: GoogleFonts.poppins(fontSize: 12),
                      ),
                  ],
                ),
              ),
              
              const SizedBox(height: 16),
              
              // Success message
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF4CAF50).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle, color: Color(0xFF4CAF50)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Report analyzed and submitted successfully!',
                        style: GoogleFonts.poppins(
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF2E7D32),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(); // Close dialog
              Navigator.of(context).pop(); // Go back to previous screen
            },
            child: Text(
              'OK',
              style: GoogleFonts.poppins(
                color: const Color(0xFF4CAF50),
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
          'Report Incident',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF4CAF50),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Location Section
            Text(
              'Location',
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF2E7D32),
              ),
            ),
            const SizedBox(height: 12),

            // Location type toggle - FIXED OVERFLOW
            Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _useCustomLocation = false;
                      });
                      if (!_locationFetched && !_isLoadingLocation) {
                        _fetchLocation();
                      }
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        vertical: 10,
                        horizontal: 4,
                      ),
                      decoration: BoxDecoration(
                        color:
                            !_useCustomLocation
                                ? const Color(0xFF4CAF50).withValues(alpha: 0.1)
                                : Colors.grey.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color:
                              !_useCustomLocation
                                  ? const Color(0xFF4CAF50)
                                  : Colors.grey,
                          width: 1,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.gps_fixed,
                            color:
                                !_useCustomLocation
                                    ? const Color(0xFF4CAF50)
                                    : Colors.grey,
                            size: 16,
                          ),
                          const SizedBox(width: 4),
                          Flexible(
                            child: Text(
                              'GPS',
                              style: GoogleFonts.poppins(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color:
                                    !_useCustomLocation
                                        ? const Color(0xFF2E7D32)
                                        : Colors.grey[600],
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _useCustomLocation = true;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        vertical: 10,
                        horizontal: 4,
                      ),
                      decoration: BoxDecoration(
                        color:
                            _useCustomLocation
                                ? const Color(0xFF4CAF50).withValues(alpha: 0.1)
                                : Colors.grey.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color:
                              _useCustomLocation
                                  ? const Color(0xFF4CAF50)
                                  : Colors.grey,
                          width: 1,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.edit_location,
                            color:
                                _useCustomLocation
                                    ? const Color(0xFF4CAF50)
                                    : Colors.grey,
                            size: 16,
                          ),
                          const SizedBox(width: 4),
                          Flexible(
                            child: Text(
                              'Custom',
                              style: GoogleFonts.poppins(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color:
                                    _useCustomLocation
                                        ? const Color(0xFF2E7D32)
                                        : Colors.grey[600],
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Location content based on selection
            if (!_useCustomLocation) ...[
              // GPS Location status
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color:
                      _locationFetched
                          ? const Color(0xFF4CAF50).withValues(alpha: 0.1)
                          : _isLoadingLocation
                          ? Colors.orange.withValues(alpha: 0.1)
                          : Colors.red.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color:
                        _locationFetched
                            ? const Color(0xFF4CAF50)
                            : _isLoadingLocation
                            ? Colors.orange
                            : Colors.red,
                    width: 1,
                  ),
                ),
                child: Row(
                  children: [
                    _isLoadingLocation
                        ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Colors.orange,
                            ),
                          ),
                        )
                        : Icon(
                          _locationFetched
                              ? Icons.location_on
                              : Icons.location_off,
                          color:
                              _locationFetched
                                  ? const Color(0xFF4CAF50)
                                  : Colors.red,
                        ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _isLoadingLocation
                                ? 'Fetching Location...'
                                : _locationFetched
                                ? 'Location Confirmed'
                                : 'Location Failed',
                            style: GoogleFonts.poppins(
                              fontWeight: FontWeight.w600,
                              color:
                                  _isLoadingLocation
                                      ? Colors.orange[800]
                                      : _locationFetched
                                      ? const Color(0xFF2E7D32)
                                      : Colors.red[800],
                            ),
                          ),
                          Text(
                            _isLoadingLocation
                                ? 'Please wait while we get your GPS location'
                                : _locationAddress,
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (!_isLoadingLocation && !_locationFetched)
                      IconButton(
                        onPressed: _fetchLocation,
                        icon: const Icon(Icons.refresh, color: Colors.red),
                      ),
                  ],
                ),
              ),
            ] else ...[
              // Custom location input
              Column(
                children: [
                  TextFormField(
                    controller: _customLocationController,
                    style: GoogleFonts.poppins(),
                    decoration: InputDecoration(
                      hintText:
                          'Enter location description (e.g., "Near Mangrove Park, City")',
                      hintStyle: GoogleFonts.poppins(color: Colors.grey[500]),
                      prefixIcon: const Icon(
                        Icons.place,
                        color: Color(0xFF4CAF50),
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: Colors.grey[300]!),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(
                          color: Color(0xFF4CAF50),
                          width: 2,
                        ),
                      ),
                      filled: true,
                      fillColor: Colors.grey[50],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _latitudeController,
                          style: GoogleFonts.poppins(),
                          keyboardType: const TextInputType.numberWithOptions(
                            decimal: true,
                          ),
                          decoration: InputDecoration(
                            labelText: 'Latitude',
                            hintText: 'e.g., 19.0760',
                            hintStyle: GoogleFonts.poppins(
                              color: Colors.grey[500],
                            ),
                            prefixIcon: const Icon(
                              Icons.my_location,
                              color: Color(0xFF4CAF50),
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.grey[300]!),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                color: Color(0xFF4CAF50),
                                width: 2,
                              ),
                            ),
                            filled: true,
                            fillColor: Colors.grey[50],
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextFormField(
                          controller: _longitudeController,
                          style: GoogleFonts.poppins(),
                          keyboardType: const TextInputType.numberWithOptions(
                            decimal: true,
                          ),
                          decoration: InputDecoration(
                            labelText: 'Longitude',
                            hintText: 'e.g., 72.8777',
                            hintStyle: GoogleFonts.poppins(
                              color: Colors.grey[500],
                            ),
                            prefixIcon: const Icon(
                              Icons.location_on,
                              color: Color(0xFF4CAF50),
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.grey[300]!),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                color: Color(0xFF4CAF50),
                                width: 2,
                              ),
                            ),
                            filled: true,
                            fillColor: Colors.grey[50],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],

            const SizedBox(height: 24),

            // Incident type selection
            Text(
              'Incident Type',
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF2E7D32),
              ),
            ),
            const SizedBox(height: 12),

            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey[300]!),
                borderRadius: BorderRadius.circular(12),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedIncidentType,
                  isExpanded: true,
                  style: GoogleFonts.poppins(color: const Color(0xFF2E7D32)),
                  items:
                      _incidentTypes.map((String type) {
                        return DropdownMenuItem<String>(
                          value: type,
                          child: Text(type),
                        );
                      }).toList(),
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedIncidentType = newValue!;
                    });
                  },
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Photo section
            Text(
              'Evidence Photo',
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF2E7D32),
              ),
            ),
            const SizedBox(height: 12),

            GestureDetector(
              onTap: _showImageSourceDialog,
              child: Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  color:
                      _hasPhoto
                          ? const Color(0xFF4CAF50).withValues(alpha: 0.1)
                          : Colors.grey[100],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color:
                        _hasPhoto ? const Color(0xFF4CAF50) : Colors.grey[300]!,
                    width: 2,
                    style: BorderStyle.solid,
                  ),
                ),
                child:
                    _hasPhoto && _capturedImagePath != null
                        ? Stack(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.file(
                                File(_capturedImagePath!),
                                width: double.infinity,
                                height: double.infinity,
                                fit: BoxFit.cover,
                              ),
                            ),
                            Positioned(
                              top: 8,
                              right: 8,
                              child: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.black.withValues(alpha: 0.7),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Icon(
                                  Icons.check_circle,
                                  color: Color(0xFF4CAF50),
                                  size: 20,
                                ),
                              ),
                            ),
                            Positioned(
                              bottom: 8,
                              left: 8,
                              right: 8,
                              child: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.black.withValues(alpha: 0.7),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  'Tap to change photo',
                                  style: GoogleFonts.poppins(
                                    fontSize: 12,
                                    color: Colors.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            ),
                          ],
                        )
                        : Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.add_a_photo,
                              size: 50,
                              color: Colors.grey,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Tap to Add Photo',
                              style: GoogleFonts.poppins(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: Colors.grey[700],
                              ),
                            ),
                            Text(
                              'Camera or Gallery • Required for validation',
                              style: GoogleFonts.poppins(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
              ),
            ),

            const SizedBox(height: 24),

            // Description
            Text(
              'Description (Optional)',
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF2E7D32),
              ),
            ),
            const SizedBox(height: 12),

            TextFormField(
              controller: _descriptionController,
              maxLines: 4,
              style: GoogleFonts.poppins(),
              decoration: InputDecoration(
                hintText: 'Provide additional details about the incident...',
                hintStyle: GoogleFonts.poppins(color: Colors.grey[500]),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(
                    color: Color(0xFF4CAF50),
                    width: 2,
                  ),
                ),
                filled: true,
                fillColor: Colors.grey[50],
              ),
            ),

            const SizedBox(height: 32),

            // Submit button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submitReport,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF4CAF50),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 2,
                ),
                child:
                    _isSubmitting
                        ? Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  Colors.white,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Text(
                              'Analyzing Image...',
                              style: GoogleFonts.poppins(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        )
                        : Text(
                          'Analyze & Submit',
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
              ),
            ),

            const SizedBox(height: 16),

            // Info text
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.info_outline, color: Colors.blue, size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Your report will be validated using AI to check if the photo shows actual environmental damage and is taken within a mangrove area.',
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        color: Colors.blue[800],
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

class CameraScreen extends StatefulWidget {
  final CameraDescription camera;

  const CameraScreen({super.key, required this.camera});

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;

  @override
  void initState() {
    super.initState();
    _controller = CameraController(widget.camera, ResolutionPreset.high);
    _initializeControllerFuture = _controller.initialize();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _takePicture() async {
    try {
      await _initializeControllerFuture;
      final image = await _controller.takePicture();

      if (mounted) {
        Navigator.of(context).pop(image.path);
      }
    } catch (e) {
      developer.log('Error taking picture: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error taking picture: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text(
          'Take Photo',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
      ),
      body: FutureBuilder<void>(
        future: _initializeControllerFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            return Stack(
              children: [
                // Camera preview
                Positioned.fill(child: CameraPreview(_controller)),

                // Camera controls
                Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.bottomCenter,
                        end: Alignment.topCenter,
                        colors: [
                          Colors.black.withValues(alpha: 0.8),
                          Colors.transparent,
                        ],
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        // Cancel button
                        IconButton(
                          onPressed: () => Navigator.of(context).pop(),
                          icon: const Icon(
                            Icons.close,
                            color: Colors.white,
                            size: 30,
                          ),
                        ),

                        // Capture button
                        GestureDetector(
                          onTap: _takePicture,
                          child: Container(
                            width: 70,
                            height: 70,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: const Color(0xFF4CAF50),
                                width: 3,
                              ),
                            ),
                            child: const Icon(
                              Icons.camera_alt,
                              color: Color(0xFF4CAF50),
                              size: 30,
                            ),
                          ),
                        ),

                        // Placeholder for symmetry
                        const SizedBox(width: 48),
                      ],
                    ),
                  ),
                ),

                // Instructions
                Positioned(
                  top: 50,
                  left: 20,
                  right: 20,
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.7),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Position the incident in the center and tap the capture button',
                      style: GoogleFonts.poppins(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ],
            );
          } else {
            return const Center(
              child: CircularProgressIndicator(color: Color(0xFF4CAF50)),
            );
          }
        },
      ),
    );
  }
}
