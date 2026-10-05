import { useState, useEffect, useCallback, useMemo } from 'react';
import type { HabitTrackerData, Habit, MonthYear, DayInfo } from '../types/habit';
import {
  loadTrackerData,
  saveTrackerData,
  resetTrackerData,
  exportDataAsJSON,
  importDataFromJSON,
} from '../utils/storage';
import {
  getCurrentMonthYear,
  getPrevMonth,
  getNextMonth,
  getMonthDays,
  isCurrentMonth,
} from '../utils/dateUtils';
import confetti from 'canvas-confetti';

export function useHabitTracker() {
  // Current view month & year
  const [currentView, setCurrentView] = useState<MonthYear>(getCurrentMonthYear());

  // Master data from localStorage
  const [data, setData] = useState<HabitTrackerData>(() => loadTrackerData());

  // Automatically save to localStorage whenever data changes
  useEffect(() => {
    saveTrackerData(data);
  }, [data]);

  // Periodic check for month rollover when app stays open
  useEffect(() => {
    const checkDate = () => {
      const now = getCurrentMonthYear();
      // If view was on current month, and month rolled over, update view
      if (isCurrentMonth(currentView.year, currentView.month)) {
        setCurrentView(now);
      }
    };

    const interval = setInterval(checkDate, 60000); // Check every minute
    window.addEventListener('focus', checkDate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkDate);
    };
  }, [currentView]);

  // Month navigation actions
  const goToPrevMonth = useCallback(() => {
    setCurrentView((prev) => getPrevMonth(prev.year, prev.month));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentView((prev) => getNextMonth(prev.year, prev.month));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentView(getCurrentMonthYear());
  }, []);

  // Day list for the currently viewed month
  const monthDays: DayInfo[] = useMemo(() => {
    return getMonthDays(currentView.year, currentView.month);
  }, [currentView.year, currentView.month]);

  // Toggle habit cell completion
  const toggleCompletion = useCallback((dateString: string, habitId: string) => {
    setData((prevData) => {
      const dateCompletions = prevData.completions[dateString] || {};
      const currentStatus = !!dateCompletions[habitId];
      const newStatus = !currentStatus;

      const updatedDateCompletions = {
        ...dateCompletions,
        [habitId]: newStatus,
      };

      // Clean up false keys to keep storage compact
      if (!newStatus) {
        delete updatedDateCompletions[habitId];
      }

      const updatedCompletions = {
        ...prevData.completions,
        [dateString]: updatedDateCompletions,
      };

      // Remove date key completely if empty
      if (Object.keys(updatedDateCompletions).length === 0) {
        delete updatedCompletions[dateString];
      }

      // Trigger celebratory micro-confetti on checking off today's completion!
      if (newStatus) {
        const todayStr = new Date().toISOString().split('T')[0];
        if (dateString === todayStr) {
          try {
            confetti({
              particleCount: 25,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
              disableForReducedMotion: true,
            });
          } catch (e) {
            // ignore if confetti fails
          }
        }
      }

      return {
        ...prevData,
        completions: updatedCompletions,
      };
    });
  }, []);

  // Add a new habit
  const addHabit = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const newHabit: Habit = {
      id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: trimmed,
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
  }, []);

  // Update existing habit name
  const updateHabit = useCallback((habitId: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              name: trimmed,
            }
          : h
      ),
    }));
  }, []);

  // Delete habit
  const deleteHabit = useCallback((habitId: string) => {
    setData((prev) => {
      const filteredHabits = prev.habits.filter((h) => h.id !== habitId);
      return {
        ...prev,
        habits: filteredHabits,
      };
    });
  }, []);

  // Move habit up or down in list
  const moveHabit = useCallback((habitId: string, direction: 'up' | 'down') => {
    setData((prev) => {
      const index = prev.habits.findIndex((h) => h.id === habitId);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.habits.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const newHabits = [...prev.habits];
      const [moved] = newHabits.splice(index, 1);
      newHabits.splice(targetIndex, 0, moved);

      return {
        ...prev,
        habits: newHabits,
      };
    });
  }, []);

  // Reset to default state
  const resetTracker = useCallback(() => {
    const resetData = resetTrackerData();
    setData(resetData);
  }, []);

  // Export JSON backup file
  const handleExportData = useCallback(() => {
    exportDataAsJSON(data);
  }, [data]);

  // Import JSON backup file
  const handleImportData = useCallback((jsonString: string): boolean => {
    const imported = importDataFromJSON(jsonString);
    if (imported) {
      setData(imported);
      return true;
    }
    return false;
  }, []);

  // Calculate statistics for currently viewed month
  const statistics = useMemo(() => {
    const totalDaysInMonth = monthDays.length;
    const habitsCount = data.habits.length;
    const totalPossibleCells = totalDaysInMonth * habitsCount;

    let completedCellsCount = 0;

    monthDays.forEach((day) => {
      const dayCompletions = data.completions[day.dateString] || {};
      data.habits.forEach((habit) => {
        if (dayCompletions[habit.id]) {
          completedCellsCount++;
        }
      });
    });

    const completionPercentage =
      totalPossibleCells > 0 ? Math.round((completedCellsCount / totalPossibleCells) * 100) : 0;

    // Days with at least 1 habit completed
    let activeDaysCount = 0;
    monthDays.forEach((day) => {
      const dayCompletions = data.completions[day.dateString] || {};
      const hasAny = data.habits.some((h) => !!dayCompletions[h.id]);
      if (hasAny) activeDaysCount++;
    });

    return {
      totalDaysInMonth,
      habitsCount,
      totalPossibleCells,
      completedCellsCount,
      completionPercentage,
      activeDaysCount,
    };
  }, [monthDays, data.habits, data.completions]);

  return {
    currentView,
    habits: data.habits,
    completions: data.completions,
    monthDays,
    isCurrentViewToday: isCurrentMonth(currentView.year, currentView.month),
    statistics,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    toggleCompletion,
    addHabit,
    updateHabit,
    deleteHabit,
    moveHabit,
    resetTracker,
    exportData: handleExportData,
    importData: handleImportData,
  };
}
