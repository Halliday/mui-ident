import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import { SessionProvider } from './session';
import { api } from "@halliday/ident";
import { MsgBoxProvider } from './components/MsgBox';
import { ToastProvider } from './components/Toast';
import { loadLanguage } from './i18n';

api.config.baseUrl = "http://localhost:8080/";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

loadLanguage().then(() => {
  root.render(
    <React.StrictMode>
      <SessionProvider>
        <App />
        <MsgBoxProvider />
        <ToastProvider />
      </SessionProvider>
    </React.StrictMode>
  );
});