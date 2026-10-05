import type { ThemeColors } from '../types/habit';

const THEME_STORAGE_KEY = 'habitTrackerCustomTheme';

export const PRESET_THEMES: { [key: string]: ThemeColors } = {
  cutePastel: {
    presetName: 'Cute Pastel (Default)',
    bgApp: '#f8fafc',
    bgCard: '#ffffff',
    textPrimary: '#334155',
    textSecondary: '#64748b',
    headerBg: '#dbeaff',
    stickyColBg: '#f1f5f9',
    borderColor: '#e2e8f0',
    checkboxBorder: '#93c5fd',
    checkboxCheckColor: '#3b82f6',
    weekColors: ['#dbeaff', '#ffd6e7', '#c7f9cc', '#fef08a', '#e0e7ff'],
  },
  sakuraPink: {
    presetName: 'Sakura Pink',
    bgApp: '#fff5f7',
    bgCard: '#ffffff',
    textPrimary: '#5c3d46',
    textSecondary: '#9e7480',
    headerBg: '#ffe3ec',
    stickyColBg: '#fff0f5',
    borderColor: '#fbcfe8',
    checkboxBorder: '#f472b6',
    checkboxCheckColor: '#ec4899',
    weekColors: ['#ffe3ec', '#ffcbf2', '#f3c4fb', '#ecbcfd', '#e5b3fe'],
  },
  mintMatcha: {
    presetName: 'Mint Matcha',
    bgApp: '#f4fbf7',
    bgCard: '#ffffff',
    textPrimary: '#2d4a3e',
    textSecondary: '#5e8374',
    headerBg: '#d1fae5',
    stickyColBg: '#e6f7ef',
    borderColor: '#a7f3d0',
    checkboxBorder: '#34d399',
    checkboxCheckColor: '#10b981',
    weekColors: ['#d1fae5', '#a7f3d0', '#6ee7b7', '#a7f3d0', '#d1fae5'],
  },
  cozyCaramel: {
    presetName: 'Cozy Caramel',
    bgApp: '#fdfbf7',
    bgCard: '#ffffff',
    textPrimary: '#432818',
    textSecondary: '#856046',
    headerBg: '#ffeedd',
    stickyColBg: '#fdf0e6',
    borderColor: '#fed9b7',
    checkboxBorder: '#f4a261',
    checkboxCheckColor: '#e76f51',
    weekColors: ['#ffeedd', '#fdd3b2', '#fed9b7', '#f8edeb', '#fae1dd'],
  },
  notionDark: {
    presetName: 'Notion Dark Aesthetic',
    bgApp: '#191919',
    bgCard: '#222222',
    textPrimary: '#f3f4f6',
    textSecondary: '#9ca3af',
    headerBg: '#2a2d3d',
    stickyColBg: '#2a2e3d',
    borderColor: '#374151',
    checkboxBorder: '#818cf8',
    checkboxCheckColor: '#6366f1',
    weekColors: ['#2e3856', '#4a2040', '#1c4238', '#42321c', '#2e3856'],
  },
};

export const DEFAULT_THEME = PRESET_THEMES.cutePastel;

/**
 * Safely parse hex string from URL param (handles 'fff5f7', '%23fff5f7', '#fff5f7')
 */
