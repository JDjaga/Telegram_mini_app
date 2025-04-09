import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    ticketPrice: '',
    ticketToken: '',
  });
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = async () => {
    try {
      await axios.post('http://localhost:5000/api/events', {
        ...newEvent,
        organizer: user.walletAddress,
      });
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Upcoming Events</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Create Event
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.description}
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="subtitle2">
                      Date: {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="subtitle2">
                      Location: {event.location}
                    </Typography>
                    <Typography variant="subtitle2">
                      Ticket Price: {event.ticketPrice} {event.ticketToken}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Buy Ticket
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TextField
              fullWidth
              label="Event Name"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Ticket Price"
              value={newEvent.ticketPrice}
              onChange={(e) => setNewEvent({ ...newEvent, ticketPrice: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Ticket Token"
              value={newEvent.ticketToken}
              onChange={(e) => setNewEvent({ ...newEvent, ticketToken: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateEvent} variant="contained" color="primary">
            Create
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Events;
