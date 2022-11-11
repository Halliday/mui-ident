import ident, { IdentityEvent, IdentityEventType, Session } from "@halliday/ident";
import { MsgBox } from "@halliday/mui-msgbox";
import { toast } from "@halliday/mui-toast";
import { useEffect, useState } from "react";
import { LoginDialog } from "./Login";
import { MyProfileDialog } from "./Profile";

const identityEvents: IdentityEventType[] = [
    "session",
    "login", "logout", "revoke",
    "refresh", "userinfo",
    "social-login", "social-login-error",
    "register", "registration-error", "registration-complete", "login-for-registration-required",
    "email-verify", "login-for-email-verify-required", "login-for-email-verify-required",
    "password-reset-required",
];

let unhandledIdentEvent: IdentityEvent | null = null;

function handleIdentEvent(ev: IdentityEvent) {
    unhandledIdentEvent = ev;
}

for (const ev of identityEvents) {
    ident.addEventListener(ev, handleIdentEvent);
}

export default function IdentityTools() {

    const [loginOpen, setLoginOpen] = useState(false);
    function openLogin() { setLoginOpen(true); }
    function closeLogin() { setLoginOpen(false); }
    window.openLogin = openLogin;
    window.openRegistration = openLogin;

    const [profileOpen, setProfileOpen] = useState(false);
    function openProfile() { setProfileOpen(true); }
    function closeProfile() { setProfileOpen(false); }
    window.openProfile = openProfile;

    function handleIdentEvent(ev: IdentityEvent) {
        unhandledIdentEvent = null;

        switch (ev.type) {
            case "login":
                toast("Login successfull.");
                break;
            case "logout":
                toast("Logout successfull.");
                break;
            case "revoke":
                toast("Sitzung wurde beended. Bitte erneut anmelden!");
                break;
            case "registration-complete":
                MsgBox({
                    title: "Registration completed",
                    text: "Thanks for verifying your email address!",
                });
                break;
            case "register":
                setLoginOpen(false);
                MsgBox({
                    title: "Registration successfull",
                    text: "Please check your email for a verification link.",
                });
                break;
            case "registration-error":
                MsgBox({
                    title: "Registration failed",
                    text: "This link is probably expired or was already used. Please try again.",
                });
                break;
            case "social-login":
                toast("Login successfull.");
                break;
            case "social-login-error":
                MsgBox({
                    title: "Login failed",
                    text: "This link is probably expired or was already used. Please try again.",
                });
                break;
            case "email-verify":
                MsgBox({
                    title: "Email verified",
                    text: "Thanks for verifying your email address.",
                });
                break;
            case "email-verify-error":
                MsgBox({
                    title: "Email change failed",
                    text: "This link is probably expired or was already used. Please try again.",
                });
                break;
            case "password-reset-required":
                setLoginOpen(true);
                break;
            case "login-for-registration-required":
                setLoginOpen(true);
                break;
            case "login-for-email-verify-required":
                setLoginOpen(true);
                break;
        }
    }

    useEffect(() => {
        for (const ev of identityEvents)
            ident.addEventListener(ev, handleIdentEvent);
        if (unhandledIdentEvent) {
            handleIdentEvent(unhandledIdentEvent);
        }
        return () => {
            for (const ev of identityEvents)
                ident.removeEventListener(ev, handleIdentEvent);
        };
    }, []);

    return <>
        <MyProfileDialog open={profileOpen} onClose={closeProfile} />
        <LoginDialog open={loginOpen} onClose={closeLogin} />
    </>;
}