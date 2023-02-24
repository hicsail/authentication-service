import { Alert, Avatar, Box, Button, Container, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@components/forms/text-input';
import { PasswordInput } from '@components/forms/password-input';
import { SubmitButton } from '@components/forms/submit-button';
import { useLoginEmailMutation } from '@graphql/auth/auth';
import { useEffect, useState } from 'react';
import { useProject } from '@context/project.context';
import { useNavigate } from 'react-router-dom';

const LoginValidation = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required')
});

export const SignIn = () => {
  const [loginEmail, { data, error }] = useLoginEmailMutation();
  const [errorText, setErrorText] = useState('');
  const { project } = useProject();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && project) {
      window.location.replace(`${project.redirectUrl}?token=${data.loginEmail.accessToken}`);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setErrorText('Invalid email or password');
    }
  }, [error]);

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
          alignItems: 'center'
        }}
      >
        {project && project.logo && <Avatar alt="project logo" src={project.logo} sx={{ width: 75, height: 75, mb: 2 }} />}
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {project?.name || 'Sign in'}
        </Typography>
        {errorText && (
          <Alert severity="error" variant="outlined" sx={{ width: '100%', mb: 2 }}>
            {errorText}
          </Alert>
        )}
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={LoginValidation}
          initialValues={{ email: '', password: '' }}
          onSubmit={async ({ email, password }) => {
            setErrorText('');
            await loginEmail({ variables: { email, password, projectId: project?.id || '' } });
          }}
        >
          <Form>
            <TextInput autoFocus fullWidth name="email" label="Email Address" type="email" autoComplete="email" margin="normal" required />
            <PasswordInput name="password" label="Password" fullWidth autoComplete="current-password" required margin="normal" />
            <SubmitButton fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
              Sign In
            </SubmitButton>
          </Form>
        </Formik>
        <Grid container>
          <Grid item xs>
            <Button
              onClick={() => {
                navigate('/forgot-password');
              }}
            >
              <Typography variant="body2">Forgot password?</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                navigate('/sign-up');
              }}
            >
              <Typography variant="body2">Don't have an account? Sign up</Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
