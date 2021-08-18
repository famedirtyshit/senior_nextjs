// tailwind.config.js
module.exports = {
  // purge: [
  //   // Use *.tsx if using TypeScript
  //   './pages/**/*.js',
  //   './components/**/*.js'
  // ],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1920px',
      // => @media (min-width: 1920px) { ... }
    },
    theme: {
      fontFamily: { 
       'body': ['"prompt"'],
      }
    },
    extend: {
      colors: {
        mainGreen: '#356053',
        mainOrange: '#F0930D',
        mainCream: '#FFFCF3',
        textGray: '#939393',
        darkCream: '#DBC09C'
      },
      textColor: {
        mainGreen: '#356053'
      },
      borderColor: {
        mainGreen: '#356053'
      },
      flexGrow: {
        '0.5': 0.5
      }
    }
  }
  // ...
}