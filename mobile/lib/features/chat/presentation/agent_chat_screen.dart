import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

import '../../../core/api/api_client.dart';

class AgentChatScreen extends StatefulWidget {
  const AgentChatScreen({super.key, this.api});

  final ApiClient? api;

  @override
  State<AgentChatScreen> createState() => _AgentChatScreenState();
}

class _ChatMessage {
  const _ChatMessage({required this.role, required this.text, this.degraded = false});

  final String role;
  final String text;
  final bool degraded;
}

class _AgentChatScreenState extends State<AgentChatScreen> {
  late final ApiClient _api;

  String? _token;
  String? _sessionId;
  final List<_ChatMessage> _messages = [];
  final TextEditingController _input = TextEditingController();
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _api = widget.api ?? ApiClient();
  }

  @override
  void dispose() {
    _input.dispose();
    super.dispose();
  }

  Future<void> _sendOtp(String phone) async {
    setState(() => _busy = true);
    try {
      await _api.sendOtp(phone);
      if (mounted) setState(() => _error = null);
    } catch (e) {
      // Phone step: fall through to OTP entry regardless (the API sends an OTP
      // in debug mode without Twilio; a stored code check happens server-side).
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _verifyOtp(String phone, String code) async {
    setState(() => _busy = true);
    try {
      final token = await _api.verifyOtp(phone, code);
      if (mounted) setState(() => _token = token);
    } catch (e) {
      if (mounted) setState(() => _error = 'Invalid code. Try again.');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _send() async {
    final text = _input.text.trim();
    if (text.isEmpty || _busy || _token == null) return;
    setState(() {
      _input.clear();
      _error = null;
      _messages.add(_ChatMessage(role: 'user', text: text));
      _busy = true;
    });
    try {
      final reply = await _api.chat(
        text,
        sessionId: _sessionId,
        token: _token!,
      );
      if (!mounted) return;
      setState(() {
        _sessionId = reply.sessionId ?? _sessionId;
        _messages.add(
          _ChatMessage(
            role: 'assistant',
            text: reply.reply,
            degraded: reply.degraded,
          ),
        );
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        if (e is DioException) {
          final status = e.response?.statusCode;
          _error = status == 401
              ? 'Session expired — sign in again.'
              : status == 503
                  ? 'Assistant is unavailable. Try again shortly.'
                  : 'Backend error (${status ?? 'network'}).';
          if (status == 401) _token = null;
        } else {
          _error = '$e';
        }
      });
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Travel assistant'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          if (_token != null)
            TextButton(
              onPressed: () => setState(() {
                _token = null;
                _sessionId = null;
                _messages.clear();
              }),
              child: const Text('Sign out'),
            ),
        ],
      ),
      body: _token == null
          ? _AuthView(
              busy: _busy,
              error: _error,
              onSendOtp: _sendOtp,
              onVerify: _verifyOtp,
            )
          : _buildChat(),
    );
  }

  Widget _buildChat() {
    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: _messages.length + (_busy ? 1 : 0),
            itemBuilder: (context, index) {
              if (index >= _messages.length) {
                return const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Text('Thinking…',
                      style: TextStyle(color: Colors.grey)),
                );
              }
              final m = _messages[index];
              final isUser = m.role == 'user';
              return Align(
                alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                child: Container(
                  margin: const EdgeInsets.symmetric(vertical: 4),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  constraints: const BoxConstraints(maxWidth: 340),
                  decoration: BoxDecoration(
                    color: isUser
                        ? Theme.of(context).colorScheme.primary
                        : Theme.of(context).colorScheme.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        m.text,
                        style: TextStyle(
                          color: isUser ? Colors.white : null,
                        ),
                      ),
                      if (m.degraded)
                        const Padding(
                          padding: EdgeInsets.only(top: 6),
                          child: Text(
                            '⚠ Offline answers (rule-based)',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: Colors.amber,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        if (_error != null)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(
              _error!,
              style: TextStyle(color: Theme.of(context).colorScheme.error),
            ),
          ),
        SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _input,
                    decoration: const InputDecoration(
                      hintText: 'Ask anything about Algeria…',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                    onSubmitted: (_) => _send(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton.filled(
                  tooltip: 'Send',
                  onPressed: _busy ? null : _send,
                  icon: const Icon(Icons.send),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _AuthView extends StatefulWidget {
  const _AuthView({
    required this.busy,
    required this.error,
    required this.onSendOtp,
    required this.onVerify,
  });

  final bool busy;
  final String? error;
  final ValueChanged<String> onSendOtp;
  final void Function(String phone, String code) onVerify;

  @override
  State<_AuthView> createState() => _AuthViewState();
}

class _AuthViewState extends State<_AuthView> {
  final _phone = TextEditingController(text: '+213');
  final _code = TextEditingController();
  bool _otpSent = false;

  @override
  void dispose() {
    _phone.dispose();
    _code.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Icon(
            Icons.assistant,
            size: 48,
            color: Theme.of(context).colorScheme.primary,
          ),
          const SizedBox(height: 12),
          const Text(
            'Sign in to chat with the ATHAR travel assistant',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          Text(
            'Passwordless OTP login. In local development (debug mode) the code '
            'is 000000.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
          ),
          const SizedBox(height: 24),
          TextField(
            controller: _phone,
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(
              labelText: 'Phone',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _code,
            enabled: _otpSent,
            keyboardType: TextInputType.number,
            maxLength: 6,
            decoration: const InputDecoration(
              labelText: '6-digit code',
              helperText: '',
              border: OutlineInputBorder(),
            ),
          ),
          if (widget.error != null)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(
                widget.error!,
                style: TextStyle(color: Theme.of(context).colorScheme.error),
              ),
            ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: widget.busy
                ? null
                : () {
                    if (!_otpSent) {
                      setState(() => _otpSent = true);
                      widget.onSendOtp(_phone.text);
                    } else {
                      widget.onVerify(_phone.text, _code.text);
                    }
                  },
            child: Text(widget.busy
                ? 'Working…'
                : (_otpSent ? 'Verify & chat' : 'Send code')),
          ),
        ],
      ),
    );
  }
}