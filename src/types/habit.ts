export interface Habit {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export type CompletionMap = {
  // Key format: "YYYY-MM-DD"
  [dateStr: string]: {
    [habitId: string]: boolean;
  };
};

export interface HabitTrackerData {
  habits: Habit[];
  completions: CompletionMap;
  version: number;
}

export interface DayInfo {
  dayNumber: number; // 1 to 31
  weekdayShort: string; // 'M', 'T', 'W', etc.
  weekdayFull: string; // 'Monday', 'Tuesday', etc.
  dateString: string; // 'YYYY-MM-DD'
  isToday: boolean;
  isWeekend: boolean;
  weekIndex: number; // 0 to 4 (Week 01 to Week 05)
  dateObj: Date;
}

export interface MonthYear {
  year: number;
  month: number; // 0-indexed (0 = Jan, 11 = Dec)
}

export interface WeekGroup {
  weekNumber: number; // 1 to 5
  days: DayInfo[];
  color: string;
}

export interface ThemeColors {
  presetName: string;
  bgApp: string;
  bgCard: string;
  textPrimary: string;
  textSecondary: string;
  headerBg: string;
  stickyColBg: string;
  borderColor: string;
  checkboxBorder: string;
  checkboxCheckColor: string;
  weekColors: string[]; // 5 pastel colors for Week 01 .. Week 05
}
