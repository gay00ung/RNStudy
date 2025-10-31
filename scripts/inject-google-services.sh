#!/usr/bin/env bash
set -euo pipefail

if [ -z "${GOOGLE_SERVICES_JSON:-}" ]; then
  echo "❌ GOOGLE_SERVICES_JSON not set. Skip copy."
  exit 0
fi

echo "🔧 Injecting google-services.json from: $GOOGLE_SERVICES_JSON"

mkdir -p android/app
cp "$GOOGLE_SERVICES_JSON" android/app/google-services.json

# Gradle 플러그인이 찾는 모든 경로에 복사 (release/debug 포함)
mkdir -p android/app/src/release android/app/src/debug
cp "$GOOGLE_SERVICES_JSON" android/app/src/release/google-services.json
cp "$GOOGLE_SERVICES_JSON" android/app/src/debug/google-services.json

echo "✅ google-services.json injected to app/, src/release/, src/debug/"
