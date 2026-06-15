import { useColorScheme } from 'react-native';
import { darkPalette, lightPalette } from './theme';

export function useAppTheme() {
  return useColorScheme() === 'dark' ? darkPalette : lightPalette;
}
