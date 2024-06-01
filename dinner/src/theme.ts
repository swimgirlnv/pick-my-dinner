import { createTheme } from '@mui/material/styles';

// Extend the Palette interface to include custom colors
declare module '@mui/material/styles' {
    interface Palette {
        customColors: {
            color1: string;
            color2: string;
            color3: string;
        };
    }
    interface PaletteOptions {
        customColors?: {
            color1?: string;
            color2?: string;
            color3?: string;
        };
    }
}

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#E98F35',
        },
        secondary: {
            main: '#FBEADA',
        },
        customColors: {
            color1: '#C8E6F9',
            color2: '#C7EFCF',
            color3: '#DEF3F7',
        },
        background: {
            default: '#DEF3F7',
            paper: '#FBEADA',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#5BC2D7',
                    '&:hover': {
                        backgroundColor: '#30ACC5',
                    },
                },
            },
        },
    },
});

export default theme;
