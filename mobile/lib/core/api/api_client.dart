import 'dart:async';

import 'package:dio/dio.dart';

import '../config/app_config.dart';
import '../models/wilaya.dart';

/// Thin dio client for the ATHAR REST API (`/api/v1`).
class ApiClient {
  ApiClient({Dio? dio})
      : _dio = dio ??
            Dio(BaseOptions(
              baseUrl: AppConfig.apiBaseUrl,
              connectTimeout: AppConfig.apiTimeout,
              receiveTimeout: AppConfig.apiTimeout,
            ));

  final Dio _dio;

  Future<List<Wilaya>> getWilayas() async {
    final res = await _dio.get<dynamic>('/discover/wilayas');
    final data = res.data;
    if (data is! List) {
      throw ApiException('Unexpected response shape');
    }
    return data
        .map((e) => Wilaya.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}

class ApiException implements Exception {
  const ApiException(this.message);

  final String message;

  @override
  String toString() => message;
}
