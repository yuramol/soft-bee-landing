module.exports = {
  darkMode: ['class'],
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}', './src/lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        outline: 'var(--outline)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: {
          DEFAULT: 'var(--background)',
          inverse: 'var(--background-inverse)'
        },
        surface: 'var(--surface)',
        foreground: {
          DEFAULT: 'var(--foreground)',
          secondary: 'var(--foreground-secondary)'
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          light: 'var(--primary-light)',
          hover: 'var(--primary-hover)'
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)'
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)'
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
          dark: 'var(--accent-dark)'
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)'
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)'
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)'
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)'
        },
        info: {
          DEFAULT: 'var(--info)',
          foreground: 'var(--info-foreground)'
        },
        const: {
          white: 'var(--const-white)',
          emerald: 'var(--const-emerald)',
          'emerald-foreground': 'var(--const-emerald-foreground)'
        },
        'electric-green': 'var(--electric-green)',
        'lime-glow': 'var(--lime-glow)',
        'digital-cyan': 'var(--digital-cyan)',
        'deep-teal': 'var(--deep-teal)',
        'graphite-gray': 'var(--graphite-gray)',
        'mist-gray': 'var(--mist-gray)',
        'brand-black': 'var(--brand-black)',
        'brand-white': 'var(--brand-white)',
        border: 'var(--border)'
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)'
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        inner: 'var(--shadow-skeumorphic-inner)',
        'inner-border': 'var(--shadow-skeumorphic-inner-border)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(100px, -120px) scale(1.15)' },
          '66%': { transform: 'translate(-100px, 100px) scale(0.85)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gradient-shift': 'gradient-shift 15s ease infinite',
        blob: 'blob 10s infinite ease-in-out'
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/container-queries')]
};
