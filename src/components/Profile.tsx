import { MsgBox } from "@halliday/mui-msgbox";
import { toast } from "@halliday/mui-toast";
import { RestError } from "@halliday/rest";
import { ArrowBack, Close, CloseOutlined, EditOutlined, NavigateNextOutlined } from "@mui/icons-material";
import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, IconButton, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, Slide, SlideProps, Stack, styled, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { L } from "@halliday/react-i18n";
import { MyAccountAvatar } from "./AccountAvatar";
import { SelectLanguage } from "./Language";
import ident from "@halliday/ident";
import { useUser } from "../session";



export interface MyProfileDialogProps extends DialogProps {
    onClose?: (ev: {}, reason: "backdropClick" | "escapeKeyDown" | "closeButtonClick" | "logout" | "password-changed" | "email-changed" | "user-deleted") => void
}

export function MyProfileDialog(props: MyProfileDialogProps) {
    const { onClose } = props;

    function handleCloseClick(ev: React.MouseEvent) {
        onClose?.(ev, "closeButtonClick")
    }

    return <Dialog {...props} fullWidth PaperProps={{ sx: { maxWidth: 350 } }}>

        <IconButton sx={{ position: "absolute", right: 8, top: 8, zIndex: 1 }} onClick={handleCloseClick}><Close /></IconButton>
        <MyProfilePanel onClose={onClose} />
    </Dialog>
}

export interface MyProfilePanelProps {
    onClose?: (ev: {}, reason: "closeButtonClick" | "logout" | "password-changed" | "email-changed" | "user-deleted") => void,
    defaultTab?: ProfilePanelTab
}

interface TabProps {
    onClose?: (ev: {}, reason: "closeButtonClick" | "logout" | "password-changed" | "email-changed" | "user-deleted") => void,
    onTabChange: (ev: {}, tab: ProfilePanelTab) => void
}

export type ProfilePanelTab = "profile" | "delete-account" | "change-password" | "change-email" | "settings";

const Form = styled("form")({});

export function MyProfilePanel(props: MyProfilePanelProps) {
    const { onClose } = props;

    const [previousTab, setPreviousTab] = useState(props.defaultTab ?? "profile");
    const [tab, setTab] = useState<ProfilePanelTab>(props.defaultTab ?? "profile");

    const userinfo = useUser();

    const boxRef = React.useRef<HTMLElement>(null);

    if (!userinfo) return null;

    function handleTabChange(ev: {}, newTab: ProfilePanelTab) {
        setPreviousTab(tab);
        setTab(newTab);
    }

    const tabProps: TabProps = {
        onTabChange: handleTabChange,
        onClose: onClose
    }

    const slideProps = (t: ProfilePanelTab): Partial<SlideProps> => ({
        appear: false,
        in: tab === t,
        mountOnEnter: true,
        unmountOnExit: true,
        container: boxRef.current,
        easing: "ease-in-out",
    });

    return <Box sx={{ position: "relative", height: 540, width: 350, overflow: "hidden" }} ref={boxRef}>
        <Slide {...slideProps("profile")} direction="right">
            <ProfileTab {...tabProps} />
        </Slide>
        <Slide {...slideProps("settings")} direction={(tab === "profile" || previousTab == "profile") ? "left" : "right"} >
            <SettingsTab {...tabProps} />
        </Slide>
        <Slide {...slideProps("change-email")} direction="left" >
            <TabChangeEmail {...tabProps} />
        </Slide>
        <Slide {...slideProps("change-password")} direction="left" >
            <TabChangePassword {...tabProps} />
        </Slide>
        <Slide {...slideProps("delete-account")} direction="left" >
            <TabDeleteAccount {...tabProps} />
        </Slide>
    </Box>;
}

////////////////////////////////////////////////////////////////////////////////

