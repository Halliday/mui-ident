import { Box, BoxProps, Divider, Typography } from "@mui/material";

export interface DividerWithLabelProps extends BoxProps { }

export default function DividerWithLabel(props: DividerWithLabelProps) {
    return <Box sx={{ position: "relative", py: 2 }}>
        <Divider />
        <Typography sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) translateY(-.25rem)", px: 1.5, py: .5, backgroundColor: "background.paper", color: "grey.500" }}>{props.children}</Typography>
    </Box>
}