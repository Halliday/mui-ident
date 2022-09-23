import { Button, ButtonProps, CircularProgress } from "@mui/material";
import React from "react";

export interface LoadingButtonProps extends ButtonProps {
    loading?: boolean
}

export default function LoadingButton(props: LoadingButtonProps) {
    const { loading, ...buttonprops } = props;
    return <Button {...buttonprops}>
        {props.children}
        {loading && (
            <CircularProgress
                size={24}
                sx={{
                    color: "primary.main",
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                }}
            />
        )}
    </Button>
}