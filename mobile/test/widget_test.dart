import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:athar_mobile/app.dart';
import 'package:athar_mobile/core/api/api_client.dart';
import 'package:athar_mobile/core/models/poi_detail.dart';
import 'package:athar_mobile/core/models/wilaya.dart';
import 'package:athar_mobile/core/models/wilaya_detail.dart';
import 'package:athar_mobile/features/poi/presentation/poi_detail_screen.dart';
import 'package:athar_mobile/features/wilaya/presentation/wilaya_detail_screen.dart';

class _FakeApiClient extends ApiClient {
  _FakeApiClient() : super(dio: null);

  @override
  Future<List<Wilaya>> getWilayas() async => const [
        Wilaya(id: 16, name: 'Algiers', totalPois: 42),
      ];

  @override
  Future<WilayaDetail> getWilayaDetail(int wilayaId) async => const WilayaDetail(
        wilayaId: 16,
        wilayaName: 'Algiers',
        pois: [
          PoiSummary(
            id: 'p1',
            name: 'Casbah',
            category: 'historical',
            entryFeeDzd: 100,
          ),
          PoiSummary(id: 'p2', name: 'Jardin d\u2019Essai', category: 'park'),
          PoiSummary(id: 'p3', name: 'Café Maure', category: 'cafe'),
        ],
        stays: [
          StaySummary(id: 's1', name: 'Hôtel Aletti', pricePerNightDzd: 5000),
        ],
        experiences: [
          ExperienceSummary(id: 'e1', title: 'Casbah walking tour'),
        ],
      );

  @override
  Future<PoiDetail> getPoiDetail(String poiId) async => const PoiDetail(
        id: 'p1',
        name: 'Casbah',
        category: 'historical',
        description: 'A UNESCO-listed old town.',
        funFact: 'The Casbah has over 700 years of history.',
        entryFeeDzd: 100,
        suggestedDurationMin: 40,
        isFeatured: true,
      );
}

void main() {
  testWidgets('ATHAR app renders home screen', (tester) async {
    await tester.pumpWidget(AtharApp(api: _FakeApiClient()));
    expect(find.text('ATHAR'), findsOneWidget);
    expect(find.byType(Scaffold), findsOneWidget);
  });

  testWidgets('home screen lists wilayas from the API', (tester) async {
    await tester.pumpWidget(AtharApp(api: _FakeApiClient()));
    await tester.pumpAndSettle();

    expect(find.text('Algiers'), findsOneWidget);
    expect(find.text('42 POIs'), findsOneWidget);
  });

  testWidgets('home navigates to wilaya detail and filters by category',
      (tester) async {
    final api = _FakeApiClient();
    await tester.pumpWidget(AtharApp(api: api));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Algiers'));
    await tester.pumpAndSettle();

    expect(find.textContaining('3 POIs'), findsOneWidget);
    expect(find.text('Casbah'), findsOneWidget);
    expect(find.text('Jardin d\u2019Essai'), findsOneWidget);

    // Open the category dropdown and pick 'PARK'.
    await tester.tap(find.byType(DropdownButtonFormField<String>));
    await tester.pumpAndSettle();
    await tester.tap(find.text('PARK').last);
    await tester.pumpAndSettle();

    expect(find.text('Jardin d\u2019Essai'), findsOneWidget);
    expect(find.text('Casbah'), findsNothing);
  });

  testWidgets('wilaya detail screen shows an error view on API failure',
      (tester) async {
    final api = _FailingApiClient();
    await tester.pumpWidget(
      MaterialApp(
        home: WilayaDetailScreen(
          wilaya: const Wilaya(id: 16, name: 'Algiers'),
          api: api,
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Could not load this wilaya'), findsOneWidget);
    expect(find.text('Retry'), findsOneWidget);
  });
testWidgets('POI detail screen shows fun fact, fee, and duration',
      (tester) async {
    final api = _FakeApiClient();
    await tester.pumpWidget(
      MaterialApp(
        home: PoiDetailScreen(poiId: 'p1', api: api),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Casbah'), findsOneWidget);
    expect(find.textContaining('UNESCO'), findsOneWidget);
    expect(find.text('DID YOU KNOW?'), findsOneWidget);
    expect(find.text('100 DZD'), findsOneWidget);
    expect(find.text('40 min'), findsOneWidget);
  });

  testWidgets('wilaya detail navigates to POI detail on card tap',
      (tester) async {
    final api = _FakeApiClient();
    await tester.pumpWidget(AtharApp(api: api));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Algiers'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Casbah'));
    await tester.pumpAndSettle();

    expect(find.text('DID YOU KNOW?'), findsOneWidget);
  });
}

class _FailingApiClient extends ApiClient {
  _FailingApiClient() : super(dio: null);

  @override
  Future<List<Wilaya>> getWilayas() async {
    throw ApiException('boom');
  }

  @override
  Future<WilayaDetail> getWilayaDetail(int wilayaId) async {
    throw ApiException('boom');
  }
}
