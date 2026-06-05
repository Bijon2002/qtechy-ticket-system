/**
 * Main Application Entry Point
 * Initializes the React application, wraps it with Redux Provider,
 * and renders it to the DOM.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";

// Global Styles
import "./index.css";

// Root Component
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
