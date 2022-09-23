
import { api, defaultKey, getPasswordResetEmail, instructPasswordReset, loadSession, login, NewUser, register, requiresPasswordReset, resetPassword, Session, Userinfo } from "@halliday/ident";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SessionInteraction = "reset-password" | string;

class SessionWrapper {
    constructor(
        public readonly sessionKey: string,
        public readonly session: Session | null,
        public readonly reason: string,
        private readonly setSession: (arg: [sess: Session | null, reason: string]) => void
    ) {}

    login = async (username: string, password: string) => {
        const sess = await login(username, password, this.sessionKey);
        this.setSession([sess, "login"]);
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

    get requiredInteraction(): SessionInteraction | undefined {
        if (requiresPasswordReset()) {
            return "reset-password";
        }
    }

    get passwordResetEmail() {
        return getPasswordResetEmail();
    }

    async instructPasswordReset(email: string) {
        await instructPasswordReset(email);
    }

    instructEmailChange = async (newEmail: string) => {
        if (!this.session) throw new Error("Not logged in.");
        await this.session.instructEmailChange(newEmail);
    }

    async resetPassword(newPassword: string) {
        if (!requiresPasswordReset())
            throw new Error("Password reset not available.");
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
        await this.login(user.email, password);
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

export function SessionProvider(props: SessionProviderProps) {
    const { sessionKey = defaultKey, children } = props;

    const [[session, reason], setSession] = useState<[Session | null, string]>([null, "loading"]);

    useEffect(() => {
        loadSession(sessionKey).then(setSession, (err) => {
            console.error("Error loading session:", err);
            setSession([null, "error"]);
        });
    }, [sessionKey]);

    const wrapper = useMemo(() => new SessionWrapper(sessionKey, session, reason, setSession), [session, reason]);

    return <SessionContext.Provider value={wrapper} children={children} />;
}
