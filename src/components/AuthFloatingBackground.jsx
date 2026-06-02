const clothes = [
  { type: 'dress', color: '#31EC56', x: '6%', y: '12%', size: 84, rotate: -8, duration: 8, delay: -1 },
  { type: 'shirt', color: '#EF036C', x: '22%', y: '68%', size: 76, rotate: 12, duration: 9, delay: -4 },
  { type: 'pants', color: '#1E88E5', x: '74%', y: '10%', size: 88, rotate: 8, duration: 10, delay: -3 },
  { type: 'hanger', color: '#F7B801', x: '82%', y: '70%', size: 72, rotate: -14, duration: 7.5, delay: -2 },
  { type: 'skirt', color: '#8E44AD', x: '12%', y: '78%', size: 68, rotate: 16, duration: 8.5, delay: -5 },
  { type: 'shoe', color: '#00A896', x: '55%', y: '78%', size: 70, rotate: -10, duration: 9.5, delay: -1.5 },
  { type: 'shirt', color: '#FF6B35', x: '63%', y: '25%', size: 64, rotate: -18, duration: 8, delay: -6 },
  { type: 'dress', color: '#FFFFFF', x: '40%', y: '8%', size: 62, rotate: 7, duration: 11, delay: -2.5 },
  { type: 'pants', color: '#6E6E6E', x: '4%', y: '43%', size: 60, rotate: 20, duration: 10, delay: -7 },
  { type: 'skirt', color: '#00C2FF', x: '90%', y: '37%', size: 60, rotate: -6, duration: 8.8, delay: -3.5 }
]

function ClothingIcon({ type }) {
  if (type === 'dress') {
    return (
      <svg viewBox="0 0 64 64">
        <path d="M25 8h14l4 13-7 7 11 27H17l11-27-7-7 4-13Z" strokeWidth="3" strokeLinejoin="round" />
        <path d="M25 8c2 7 12 7 14 0" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'pants') {
    return (
      <svg viewBox="0 0 64 64">
        <path d="M21 8h22l3 48H34l-2-28-2 28H18l3-48Z" strokeWidth="3" strokeLinejoin="round" />
        <path d="M22 18h20" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'skirt') {
    return (
      <svg viewBox="0 0 64 64">
        <path d="M22 13h20l9 40H13l9-40Z" strokeWidth="3" strokeLinejoin="round" />
        <path d="M21 13h22M25 20l-4 29M39 20l4 29" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'shoe') {
    return (
      <svg viewBox="0 0 64 64">
        <path d="M13 39c10 1 18-4 24-15l7 15h8c4 0 7 3 7 7v5H9v-8c0-3 1-4 4-4Z" strokeWidth="3" strokeLinejoin="round" />
        <path d="M38 34h9" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'hanger') {
    return (
      <svg viewBox="0 0 64 64">
        <path d="M32 15c0-5 8-6 8 1 0 7-8 6-8 14" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M32 30 8 46c-3 2-1 7 3 7h42c4 0 6-5 3-7L32 30Z" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 64 64">
      <path d="M22 9 14 14 5 30l10 6 5-8v27h24V28l5 8 10-6-9-16-8-5-6 8h-8l-6-8Z" strokeWidth="3" strokeLinejoin="round" />
      <path d="M28 17h8" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function AuthFloatingBackground() {
  return (
    <>
      <style>
        {`
          .auth-floating-clothes {
            position: fixed;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
          }

          .auth-floating-piece {
            position: absolute;
            left: var(--x);
            top: var(--y);
            width: var(--size);
            height: var(--size);
            color: var(--color);
            opacity: 0.88;
            filter: drop-shadow(0 12px 18px rgba(70, 0, 38, 0.18));
            animation: authFloaty var(--duration) ease-in-out infinite;
            animation-delay: var(--delay);
            transform-origin: center;
          }

          .auth-floating-piece svg {
            width: 100%;
            height: 100%;
            display: block;
            fill: color-mix(in srgb, currentColor 30%, white);
            stroke: currentColor;
          }

          @keyframes authFloaty {
            0%, 100% {
              transform: translate3d(0, 0, 0) rotate(var(--rotate));
            }

            35% {
              transform: translate3d(18px, -30px, 0) rotate(calc(var(--rotate) + 8deg));
            }

            70% {
              transform: translate3d(-12px, 20px, 0) rotate(calc(var(--rotate) - 6deg));
            }
          }

          @media (max-width: 520px) {
            .auth-floating-piece {
              opacity: 0.66;
            }
          }
        `}
      </style>

      <div className="auth-floating-clothes" aria-hidden="true">
        {clothes.map((item, index) => (
          <div
            className="auth-floating-piece"
            key={`${item.type}-${index}`}
            style={{
              '--color': item.color,
              '--x': item.x,
              '--y': item.y,
              '--size': `${item.size}px`,
              '--rotate': `${item.rotate}deg`,
              '--duration': `${item.duration}s`,
              '--delay': `${item.delay}s`
            }}
          >
            <ClothingIcon type={item.type} />
          </div>
        ))}
      </div>
    </>
  )
}

export default AuthFloatingBackground
