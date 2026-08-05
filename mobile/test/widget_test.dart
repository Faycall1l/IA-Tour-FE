import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:athar_mobile/app.dart';
import 'package:athar_mobile/core/api/api_client.dart';
import 'package:athar_mobile/core/models/poi_detail.dart';
import 'package:athar_mobile/core/models/wilaya.dart';
import 'package:athar_mobile/core/models/wilaya_detail.dart';
import 'package:athar_mobile/features/chat/presentation/agent_chat_screen.dart';
import 'package:athar_mobile/features/poi/presentation/poi_detail_screen.dart';
import 'package:athar_mobile/features/search/presentation/search_screen.dart';
import 'package:athar_mobile/features/wilaya/presentation/wilaya_detail_screen.dart';

class _FakeApiClient extends ApiClient {
  _FakeApiClient() : super(dio: null);

  @override
  Future<List<Wilaya>> getWilayas() async => const [
        Wilaya(id: 16, name: 'Algiers', totalPois: 42),
      ];

  @override
  Future<WilayaDetail> getWilayaDetail(int wilayaId) async =>
      const WilayaDetail(
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
  Future<PoiDetail> getPoiDetail(String poiId) async {
    if (poiId == 's1') {
      return const PoiDetail(
        id: 's1',
        name: 'Timgad',
        category: 'historical',
        wilayaId: 43,
        description: 'A UNESCO-listed Roman city.',
        funFact: 'Founded by Trajan in AD 100.',
        entryFeeDzd: 300,
        suggestedDurationMin: 60,
      );
    }
    return const PoiDetail(
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

  @override
  Future<String> verifyOtp(String phone, String code) async => 'fake-token';

  @override
  Future<List<PoiDetail>> searchPois(String query, {int limit = 24}) async {
    return const [
      PoiDetail(
        id: 's1',
        name: 'Timgad',
        category: 'historical',
        wilayaId: 43,
        description: 'A UNESCO-listed Roman city.',
        entryFeeDzd: 300,
        funFact: 'Founded by Trajan in AD 100.',
      ),
      PoiDetail(
        id: 's2',
        name: 'Beach of El Djedid',
        category: 'beach',
        wilayaId: 16,
      ),
    ];
  }

  @override
  Future<AgentChatReply> chat(
    String message, {
    String? sessionId,
    required String token,
  }) async {
    return AgentChatReply(
      reply: 'Here are the top things to do in Algiers…',
      sessionId: 'sess-1',
      degraded: false,
    );
  }
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
  testWidgets('search screen returns results and filters by category',
      (tester) async {
    final api = _FakeApiClient();
    await tester.pumpWidget(
      MaterialApp(home: SearchScreen(api: api)),
    );
    await tester.pumpAndSettle();

    await tester.enterText(
      find.widgetWithText(TextField, 'Try "roman ruins", "beaches in Oran"…'),
      'roman ruins',
    );
    await tester.pump(const Duration(milliseconds: 400));
    await tester.pumpAndSettle();

    expect(find.text('Timgad'), findsOneWidget);
    expect(find.text('Beach of El Djedid'), findsOneWidget);

    // Filter to HISTORICAL only.
    await tester.tap(find.text('HISTORICAL'));
    await tester.pumpAndSettle();

    expect(find.text('Timgad'), findsOneWidget);
    expect(find.text('Beach of El Djedid'), findsNothing);
  });

  testWidgets('search result navigates to POI detail on tap', (tester) async {
    final api = _FakeApiClient();
    await tester.pumpWidget(
      MaterialApp(home: SearchScreen(api: api)),
    );
    await tester.pumpAndSettle();

    await tester.enterText(
      find.widgetWithText(TextField, 'Try "roman ruins", "beaches in Oran"…'),
      'roman ruins',
    );
    await tester.pump(const Duration(milliseconds: 400));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Timgad'));
    await tester.pumpAndSettle();

    expect(find.text('DID YOU KNOW?'), findsOneWidget);
    expect(find.textContaining('Trajan'), findsOneWidget);
  });

  testWidgets('agent chat signs in with debug OTP and sends a message',
      (tester) async {
    final api = _FakeApiClient();
    await tester.pumpWidget(
      MaterialApp(home: AgentChatScreen(api: api)),
    );
    await tester.pumpAndSettle();

    // Enter phone, tap "Send code", then enter the 6-digit debug code.
    await tester.enterText(
      find.widgetWithText(TextField, '+213'),
      '+213555010203',
    );
    await tester.tap(find.text('Send code'));
    await tester.pumpAndSettle();

    await tester.enterText(
      find.widgetWithText(TextField, '6-digit code'),
      '000000',
    );
    await tester.tap(find.text('Verify & chat'));
    await tester.pumpAndSettle();

    // Chat input is now shown; send a question and expect the reply.
    await tester.enterText(
      find.widgetWithText(TextField, 'Ask anything about Algeria…'),
      'What to do in Oran?',
    );
    await tester.tap(find.byIcon(Icons.send));
    await tester.pumpAndSettle();

    expect(
        find.text('Here are the top things to do in Algiers…'), findsOneWidget);
    expect(find.text('What to do in Oran?'), findsOneWidget);
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
