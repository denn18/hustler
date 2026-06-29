export type HustleDefaultsSuggestion = {
  category?: string;
  icon?: string;
  color?: string;
};

type HustleSuggestionRule = {
  keywords: string[];
  defaults: Required<HustleDefaultsSuggestion>;
};

const suggestionRules: HustleSuggestionRule[] = [
  {
    keywords: ['rasen', 'garten', 'mähen', 'maehen'],
    defaults: {
      category: 'Lokale Dienstleistung',
      icon: '🌱',
      color: '#22C55E',
    },
  },
  {
    keywords: ['nachhilfe', 'mathe', 'englisch'],
    defaults: {
      category: 'Bildung',
      icon: '🎓',
      color: '#38BDF8',
    },
  },
];

const normalizeForSuggestion = (value: string): string => value.trim().toLocaleLowerCase('de-DE');

export function suggestHustleDefaults(name: string): HustleDefaultsSuggestion {
  const normalizedName = normalizeForSuggestion(name);

  if (!normalizedName) {
    return {};
  }

  return suggestionRules.find((rule) => rule.keywords.some((keyword) => normalizedName.includes(keyword)))?.defaults ?? {};
}
