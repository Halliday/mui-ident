
import ident, { IdentityEventType, Userinfo } from "@halliday/ident";
import { useEffect, useState } from "react";

export function useUser(): Userinfo | null {
    const [user, setUser] = useState<Userinfo | null>(ident.user);
    useEffect(() => {
        function handleIdentEvent() {
            setUser(ident.user);
        }
        const evs: IdentityEventType[] = [
            "login", "logout", "revoked", "session-userinfo"
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

// export type SessionInteraction = "reset-password" | string;

// export type SessionStatus = IdentStatus | "register" | "logout" | "user-deleted" | "user-deletion-failed";

// export type SessionDispatcher = (arg: [sess: Session | null, status: SessionStatus]) => void;

// export class SessionWrapper {
//     constructor(
//         public readonly sessionKey: string,
//         public readonly session: Session | null,
//         public readonly status: SessionStatus,
//         private readonly setSession: SessionDispatcher
//     ) { }

//     login = async (username: string, password: string) => {
//         const [sess, status] = await login(username, password, this.sessionKey);
//         this.setSession([sess, status]);
//     }

//     get userinfo(): Userinfo | null {
//         if (!this.session) return null;
//         return this.session.userinfo;
//     }

//     logout = async () => {
//         if (!this.session) return;
//         try {
//             await this.session.logout();
//         } catch (err) {
//             console.error("Error revoking session", err);
//             // silently ignore
//         }
//         this.setSession([null, "logout"]);
//     }

//     get getEmailHint() {
//         return getEmailHint();
//     }

//     get requiresLogin() {
//         return this.status === "login-for-registration-required" || this.status === "login-for-email-confirmation-required";
//     }

//     async instructPasswordReset(email: string) {
//         await instructPasswordReset(email);
//     }

//     instructEmailChange = async (newEmail: string) => {
//         if (!this.session) throw new Error("Not logged in.");
//         await this.session.instructEmailChange(newEmail);
//     }

//     async resetPassword(newPassword: string) {
//         await resetPassword(newPassword);
//     }

//     changePassword = async (oldPassword: string, newPassword: string) => {
//         if (!this.session) throw new Error("Not logged in.");
//         await this.session.updateSelf({ old_password: oldPassword, new_password: newPassword });
//     }

//     updateUser = async (u: api.UserUpdate) => {
//         if (!this.session) throw new Error("Not logged in.");
//         await this.session.updateSelf(u);
//     }

//     register = async (user: NewUser, password: string) => {
//         if (!user.email) throw new Error("Email is required.");
//         await register(user, password);
//         const [sess, status] = await login(user.email!, password, this.sessionKey);
//         this.setSession([sess, "register"]);
//     }

//     deleteUser = async () => {
//         if (!this.session) throw new Error("Not logged in.");
//         this.session.delete();
//         try {
//             await this.session.deleteSelf();
//         } catch (err) {
//             this.setSession([null, "user-deletion-failed"]);
//             throw err;
//         }
//         this.setSession([null, "user-deleted"]);
//     }
// }

// export function useSession(): SessionWrapper {
//     const w = useContext(SessionContext);
//     if (!w) throw new Error("useSession must be used within a SessionProvider");
//     return w;
// }

// export function useUserinfo(): Userinfo | null {
//     const { session } = useSession();
//     const [userinfo, setUserinfo] = useState<Userinfo | null>(session?.userinfo ?? null);
//     useEffect(() => {
//         return session?.use((ev) => {
//             if (ev.status === "userinfo")
//                 setUserinfo(session.userinfo);
//         });
//     }, [session]);
//     return userinfo;
// }

// export interface SessionProviderProps {
//     children: React.ReactNode;
//     sessionKey?: string;
//     defaultSession: Session | null;
//     defaultStatus: SessionStatus;
// }

// export const SessionContext = createContext<SessionWrapper | null>(null);

// export function SessionProvider(props: SessionProviderProps) {
//     const { sessionKey = defaultKey, defaultSession, defaultStatus, children } = props;

//     const [[session, status], setSession] = useState<[Session | null, SessionStatus]>([defaultSession, defaultStatus]);

//     const wrapper = useMemo(() => new SessionWrapper(sessionKey, session, status, setSession), [session, status]);

//     return <SessionContext.Provider value={wrapper} children={children} />;
// }
