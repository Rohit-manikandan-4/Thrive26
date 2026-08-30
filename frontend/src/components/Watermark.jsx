export default function Watermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-2 right-3 z-40 select-none rounded-full bg-white/40 px-3 py-1 text-[10px] font-medium tracking-wide text-slate-500/70 backdrop-blur-sm sm:text-xs"
    >
      BY TEAM AXINO
    </div>
  );
}
