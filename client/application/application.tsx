import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import Container from "@mui/material/Container";
import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// https://react.i18next.com/latest/using-with-hooks
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "cs",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  } as InitOptions);

export function Application() {
  return (
    <Container fixed>
      <RouterProvider router={router} />
    </Container>
  );
}
