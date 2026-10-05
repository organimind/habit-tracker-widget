import React from 'react';
import { X, RotateCcw, Palette, Check } from 'lucide-react';
import type { ThemeColors } from '../types/habit';
import { PRESET_THEMES } from '../utils/themeStorage';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  theme: ThemeColors;
  onClose: () => void;
  onThemeChange: (newTheme: ThemeColors) => void;
  onResetTheme: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  theme,
  onClose,
  onThemeChange,
  onResetTheme,
}) => {
  if (!isOpen) return null;

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    onThemeChange({
      ...theme,
      presetName: 'Custom Palette',
      [key]: value,
    });
  };

  const handleWeekColorChange = (index: number, color: string) => {
    const updated = [...theme.weekColors];
    updated[index] = color;
    onThemeChange({
      ...theme,
      presetName: 'Custom Palette',
      weekColors: updated,
    });
  };

  const applyPreset = (presetKey: string) => {
    const preset = PRESET_THEMES[presetKey];
    if (preset) {
      onThemeChange(preset);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="theme-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="theme-modal-header">
          <div className="title-wrap">
            <Palette size={20} className="text-accent" />
            <h3 className="theme-modal-title">Color Wheel Customizer</h3>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close customizer">
            <X size={18} />
          </button>
        </div>

        <p className="theme-modal-desc">
          Customize every color in your Habit Tracker to perfectly match your Notion workspace theme!
        </p>

        {/* Preset Theme Selection */}
        <div className="custom-section">
          <label className="section-label">Quick Color Presets</label>
          <div className="preset-grid">
            {Object.keys(PRESET_THEMES).map((key) => {
              const p = PRESET_THEMES[key];
              const isSelected = theme.presetName === p.presetName;
              return (
                <button
                  key={key}
                  className={`preset-card-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => applyPreset(key)}
                >
                  <div className="preset-color-swatches">
                    {p.weekColors.slice(0, 4).map((c, i) => (
                      <span key={i} className="swatch-dot" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="preset-name">{p.presetName}</span>
                  {isSelected && <Check size={14} className="check-mark" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Wheel Controls */}
        <div className="custom-section">
          <label className="section-label">UI Colors</label>
          <div className="color-inputs-grid">
            <div className="color-field">
              <span className="field-name">Widget Background</span>
              <div className="color-picker-wrap">
                <input
                  type="color"
                  value={theme.bgApp}
                  onChange={(e) => handleColorChange('bgApp', e.target.value)}
                />
                <input
                  type="text"
                  className="hex-input"
                  value={theme.bgApp}
                  onChange={(e) => handleColorChange('bgApp', e.target.value)}
                />
              </div>
            </div>

            <div className="color-field">
              <span className="field-name">Table Card BG</span>
              <div className="color-picker-wrap">
                <input
                  type="color"
                  value={theme.bgCard}
                  onChange={(e) => handleColorChange('bgCard', e.target.value)}
                />
                <input
                  type="text"
                  className="hex-input"
                  value={theme.bgCard}
                  onChange={(e) => handleColorChange('bgCard', e.target.value)}
                />
              </div>
            </div>

            <div className="color-field">
              <span className="field-name">Habit Column BG</span>
              <div className="color-picker-wrap">
                <input
                  type="color"
                  value={theme.stickyColBg || '#f1f5f9'}
                  onChange={(e) => handleColorChange('stickyColBg', e.target.value)}
                />
                <input
                  type="text"
                  className="hex-input"
                  value={theme.stickyColBg || '#f1f5f9'}
                  onChange={(e) => handleColorChange('stickyColBg', e.target.value)}
                />
              </div>
            </div>

            <div className="color-field">
              <span className="field-name">Primary Text</span>
              <div className="color-picker-wrap">
                <input
                  type="color"
                  value={theme.textPrimary}
                  onChange={(e) => handleColorChange('textPrimary', e.target.value)}
                />
                <input
                  type="text"
                  className="hex-input"
                  value={theme.textPrimary}
                  onChange={(e) => handleColorChange('textPrimary', e.target.value)}
                />
              </div>
            </div>

            <div className="color-field">
              <span className="field-name">Muted Text</span>
              <div className="color-picker-wrap">
                <input
                  type="color"
                  value={theme.textSecondary}
                  onChange={(e) => handleColorChange('textSecondary', e.target.value)}
                />
                <input
                  type="text"
                  className="hex-input"
                  value={theme.textSecondary}
                  onChange={(e) => handleColorChange('textSecondary', e.target.value)}
                />
              </div>
            </div>

            <div className="color-field">
              <span className="field-name">Table Border Color</span>
              <div className="color-picker-wrap">
                <input
                  type="color"
                  value={theme.borderColor}
                  onChange={(e) => handleColorChange('borderColor', e.target.value)}
                />
                <input
                  type="text"
                  className="hex-input"
                  value={theme.borderColor}
                  onChange={(e) => handleColorChange('borderColor', e.target.value)}
                />
              </div>
            </div>

            <div className="color-field">
              <span className="field-name">Checkbox Border</span>
              <div className="color-picker-wrap">
                <input
                  type="color"
                  value={theme.checkboxBorder}
                  onChange={(e) => handleColorChange('checkboxBorder', e.target.value)}
                />
                <input
                  type="text"
                  className="hex-input"
                  value={theme.checkboxBorder}
                  onChange={(e) => handleColorChange('checkboxBorder', e.target.value)}
                />
              </div>
            </div>

            <div className="color-field">
              <span className="field-name">Checked Fill Color</span>
              <div className="color-picker-wrap">
                <input
                  type="color"
                  value={theme.checkboxCheckColor}
                  onChange={(e) => handleColorChange('checkboxCheckColor', e.target.value)}
                />
                <input
                  type="text"
                  className="hex-input"
                  value={theme.checkboxCheckColor}
                  onChange={(e) => handleColorChange('checkboxCheckColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Week Header Pastel Palette */}
        <div className="custom-section">
          <label className="section-label">Week Banner Colors (5 Weeks)</label>
          <div className="week-colors-row">
            {theme.weekColors.map((color, idx) => (
              <div key={idx} className="week-color-item">
                <span className="week-label">Week {idx + 1}</span>
                <div className="color-picker-wrap">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleWeekColorChange(idx, e.target.value)}
                  />
                  <input
                    type="text"
                    className="hex-input-sm"
                    value={color}
                    onChange={(e) => handleWeekColorChange(idx, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="theme-modal-footer">
          <button className="reset-btn" onClick={onResetTheme} title="Reset to default cute colors">
            <RotateCcw size={14} />
            <span>Reset Colors</span>
          </button>

          <button className="done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>

      <style>{`
        .theme-modal-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          max-width: 540px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-lg);
        }
        .theme-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }
        .title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .theme-modal-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .theme-modal-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }
        .custom-section {
          margin-bottom: 1.25rem;
        }
        .section-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-secondary);
          margin-bottom: 0.6rem;
        }
        .preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.5rem;
        }
        .preset-card-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-md);
          background: var(--bg-app);
          border: 1.5px solid var(--border-light);
          color: var(--text-primary);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }
        .preset-card-btn:hover {
          border-color: var(--border-focus);
        }
        .preset-card-btn.active {
          border-color: var(--border-focus);
          background: var(--accent-light);
        }
        .preset-color-swatches {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .swatch-dot {
          width: 8px;
          height: 14px;
          border-radius: 2px;
        }
        .preset-name {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .check-mark {
          color: var(--border-focus);
        }
        .color-inputs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 0.75rem;
        }
        .color-field {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-app);
          padding: 0.4rem 0.65rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
        }
        .field-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .color-picker-wrap {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .color-picker-wrap input[type="color"] {
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          padding: 0;
          background: transparent;
        }
        .hex-input {
          width: 65px;
          padding: 0.15rem 0.3rem;
          border: 1px solid var(--border-light);
          border-radius: 4px;
          font-size: 0.75rem;
          font-family: monospace;
          background: var(--bg-card);
          color: var(--text-primary);
          text-transform: uppercase;
        }
        .hex-input-sm {
          width: 55px;
          padding: 0.15rem 0.25rem;
          border: 1px solid var(--border-light);
          border-radius: 4px;
          font-size: 0.72rem;
          font-family: monospace;
          background: var(--bg-card);
          color: var(--text-primary);
          text-transform: uppercase;
        }
        .week-colors-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .week-color-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          background: var(--bg-app);
          padding: 0.35rem 0.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
        }
        .week-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .theme-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.25rem;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-light);
        }
        .reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .reset-btn:hover {
          color: var(--text-primary);
        }
        .done-btn {
          background: var(--border-focus);
          color: #ffffff;
          padding: 0.45rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};
