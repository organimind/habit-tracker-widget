import React, { useState, useEffect } from 'react';
import { useHabitTracker } from './hooks/useHabitTracker';
import { MonthNavigation } from './components/MonthNavigation';
import { HabitGrid } from './components/HabitGrid';
import { CustomizePage } from './pages/CustomizePage';
import type { ThemeColors } from './types/habit';
import {
  loadThemeFromURLOrStorage,
  saveCustomTheme,
  updateURLWithTheme,
  listenToExternalThemeChanges,
} from './utils/themeStorage';

const checkIsCustomize = (): boolean => {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return path.includes('customize') || hash.includes('customize');
};

export const App: React.FC = () => {
  const [isCustomize, setIsCustomize] = useState(checkIsCustomize);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsCustomize(checkIsCustomize());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (isCustomize) {
      document.documentElement.classList.add('customize-mode');
      document.body.classList.add('customize-mode');
    } else {
      document.documentElement.classList.remove('customize-mode');
      document.body.classList.remove('customize-mode');
    }
  }, [isCustomize]);

  const [theme, setTheme] = useState<ThemeColors>(loadThemeFromURLOrStorage);

  const {
    currentView,
    habits,
    completions,
    monthDays,
    isCurrentViewToday,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    toggleCompletion,
    addHabit,
    updateHabit,
    deleteHabit,
    moveHabit,
    resetTracker,
  } = useHabitTracker();

  // Dynamically apply user's custom color choices to CSS root variables & sync with URL
  useEffect(() => {
    if (!isCustomize) {
      saveCustomTheme(theme);
      updateURLWithTheme(theme);

      const root = document.documentElement;
      root.style.setProperty('--bg-app', theme.bgApp);
      root.style.setProperty('--bg-card', theme.bgCard);
      root.style.setProperty('--text-primary', theme.textPrimary);
      root.style.setProperty('--text-secondary', theme.textSecondary);
      root.style.setProperty('--header-bg', theme.headerBg);
      root.style.setProperty('--sticky-col-bg', theme.stickyColBg || theme.bgCard);
      root.style.setProperty('--border-light', theme.borderColor);
      root.style.setProperty('--checkbox-border', theme.checkboxBorder);
      root.style.setProperty('--checkbox-check-color', theme.checkboxCheckColor);
      root.style.setProperty('--border-focus', theme.checkboxCheckColor);
    }
  }, [theme, isCustomize]);

  // Listen for iframe postMessage or URL changes from host website (OrganiMind)
  useEffect(() => {
    const unsubscribe = listenToExternalThemeChanges((newTheme) => {
      setTheme(newTheme);
    });
    return unsubscribe;
  }, []);

  if (isCustomize) {
    return <CustomizePage />;
  }

  return (
    <div className="widget-container">
      {/* Navigation Header */}
      <MonthNavigation
        currentView={currentView}
        isTodayMonth={isCurrentViewToday}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onGoToToday={goToToday}
      />

      {/* Main Habit Grid Matrix */}
      <main>
        <HabitGrid
          habits={habits}
          days={monthDays}
          completions={completions}
          theme={theme}
          onToggleCell={toggleCompletion}
          onAddHabit={addHabit}
          onUpdateHabit={updateHabit}
          onDeleteHabit={deleteHabit}
          onMoveHabit={moveHabit}
          onResetDefaults={resetTracker}
        />
      </main>

      <style>{`
        .widget-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.5rem;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default App;
