// src/components/common/ErrorBoundary.tsx
import React, { Component, ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: any) {
        console.error("Caught by ErrorBoundary:", error, info);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100vh",
                        p: 3,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h4" color="error" gutterBottom>
                        Something went wrong!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {this.state.error?.message}
                    </Typography>
                    <Button variant="contained" onClick={this.handleReload}>
                        Reload
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
