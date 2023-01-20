import { Alert, Avatar, Box, Button, Container, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../components/forms/text-input';
import { PasswordInput } from '../components/forms/password-input';
import { SubmitButton } from '../components/forms/submit-button';
import { useSignUpEmailMutation } from '../graphql/auth/auth';

import { useEffect, useState } from 'react';
import { useProject } from '../context/project.context';
import { useNavigate } from 'react-router-dom';

const SignUpValidation = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  username: Yup.string(),
  password: Yup.string().required('Required')
});

export const SignUp = () => {
  const [signUpEmail, { data, error }] = useSignUpEmailMutation();

  const [errorText, setErrorText] = useState('');
  const { project } = useProject();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && project) {
      window.location.replace(`${project.redirectUrl}?projectId=${project.id}&token=${data.signup.accessToken}`);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      if (error.message.includes('User already exist in the database')) {
        setErrorText('User already exist in the database');
      } else if (error.message.includes('status code 500')) {
        setErrorText('Server error. Try again later.');
      } else {
        setErrorText('Invalid email or password');
      }
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
          {project?.name || 'Sign up'}
        </Typography>
        {errorText && (
          <Alert severity="error" variant="outlined" sx={{ width: '100%', mb: 2 }}>
            {errorText}
          </Alert>
        )}
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={SignUpValidation}
          initialValues={{ email: '', username: undefined, password: '' }}
          onSubmit={async ({ email, username, password }) => {
            setErrorText('');
            // var signUpDetails = { email, password, projectId: project?.id || ''}
            // if(username){
            //     signUpDetails = {... signUpDetails ,username}
            // }
            await signUpEmail({ variables: { email, password, username, projectId: project?.id || '' } });
          }}
        >
          <Form>
            <TextInput autoFocus fullWidth name="email" label="Email Address" type="email" autoComplete="email" margin="normal" required />
            <TextInput autoFocus fullWidth name="username" label="username" margin="normal" />

            <PasswordInput name="password" label="Password" fullWidth autoComplete="current-password" required margin="normal" />
            <SubmitButton fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
              Sign Up
            </SubmitButton>
          </Form>
        </Formik>
        <Grid container>
          <Grid item>
            <Button
              onClick={() => {
                navigate('/');
              }}
            >
              <Typography variant="body2">Already have an account? Sign in</Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
