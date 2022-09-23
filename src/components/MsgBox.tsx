import { ErrorOutline } from "@mui/icons-material";
import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, SxProps } from "@mui/material";
import React, { useInsertionEffect, useState } from "react";
import { checkError } from "./ErrorView";

export type MsgBoxState = {
    title?: React.ReactNode,
    text: React.ReactNode,
    handleOk?: React.MouseEventHandler,
    handleYes?: React.MouseEventHandler,
    handleNo?: React.MouseEventHandler,
    handleCancel?: React.MouseEventHandler,
    handleClose?: (ev: {}) => void,
    keepOpen?: boolean,
    buttonProps?: ButtonProps,
    sx?: SxProps
}

type MsgBoxInstance = {
    setState: (state: MsgBoxState | null) => void,
}

let instance: MsgBoxInstance | null = null;

export function MsgBoxProvider() {
    const [state, setState] = useState<MsgBoxState | null>(null);
    const [open, setOpen] = React.useState(false);

    useInsertionEffect(() => {
        const i: MsgBoxInstance = {
            setState: (state) => {
                if (state === null) {
                    setOpen(false);
                } else {
                    setState(state);
                    setOpen(true);
                }
            }
        };
        if(instance !== null) {
            console.error("There are multiple <MsgBoxProvider/> instances! Please use only one <MsgBoxProvider/> on the page.");
            return
        }
        instance = i;
        return () => {
            if(instance === i)
                instance = null;
        }
    }, []);

    const handleClose = (ev: {}) => {
        setOpen(false);
        state?.handleClose?.(ev);
    };

    function fnHandler(h: React.MouseEventHandler): React.MouseEventHandler {
        return (ev: React.MouseEvent) => {
            h(ev);
            if (!state?.keepOpen) handleClose(ev);
        }
    }

    let content: JSX.Element | undefined;
    if (state) {
        content = <>
            <DialogTitle id="msg-box-title">{state.title}</DialogTitle>
            <DialogContent sx={{ minWidth: 350 }}>
                <DialogContentText id="msg-box-description">{state.text}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {state.handleOk && <Button onClick={fnHandler(state.handleOk)} autoFocus {...state.buttonProps}>OK</Button>}
                {state.handleYes && <Button onClick={fnHandler(state.handleYes)} autoFocus {...state.buttonProps}>Yes</Button>}
                {state.handleNo && <Button onClick={fnHandler(state.handleNo)} {...state.buttonProps}>No</Button>}
                {state.handleCancel && <Button onClick={fnHandler(state.handleCancel)} {...state.buttonProps}>Cancel</Button>}
            </DialogActions>
        </>
    }

    return <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="msg-box-title"
        aria-describedby="msg-box-description"
        PaperProps={{ sx: state?.sx }}
    >
        {content}
    </Dialog>
}

export function msgBox(state: MsgBoxState) {
    if (instance === null) throw new Error("No active <MsgBoxProvider>.");
    instance.setState(state);
}

export async function showError(err: any) {
    if (!err) return;
    return new Promise((resolve) => {
        const [title, text] = checkError(err);
        msgBox({
            title: <><ErrorOutline sx={{ verticalAlign: "sub", mr: 1 }} />{title}</>,
            text,
            sx: { bgcolor: "#fdeded", color: "#5f2120" },
            handleOk: () => {},
            handleClose: resolve,
            buttonProps: {
                color: "error"
            }
        });
    })
}