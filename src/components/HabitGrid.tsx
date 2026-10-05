import React, { useState } from 'react';
import { Plus, Sparkles, Check, X } from 'lucide-react';
import type { Habit, DayInfo, CompletionMap, ThemeColors } from '../types/habit';
import { getWeekGroups } from '../utils/dateUtils';
import { HabitRow } from './HabitRow';

interface HabitGridProps {
  habits: Habit[];
  days: DayInfo[];
  completions: CompletionMap;
  theme: ThemeColors;
  onToggleCell: (dateStr: string, habitId: string) => void;
  onAddHabit: (name: string) => void;
  onUpdateHabit: (habitId: string, newName: string) => void;
  onDeleteHabit: (habitId: string) => void;
  onMoveHabit: (habitId: string, direction: 'up' | 'down') => void;
  onResetDefaults: () => void;
}

export const HabitGrid: React.FC<HabitGridProps> = ({
  habits,
  days,
  completions,
  theme,
  onToggleCell,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onMoveHabit,
  onResetDefaults,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  // Group days into Week 01, Week 02, Week 03, Week 04, Week 05
  const weekGroups = getWeekGroups(days, theme.weekColors);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim());
      setNewHabitName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="tracker-wrapper">
      <div className="tracker-grid-container">
        <table className="tracker-table" role="grid" aria-label="Habit Tracker Grid">
          <thead>
            {/* Header Row 1: Week Banners (WEEK 01, WEEK 02, etc.) */}
            <tr className="week-header-row">
              <th rowSpan={3} className="tracker-th index-col sticky-num-col week-title-th">#</th>
              <th rowSpan={3} className="tracker-th sticky-habit-col habit-col-header week-title-th">
                <div className="habit-header-cell-wrap">
                  <span className="habit-header-title">HABIT</span>
                  <button
                    className="header-add-btn"
                    onClick={() => setShowAddForm(true)}
                    title="Add a new habit"
                  >
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>
              </th>

              {weekGroups.map((week) => (
                <th
                  key={week.weekNumber}
                  colSpan={week.days.length}
                  className="tracker-th week-banner-th"
                  style={{ backgroundColor: week.color }}
                >
                  <span className="week-banner-text">
                    WEEK {week.weekNumber.toString().padStart(2, '0')}
                  </span>
                </th>
              ))}
            </tr>

            {/* Header Row 2: Weekday initials (M, T, W, T, F, S, S...) */}
            <tr className="weekday-header-row">
              {days.map((day) => (
                <th
                  key={`wd-${day.dateString}`}
                  className={`tracker-th day-col-header sub-th ${day.isToday ? 'today-header' : ''}`}
                >
                  <span className="weekday-letter">{day.weekdayShort}</span>
                </th>
              ))}
            </tr>

            {/* Header Row 3: Date numbers (01, 02, 03...) */}
            <tr className="date-header-row">
              {days.map((day) => (
                <th
                  key={`dt-${day.dateString}`}
                  className={`tracker-th day-col-header sub-th ${day.isToday ? 'today-header' : ''}`}
                >
                  <span className="day-number-text">{day.dayNumber.toString().padStart(2, '0')}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {habits.length === 0 && !showAddForm ? (
              <tr>
                <td colSpan={days.length + 2} className="empty-grid-td">
                  <div className="empty-grid-state">
                    <Sparkles size={24} className="text-tertiary" />
                    <p className="empty-title">No habits created yet</p>
                    <p className="empty-desc">Add a habit to start tracking your month!</p>
                    <div className="empty-actions">
                      <button className="btn-secondary" onClick={() => setShowAddForm(true)}>
                        <Plus size={14} />
                        <span>Create Habit</span>
                      </button>
                      <button className="btn-ghost" onClick={onResetDefaults}>
                        Load Example Habits
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {habits.map((habit, idx) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    index={idx}
                    days={days}
                    completions={completions}
                    weekColors={theme.weekColors}
                    isFirst={idx === 0}
                    isLast={idx === habits.length - 1 && !showAddForm}
                    onToggleCell={onToggleCell}
                    onUpdate={onUpdateHabit}
                    onDelete={onDeleteHabit}
                    onMove={onMoveHabit}
                  />
                ))}

                {/* Inline Add Habit Row inside table */}
                {showAddForm ? (
                  <tr className="habit-row inline-add-tr">
                    <td className="tracker-td index-col sticky-num-col">
                      <span className="habit-num-text">{habits.length + 1}</span>
                    </td>
                    <td className="tracker-td sticky-habit-col">
                      <div className="habit-name-cell">
                        <form onSubmit={handleAddSubmit} className="inline-edit-wrap">
                          <input
                            type="text"
                            className="inline-edit-input"
                            placeholder="New habit name (Enter to save)..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setShowAddForm(false);
                                setNewHabitName('');
                              }
                            }}
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="icon-action-btn btn-save"
                            title="Save Habit (Enter)"
                            disabled={!newHabitName.trim()}
                          >
                            <Check size={13} />
                          </button>
                          <button
                            type="button"
                            className="icon-action-btn btn-cancel"
                            onClick={() => {
                              setShowAddForm(false);
                              setNewHabitName('');
                            }}
                            title="Cancel (Esc)"
                          >
                            <X size={13} />
                          </button>
                        </form>
                      </div>
                    </td>
                    {days.map((day) => (
                      <td key={`add-${day.dateString}`} className="tracker-td add-row-day-td" />
                    ))}
                  </tr>
                ) : (
                  <tr
                    className="habit-row add-habit-row-tr"
                    onClick={() => setShowAddForm(true)}
                    title="Click to add a new habit"
                  >
                    <td className="tracker-td index-col sticky-num-col">
                      <span className="add-plus-symbol">+</span>
                    </td>
                    <td className="tracker-td sticky-habit-col">
                      <div className="habit-name-cell add-habit-trigger-cell">
                        <span className="add-habit-inline-text">+ Add a habit</span>
                      </div>
                    </td>
                    {days.map((day) => (
                      <td key={`add-btn-${day.dateString}`} className="tracker-td add-row-day-td" />
                    ))}
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .tracker-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
        }
        .week-header-row th {
          height: 30px;
          border-bottom: 1px solid var(--border-light);
        }
        .week-title-th {
          background: var(--header-bg, #dbeaff) !important;
          color: var(--text-primary);
          height: auto !important;
          vertical-align: middle;
        }
        .habit-header-cell-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.3rem 0.5rem;
          width: 100%;
          height: 100%;
        }
        .habit-header-title {
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-primary);
          text-transform: uppercase;
        }
        .header-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--border-light);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
        }
        .header-add-btn:hover {
          background: #ffffff;
          border-color: var(--border-focus);
        }
        .week-banner-th {
          text-align: center;
          padding: 0.2rem 0;
          user-select: none;
        }
        .week-banner-text {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #334155;
          text-transform: uppercase;
        }
        .sub-th {
          background: var(--bg-card);
          height: 22px;
          border-bottom: 1px solid var(--border-light);
        }
        .weekday-letter {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .day-number-text {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .today-header {
          background-color: rgba(99, 102, 241, 0.08) !important;
        }
        .empty-grid-td {
          padding: 3rem 1rem;
          text-align: center;
        }
        .empty-grid-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }
        .empty-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .empty-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }
        .empty-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-md);
          background: var(--border-focus);
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 600;
        }
        .btn-ghost {
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.82rem;
        }
        .btn-ghost:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .add-habit-row-tr {
          cursor: pointer;
        }
        .add-habit-row-tr:hover .sticky-habit-col,
        .add-habit-row-tr:hover .sticky-num-col {
          background-color: color-mix(in srgb, var(--sticky-col-bg, #ffffff) 88%, var(--text-primary, #000000) 12%) !important;
        }
        .add-plus-symbol {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .add-habit-trigger-cell {
          cursor: pointer;
        }
        .add-habit-inline-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .add-row-day-td {
          background-color: var(--bg-card);
        }
        .inline-add-tr .sticky-habit-col,
        .inline-add-tr .sticky-num-col {
          background-color: color-mix(in srgb, var(--sticky-col-bg, #ffffff) 93%, var(--border-focus) 7%) !important;
        }
        .inline-edit-wrap {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          width: 100%;
        }
        .inline-edit-input {
          flex: 1;
          min-width: 0;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.8rem;
          background: var(--bg-card);
          color: var(--text-primary);
        }
        .icon-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.2rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
        }
        .btn-save {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
        }
        .btn-save:hover:not(:disabled) {
          background: #10b981;
          color: #ffffff;
        }
        .btn-save:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .btn-cancel {
          background: rgba(100, 116, 139, 0.12);
          color: var(--text-secondary);
        }
        .btn-cancel:hover {
          background: var(--text-secondary);
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};
