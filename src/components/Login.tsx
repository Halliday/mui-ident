import ident, { api, IdentityEventType } from "@halliday/ident";
import { ArrowBack, Close } from "@mui/icons-material";
import { Alert, AlertTitle, BoxProps, Button, Dialog, DialogContent, DialogProps, IconButton, Link, Stack, styled, TextField, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { useLanguage } from "../i18n";
import { delay } from "../tools";
import DividerWithLabel from "./DividerWithLabel";
import { ErrorView } from "./ErrorView";
import LoadingButton from "./LoadingButton";
import SignInWithGoogle from "./sign-in-with/Google";
import SignInWithWaziup from "./sign-in-with/Waziup";

////////////////////////////////////////////////////////////////////////////////


export interface LoginDialogProps extends DialogProps { }

export function LoginDialog(props: LoginDialogProps) {
    function handleClose() {
        props.onClose?.({}, "backdropClick");
    }

    return <Dialog {...props} fullWidth PaperProps={{ sx: { maxWidth: 350 } }}>
        <LoginPanel onClose={handleClose} />
    </Dialog>
}

////////////////////////////////////////////////////////////////////////////////

type LoginPanelTab = "login" | "register" | "reset-password" | "complete-reset-password";
const tabTitels: Record<LoginPanelTab, string> = {
    "login": "Login",
    "register": "Register",
    "reset-password": "Reset Password",
    "complete-reset-password": "Reset Password",
}

const Form = styled("form")({});

const TextButton = styled("span")({
    cursor: "pointer",
    "&:hover": {
        textDecoration: "underline"
    }
})

const emailRegExp = /\S+@\S+/;

export interface LoginPanelProps extends BoxProps {
    onClose?: (ev: {}) => void;
    reason?: IdentityEventType;
}

export function LoginPanel(props: LoginPanelProps) {
    const { onClose, reason } = props;

    const [tab, setTab] = useState<LoginPanelTab>(reason === "password-reset-required" ? "complete-reset-password" : "login");

    function changeTab(tab: LoginPanelTab) {
        setTab(tab);
        setShowErrors(false);
    }

    const theme = useTheme();

    const [registered, setRegistered] = useState(false);
    const [resetted, setResetted] = useState(false);
    const [resetCompleted, setResetCompleted] = useState(false);

    const [email, setEmail] = useState(ident.emailHint || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const [showErrors, setShowErrors] = useState(false);

    const [loginError, setLoginError] = useState<any>(null);
    const [registerError, setRegisterError] = useState<any>(null);
    const [resetError, setResetError] = useState<any>(null);
    const [resetCompleteError, setResetCompleteError] = useState<any>(null);

    const emailError = !emailRegExp.test(email);
    let emailHelperText: string | undefined;
    if (showErrors) {
        if (!email.trim()) emailHelperText = "Email address can not be empty.";
        else if (emailError) emailHelperText = "Invalid email address format."
    }

    const usernameError = tab === "register" && username.trim() === "";
    let usernameHelperText: string | undefined;
    if (showErrors) {
        if (usernameError) usernameHelperText = "Username can not be empty."
    }

    const passwordError = tab === "register" && password === "";
    let passwordHelperText: string | undefined;
    if (showErrors) {
        if (passwordError) passwordHelperText = "Password can not be empty."
    }

    const confirmPasswordError = tab === "register" && password !== confirmPassword;
    let confirmPasswordHelperText: string | undefined;
    if (showErrors) {
        if (confirmPasswordError) confirmPasswordHelperText = "Passwords do not match."
    }

    const hasError = emailError || usernameError || passwordError || confirmPasswordError;
    if (!hasError && showErrors) setShowErrors(false);

    const d = theme.transitions.duration.standard * 2;

    function handleCloseClick() {
        if (onClose) onClose("closeButtonClick")
    }

    async function performLogin() {
        if (emailError) {
            setShowErrors(true);
            return
        }
        setLoading(true);

        try {
            await delay(ident.login(email, password), d);
        } catch (err) {
            setLoading(false);
            setLoginError(err);
            return
        }

        setLoading(false);
        setLoginError(null);
        setRegistered(true);
        if (onClose) onClose("login");
    }

    async function handleRegistrationClick() {
        if (emailError || usernameError || confirmPasswordError) {
            setShowErrors(true);
            return
        }
        setLoading(true);
        try {
            await delay(ident.register({
                locale: navigator.language,
                email, preferred_username: username,
            }, password), d);
        } catch (err) {
            setLoading(false);
            setRegisterError(err);
            return
        }

        setLoading(false);
        setRegisterError(null);
        setRegistered(true);
    }

    async function handleResetPasswordClick() {
        if (passwordError || confirmPasswordError) {
            setShowErrors(true);
            return
        }
        setLoading(true);
        try {
            await delay(ident.resetPassword(password), d);
        } catch (err) {
            setLoading(false);
            setResetCompleteError(err);
            return
        }

        setTab("login");
        setPassword("");
        setConfirmPassword("");
        setLoading(false);
        setResetCompleteError(null);
        setResetCompleted(true);
    }


    async function handleInstructPasswordResetClick() {
        if (emailError) {
            setShowErrors(true);
            return
        }
        setLoading(true);

        try {
            await delay(ident.instructPasswordReset(email), d);
        } catch (err) {
            setLoading(false);
            setResetError(err);
            return
        }

        setLoading(false);
        setResetError(null);
        setResetted(true);
    }

    let body: JSX.Element;
    switch (tab) {
        case "login":
            body = <>
                {reason === "login-for-email-verify-required" && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Please login to confirm your email address.
                    </Alert>
                )}
                {reason === "login-for-registration-required" && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Please login to confirm your email address.
                    </Alert>
                )}
                <Form id="login" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mb: 5 }}>
                    <TextField label="Email" id="email" autoComplete="email" autoFocus fullWidth value={email} onChange={ev => { setEmail(ev.target.value); }} disabled={loading} error={showErrors && emailError} helperText={emailHelperText} />
                    <TextField label="Password" id="password" type="password" autoComplete="current-password" fullWidth value={password} onChange={ev => { setPassword(ev.target.value); }} disabled={loading} />
                    <LoadingButton size="large" variant="contained" disableElevation disabled={loading} loading={loading} onClick={performLogin}>Login</LoadingButton>
                </Form>
                {resetCompleted &&
                    <Alert severity="success" sx={{ mb: 3 }}>
                        You can now login with your new password.
                    </Alert>
                }
                {reason === "logout" && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Logout successfull.
                    </Alert>
                )}
                {loginError && <ErrorView err={loginError} sx={{ mb: 3 }} />}
                <Typography sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextButton role="button" onClick={() => changeTab("register")}>Register?</TextButton>
                    <span>•</span>
                    <TextButton role="button" onClick={() => changeTab("reset-password")}>Forgot password?</TextButton>
                </Typography>
                <SignInWith />
            </>;
            break;
        case "register":
            body = <>
                <Form id="register" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mb: 5 }}>
                    <TextField label="Username" id="username" autoComplete="username" autoFocus fullWidth disabled={loading || registered} value={username} onChange={ev => { setUsername(ev.target.value); }} error={showErrors && usernameError} helperText={usernameHelperText} />
                    <TextField label="Email" id="email" type="email" autoComplete="email" fullWidth disabled={loading || registered} value={email} onChange={ev => { setEmail(ev.target.value); }} error={showErrors && emailError} helperText={emailHelperText} />

                    {/* <Typography variant="body2" sx={{mb: 2}}>
                        <InfoOutlined fontSize="small" sx={{mr: 0.25, verticalAlign: "middle"}}/>
                        We keep your email private. It is not visible on the website.
                    </Typography> */}

                    <TextField label="Password" id="new-password" type="password" autoComplete="new-password" fullWidth disabled={loading || registered} value={password} onChange={ev => { setPassword(ev.target.value); }} error={showErrors && passwordError} helperText={passwordHelperText} />
                    <TextField label="Confirm Password" id="confirm-new-password" type="password" autoComplete="new-password" fullWidth disabled={loading || registered} value={confirmPassword} onChange={ev => { setConfirmPassword(ev.target.value); }} error={showErrors && confirmPasswordError} helperText={confirmPasswordHelperText} />

                    <Typography variant="body2" sx={{ mb: 2 }}>
                        By registering this platform you agree to our <Link href="#">terms and conditions</Link>.
                    </Typography>

                    {!registered && <LoadingButton size="large" variant="contained" disableElevation disabled={loading} loading={loading} onClick={handleRegistrationClick}>Register</LoadingButton>}
                </Form>
                {registerError && <ErrorView err={registerError} sx={{ mb: 3 }} />}
                {registered &&
                    <Alert severity="success">
                        <AlertTitle>You've Got Mail!</AlertTitle>
                        Check your mails for a mail from us, and click the link inside the mail to complete the registration.
                    </Alert>
                }
                <SignInWith />
            </>
            break;
        case "reset-password":
            body = <>
                <Form id="reset-password" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mb: 5 }}>
                    <TextField label="Email" id="email" type="email" autoComplete="email" autoFocus fullWidth disabled={loading || resetted} value={email} onChange={ev => { setEmail(ev.target.value); }} error={showErrors && emailError} helperText={emailHelperText} />
                    {!resetted && <LoadingButton size="large" variant="contained" disableElevation disabled={loading} loading={loading} onClick={handleInstructPasswordResetClick}>Reset</LoadingButton>}
                </Form>
                {resetError && <ErrorView err={resetError} sx={{ mb: 3 }} />}
                {resetted &&
                    <Alert severity="success">
                        <AlertTitle>You've Got Mail!</AlertTitle>
                        Check your mails for a mail from us, and click the link inside the mail to continue.
                    </Alert>
                }
                <SignInWith />
            </>;
            break;
        case "complete-reset-password":
            body = <>
                <Form id="complete-reset-password" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mb: 5 }}>
                    <TextField label="Email" id="email" type="email" autoComplete="email" fullWidth disabled value={ident.emailHint} />
                    <TextField label="Password" id="new-password" type="password" autoComplete="new-password" fullWidth disabled={loading || resetCompleted} value={password} onChange={ev => { setPassword(ev.target.value); }} error={showErrors && passwordError} helperText={passwordHelperText} />
                    <TextField label="Confirm Password" id="confirm-new-password" type="password" autoComplete="new-password" fullWidth disabled={loading || resetCompleted} value={confirmPassword} onChange={ev => { setConfirmPassword(ev.target.value); }} error={showErrors && confirmPasswordError} helperText={confirmPasswordHelperText} />
                    {!resetCompleted && <LoadingButton size="large" variant="contained" disableElevation disabled={loading} loading={loading} onClick={handleResetPasswordClick}>Change Password</LoadingButton>}
                </Form>
                {resetCompleteError && <ErrorView err={resetCompleteError} sx={{ mb: 3 }} />}
            </>;
            break;
    }

    return <>
        <Typography component="h2" sx={{ fontSize: "1.25rem", px: 3, pt: 5, mb: 2, height: "1.5em", display: "flex", alignItems: "center" }}>
            {tab !== "login" && tab !== "complete-reset-password" && <IconButton sx={{ mr: 2 }} onClick={() => changeTab("login")}><ArrowBack /></IconButton>}
            {tabTitels[tab]}
        </Typography>
        <DialogContent>{body}</DialogContent>
        <IconButton sx={{ position: "absolute", right: 8, top: 8 }} onClick={handleCloseClick}><Close /></IconButton>
    </>;
}


