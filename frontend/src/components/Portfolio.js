import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CollectionsIcon from '@mui/icons-material/Collections';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(26, 26, 26, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #00f2ff 30%, #ff00f2 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
}));

const Portfolio = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Mock data - replace with actual data from your backend
  const portfolioData = {
    totalValue: 12500,
    tokens: [
      { id: 1, name: 'Hathor Token', amount: '1000', value: 5000, chain: 'Hathor' },
      { id: 2, name: 'ETH', amount: '2.5', value: 5000, chain: 'Ethereum' },
      { id: 3, name: 'BNB', amount: '10', value: 2500, chain: 'BSC' },
    ],
    nfts: [
      { id: 1, name: 'Cool NFT #1', image: 'https://via.placeholder.com/300', chain: 'Hathor' },
      { id: 2, name: 'Awesome NFT #2', image: 'https://via.placeholder.com/300', chain: 'Ethereum' },
    ],
    tickets: [
      { id: 1, name: 'Concert Ticket', event: 'Summer Festival', date: '2024-07-15', chain: 'Hathor' },
      { id: 2, name: 'VIP Pass', event: 'Tech Conference', date: '2024-08-20', chain: 'Ethereum' },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <GradientTypography variant="h4">Portfolio</GradientTypography>
      </Box>

      <Paper sx={{ p: 3, mb: 4, background: 'rgba(26, 26, 26, 0.8)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="text.secondary">
              Total Portfolio Value
            </Typography>
            <GradientTypography variant="h3">
              ${portfolioData.totalValue.toLocaleString()}
            </GradientTypography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<AccountBalanceWalletIcon />}
                label="Hathor"
                sx={{ background: 'rgba(0, 242, 255, 0.1)' }}
              />
              <Chip
                icon={<AccountBalanceWalletIcon />}
                label="Ethereum"
                sx={{ background: 'rgba(255, 0, 242, 0.1)' }}
              />
              <Chip
                icon={<AccountBalanceWalletIcon />}
                label="BSC"
                sx={{ background: 'rgba(0, 242, 255, 0.1)' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': {
            background: 'linear-gradient(45deg, #00f2ff 30%, #ff00f2 90%)',
          },
        }}
      >
        <Tab icon={<AccountBalanceWalletIcon />} label="Tokens" />
        <Tab icon={<CollectionsIcon />} label="NFTs" />
        <Tab icon={<LocalActivityIcon />} label="Tickets" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {portfolioData.tokens.map((token) => (
            <Grid item xs={12} sm={6} md={4} key={token.id}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {token.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {token.amount} {token.name}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    ${token.value.toLocaleString()}
                  </Typography>
                  <Chip
                    label={token.chain}
                    size="small"
                    sx={{ mt: 2, background: 'rgba(0, 242, 255, 0.1)' }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {portfolioData.nfts.map((nft) => (
            <Grid item xs={12} sm={6} md={4} key={nft.id}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={nft.image}
                  alt={nft.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {nft.name}
                  </Typography>
                  <Chip
                    label={nft.chain}
                    size="small"
                    sx={{ background: 'rgba(0, 242, 255, 0.1)' }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {portfolioData.tickets.map((ticket) => (
            <Grid item xs={12} sm={6} md={4} key={ticket.id}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {ticket.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {ticket.event}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(ticket.date).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={ticket.chain}
                    size="small"
                    sx={{ mt: 2, background: 'rgba(0, 242, 255, 0.1)' }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Portfolio;
