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
      final url = Uri.parse('$baseUrl/reports/user_reports.php');

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

      var multipartFile = await http.MultipartFile.fromPath(
        'image',
        imagePath,
      );
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