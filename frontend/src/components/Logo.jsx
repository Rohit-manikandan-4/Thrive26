export default function Logo({ className = 'h-9 w-9' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="UpliftAI logo"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="uplift-grad" x1="0" y1="48" x2="48" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1f7d5a" />
          <stop offset="1" stopColor="#4fb489" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#uplift-grad)" opacity="0.15" />
      <path
        d="M9 30L20 19L27 26L39 12"
        stroke="url(#uplift-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M30 12H39V21" stroke="url(#uplift-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="34" r="3.2" fill="#1f7d5a" />
    </svg>
  );
}
