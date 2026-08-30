import { ShieldCheck, Globe2, Sparkles, HandCoins } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{t('brand')}</h1>
        <p className="mt-3 text-lg text-slate-400">{t('tagline')}</p>
      </div>

      <div className="glass mt-10 rounded-3xl p-8">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <Sparkles className="text-uplift-400" /> {t('impact.title')}
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {['economic', 'language', 'matching'].map((key) => (
            <div key={key} className="rounded-2xl bg-white/5 p-5">
              <h3 className="font-bold text-white">{t(`impact.cards.${key}.title`)}</h3>
              <p className="mt-1.5 text-sm text-slate-400">{t(`impact.cards.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass mt-8 rounded-3xl p-8">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <ShieldCheck className="text-uplift-400" /> {t('trust.title')}
        </h2>
        <ul className="mt-5 space-y-2.5">
          {t('trust.points').map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-slate-400">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-uplift-500" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass mt-8 flex items-center gap-4 rounded-3xl p-8">
        <Globe2 className="shrink-0 text-uplift-400" size={32} />
        <p className="text-sm text-slate-400">
          UpliftAI supports English, தமிழ், हिंदी, తెలుగు and ಕನ್ನಡ — so opportunity information reaches people in the
          language they are most comfortable with.
        </p>
      </div>

      <div className="glass mt-8 flex items-center gap-4 rounded-3xl p-8">
        <HandCoins className="shrink-0 text-uplift-400" size={32} />
        <p className="text-sm text-slate-400">
          This is a hackathon prototype built by <span className="font-semibold text-uplift-300">Team Axino</span>,
          using mock demo data to demonstrate a real product vision for inclusive opportunity discovery.
        </p>
      </div>
    </div>
  );
}
