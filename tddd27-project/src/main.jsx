import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "1048777482951-4fl6gqt9h6ip9i54sdn50rut930hq870.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);