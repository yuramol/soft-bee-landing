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
        outline: 'hsl(var(--outline))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        foreground: {
          DEFAULT: 'hsl(var(--foreground))',
          secondary: 'hsl(var(--foreground-secondary))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          light: 'hsl(var(--primary-light))',
          hover: 'hsl(var(--primary-hover))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))'
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))'
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))'
        },
        const: {
          white: 'hsl(var(--const-white))',
          emerald: 'hsl(var(--const-emerald))',
          'emerald-foreground': 'hsl(var(--const-emerald-foreground))'
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
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      fontSize: {
        96: ['var(--fs-96)', '1.17'],
        80: ['var(--fs-80)', '1.17'],
        70: ['var(--fs-70)', '1.17'],
        48: ['var(--fs-48)', '1.24'],
        32: ['var(--fs-32)', '1.24'],
        28: ['var(--fs-28)', '1.24'],
        24: ['var(--fs-24)', '1.37'],
        20: ['var(--fs-20)', '1.37'],
        18: ['var(--fs-18)', '1.37'],
        16: ['var(--fs-16)', '1.10']
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/container-queries')]
};
