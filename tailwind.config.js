/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ig: {
          pink: '#DD2A7B',
          indigo: '#4B0AEA',
          graytrack: '#EAEAEA',
          cardbg: '#F2F2F4',
          pillbg: '#F0F0F0',
          textgray: '#8E8E8E',
          textdark: '#111111',
          border: '#EFEFEF',
        },
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        'inter-extrabold': ['Inter_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
