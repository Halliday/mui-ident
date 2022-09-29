
import { api, defaultKey, getEmailHint, instructPasswordReset, loadSession, login, NewUser, register, resetPassword, Session, Status as IdentStatus, Userinfo } from "@halliday/ident";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SessionInteraction = "reset-password" | string;

export type SessionStatus = IdentStatus | "loading" | "loading-failed" | "register" | "logout" | "update-self"

export type SessionDispatcher = (arg: [sess: Session | null, status: SessionStatus]) => void;

export class SessionWrapper {
    constructor(
        public readonly sessionKey: string,
        public readonly session: Session | null,
        public readonly status: SessionStatus,
        private readonly setSession: SessionDispatcher
    ) {}

    login = async (username: string, password: string) => {
        const [sess, status] = await login(username, password, this.sessionKey);
        this.setSession([sess, status]);
    }

    get userinfo(): Userinfo | null {
        if (!this.session) return null;
        return this.session.userinfo;
    }

    logout  = async () => {
        if (!this.session) return;
        try {
            await this.session.logout();
        } catch (err) {
            console.error("Error revoking session", err);
            // silently ignore
        }
        this.setSession([null, "logout"]);
    }

    get getEmailHint() {
        return getEmailHint();
    }

    get requiresLogin()  {
        return this.status === "login-for-registration-required" || this.status === "login-for-email-confirmation-required";
    }

    async instructPasswordReset(email: string) {
        await instructPasswordReset(email);
    }

    instructEmailChange = async (newEmail: string) => {
        if (!this.session) throw new Error("Not logged in.");
        await this.session.instructEmailChange(newEmail);
    }

    async resetPassword(newPassword: string) {
        await resetPassword(newPassword);
    }

    changePassword = async (oldPassword: string, newPassword: string) => {
        if (!this.session) throw new Error("Not logged in.");
        await this.session.updateSelf({ old_password: oldPassword, new_password: newPassword });
    }

    updateUser = async (u: api.UserUpdate) => {
        if (!this.session) throw new Error("Not logged in.");
        await this.session.updateSelf(u);
        this.setSession([this.session, "update-self"]);
    }

    register = async (user: NewUser, password: string) => {
        if (!user.email) throw new Error("Email is required.");
        await register(user, password);
        const [sess, status] = await login(user.email!, password, this.sessionKey);
        this.setSession([sess, "register"]);
    }

    deleteUser = async() => {
        if (!this.session) throw new Error("Not logged in.");
        await api.deleteUsersSelf();
    }
}

export function useSession(): SessionWrapper {
    const w = useContext(SessionContext);
    if (!w) throw new Error("useSession must be used within a SessionProvider");
    return w;
}

export interface SessionProviderProps {
    children: React.ReactNode;
    sessionKey?: string;
}

export const SessionContext = createContext<SessionWrapper | null>(null);

let sess: Promise<[sess: Session | null, status: IdentStatus]> | null;

export function SessionProvider(props: SessionProviderProps) {
    const { sessionKey = defaultKey, children } = props;

    const [[session, status], setSession] = useState<[Session | null, SessionStatus]>([null, "loading"]);

    useEffect(() => {
        if (!sess) sess = loadSession(sessionKey);
        sess.then(setSession, (err) => {
            console.error("Error loading session:", err);
            setSession([null, "loading-failed"]);
        });
    }, [sessionKey]);

    const wrapper = useMemo(() => new SessionWrapper(sessionKey, session, status, setSession), [session, status]);

    return <SessionContext.Provider value={wrapper} children={children} />;
}
