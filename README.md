# Habit Tracker Notion Widget

A sleek, responsive, and minimalist **Monthly Habit Tracker Widget** built in **React**, specifically designed to be embedded into **Notion** workspaces, Craft docs, or standalone productivity dashboards.

![Habit Tracker Preview](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png) *(Modern Notion & Craft aesthetic)*

---

## ✨ Features

- 📅 **Dynamic Monthly Calendar**: Automatically detects current month and year based on your device time. Handles month day variations (30, 31, 28/29 for leap years) automatically.
- 📌 **Sticky Habit Column**: Keeps habit titles readable on mobile devices and narrow Notion columns while scrolling horizontally across the days of the month.
- ⚡ **100% Client-Side & LocalStorage**: Requires **NO backend, NO database, NO authentication, and NO APIs**. Every user's data remains 100% private in their own browser `localStorage`.
- 🎨 **Theme System**: Instant toggle between Notion Light, Notion Dark, and Warm Craft neutral themes.
- 📊 **Completion Analytics**: Live progress bar showing percentage completion and active days completed.
- 🔄 **Month Navigation**: Easily jump between past months, future months, or back to Today.
- 🔒 **Data Safety & Backup**: Includes JSON Export and Import capabilities to transfer habit data between devices or back up your Notion workspace.
- ♿ **Full Accessibility**: Keyboard navigable cells (`Space` / `Enter`), focus indicators, and screen reader ARIA labels.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🌐 Deploying to Vercel

1. Push this project repository to **GitHub**.
2. Go to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Keep the framework preset as **Vite**.
5. Click **Deploy**.
6. Copy your deployed Vercel URL (e.g. `https://your-habit-tracker.vercel.app`).

---

## 📝 Embedding into Notion

1. Open any page in **Notion**.
2. Type `/embed` and press `Enter`.
3. Paste your Vercel deployment URL into the link box.
4. Click **Embed link**.
5. Resize the embedded frame to your desired width and height!

---

## 📁 Project Architecture

```text
Habit-tracker/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Branding, theme toggle, backup dropdown
│   │   ├── MonthNavigation.tsx  # Month title & prev/today/next controls
│   │   ├── ProgressSummary.tsx  # Completion bar & metrics summary
│   │   ├── HabitGrid.tsx        # Spreadsheet matrix layout with sticky habit header
│   │   ├── HabitRow.tsx         # Habit row with inline options (rename/move/delete)
│   │   ├── HabitCell.tsx        # Interactive day cell with check animation
│   │   └── ExportImportModal.tsx# JSON backup import dialog
│   ├── hooks/
│   │   └── useHabitTracker.ts   # Core state logic, month rollover, statistics
│   ├── types/
│   │   └── habit.ts             # TypeScript interfaces
│   ├── utils/
│   │   ├── dateUtils.ts         # Calendar calculation helpers & leap year math
│   │   └── storage.ts           # Safe localStorage parser, defaults, fallback
│   ├── App.tsx                  # Main app layout
│   └── index.css                # Notion light/dark themes, sticky table styling
├── index.html                   # HTML entry point with Inter font & meta tags
├── package.json
└── vite.config.ts
```
