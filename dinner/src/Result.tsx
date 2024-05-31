import React from 'react';
import { Paper, Typography } from '@mui/material';

interface ResultProps {
  suggestion: string;
}

const Result: React.FC<ResultProps> = ({ suggestion }) => {
  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5">Suggestion:</Typography>
      <Typography variant="h6">{suggestion}</Typography>
    </Paper>
  );
};

export default Result;
