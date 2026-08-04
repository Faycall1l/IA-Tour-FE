# ATHAR Mobile (Flutter)

Traveler-facing mobile app for **ATHAR** — discover, plan, navigate and stay
across Algeria's 58 wilayas.

## Status

Hand-authored Dart scaffold (pubspec, lib structure). Platform folders
(`android/`, `ios/`, `web/`, …) are generated once the Flutter SDK is on
`PATH`:

```sh
# from this directory, after installing Flutter
flutter create . --org dz.athar --project-name athar_mobile
flutter pub get
```

## Layout

```
lib/
├── app.dart                     # MaterialApp root
├── core/config/app_config.dart  # API base URL (--dart-define=API_BASE_URL)
└── features/
    └── home/presentation/home_screen.dart
```

## API

Talks to the ATHAR backend (`/api/v1`) — see `../Athar` for the API surface.
Set `API_BASE_URL` at build time for non-local environments.
