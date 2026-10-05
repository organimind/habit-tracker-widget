import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2, ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import type { Habit, DayInfo, CompletionMap } from '../types/habit';
import { HabitCell } from './HabitCell';

interface HabitRowProps {
  habit: Habit;
  index: number;
  days: DayInfo[];
  completions: CompletionMap;
  weekColors: string[];
  isFirst: boolean;
  isLast: boolean;
  onToggleCell: (dateStr: string, habitId: string) => void;
  onUpdate: (habitId: string, newName: string) => void;
  onDelete: (habitId: string) => void;
  onMove: (habitId: string, direction: 'up' | 'down') => void;
}

export const HabitRow: React.FC<HabitRowProps> = ({
  habit,
  index,
  days,
  completions,
  weekColors,
  isFirst,
  isLast,
  onToggleCell,
  onUpdate,
  onDelete,
  onMove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleStartEdit = () => {
    setEditName(habit.name);
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveRename = () => {
    if (editName.trim()) {
      onUpdate(habit.id, editName.trim());
      setIsEditing(false);
    }
  };

  const handleCancelRename = () => {
    setEditName(habit.name);
    setIsEditing(false);
  };

  return (
    <tr className={`habit-row ${showMenu ? 'row-menu-active' : ''}`}>
      {/* Sticky Habit Index # Column */}
      <td className="tracker-td index-col sticky-num-col">
        <span className="habit-num-text">{index + 1}</span>
      </td>

      {/* Sticky Habit Name Column */}
      <td className="tracker-td sticky-habit-col">
        <div className="habit-name-cell">
          {isEditing ? (
            <div className="inline-edit-wrap">
              <input
                type="text"
                className="inline-edit-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename();
                  if (e.key === 'Escape') handleCancelRename();
                }}
                autoFocus
                placeholder="Habit name..."
              />
              <button className="icon-action-btn btn-save" onClick={handleSaveRename} title="Save">
                <Check size={13} />
              </button>
              <button className="icon-action-btn btn-cancel" onClick={handleCancelRename} title="Cancel">
                <X size={13} />
              </button>
            </div>
          ) : (
            <div className="habit-title-display">
              <div className="habit-text-wrap">
                <span className="habit-name-text" title={habit.name}>
                  {habit.name}
                </span>
              </div>

              {/* 3 Dots Context Menu */}
              <div className={`habit-menu-wrap ${showMenu ? 'active' : ''}`} ref={menuRef}>
                <button
                  className="habit-menu-btn"
                  onClick={() => setShowMenu((prev) => !prev)}
                  aria-label={`Options for habit ${habit.name}`}
                  title="Habit Options (Edit, Move, Delete)"
                >
                  <MoreVertical size={14} />
                </button>

                {showMenu && (
                  <div
                    className={`habit-popover-menu ${isLast ? 'popover-up' : 'popover-down'}`}
                    role="menu"
                  >
                    <button
                      className="popover-item"
                      onClick={handleStartEdit}
                      role="menuitem"
                    >
                      <Edit2 size={13} />
                      <span>Edit Habit</span>
                    </button>

                    {!isFirst && (
                      <button
                        className="popover-item"
                        onClick={() => {
                          onMove(habit.id, 'up');
                          setShowMenu(false);
                        }}
                        role="menuitem"
                      >
                        <ArrowUp size={13} />
                        <span>Move Up</span>
                      </button>
                    )}

                    {!isLast && (
                      <button
                        className="popover-item"
                        onClick={() => {
                          onMove(habit.id, 'down');
                          setShowMenu(false);
                        }}
                        role="menuitem"
                      >
                        <ArrowDown size={13} />
                        <span>Move Down</span>
                      </button>
                    )}

                    <div className="popover-divider" />

                    <button
                      className="popover-item text-danger"
                      onClick={() => {
                        if (window.confirm(`Delete habit "${habit.name}"?`)) {
                          onDelete(habit.id);
                        }
                        setShowMenu(false);
                      }}
                      role="menuitem"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </td>

      {/* Days Cells Columns grouped by week colors */}
      {days.map((day) => {
        const dateCompletions = completions[day.dateString] || {};
        const isCompleted = !!dateCompletions[habit.id];
        const weekColor = weekColors[day.weekIndex % weekColors.length];

        return (
          <td key={day.dateString} className={`tracker-td ${day.isToday ? 'today-col' : ''}`}>
            <HabitCell
              habitId={habit.id}
              habitName={habit.name}
              day={day}
              isCompleted={isCompleted}
              weekColor={weekColor}
              onToggle={onToggleCell}
            />
          </td>
        );
      })}

      <style>{`
        .habit-row {
          position: relative;
        }
        .habit-row.row-menu-active {
          z-index: 100 !important;
        }
        .habit-row.row-menu-active .sticky-habit-col,
        .habit-row.row-menu-active .sticky-num-col {
          z-index: 150 !important;
        }
        .habit-row:hover .sticky-habit-col,
        .habit-row:hover .sticky-num-col {
          background-color: color-mix(in srgb, var(--sticky-col-bg, #ffffff) 93%, var(--text-primary, #000000) 7%) !important;
        }
        .index-col {
          width: 32px;
          min-width: 32px;
          text-align: center;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
          user-select: none;
        }
        .sticky-num-col {
          position: sticky;
          left: 0;
          z-index: 16;
          background-color: var(--sticky-col-bg, #ffffff);
          border-right: 1px solid var(--border-light) !important;
        }
        .sticky-habit-col {
          position: sticky;
          left: 32px;
          z-index: 20;
          background-color: var(--sticky-col-bg, #ffffff);
          border-right: 2px solid var(--border-light) !important;
          box-shadow: 4px 0 10px rgba(0, 0, 0, 0.03);
          overflow: visible !important;
        }
        .habit-name-cell {
          display: flex;
          align-items: center;
          padding: 0.3rem 0.5rem;
          min-width: 180px;
          max-width: 220px;
          height: 36px;
          position: relative;
          overflow: visible;
        }
        @media (max-width: 520px) {
          .habit-name-cell {
            min-width: 135px;
            max-width: 160px;
            padding: 0.25rem 0.35rem;
          }
          .habit-name-text {
            font-size: 0.78rem;
          }
        }
        .habit-title-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          position: relative;
          overflow: visible;
        }
        .habit-text-wrap {
          display: flex;
          align-items: center;
          overflow: hidden;
          flex: 1;
          min-width: 0;
          padding-right: 0.2rem;
        }
        .habit-name-text {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .habit-menu-wrap {
          position: relative;
          opacity: 0.6;
          transition: opacity 0.15s ease;
          flex-shrink: 0;
        }
        .habit-row:hover .habit-menu-wrap,
        .habit-menu-wrap.active {
          opacity: 1;
        }
        .habit-menu-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 4px;
          color: var(--text-secondary);
          background: transparent;
        }
        .habit-menu-btn:hover,
        .habit-menu-wrap.active .habit-menu-btn {
          color: var(--text-primary);
          background: rgba(0, 0, 0, 0.08);
        }
        .habit-popover-menu {
          position: absolute;
          right: 0;
          width: 130px;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          padding: 0.3rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          animation: menuFadeIn 0.12s ease-out;
        }
        .habit-popover-menu.popover-down {
          top: 100%;
          margin-top: 4px;
        }
        .habit-popover-menu.popover-up {
          bottom: 100%;
          margin-bottom: 4px;
        }
        @keyframes menuFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .popover-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-secondary);
          width: 100%;
          text-align: left;
          background: transparent;
        }
        .popover-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .popover-divider {
          height: 1px;
          background: var(--border-light);
          margin: 0.15rem 0;
        }
        .text-danger {
          color: #ef4444 !important;
        }
        .text-danger:hover {
          background: rgba(239, 68, 68, 0.08) !important;
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
        }
        .btn-save {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
        }
        .btn-save:hover {
          background: #10b981;
          color: #ffffff;
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
    </tr>
  );
};
