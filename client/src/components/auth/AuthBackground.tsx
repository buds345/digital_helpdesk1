// src/components/auth/AuthBackground.tsx
import { Box, styled, useTheme } from "@mui/material";
import { ReactNode } from "react";
import authBg from "../../assets/images/auth-bg.jpg";

interface AuthBackgroundProps {
    children: ReactNode;
}

// Wrapper for whole screen
const Background = styled(Box)(({ theme }) => ({
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
}));

// Background image as <img> - changed to cover full screen
const BackgroundImage = styled("img")({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover", // Changed from "contain" to "cover" for full screen
    objectPosition: "center",
    zIndex: 0,
});

// Dark overlay
const Overlay = styled(Box)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 1,
});

// Form container
const FormContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    zIndex: 2, // Above overlay
    width: "100%",
    maxWidth: 450,
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[10],
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
}));

export default function AuthBackground({ children }: AuthBackgroundProps) {
    const theme = useTheme();
    return (
        <Background>
            <BackgroundImage src={authBg} alt="Authentication Background" />
            <Overlay />
            <FormContainer>{children}</FormContainer>
        </Background>
    );
}