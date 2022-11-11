import { ArrowDropDown } from "@mui/icons-material";
import { Button, ButtonProps, ListItemIcon, ListItemText, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";
import { Language, loadLanguages, setLanguage, useLanguage } from "@halliday/react-i18n";

interface SelectLanguageProps extends ButtonProps {

}

export function SelectLanguage(props: SelectLanguageProps) {
    const code = useLanguage();

    const [languages, setLanguages] = useState<Language[]>([]);
    useEffect(() => { loadLanguages().then(setLanguages); }, []);

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    function handleButtonClick(ev: React.MouseEvent<Element>) {
        setAnchorEl(ev.currentTarget as Element);
    }
    function handleClose() {
        setAnchorEl(null);
    }

    if (languages.length === 0)
        return null;

    const open = anchorEl !== null;

    const currentLanguage = languages.find(l => l.code === code)!;

    return <>
        <Button onClick={handleButtonClick} color="inherit" style={{backgroundColor: open ? "grey.100" : undefined}} {...props}>
            <img src={currentLanguage.flag} alt={currentLanguage.name} style={{height: "18px", width: "30px"}} />
            <ArrowDropDown />
        </Button>
        <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
            {
                languages.map(l => (
                    <MenuItem key={l.code} value={l.code} dense onClick={() => setLanguage(l.code)} selected={l.code === code}>
                        <ListItemIcon sx={{ mr: 2 }}>
                            <img src={l.flag} alt={l.name} style={{height: "18px", width: "30px"}} /> 
                        </ListItemIcon>
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