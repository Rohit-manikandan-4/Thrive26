import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, CalendarClock, FileText, ListChecks, Sparkles, ExternalLink } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { OPPORTUNITIES } from '../data/opportunities.js';
import { sendChatMessage } from '../services/chatService.js';

export default function OpportunityDetails() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [simplified, setSimplified] = useState(null);
  const [simplifying, setSimplifying] = useState(false);
  const [simplifyError, setSimplifyError] = useState(null);

  const opportunity = OPPORTUNITIES.find((o) => o.id === id);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, [id]);

  async function handleSimplify() {
    if (!opportunity) return;
    setSimplifying(true);
    setSimplifyError(null);
    try {
      const reply = await sendChatMessage({
        message: `Please rewrite the following opportunity description in very simple, easy-to-understand language:\n\n"${opportunity.description}"`,
        language,
        history: [],
        context: opportunity,
      });
      setSimplified(reply);
    } catch (err) {
      setSimplifyError(err.message || t('chat.error'));
    } finally {
      setSimplifying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-400">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-uplift-500/20 border-t-uplift-500" />
        {t('details.loading')}
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">{t('results.empty.title')}</h1>
        <Link to="/opportunities" className="btn-primary mt-6 inline-flex">
          {t('nav.opportunities')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="focus-ring mb-6 flex items-center gap-1.5 text-sm font-semibold text-uplift-400 hover:underline"
      >
        <ArrowLeft size={16} /> {t('common.close')}
      </button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="glass rounded-3xl p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-uplift-400/30 bg-uplift-500/10 px-3 py-1 text-xs font-semibold text-uplift-300">
            {t(`categories.${opportunity.category}`)}
          </span>
          <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300">
            {t('results.demoLabel')}
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{opportunity.title}</h1>

        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <MapPin size={15} /> {opportunity.location.city}, {opportunity.location.state}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarClock size={15} /> {t('results.deadline')}: {opportunity.deadline}
          </span>
        </div>

        <p className="mt-5 leading-relaxed text-slate-300">{simplified || opportunity.description}</p>

        <div className="mt-3">
          <button
            type="button"
            onClick={handleSimplify}
            disabled={simplifying}
            className="focus-ring flex items-center gap-1.5 text-sm font-semibold text-uplift-400 hover:underline disabled:opacity-50"
          >
            <Sparkles size={15} /> {simplifying ? t('details.simplifying') : t('details.simplify')}
          </button>
          {simplifyError && <p className="mt-2 text-sm text-red-400">{simplifyError}</p>}
        </div>

        <Section icon={ListChecks} title={t('details.eligibility')}>
          <ul className="space-y-1.5">
            {opportunity.eligibility.map((e) => (
              <li key={e} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-uplift-500" /> {e}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Sparkles} title={t('details.benefits')}>
          <p className="text-sm text-slate-400">{opportunity.benefits}</p>
        </Section>

        <Section icon={FileText} title={t('details.documents')}>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {opportunity.documents.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-uplift-500" /> {d}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={ListChecks} title={t('details.howToApply')}>
          <ol className="space-y-1.5">
            {t('details.steps').map((step, i) => (
              <li key={step} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-uplift-500/10 text-xs font-bold text-uplift-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Section>

        <p className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-xs text-amber-300">{t('details.demoNotice')}</p>

        <button
          type="button"
          disabled
          title={t('details.demoNotice')}
          className="btn-primary mt-6 w-full cursor-not-allowed opacity-60 sm:w-auto"
        >
          <ExternalLink size={16} /> {t('details.apply')}
        </button>
      </motion.div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="mt-6 border-t border-white/10 pt-6">
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-white">
        <Icon size={17} className="text-uplift-400" /> {title}
      </h2>
      {children}
    </div>
  );
}
