import React from "react";
import ReactDOM from "react-dom/client";
import { IconContext } from "react-icons";
import App from "./App.tsx";
import "./locales/i18n";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <IconContext.Provider
      value={{
        style: {
          verticalAlign: "text-bottom",
          width: "1.2em",
          height: "1.2em",
        },
      }}>
      <App />
    </IconContext.Provider>
  </React.StrictMode>,
);
