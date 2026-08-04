import 'package:flutter/material.dart';

import 'core/api/api_client.dart';
import 'core/config/app_config.dart';
import 'features/home/presentation/home_screen.dart';

class AtharApp extends StatelessWidget {
  const AtharApp({super.key, this.api});

  /// Injectable API client (tests pass a stub; default is the real one).
  final ApiClient? api;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConfig.appName,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0D6E5F)),
        useMaterial3: true,
      ),
      home: HomeScreen(api: api),
    );
  }
}
