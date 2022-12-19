import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../components/forms/text-input';
import { PasswordInput } from '../components/forms/password-input';
import { SubmitButton } from '../components/forms/submit-button';

const LoginValidation = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required')
});

export const SignIn = () => {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik validationSchema={LoginValidation} initialValues={{ email: '', password: '' }} onSubmit={console.log}>
          <Form>
            <TextInput autoFocus fullWidth name="email" label="Email Address" type="email" autoComplete="email" margin="normal" required />
            <PasswordInput name="password" label="Password" fullWidth autoComplete="current-password" required margin="normal" />
            <SubmitButton fullWidth variant="contained" color="primary">
              Sign In
            </SubmitButton>

            <Grid container>
              <Grid item xs>
                <Button>
                  <Typography variant="body2">Forgot password?</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button>
                  <Typography variant="body2">Don't have an account? Sign up</Typography>
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
};
