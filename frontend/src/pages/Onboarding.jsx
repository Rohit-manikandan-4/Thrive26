import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const STEP1_OPTIONS = ['education', 'job', 'skill', 'government', 'financial', 'internship'];
const STEP2_OPTIONS = ['below10', 'tenth', 'twelfth', 'diploma', 'undergraduate', 'graduate'];
const STEP3_OPTIONS = ['technology', 'business', 'agriculture', 'healthcare', 'design', 'government_jobs', 'skilled_trades', 'other'];

export default function Onboarding() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ lookingFor: '', education: '', interest: '', state: '', city: '' });
  const [loading, setLoading] = useState(false);
  const totalSteps = 4;

  function updateProfile(patch) {
    setProfile((p) => ({ ...p, ...patch }));
  }

  function canProceed() {
    if (step === 1) return !!profile.lookingFor;
    if (step === 2) return !!profile.education;
    if (step === 3) return !!profile.interest;
    if (step === 4) return !!profile.state;
    return false;
  }

  function handleFinish() {
    setLoading(true);
    setTimeout(() => {
      const params = new URLSearchParams({
        lookingFor: profile.lookingFor,
        education: profile.education,
        interest: profile.interest,
        state: profile.state,
        city: profile.city,
        personalized: '1',
      });
      navigate(`/opportunities?${params.toString()}`);
    }, 1200);
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-uplift-500/10 text-uplift-400"
        >
          <Sparkles size={28} />
        </motion.div>
        <p className="text-lg font-semibold text-slate-300">{t('onboarding.loading')}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <p className="text-sm font-semibold text-uplift-400">
          {t('onboarding.stepLabel', { current: step, total: totalSteps })}
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-uplift-600"
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="glass rounded-3xl p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <OptionStep
                title={t('onboarding.step1.title')}
                options={STEP1_OPTIONS}
                labelFor={(o) => t(`onboarding.step1.options.${o}`)}
                selected={profile.lookingFor}
                onSelect={(v) => updateProfile({ lookingFor: v })}
              />
            )}
            {step === 2 && (
              <OptionStep
                title={t('onboarding.step2.title')}
                options={STEP2_OPTIONS}
                labelFor={(o) => t(`onboarding.step2.options.${o}`)}
                selected={profile.education}
                onSelect={(v) => updateProfile({ education: v })}
              />
            )}
            {step === 3 && (
              <OptionStep
                title={t('onboarding.step3.title')}
                options={STEP3_OPTIONS}
                labelFor={(o) => t(`onboarding.step3.options.${o}`)}
                selected={profile.interest}
                onSelect={(v) => updateProfile({ interest: v })}
              />
            )}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold text-white">{t('onboarding.step4.title')}</h2>
                <div className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="state" className="mb-1.5 block text-sm font-semibold text-slate-400">
                      {t('onboarding.step4.state')}
                    </label>
                    <input
                      id="state"
                      type="text"
                      value={profile.state}
                      onChange={(e) => updateProfile({ state: e.target.value })}
                      placeholder={t('onboarding.step4.statePlaceholder')}
                      className="focus-ring w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="mb-1.5 block text-sm font-semibold text-slate-400">
                      {t('onboarding.step4.city')}
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={profile.city}
                      onChange={(e) => updateProfile({ city: e.target.value })}
                      placeholder={t('onboarding.step4.cityPlaceholder')}
                      className="focus-ring w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="focus-ring flex items-center gap-1 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-300 disabled:opacity-30"
          >
            <ChevronLeft size={16} /> {t('onboarding.back')}
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
              disabled={!canProceed()}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('onboarding.next')} <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={!canProceed()}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('onboarding.finish')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function OptionStep({ title, options, labelFor, selected, onSelect }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            aria-pressed={selected === opt}
            className={`focus-ring rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition ${
              selected === opt
                ? 'border-uplift-500 bg-uplift-500/10 text-uplift-300'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-uplift-400/40'
            }`}
          >
            {labelFor(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}
