import { useEffect, useState } from "react";

var urlBase = "/";

const supportedLanguages = ["en", "de"];

var pkg: Package; 

export async function loadLanguage(lang = getLanguage()): Promise<Package> {
    const resp = await fetch(urlBase+`i18n/`+lang+".json");
    pkg = await resp.json();
    return pkg;
}

export function L(id: string, i?: number): string {
    const s =  l(pkg, id, i);
    if (s === undefined) {
        console.error("L('%s') missing entry", id);
        return "";
    }
    return s;
}

interface Package {
    [x: string]: Package | string[] | string;
}

function l(pkg: Package, id: string, idx?: number): string | undefined {
    const i = id.indexOf(".");
    if (i === -1) {
        const f = pkg[id];
        if (f === undefined)
            return undefined;
        if (Array.isArray(f)) {
            if (idx === undefined)
                return undefined;
            return f[idx];
        }
        if (typeof f === "string")
            return f;
        return undefined;
    }
    const f = pkg[id.slice(0, i)];
    if (f === undefined || typeof f !== "object")
        return undefined;
    id = id.slice(i+1);
    return l(f as Package, id, idx);
}

const listeners = new Set<(lang: string) => void>();

export function useLanguage() {
    const [lang, setLang] = useState(getLanguage()); 
    useEffect(() => {
        listeners.add(setLang);
        return () => {
            listeners.delete(setLang);
        }
    }, []);
    return lang;
}

export function getLanguage() {
    var lang = localStorage.getItem("lang") || defaultLanguage();
    if (!supportedLanguages.includes(lang)) {
        console.warn("unsupported i18n language:", lang);
        lang = "en";
    }
    return lang;
}

export async function setLanguage(lang: string) {
    if (!supportedLanguages.includes(lang)) {
        console.warn("unsupported i18n language:", lang);
        return
    }
    localStorage.setItem("lang", lang);
    await loadLanguage(lang);
    for (const l of Array.from(listeners)) {
        try {
            l(lang);
        } catch(err) {
            reportError(err);
        }
    }
}

export function defaultLanguage(): string {
    var lang = (navigator.language || "en").match(/^\w+\b/)![0].toLowerCase();
    if (!supportedLanguages.includes(lang)) {
        console.warn("unsupported i18n language:", lang);
        lang = "en";
    }
    return lang;
}