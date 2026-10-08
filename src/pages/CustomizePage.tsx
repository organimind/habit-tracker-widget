import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Palette,
  Paintbrush,
  Sun,
  Moon,
  Copy,
  Check,
  RefreshCw,
  AppWindow,
  HelpCircle,
  Layers,
} from 'lucide-react';
import {
  type HabitThemePreset,
  HABIT_LIGHT_THEMES,
  HABIT_DARK_THEMES,
  HABIT_NOTION_EMBED_STEPS,
} from '../data/habitTrackerConstants';
import './CustomizePage.css';

export const CustomizePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'light' | 'dark'>('light');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('cutePastel');
  const [colors, setColors] = useState({
    bgApp: '#F8FAFC',
    bgCard: '#FFFFFF',
    textPrimary: '#334155',
    textSecondary: '#64748B',
    headerBg: '#DBEAFF',
    stickyColBg: '#F1F5F9',
    borderColor: '#E2E8F0',
    checkboxBorder: '#93C5FD',
    checkboxCheckColor: '#3B82F6',
    weekColors: ['#DBEAFF', '#FFD6E7', '#C7F9CC', '#FEF08A', '#E0E7FF'],
  });

  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Single Source of Truth for Habit Tracker Widget URL generation
  const widgetUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (selectedThemeId !== 'custom') {
      params.set('theme', selectedThemeId);
    } else {
      params.set('theme', 'custom');
      params.set('bgApp', colors.bgApp.replace(/^#/, ''));
      params.set('bgCard', colors.bgCard.replace(/^#/, ''));
      params.set('textPrimary', colors.textPrimary.replace(/^#/, ''));
      params.set('textSecondary', colors.textSecondary.replace(/^#/, ''));
      params.set('headerBg', colors.headerBg.replace(/^#/, ''));
      params.set('stickyColBg', colors.stickyColBg.replace(/^#/, ''));
      params.set('borderColor', colors.borderColor.replace(/^#/, ''));
      params.set('checkboxBorder', colors.checkboxBorder.replace(/^#/, ''));
      params.set('checkboxCheckColor', colors.checkboxCheckColor.replace(/^#/, ''));
      if (colors.weekColors && colors.weekColors.length > 0) {
        params.set('weekColors', colors.weekColors.map((c) => c.replace(/^#/, '')).join(','));
      }
    }

    const origin = window.location.origin;
    let pathname = window.location.pathname.replace(/\/customize\/?$/, '');
    if (!pathname.endsWith('/')) {
      pathname += '/';
    }

    return `${origin}${pathname}?${params.toString()}`;
  }, [colors, selectedThemeId]);

  const handleSelectTheme = (theme: HabitThemePreset) => {
    setSelectedThemeId(theme.id);
    setColors({ ...theme.colors });
  };

  const handleColorChange = (key: keyof typeof colors, value: any) => {
    setColors((prev) => ({
      ...prev,
      [key]: typeof value === 'string' ? value.toUpperCase() : value,
    }));
    setSelectedThemeId('custom');
  };

  const handleWeekColorChange = (index: number, hex: string) => {
    setColors((prev) => {
      const nextWeekColors = [...prev.weekColors];
      nextWeekColors[index] = hex.toUpperCase();
      return {
        ...prev,
        weekColors: nextWeekColors,
      };
    });
    setSelectedThemeId('custom');
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(widgetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const currentPresetList = activeTab === 'light' ? HABIT_LIGHT_THEMES : HABIT_DARK_THEMES;

  return (
    <div className="customize-page-root">
      <div className="customize-container">

        {/* Generator Main Layout: 2 Columns */}
        <div className="generator-grid">
          {/* Column 1: Customization Panel */}
          <div className="panel-col">
            <div className="card-panel">
              <div className="panel-header">
                <div className="panel-title-wrap">
                  <Sliders className="icon-purple" size={18} />
                  <h2>Customization Panel</h2>
                </div>
                <span className="badge-mono">Real-time preview</span>
              </div>

              {/* 1. Theme Presets (Light & Dark Tabs) */}
              <div className="section-group">
                <div className="section-top-row">
                  <label className="section-title">
                    <Palette size={14} /> Presets & Themes
                  </label>

                  <div className="tabs-pill">
                    <button
                      type="button"
                      onClick={() => setActiveTab('light')}
                      className={`tab-btn ${activeTab === 'light' ? 'active' : ''}`}
                    >
                      <Sun size={14} />
                      <span>Pastel & Light</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('dark')}
                      className={`tab-btn ${activeTab === 'dark' ? 'active' : ''}`}
                    >
                      <Moon size={14} />
                      <span>Dark Aesthetic</span>
                    </button>
                  </div>
                </div>

                {/* Swatches Grid */}
                <div className="swatches-grid">
                  {currentPresetList.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleSelectTheme(theme)}
                        className={`swatch-btn ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="swatch-dots">
                          <span
                            className="dot"
                            style={{ backgroundColor: theme.colors.bgApp }}
                          />
                          <span
                            className="dot"
                            style={{ backgroundColor: theme.colors.headerBg }}
                          />
                          <span
                            className="dot"
                            style={{ backgroundColor: theme.colors.checkboxCheckColor }}
                          />
                        </div>
                        <span className="swatch-name">{theme.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Color Controls */}
              <div className="section-group pt-divider">
                <label className="section-title justify-between">
                  <span className="flex-center">
                    <Paintbrush size={14} /> Complete Color Palette
                  </span>
                  {selectedThemeId === 'custom' && (
                    <span className="badge-custom">Custom Theme Active</span>
                  )}
                </label>

                <div className="colors-grid">
                  {/* App Background */}
                  <div className="color-item">
                    <div className="color-left">
                      <label className="color-swatch-picker">
                        <input
                          type="color"
                          value={colors.bgApp}
                          onChange={(e) => handleColorChange('bgApp', e.target.value)}
                        />
                        <span className="swatch-box" style={{ backgroundColor: colors.bgApp }} />
                      </label>
                      <div>
                        <p className="color-label">App Background</p>
                        <p className="color-key">`bgApp`</p>
                      </div>
                    </div>
                    <span className="color-hex-tag">{colors.bgApp}</span>
                  </div>

                  {/* Card Background */}
                  <div className="color-item">
                    <div className="color-left">
                      <label className="color-swatch-picker">
                        <input
                          type="color"
                          value={colors.bgCard}
                          onChange={(e) => handleColorChange('bgCard', e.target.value)}
                        />
                        <span className="swatch-box" style={{ backgroundColor: colors.bgCard }} />
                      </label>
                      <div>
                        <p className="color-label">Card Surface</p>
                        <p className="color-key">`bgCard`</p>
                      </div>
                    </div>
                    <span className="color-hex-tag">{colors.bgCard}</span>
                  </div>

                  {/* Header Background */}
                  <div className="color-item">
                    <div className="color-left">
                      <label className="color-swatch-picker">
                        <input
                          type="color"
                          value={colors.headerBg}
                          onChange={(e) => handleColorChange('headerBg', e.target.value)}
                        />
                        <span className="swatch-box" style={{ backgroundColor: colors.headerBg }} />
                      </label>
                      <div>
                        <p className="color-label">Header Bar</p>
                        <p className="color-key">`headerBg`</p>
                      </div>
                    </div>
                    <span className="color-hex-tag">{colors.headerBg}</span>
                  </div>

                  {/* Sticky Column */}
                  <div className="color-item">
                    <div className="color-left">
                      <label className="color-swatch-picker">
                        <input
                          type="color"
                          value={colors.stickyColBg}
                          onChange={(e) => handleColorChange('stickyColBg', e.target.value)}
                        />
                        <span className="swatch-box" style={{ backgroundColor: colors.stickyColBg }} />
                      </label>
                      <div>
                        <p className="color-label">Sticky Column</p>
                        <p className="color-key">`stickyColBg`</p>
                      </div>
                    </div>
                    <span className="color-hex-tag">{colors.stickyColBg}</span>
                  </div>

                  {/* Primary Text */}
                  <div className="color-item">
                    <div className="color-left">
                      <label className="color-swatch-picker">
                        <input
                          type="color"
                          value={colors.textPrimary}
                          onChange={(e) => handleColorChange('textPrimary', e.target.value)}
                        />
                        <span className="swatch-box" style={{ backgroundColor: colors.textPrimary }} />
                      </label>
                      <div>
                        <p className="color-label">Primary Text</p>
                        <p className="color-key">`textPrimary`</p>
                      </div>
                    </div>
                    <span className="color-hex-tag">{colors.textPrimary}</span>
                  </div>

                  {/* Secondary Text */}
                  <div className="color-item">
                    <div className="color-left">
                      <label className="color-swatch-picker">
                        <input
                          type="color"
                          value={colors.textSecondary}
                          onChange={(e) => handleColorChange('textSecondary', e.target.value)}
                        />
                        <span className="swatch-box" style={{ backgroundColor: colors.textSecondary }} />
                      </label>
                      <div>
                        <p className="color-label">Secondary Text</p>
                        <p className="color-key">`textSecondary`</p>
                      </div>
                    </div>
                    <span className="color-hex-tag">{colors.textSecondary}</span>
                  </div>

                  {/* Checkbox Border */}
                  <div className="color-item">
                    <div className="color-left">
                      <label className="color-swatch-picker">
                        <input
                          type="color"
                          value={colors.checkboxBorder}
                          onChange={(e) => handleColorChange('checkboxBorder', e.target.value)}
                        />
                        <span className="swatch-box" style={{ backgroundColor: colors.checkboxBorder }} />
                      </label>
                      <div>
                        <p className="color-label">Checkbox Border</p>
                        <p className="color-key">`checkboxBorder`</p>
                      </div>
                    </div>
                    <span className="color-hex-tag">{colors.checkboxBorder}</span>
                  </div>

                  {/* Checkbox Accent */}
                  <div className="color-item">
                    <div className="color-left">
                      <label className="color-swatch-picker">
                        <input
                          type="color"
                          value={colors.checkboxCheckColor}
                          onChange={(e) => handleColorChange('checkboxCheckColor', e.target.value)}
                        />
                        <span className="swatch-box" style={{ backgroundColor: colors.checkboxCheckColor }} />
                      </label>
                      <div>
                        <p className="color-label">Checked Accent</p>
                        <p className="color-key">`checkboxCheckColor`</p>
                      </div>
                    </div>
                    <span className="color-hex-tag">{colors.checkboxCheckColor}</span>
                  </div>
                </div>

                {/* Week Column Header Colors */}
                <div className="week-colors-card pt-2">
                  <div className="week-title-row">
                    <p className="flex-center font-bold text-xs">
                      <Layers size={14} /> Week Header Colors (5 Weeks)
                    </p>
                    <span className="color-key">`weekColors`</span>
                  </div>

                  <div className="week-grid">
                    {colors.weekColors.map((hex, index) => (
                      <div key={index} className="week-item">
                        <label className="color-swatch-picker">
                          <input
                            type="color"
                            value={hex}
                            onChange={(e) => handleWeekColorChange(index, e.target.value)}
                          />
                          <span className="swatch-box-sm" style={{ backgroundColor: hex }} />
                        </label>
                        <span className="week-tag">W{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Primary Action & Generated URL Display */}
              <div className="url-section">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="btn-copy-url"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-emerald" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy Widget URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Live Preview & Notion Instructions */}
          <div className="preview-col">
            <div className="preview-card">
              <div className="notion-window-header">
                <div className="window-dots-wrap">
                  <div className="dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  <span className="window-title">
                    <AppWindow size={14} /> Notion Page Preview
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIframeKey((prev) => prev + 1)}
                  className="btn-reload-iframe"
                  title="Reload preview"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              <div className="iframe-stage">
                <div className="iframe-wrapper">
                  <iframe
                    key={iframeKey}
                    src={widgetUrl}
                    title="Live Habit Tracker Widget Preview"
                    className="preview-iframe"
                    loading="eager"
                  />
                </div>
              </div>
            </div>

              {/* Notion Step-by-Step Instructions */}
              <div className="instructions-card">
                <div className="instructions-header">
                  <HelpCircle className="instructions-icon" size={16} />
                  <h3>Add to Notion</h3>
                </div>

                <ol className="steps-grid">
                  {HABIT_NOTION_EMBED_STEPS.map((s) => (
                    <li key={s.step} className={`step-item ${s.bgClass || ''}`}>
                      <span className="step-num">{s.step}</span>
                      <span className="step-text">
                        {s.prefixText}
                        {s.boldText && <strong>{s.boldText}</strong>}
                        {s.code && <code>{s.code}</code>}
                        {s.suffixText}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;
