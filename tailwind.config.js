/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // this is used as heavy weight font
        'teko': ['Teko'],
        // main is font_name we are calling and 'Public Sans' is font family which is used all over application
        'main': ['Public Sans'],
        // for new font, you need to import it in index.css from G.F -> put font family below
        'replace_by_main_and_see_the_magic': ['Barlow']
      },
      colors: {
        // header, footer
        // 'header-background': '#364253',
        // 'footer-background': '#2B3445',

        // buttons 
        // 'buttons': "#A6E66E",
        // 'buttons-color': "#000",

        // text color
        'primary-color': '#fff',
        'secondary-color': '#000',
        // using amber color as tertiary color from tailwindcss
        'tertiary-800': '#92400e',
        'tertiary-700': '#b45309',
        'tertiary-600': '#d97706',
        'tertiary-500': '#f59e0b',
        'tertiary-300': '#fcd34d',
        'tertiary-200': '#fde68a',
        'tertiary-100': '#fef3c7',
        // gray color
        'gray-white': '#7D879C',
        'gray-dark': '#4B566B',

        // category and motivation
        "primary-category": '#FAF8F5',
        "primary-motivation": '#fff',

        // new v1 skinning
        'header-background': '#242424',
        'footer-background': '#242424',

        'buttons': "#E4BE62",
        'buttons-hover': "#CAAC81",
        'buttons-color': "#000",


      }
    }
  },
  plugins: [
    // require('@tailwindcss/forms'),
  ],
}

