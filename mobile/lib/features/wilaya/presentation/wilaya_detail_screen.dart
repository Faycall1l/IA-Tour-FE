import 'package:flutter/material.dart';

import '../../../core/api/api_client.dart';
import '../../../core/models/wilaya.dart';
import '../../../core/models/wilaya_detail.dart';
import '../../poi/presentation/poi_detail_screen.dart';

class WilayaDetailScreen extends StatefulWidget {
  const WilayaDetailScreen({
    super.key,
    required this.wilaya,
    this.api,
  });

  final Wilaya wilaya;
  final ApiClient? api;

  @override
  State<WilayaDetailScreen> createState() => _WilayaDetailScreenState();
}

class _WilayaDetailScreenState extends State<WilayaDetailScreen> {
  late final ApiClient _api;
  late Future<WilayaDetail> _detail;
  String? _category;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _api = widget.api ?? ApiClient();
    _detail = _api.getWilayaDetail(widget.wilaya.id);
  }

  void _reload() {
    setState(() {
      _detail = _api.getWilayaDetail(widget.wilaya.id);
    });
  }

  List<PoiSummary> _filtered(WilayaDetail detail) {
    var pois = _category == null
        ? detail.pois
        : detail.pois.where((p) => p.category == _category).toList();
    final query = _query.trim().toLowerCase();
    if (query.isNotEmpty) {
      pois = pois
          .where((p) =>
              (p.name ?? p.category).toLowerCase().contains(query))
          .toList();
    }
    return pois;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.wilaya.name),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: FutureBuilder<WilayaDetail>(
        future: _detail,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return _ErrorView(error: snapshot.error!, onRetry: _reload);
          }
          final detail = snapshot.data!;
          return _buildBody(detail);
        },
      ),
    );
  }

  Widget _buildBody(WilayaDetail detail) {
    final categories = <String>{
      for (final p in detail.pois) p.category,
    }.toList()..sort();

    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${detail.pois.length} POIs · ${detail.stays.length} stays · '
                  '${detail.experiences.length} experiences',
                  style: TextStyle(color: Colors.grey.shade600),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _CategoryDropdown(
                        categories: categories,
                        selected: _category,
                        onChanged: (value) => setState(() => _category = value),
                      ),
                    ),
                    const SizedBox(width: 12),
                    IconButton(
                      tooltip: 'Search',
                      icon: const Icon(Icons.search),
                      onPressed: () => _openSearch(context),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        if (detail.pois.isNotEmpty)
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 0.78,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final pois = _filtered(detail);
                  if (index >= pois.length) return null;
                  return _PoiCard(
                    poi: pois[index],
                    api: _api,
                  );
                },
                childCount: _filtered(detail).length,
              ),
            ),
          )
        else
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.all(32),
              child: Text('No points of interest yet.'),
            ),
          ),
      ],
    );
  }

  void _openSearch(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            left: 16,
            right: 16,
            top: 16,
            bottom: MediaQuery.of(context).viewInsets.bottom + 16,
          ),
          child: TextField(
            autofocus: true,
            decoration: const InputDecoration(
              labelText: 'Search POIs by name',
              border: OutlineInputBorder(),
            ),
            onChanged: (value) {
              setState(() => _query = value);
            },
          ),
        );
      },
    );
  }
}

class _CategoryDropdown extends StatelessWidget {
  const _CategoryDropdown({
    required this.categories,
    required this.selected,
    required this.onChanged,
  });

  final List<String> categories;
  final String? selected;
  final ValueChanged<String?> onChanged;

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      initialValue: selected,
      isExpanded: true,
      decoration: const InputDecoration(
        labelText: 'Category',
        border: OutlineInputBorder(),
      ),
      items: [
        const DropdownMenuItem<String>(
          value: null,
          child: Text('All categories'),
        ),
        for (final c in categories)
          DropdownMenuItem<String>(
            value: c,
            child: Text(c.toUpperCase()),
          ),
      ],
      onChanged: onChanged,
    );
  }
}

class _PoiCard extends StatelessWidget {
  const _PoiCard({required this.poi, required this.api});

  final PoiSummary poi;
  final ApiClient api;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => PoiDetailScreen(poiId: poi.id, api: api),
            ),
          );
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
          Expanded(
            child: SizedBox(
              width: double.infinity,
              child: poi.photoUrl != null
                  ? Image.network(
                      poi.photoUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _Placeholder(poi: poi),
                    )
                  : _Placeholder(poi: poi),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  poi.name ?? 'Unnamed ${poi.category}',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  poi.category,
                  style: TextStyle(
                    fontSize: 11,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
                if (poi.entryFeeDzd != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    '${poi.entryFeeDzd!.toInt()} DZD',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.green.shade700,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
        ),
        ),
      );
  }
}

class _Placeholder extends StatelessWidget {
  const _Placeholder({required this.poi});

  final PoiSummary poi;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: Theme.of(context).colorScheme.surfaceContainerHighest,
      alignment: Alignment.center,
      child: Text(
        poi.category.isEmpty ? '?' : poi.category[0].toUpperCase(),
        style: Theme.of(context).textTheme.headlineMedium,
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
            const Text('Could not load this wilaya'),
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