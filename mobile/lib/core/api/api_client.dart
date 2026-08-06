import 'dart:async';

import 'package:athar_api/athar_api.dart' as gen;
import 'package:dio/dio.dart';

import '../config/app_config.dart';
import '../models/poi_detail.dart';
import '../models/wilaya.dart';
import '../models/wilaya_detail.dart';

/// Thin dio client for the ATHAR REST API (`/api/v1`).
///
/// Facade over the generated [gen.ApiClient] (S3: openapi_flutter_gen):
/// keeps the app's presentation model signatures stable while all transport,
/// serialization and type checking come from the generated package.
class ApiClient {
  ApiClient({Dio? dio}) {
    final clientDio = dio ??
        Dio(BaseOptions(
          baseUrl: AppConfig.apiBaseUrl,
          connectTimeout: AppConfig.apiTimeout,
          receiveTimeout: AppConfig.apiTimeout,
        ));
    _generated = gen.ApiClient(dio: clientDio, baseUrl: _origin);
  }

  late final gen.ApiClient _generated;

  /// API origin without the `/api/v1` prefix: generated paths already include it.
  static String get _origin =>
      AppConfig.apiBaseUrl.replaceFirst(RegExp(r'/api/v1/?$'), '');

  Future<List<Wilaya>> getWilayas() async {
    final res = await _generated.discover.getDiscoverWilayas();
    return switch (res) {
      gen.GetDiscoverWilayasResultHttp200(:final data) =>
        data.map(_toWilaya).toList(),
      _ => throw const ApiException('Failed to load wilayas'),
    };
  }

  Future<WilayaDetail> getWilayaDetail(int wilayaId) async {
    final res = await _generated.discover
        .getDiscoverWilayasWilayaId(wilayaId: gen.WilayaIdVariant0(wilayaId));
    return switch (res) {
      gen.GetDiscoverWilayasWilayaIdResultHttp200(:final data) =>
        WilayaDetail(
          wilayaId: data.wilayaId,
          wilayaName: data.wilayaName,
          pois: data.pois.map(_toPoiSummary).toList(),
          stays: data.stays.map(_toStaySummary).toList(),
          experiences: data.experiences.map(_toExperienceSummary).toList(),
        ),
      _ => throw const ApiException('Failed to load wilaya detail'),
    };
  }

  Future<PoiDetail> getPoiDetail(String poiId) async {
    final res = await _generated.pointsOfInterest
        .getPoisPoiId(poiId: poiId);
    return switch (res) {
      gen.GetPoisPoiIdResultHttp200(:final data) => _toPoiDetail(data),
      _ => throw const ApiException('Failed to load POI detail'),
    };
  }

  Future<List<PoiDetail>> searchPois(String query, {int limit = 24}) async {
    final res = await _generated.pointsOfInterest
        .getPoisSearch(q: query, limit: limit);
    return switch (res) {
      gen.GetPoisSearchResultHttp200(:final data) =>
        data.items.map(_toPoiDetail).toList(),
      _ => throw const ApiException('Search failed'),
    };
  }

  Future<void> sendOtp(String phone) async {
    final res = await _generated.authentication
        .postAuthSendOtp(oTPRequest: gen.OTPRequest(phone: phone));
    switch (res) {
      case gen.PostAuthSendOtpResultHttp200():
        return;
      default:
        throw const ApiException('Failed to send OTP');
    }
  }

  Future<String> verifyOtp(String phone, String code) async {
    final res = await _generated.authentication.postAuthVerifyOtp(
      oTPVerify: gen.OTPVerify(phone: phone, code: code),
    );
    return switch (res) {
      gen.PostAuthVerifyOtpResultHttp200(:final data) =>
        data.accessToken,
      _ => throw const ApiException('Login failed — no token returned'),
    };
  }

  Future<AgentChatReply> chat(
    String message, {
    String? sessionId,
    required String token,
  }) async {
    final res = await _generated.agents.postAgentChat(
      agentChatRequest: gen.AgentChatRequest(
        message: message,
        sessionId: sessionId != null
            ? gen.AgentChatRequestSessionIdVariant0(sessionId)
            : null,
      ),
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
    return switch (res) {
      gen.PostAgentChatResultHttp200(:final data) =>
        AgentChatReply(
          reply: data.reply,
          sessionId: _val<String>(data.sessionId),
          degraded: _val<bool>(data.degraded) ?? false,
        ),
      _ => throw const ApiException('Agent chat failed'),
    };
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

// --- generated -> presentation model mappers ---------------------------------

Wilaya _toWilaya(gen.WilayaSummary g) => Wilaya(
      id: g.id,
      name: g.name,
      description: _val<String>(g.description),
      totalPois: g.totalPois ?? 0,
      totalStays: g.totalStays ?? 0,
      totalExperiences: g.totalExperiences ?? 0,
      totalArtisans: g.totalArtisans ?? 0,
      highlightPoi: _val<String>(g.highlightPoi),
      highlightPoiPhoto: _val<String>(g.highlightPoiPhoto),
    );

PoiSummary _toPoiSummary(gen.DiscoverPOI p) => PoiSummary(
      id: p.id,
      name: p.name,
      category: p.category,
      description: _val<String>(p.description),
      photoUrl: _val<String>(p.photoUrl),
      entryFeeDzd: _val<num>(p.entryFeeDzd),
    );

StaySummary _toStaySummary(gen.DiscoverStay s) => StaySummary(
      id: s.id,
      name: s.name,
      propertyType: s.propertyType,
      pricePerNightDzd: s.pricePerNightDzd,
      photos: _val<List<String>>(s.photos) ?? const [],
      providerName: _val<String>(s.providerName),
    );

ExperienceSummary _toExperienceSummary(gen.DiscoverExperience e) =>
    ExperienceSummary(
      id: e.id,
      title: e.title,
      category: e.category,
      description: _val<String>(e.description),
      priceDzd: _val<num>(e.priceDzd),
      durationHours: _val<num>(e.durationHours),
      providerName: _val<String>(e.providerName),
    );

PoiDetail _toPoiDetail(gen.POIRead p) => PoiDetail(
      id: p.id,
      name: p.name,
      nameAr: _val<String>(p.nameAr),
      nameEn: _val<String>(p.nameEn),
      category: p.category,
      subtype: _val<String>(p.subtype),
      wilayaId: p.wilayaId,
      description: _val<String>(p.description),
      photoUrl: _val<String>(p.photoUrl),
      photoUrls: _val<List<String>>(p.photoUrls) ?? const [],
      entryFeeDzd: _val<num>(p.entryFeeDzd),
      priceLevel: _val<String>(p.priceLevel),
      openingHours: _val<String>(p.openingHours),
      cuisine: _val<String>(p.cuisine),
      isFeatured: p.isFeatured ?? false,
      rankingPosition: _val<int>(p.rankingPosition),
      rankingTotal: _val<int>(p.rankingTotal),
      suggestedDurationMin: _val<int>(p.suggestedDurationMin),
      funFact: _val<String>(p.funFact),
      website: _val<String>(p.website),
      phone: _val<String>(p.phone),
      latitude: _val<double>(p.latitude),
      longitude: _val<double>(p.longitude),
    );

/// Unwraps a generated sealed field wrapper (single `value` variant) or null.
T? _val<T>(Object? wrapper) {
  if (wrapper == null) return null;
  return (wrapper as dynamic).value as T?;
}
