import { Alert, Avatar, Box, Button, Card, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@components/forms/text-input';
import { PasswordInput } from '@components/forms/password-input';
import { SubmitButton } from '@components/forms/submit-button';
import { useSignUpEmailMutation } from '@graphql/auth/auth';

import { useEffect, useState } from 'react';
import { useProject } from '@context/project.context';
import { useNavigate } from 'react-router-dom';

const SignUpValidation = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
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
        {project && project.logo && <Box component="img" alt="project logo" src={project.logo} sx={{ mb: 2, maxHeight: '15vh' }} />}
        {project?.name &&
          (project?.settings.displayProjectName ? (
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
              {project?.name}
            </Typography>
          ) : (
            <></>
          ))}

        {errorText && (
          <Alert severity="error" variant="outlined" sx={{ width: '100%', mb: 2 }}>
            {errorText}
          </Alert>
        )}
        <Formik
          validationSchema={SignUpValidation}
          initialValues={{ fullname: '', email: '', confirmPassword: '', password: '' }}
          onSubmit={async ({ email, password, fullname }) => {
            setErrorText('');
            await signUpEmail({ variables: { email, password, fullname, projectId: project?.id || '' } });
          }}
        >
          <Form>
            <Card>
              <CardHeader title="Sign Up" />
              <CardContent>
                <TextInput autoFocus fullWidth name="fullname" label="Full Name" type="text" autoComplete="name" margin="normal" required />
                <TextInput fullWidth name="email" label="Email Address" type="email" autoComplete="email" margin="normal" required />
                <PasswordInput name="password" label="Password" fullWidth autoComplete="new-password" required margin="normal" />
                <PasswordInput name="confirmPassword" label="Confirm Password" fullWidth autoComplete="new-password" required margin="normal" />
              </CardContent>
            </Card>
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
