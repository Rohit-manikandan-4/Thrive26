import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Accessibility } from 'lucide-react';
import Logo from './Logo.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/opportunities', label: t('nav.opportunities') },
    { to: '/about', label: t('nav.about') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main navigation">
        <Link to="/" className="focus-ring flex items-center gap-2 rounded-lg" onClick={() => setOpen(false)}>
          <Logo />
          <span className="text-lg font-extrabold tracking-tight text-white">{t('brand')}</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `focus-ring rounded-md px-1 py-1 text-sm font-medium transition-colors ${
                  isActive ? 'text-uplift-400' : 'text-slate-400 hover:text-uplift-300'
                }`
              }
              end={l.to === '/'}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSelector />
          <a
            href="#accessibility-panel-trigger"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('accessibility-panel-trigger')?.click();
            }}
            className="focus-ring flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            <Accessibility size={16} />
            <span>{t('nav.accessibility')}</span>
          </a>
        </div>

        <button
          type="button"
          className="focus-ring rounded-md p-2 text-slate-200 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-md px-2 py-2 text-base font-medium text-slate-300 hover:bg-white/5"
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center justify-between">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
