import { Alert, AlertProps, AlertTitle, Box } from "@mui/material";
import React from "react";
import { snake2title } from "../tools";
import { RestError } from "@halliday/rest";

export interface ErrorViewProps extends AlertProps {
    err?: any
}

export function ErrorView(props: ErrorViewProps) {
    const { err, ...alertProps } = props;

    if (!err) return null;
    let title = errorTitle(err);
    let message = errroMessage(err);
    if (title && !message) {
        message = title;
        title = undefined;
    }

    return <Alert severity="error" {...alertProps}>
        {title ? <AlertTitle>{title}</AlertTitle> : null}
        {message}
    </Alert>
}

function errorTitle(err: any): string | undefined {
    if (typeof err === "object") {
        if ("title" in err) return snake2title(`${err.title}`);
        if ("name" in err) return snake2title(`${err.name}`);
    }
}

function errroMessage(err: any, withCode = true): string {
    if (typeof err === "string") return err;
    if (typeof err === "object") {
        if (withCode && "code" in err) return `Code ${err.code}: ${errroMessage(err, false)}`;
        if ("error" in err) return `${err.error}`;
        if ("message" in err) return `${err.message}`;
        if ("desc" in err) return `${err.desc}`;
        if ("msg" in err) return `${err.msg}`;
        if ("msg" in err) return `${err.msg}`;
        if ("title" in err) return `${err.title}`;
        if ("name" in err) return `${err.name}`;
        return "";
    }
    return `${err}`;
}

export function checkError(err: any): [title: string, content: JSX.Element | string] {
    let title: string;
    let text: JSX.Element | string;

    if (err instanceof RestError) {
        title = "API Error";
        text = <>
            Failed to call the server API.<br />
            {err.code} {err.name.toUpperCase()}<br />
            {monospace(`${err.method} ${err.url}`)}<br />
            The server returned {monospace(`${err.code} ${err.desc}`)}.<br />
            Message: {monospace(`${err.desc}`)}
        </>
    } else {
        if (err && typeof err === "object" && "title" in err) title = `${(err as any).title}`;
        else if (err && typeof err === "object" && "name" in err) title = `${(err as any).name}`;
        else title = "Error";
        if (err && typeof err === "object" && "message" in err) text = `${(err as any).message}`
        else if (err && typeof err === "object" && "msg" in err) text = `${(err as any).msg}`
        else text = `${err}`;
    }
    return [title, text];
}

function monospace(text: string) {
    return <Box sx={{ fontFamily: 'Monospace' }} component="span">{text}</Box>
}