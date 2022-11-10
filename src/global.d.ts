declare global {
    interface Window {
        openLogin: () => void;
        openRegistration: () => void;
        openProfile: () => void;
    }
}

export {};