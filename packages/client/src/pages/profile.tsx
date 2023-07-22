import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, CardHeader, Container, Typography } from '@mui/material';
import { CreateOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Paths } from '@constants/paths';

export const Profile = () => {
  const navigate = useNavigate();
  const user = {
    name: 'John Smith',
    email: 'sail@bu.edu',
    password: '*********'
  };
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          mt: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardHeader title="Basic Info" />
          <CardContent>
            <Accordion>
              <AccordionSummary expandIcon={<CreateOutlined />} aria-controls="panel1a-content" id="panel1a-header" onClick={() => navigate(Paths.BASIC_INFO)}>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>Username</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{user.name}</Typography>
              </AccordionSummary>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<CreateOutlined />} aria-controls="panel2a-content" id="panel2a-header" onClick={() => navigate(Paths.BASIC_INFO)}>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>Email</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{user.email}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Additional Password Details</Typography>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
        <Card sx={{ width: '100%', height: '200px' }}>
          <CardHeader title="Password" />
          <CardContent>
            <Accordion>
              <AccordionSummary expandIcon={<CreateOutlined />} aria-controls="panel2a-content" id="panel2a-header" onClick={() => navigate(Paths.PASSWORD)}>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>Password</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{user.password}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Additional Password Details</Typography>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
