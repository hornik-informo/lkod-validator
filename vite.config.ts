import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: [
            "react",
            "react-dom",
            "react-i18next",
            "react-is",
            "react/jsx-runtime",
          ],
          i18next: [
            "i18next",
            "i18next-browser-languagedetector",
            "i18next-http-backend",
          ],
          mui: ["@mui/material", "@mui/icons-material"],
          rdf: [
            "@rdfjs/data-model",
            "fetch-sparql-endpoint",
            "jsonld",
            "memory-level",
            "n3",
            "rdf-data-factory",
            "rdf-ext",
            "rdf-validate-shacl",
          ],
        },
      },
    },
  },
});
