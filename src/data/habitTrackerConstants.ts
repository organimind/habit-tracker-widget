export type HabitThemePreset = {
  id: string;
  name: string;
  category: 'light' | 'dark' | 'pastel';
  colors: {
    bgApp: string;
    bgCard: string;
    textPrimary: string;
    textSecondary: string;
    headerBg: string;
    stickyColBg: string;
    borderColor: string;
    checkboxBorder: string;
    checkboxCheckColor: string;
    weekColors: string[];
  };
};

export type NotionStep = {
  step: number;
  prefixText: string;
  boldText: string;
  suffixText?: string;
  code?: string;
  bgClass: string;
};

export const HABIT_LIGHT_THEMES: HabitThemePreset[] = [
  {
    id: 'cutePastel',
    name: 'Cute Pastel',
    category: 'pastel',
    colors: {
      bgApp: '#F8FAFC',
      bgCard: '#FFFFFF',
      textPrimary: '#334155',
      textSecondary: '#64748B',
      headerBg: '#DBEAFF',
      stickyColBg: '#F1F5F9',
      borderColor: '#E2E8F0',
      checkboxBorder: '#93C5FD',
      checkboxCheckColor: '#3B82F6',
      weekColors: ['#DBEAFF', '#FFD6E7', '#C7F9CC', '#FEF08A', '#E0E7FF'],
    },
  },
  {
    id: 'sakuraPink',
    name: 'Sakura Pink',
    category: 'pastel',
    colors: {
      bgApp: '#FFF5F7',
      bgCard: '#FFFFFF',
      textPrimary: '#5C3D46',
      textSecondary: '#9E7480',
      headerBg: '#FFE3EC',
      stickyColBg: '#FFF0F5',
      borderColor: '#FBCFE8',
      checkboxBorder: '#F472B6',
      checkboxCheckColor: '#EC4899',
      weekColors: ['#FFE3EC', '#FFCBF2', '#F3C4FB', '#ECBCFD', '#E5B3FE'],
    },
  },
  {
    id: 'mintMatcha',
    name: 'Mint Matcha',
    category: 'light',
    colors: {
      bgApp: '#F4FBF7',
      bgCard: '#FFFFFF',
      textPrimary: '#2D4A3E',
      textSecondary: '#5E8374',
      headerBg: '#D1FAE5',
      stickyColBg: '#E6F7EF',
      borderColor: '#A7F3D0',
      checkboxBorder: '#34D399',
      checkboxCheckColor: '#10B981',
      weekColors: ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
    },
  },
  {
    id: 'cozyCaramel',
    name: 'Cozy Caramel',
    category: 'light',
    colors: {
      bgApp: '#FDFBF7',
      bgCard: '#FFFFFF',
      textPrimary: '#432818',
      textSecondary: '#856046',
      headerBg: '#FFEEDD',
      stickyColBg: '#FDF0E6',
      borderColor: '#FED9B7',
      checkboxBorder: '#F4A261',
      checkboxCheckColor: '#E76F51',
      weekColors: ['#FFEEDD', '#FDD3B2', '#FED9B7', '#F8EDEB', '#FAE1DD'],
    },
  },
  {
    id: 'oceanBlue',
    name: 'Ocean Blue',
    category: 'light',
    colors: {
      bgApp: '#F0F9FF',
      bgCard: '#FFFFFF',
      textPrimary: '#0C4A6E',
      textSecondary: '#0369A1',
      headerBg: '#E0F2FE',
      stickyColBg: '#F0F9FF',
      borderColor: '#BAE6FD',
      checkboxBorder: '#38BDF8',
      checkboxCheckColor: '#0284C7',
      weekColors: ['#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8', '#E0F2FE'],
    },
  },
  {
    id: 'lavenderDream',
    name: 'Lavender Dream',
    category: 'pastel',
    colors: {
      bgApp: '#FAF5FF',
      bgCard: '#FFFFFF',
      textPrimary: '#4C1D95',
      textSecondary: '#6D28D9',
      headerBg: '#F3E8FF',
      stickyColBg: '#F8F0FF',
      borderColor: '#E9D5FF',
      checkboxBorder: '#C084FC',
      checkboxCheckColor: '#9333EA',
      weekColors: ['#F3E8FF', '#E9D5FF', '#D8B4FE', '#C084FC', '#F3E8FF'],
    },
  },
];

export const HABIT_DARK_THEMES: HabitThemePreset[] = [
  {
    id: 'notionDark',
    name: 'Notion Dark Aesthetic',
    category: 'dark',
    colors: {
      bgApp: '#191919',
      bgCard: '#222222',
      textPrimary: '#F3F4F6',
      textSecondary: '#9CA3AF',
      headerBg: '#2A2D3D',
      stickyColBg: '#2A2E3D',
      borderColor: '#374151',
      checkboxBorder: '#818CF8',
      checkboxCheckColor: '#6366F1',
      weekColors: ['#2E3856', '#4A2040', '#1C4238', '#42321C', '#2E3856'],
    },
  },
  {
    id: 'darkCyberpunk',
    name: 'Cyber Neon',
    category: 'dark',
    colors: {
      bgApp: '#0F172A',
      bgCard: '#1E293B',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      headerBg: '#1E1B4B',
      stickyColBg: '#1E293B',
      borderColor: '#334155',
      checkboxBorder: '#38BDF8',
      checkboxCheckColor: '#0EA5E9',
      weekColors: ['#1E1B4B', '#312E81', '#4338CA', '#3730A3', '#1E1B4B'],
    },
  },
  {
    id: 'darkEmerald',
    name: 'Emerald Night',
    category: 'dark',
    colors: {
      bgApp: '#064E3B',
      bgCard: '#065F46',
      textPrimary: '#ECFDF5',
      textSecondary: '#A7F3D0',
      headerBg: '#047857',
      stickyColBg: '#065F46',
      borderColor: '#059669',
      checkboxBorder: '#34D399',
      checkboxCheckColor: '#10B981',
      weekColors: ['#047857', '#059669', '#10B981', '#059669', '#047857'],
    },
  },
  {
    id: 'darkMidnight',
    name: 'Midnight Purple',
    category: 'dark',
    colors: {
      bgApp: '#181825',
      bgCard: '#1E1E2E',
      textPrimary: '#CDD6F4',
      textSecondary: '#A6ADC8',
      headerBg: '#313244',
      stickyColBg: '#181825',
      borderColor: '#45475A',
      checkboxBorder: '#CBA6F7',
      checkboxCheckColor: '#B4BEFE',
      weekColors: ['#313244', '#45475A', '#585B70', '#45475A', '#313244'],
    },
  },
];

export const HABIT_NOTION_EMBED_STEPS: NotionStep[] = [
  {
    step: 1,
    prefixText: 'Click ',
    boldText: 'Copy Widget URL',
    suffixText: ' button.',
    bgClass: 'step-bg-1',
  },
  {
    step: 2,
    prefixText: 'Open your ',
    boldText: 'Notion workspace',
    suffixText: ' page.',
    bgClass: 'step-bg-2',
  },
  {
    step: 3,
    prefixText: 'Type ',
    boldText: '',
    code: '/embed',
    suffixText: ' and press Enter.',
    bgClass: 'step-bg-3',
  },
  {
    step: 4,
    prefixText: 'Paste the copied URL and click ',
    boldText: 'Embed Link',
    suffixText: '.',
    bgClass: 'step-bg-4',
  },
];