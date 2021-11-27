// tailwind.config.js
module.exports = {
  // purge: [
  //   // Use *.tsx if using TypeScript
  //   './pages/**/*.js',
  //   './components/**/*.js'
  // ],
  theme: {
    screens: {
      'sm': '768px',
 
      'md': '1024px',
 
      'lg': '1280px',

      'lxl': '1440px',
 
      'xl': '1536px',
 
      '2xl': '1920px',
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
      },
      spacing: {
        'c3.4': '3.4rem'
      },
      boxShadow: {
        'dashboardItemSelected': '0px 0px 20px #000000'
      }
    }
  }
  // ...
}
