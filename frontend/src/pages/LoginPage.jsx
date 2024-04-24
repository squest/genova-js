import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../states/credential';
import axios from 'axios';
import { BaseUrl } from '../Constants';
import { Container, Box, Avatar, Typography, TextField, Button, CssBaseline } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [auth, setAuth] = useRecoilState(authState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BaseUrl}/user/login`, { email, password });
      if (response.data.status === 'ok') {
        setAuth({ isAuthenticated: true, user: response.data.user });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" sx={{
      display: 'flex',
      width: '400',
      flexDirection: 'column',
      minHeight: '100vh', // Ensures the container takes at least the full height of the viewport
      alignItems: 'center', // Center horizontally
      justifyContent: 'center' // Center vertically
    }}>
      <CssBaseline />
      <Box sx={{
        width: 400, // Sets a fixed width to avoid the form looking too narrow
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 4 // Padding for some spacing around the elements
      }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
