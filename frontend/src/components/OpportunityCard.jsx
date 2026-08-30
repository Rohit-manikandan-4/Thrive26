import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, CalendarClock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';

function matchColor(score) {
  if (score >= 80) return 'bg-uplift-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-slate-400';
}

export default function OpportunityCard({ opportunity, index = 0 }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      className="glass flex h-full flex-col rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-glass-lg"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <span className="rounded-full border border-uplift-400/30 bg-uplift-500/10 px-3 py-1 text-xs font-semibold text-uplift-300">
          {t(`categories.${opportunity.category}`)}
        </span>
        {typeof opportunity.match === 'number' && (
          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white ${matchColor(
              opportunity.match
            )}`}
          >
            {opportunity.match}% {t('results.match')}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-white">{opportunity.title}</h3>

      <ul className="mt-2 space-y-1">
        {opportunity.eligibility.slice(0, 3).map((e) => (
          <li key={e} className="flex items-start gap-1.5 text-sm text-slate-400">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-uplift-400" />
            <span>{e}</span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-sm text-slate-400">
        <span className="font-semibold text-slate-300">{t('results.benefit')}:</span> {opportunity.benefits}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin size={13} /> {opportunity.location.city}, {opportunity.location.state}
        </span>
        <span className="flex items-center gap-1">
          <CalendarClock size={13} /> {opportunity.deadline}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {opportunity.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-400">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300">
          {t('results.demoLabel')}
        </span>
        <button
          type="button"
          onClick={() => navigate(`/opportunities/${opportunity.id}`)}
          className="focus-ring rounded-full bg-uplift-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-uplift-700"
        >
          {t('results.viewDetails')}
        </button>
      </div>
    </motion.article>
  );
}
