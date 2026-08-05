import 'package:flutter/material.dart';

import '../../../core/api/api_client.dart';
import '../../../core/config/app_config.dart';
import '../../../core/models/wilaya.dart';
import '../../chat/presentation/agent_chat_screen.dart';
import '../../wilaya/presentation/wilaya_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, this.api});

  /// Injectable API client (tests pass a stub; default is the real one).
  final ApiClient? api;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final ApiClient _api;
  late Future<List<Wilaya>> _wilayas;

  @override
  void initState() {
    super.initState();
    _api = widget.api ?? ApiClient();
    _wilayas = _api.getWilayas();
  }

  void _reload() {
    setState(() {
      _wilayas = _api.getWilayas();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppConfig.appName),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => AgentChatScreen(api: _api),
            ),
          );
        },
        icon: const Icon(Icons.assistant),
        label: const Text('Ask ATHAR'),
      ),
      body: FutureBuilder<List<Wilaya>>(
        future: _wilayas,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return _ErrorView(error: snapshot.error!, onRetry: _reload);
          }
          final wilayas = snapshot.data ?? const <Wilaya>[];
          return ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: wilayas.length,
            itemBuilder: (context, index) {
              final w = wilayas[index];
              return Card(
                margin: const EdgeInsets.symmetric(vertical: 6),
                child: InkWell(
                  borderRadius: BorderRadius.circular(12),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => WilayaDetailScreen(
                          wilaya: w,
                          api: widget.api,
                        ),
                      ),
                    );
                  },
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              w.name,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'wilaya ${w.id}',
                              style: TextStyle(
                                color: Colors.grey.shade600,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                        if (w.highlightPoi != null) ...[
                          const SizedBox(height: 4),
                          Text(
                            w.highlightPoi!,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(color: Colors.grey.shade700),
                          ),
                        ],
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8,
                          children: [
                            _StatChip(label: '${w.totalPois} POIs'),
                            _StatChip(label: '${w.totalStays} stays'),
                            _StatChip(label: '${w.totalExperiences} exp'),
                            _StatChip(label: '${w.totalArtisans} artisans'),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.secondaryContainer,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(label, style: const TextStyle(fontSize: 12)),
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.error, required this.onRetry});

  final Object error;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.cloud_off,
              size: 48,
              color: Theme.of(context).colorScheme.error,
            ),
            const SizedBox(height: 12),
            const Text('Could not reach the ATHAR API'),
            const SizedBox(height: 8),
            Text(
              '$error',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }
}
