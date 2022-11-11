
import ident, { IdentityEventType, Session, Userinfo } from "@halliday/ident";
import { useEffect, useState } from "react";

export function useUser(): Userinfo | null {
    const [user, setUser] = useState<Userinfo | null>(ident.user);
    useEffect(() => {
        function handleIdentEvent() {
            setUser(ident.user);
        }
        const evs: IdentityEventType[] = [
            "session", "userinfo"
        ];
        for (const ev of evs) {
            ident.addEventListener(ev, handleIdentEvent);
        }
        return () => {
            for (const ev of evs) {
                ident.removeEventListener(ev, handleIdentEvent);
            }
        };
    });
    return user;
}

export function useSession(): Session | null {
    const [session, setSession] = useState<Session | null>(ident.session);
    useEffect(() => {
        function handleIdentEvent() {
            setSession(ident.session);
        }
        ident.addEventListener("session", handleIdentEvent);
        return () => {
            ident.removeEventListener("session", handleIdentEvent);
        };
    });
    return session;
}