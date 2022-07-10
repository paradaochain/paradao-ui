// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.truncate-3-lines': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          'line-clamp': '3',
          '-webkit-box-orient': 'vertical'
        }
      });
    })
  ]
};
