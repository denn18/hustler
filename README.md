# Hustler

Hustler ist ein Expo-Go-Prototyp für eine iOS-first Side-Hustle-App. Der Fokus liegt auf schnellem Tracking von Einnahmen, Kosten und Zeit sowie Community-Funktionen mit Karte, Kontaktanfragen und Messenger.

## Start

```bash
npm install
npm start
```

Danach den QR-Code mit Expo Go öffnen.

## Struktur

- `src/models`: zentrale TypeScript-Datenmodelle
- `src/design`: Farben, Abstände, Radien und Theme-Hook
- `src/components`: wiederverwendbare UI-Bausteine
- `src/pages`: Screens/Pages der App
- `src/routes`: zentrale Tab-/Routen-Konfiguration
- `src/services`: Datenzugriff und spätere API-Anbindung
- `src/logic`: reine Berechnungslogik
- `src/db`: Mock-Daten und spätere DB-Schicht
- `src/scripts`: Wartungs- und Migrationsskripte

## Expo-Go-Kompatibilität

Das Projekt nutzt Expo SDK 56, damit die aktuelle Expo-Go-App auf einem physischen iPhone direkt mit dem Projekt kompatibel ist. Wenn Abhängigkeiten lokal abweichen, ausführen:

```bash
npx expo install --fix
npx expo-doctor
```

## macOS: `EMFILE: too many open files, watch`

Der Fehler kommt vom Dateiwatcher, nicht vom Hustler-App-Code. Auf macOS sollte Watchman installiert werden, damit Metro nicht auf den begrenzten Node-Dateiwatcher zurückfällt:

```bash
brew install watchman
watchman watch-del-all
rm -rf "$TMPDIR/metro-*" "$TMPDIR/haste-map-*" .expo
npm run start:clear
```

Falls es danach noch hängt, Terminal und Expo Go neu öffnen. `node_modules` ist in `.gitignore` und `.watchmanconfig` ausgeschlossen, damit keine unnötigen Projektdateien versioniert oder beobachtet werden.
