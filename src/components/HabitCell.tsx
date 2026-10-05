import React from 'react';
import { Check } from 'lucide-react';
import type { DayInfo } from '../types/habit';
import { formatFullDateReadable } from '../utils/dateUtils';

interface HabitCellProps {
  habitId: string;
  habitName: string;
  day: DayInfo;
  isCompleted: boolean;
  weekColor?: string;
  onToggle: (dateStr: string, habitId: string) => void;
}

export const HabitCell: React.FC<HabitCellProps> = ({
  habitId,
  habitName,
  day,
  isCompleted,
  weekColor,
  onToggle,
}) => {
  const readableDate = formatFullDateReadable(day.dateString);
  const statusText = isCompleted ? 'completed' : 'incomplete';
  const ariaLabel = `${habitName}, ${readableDate}, ${statusText}`;

  const handleClick = () => {
    onToggle(day.dateString, habitId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(day.dateString, habitId);
    }
  };

  return (
    <button
      className={`habit-cell-btn ${isCompleted ? 'completed' : 'incomplete'} ${day.isToday ? 'today-cell' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-pressed={isCompleted}
      title={`${habitName} on ${readableDate} (${statusText})`}
      tabIndex={0}
    >
      <div
        className="cell-box"
        style={{
          borderColor: isCompleted
            ? weekColor || 'var(--checkbox-check-color)'
            : weekColor || 'var(--checkbox-border)',
          backgroundColor: isCompleted
            ? weekColor || 'var(--checkbox-check-color)'
            : 'var(--bg-card)',
        }}
      >
        {isCompleted && (
          <Check size={14} strokeWidth={3} className="animate-check check-icon" />
        )}
      </div>

      <style>{`
        .habit-cell-btn {
          width: 32px;
          height: 34px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background-color 0.12s ease, transform 0.1s ease;
        }
        .habit-cell-btn:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .habit-cell-btn:active {
          transform: scale(0.9);
        }
        .habit-cell-btn:focus-visible {
          outline: 2px solid var(--border-focus);
          outline-offset: -2px;
          border-radius: 4px;
        }
        .cell-box {
          width: 20px;
          height: 20px;
          border-radius: 5px;
          border-width: 2px;
          border-style: solid;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
          color: #ffffff;
        }
        .check-icon {
          color: #ffffff;
        }
        .today-cell {
          background-color: rgba(99, 102, 241, 0.06);
        }
      `}</style>
    </button>
  );
};
