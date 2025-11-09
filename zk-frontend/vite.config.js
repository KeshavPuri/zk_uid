// // // import { defineConfig } from 'vite'
// // // import react from '@vitejs/plugin-react'
// // // import tailwindcss from '@tailwindcss/vite'
// // // import nodePolyfills from 'vite-plugin-node-polyfills';


// // // // https://vite.dev/config/
// // // export default defineConfig({
// // //   plugins: [react(),tailwindcss(),nodePolyfills({
// // //       protocolImports: true
// // //     }),],
// // // })

// // import { defineConfig } from 'vite';
// // import react from '@vitejs/plugin-react';
// // import nodePolyfills from 'vite-plugin-node-polyfills';
// // import tailwindcss from '@tailwindcss/vite'

// // export default defineConfig({
// //   plugins: [
// //     react(),
// //     nodePolyfills({
// //       protocolImports: true
// //     }),tailwindcss()
// //   ],
// //   define: {
// //     global: 'globalThis',  // Some circomlib builds need this
// //   },
// //   resolve: {
// //     alias: {
// //       process: 'process/browser',
// //       buffer: 'buffer',
// //     },
// //   },
// // });
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import nodePolyfills from 'vite-plugin-node-polyfills';

// export default defineConfig({
//   plugins: [
//     react(),
//     nodePolyfills({
//       protocolImports: true
//     }),
//   ],
//   define: {
//     global: 'globalThis',  // Some circomlib builds need this
//   },
//   resolve: {
//     alias: {
//       process: 'process/browser',
//       buffer: 'buffer',
//     },
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills'; // ✅ named import

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Enable polyfills for Buffer, process, global, etc.
      protocolImports: true,
    }),
  ],
  define: {
    global: 'globalThis', // Some circomlib dependencies expect global
  },
  resolve: {
    alias: {
      process: 'process/browser',
      buffer: 'buffer',
    },
  },
});
