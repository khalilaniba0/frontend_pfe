import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

import { AuthProvider } from "context/ContexteAuth";
import { CandidateAuthProvider } from "context/ContexteAuthCandidat";
import { SuperAdminProvider } from "context/ContexteSuperAdmin";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <CandidateAuthProvider>
        <SuperAdminProvider>
          <App />
        </SuperAdminProvider>
      </CandidateAuthProvider>
    </AuthProvider>
  </BrowserRouter>
);