const ProfileTab = React.forwardRef((props: TabProps, ref: React.Ref<HTMLDivElement>) => {
    const { onTabChange, onClose } = props;

    const userinfo = useUser();

    const [editName, setEditName] = useState(false);

    function handleLogoutClick(ev: React.MouseEvent) {
        ident.logout();
        onClose?.(ev, "logout");
    }

    function handleKeyUp(ev: React.KeyboardEvent<HTMLInputElement>) {
        const input = ev.target as HTMLInputElement;
        const preferred_username = input.value;
        if (ev.key === "Enter") {
            MsgBox({
                title: "Change Displayname",
                text: "Do you want to change your displayname?",
                handleYes: () => {
                    ident.session!.updateUser({ preferred_username }).then(() => {
                        // user.preferred_username = preferred_username;
                        // sess!.userinfo = user;
                        // sess!.store();
                        setEditName(false);
                        // setSession(sess!, "updated");
                        toast("Displayname changed.");
                    }, (err) => {
                        reportError(err);
                    });
                },
                handleCancel: () => { },
            })
        }
    }

    function editPicture() {

    }

    return <Box ref={ref} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Typography component="h2" sx={{ fontSize: "1.25rem", px: 3, pt: 5, mb: 2, height: "1.5em", display: "flex", alignItems: "center" }}>Profile</Typography>
        <DialogContent sx={{ flexGrow: 1 }}>
            <Box sx={{ mb: 2 }}>
                <Box sx={{ width: 100, height: 80, px: "10px", boxSizing: "border-box", mx: "auto", position: "relative", "&:hover .edit": { opacity: 1 } }}>
                    <MyAccountAvatar sx={{ width: 80, height: 80 }} />

                    <IconButton className="edit" onClick={editPicture} sx={{ position: "absolute", top: 20, left: 100, opacity: 0, transition: (theme) => theme.transitions.create("opacity", { duration: theme.transitions.duration.shortest }) }}>
                        <EditOutlined />
                    </IconButton>
                </Box>
            </Box>
            <Stack direction="row" alignItems="center" sx={{ "&:hover .edit": { opacity: 1 }, mb: 1, pr: 1.5 }}>
                <Box sx={{ px: 1.5, py: 1, flexGrow: 1 }}>
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{L("email")}</Typography>
                    <Typography>{userinfo!.email}</Typography>
                </Box>
                <Box>
                    <IconButton className="edit" sx={{ opacity: 0, transition: (theme) => theme.transitions.create("opacity", { duration: theme.transitions.duration.shortest }) }} onClick={(ev) => onTabChange(ev, "change-email")}>
                        <EditOutlined />
                    </IconButton>
                </Box>
            </Stack>
            {!userinfo!.email_verified && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    <Box sx={{mb: 1}}>{L("email_not_verified")}</Box>
                    <Button size="small" color="inherit" sx={{mx: "-5px"}}>Resend Email</Button>
                </Alert>
            )}
            {
                editName ? (
                    <Form id="preferred_username" onSubmit={preventDefault}>
                        <TextField label={L("displayname")} id="preferred_username" autoFocus type="text" autoComplete="username" fullWidth defaultValue={userinfo!.preferred_username} variant="filled" onKeyUp={handleKeyUp} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setEditName(false)}><CloseOutlined /></IconButton></InputAdornment> }} />
                    </Form>
                ) : (
                    <Stack direction="row" alignItems="center" sx={{ "&:hover .edit": { opacity: 1 }, my: "-1px", pr: 1.5 }}>
                        <Box sx={{ px: 1.5, py: 1, flexGrow: 1 }}>
                            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{L("displayname")}</Typography>
                            {
                                userinfo!.preferred_username ?
                                    <Typography>{userinfo!.preferred_username}</Typography> :
                                    <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>no displayname</Typography>
                            }
                        </Box>
                        <Box>
                            <IconButton className="edit" onClick={() => setEditName(true)} sx={{ opacity: 0, transition: (theme) => theme.transitions.create("opacity", { duration: theme.transitions.duration.shortest }) }}>
                                <EditOutlined />
                            </IconButton>
                        </Box>
                    </Stack>
                )
            }
            <List sx={{ mt: 5 }}>
                <ListItemButton onClick={(ev) => onTabChange(ev, "settings")}>
                    <ListItemIcon><NavigateNextOutlined /></ListItemIcon>
                    <ListItemText primary={L("settings")} />
                </ListItemButton>
            </List>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", p: 2 }}>
            <Button variant="contained" onClick={handleLogoutClick}>Logout</Button>
        </DialogActions>
    </Box>
});

