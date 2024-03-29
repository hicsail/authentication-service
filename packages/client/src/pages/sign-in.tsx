import { Box, Button, Card, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@components/forms/text-input';
import { PasswordInput } from '@components/forms/password-input';
import { SubmitButton } from '@components/forms/submit-button';
import { useLoginEmailMutation } from '@graphql/auth/auth';
import { useLoginGoogleMutation } from '@graphql/auth/auth';
import { useEffect } from 'react';
import { useProject } from '@context/project.context';
import { useNavigate } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { ProjectDisplay } from '@components/project-display';
import { useSnackbar } from '@context/snackbar.context';
import { GoogleLogin } from '@react-oauth/google';

const LoginValidation = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required')
});

export const SignIn = () => {
  const [loginEmail, { data, error }] = useLoginEmailMutation();
  const [loginGoogle, { data: googleData, error: googleError }] = useLoginGoogleMutation();
  const { project } = useProject();
  const { pushMessage } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && project) {
      window.location.replace(`${project.redirectUrl}?token=${data.loginEmail.accessToken}`);
    }

    if (googleData && project) {
      window.location.replace(`${project.redirectUrl}?token=${googleData.loginGoogle.accessToken}`);
    }
  }, [data, googleData]);

  useEffect(() => {
    if (error) {
      pushMessage('Invalid email or password');
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
        <ProjectDisplay project={project} />
        {project?.authMethods.emailAuth && (
          <>
            <Formik
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={LoginValidation}
              initialValues={{ email: '', password: '' }}
              onSubmit={async ({ email, password }) => {
                await loginEmail({ variables: { email, password, projectId: project?.id || '' } });
              }}
            >
              <Form>
                <Card>
                  <CardHeader title="Sign in" />
                  <CardContent>
                    <TextInput autoFocus fullWidth name="email" label="Email Address" type="email" autoComplete="email" margin="normal" required />
                    <PasswordInput name="password" label="Password" fullWidth autoComplete="current-password" required margin="normal" />
                  </CardContent>
                </Card>
                <SubmitButton fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
                  Sign In
                </SubmitButton>
              </Form>
            </Formik>

            <Grid container>
              <Grid item xs>
                <Button
                  onClick={() => {
                    navigate(Paths.FORGOT_PASSWORD);
                  }}
                >
                  <Typography variant="body2">Forgot password?</Typography>
                </Button>
              </Grid>
              {project?.settings.allowSignup && (
                <Grid item>
                  <Button
                    onClick={() => {
                      navigate(Paths.SIGN_UP);
                    }}
                  >
                    <Typography variant="body2">Don't have an account? Sign up</Typography>
                  </Button>
                </Grid>
              )}
            </Grid>
          </>
        )}
        {project?.authMethods.googleAuth && (
          <Box>
            <GoogleLogin
              onSuccess={({ credential }) => {
                loginGoogle({ variables: { projectId: project?.id || '', credential: credential as string } }).catch((err) => {
                  console.log(err);
                  pushMessage('Unable to Authenticate with Google');
                });
              }}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};
