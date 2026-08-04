import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:athar_mobile/app.dart';
import 'package:athar_mobile/core/api/api_client.dart';
import 'package:athar_mobile/core/models/wilaya.dart';

class _FakeApiClient extends ApiClient {
  _FakeApiClient() : super(dio: null);

  @override
  Future<List<Wilaya>> getWilayas() async => const [
        Wilaya(id: 16, name: 'Algiers', totalPois: 42),
      ];
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
}
