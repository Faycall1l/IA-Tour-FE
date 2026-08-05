class PoiSummary {
  const PoiSummary({
    required this.id,
    this.name,
    this.category = 'other',
    this.description,
    this.photoUrl,
    this.entryFeeDzd,
  });

  final String id;
  final String? name;
  final String category;
  final String? description;
  final String? photoUrl;
  final num? entryFeeDzd;

  factory PoiSummary.fromJson(Map<String, dynamic> json) {
    return PoiSummary(
      id: json['id'] as String,
      name: json['name'] as String?,
      category: (json['category'] as String?) ?? 'other',
      description: json['description'] as String?,
      photoUrl: json['photo_url'] as String?,
      entryFeeDzd: json['entry_fee_dzd'] as num?,
    );
  }
}

class StaySummary {
  const StaySummary({
    required this.id,
    this.name,
    this.propertyType,
    this.pricePerNightDzd,
    this.photos = const [],
    this.providerName,
  });

  final String id;
  final String? name;
  final String? propertyType;
  final num? pricePerNightDzd;
  final List<String> photos;
  final String? providerName;

  factory StaySummary.fromJson(Map<String, dynamic> json) {
    return StaySummary(
      id: json['id'] as String,
      name: json['name'] as String?,
      propertyType: json['property_type'] as String?,
      pricePerNightDzd: json['price_per_night_dzd'] as num?,
      photos: _stringList(json['photos']),
      providerName: json['provider_name'] as String?,
    );
  }
}

class ExperienceSummary {
  const ExperienceSummary({
    required this.id,
    this.title,
    this.category,
    this.description,
    this.priceDzd,
    this.durationHours,
    this.providerName,
  });

  final String id;
  final String? title;
  final String? category;
  final String? description;
  final num? priceDzd;
  final num? durationHours;
  final String? providerName;

  factory ExperienceSummary.fromJson(Map<String, dynamic> json) {
    return ExperienceSummary(
      id: json['id'] as String,
      title: json['title'] as String?,
      category: json['category'] as String?,
      description: json['description'] as String?,
      priceDzd: json['price_dzd'] as num?,
      durationHours: json['duration_hours'] as num?,
      providerName: json['provider_name'] as String?,
    );
  }
}

class WilayaDetail {
  const WilayaDetail({
    required this.wilayaId,
    required this.wilayaName,
    this.description,
    this.pois = const [],
    this.stays = const [],
    this.experiences = const [],
  });

  final int wilayaId;
  final String wilayaName;
  final String? description;
  final List<PoiSummary> pois;
  final List<StaySummary> stays;
  final List<ExperienceSummary> experiences;

  factory WilayaDetail.fromJson(Map<String, dynamic> json) {
    return WilayaDetail(
      wilayaId: (json['wilaya_id'] as num?)?.toInt() ?? 0,
      wilayaName: (json['wilaya_name'] as String?) ?? '',
      description: json['description'] as String?,
      pois: (json['pois'] as List?)
              ?.map((e) => PoiSummary.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      stays: (json['stays'] as List?)
              ?.map((e) => StaySummary.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      experiences: (json['experiences'] as List?)
              ?.map((e) =>
                  ExperienceSummary.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );
  }
}

List<String> _stringList(dynamic value) {
  if (value is! List) return const [];
  return value.whereType<String>().toList();
}