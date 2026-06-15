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
