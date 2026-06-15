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

# Keep Expo from accidentally selecting a parent workspace as Metro's root.
# A larger root makes Metro create far more watchers and can trigger EMFILE.
export EXPO_USE_METRO_WORKSPACE_ROOT=0

exec npx --no-install expo start "$@"
