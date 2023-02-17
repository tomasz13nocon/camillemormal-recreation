/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      transitionTimingFunction: {
        'out-cubic': 'cubic-bezier(0.33, 1, 0.68, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-circ': 'cubic-bezier(0, 0.55, 0.45, 1)',
        // 'out-smooth': 'cubic-bezier(.1,1.09,.50,.99)',
        'out-smooth': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [
  ],
}
