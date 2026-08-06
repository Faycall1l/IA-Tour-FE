#!/bin/sh
# Regenerate the mobile Dart API client from the committed OpenAPI spec.
#
# Requires: openapi_flutter_gen CLI + dart on PATH, e.g.
#   export PATH="$PATH:$HOME/.pub-cache/bin:/Users/faycalamrouche/development/flutter/bin"
#
# Usage: scripts/generate-mobile-api.sh
set -e

cd "$(dirname "$0")/.."

SPEC="openapi.json"
OUT="mobile/lib/core/api/generated/athar_api"

if [ ! -f "$SPEC" ]; then
  echo "error: $SPEC not found (run scripts/sync-spec.mjs first)" >&2
  exit 1
fi

echo "Regenerating Dart client from $SPEC"
rm -rf "$OUT"
openapi_flutter_gen \
  --spec "$SPEC" \
  --output "mobile/lib/core/api/generated" \
  --package-name athar_api

# openapi_flutter_gen emits `.toJson()` calls on nullable sealed wrappers
# (e.g. `'price_dzd': priceDzd.toJson(),`), which fails to compile. A
# null-aware call is valid for every receiver (lint-only on non-nullable),
# so apply it as a mechanical post-processing step after every generation.
echo "Applying null-safe toJson post-processing"
find "$OUT/lib" -name '*.dart' -type f -print0 | xargs -0 perl -pi -e 's/\.toJson\(\)/?\.toJson()/g'

# Revert the blanket change on sealed variant arrow bodies: their `value`
# field is always non-nullable, so `value?.toJson()` would change the
# return type to nullable and break compilation.
find "$OUT/lib" -name '*.dart' -type f -print0 | xargs -0 perl -pi -e 's/toJson\(\) => value\?\.toJson\(\);/toJson() => value.toJson();/g'

# The generator calls `.toFormData()` on multipart upload body models but
# only emits `toJson()` for them. Add the missing method (plus a dio import)
# only to the body models actually referenced from `*.toFormData()` calls.
echo "Adding missing toFormData to upload body models"
python3 - "$OUT/lib" <<'PYEOF'
import re
import sys
from pathlib import Path

root = Path(sys.argv[1])

called_on = set()
for api_file in (root / "src" / "api").glob("*.dart"):
    text = api_file.read_text()
    for m in re.finditer(r"(\w+)\s*\.\s*toFormData\(\)", text, re.DOTALL):
        called_on.add(m.group(1).lower())

added = []
for model_file in (root / "src" / "models").glob("*.dart"):
    text = model_file.read_text()
    class_match = re.search(r"class (\w+) \{", text)
    if not class_match:
        continue
    if class_match.group(1).lower() not in called_on:
        continue
    text = text.replace(
        "  Map<String, dynamic> toJson() {",
        "  FormData toFormData() => FormData.fromMap(toJson());\n\n"
        "  Map<String, dynamic> toJson() {",
        1,
    )
    if "package:dio/dio.dart" not in text:
        text = "import 'package:dio/dio.dart';\n\n" + text
    model_file.write_text(text)
    added.append(model_file.name)

if added:
    print("  patched:", ", ".join(added))
else:
    print("  (no upload body models found)")
PYEOF

echo "Running pub get in generated package"
(cd "$OUT" && dart pub get)

echo "Done. Generated client at $OUT"
