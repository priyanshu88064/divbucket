import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import Playwrap from "./components/Playwrap/Playwrap";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <Playwrap />
      {/* <Analytics /> */}
    </Provider>
  </StrictMode>,
);