function parseHex(val: string | null): string | null {
  if (!val) return null;
  const cleaned = val.trim().replace(/^#|^%23/i, '');
  if (/^[0-9a-fA-F]{3,8}$/.test(cleaned)) {
    return `#${cleaned}`;
  }
  return null;
}

/**
 * Format hex for URL parameter cleanly (without '#')
 */
function cleanHexForUrl(hex: string): string {
  return hex.replace(/^#/,'');
}

/**
 * Find matching preset key by presetName or colors
 */
export function getPresetKey(theme: ThemeColors): string | null {
  for (const key of Object.keys(PRESET_THEMES)) {
    const p = PRESET_THEMES[key];
    if (
      p.presetName === theme.presetName ||
      (p.bgApp === theme.bgApp &&
        p.bgCard === theme.bgCard &&
        p.textPrimary === theme.textPrimary &&
        p.headerBg === theme.headerBg)
    ) {
      return key;
    }
  }
  return null;
}

/**
 * Load Theme from URL query params, falling back to localStorage and default
 */
export function loadThemeFromURLOrStorage(): ThemeColors {
  try {
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme') || params.get('preset');

    let baseTheme = DEFAULT_THEME;

    // Check if preset key matches in URL (e.g. ?theme=sakuraPink)
    if (themeParam && PRESET_THEMES[themeParam]) {
      baseTheme = PRESET_THEMES[themeParam];
    } else {
      // Otherwise check localStorage
      baseTheme = loadCustomTheme();
    }

    // Check individual URL color parameter overrides
    const bgApp = parseHex(params.get('bgApp'));
    const bgCard = parseHex(params.get('bgCard'));
    const textPrimary = parseHex(params.get('textPrimary'));
    const textSecondary = parseHex(params.get('textSecondary'));
    const headerBg = parseHex(params.get('headerBg'));
    const stickyColBg = parseHex(params.get('stickyColBg'));
    const borderColor = parseHex(params.get('borderColor'));
    const checkboxBorder = parseHex(params.get('checkboxBorder'));
    const checkboxCheckColor = parseHex(params.get('checkboxCheckColor'));

    // Check week colors parameter (comma separated hex: ?weekColors=ffe3ec,ffcbf2,f3c4fb...)
    const weekColorsParam = params.get('weekColors');
    let weekColors = baseTheme.weekColors;
    if (weekColorsParam) {
      const parsedWeekHexes = weekColorsParam
        .split(',')
        .map((h) => parseHex(h))
        .filter((h): h is string => h !== null);
      if (parsedWeekHexes.length >= 5) {
        weekColors = parsedWeekHexes;
      }
    }

    const hasCustomUrlColors =
      bgApp || bgCard || textPrimary || textSecondary || headerBg || stickyColBg || borderColor || checkboxBorder || checkboxCheckColor;

    return {
      presetName: hasCustomUrlColors
        ? 'Custom Palette'
        : (themeParam && PRESET_THEMES[themeParam]?.presetName) || baseTheme.presetName,
      bgApp: bgApp || baseTheme.bgApp,
      bgCard: bgCard || baseTheme.bgCard,
      textPrimary: textPrimary || baseTheme.textPrimary,
      textSecondary: textSecondary || baseTheme.textSecondary,
      headerBg: headerBg || baseTheme.headerBg,
      stickyColBg: stickyColBg || baseTheme.stickyColBg,
      borderColor: borderColor || baseTheme.borderColor,
      checkboxBorder: checkboxBorder || baseTheme.checkboxBorder,
      checkboxCheckColor: checkboxCheckColor || baseTheme.checkboxCheckColor,
      weekColors,
    };
  } catch (e) {
    console.error('Failed to parse URL theme params:', e);
    return loadCustomTheme();
  }
}

/**
 * Update browser URL query params dynamically to reflect current theme state
 */
export function updateURLWithTheme(theme: ThemeColors): void {
  try {
    const url = new URL(window.location.href);
    const presetKey = getPresetKey(theme);

    if (presetKey) {
      // Exact preset match -> clean query param ?theme=sakuraPink
      url.searchParams.set('theme', presetKey);

      // Clean up individual color params if present
      const colorKeys = [
        'bgApp',
        'bgCard',
        'textPrimary',
        'textSecondary',
        'headerBg',
        'stickyColBg',
        'borderColor',
        'checkboxBorder',
        'checkboxCheckColor',
        'weekColors',
        'preset',
      ];
      colorKeys.forEach((k) => url.searchParams.delete(k));
    } else {
      // Custom palette -> store colors in URL search params
      url.searchParams.set('theme', 'custom');
      url.searchParams.set('bgApp', cleanHexForUrl(theme.bgApp));
      url.searchParams.set('bgCard', cleanHexForUrl(theme.bgCard));
      url.searchParams.set('textPrimary', cleanHexForUrl(theme.textPrimary));
      url.searchParams.set('textSecondary', cleanHexForUrl(theme.textSecondary));
      url.searchParams.set('headerBg', cleanHexForUrl(theme.headerBg));
      url.searchParams.set('stickyColBg', cleanHexForUrl(theme.stickyColBg));
      url.searchParams.set('borderColor', cleanHexForUrl(theme.borderColor));
      url.searchParams.set('checkboxBorder', cleanHexForUrl(theme.checkboxBorder));
      url.searchParams.set('checkboxCheckColor', cleanHexForUrl(theme.checkboxCheckColor));
      url.searchParams.set('weekColors', theme.weekColors.map(cleanHexForUrl).join(','));
    }

    // Update browser location query string without reloading page
    window.history.replaceState(null, '', url.toString());
  } catch (e) {
    console.error('Failed to update URL with theme:', e);
  }
}

/**
 * Safely load data from localStorage
 */
export function loadCustomTheme(): ThemeColors {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return DEFAULT_THEME;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.bgApp) {
      return {
        ...DEFAULT_THEME,
        ...parsed,
        weekColors:
          Array.isArray(parsed.weekColors) && parsed.weekColors.length >= 5
            ? parsed.weekColors
            : DEFAULT_THEME.weekColors,
      };
    }
  } catch (e) {
    console.error('Failed to parse custom theme from localStorage:', e);
  }
  return DEFAULT_THEME;
}

/**
 * Save theme to localStorage
 */
export function saveCustomTheme(theme: ThemeColors): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (e) {
    console.error('Failed to save custom theme:', e);
  }
}

/**
 * Listen for external theme changes (browser back/forward navigation or OrganiMind iframe postMessage)
 */
export function listenToExternalThemeChanges(callback: (theme: ThemeColors) => void): () => void {
  const handlePopState = () => {
    const newTheme = loadThemeFromURLOrStorage();
    callback(newTheme);
  };

  const handleMessage = (event: MessageEvent) => {
    try {
      if (!event.data || typeof event.data !== 'object') return;
      const { type, theme, colors } = event.data;

      if (type === 'SET_THEME' || type === 'CHANGE_THEME') {
        if (typeof theme === 'string' && PRESET_THEMES[theme]) {
          callback(PRESET_THEMES[theme]);
        }
      } else if (type === 'SET_THEME_COLORS' && colors && typeof colors === 'object') {
        callback({
          ...DEFAULT_THEME,
          ...colors,
        });
      }
    } catch (e) {
      // ignore non-theme messages
    }
  };

  window.addEventListener('popstate', handlePopState);
  window.addEventListener('message', handleMessage);

  return () => {
    window.removeEventListener('popstate', handlePopState);
    window.removeEventListener('message', handleMessage);
  };
}
