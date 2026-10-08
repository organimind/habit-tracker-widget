import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Settings } from 'lucide-react';
import type { MonthYear } from '../types/habit';
import { getMonthName } from '../utils/dateUtils';

interface MonthNavigationProps {
  currentView: MonthYear;
  isTodayMonth: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
}

export const MonthNavigation: React.FC<MonthNavigationProps> = ({
  currentView,
  isTodayMonth,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
}) => {
  const monthName = getMonthName(currentView.month);

  // Hide settings icon inside any preview window (iframe) or preview mode
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;
  const searchParams = new URLSearchParams(window.location.search);
  const hideSettings = isIframe || searchParams.get('hideSettings') === 'true' || searchParams.get('preview') === 'true';

  return (
    <div className="month-nav-container">
      <div className="month-title-wrap">
        <h2 className="month-title">
          {monthName} <span className="year-text">{currentView.year}</span>
        </h2>
        {isTodayMonth && <span className="current-badge">Current Month</span>}
      </div>

      <div className="month-nav-actions">
        <div className="nav-arrows-wrap">
          <button
            className="nav-btn icon-btn"
            onClick={onPrevMonth}
            aria-label="Previous Month"
            title="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            className={`nav-btn today-btn ${isTodayMonth ? 'active-today' : ''}`}
            onClick={onGoToToday}
            title="Jump to Current Month"
            aria-label="Jump to Today's Month"
          >
            <Calendar size={13} />
            <span className="btn-text">Today</span>
          </button>

          <button
            className="nav-btn icon-btn"
            onClick={onNextMonth}
            aria-label="Next Month"
            title="Next Month"
          >
            <ChevronRight size={16} />
          </button>

          {!hideSettings && (
            <a
              href="/habit-tracker-widget/customize"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-btn icon-btn settings-btn"
              title="OrganiMind Settings & Customization"
              aria-label="OrganiMind Settings"
            >
              <Settings size={15} />
            </a>
          )}
        </div>
      </div>

      <style>{`
        .month-nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          margin-bottom: 0.6rem;
          box-shadow: var(--shadow-sm);
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .month-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .month-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }
        .year-text {
          color: var(--text-secondary);
          font-weight: 500;
        }
        .current-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-full);
          background: var(--accent-light, #e0e7ff);
          color: var(--border-focus, #4f46e5);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .month-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .nav-arrows-wrap {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .nav-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.35rem 0.6rem;
          height: 32px;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.78rem;
          cursor: pointer;
        }
        .nav-btn:hover {
          color: var(--text-primary);
        }
        .theme-customizer-btn {
          background: var(--bg-card);
          border-color: var(--border-light);
          color: var(--text-primary);
        }
        .theme-customizer-btn:hover {
          border-color: var(--border-focus);
        }
        .palette-icon {
          color: var(--border-focus);
        }
        .icon-btn {
          width: 32px;
          padding: 0;
        }
        .settings-btn {
          color: var(--text-secondary);
          text-decoration: none;
        }
        .settings-btn:hover {
          color: var(--border-focus);
        }
        .today-btn {
          padding: 0.35rem 0.75rem;
        }
        .today-btn.active-today {
          background: var(--bg-card);
          border-color: var(--border-focus);
          color: var(--text-primary);
          font-weight: 700;
        }

        @media (max-width: 540px) {
          .month-nav-container {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
            padding: 0.6rem 0.75rem;
          }
          .month-title-wrap {
            justify-content: space-between;
            width: 100%;
          }
          .month-nav-actions {
            justify-content: space-between;
            width: 100%;
          }
          .month-title {
            font-size: 1.05rem;
          }
        }

        @media (max-width: 380px) {
          .month-nav-actions .btn-text {
            display: none;
          }
          .nav-btn {
            padding: 0.35rem;
          }
        }
      `}</style>
    </div>
  );
};
