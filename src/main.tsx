import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { Analytics } from "@vercel/analytics/react";
import Loader from "./components/Overlays/Loader/Loader";

const App = lazy(() => import("./components/App/App"));

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
      <Analytics />
    </Provider>
  </StrictMode>,
);
