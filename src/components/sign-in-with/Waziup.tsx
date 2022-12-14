import { Box, ButtonBase, ButtonBaseProps, styled } from "@mui/material";

const Svg = styled("svg")({});

export default function SignInWithWaziup(props: ButtonBaseProps) {

    return <ButtonBase sx={{ px: "8px", height: "40px", boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)", bgcolor: "#394e69", borderRadius: 1, "&:hover": { bgcolor: "#2c3a4c" } }} {...props}>
        <Svg viewBox="0 0 200 130" sx={{ height: "18px" }} xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1.84473 0 0 -2.07765 -227.24197 679.52537)" clipPath="url(#a)">
                <path style={{ fill: "#f35e19" }} d="M-283.34172-.43495c6.266 8.055 10.053 18.178 10.053 29.125 0 11.431-4.063 21.896-10.81 30.158-1.309 1.584-3.72 1.791-5.233.346l-.827-.758c-1.377-1.308-1.514-3.512-.344-4.957 5.508-6.748 8.813-15.355 8.813-24.719 0-9.021-3.098-17.353-8.193-23.963-1.171-1.515-.964-3.648.481-4.888l.827-.758c1.515-1.445 3.924-1.24 5.233.414" transform="translate(504.9473 266.0645)" />
                <path style={{ fill: "#f35e19" }} d="M-283.34172-.43495c4.062 5.715 6.472 12.668 6.472 20.174 0 7.849-2.618 15.148-7.023 21.002-1.308 1.72-3.787 1.996-5.371.482l-.826-.759c-1.377-1.307-1.516-3.374-.413-4.888 3.305-4.407 5.302-9.915 5.302-15.837 0-5.715-1.79-11.016-4.889-15.285-1.033-1.516-.757-3.58.62-4.752l.826-.688c1.515-1.515 3.993-1.17 5.302.551" transform="translate(495.8584 275.0156)" />
                <path style={{ fill: "#f35e19" }} d="M-283.34172-.43495c1.928 3.168 3.029 6.887 3.029 10.879 0 4.201-1.239 8.195-3.374 11.5-1.239 1.928-3.855 2.271-5.509.756l-.826-.756c-1.238-1.172-1.584-3.098-.62-4.545 1.24-1.996 1.997-4.406 1.997-6.955 0-2.34-.62-4.543-1.72-6.473-.895-1.513-.621-3.373.688-4.545l.826-.756c1.653-1.445 4.338-1.033 5.509.895" transform="translate(485.8057 284.3105)" />
                <path style={{ fill: "#186dbf" }} d="M0 0c-1.16 1.159-2.577 1.738-4.25 1.738-1.676 0-3.076-.579-4.202-1.738-1.128-1.159-1.691-2.577-1.691-4.25v-35.836l-7.803 7.822c-3.149 3.157-6.969 4.735-11.466 4.735-2.185 0-4.272-.403-6.264-1.207-1.992-.807-3.725-1.981-5.202-3.528l-7.708-7.726v35.74c0 1.674-.586 3.091-1.754 4.25-1.168 1.158-2.595 1.738-4.283 1.738-1.687 0-3.117-.58-4.285-1.738-1.169-1.159-1.752-2.576-1.752-4.25v-50.133c0-1.676.58-3.09 1.739-4.25 1.158-1.16 2.574-1.738 4.25-1.738 1.223 0 2.5834.1556 3.478 1.062 5.71377 5.78914 11.9337 11.90383 17.772 17.774 1.094 1.094 2.415 1.64 3.961 1.64 1.415 0 2.704-.515 3.862-1.543 5.1664-4.44413 12.81943-12.69103 18.064-17.871.87169-.86095 2.125-1.062 3.284-1.062 1.673 0 3.09.578 4.25 1.738 1.159 1.16 1.738 2.574 1.738 4.25V-4.25C1.738-2.577 1.159-1.159 0 0" transform="translate(183.9854 324.9766)" />
            </g>
        </Svg>
        <Box sx={{ ml: "24px", mr: "32px", fontFamily: "Roboto", fontWeight: "medium", color: "rgba(255, 255, 255, 80%)", fontSize: "14px" }}>Sign in with Waziup</Box>
    </ButtonBase>
}