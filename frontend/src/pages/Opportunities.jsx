import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import OpportunityCard from '../components/OpportunityCard.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { OPPORTUNITIES, CATEGORY_KEYS, EDUCATION_KEYS } from '../data/opportunities.js';
import { getMatchedOpportunities, searchOpportunities, applyFilters } from '../services/matching.js';

const LOCATIONS = ['Tamil Nadu', 'Karnataka', 'Telangana', 'Maharashtra', 'Uttar Pradesh', 'Bihar', 'Punjab', 'Gujarat', 'Kerala', 'All India'];

export default function Opportunities() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const isPersonalized = searchParams.get('personalized') === '1';
  const initialCategory = searchParams.get('category') || 'all';

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [filters, setFilters] = useState({
    category: initialCategory,
    education: 'all',
    location: 'all',
  });

  const profile = useMemo(() => {
    if (!isPersonalized) return null;
    return {
      lookingFor: searchParams.get('lookingFor') || '',
      education: searchParams.get('education') || '',
      interest: searchParams.get('interest') || '',
      state: searchParams.get('state') || '',
      city: searchParams.get('city') || '',
    };
  }, [isPersonalized, searchParams]);

  const [loadingPersonalized, setLoadingPersonalized] = useState(isPersonalized);
  useEffect(() => {
    if (isPersonalized) {
      setLoadingPersonalized(true);
      const timer = setTimeout(() => setLoadingPersonalized(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isPersonalized]);

  const baseList = useMemo(() => {
    if (profile) return getMatchedOpportunities(profile);
    if (query.trim()) return searchOpportunities(query);
    return OPPORTUNITIES;
  }, [profile, query]);

  const filteredList = useMemo(() => applyFilters(baseList, filters), [baseList, filters]);

  function handleClearFilters() {
    setFilters({ category: 'all', education: 'all', location: 'all' });
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearching(true);
    setSearchParams({});
    setTimeout(() => setSearching(false), 350);
  }

  const showEmpty = filteredList.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          {profile ? t('results.title') : t('nav.opportunities')}
        </h1>
        <p className="mt-2 text-slate-600">{profile ? t('results.subtitle') : t('search.placeholder')}</p>
      </div>

      {!profile && (
        <form onSubmit={handleSearchSubmit} className="mx-auto mb-6 max-w-2xl">
          <div className="glass flex items-center gap-2 rounded-full p-2">
            <Search className="ml-2 shrink-0 text-slate-400" size={20} />
            <label htmlFor="opp-search" className="sr-only">
              {t('search.placeholder')}
            </label>
            <input
              id="opp-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="focus-ring rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                <X size={16} />
              </button>
            )}
            <button type="submit" className="focus-ring shrink-0 rounded-full bg-uplift-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-uplift-700">
              {t('search.button')}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {t('search.examples').map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setQuery(ex)}
                className="focus-ring rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs text-slate-500 hover:border-uplift-300 hover:text-uplift-700"
              >
                {ex}
              </button>
            ))}
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="glass mb-8 flex flex-wrap items-center gap-3 rounded-3xl p-4">
        <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
          <SlidersHorizontal size={16} /> {t('filters.title')}
        </span>
        <FilterSelect
          label={t('filters.category')}
          value={filters.category}
          onChange={(v) => setFilters((f) => ({ ...f, category: v }))}
          options={[{ value: 'all', label: t('filters.all') }, ...CATEGORY_KEYS.map((c) => ({ value: c, label: t(`categories.${c}`) }))]}
        />
        <FilterSelect
          label={t('filters.education')}
          value={filters.education}
          onChange={(v) => setFilters((f) => ({ ...f, education: v }))}
          options={[
            { value: 'all', label: t('filters.all') },
            ...EDUCATION_KEYS.map((e) => ({ value: e, label: t(`onboarding.step2.options.${e}`) })),
          ]}
        />
        <FilterSelect
          label={t('filters.location')}
          value={filters.location}
          onChange={(v) => setFilters((f) => ({ ...f, location: v }))}
          options={[{ value: 'all', label: t('filters.all') }, ...LOCATIONS.map((l) => ({ value: l, label: l }))]}
        />
        <button
          type="button"
          onClick={handleClearFilters}
          className="focus-ring ml-auto rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          {t('filters.clear')}
        </button>
      </div>

      {(loadingPersonalized || searching) && (
        <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-uplift-200 border-t-uplift-600" />
          {t(profile ? 'onboarding.loading' : 'search.loading')}
        </div>
      )}

      {!loadingPersonalized && !searching && (
        <>
          {showEmpty ? (
            <EmptyState onClearFilters={handleClearFilters} />
          ) : (
            <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredList.map((opp, i) => (
                <OpportunityCard key={opp.id} opportunity={opp} index={i} />
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function EmptyState({ onClearFilters }) {
  const { t } = useLanguage();
  return (
    <div className="glass mx-auto max-w-xl rounded-3xl p-10 text-center">
      <h3 className="text-xl font-bold text-slate-800">{t('results.empty.title')}</h3>
      <p className="mt-2 text-sm text-slate-600">{t('results.empty.subtitle')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onClearFilters} className="btn-secondary">
          {t('results.empty.removeFilter')}
        </button>
        <button
          type="button"
          onClick={() => document.getElementById('chat-widget-trigger')?.click()}
          className="btn-primary"
        >
          <Sparkles size={16} /> {t('results.empty.askAI')}
        </button>
      </div>
    </div>
  );
}
