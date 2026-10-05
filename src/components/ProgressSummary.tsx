import React from 'react';
import { Flame, CheckCircle2, Target } from 'lucide-react';

interface ProgressSummaryProps {
  stats: {
    totalDaysInMonth: number;
    habitsCount: number;
    totalPossibleCells: number;
    completedCellsCount: number;
    completionPercentage: number;
    activeDaysCount: number;
  };
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({ stats }) => {
  return (
    <div className="progress-summary-card">
      <div className="progress-header-line">
        <div className="progress-title-wrap">
          <Target size={16} className="text-accent" />
          <span className="progress-label">Monthly Completion</span>
        </div>
        <div className="progress-percentage">
          <span className="percent-val">{stats.completionPercentage}%</span>
          <span className="percent-sub">complete</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-bg" aria-label={`Monthly progress: ${stats.completionPercentage}%`}>
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.min(100, Math.max(0, stats.completionPercentage))}%` }}
        />
      </div>

      {/* Detail Metrics Footer */}
      <div className="progress-metrics-footer">
        <div className="metric-pill">
          <CheckCircle2 size={13} className="text-secondary" />
          <span>
            <strong>{stats.completedCellsCount}</strong> / {stats.totalPossibleCells} checks
          </span>
        </div>

        <div className="metric-pill">
          <Flame size={13} className="text-amber" />
          <span>
            <strong>{stats.activeDaysCount}</strong> / {stats.totalDaysInMonth} active days
          </span>
        </div>
      </div>

      <style>{`
        .progress-summary-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 0.85rem 1rem;
          margin-bottom: 0.85rem;
          box-shadow: var(--shadow-sm);
        }
        .progress-header-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .progress-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-secondary);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
        .text-accent {
          color: var(--accent-primary);
        }
        .progress-percentage {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }
        .percent-val {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .percent-sub {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-weight: 500;
        }
        .progress-bar-bg {
          width: 100%;
          height: 7px;
          background: var(--bg-subtle);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 0.65rem;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--accent-primary);
          border-radius: var(--radius-full);
          transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .progress-metrics-footer {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .metric-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .text-secondary {
          color: var(--text-secondary);
        }
        .text-amber {
          color: #f59e0b;
        }
      `}</style>
    </div>
  );
};
