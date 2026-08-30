import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AccessibilityContext = createContext(null);

const DEFAULTS = {
  fontScale: 1,
  highContrast: false,
  reduceMotion: false,
  readAloud: false,
};

const STORAGE_KEY = 'upliftai_accessibility';
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.5;
const STEP = 0.1;

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    root.style.fontSize = `${settings.fontScale * 100}%`;
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('reduce-motion', settings.reduceMotion);
  }, [settings]);

  const api = useMemo(
    () => ({
      settings,
      increaseText: () =>
        setSettings((s) => ({ ...s, fontScale: Math.min(MAX_SCALE, +(s.fontScale + STEP).toFixed(2)) })),
      decreaseText: () =>
        setSettings((s) => ({ ...s, fontScale: Math.max(MIN_SCALE, +(s.fontScale - STEP).toFixed(2)) })),
      toggleHighContrast: () => setSettings((s) => ({ ...s, highContrast: !s.highContrast })),
      toggleReduceMotion: () => setSettings((s) => ({ ...s, reduceMotion: !s.reduceMotion })),
      toggleReadAloud: () => setSettings((s) => ({ ...s, readAloud: !s.readAloud })),
      reset: () => setSettings(DEFAULTS),
    }),
    [settings]
  );

  return <AccessibilityContext.Provider value={api}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
