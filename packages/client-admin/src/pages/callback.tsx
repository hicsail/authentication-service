import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useAuth } from '../context/auth.context';
import { useNavigate } from 'react-router-dom';

export const Callback = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      setToken({ token: token });
      navigate('/');
    }
  }, []);

  return <Box>Callback</Box>;
};
