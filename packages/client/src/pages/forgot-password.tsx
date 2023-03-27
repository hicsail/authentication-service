import { Alert, Avatar, Box, Button, Container, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@components/forms/text-input';
import { SubmitButton } from '@components/forms/submit-button';
import { useForgotPasswordMutation } from '@graphql/auth/auth';

import { useEffect, useState } from 'react';
import { useProject } from '@context/project.context';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordValidation = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required')
});

export const ForgotPassword = () => {
  const [forgotPassword, { data, error }] = useForgotPasswordMutation();

  const [errorText, setErrorText] = useState('');
  const { project } = useProject();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      if (error.message.includes('status code 500')) {
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
        {project?.settings.displayProjectName ? (
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {project?.name || 'Forgot Password'}
          </Typography>
        ) : (
          <></>
        )}
        {data && data.forgotPassword ? (
          <>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Check your email for the password reset code
            </Typography>
          </>
        ) : (
          <>
            {errorText && (
              <Alert severity="error" variant="outlined" sx={{ width: '100%', mb: 2 }}>
                {errorText}
              </Alert>
            )}
            <Formik
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={ForgotPasswordValidation}
              initialValues={{ email: '' }}
              onSubmit={async ({ email }) => {
                setErrorText('');
                await forgotPassword({ variables: { email, projectId: project?.id || '' } });
              }}
            >
              <Form>
                <TextInput autoFocus fullWidth name="email" label="Email Address" type="email" autoComplete="email" margin="normal" required />
                <SubmitButton fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
                  Reset Password
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
          </>
        )}
      </Box>
    </Container>
  );
};
