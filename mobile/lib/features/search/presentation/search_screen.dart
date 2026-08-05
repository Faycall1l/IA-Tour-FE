import 'dart:async';

import 'package:flutter/material.dart';

import '../../../core/api/api_client.dart';
import '../../../core/models/poi_detail.dart';
import '../../poi/presentation/poi_detail_screen.dart';

/// Global semantic search across all POIs (uses `GET /pois/search`).
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key, this.api});

  final ApiClient? api;

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  late final ApiClient _api;
  final TextEditingController _controller = TextEditingController();
  Timer? _debounce;
  String _query = '';
  String? _category;
  bool _loading = false;
  String? _error;
  List<PoiDetail> _results = const [];

  @override
  void initState() {
    super.initState();
    _api = widget.api ?? ApiClient();
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  void _onChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 350), () {
      _search(value.trim());
    });
  }

  Future<void> _search(String query) async {
    setState(() {
      _query = query;
      _category = null;
      _error = null;
    });
    if (query.isEmpty) {
      setState(() {
        _loading = false;
        _results = const [];
      });
      return;
    }
    setState(() => _loading = true);
    try {
      final results = await _api.searchPois(query);
      if (!mounted) return;
      setState(() {
        _results = results;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = '$e';
        _loading = false;
        _results = const [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final categories = <String>{
      for (final p in _results) p.category,
    }.toList()
      ..sort();
    final results = _category == null
        ? _results
        : _results.where((p) => p.category == _category).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Algeria'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: TextField(
              controller: _controller,
              autofocus: true,
              onChanged: _onChanged,
              decoration: InputDecoration(
                hintText: 'Try "roman ruins", "beaches in Oran"…',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _query.isEmpty
                    ? null
                    : IconButton(
                        tooltip: 'Clear',
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _controller.clear();
                          _search('');
                        },
                      ),
                border: const OutlineInputBorder(),
              ),
            ),
          ),
          if (categories.isNotEmpty)
            SizedBox(
              height: 44,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: _CategoryChip(
                      label: 'ALL',
                      selected: _category == null,
                      onTap: () => setState(() => _category = null),
                    ),
                  ),
                  for (final c in categories)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: _CategoryChip(
                        label: c.toUpperCase(),
                        selected: _category == c,
                        onTap: () => setState(() => _category = c),
                      ),
                    ),
                ],
              ),
            ),
          Expanded(child: _buildBody(results)),
        ],
      ),
    );
  }

  Widget _buildBody(List<PoiDetail> results) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null) {
      return _ErrorView(error: _error!, onRetry: () => _search(_query));
    }
    if (_query.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32),
          child: Text(
            'Type a query to search POIs across all 58 wilayas.',
            textAlign: TextAlign.center,
          ),
        ),
      );
    }
    if (results.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Text('No results for "$_query". Try a different query.'),
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: results.length,
      itemBuilder: (context, index) => _ResultCard(
        poi: results[index],
        api: _api,
      ),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  const _CategoryChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ChoiceChip(
      label: Text(label),
      selected: selected,
      onSelected: (_) => onTap(),
    );
  }
}

class _ResultCard extends StatelessWidget {
  const _ResultCard({required this.poi, required this.api});

  final PoiDetail poi;
  final ApiClient api;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      clipBehavior: Clip.antiAlias,
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => PoiDetailScreen(poiId: poi.id, api: api),
            ),
          );
        },
        child: Row(
          children: [
            SizedBox(
              width: 96,
              height: 96,
              child: poi.photoUrl != null
                  ? Image.network(
                      poi.photoUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _Placeholder(poi: poi),
                    )
                  : _Placeholder(poi: poi),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      poi.name ?? 'Unnamed ${poi.category}',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    Wrap(
                      spacing: 8,
                      children: [
                        Text(
                          poi.category,
                          style: TextStyle(
                            fontSize: 11,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                        if (poi.wilayaId != null)
                          Text(
                            'wilaya ${poi.wilayaId}',
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey.shade600,
                            ),
                          ),
                      ],
                    ),
                    if (poi.description != null) ...[
                      const SizedBox(height: 6),
                      Text(
                        poi.description!,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade700,
                        ),
                      ),
                    ],
                    const SizedBox(height: 6),
                    Text(
                      poi.entryFeeDzd != null
                          ? '${poi.entryFeeDzd!.toInt()} DZD'
                          : 'Free',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Colors.green.shade700,
                      ),
                    ),
                  ],
                ),
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

  final PoiDetail poi;

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

  final String error;
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
            const Text('Search failed'),
            const SizedBox(height: 8),
            Text(
              error,
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
