import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box, Button, Grid, Paper, AppBar, Toolbar, IconButton, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import { initTelegramApp, showAlert, getUserData } from './utils/telegram';

// Create a modern, futuristic theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f2ff',
      light: '#33f5ff',
      dark: '#00a9b3',
    },
    secondary: {
      main: '#ff00f2',
      light: '#ff33f5',
      dark: '#b300a9',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      background: 'linear-gradient(45deg, #00f2ff 30%, #ff00f2 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
        contained: {
          background: 'linear-gradient(45deg, #00f2ff 30%, #ff00f2 90%)',
          boxShadow: '0 3px 5px 2px rgba(0, 242, 255, .3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #00a9b3 30%, #b300a9 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

// Styled components
const GradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, rgba(0, 242, 255, 0.1) 30%, rgba(255, 0, 242, 0.1) 90%)',
  borderRadius: 24,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

// Home component
const Home = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = getUserData();
  
  return (
    <StyledContainer maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          NFT Portfolio & Ticketing Hub
        </Typography>
        
        {user && (
          <Typography variant="h6" align="center" sx={{ mb: 4 }}>
            Welcome, {user.first_name}!
          </Typography>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <GradientBox>
              <Typography variant="h4" gutterBottom>
                Portfolio Dashboard
              </Typography>
              <Typography variant="body1" paragraph>
                Track your NFTs and tokens across multiple chains including Hathor, Ethereum, BSC, and Polygon.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                sx={{ mt: 2 }}
                onClick={() => navigate('/portfolio')}
              >
                View Portfolio
              </Button>
            </GradientBox>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <GradientBox>
              <Typography variant="h4" gutterBottom>
                Event Tickets
              </Typography>
              <Typography variant="body1" paragraph>
                Browse, purchase, and manage your NFT-based event tickets with secure P2P trading.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                sx={{ mt: 2 }}
                onClick={() => navigate('/events')}
              >
                Explore Events
              </Button>
            </GradientBox>
          </Grid>
        </Grid>
      </Box>
    </StyledContainer>
  );
};

// Portfolio component
const Portfolio = () => {
  const navigate = useNavigate();
  const { showAlert } = initTelegramApp();
  
  return (
    <Container maxWidth="sm">
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Portfolio
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your NFT Portfolio
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Your NFTs will appear here once you connect your wallet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => showAlert('Wallet connection coming soon!')}
          >
            Connect Wallet
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

// Events component
const Events = () => {
  const navigate = useNavigate();
  const { showAlert } = initTelegramApp();
  
  return (
    <Container maxWidth="sm">
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Events
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Upcoming Events
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3].map((event) => (
            <Grid item xs={12} key={event}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Event {event}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: Coming Soon
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 1 }}
                  onClick={() => showAlert('Ticket purchase coming soon!')}
                >
                  Buy Tickets
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

function App() {
  const [telegramApp, setTelegramApp] = useState(null);

  useEffect(() => {
    const initApp = async () => {
      const app = initTelegramApp();
      setTelegramApp(app);
      
      if (!app.isInitialized) {
        showAlert('Please open this app through the Telegram bot @HathorEventBot');
      }
    };
    
    initApp();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
