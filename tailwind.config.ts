import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './sanity/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 香董品牌色
        navy: '#0B2545',
        navyDark: '#081B33',
        gold: '#A37D2E',
        goldDark: '#7A5F1F',
        cream: '#FAF7F2',
        wood: '#3D2E1F',
        woodLight: '#5C4E3D',
        // 通道色（不可改、需符合品牌官方色）
        lineGreen: '#04A04A',
        fbBlue: '#1877F2',
      },
      fontFamily: {
        sans: [
          '"Noto Sans TC"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        serif: ['"Noto Serif TC"', 'Georgia', 'serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#3D2E1F',
            a: { color: '#0B2545', textDecoration: 'underline' },
            h1: { color: '#0B2545' },
            h2: { color: '#0B2545' },
            h3: { color: '#0B2545' },
            blockquote: {
              borderLeftColor: '#C9A961',
              color: '#0B2545',
              fontStyle: 'normal',
            },
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
