import React from "react";
import ReactDOM from "react-dom/client";
import { Application } from "./application/application";

const element = document.getElementById("application") as HTMLElement;

ReactDOM.createRoot(element).render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
);
