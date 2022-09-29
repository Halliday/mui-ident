import { AppBar, Box, Button, CircularProgress, Container, createTheme, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { MyAccountAvatar } from './components/AccountAvatar';
import { LoginDialog, LoginPanel } from './components/Login';
import { MyProfileDialog, MyProfilePanel } from './components/Profile';
import { useSession } from './session';
import { MsgBox } from "@halliday/mui-msgbox";
import { toast } from "@halliday/mui-toast";


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

  const { session, status } = useSession();

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

  useEffect(() => {
    switch (status) {
      case "login":
        toast("Login successfull.");
        break;
      case "register":
        MsgBox({
          title: "You've Got Mail!",
          text: "Check your mails for a mail from us, and click the link inside the mail to complete the registration.",
        });
        break;
      case "logout":
        toast("Logout successfull.");
        break;
      case "revoked":
        toast("Sitzung wurde beended. Bitte erneut anmelden!");
        break;
      case "registration-completed":
        MsgBox({
          title: "Registration successfull",
          text: "Thanks for verifying your email address.",
        });
        break;
      case "social-login-exchanged":
        toast("Login successfull.");
        break;
      case "registration-failed":
        MsgBox({
          title: "Registration failed",
          text: "This link is probably expired or was already used. Please try again.",
        });
        break;
      case "social-login-exchanged":
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
    }
  }, [status]);

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
            <Typography variant="h2">Login required</Typography>
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
  const { session } = useSession();
  if (!session) return null;
  const rows: [string, React.ReactNode][] = [
    ["Access Token", session.accessToken],
    ["Refresh Token", session.refreshToken],
    ["Scopes", session.scopes.join(", ")],
    ["Issued At", session.issuedAt.toLocaleString()],
    ["Expires At", session.expiresAt.toLocaleString()],
    ["Id Token", session.idToken],
    ["Userinfo", <ul>{Object.entries(session.userinfo).map(([k, v]) => (<li key={k}><strong>{k}:</strong> {JSON.stringify(v)}</li>))}</ul>],
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
  </Container>
}

export default App;
