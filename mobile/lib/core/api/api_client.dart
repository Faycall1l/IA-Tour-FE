import 'dart:async';

import 'package:dio/dio.dart';

import '../config/app_config.dart';
import '../models/poi_detail.dart';
import '../models/wilaya.dart';
import '../models/wilaya_detail.dart';

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

  Future<WilayaDetail> getWilayaDetail(int wilayaId) async {
    final res = await _dio.get<dynamic>('/discover/wilayas/$wilayaId');
    final data = res.data;
    if (data is! Map<String, dynamic>) {
      throw ApiException('Unexpected response shape');
    }
    return WilayaDetail.fromJson(data);
  }

  Future<PoiDetail> getPoiDetail(String poiId) async {
    final res = await _dio.get<dynamic>('/pois/$poiId');
    final data = res.data;
    if (data is! Map<String, dynamic>) {
      throw ApiException('Unexpected response shape');
    }
    return PoiDetail.fromJson(data);
  }

  Future<void> sendOtp(String phone) async {
    await _dio.post<dynamic>('/auth/send-otp', data: {'phone': phone});
  }

  Future<String> verifyOtp(String phone, String code) async {
    final res = await _dio.post<dynamic>(
      '/auth/verify-otp',
      data: {'phone': phone, 'code': code},
    );
    final data = res.data;
    if (data is! Map<String, dynamic>) {
      throw ApiException('Unexpected response shape');
    }
    final token = data['access_token'] as String?;
    if (token == null) {
      throw ApiException('Login failed — no token returned');
    }
    return token;
  }

  Future<AgentChatReply> chat(
    String message, {
    String? sessionId,
    required String token,
  }) async {
    final res = await _dio.post<dynamic>(
      '/agent/chat',
      data: {
        'message': message,
        if (sessionId != null) 'session_id': sessionId,
      },
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
    final data = res.data;
    if (data is! Map<String, dynamic>) {
      throw ApiException('Unexpected response shape');
    }
    return AgentChatReply(
      reply: (data['reply'] as String?) ?? '',
      sessionId: data['session_id'] as String?,
      degraded: (data['degraded'] as bool?) ?? false,
    );
  }
}

class AgentChatReply {
  const AgentChatReply({
    required this.reply,
    this.sessionId,
    this.degraded = false,
  });

  final String reply;
  final String? sessionId;
  final bool degraded;
}

class ApiException implements Exception {
  const ApiException(this.message);

  final String message;

  @override
  String toString() => message;
}
