import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { SWRConfig } from "swr";
import { BrowserRouter } from "react-router-dom";
import AuthGuard from "./auth-guard";

import Public from "./public";

const LazyApp = lazy(() => import("./app-root"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SWRConfig value={{}}>
      <BrowserRouter>
        <AuthGuard
          guarded={
            <Suspense>
              <LazyApp />
            </Suspense>
          }
          fallback={<Public />}
        />
      </BrowserRouter>
    </SWRConfig>
  </React.StrictMode>
);
