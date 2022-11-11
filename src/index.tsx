import ident, { api as identApi } from "@halliday/ident";
import { MsgBoxContainer } from '@halliday/mui-msgbox';
import { ToastContainer } from '@halliday/mui-toast';
import { LanguageGuard, loadLanguage } from '@halliday/react-i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import IdentityTools from "./components/Identity";
import "./index.css";
// import { SessionProvider } from './session';

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
                <IdentityTools />
                <App />
                <MsgBoxContainer />
                <ToastContainer />
            </LanguageGuard>
        </React.StrictMode>
    );
});