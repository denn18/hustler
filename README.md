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

Das Projekt nutzt Expo SDK 51, damit die aktuelle Expo-Go-App auf einem physischen iPhone direkt mit dem Projekt kompatibel ist. Wenn Abhängigkeiten lokal abweichen, ausführen:

```bash
npx expo install --fix
npx expo-doctor
```

## macOS: `EMFILE: too many open files, watch`

Der Fehler kommt vom Dateiwatcher, nicht vom Hustler-App-Code. Auf macOS muss Metro Watchman verwenden; ohne Watchman fällt Metro auf Node/FSEvents zurück und kann beim Öffnen des iOS-Simulators mit `EMFILE: too many open files, watch` abbrechen. Die npm-Startskripte laufen über `scripts/expo-start.sh`: Das Skript hebt das Datei-Limit für den Expo-Prozess sichtbar auf den höchstmöglichen Wert an, bricht auf macOS ohne Watchman mit einer klaren Anleitung ab und setzt `EXPO_USE_METRO_WORKSPACE_ROOT=0`, damit Metro nicht versehentlich einen übergeordneten Ordner überwacht. Zusätzlich begrenzt `metro.config.js` Metro auf dieses Projekt und verhindert hierarchische `node_modules`-Suche außerhalb des Repos.

```bash
npm run ios
# oder
npm run start:clear
```

Wenn macOS trotzdem ein zu niedriges Hard-Limit meldet, dieses Limit einmalig erhöhen und danach Watchman installieren bzw. die Metro-/Watchman-Caches leeren:

```bash
sudo launchctl limit maxfiles 65536 200000
brew install watchman
watchman watch-del-all
rm -rf "$TMPDIR/metro-*" "$TMPDIR/haste-map-*" .expo
npm run start:clear
```

Falls es danach noch hängt, Terminal und Expo Go neu öffnen. `node_modules` ist in `.gitignore` und `.watchmanconfig` ausgeschlossen, damit keine unnötigen Projektdateien versioniert oder beobachtet werden.
