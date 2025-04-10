import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box, Button, Grid, Paper, AppBar, Toolbar, IconButton, useMediaQuery, TextField, CircularProgress, Alert, Snackbar, useTheme, useScrollTrigger } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import { initTelegramApp, showAlert, getUserData } from './utils/telegram';
import { connectWallet, getWalletBalance, getNFTs } from './utils/wallet';
import { getEvents, getTickets, buyTicket } from './utils/events';
import { AnimatePresence, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          },
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
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          transition: 'color 0.3s ease',
          '&:hover': {
            color: 'primary.main',
          },
        },
      },
    },
  },
});

// Styled components
const GradientBox = styled(motion.div)(({ theme }) => ({
  background: 'linear-gradient(45deg, rgba(0, 242, 255, 0.1) 30%, rgba(255, 0, 242, 0.1) 90%)',
  borderRadius: 24,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
}));

const ParticleContainer = styled(motion.div)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 0,
  background: 'linear-gradient(135deg, rgba(0, 242, 255, 0.05) 0%, rgba(255, 0, 242, 0.05) 100%)',
});

const Particle = styled(motion.div)({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(45deg, rgba(0, 242, 255, 0.5), rgba(255, 0, 242, 0.5))',
  pointerEvents: 'none',
  boxShadow: '0 0 10px rgba(0, 242, 255, 0.3), 0 0 20px rgba(255, 0, 242, 0.3)',
});

const ScrollToTop = styled(motion.div)({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1000,
  background: 'rgba(10, 10, 10, 0.8)',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(10, 10, 10, 1)',
    transform: 'scale(1.1)',
  },
});

