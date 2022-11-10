import ident, { api as identApi } from "@halliday/ident";
import { MsgBoxContainer } from '@halliday/mui-msgbox';
import { ToastContainer } from '@halliday/mui-toast';
import { config as i18nConfig, LanguageGuard, loadLanguage } from '@halliday/react-i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
// import { SessionProvider } from './session';

i18nConfig.supportedLanguages = ["en", "de"];
identApi.config.baseUrl = "http://localhost/";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

Promise.all([
    ident.setup(),
    loadLanguage()
]).then(() => {
    root.render(
        <React.StrictMode>
            <LanguageGuard>
                <App />
                <MsgBoxContainer />
                <ToastContainer />
            </LanguageGuard>
        </React.StrictMode>
    );
});