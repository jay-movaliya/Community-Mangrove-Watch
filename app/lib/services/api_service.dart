import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'https://manishkumardev.me/mangrove';

  static Future<Map<String, dynamic>> registerUser({
    required String email,
    required String name,
    required String type,
    required String password,
    required String phoneNo,
  }) async {
    try {
      final url = Uri.parse('$baseUrl/registration/register.php');

      final body = {
        'email': email,
        'name': name,
        'type': type,
        'password': password,
        'phone_no': phoneNo,
      };

      print('Sending registration request to: $url');
      print('Request body: ${jsonEncode(body)}');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final responseData = jsonDecode(response.body);

          // Check if the API response indicates success or error
          if (responseData['status'] == 'success') {
            return {'success': true, 'data': responseData};
          } else {
            // API returned error in the response body
            return {
              'success': false,
              'error': responseData['message'] ?? 'Registration failed',
            };
          }
        } catch (e) {
          // If response is not JSON, treat as error
          return {
            'success': false,
            'error': 'Invalid response format: ${response.body}',
          };
        }
      } else {
        return {
          'success': false,
          'error':
          'Registration failed. Status code: ${response.statusCode}\nResponse: ${response.body}',
        };
      }
    } catch (e) {
      print('API Error: $e');
      return {'success': false, 'error': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> verifyOtp({
    required String email,
    required String otp,
  }) async {
    try {
      final url = Uri.parse('$baseUrl/registration/otp_verification.php');

      final body = {'email': email, 'otp': otp};

      print('Sending OTP verification request to: $url');
      print('Request body: ${jsonEncode(body)}');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      print('OTP Response status: ${response.statusCode}');
      print('OTP Response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final responseData = jsonDecode(response.body);
          print('Response data: $responseData');

          // Check if the API response indicates success or error
          if (responseData['status'] == 'success') {
            return {'success': true, 'data': responseData};
          } else {
            // API returned error in the response body
            return {
              'success': false,
              'error': responseData['message'] ?? 'OTP verification failed',
            };
          }
        } catch (e) {
          // If response is not JSON, treat as error
          return {
            'success': false,
            'error': 'Invalid response format: ${response.body}',
          };
        }
      } else {
        return {
          'success': false,
          'error':
          'OTP verification failed. Status code: ${response.statusCode}\nResponse: ${response.body}',
        };
      }
    } catch (e) {
      print('OTP API Error: $e');
      return {'success': false, 'error': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> resendOtp({required String email}) async {
    try {
      final url = Uri.parse('$baseUrl/registration/resend_otp.php');

      final body = {'email': email};

      print('Sending resend OTP request to: $url');
      print('Request body: ${jsonEncode(body)}');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      print('Resend OTP Response status: ${response.statusCode}');
      print('Resend OTP Response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final responseData = jsonDecode(response.body);

          // Check if the API response indicates success or error
          if (responseData['status'] == 'success') {
            return {'success': true, 'data': responseData};
          } else {
            // API returned error in the response body
            return {
              'success': false,
              'error': responseData['message'] ?? 'Failed to resend OTP',
            };
          }
        } catch (e) {
          return {
            'success': false,
            'error': 'Invalid response format: ${response.body}',
          };
        }
      } else {
        return {
          'success': false,
          'error':
          'Failed to resend OTP. Status code: ${response.statusCode}\nResponse: ${response.body}',
        };
      }
    } catch (e) {
      print('Resend OTP API Error: $e');
      return {'success': false, 'error': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> loginUser({
    required String email,
    required String password,
  }) async {
    try {
      final url = Uri.parse('$baseUrl/login/index.php');

      final body = {'email': email, 'password': password};

      print('Sending login request to: $url');
      print('Request body: ${jsonEncode(body)}');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      print('Login Response status: ${response.statusCode}');
      print('Login Response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final responseData = jsonDecode(response.body);

          // Check if the API response indicates success or error
          if (responseData['status'] == 'success') {
            return {'success': true, 'data': responseData};
          } else {
            // API returned error in the response body
            return {
              'success': false,
              'error': responseData['message'] ?? 'Login failed',
            };
          }
        } catch (e) {
          return {
            'success': false,
            'error': 'Invalid response format: ${response.body}',
          };
        }
      } else {
        return {
          'success': false,
          'error':
          'Login failed. Status code: ${response.statusCode}\nResponse: ${response.body}',
        };
      }
    } catch (e) {
      print('Login API Error: $e');
      return {'success': false, 'error': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> getUserProfile({
    required String email,
  }) async {
    try {
      final url = Uri.parse('$baseUrl/profile/index.php');

      final body = {'email': email};

      print('Sending profile request to: $url');
      print('Request body: ${jsonEncode(body)}');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      print('Profile Response status: ${response.statusCode}');
      print('Profile Response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final responseData = jsonDecode(response.body);

          // Check if the API response indicates success or error
          if (responseData['status'] == 'success') {
            return {'success': true, 'data': responseData};
          } else {
            // API returned error in the response body
            return {
              'success': false,
              'error': responseData['message'] ?? 'Failed to fetch profile',
            };
          }
        } catch (e) {
          return {
            'success': false,
            'error': 'Invalid response format: ${response.body}',
          };
        }
      } else {
        return {
          'success': false,
          'error':
          'Failed to fetch profile. Status code: ${response.statusCode}\nResponse: ${response.body}',
        };
      }
    } catch (e) {
      print('Profile API Error: $e');
      return {'success': false, 'error': 'Network error: $e'};
    }
  }
  static Future<Map<String, dynamic>> getUserReports({
    required String email,
  }) async {
    try {
      final url = Uri.parse('$baseUrl/profile/fetch_complains.php');

      final body = {'email': email};

      print('Sending user reports request to: $url');
      print('Request body: ${jsonEncode(body)}');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      print('User Reports Response status: ${response.statusCode}');
      print('User Reports Response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final responseData = jsonDecode(response.body);

          // Check if the API response indicates success or error
          if (responseData['status'] == 'success') {
            return {'success': true, 'data': responseData};
          } else {
            // API returned error in the response body
            return {
              'success': false,
              'error': responseData['message'] ?? 'Failed to fetch reports',
            };
          }
        } catch (e) {
          return {
            'success': false,
            'error': 'Invalid response format: ${response.body}',
          };
        }
      } else {
        return {
          'success': false,
          'error':
          'Failed to fetch reports. Status code: ${response.statusCode}\nResponse: ${response.body}',
        };
      }
    } catch (e) {
      print('User Reports API Error: $e');
      return {'success': false, 'error': 'Network error: $e'};
    }
  }

  static Future<Map<String, dynamic>> submitReport({
    required String email,
    required double latitude,
    required double longitude,
    required String imagePath,
    required String type,
    required String description,
  }) async {
    // Transaction state tracking
    Map<String, dynamic> transactionState = {
      'location_check': null,
      'prediction': null,
      'complaint': null,
      'completed_steps': [],
    };

    try {
      print('Starting report submission transaction...');
      print('Email: $email, Lat: $latitude, Lng: $longitude, Type: $type');

      // Step 1: Check location API - TRANSACTION START
      print('Step 1: Checking location (Transaction Start)...');
      final locationCheckResult = await _checkLocation(latitude, longitude);

      if (!locationCheckResult['success']) {
        print('Transaction failed at Step 1: Location check failed');
        return {
          'success': false,
          'error': 'Location check failed: ${locationCheckResult['error']}',
          'step': 1,
          'transaction_state': transactionState,
        };
      }

      final locationData = locationCheckResult['data'];
      transactionState['location_check'] = locationData;
      transactionState['completed_steps'].add('location_check');

      // Check if location is within mangrove area
      if (locationData['inside_mangrove'] != true) {
        print(
          'Transaction failed at Step 1: Location not within mangrove area',
        );
        return {
          'success': false,
          'error': 'Location is not within mangrove area',
          'step': 1,
          'transaction_state': transactionState,
        };
      }

      print('✓ Location check passed - proceeding to image validation');

      // Step 2: Predict with image API - AUTOMATIC TRANSACTION CONTINUATION
      print('Step 2: Predicting with image (Automatic continuation)...');
      final predictionResult = await _predictWithImage(imagePath);

      if (!predictionResult['success']) {
        print('Transaction failed at Step 2: Prediction failed');
        return {
          'success': false,
          'error': 'Prediction failed: ${predictionResult['error']}',
          'step': 2,
          'transaction_state': transactionState,
        };
      }

      final predictionData = predictionResult['data'];
      transactionState['prediction'] = predictionData;
      transactionState['completed_steps'].add('prediction');

      // Debug logging for final_result
      print('Prediction data: $predictionData');
      print('Final result type: ${predictionData['final_result'].runtimeType}');
      print('Final result value: ${predictionData['final_result']}');

      // Check if AI validation passed - handle both integer and string values
      final finalResult = predictionData['final_result'];
      final isValidResult =
          finalResult == 1 || finalResult == '1' || finalResult == true;

      if (!isValidResult) {
        print('Transaction failed at Step 2: AI validation failed');
        print(
          'Expected: 1, "1", or true, Got: $finalResult (${finalResult.runtimeType})',
        );
        return {
          'success': false,
          'error':
          'AI validation failed: Image does not show environmental damage',
          'step': 2,
          'transaction_state': transactionState,
        };
      }

      print('✓ Prediction passed - proceeding to complaint submission');

      // Step 3: Submit complaint API - TRANSACTION FINALIZATION
      print('Step 3: Submitting complaint (Transaction Finalization)...');
      final complaintResult = await _submitComplaint(
        email: email,
        latitude: latitude,
        longitude: longitude,
        type: type,
        description: description,
        aiStatus: predictionData['final_result'].toString(),
        imagePath: imagePath,
      );

      if (!complaintResult['success']) {
        print('Transaction failed at Step 3: Complaint submission failed');
        return {
          'success': false,
          'error': 'Complaint submission failed: ${complaintResult['error']}',
          'step': 3,
          'transaction_state': transactionState,
        };
      }

      transactionState['complaint'] = complaintResult['data'];
      transactionState['completed_steps'].add('complaint');

      print('✓ Complaint submitted successfully - Transaction completed');

      // TRANSACTION SUCCESS
      return {
        'success': true,
        'data': {
          'location_check': locationData,
          'prediction': predictionData,
          'complaint': complaintResult['data'],
        },
        'transaction_state': transactionState,
        'message':
        'Report submitted successfully - All validation steps completed',
      };
    } catch (e) {
      print('Transaction error: $e');
      return {
        'success': false,
        'error': 'Transaction failed: $e',
        'transaction_state': transactionState,
      };
    }
  }

  // Enhanced location check with transaction support
  static Future<Map<String, dynamic>> _checkLocation(
      double latitude,
      double longitude,
      ) async {
    try {
      final url = Uri.parse(
        'https://2b41fc7defb5.ngrok-free.app/check',
      ).replace(
        queryParameters: {
          'lat': latitude.toString(),
          'lon': longitude.toString(),
          'buffer': '11',
        },
      );

      print('Checking location at: $url');

      final response = await http.get(url);

      print('Location check response status: ${response.statusCode}');
      print('Location check response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final responseData = jsonDecode(response.body);

          // Enhanced response with transaction metadata
          return {
            'success': true,
            'data': {
              ...responseData,
              'transaction_timestamp': DateTime.now().toIso8601String(),
              'location_coordinates': {'lat': latitude, 'lng': longitude},
            },
          };
        } catch (e) {
          return {
            'success': false,
            'error': 'Invalid response format: ${response.body}',
          };
        }
      } else {
        return {
          'success': false,
          'error': 'Location check failed. Status code: ${response.statusCode}',
        };
      }
    } catch (e) {
      print('Location check error: $e');
      return {'success': false, 'error': 'Network error: $e'};
    }
  }

  // Enhanced image prediction with transaction support
  static Future<Map<String, dynamic>> _predictWithImage(
      String imagePath,
      ) async {
    try {
      final url = Uri.parse('https://10ee96ed05cd.ngrok-free.app/predict');

      print('Predicting with image at: $url');
      print('Image path: $imagePath');

      // Create multipart request
      var request = http.MultipartRequest('POST', url);

      // Add image file
      var imageFile = File(imagePath);
      if (!await imageFile.exists()) {
        return {
          'success': false,
          'error': 'Image file not found at path: $imagePath',
        };
      }

      var multipartFile = await http.MultipartFile.fromPath('image', imagePath);
      request.files.add(multipartFile);

      print('Sending prediction request with image...');

      // Send request
      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      print('Prediction response status: ${response.statusCode}');
      print('Prediction response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final responseData = jsonDecode(response.body);

          // Enhanced response with transaction metadata
          return {
            'success': true,
            'data': {
              ...responseData,
              'transaction_timestamp': DateTime.now().toIso8601String(),
              'image_path': imagePath,
            },
          };
        } catch (e) {
          return {
            'success': false,
            'error': 'Invalid response format: ${response.body}',
          };
        }
      } else {
        return {
          'success': false,
          'error': 'Prediction failed. Status code: ${response.statusCode}',
        };
      }
    } catch (e) {
      print('Prediction error: $e');
      return {'success': false, 'error': 'Network error: $e'};
    }
  }

  // Enhanced complaint submission with transaction support
  static Future<Map<String, dynamic>> _submitComplaint({
    required String email,
    required double latitude,
    required double longitude,
    required String type,
    required String description,
    required String aiStatus,
    required String imagePath,
  }) async {
    try {
      final url = Uri.parse(
        'https://manishkumardev.me/mangrove/complaints/insert.php',
      );

      print('Submitting complaint to: $url');

      // Create multipart request
      var request = http.MultipartRequest('POST', url);

      // Add form fields
      request.fields['email'] = email;
      request.fields['latitude'] = latitude.toString();
      request.fields['longitude'] = longitude.toString();
      request.fields['type'] = type;
      request.fields['dis'] = description;
      request.fields['ai_status'] = aiStatus;

      // Add image file - try multiple approaches
      var imageFile = File(imagePath);
      if (await imageFile.exists()) {
        print('Image file exists at: $imagePath');
        print('Image file size: ${await imageFile.length()} bytes');

        // Approach 1: Send as multipart file
        var multipartFile = await http.MultipartFile.fromPath(
          'photo',
          imagePath,
        );
        request.files.add(multipartFile);

        // Approach 2: Also send as base64 encoded data in a field
        try {
          List<int> imageBytes = await imageFile.readAsBytes();
          String base64Image = base64Encode(imageBytes);
          request.fields['image_data'] = base64Image;
          print('Added base64 image data to fields');
        } catch (e) {
          print('Failed to encode image as base64: $e');
        }

        print('Added image file to complaint submission');
        print('Number of files in request: ${request.files.length}');
      } else {
        print('Warning: Image file not found at path: $imagePath');
      }

      print('Sending complaint data: ${request.fields}');
      print(
        'Request files: ${request.files.map((f) => '${f.field}: ${f.filename}').toList()}',
      );

      // Send request
      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      print('Complaint response status: ${response.statusCode}');
      print('Complaint response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final responseData = jsonDecode(response.body);

          // Check if the API response indicates success or error
          if (responseData['status'] == 'success') {
            // Enhanced response with transaction metadata
            return {
              'success': true,
              'data': {
                ...responseData,
                'transaction_timestamp': DateTime.now().toIso8601String(),
                'submission_data': {
                  'email': email,
                  'latitude': latitude,
                  'longitude': longitude,
                  'type': type,
                  'description': description,
                  'ai_status': aiStatus,
                },
              },
            };
          } else {
            return {
              'success': false,
              'error': responseData['message'] ?? 'Complaint submission failed',
            };
          }
        } catch (e) {
          return {
            'success': false,
            'error': 'Invalid response format: ${response.body}',
          };
        }
      } else {
        return {
          'success': false,
          'error':
          'Complaint submission failed. Status code: ${response.statusCode}',
        };
      }
    } catch (e) {
      print('Complaint submission error: $e');
      return {'success': false, 'error': 'Network error: $e'};
    }
  }

  // Keep the old predictIncident method for backward compatibility
  static Future<Map<String, dynamic>> predictIncident({
    required double latitude,
    required double longitude,
    required String imagePath,
  }) async {
    try {
      final url = Uri.parse('http://10.231.71.250:5000/predict');

      print('Sending prediction request to: $url');
      print('Latitude: $latitude, Longitude: $longitude');
      print('Image path: $imagePath');

      // Create multipart request
      var request = http.MultipartRequest('POST', url);

      // Add latitude and longitude as fields
      request.fields['lat'] = latitude.toString();
      request.fields['lon'] = longitude.toString();

      // Add image file
      var imageFile = File(imagePath);
      if (!await imageFile.exists()) {
        return {
          'success': false,
          'error': 'Image file not found at path: $imagePath',
        };
      }

      var multipartFile = await http.MultipartFile.fromPath('image', imagePath);
      request.files.add(multipartFile);

      print('Sending multipart request with image and coordinates...');

      // Send request
      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      print('Prediction Response status: ${response.statusCode}');
      print('Prediction Response body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final responseData = jsonDecode(response.body);
          return {'success': true, 'data': responseData};
        } catch (e) {
          return {
            'success': false,
            'error': 'Invalid response format: ${response.body}',
          };
        }
      } else {
        return {
          'success': false,
          'error':
          'Prediction failed. Status code: ${response.statusCode}\nResponse: ${response.body}',
        };
      }
    } catch (e) {
      print('Prediction API Error: $e');
      return {'success': false, 'error': 'Network error: $e'};
    }
  }
}
