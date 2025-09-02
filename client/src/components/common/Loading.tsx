import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
    message?: string;
    fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
    message = 'Loading...',
    fullScreen = false
}) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                width: '100%',
                height: fullScreen ? '100vh' : '100%',
                gap: 2,
                p: 4
            }}
        >
            <CircularProgress size={fullScreen ? 60 : 40} />
            <Typography variant={fullScreen ? 'h6' : 'body1'}>
                {message}
            </Typography>
        </Box>
    );
};

export default Loading;