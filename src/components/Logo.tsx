/** Original Veritas mascot: a round sprout-headed character. Not derived from any existing brand. */
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Veritas mascot logo" className="shrink-0">
      <circle cx="32" cy="36" r="24" fill="#15803d" />
      <circle cx="32" cy="40" r="15" fill="#dcfce7" />
      <circle cx="25" cy="34" r="5" fill="#fff" stroke="#0f1f17" strokeWidth="1.5" />
      <circle cx="39" cy="34" r="5" fill="#fff" stroke="#0f1f17" strokeWidth="1.5" />
      <circle cx="26" cy="35" r="2.2" fill="#0f1f17" />
      <circle cx="38" cy="35" r="2.2" fill="#0f1f17" />
      <path d="M26 44q6 6 12 0" fill="none" stroke="#0f1f17" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 13v-5" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 9c0-6-5-8-10-7 0 6 4 8 10 7Z" fill="#fcd34d" />
      <path d="M32 9c0-6 5-8 10-7 0 6-4 8-10 7Z" fill="#fbbf24" />
    </svg>
  );
}
