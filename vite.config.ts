// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';


// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {

//       '/api/hh': {
//         target: 'https://api.hh.ru/openapi/redoc#tag/Poisk-vakansij/operation/get-vacancies?industry=7&professional_role=96',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api\/hh/, '')
//       }
//     }
//   }
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
