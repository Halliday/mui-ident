import { ArrowDropDown } from "@mui/icons-material";
import { Button, ButtonProps, ListItemIcon, ListItemText, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import { setLanguage, useLanguage } from "../i18n";

interface SelectLanguageProps extends ButtonProps {

}

export function SelectLanguage(props: SelectLanguageProps) {
    const lang = useLanguage();

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    function handleButtonClick(ev: React.MouseEvent<Element>) {
        setAnchorEl(ev.currentTarget as Element);
    }
    function handleClose() {
        setAnchorEl(null);
    }
    const open = anchorEl !== null;
    const Flag = languages.find(l => l.id === lang)!.Flag;
    return <>
        <Button onClick={handleButtonClick} color="inherit" style={{backgroundColor: open ? "grey.100" : undefined}} {...props}>
            <Flag />
            <ArrowDropDown />
        </Button>
        <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
            {
                languages.map(l => (
                    <MenuItem key={l.id} value={l.id} dense onClick={() => setLanguage(l.id)} selected={l.id === lang}>
                        <ListItemIcon sx={{ mr: 2 }}><l.Flag /></ListItemIcon>
                        <ListItemText primary={l.name} secondary={l.country} />
                    </MenuItem>
                ))
            }
        </Menu>
    </>;
}

interface LanguageContextProps {
    children?: React.ReactNode
}

export function LanguageContext(props: LanguageContextProps) {
    const children = props.children;
    const lang = useLanguage();
    return <React.Fragment key={lang}>{children}</React.Fragment>;
}

type Language = {
    id: string,
    name: string,
    country: string,
    Flag:React.ComponentType
}

const languages: Language[] = [{
    id: "en",
    name: "English",
    country: "United States",
    Flag: FlagUS,
}, {
    id: "de",
    name: "German",
    country: "Deutschland",
    Flag: FlagDE,
}];

function FlagDE() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" width={30} height={18}>
        <path d="M0 0h5v3H0z" />
        <path fill="#D00" d="M0 1h5v2H0z" />
        <path fill="#FFCE00" d="M0 2h5v1H0z" />
    </svg>;
}

function FlagUS() {
    return <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 7410 3900" width={30} height={18}>
        <path fill="#b22234" d="M0 0h7410v3900H0z" />
        <path d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0" stroke="#fff" strokeWidth="300" />
        <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
    </svg>;
}