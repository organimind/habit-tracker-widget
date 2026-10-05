import type { DayInfo, MonthYear, WeekGroup } from '../types/habit';

// Single letter weekday labels matching the reference screenshot: T W T F S S M
const WEEKDAYS_SHORT_SINGLE = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAYS_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Returns current year and 0-indexed month from device time.
 */
export function getCurrentMonthYear(): MonthYear {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
  };
}

/**
 * Returns today's date string in YYYY-MM-DD format.
 */
export function getTodayDateString(): string {
  const now = new Date();
  return formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Formats year, 0-indexed month, and day into "YYYY-MM-DD"
 */
export function formatDateKey(year: number, month: number, day: number): string {
  const yyyy = year.toString().padStart(4, '0');
  const mm = (month + 1).toString().padStart(2, '0');
  const dd = day.toString().padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns total days in specified month (handles leap years automatically).
 * e.g. Feb 2024 -> 29, Feb 2025 -> 28, Oct 2026 -> 31
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Gets month name by 0-indexed month number.
 */
export function getMonthName(monthIndex: number): string {
  return MONTH_NAMES[monthIndex] || '';
}

/**
 * Returns list of DayInfo objects for all days in the given month and year.
 */
export function getMonthDays(year: number, month: number): DayInfo[] {
  const totalDays = getDaysInMonth(year, month);
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const days: DayInfo[] = [];

  for (let day = 1; day <= totalDays; day++) {
    const dateObj = new Date(year, month, day);
    const dayOfWeek = dateObj.getDay();
    const dateString = formatDateKey(year, month, day);
    const isToday = year === todayYear && month === todayMonth && day === todayDate;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekIndex = Math.floor((day - 1) / 7);

    days.push({
      dayNumber: day,
      weekdayShort: WEEKDAYS_SHORT_SINGLE[dayOfWeek],
      weekdayFull: WEEKDAYS_FULL[dayOfWeek],
      dateString,
      isToday,
      isWeekend,
      weekIndex,
      dateObj,
    });
  }

  return days;
}

/**
 * Group days by week (Week 01 to Week 05)
 */
export function getWeekGroups(days: DayInfo[], weekColors: string[]): WeekGroup[] {
  const groups: { [key: number]: DayInfo[] } = {};

  days.forEach((day) => {
    if (!groups[day.weekIndex]) {
      groups[day.weekIndex] = [];
    }
    groups[day.weekIndex].push(day);
  });

  return Object.keys(groups).map((weekIdxStr) => {
    const weekIdx = parseInt(weekIdxStr, 10);
    return {
      weekNumber: weekIdx + 1,
      days: groups[weekIdx],
      color: weekColors[weekIdx % weekColors.length] || '#c7d2fe',
    };
  });
}

/**
 * Check if the given year & month is the current calendar month
 */
export function isCurrentMonth(year: number, month: number): boolean {
  const now = new Date();
  return now.getFullYear() === year && now.getMonth() === month;
}

/**
 * Calculate previous month
 */
export function getPrevMonth(year: number, month: number): MonthYear {
  if (month === 0) {
    return { year: year - 1, month: 11 };
  }
  return { year, month: month - 1 };
}

/**
 * Calculate next month
 */
export function getNextMonth(year: number, month: number): MonthYear {
  if (month === 11) {
    return { year: year + 1, month: 0 };
  }
  return { year, month: month + 1 };
}

/**
 * Formats Date string for accessible screen reader labels
 * e.g. "October 5, 2026"
 */
export function formatFullDateReadable(dateStr: string): string {
  const [yStr, mStr, dStr] = dateStr.split('-');
  const year = parseInt(yStr, 10);
  const monthIndex = parseInt(mStr, 10) - 1;
  const day = parseInt(dStr, 10);

  if (isNaN(year) || isNaN(monthIndex) || isNaN(day)) return dateStr;

  const monthName = getMonthName(monthIndex);
  return `${monthName} ${day}, ${year}`;
}