////////////////////////////////////////////////////////////////////////////////

const SettingsTab = React.forwardRef((props: TabProps, ref: React.Ref<HTMLDivElement>) => {
    const onTabChange = props.onTabChange;

    return <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column" }} ref={ref}>
        <Typography component="h2" sx={{ fontSize: "1.25rem", px: 3, pt: 5, mb: 2, height: "1.5em", display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 2 }} onClick={(ev) => onTabChange(ev, "profile")}><ArrowBack /></IconButton>
            {L("settings")}
        </Typography>
        <DialogContent sx={{ flexGrow: 1 }}>
            <List sx={{ mb: 2 }}>
                <ListItemButton onClick={(ev) => onTabChange(ev, "change-email")}>
                    <ListItemIcon><NavigateNextOutlined /></ListItemIcon>
                    <ListItemText primary={L("change_email")} />
                </ListItemButton>
                <ListItemButton onClick={(ev) => onTabChange(ev, "change-password")}>
                    <ListItemIcon><NavigateNextOutlined /></ListItemIcon>
                    <ListItemText primary={L("change_password")} />
                </ListItemButton>
                <ListItemButton onClick={(ev) => onTabChange(ev, "delete-account")}>
                    <ListItemIcon><NavigateNextOutlined /></ListItemIcon>
                    <ListItemText primary={L("delete_account")} />
                </ListItemButton>
            </List>
            <Box sx={{ px: 2 }}>
                <Typography htmlFor="select-language" sx={{ mr: 2 }} component="label">{L("language")}</Typography>
                <SelectLanguage id="select-language" name="select-language" />
            </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", p: 2 }}>
            <Button onClick={(ev) => onTabChange(ev, "profile")} color="inherit">{L("cancel")}</Button>
        </DialogActions>
    </Box>;

})


////////////////////////////////////////////////////////////////////////////////

