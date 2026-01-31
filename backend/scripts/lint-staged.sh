#!/bin/sh

echo "🐶 Husky: sniffing your code..."

echo "✨ Prettier: making it pretty"
prettier --write "$@" || exit 1

echo "🔍 ESLint: looking for sins"
eslint --fix "$@" || {
  echo "❌ ESLint failed. Shame 🔔"
  exit 1
}

echo "✅ Code is clean. Good human 🤡!"