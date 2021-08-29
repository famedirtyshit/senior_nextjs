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
        darkCream: '#DBC09C',
        postTitle: '#626262',
        mainBgGreen: '#378566',
        mainOrange: '#F0930D',
        mainYellow:'#F4C444',
      },
      textColor: {
        mainGreen: '#356053'
      },
      borderColor: {
        mainGreen: '#356053'
      },
      flexGrow: {
        '0.1': 0.1,
        '0.2': 0.2,
        '0.3': 0.3,
        '0.4': 0.4,
        '0.5': 0.5,
        '0.6': 0.6,
        '0.7': 0.7,
        '0.8': 0.8,
        '0.9': 0.9,
      }
    }
  }
  // ...
}