const TabChangeEmail = React.forwardRef((props: TabProps, ref: React.Ref<HTMLDivElement>) => {
    const [newEmail, setNewEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        setLoading(true);
        try {
            await ident.instructEmailChange(newEmail);
        } catch (err) {
            reportError(err);
            return
        } finally {
            setLoading(false);
        }
        setSubmitted(true);
    }

    return <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column" }} ref={ref}>
        <Typography component="h2" sx={{ fontSize: "1.25rem", px: 3, pt: 5, mb: 2, height: "1.5em", display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 2 }} onClick={(ev) => props.onTabChange(ev, "settings")}><ArrowBack /></IconButton>
            {L("change_email")}
        </Typography>
        <DialogContent sx={{ flexGrow: 1 }}>
            <DialogContentText sx={{ mb: 2 }}>{L("change_email_text")}</DialogContentText>
            <form id="new-email" onSubmit={preventDefault}>
                <TextField label={L("email")} id="email" type="email" autoComplete="email" fullWidth value={newEmail} autoFocus onChange={(ev) => setNewEmail(ev.target.value)} variant="filled" sx={{ mb: 2 }} disabled={loading || submitted} />
            </form>
            {submitted && (
                <Alert severity="success">
                    <AlertTitle>You've Got Mail!</AlertTitle>
                    Check your mails for a mail from us, and click the link inside the mail to continue.
                </Alert>
            )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", flexDirection: "column", gap: 1, p: 2 }}>
            <Button type="submit" form="new-email" disabled={loading || submitted} variant="contained" onClick={handleSubmit}>{L("change_email_now")}</Button>
            <Button onClick={(ev) => props.onTabChange(ev, "settings")} color="inherit">{L("cancel")}</Button>
        </DialogActions>
    </Box>;
});

////////////////////////////////////////////////////////////////////////////////

const TabChangePassword = React.forwardRef((props: TabProps, ref: React.Ref<HTMLDivElement>) => {
    const { onClose } = props;
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);

    const userinfo = useUser();

    const handleSubmit = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        setLoading(true);
        setErr(false);
        try {
            await ident.session!.updatePassword(oldPassword, newPassword);
        } catch (err) {
            if (err instanceof RestError) {
                if (err.code === 400) {
                    setErr(true);
                    return
                }
            }
            await reportError(err);
            return
        }
        finally {
            setLoading(false);
        }
        toast(L("password_changed"));
        onClose?.({}, "password-changed");
    }

    return <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column" }} ref={ref}>
        <Typography component="h2" sx={{ fontSize: "1.25rem", px: 3, pt: 5, mb: 2, height: "1.5em", display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 2 }} onClick={(ev) => props.onTabChange(ev, "settings")}><ArrowBack /></IconButton>
            {L("change_password")}
        </Typography>
        <DialogContent sx={{ flexGrow: 1 }}>
            <DialogContentText sx={{ mb: 2 }}>{L("change_password_text")}</DialogContentText>
            <form id="new-password" onSubmit={preventDefault}>
                <input type="hidden" name="name" value={userinfo!.email} />
                <TextField label={L("old_password")} id="old-password" type="password" autoComplete="current-password" fullWidth value={oldPassword} autoFocus onChange={(ev) => setOldPassword(ev.target.value)} variant="filled" sx={{ mb: 3 }} error={err} helperText={err ? "Wrong password." : undefined} />
                <TextField label={L("new_password")} id="new-password" type="password" autoComplete="new-password" fullWidth value={newPassword} onChange={(ev) => setNewPassword(ev.target.value)} variant="filled" sx={{ mb: 2 }} />
                <TextField label={L("repeat_new_password")} id="new-password2" type="password" autoComplete="new-password" fullWidth value={newPassword2} onChange={(ev) => setNewPassword2(ev.target.value)} variant="filled" />
            </form>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", flexDirection: "column", gap: 1, p: 2 }}>
            <Button type="submit" form="new-password" disabled={loading} variant="contained" onClick={handleSubmit}>{L("change_password_now")}</Button>
            <Button onClick={(ev) => props.onTabChange(ev, "settings")} color="inherit">{L("cancel")}</Button>
        </DialogActions>
    </Box>;
});

////////////////////////////////////////////////////////////////////////////////


const TabDeleteAccount = React.forwardRef((props: TabProps, ref: React.Ref<HTMLDivElement>) => {
    const { onClose } = props;
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        setLoading(true);
        try {
            await ident.session!.deleteUser();
        } catch (err) {
            reportError(err);
            return
        } finally {
            setLoading(false);
        }
        toast(L("account_delete"));
        onClose?.({}, "user-deleted");
    }

    return <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column" }} ref={ref}>
        <Typography component="h2" sx={{ fontSize: "1.25rem", px: 3, pt: 5, mb: 2, height: "1.5em", display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 2 }} onClick={(ev) => props.onTabChange(ev, "settings")}><ArrowBack /></IconButton>
            {L("delete_account")}
        </Typography>
        <DialogContent sx={{ flexGrow: 1 }}>
            <DialogContentText sx={{ mb: 2 }}>{L("delete_account_text")}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", flexDirection: "column", gap: 1, p: 2 }}>
            <Button type="submit" disabled={loading} variant="contained" onClick={handleSubmit} color="error">{L("delete_account_now")}</Button>
            <Button onClick={(ev) => props.onTabChange(ev, "settings")} color="inherit">{L("cancel")}</Button>
        </DialogActions>
    </Box>;
});


////////////////////////////////////////////////////////////////////////////////


function preventDefault(ev: React.SyntheticEvent) {
    ev.preventDefault();
}