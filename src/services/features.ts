import type { AppFeature } from '../models/app';

export const getStarterFeatures = (): AppFeature[] => [
  {
    id: 'expo-go',
    title: 'Expo Go bereit',
    description: 'Keine native Zusatzbibliothek blockiert den Start in Expo Go.',
  },
  {
    id: 'ios-first',
    title: 'iOS-first Setup',
    description: 'Die Expo-Konfiguration ist auf iPhone und iPad vorbereitet.',
  },
  {
    id: 'typed-structure',
    title: 'TypeScript-Struktur',
    description: 'Design, Components, Pages, Routes, Models, Services, Logic und DB sind getrennt.',
  },
];
