#!/usr/bin/env bash
set -euo pipefail

# Start Expo with a file-descriptor limit that is high enough for Metro's
# filesystem watchers on macOS. Do not hide failures: if the soft limit cannot
# be raised to the requested value, raise it to the maximum allowed hard limit.
TARGET_OPEN_FILES="${HUSTLER_OPEN_FILES_LIMIT:-65536}"
CURRENT_HARD_LIMIT="$(ulimit -H -n)"

if [[ "${CURRENT_HARD_LIMIT}" == "unlimited" ]]; then
  ulimit -S -n "${TARGET_OPEN_FILES}"
elif [[ "${CURRENT_HARD_LIMIT}" -lt "${TARGET_OPEN_FILES}" ]]; then
  ulimit -S -n "${CURRENT_HARD_LIMIT}"
else
  ulimit -S -n "${TARGET_OPEN_FILES}"
fi

CURRENT_SOFT_LIMIT="$(ulimit -S -n)"
if [[ "${CURRENT_SOFT_LIMIT}" != "unlimited" && "${CURRENT_SOFT_LIMIT}" -lt 8192 ]]; then
  cat >&2 <<MSG
Metro needs more file descriptors than this shell allows (${CURRENT_SOFT_LIMIT}).
On macOS, raise the Terminal hard limit once, then re-run the npm script:
  sudo launchctl limit maxfiles 65536 200000
  ulimit -n 65536
MSG
  exit 1
fi

# On macOS, Metro falls back to Node/FSEvents when Watchman is missing. That
# fallback often hits EMFILE while Expo opens the iOS simulator. Fail before
# starting Metro so the user sees the actionable fix instead of a stack trace.
if [[ "$(uname -s)" == "Darwin" ]] && ! command -v watchman >/dev/null 2>&1; then
  cat >&2 <<MSG
Watchman is required for reliable Metro file watching on macOS.
Without it, Expo can fail with: EMFILE: too many open files, watch

Install and reset Watchman, then start Expo again:
  brew install watchman
  watchman watch-del-all || true
  rm -rf "\$TMPDIR/metro-*" "\$TMPDIR/haste-map-*" .expo
  npm run start:clear
MSG
  exit 1
fi

if command -v watchman >/dev/null 2>&1; then
  # Make Watchman read this repository's ignore rules even when npm is launched
  # from a symlinked path or a parent shell with a different working directory.
  export WATCHMAN_CONFIG_FILE="${WATCHMAN_CONFIG_FILE:-${PWD}/.watchmanconfig}"
fi

# Keep Expo from accidentally selecting a parent workspace as Metro's root.
# A larger root makes Metro create far more watchers and can trigger EMFILE.
export EXPO_USE_METRO_WORKSPACE_ROOT=0

printf 'Starting Expo with open-files soft limit: %s\n' "${CURRENT_SOFT_LIMIT}"
exec npx --no-install expo start "$@"
