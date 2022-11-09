import { AppBar, Box, Button, CircularProgress, Container, createTheme, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { MyAccountAvatar } from './components/AccountAvatar';
import { LoginDialog, LoginPanel } from './components/Login';
import { MyProfileDialog, MyProfilePanel } from './components/Profile';
// import { useSession } from './session';
import { MsgBox } from "@halliday/mui-msgbox";
import { toast } from "@halliday/mui-toast";
import ident, { IdentityEvent, IdentityEventType, Session } from '@halliday/ident';
// import { loadSession } from '@halliday/ident';


const theme = createTheme({
    typography: {
        h1: {
            fontSize: "1.25rem",
            fontWeight: "bold",
            lineHeight: "normal",
            letterSpacing: "0.012em",
        },
        h2: {
            fontSize: "1.25rem",
            fontWeight: "normal",
            lineHeight: "normal",
            letterSpacing: "normal",
        },
        h3: {
            fontSize: "0.875rem",
            fontWeight: "bold",
            lineHeight: "normal",
            letterSpacing: "0.012em",
            textTransform: "uppercase",
        },
    }
});

function App() {

    const [session, setSession] = useState<Session | null>(ident.session);

    function handleIdentEvent(ev: IdentityEvent) {
        setSession(ident.session);

        switch (ev.type) {
            case "login":
                toast("Login successfull.");
                break;
            case "logout":
                toast("Logout successfull.");
                break;
            case "revoked":
                toast("Sitzung wurde beended. Bitte erneut anmelden!");
                break;
            case "registration-completed":
                MsgBox({
                    title: "Registration completed",
                    text: "Thanks for verifying your email address!",
                });
                break;
            case "registered":
                MsgBox({
                    title: "Registration successfull",
                    text: "Please check your email for a verification link.",
                });
                break;
            case "registration-failed":
                MsgBox({
                    title: "Registration failed",
                    text: "This link is probably expired or was already used. Please try again.",
                });
                break;
            case "social-login":
                toast("Login successfull.");
                break;
            case "social-login-failed":
                MsgBox({
                    title: "Login failed",
                    text: "This link is probably expired or was already used. Please try again.",
                });
                break;
            case "email-confirmed":
                MsgBox({
                    title: "Email verified",
                    text: "Thanks for verifying your email address.",
                });
                break;
            case "email-confirmation-failed":
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
            case "login-for-email-confirmation-required":
                setLoginOpen(true);
                break;
        }
    }

    useEffect(() => {
        ident.setup();

        const evs: IdentityEventType[] = [
            "login", "logout", "revoked", "registered", "registration-failed",
            "social-login", "social-login-failed", "email-confirmed", "email-confirmation-failed",
            "password-reset-required", "login-for-registration-required", "login-for-email-confirmation-required",
            "session-refresh", "session-userinfo"
        ];
        for (const ev of evs) {
            ident.addEventListener(ev, handleIdentEvent);
        }
        return () => {
            for (const ev of evs) {
                ident.removeEventListener(ev, handleIdentEvent);
            }
        };
    }, []);

    // const [loginOpen, setLoginOpen] = useState(status === "password-reset-required" || status === "login-for-registration-required" || status === "login-for-email-confirmation-required");
    const [loginOpen, setLoginOpen] = useState(false);
    function openLogin() {
        setLoginOpen(true);
    }
    function closeLogin() {
        setLoginOpen(false);
    }
    const [profileOpen, setProfileOpen] = useState(false);
    function openProfile() {
        setProfileOpen(true);
    }
    function closeProfile() {
        setProfileOpen(false);
    }

    return (
        <ThemeProvider theme={theme}>
            <Box id="app">
                <AppBar position="static" sx={{ bgcolor: "common.white", color: "text.primary" }}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Typography variant="h1" sx={{ flexGrow: 1 }}>MUI Identity Demo</Typography>
                            {session ? <MyAccountAvatar onClick={openProfile} sx={{ cursor: "pointer" }} /> : <Button variant="outlined" onClick={openLogin}>Login</Button>}
                        </Toolbar>
                    </Container>
                </AppBar>

                {session ? (
                    <MySession />
                ) : (
                    <Container maxWidth="md" sx={{ pt: "20vh", color: "text.secondary" }}>
                        <Typography variant="h2" gutterBottom>Login required</Typography>
                        <Typography>This demo requires you to login by clicking the "Login" button at the top right corner.</Typography>
                    </Container>
                )}

                <MyProfileDialog open={profileOpen} onClose={closeProfile} />
                <LoginDialog open={loginOpen} onClose={closeLogin} />
            </Box>
        </ThemeProvider>
    );
}


function MySession() {
    function logout() {
        ident.logout();
    }

    const [session, setSession] = useState<Session | null>(ident.session);
    useEffect(() => {
        function handleSessionChange() {
            setSession(ident.session);
        }
        const evs: IdentityEventType[] = [
            "login", "logout", "revoked"
        ];
        for (const ev of evs) {
            ident.addEventListener(ev, handleSessionChange);
        }
        return () => {
            for (const ev of evs) {
                ident.removeEventListener(ev, handleSessionChange);
            }
        };
    }, []);
    useEffect(() => {
        function handleSessionRefresh() {

        }
        if (session) {
            session.addEventListener("refresh", handleSessionRefresh);
            return () => session.removeEventListener("refresh", handleSessionRefresh);
        }
    }, [session]);

    const forceUpdate = useForceUpdate();

    function refreshSession() {
        session!.refresh().then(forceUpdate);
    }

    if (!session) return null;
    const rows: [string, React.ReactNode][] = [
        ["Access Token", session.accessToken],
        ["Refresh Token", session.refreshToken],
        ["Scopes", session.scopes.join(", ")],
        ["Issued At", session.issuedAt.toLocaleString()],
        ["Expires At", session.expiresAt.toLocaleString()],
        ["Userinfo", <ul>{session.user ? Object.entries(session.user).map(([k, v]) => (<li key={k}><strong>{k}:</strong> {JSON.stringify(v)}</li>)) : "-"}</ul>],
    ];
    return <Container maxWidth="lg" sx={{ pt: "5vh" }}>
        <Typography variant="h2" gutterBottom>Session</Typography>
        <TableContainer component={Paper}>
            <Table aria-label="My Session">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>Key</TableCell>
                        <TableCell>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row[0]}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" sx={{ whiteSpace: "nowrap" }}>{row[0]}</TableCell>
                            <TableCell><Box sx={{ wordBreak: "break-all", whiteSpace: "pre-line", }}>{row[1]}</Box></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Box sx={{ pt: 2, display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => logout()}>Logout</Button>
            <Button onClick={refreshSession}>Refresh</Button>
        </Box>
    </Container>
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return useMemo(() => () => setValue(value + 1), [value]);
}

export default App;
