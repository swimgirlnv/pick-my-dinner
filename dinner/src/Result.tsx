import React from 'react';
import { Box, Typography } from '@mui/material';

interface ResultProps {
    suggestion: string;
}

const Result: React.FC<ResultProps> = ({ suggestion }) => {
    return (
        <Box
            sx={{
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '5px',
                marginTop: '10px',
                border: '1px solid #ddd',
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'left',
                justifyContent: 'flex-start',
            }}
        >
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: suggestion }} />
        </Box>
    );
};

export default Result;
