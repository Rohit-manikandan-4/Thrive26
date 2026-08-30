import { motion } from 'framer-motion';

export default function StatCounter({ value, label, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="glass rounded-3xl px-4 py-8 text-center"
    >
      <div className="text-3xl font-extrabold text-uplift-700 sm:text-4xl">{value}</div>
      <div className="mt-1 text-sm font-medium text-slate-500">{label}</div>
    </motion.div>
  );
}
