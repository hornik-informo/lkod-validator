import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import {nodePolyfills} from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  // https://github.com/rdfjs/N3.js/issues/257#issuecomment-959885640
  define: {
    // global: {},
    // process: {},
  },
  base: "./",
});
