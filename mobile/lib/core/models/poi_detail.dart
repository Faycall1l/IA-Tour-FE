class PoiDetail {
  const PoiDetail({
    required this.id,
    this.name,
    this.nameAr,
    this.nameEn,
    this.category = 'other',
    this.subtype,
    this.wilayaId,
    this.description,
    this.photoUrl,
    this.photoUrls = const [],
    this.entryFeeDzd,
    this.priceLevel,
    this.openingHours,
    this.cuisine,
    this.isFeatured = false,
    this.rankingPosition,
    this.rankingTotal,
    this.suggestedDurationMin,
    this.funFact,
    this.website,
    this.phone,
    this.latitude,
    this.longitude,
  });

  final String id;
  final String? name;
  final String? nameAr;
  final String? nameEn;
  final String category;
  final String? subtype;
  final int? wilayaId;
  final String? description;
  final String? photoUrl;
  final List<String> photoUrls;
  final num? entryFeeDzd;
  final String? priceLevel;
  final String? openingHours;
  final String? cuisine;
  final bool isFeatured;
  final int? rankingPosition;
  final int? rankingTotal;
  final int? suggestedDurationMin;
  final String? funFact;
  final String? website;
  final String? phone;
  final double? latitude;
  final double? longitude;

  factory PoiDetail.fromJson(Map<String, dynamic> json) {
    return PoiDetail(
      id: json['id'] as String,
      name: json['name'] as String?,
      nameAr: json['name_ar'] as String?,
      nameEn: json['name_en'] as String?,
      category: (json['category'] as String?) ?? 'other',
      subtype: json['subtype'] as String?,
      wilayaId: (json['wilaya_id'] as num?)?.toInt(),
      description: json['description'] as String?,
      photoUrl: json['photo_url'] as String?,
      photoUrls: _stringList(json['photo_urls']),
      entryFeeDzd: json['entry_fee_dzd'] as num?,
      priceLevel: json['price_level'] as String?,
      openingHours: json['opening_hours'] as String?,
      cuisine: json['cuisine'] as String?,
      isFeatured: (json['is_featured'] as bool?) ?? false,
      rankingPosition: (json['ranking_position'] as num?)?.toInt(),
      rankingTotal: (json['ranking_total'] as num?)?.toInt(),
      suggestedDurationMin: (json['suggested_duration_min'] as num?)?.toInt(),
      funFact: json['fun_fact'] as String?,
      website: json['website'] as String?,
      phone: json['phone'] as String?,
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
    );
  }
}

List<String> _stringList(dynamic value) {
  if (value is! List) return const [];
  return value.whereType<String>().toList();
}