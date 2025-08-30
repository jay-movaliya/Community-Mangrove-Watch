import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String _keyIsLoggedIn = 'is_logged_in';
  static const String _keyUserEmail = 'user_email';
  static const String _keyUserName = 'user_name';
  static const String _keyUserType = 'user_type';
  static const String _keyUserPhone = 'user_phone';
  static const String _keyAuthToken = 'auth_token';

  // Save user data after successful login/registration
  static Future<void> saveUserData({
    required String email,
    required String name,
    required String userType,
    required String phone,
    String? token,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    
    print('Saving user data - Name: "$name", Email: "$email", Type: "$userType", Phone: "$phone"');
    
    await prefs.setBool(_keyIsLoggedIn, true);
    await prefs.setString(_keyUserEmail, email);
    await prefs.setString(_keyUserName, name);
    await prefs.setString(_keyUserType, userType);
    await prefs.setString(_keyUserPhone, phone);
    
    if (token != null) {
      await prefs.setString(_keyAuthToken, token);
    }
    
    print('User data saved successfully');
  }

  // Check if user is logged in
  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyIsLoggedIn) ?? false;
  }

  // Get user email
  static Future<String?> getUserEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyUserEmail);
  }

  // Get user name
  static Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyUserName);
  }

  // Get user type
  static Future<String?> getUserType() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyUserType);
  }

  // Get user phone
  static Future<String?> getUserPhone() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyUserPhone);
  }

  // Get auth token
  static Future<String?> getAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyAuthToken);
  }

  // Get all user data
  static Future<Map<String, String?>> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    
    return {
      'email': prefs.getString(_keyUserEmail),
      'name': prefs.getString(_keyUserName),
      'userType': prefs.getString(_keyUserType),
      'phone': prefs.getString(_keyUserPhone),
      'token': prefs.getString(_keyAuthToken),
    };
  }

  // Clear all user data (logout)
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    
    await prefs.remove(_keyIsLoggedIn);
    await prefs.remove(_keyUserEmail);
    await prefs.remove(_keyUserName);
    await prefs.remove(_keyUserType);
    await prefs.remove(_keyUserPhone);
    await prefs.remove(_keyAuthToken);
    
    print('User logged out - all data cleared');
  }

  // Update specific user data
  static Future<void> updateUserData({
    String? email,
    String? name,
    String? userType,
    String? phone,
    String? token,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    
    if (email != null) await prefs.setString(_keyUserEmail, email);
    if (name != null) await prefs.setString(_keyUserName, name);
    if (userType != null) await prefs.setString(_keyUserType, userType);
    if (phone != null) await prefs.setString(_keyUserPhone, phone);
    if (token != null) await prefs.setString(_keyAuthToken, token);
  }
}