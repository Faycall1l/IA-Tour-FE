/// Application-wide configuration.
///
/// Point [apiBaseUrl] at the ATHAR backend. In development the backend runs
/// locally on :8000 (see ../Athar); use the debug override for simulators.
class AppConfig {
  AppConfig._();

  static const String appName = 'ATHAR';

  /// Base URL of the ATHAR REST API (`/api/v1`).
  ///
  /// Override at build time with `--dart-define=API_BASE_URL=...`:
  /// - web demo:   http://localhost:8001/api/v1
  /// - iOS sim:    http://localhost:8001/api/v1
  /// - Android emu:http://10.0.2.2:8001/api/v1
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:8000/api/v1',
  );

  static const Duration apiTimeout = Duration(seconds: 30);
}
