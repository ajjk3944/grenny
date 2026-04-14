import { create } from 'zustand';
import { lightTheme, darkTheme, Theme } from '../constants/colors';
import { storage } from '../utils/storage';
import { ThemeMode } from '../types';

const THEME_KEY = 'app_theme';

interface ThemeStore {
  mode: ThemeMode;
  colors: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  initTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: 'light',
  colors: lightTheme,

  toggleTheme: async () => {
    const newMode = get().mode === 'light' ? 'dark' : 'light';
    const newColors = newMode === 'light' ? lightTheme : darkTheme;
    await storage.set(THEME_KEY, newMode);
    set({ mode: newMode, colors: newColors });
  },

  setTheme: async (mode: ThemeMode) => {
    const newColors = mode === 'light' ? lightTheme : darkTheme;
    await storage.set(THEME_KEY, mode);
    set({ mode, colors: newColors });
  },

  initTheme: async () => {
    const savedTheme = await storage.get<ThemeMode>(THEME_KEY);
    if (savedTheme) {
      const colors = savedTheme === 'light' ? lightTheme : darkTheme;
      set({ mode: savedTheme, colors });
    }
  },
}));

export const useTheme = () => {
  const { colors, mode, toggleTheme } = useThemeStore();
  return { colors, mode, toggleTheme };
};
