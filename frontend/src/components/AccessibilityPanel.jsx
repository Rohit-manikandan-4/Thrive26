import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Accessibility, X, Plus, Minus, Contrast, Waves, Volume2, Keyboard, RotateCcw } from 'lucide-react';
import { useAccessibility } from '../hooks/useAccessibility.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function AccessibilityPanel() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const {
    settings,
    increaseText,
    decreaseText,
    toggleHighContrast,
    toggleReduceMotion,
    toggleReadAloud,
    reset,
  } = useAccessibility();

  return (
    <>
      <button
        id="accessibility-panel-trigger"
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="focus-ring fixed bottom-24 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white text-uplift-700 shadow-glass-lg transition hover:scale-105 sm:bottom-6"
        aria-label={t('accessibility.title')}
      >
        <Accessibility size={26} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={t('accessibility.title')}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-md rounded-t-3xl p-6 sm:rounded-3xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">{t('accessibility.title')}</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="focus-ring rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
                  aria-label={t('accessibility.close')}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white/70 p-3">
                  <span className="text-sm font-medium">{t('accessibility.increaseText')} / {t('accessibility.decreaseText')}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={decreaseText}
                      aria-label={t('accessibility.decreaseText')}
                      className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-uplift-200 hover:bg-uplift-50"
                    >
                      <Minus size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={increaseText}
                      aria-label={t('accessibility.increaseText')}
                      className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-uplift-200 hover:bg-uplift-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <ToggleRow
                  icon={<Contrast size={18} />}
                  label={t('accessibility.highContrast')}
                  checked={settings.highContrast}
                  onChange={toggleHighContrast}
                />
                <ToggleRow
                  icon={<Waves size={18} />}
                  label={t('accessibility.reduceMotion')}
                  checked={settings.reduceMotion}
                  onChange={toggleReduceMotion}
                />
                <ToggleRow
                  icon={<Volume2 size={18} />}
                  label={t('accessibility.readAloud')}
                  checked={settings.readAloud}
                  onChange={toggleReadAloud}
                />

                <div className="flex items-center gap-2 rounded-2xl bg-white/70 p-3 text-sm text-slate-600">
                  <Keyboard size={18} className="shrink-0" />
                  <span>{t('accessibility.keyboardNav')}: Tab / Shift+Tab / Enter / Space</span>
                </div>

                <button
                  type="button"
                  onClick={reset}
                  className="focus-ring flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <RotateCcw size={16} />
                  {t('accessibility.reset')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ToggleRow({ icon, label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/70 p-3">
      <span className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`focus-ring relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-uplift-600' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
