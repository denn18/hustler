#!/usr/bin/env bash
set -euo pipefail

# Keep Expo from accidentally selecting a parent workspace as Metro's root.
# A larger root makes Metro create far more watchers and can trigger EMFILE.
export EXPO_USE_METRO_WORKSPACE_ROOT=0

# Use Watchman when it is available, but do not require Homebrew/Watchman.
# This project works with Expo Go, CocoaPods, or a plain npm install; Watchman is
# only an optional macOS performance improvement for large workspaces.
if command -v watchman >/dev/null 2>&1; then
  export WATCHMAN_CONFIG_FILE="${WATCHMAN_CONFIG_FILE:-${PWD}/.watchmanconfig}"
fi

TARGET_OPEN_FILES="${HUSTLER_OPEN_FILES_LIMIT:-65536}"
CURRENT_HARD_LIMIT="$(ulimit -H -n)"

if [[ "${CURRENT_HARD_LIMIT}" == "unlimited" ]]; then
  ulimit -S -n "${TARGET_OPEN_FILES}" || true
elif [[ "${CURRENT_HARD_LIMIT}" -lt "${TARGET_OPEN_FILES}" ]]; then
  ulimit -S -n "${CURRENT_HARD_LIMIT}" || true
else
  ulimit -S -n "${TARGET_OPEN_FILES}" || true
fi

CURRENT_SOFT_LIMIT="$(ulimit -S -n)"
if [[ "${CURRENT_SOFT_LIMIT}" != "unlimited" && "${CURRENT_SOFT_LIMIT}" -lt 8192 ]]; then
  cat >&2 <<MSG
Warning: this shell only allows ${CURRENT_SOFT_LIMIT} open files.
Metro can still start, but if macOS later reports "EMFILE: too many open files",
raise the Terminal limit or install Watchman as an optional optimization.
MSG
fi

if ! node -e "require.resolve('expo'); require.resolve('react'); require.resolve('react-native')" >/dev/null 2>&1; then
  cat >&2 <<MSG
Required JavaScript dependencies are missing.
Installing from package-lock.json before starting Expo...
MSG
  npm install
fi

if [[ " $* " != *" -c "* && " $* " != *" --clear "* ]]; then
  set -- --clear "$@"
fi

printf 'Starting Expo with open-files soft limit: %s\n' "${CURRENT_SOFT_LIMIT}"
printf 'Starting Expo with Metro cache reset enabled.\n'
exec npx --no-install expo start "$@"
