import React from 'react';
import { motion } from 'framer-motion';
import { Button, CircularProgress, Snackbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ExampleComponent = () => {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(true);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ padding: isMobile ? '10px' : '20px' }}
    >
      <Button variant="contained" onClick={handleClick} sx={{ mb: 2 }}>
        {loading ? <CircularProgress size={24} /> : 'Click Me'}
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message="Action completed!"
      />
    </motion.div>
  );
};

export default ExampleComponent; 