import 'package:flutter/material.dart';

import 'core/config/app_config.dart';
import 'features/home/presentation/home_screen.dart';

class AtharApp extends StatelessWidget {
  const AtharApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConfig.appName,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0D6E5F)),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
