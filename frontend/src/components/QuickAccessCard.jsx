import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function QuickAccessCard({ icon: Icon, title, description, cta, category, index = 0 }) {
  const navigate = useNavigate();

  function go() {
    navigate(`/opportunities?category=${category}`);
  }

  return (
    <motion.button
      type="button"
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') go();
      }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.3) }}
      className="focus-ring glass group flex flex-col items-start rounded-3xl p-6 text-left transition hover:-translate-y-1.5 hover:shadow-glass-lg"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-uplift-500/10 text-uplift-300 transition group-hover:bg-uplift-600 group-hover:text-white">
        <Icon size={24} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-400">{description}</p>
      <span className="mt-4 text-sm font-semibold text-uplift-400 group-hover:underline">{cta} →</span>
    </motion.button>
  );
}
