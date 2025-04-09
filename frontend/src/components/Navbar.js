import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { AccountCircle, Event, Ticket, Groups, Wallet } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          NFT Portfolio & Tickets
        </Typography>
        
        <Button color="inherit" component={Link} to="/events" startIcon={<Event />}>Events</Button>
        <Button color="inherit" component={Link} to="/tickets" startIcon={<Ticket />}>My Tickets</Button>
        <Button color="inherit" component={Link} to="/community" startIcon={<Groups />}>Community</Button>
        <Button color="inherit" component={Link} to="/wallet" startIcon={<Wallet />}>Wallet</Button>
        
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
