import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Footer() {
  const { t } = useLanguage();

  const links = [
    { to: '/', label: t('footer.links.home') },
    { to: '/opportunities', label: t('footer.links.opportunities') },
    { to: '/about', label: t('footer.links.about') },
  ];

  return (
    <footer className="border-t border-white/40 bg-white/60 pb-10 pt-10 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-lg font-extrabold text-uplift-800">{t('brand')}</span>
            </div>
            <p className="mt-2 max-w-xs text-sm text-slate-500">{t('footer.tagline')}</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="focus-ring rounded text-sm font-medium text-slate-600 hover:text-uplift-700">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/60 pt-6 text-xs text-slate-500 sm:flex-row">
          <span>{t('footer.copyright')}</span>
          <span className="font-semibold tracking-wide text-uplift-700">{t('footer.team')}</span>
        </div>
      </div>
    </footer>
  );
}
