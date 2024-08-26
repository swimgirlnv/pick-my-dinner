import React from 'react';
import { AppBar, Toolbar, IconButton, Tabs, Tab, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './TopBar.css';

interface TopBarProps {
  tab: number;
  setTab: (tab: number) => void;
  toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const TopBar: React.FC<TopBarProps> = ({ tab, setTab, toggleDrawer }) => {
  return (
    <AppBar position='static' sx={{top: '0', width: '90vw'}} className='topbar'>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{display: 'flex', justifyContent: 'space-around'}}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} className="menu-icon">
            <MenuIcon />
          </IconButton>
          <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)} className="tabs">
            <Tab label="Suggest Dinner" className="tab" classes={{ selected: 'tab-selected' }} />
            <Tab label="Add Your Own" className="tab" classes={{ selected: 'tab-selected' }} />
            <Tab label="Favorites" className="tab" classes={{ selected: 'tab-selected' }} />
            <Tab label="Settings" className="tab" classes={{ selected: 'tab-selected' }} />
            <Tab label="Help" className="tab" classes={{ selected: 'tab-selected' }} />
            <Tab label="About" className="tab" classes={{ selected: 'tab-selected' }} />
          </Tabs>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;
