#!/usr/bin/env bash
#
# N6 shared fragment sync
#
# Menyalin js/shared/core-helpers.js ke js/modules/<role>/_shared.js
# untuk semua tier. Jalankan setelah mengedit core-helpers.js,
# sebelum tools/build.sh.
#
# Usage: tools/sync-shared.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/js/shared/core-helpers.js"

if [[ ! -f "$SRC" ]]; then
  echo "missing: js/shared/core-helpers.js" >&2
  exit 1
fi

# ambil body (dari //__N6_BODY__ sampai akhir)
BODY="$(awk '/\/\/__N6_BODY__/{p=1} p' "$SRC")"

for role in owner admin headcoach coach client; do
  dest="$ROOT/js/modules/$role/_shared.js"
  {
    echo "/**"
    echo " * N6 modules - $role / _shared"
    echo " *"
    echo " * GENERATED — disalin dari js/shared/core-helpers.js."
    echo " * Jangan edit manual; jalankan tools/sync-shared.sh."
    echo " */"
    echo "$BODY"
  } > "$dest"
  echo "synced: js/modules/$role/_shared.js"
done

echo ""
echo "Jalankan tools/build.sh untuk rebuild bundle."
