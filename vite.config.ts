import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {nodePolyfills} from "vite-plugin-node-polyfills";
import plainText from "vite-plugin-plain-text";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
    // Not working !
    plainText([
      "**/*.sparql",
      "**/*.shacl",
    ], {
      "namedExport": false,
    }),
  ],
  // https://github.com/rdfjs/N3.js/issues/257#issuecomment-959885640
  define: {
    // global: {},
    // process: {},
  },
});
