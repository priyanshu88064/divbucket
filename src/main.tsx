import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@core/kernel/bootstrap";
import { Provider } from "react-redux";
import store from "@core/state/store";
import { Analytics } from "@vercel/analytics/react";
import Loader from "@core/components/Overlays/Loader/Loader";

const App = lazy(() => import("@app/App"));

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Missing root element: expected <div id="root"></div> in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
      <Analytics />
    </Provider>
  </StrictMode>,
);
