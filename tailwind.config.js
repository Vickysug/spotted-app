/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    screen: {
      sm: '480px',
      md: '770px',
      lg: '980px',
      xl: '1440px'
    },
    extend: {
      colors: {

        /* Add our custom colours in here for example; 
         
        brightRed: 'hsl(12, 88%, 59%)',
        brightRedLight: 'hsl(12, 88%, 69%)',
        brightRedSupLight: 'hsl(12, 88%, 95%)' 
         
        etc....*/
      }
    },
  },
  plugins: [],
} 

