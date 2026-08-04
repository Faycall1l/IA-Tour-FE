class Wilaya {
  const Wilaya({
    required this.id,
    required this.name,
    this.description,
    this.totalPois = 0,
    this.totalStays = 0,
    this.totalExperiences = 0,
    this.totalArtisans = 0,
    this.highlightPoi,
    this.highlightPoiPhoto,
  });

  final int id;
  final String name;
  final String? description;
  final int totalPois;
  final int totalStays;
  final int totalExperiences;
  final int totalArtisans;
  final String? highlightPoi;
  final String? highlightPoiPhoto;

  factory Wilaya.fromJson(Map<String, dynamic> json) {
    return Wilaya(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String?,
      totalPois: (json['total_pois'] as num?)?.toInt() ?? 0,
      totalStays: (json['total_stays'] as num?)?.toInt() ?? 0,
      totalExperiences: (json['total_experiences'] as num?)?.toInt() ?? 0,
      totalArtisans: (json['total_artisans'] as num?)?.toInt() ?? 0,
      highlightPoi: json['highlight_poi'] as String?,
      highlightPoiPhoto: json['highlight_poi_photo'] as String?,
    );
  }
}
