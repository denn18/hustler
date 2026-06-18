# Hustler

Robuste Expo-Go-kompatible TypeScript-App als schlanke Basis für ein tägliches Hustle-Dashboard.

## Voraussetzungen

- Node.js gemäß `.nvmrc`
- npm
- Expo Go auf einem iOS- oder Android-Gerät, oder Xcode für den iOS Simulator

## Installation

```bash
npm install
```

## Clean reinstall bei Expo-Bundling-Problemen

Wenn Metro iOS-Abhängigkeiten wie `@babel/runtime/helpers/interopRequireDefault` oder `expo/AppEntry` nicht auflösen kann, installiere die Abhängigkeiten sauber neu und starte Metro ohne Cache:

```bash
rm -rf node_modules package-lock.json .expo
npm install
node -p "require.resolve('@babel/runtime/helpers/interopRequireDefault')"
node -p "require.resolve('expo/AppEntry')"
npm run start:clear
```

## Entwicklung starten

```bash
npx expo start
```

Alternativ können die vorhandenen npm-Skripte genutzt werden:

```bash
npm run start
npm run start:clear
```

## iOS Simulator

Starte Metro und öffne den iOS Simulator direkt:

```bash
npx expo start --ios
```

Oder über das npm-Skript:

```bash
npm run ios
```

## Expo Go

1. Starte den Entwicklungsserver:

   ```bash
   npx expo start
   ```

2. Scanne den QR-Code mit der Kamera-App auf iOS oder mit Expo Go auf Android.
3. Die App nutzt nur Expo-Go-kompatible Basis-Abhängigkeiten und benötigt keine manuelle iOS-Pod-Installation.

## Native Module

Aktuell sind keine zusätzlichen nativen Module eingebunden. Falls später native-only Dependencies benötigt werden, reicht Expo Go nicht mehr aus. In diesem Fall sollte ein Development Build genutzt und die native Konfiguration klar dokumentiert werden.

## Projektstruktur

```text
App.tsx                 Minimaler, stabiler Root-Component
index.js                Expo Root Registration
src/screens             Screens der App
src/components          Wiederverwendbare UI-Komponenten
src/theme               Farben, Spacing und Typografie
src/lib                 Hilfsfunktionen und App-Daten
```

## Checks

```bash
npx tsc --noEmit
npx expo-doctor
```
