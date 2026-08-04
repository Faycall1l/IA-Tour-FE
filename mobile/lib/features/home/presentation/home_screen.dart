import 'package:flutter/material.dart';

import '../../../core/config/app_config.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(AppConfig.appName)),
      body: const Center(
        child: Text('Discover Algeria — app scaffold ready'),
      ),
    );
  }
}
