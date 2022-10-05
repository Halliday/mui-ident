import { api, loadSession, Session, Status } from "@halliday/ident";
import { MsgBoxContainer } from '@halliday/mui-msgbox';
import { ToastContainer } from '@halliday/mui-toast';
import { config as i18nConfig, LanguageGuard, loadLanguage } from '@halliday/react-i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import { SessionProvider } from './session';

i18nConfig.supportedLanguages = ["en", "de"];
api.config.baseUrl = "http://localhost:8080/";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

Promise.allSettled([
  loadSession(),
  loadLanguage()
]).then(([promisedSess]) => {

  let defaultSession: Session | null = null;
  let defaultStatus: Status = "no-session";
  if (promisedSess.status === "fulfilled") {
    const [sess, status] = promisedSess.value;
    defaultSession = sess;
    defaultStatus = status;
  }

  root.render(
    <React.StrictMode>
      <SessionProvider defaultSession={defaultSession} defaultStatus={defaultStatus}>
        <LanguageGuard>
          <App />
          <MsgBoxContainer />
          <ToastContainer />
        </LanguageGuard>
      </SessionProvider>
    </React.StrictMode>
  );
});