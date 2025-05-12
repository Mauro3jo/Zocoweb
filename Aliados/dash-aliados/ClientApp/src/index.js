import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DarkModeProvider } from "./context/DarkModeContext";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { DatosInicioProvider } from "./context/DatosInicioContext";
import { CambiarClaveProvider } from "./context/CambiarClaveContext";
import "./custom.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DarkModeProvider>
    <CambiarClaveProvider>
      <DatosInicioProvider>
        <App />
      </DatosInicioProvider>
    </CambiarClaveProvider>
  </DarkModeProvider>
);
