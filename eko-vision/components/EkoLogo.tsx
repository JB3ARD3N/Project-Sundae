'use client';

export default function EkoLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" stroke="url(#gradient)" strokeWidth="2" className="animate-pulse-slow" />
      <ellipse cx="50" cy="50" rx="30" ry="20" fill="currentColor" className="text-eko-cyan" opacity="0.3" />
      <circle cx="50" cy="50" r="10" fill="currentColor" className="text-eko-purple" />
      <circle cx="50" cy="50" r="3" fill="currentColor" className="text-white bioluminescent-glow" />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F5FF" />
          <stop offset="100%" stopColor="#8B00FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
