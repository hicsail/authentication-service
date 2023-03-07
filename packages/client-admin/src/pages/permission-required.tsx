import React, { FC } from 'react';
import { Box, Button, Container, Grow, Typography } from '@mui/material';
import { faShield } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@components/icon';
import { useNavigate } from 'react-router-dom';

export const PermissionRequiredPage: FC = () => {
  const navigate = useNavigate();
  return (
    <Grow in>
      <Container
        sx={{
          display: 'flex',
          minHeight: '100%',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 10
        }}
      >
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            Access Denied
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>The page you are trying to access has restricted access. Please refer to your system administrator.</Typography>
          <Box sx={{ m: 10 }}>
            <Icon icon={faShield} size="10x" />
          </Box>
          <Button size="large" variant="contained" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </Box>
      </Container>
    </Grow>
  );
};
