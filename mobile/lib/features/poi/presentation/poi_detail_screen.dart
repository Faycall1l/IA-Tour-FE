import 'package:flutter/material.dart';

import '../../../core/api/api_client.dart';
import '../../../core/models/poi_detail.dart';

class PoiDetailScreen extends StatefulWidget {
  const PoiDetailScreen({super.key, required this.poiId, this.api});

  final String poiId;
  final ApiClient? api;

  @override
  State<PoiDetailScreen> createState() => _PoiDetailScreenState();
}

class _PoiDetailScreenState extends State<PoiDetailScreen> {
  late final ApiClient _api;
  late Future<PoiDetail> _detail;

  @override
  void initState() {
    super.initState();
    _api = widget.api ?? ApiClient();
    _detail = _api.getPoiDetail(widget.poiId);
  }

  void _reload() {
    setState(() {
      _detail = _api.getPoiDetail(widget.poiId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: FutureBuilder<PoiDetail>(
        future: _detail,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return _ErrorView(error: snapshot.error!, onRetry: _reload);
          }
          return _PoiContent(poi: snapshot.data!);
        },
      ),
    );
  }
}

class _PoiContent extends StatelessWidget {
  const _PoiContent({required this.poi});

  final PoiDetail poi;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        SizedBox(
          height: 240,
          width: double.infinity,
          child: poi.photoUrl != null
              ? Image.network(
                  poi.photoUrl!,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => _PhotoPlaceholder(category: poi.category),
                )
              : _PhotoPlaceholder(category: poi.category),
        ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _Badge(
                    label: poi.category.toUpperCase(),
                    color: theme.colorScheme.primary,
                  ),
                  if (poi.subtype != null)
                    _Badge(
                      label: poi.subtype!.replaceAll('_', ' ').toUpperCase(),
                      color: theme.colorScheme.secondary,
                    ),
                  if (poi.isFeatured)
                    const _Badge(label: '★ FEATURED', color: Colors.amber),
                  if (poi.rankingPosition != null && poi.rankingTotal != null)
                    _Badge(
                      label: '#${poi.rankingPosition} of ${poi.rankingTotal}',
                      color: Colors.grey,
                    ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                poi.name ?? 'Unnamed ${poi.category}',
                style: theme.textTheme.headlineSmall
                    ?.copyWith(fontWeight: FontWeight.bold),
              ),
              if (poi.nameAr != null)
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text(
                    poi.nameAr!,
                    style: theme.textTheme.titleMedium
                        ?.copyWith(color: Colors.grey.shade600),
                  ),
                ),
              if (poi.description != null) ...[
                const SizedBox(height: 12),
                Text(
                  poi.description!,
                  style: theme.textTheme.bodyMedium
                      ?.copyWith(height: 1.5, color: Colors.grey.shade800),
                ),
              ],
              if (poi.funFact != null) ...[
                const SizedBox(height: 16),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.amber.shade50,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.amber.shade200),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'DID YOU KNOW?',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 1.2,
                          color: Colors.amber.shade800,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        poi.funFact!,
                        style: TextStyle(color: Colors.amber.shade900),
                      ),
                    ],
                  ),
                ),
              ],
              const SizedBox(height: 20),
              _InfoRow(
                icon: Icons.confirmation_number_outlined,
                label: 'Entry fee',
                value: poi.entryFeeDzd != null
                    ? '${poi.entryFeeDzd!.toInt()} DZD'
                    : 'Free',
              ),
              if (poi.suggestedDurationMin != null)
                _InfoRow(
                  icon: Icons.schedule,
                  label: 'Suggested visit',
                  value: '${poi.suggestedDurationMin} min',
                ),
              if (poi.openingHours != null)
                _InfoRow(
                  icon: Icons.access_time,
                  label: 'Opening hours',
                  value: poi.openingHours!,
                ),
              if (poi.cuisine != null)
                _InfoRow(
                  icon: Icons.restaurant,
                  label: 'Cuisine',
                  value: poi.cuisine!,
                ),
              if (poi.phone != null)
                _InfoRow(
                  icon: Icons.phone,
                  label: 'Phone',
                  value: poi.phone!,
                ),
              if (poi.latitude != null && poi.longitude != null)
                _InfoRow(
                  icon: Icons.place_outlined,
                  label: 'Location',
                  value:
                      '${poi.latitude!.toStringAsFixed(5)}, ${poi.longitude!.toStringAsFixed(5)}',
                ),
              const SizedBox(height: 20),
              if (poi.website != null)
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: () => _launch(poi.website!),
                    icon: const Icon(Icons.open_in_new),
                    label: const Text('Visit website'),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }

  void _launch(String url) {
    // Web demo: open in a new tab via url_launcher when added; for now no-op.
  }
}

class _Badge extends StatelessWidget {
  const _Badge({required this.label, required this.color});

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.icon, required this.label, required this.value});

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: Colors.grey.shade600),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade500,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(value, style: const TextStyle(fontSize: 14)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _PhotoPlaceholder extends StatelessWidget {
  const _PhotoPlaceholder({required this.category});

  final String category;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: Theme.of(context).colorScheme.surfaceContainerHighest,
      alignment: Alignment.center,
      child: Text(
        category.isEmpty ? '?' : category[0].toUpperCase(),
        style: Theme.of(context).textTheme.displayMedium,
      ),
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
            const Text('Could not load this POI'),
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