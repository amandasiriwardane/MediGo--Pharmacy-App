import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import '../models/user.dart';

class AuthService {
  final storage = FlutterSecureStorage();
  final String baseUrl = 'http://localhost:5000/api'; // backend base URL

  // Register
  Future<User?> register(
    String name,
    String email,
    String password,
    String phone,
    String role,
  ) async {
    final url = Uri.parse('$baseUrl/auth/register');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'phone': phone,
        'role': role,
      }),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      final user = User.fromJson(data['user']);
      await storage.write(key: 'token', value: user.token);
      return user;
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? error['msg']);
    }
  }

  // Login
  Future<User?> login(String email, String password) async {
    final url = Uri.parse('$baseUrl/auth/login');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final user = User.fromJson(data['user']..['token'] = data['token']);
      await storage.write(key: 'token', value: data['token']);
      return user;
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error']);
    }
  }

  // Logout
  Future<void> logout() async {
    await storage.delete(key: 'token');
  }

  // Get token
  Future<String?> getToken() async {
    return await storage.read(key: 'token');
  }
}
