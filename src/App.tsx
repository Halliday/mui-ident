import ident, { IdentityEventType, Session } from '@halliday/ident';
import { AppBar, Box, Button, Container, createTheme, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { MyAccountAvatar } from './components/AccountAvatar';
import { useSession } from './session';


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

    const session = useSession();

    return (
        <ThemeProvider theme={theme}>
            <Box id="app">
                <AppBar position="static" sx={{ bgcolor: "common.white", color: "text.primary" }}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Typography variant="h1" sx={{ flexGrow: 1 }}>MUI Identity Demo</Typography>
                            {session ?
                                <MyAccountAvatar onClick={window.openProfile} sx={{ cursor: "pointer" }} /> :
                                <Button variant="outlined" onClick={window.openLogin}>Login</Button>
                            }
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
            </Box>

        </ThemeProvider>
    );
}


function MySession() {
    function logout() {
        ident.logout();
    }

    // we use the reference to the session object here, as we want to re-render on
    // changes to the session's scope (the session object is the same)
    const [{ session }, setSession] = useState<{ session: Session | null }>({ session: ident.session });
    useEffect(() => {
        function handleSessionChange() {
            setSession({ session: ident.session });
        }
        const evs: IdentityEventType[] = [
            "session", "refresh", "userinfo",
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

    function refreshSession() {
        session!.refresh();
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

// function useForceUpdate() {
//     const [value, setValue] = useState(0);
//     return useMemo(() => () => setValue(value + 1), [value]);
// }

export default App;
