import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface ResultProps {
  suggestion: string;
}

const Result: React.FC<ResultProps> = ({ suggestion }) => {
  return (
    <Box mt={5} textAlign="center">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5">Suggestion:</Typography>
        <Typography variant="h6">{suggestion}</Typography>
      </Paper>
    </Box>
  );
};

export default Result;