var globalSocialProviders: Promise<api.SocialProvider[]>;

function SignInWith() {
    const [socialProviders, setSocialProviders] = useState<api.SocialProvider[]>([]);
    useEffect(() => {
        if (globalSocialProviders === undefined) {
            globalSocialProviders = api.socialProviders();
        }
        globalSocialProviders.then(setSocialProviders);
    }, []);
    return <>
        {socialProviders.length > 0 && <DividerWithLabel>or</DividerWithLabel>}
        <Stack spacing={1} alignItems="center">
            {socialProviders.map(socialProvider)}
        </Stack>
    </>
}

function socialProvider(p: api.SocialProvider): React.ReactNode {

    async function performSocialLogin() {
        window.location.href = ident.socialLoginUri(p.iss);
    }

    const props = {
        onClick: performSocialLogin,
        key: p.iss,
    } as const;

    switch (p.iss) {
        case "https://accounts.google.com":
            // https://accounts.google.com/.well-known/openid-configuration
            return <SignInWithGoogle {...props} />;

        case "https://login.waziup.io/auth/realms/waziup":
            // https://login.waziup.io/auth/realms/waziup/.well-known/openid-configuration
            return <SignInWithWaziup {...props} />

        default:
            return <Button variant="outlined" {...props}>{new URL(p.iss).hostname}</Button>;
    }
}