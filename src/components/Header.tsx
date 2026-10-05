import React, { useState } from 'react';
import { Sparkles, Sun, Moon, Palette, Download, Upload, RotateCcw, HelpCircle } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark' | 'warm';
  onThemeChange: (theme: 'light' | 'dark' | 'warm') => void;
  onExport: () => void;
  onImportClick: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  onExport,
  onImportClick,
  onReset,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const cycleTheme = () => {
    if (theme === 'light') onThemeChange('dark');
    else if (theme === 'dark') onThemeChange('warm');
    else onThemeChange('light');
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon size={15} />;
    if (theme === 'warm') return <Palette size={15} />;
    return <Sun size={15} />;
  };

  return (
    <header className="tracker-header">
      <div className="header-brand">
        <div className="brand-logo">
          <Sparkles size={18} className="text-accent" />
        </div>
        <div>
          <h1 className="brand-title">Habit Tracker</h1>
          <span className="brand-subtitle">Notion Widget</span>
        </div>
      </div>

      <div className="header-actions">
        {/* Theme Switcher */}
        <button
          className="header-btn"
          onClick={cycleTheme}
          title={`Current Theme: ${theme.toUpperCase()}. Click to toggle.`}
          aria-label="Toggle theme"
        >
          {getThemeIcon()}
          <span className="btn-label">{theme.toUpperCase()}</span>
        </button>

        {/* Information / Help */}
        <button
          className="header-btn"
          onClick={() => setShowInfo(!showInfo)}
          title="Widget Info & Help"
          aria-label="Widget info"
        >
          <HelpCircle size={15} />
        </button>

        {/* Data Options Dropdown */}
        <div className="dropdown-container">
          <button
            className="header-btn"
            onClick={() => setShowMenu(!showMenu)}
            title="Data Backup & Reset Options"
            aria-label="Settings and Data Options"
          >
            <Download size={15} />
            <span className="btn-label">Backup</span>
          </button>

          {showMenu && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  onExport();
                  setShowMenu(false);
                }}
              >
                <Download size={14} />
                <span>Export Backup (JSON)</span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  onImportClick();
                  setShowMenu(false);
                }}
              >
                <Upload size={14} />
                <span>Import Backup (JSON)</span>
              </button>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item text-danger"
                onClick={() => {
                  if (confirm('Are you sure you want to reset all habits and data to defaults?')) {
                    onReset();
                  }
                  setShowMenu(false);
                }}
              >
                <RotateCcw size={14} />
                <span>Reset to Defaults</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal-content info-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">About Habit Tracker Widget</h3>
            <p className="modal-desc">
              Designed for embedding seamlessly inside <strong>Notion</strong> pages or standalone productivity workspaces.
            </p>
            <ul className="info-list">
              <li>🔒 <strong>100% Local Data:</strong> Everything is stored inside your browser's <code>localStorage</code>. No servers or account required.</li>
              <li>📅 <strong>Auto Month Detection:</strong> Displays the current month based on your device date and remembers historical data across months.</li>
              <li>📱 <strong>Responsive & Scrollable:</strong> Horizontally scrolls smoothly on narrow columns or mobile screens without breaking cell alignment.</li>
            </ul>
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => setShowInfo(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tracker-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.25rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .header-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .brand-logo {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          background: var(--accent-light, rgba(99, 102, 241, 0.12));
          color: var(--accent-primary, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-light);
        }
        .brand-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .brand-subtitle {
          font-size: 0.72rem;
          color: var(--text-tertiary);
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .header-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-md);
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          font-size: 0.78rem;
          font-weight: 500;
          box-shadow: var(--shadow-sm);
        }
        .header-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .btn-label {
          display: none;
        }
        @media (min-width: 480px) {
          .btn-label {
            display: inline;
          }
        }
        @media (max-width: 420px) {
          .tracker-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .header-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
        .dropdown-container {
          position: relative;
        }
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 0.4rem;
          width: 200px;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 50;
          padding: 0.35rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.6rem;
          width: 100%;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-align: left;
        }
        .dropdown-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .dropdown-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 0.2rem 0;
        }
        .text-danger {
          color: #ef4444 !important;
        }
        .text-danger:hover {
          background: rgba(239, 68, 68, 0.08) !important;
        }
        .modal-content {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          max-width: 420px;
          width: 100%;
          box-shadow: var(--shadow-lg);
        }
        .modal-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .modal-desc {
          color: var(--text-secondary);
          font-size: 0.88rem;
          margin-bottom: 1rem;
        }
        .info-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1.2rem;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .info-list code {
          background: var(--bg-subtle);
          padding: 0.15rem 0.35rem;
          border-radius: 4px;
          font-size: 0.78rem;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
        }
        .btn-primary {
          background: var(--accent-primary, #4f46e5);
          color: #ffffff;
          padding: 0.45rem 1rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.85rem;
        }
      `}</style>
    </header>
  );
};
