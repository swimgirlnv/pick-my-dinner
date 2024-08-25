import React from 'react';
import { Box, Typography } from '@mui/material';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <Box className="footer" sx={{border: 'none'}}>
      <Typography variant="body1">
        Made with ❤️ in Incline Village
      </Typography>
    </Box>
  );
};

export default Footer;
