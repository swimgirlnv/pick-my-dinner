import React from 'react';
import { Box, Typography } from '@mui/material';

const Settings: React.FC = () => {
    return (
        
        <Box textAlign="center" mt={5}>
        <Typography variant="h5">
            Usage of Location Services
        </Typography>
        <br />
        <Typography variant="body1" textAlign={'left'} maxWidth="600px" margin={'auto'}>
            This application uses location services to provide you with accurate and relevant restaurant 
        suggestions based on your current location. By enabling location services, you allow us to 
        access your device's geographical data, which helps us tailor our recommendations to your 
        specific area. This feature enhances your experience by ensuring that the suggested 
        restaurants are conveniently located near you.
        </Typography>
        <br />
        <Typography variant="h5">
            Privacy Policy
        </Typography>
        <br />
        <Typography variant="body1" textAlign={'left'} maxWidth="600px" margin={'auto'}>
        We value your privacy and are committed to protecting your personal information. 
        Here is how we handle your location data:
        </Typography>
        <br />
        <Typography variant="body1" textAlign={'left'} maxWidth="600px" margin={'auto'}>
        <ul>
            <li>Data Collection: We collect your location data only when you opt to use our "go-out" feature. 
                This data includes your latitude and longitude, which are used to find nearby restaurants.
                </li>
            <li>Data Usage: The collected location data is used solely for the purpose of providing restaurant 
                suggestions based on your current location. We do not use this data for any other purpose.
                </li>
            <li>Data Storage: Your location data is not stored on our servers. It is temporarily used during 
                the session to fetch restaurant suggestions and is discarded immediately after.
                </li>
            <li>Data Sharing: We do not share your location data with any third parties. The data is processed 
                within our application to provide you with the best possible experience.
                </li>
            <li>User Control: You have full control over your location data. You can choose to disable location 
                services at any time, either through your device settings or within the app's settings. 
                Disabling location services will limit our ability to provide location-based recommendations, 
                but you can still use other features of the app.
                </li>
        </ul>
        </Typography>
        <br />
        <Typography variant="body1" textAlign={'left'} maxWidth="600px" margin={'auto'}>
        By using our app, you agree to the collection and use of your location data as described in this policy. 
        We are committed to maintaining your trust and ensuring your privacy is safeguarded. If you have any 
        questions or concerns about our privacy practices, please feel free to contact us through the about 
        section of the app.
        </Typography>
        </Box>
    );
};

export default Settings;
