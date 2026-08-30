import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Wrench,
  HandCoins,
  Landmark,
  Users,
  ShieldCheck,
  Globe2,
  Sparkles,
} from 'lucide-react';
import HeroScene from '../components/HeroScene.jsx';
import QuickAccessCard from '../components/QuickAccessCard.jsx';
import StatCounter from '../components/StatCounter.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const quickAccessItems = [
    { key: 'education', icon: GraduationCap, category: 'scholarship' },
    { key: 'jobs', icon: Briefcase, category: 'job' },
    { key: 'skills', icon: Wrench, category: 'skill' },
    { key: 'financial', icon: HandCoins, category: 'financial' },
    { key: 'government', icon: Landmark, category: 'government' },
    { key: 'internships', icon: Users, category: 'internship' },
  ];

  const impactCards = [
    { key: 'economic', icon: HandCoins },
    { key: 'language', icon: Globe2 },
    { key: 'matching', icon: Sparkles },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-uplift-100 px-4 py-1.5 text-sm font-semibold text-uplift-800">
            <Sparkles size={14} /> {t('tagline')}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            {t('hero.headline')}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">{t('hero.subheading')}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button type="button" onClick={() => navigate('/onboarding')} className="btn-primary">
              {t('hero.primaryCta')}
            </button>
            <button type="button" onClick={() => navigate('/opportunities')} className="btn-secondary">
              {t('hero.secondaryCta')}
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <HeroScene />
        </motion.div>
      </section>

      {/* QUICK ACCESS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">{t('quickAccess.title')}</h2>
          <p className="mt-2 text-slate-600">{t('quickAccess.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quickAccessItems.map((item, i) => (
            <QuickAccessCard
              key={item.key}
              icon={item.icon}
              title={t(`quickAccess.${item.key}.title`)}
              description={t(`quickAccess.${item.key}.desc`)}
              cta={t('quickAccess.cta')}
              category={item.category}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* IMPACT */}
      <section className="bg-uplift-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-extrabold">{t('impact.title')}</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {impactCards.map(({ key, icon: Icon }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="rounded-3xl bg-white/10 p-6 backdrop-blur"
              >
                <Icon size={28} className="text-uplift-200" />
                <h3 className="mt-4 text-lg font-bold">{t(`impact.cards.${key}.title`)}</h3>
                <p className="mt-1.5 text-sm text-uplift-100">{t(`impact.cards.${key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-wider text-amber-600">
          {t('stats.title')}
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {t('stats.items').map((s, i) => (
            <StatCounter key={s.label} value={s.value} label={s.label} index={i} />
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="glass rounded-3xl p-8">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
            <ShieldCheck className="text-uplift-600" /> {t('trust.title')}
          </h2>
          <ul className="mt-5 space-y-2.5">
            {t('trust.points').map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-uplift-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
