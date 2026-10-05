import type { HabitTrackerData, Habit } from '../types/habit';

const STORAGE_KEY = 'habitTrackerData';

export const DEFAULT_HABITS: Habit[] = [
  { id: 'h-1', name: 'Wake up early', createdAt: new Date().toISOString() },
  { id: 'h-2', name: 'Study / Read', createdAt: new Date().toISOString() },
  { id: 'h-3', name: 'Drink 8 glasses of water', createdAt: new Date().toISOString() },
  { id: 'h-4', name: 'Workout / Exercise', createdAt: new Date().toISOString() },
  { id: 'h-5', name: 'Meditate', createdAt: new Date().toISOString() },
  { id: 'h-6', name: 'Journaling', createdAt: new Date().toISOString() },
  { id: 'h-7', name: 'Eat healthy', createdAt: new Date().toISOString() },
  { id: 'h-8', name: 'Sleep by 11 PM', createdAt: new Date().toISOString() },
  { id: 'h-9', name: 'No screen time at night', createdAt: new Date().toISOString() },
  { id: 'h-10', name: 'Gratitude', createdAt: new Date().toISOString() },
  { id: 'h-11', name: 'Walk 10K steps', createdAt: new Date().toISOString() },
  { id: 'h-12', name: 'Custom Habit', createdAt: new Date().toISOString() },
];

export const INITIAL_DATA: HabitTrackerData = {
  version: 1,
  habits: DEFAULT_HABITS,
  completions: {},
};

/**
 * Safely load data from localStorage with full fallback for empty or corrupted data.
 */
export function loadTrackerData(): HabitTrackerData {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return INITIAL_DATA;
    }

    const parsed = JSON.parse(rawData);

    // Validate structure
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !Array.isArray(parsed.habits) ||
      typeof parsed.completions !== 'object' ||
      parsed.completions === null
    ) {
      console.warn('Invalid habit tracker data structure in localStorage. Reverting to default.');
      return INITIAL_DATA;
    }

    // Clean up habit array entries
    const validHabits: Habit[] = parsed.habits
      .filter((h: any) => h && typeof h === 'object' && typeof h.id === 'string' && typeof h.name === 'string')
      .map((h: Habit) => ({
        id: h.id,
        name: h.name.trim() || 'Untitled Habit',
        color: h.color || undefined,
        createdAt: h.createdAt || new Date().toISOString(),
      }));

    const validCompletions = parsed.completions || {};

    return {
      version: parsed.version || 1,
      habits: validHabits.length > 0 ? validHabits : DEFAULT_HABITS,
      completions: validCompletions,
    };
  } catch (error) {
    console.error('Failed to parse localStorage data for habit tracker:', error);
    return INITIAL_DATA;
  }
}

/**
 * Save current habit tracker data to localStorage safely.
 */
export function saveTrackerData(data: HabitTrackerData): boolean {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save habit tracker data to localStorage:', error);
    return false;
  }
}

/**
 * Clear data and reset to initial state
 */
export function resetTrackerData(): HabitTrackerData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing localStorage:', e);
  }
  return INITIAL_DATA;
}

/**
 * Export data as downloadable JSON file
 */
export function exportDataAsJSON(data: HabitTrackerData): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `habit-tracker-backup-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Import data from JSON string, validating schema
 */
export function importDataFromJSON(jsonString: string): HabitTrackerData | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.habits) && typeof parsed.completions === 'object') {
      const data: HabitTrackerData = {
        version: parsed.version || 1,
        habits: parsed.habits,
        completions: parsed.completions,
      };
      saveTrackerData(data);
      return data;
    }
  } catch (e) {
    console.error('Import parse error:', e);
  }
  return null;
}
