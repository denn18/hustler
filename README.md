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

## Start ohne Homebrew-Pflicht

Das Projekt braucht kein Homebrew, um normal mit Expo Go zu starten. Die App deklariert `@babel/runtime` direkt als Runtime-Abhängigkeit, weil Metro/React Native diesen Helper beim Bundling benötigt. Nach einem frischen Checkout genügt:

```bash
npm install
npm run start:clear
```

Danach `i` für den iOS-Simulator, `w` für Web oder den QR-Code in Expo Go öffnen. Die Startskripte setzen Metros Cache automatisch zurück, damit nach Dependency-Änderungen keine alten Resolver-Ergebnisse wie fehlende `@babel/runtime`-Helper im Simulator hängen bleiben. CocoaPods werden nur benötigt, wenn später ein nativer iOS-Build über `expo prebuild`/Xcode erstellt wird; für diesen Expo-Go-Prototyp gibt es bewusst keinen iOS-Pods-Zwang.

## macOS: `EMFILE: too many open files, watch`

Der Fehler kommt vom Dateiwatcher, nicht vom Hustler-App-Code. Die npm-Startskripte laufen über `scripts/expo-start.sh`: Das Skript hebt das Datei-Limit für den Expo-Prozess an, begrenzt Metro auf dieses Projekt und nutzt Watchman nur, wenn es bereits installiert ist. Homebrew/Watchman ist also optional und nicht mehr Voraussetzung.

```bash
npm run ios
# oder
npm run start:clear
```

Wenn macOS trotzdem `EMFILE` meldet, zuerst die Metro-Caches löschen und mit leerem Cache starten:

```bash
rm -rf "$TMPDIR/metro-*" "$TMPDIR/haste-map-*" .expo
npm run start:clear
```

Nur bei sehr großen lokalen Workspaces kann Watchman weiterhin als optionale Performance-Verbesserung helfen. `node_modules` ist in `.gitignore` und `.watchmanconfig` ausgeschlossen, damit keine unnötigen Projektdateien versioniert oder beobachtet werden.
