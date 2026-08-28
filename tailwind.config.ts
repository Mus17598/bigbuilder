import type { Config } from 'tailwindcss';

/**
 * Tailwind is a layout/spacing tool here, not a colour system.
 * Every colour resolves to a var() defined in styles/tokens.css so that file
 * stays the single source of truth. Consequence: opacity shorthands like
 * `bg-ink-900/50` will NOT work — use the explicit alpha tokens instead
 * (--scrim-strong, --scrim-nav, --brand-glow ...).
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ink-900': 'var(--ink-900)',
        'ink-800': 'var(--ink-800)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        line: 'var(--line)',
        'text-hi': 'var(--text-hi)',
        'text-mid': 'var(--text-mid)',
        'text-low': 'var(--text-low)',
        brand: 'var(--brand)',
        'brand-soft': 'var(--brand-soft)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        display: 'var(--ff-display)',
        body: 'var(--ff-body)',
        mono: 'var(--ff-mono)',
      },
      maxWidth: { shell: 'var(--max-w)', measure: 'var(--measure)' },
      transitionTimingFunction: {
        expo: 'var(--ease-expo)',
        power: 'var(--ease-power)',
      },
    },
  },
  plugins: [],
};

export default config;
