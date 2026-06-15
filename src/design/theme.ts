export const lightPalette = {
  background: '#F6F7F9',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF1F5',
  text: '#111827',
  textMuted: '#667085',
  primary: '#16A34A',
  danger: '#E11D48',
  border: '#E5E7EB',
  shadow: '#101828',
};

export const darkPalette = {
  background: '#0F1115',
  surface: '#181B22',
  surfaceMuted: '#242936',
  text: '#F9FAFB',
  textMuted: '#A7B0C0',
  primary: '#22C55E',
  danger: '#FB7185',
  border: '#2B3140',
  shadow: '#000000',
};

export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 } as const;
export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;
export type Palette = typeof lightPalette;
