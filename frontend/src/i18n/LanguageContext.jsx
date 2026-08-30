import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { LANGUAGES, t as translate } from './translations.js';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'upliftai_language';

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES.some((l) => l.code === stored)) return stored;
  } catch {
    /* ignore */
  }
  return 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = useCallback((code) => {
    setLanguageState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((path, vars) => translate(language, path, vars), [language]);

  const value = useMemo(
    () => ({ language, setLanguage, languages: LANGUAGES, t }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
