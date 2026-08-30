import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function LanguageSelector() {
  const { language, setLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = languages.find((l) => l.code === language);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className="focus-ring flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 backdrop-blur transition hover:bg-white/10"
      >
        <Globe size={16} />
        <span>{current?.native}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="glass-strong absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl py-1"
        >
          {languages.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === language}
                onClick={() => {
                  setLanguage(l.code);
                  setOpen(false);
                }}
                className="focus-ring flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/10"
              >
                <span>
                  {l.native} {l.code !== 'en' && <span className="text-xs text-slate-500">({l.label})</span>}
                </span>
                {l.code === language && <Check size={15} className="text-uplift-400" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
