import { Portal, Snackbar } from "@mui/material";
import React, { useInsertionEffect } from "react";


type Toast = {
    message?: string,
    action?: React.ReactNode
    autoHideDuration?: number,
}

type ToastInstance = {
    showToast: (state: Toast) => void,
}

let instance: ToastInstance | null = null;

const defaultAutoHideDuration = 6000;

export function ToastProvider() {
    const [open, setOpen] = React.useState(false);
    const [toast, setToast] = React.useState<Toast>({});

    function handleClose() {
        setOpen(false);
    }

    useInsertionEffect(() => {
        const i: ToastInstance = {
            showToast: (toast) => {
                setToast(toast);
                setOpen(true);
            }
        };
        if (instance !== null) {
            console.error("There are multiple <ToastProvider/> instances! Please use only one <ToastProvider/> on the page.");
            return
        }
        instance = i;
        return () => {
            if (instance === i)
                instance = null;
        }
    }, []);

    return <Portal container={document.body}>
        <Snackbar
            open={open}
            autoHideDuration={toast.autoHideDuration ?? defaultAutoHideDuration}
            onClose={handleClose}
            message={toast.message}
            action={toast.action}
        />
    </Portal>;
}

export function showToast(msg: string): void;
export function showToast(toast: Toast): void;
export function showToast(toast: Toast | string): void {
    if (instance === null) {
        console.error("There is no <ToastProvider/> on the page.");
        return
    }
    if (typeof toast === "string") {
        instance.showToast({ message: toast });
    } else {
        instance.showToast(toast);
    }
}