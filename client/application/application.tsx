import { useMemo } from "react";
import { initReactI18next } from "react-i18next";
import i18n, { InitOptions } from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { LocalCatalogValidatorView } from "../local-catalog-validator/local-catalog-validator-view";

// https://react.i18next.com/latest/using-with-hooks
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "sk",
    supportedLngs: ["sk"],
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      // React takes care of the escaping.
      escapeValue: false,
    },
    backend: {
      // For all available options read the backend's repository readme file.
      loadPath: "./locales/{{lng}}/{{ns}}.json",
    },
  } as InitOptions);

export function Application() {
  // Automatic dark mode support.
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container fixed>
        <LocalCatalogValidatorView />
      </Container>
    </ThemeProvider>
  );
}