// Home component
const Home = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = getUserData();
  const { showAlert } = initTelegramApp();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  return (
    <StyledContainer maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Typography variant="h1" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            NFT Ticketing Hub
          </Typography>
        </motion.div>
        
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="h6" align="center" sx={{ mb: 4 }}>
              Welcome, {user.first_name}!
            </Typography>
          </motion.div>
        )}
        
        <Grid container spacing={3}>
          {[1, 2, 3].map((index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <GradientBox
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Typography variant="h4" gutterBottom>
                    {index === 1 ? 'Portfolio Dashboard' : 
                     index === 2 ? 'Event Tickets' : 'My Tickets'}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {index === 1 ? 'Track your NFTs and tokens across multiple chains' :
                     index === 2 ? 'Browse and purchase tickets for exclusive events' :
                     'Manage and view your event tickets'}
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    sx={{ mt: 2 }}
                    onClick={() => navigate(index === 1 ? '/portfolio' : 
                                          index === 2 ? '/events' : '/tickets')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {index === 1 ? 'View Portfolio' :
                     index === 2 ? 'Browse Events' : 'View Tickets'}
                  </Button>
                </GradientBox>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </StyledContainer>
  );
};

// Portfolio component
const Portfolio = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showAlert } = initTelegramApp();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
        await loadWalletData(address);
        showAlert('Wallet connected successfully!');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      showAlert('Error connecting wallet. Please try again.');
    }
  };

  const loadWalletData = async (address) => {
    try {
      setLoading(true);
      const [balanceData, nftsData] = await Promise.all([
        getWalletBalance(address),
        getNFTs(address)
      ]);
      
      setBalance(balanceData);
      setNfts(nftsData);
      setError(null);
    } catch (err) {
      console.error('Error loading wallet data:', err);
      setError('Error loading wallet data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
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
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h4" gutterBottom>
            Portfolio Dashboard
          </Typography>
        </motion.div>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!walletAddress ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={handleConnectWallet}
                sx={{ mb: 2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Connect Wallet
              </Button>
              <Typography variant="body2" color="text.secondary">
                Connect your wallet to view your portfolio
              </Typography>
            </Box>
          </motion.div>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Paper
                  sx={{ p: 3 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Typography variant="h6" gutterBottom>
                    Wallet Balance
                  </Typography>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Typography variant="h4" color="primary">
                      {balance} HTR
                    </Typography>
                  )}
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Paper
                  sx={{ p: 3 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Typography variant="h6" gutterBottom>
                    NFT Collection
                  </Typography>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Grid container spacing={2}>
                      {nfts.map((nft, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                          >
                            <Paper
                              sx={{ p: 2, textAlign: 'center' }}
                              whileHover={{
                                scale: 1.02,
                                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Typography variant="body1">
                                  {nft.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {nft.tokenId}
                                </Typography>
                              </motion.div>
                            </Paper>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

// Events component
const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showAlert } = initTelegramApp();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getEvents();
      setEvents(eventsData);
      setError(null);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Error loading events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTicket = async (eventId) => {
    try {
      const success = await buyTicket(eventId);
      if (success) {
        showAlert('Ticket purchased successfully!');
        loadEvents();
      }
    } catch (err) {
      console.error('Error buying ticket:', err);
      showAlert('Error purchasing ticket. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg">
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
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h4" gutterBottom>
            Upcoming Events
          </Typography>
        </motion.div>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {events.map((event, index) => (
              <Grid item xs={12} md={6} lg={4} key={event.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    sx={{ p: 3 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Typography variant="h6" gutterBottom>
                        {event.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        {event.description}
                      </Typography>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {event.price} HTR
                      </Typography>
                      <Button 
                        variant="contained" 
                        size="large" 
                        sx={{ mt: 2 }}
                        onClick={() => handleBuyTicket(event.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Buy Ticket
                      </Button>
                    </motion.div>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

// Tickets component
const Tickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showAlert } = initTelegramApp();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const ticketsData = await getTickets();
      setTickets(ticketsData);
      setError(null);
    } catch (err) {
      console.error('Error loading tickets:', err);
      setError('Error loading tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Tickets
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ my: 4 }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h4" gutterBottom>
            Your Tickets
          </Typography>
        </motion.div>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {tickets.length === 0 ? (
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      No Tickets Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Browse events to purchase tickets.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ mt: 2 }}
                      onClick={() => navigate('/events')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Browse Events
                    </Button>
                  </Paper>
                </motion.div>
              </Grid>
            ) : (
              tickets.map((ticket, index) => (
                <Grid item xs={12} key={ticket.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Paper
                      sx={{ p: 3 }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Typography variant="h6" gutterBottom>
                          {ticket.eventName}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                          {ticket.eventDescription}
                        </Typography>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {ticket.price} HTR
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ticket ID: {ticket.ticketId}
                        </Typography>
                      </motion.div>
                    </Paper>
                  </motion.div>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

function App() {
  const [telegramApp, setTelegramApp] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true,
  });

  useEffect(() => {
    const initApp = async () => {
      try {
        console.log('Initializing Telegram WebApp...');
        const app = initTelegramApp();
        console.log('Telegram WebApp initialization result:', app);
        setTelegramApp(app);
        
        if (!app.isInitialized) {
          console.error('Telegram WebApp initialization failed');
          showAlert('Please open this app through the Telegram bot @HathorEventBot');
        } else {
          console.log('Telegram WebApp initialized successfully');
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing Telegram WebApp:', error);
        showAlert('Error initializing app. Please try again.');
      }
    };
    
    initApp();
  }, []);

  // Add particle effects
  useEffect(() => {
    const particles = [];
    const container = document.createElement('div');
    container.className = 'particles';
    document.body.appendChild(container);

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Randomize position
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.top = Math.random() * 100 + 'vh';
      
      // Randomize size
      const size = Math.random() * 2 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      // Randomize animation duration
      const duration = Math.random() * 5 + 5;
      particle.style.animationDuration = duration + 's';
      
      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      container.remove();
    };
  }, []);

  // Add debug information to the UI when not in Telegram
  const renderDebugInfo = () => {
    if (!isInitialized) {
      return (
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
          <Typography variant="h6" color="error">
            Debug Information
          </Typography>
          <Typography variant="body2">
            Telegram WebApp Status: {telegramApp?.isInitialized ? 'Initialized' : 'Not Initialized'}
          </Typography>
          <Typography variant="body2">
            Error: {telegramApp?.error || 'None'}
          </Typography>
          <Typography variant="body2">
            Platform: {telegramApp?.platform || 'Unknown'}
          </Typography>
          <Typography variant="body2">
            Version: {telegramApp?.version || 'Unknown'}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ParticleContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <Particle
            key={i}
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              scale: 0
            }}
            animate={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              scale: 1,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </ParticleContainer>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <BrowserRouter>
            {renderDebugInfo()}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/events" element={<Events />} />
              <Route path="/tickets" element={<Tickets />} />
            </Routes>
          </BrowserRouter>
        </motion.div>
      </AnimatePresence>
      <ScrollToTop
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: trigger ? 1 : 0, scale: trigger ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />
      </ScrollToTop>
    </ThemeProvider>
  );
}

export default App;
