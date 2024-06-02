import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#DEF3F7', textAlign: 'center', position: 'static', bottom: 0, width: '100%' }}>
      <Typography variant="body1">
        Made with ❤️ in Incline Village
      </Typography>
    </Box>
  );
};

export default Footer;
