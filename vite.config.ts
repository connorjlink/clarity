import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { exec } from 'child_process';
import { resolve } from 'path';
import fs from 'fs';

declare var __dirname;

function getHtmlInputs() {
   const tempDir = resolve(__dirname, 'temp');
   console.log(`Using temp directory: ${tempDir}`);
   return fs.readdirSync(tempDir)
      .filter(file => file.endsWith('.html'))
      .reduce((inputs, file) => {
         inputs[file] = resolve(tempDir, file);
         console.log(`Found HTML file: ${file}`);
         return inputs;
      }, {});
}

export default defineConfig({
   //base: '/clarity/',
   plugins: [
      svelte({
         compilerOptions: {
            customElement: true
         }
      })
   ],
   server: {
      watch: {
         ignored: ['!**/temp/**']
      }
   },
   build: {
      outDir: './docs',
      rollupOptions: {
         input: getHtmlInputs()
      }
   }
});