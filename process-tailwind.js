const fs = require('fs');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

// CSS con directivas de Tailwind
const css = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

// Procesar el CSS con PostCSS y los plugins de Tailwind
postcss([
  tailwindcss,
  autoprefixer,
])
  .process(css, { from: undefined })
  .then(result => {
    fs.writeFileSync('./src/styles/output.css', result.css);
    console.log('¡CSS de Tailwind generado correctamente!');
  })
  .catch(error => {
    console.error('Error al procesar Tailwind CSS:', error);
  });
