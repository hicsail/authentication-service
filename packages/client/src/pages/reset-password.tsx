import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@components/forms/text-input';
import { SubmitButton } from '@components/forms/submit-button';
import { useResetPasswordMutation } from '@graphql/auth/auth';

import { useEffect } from 'react';
import { useProject } from '@context/project.context';
import { useNavigate } from 'react-router-dom';
import { PasswordInput } from '@components/forms/password-input';
import { ProjectDisplay } from '@components/project-display';
import { useSnackbar } from '@context/snackbar.context';

const ResetPasswordValidation = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  code: Yup.string().required('Required'),
  password: Yup.string().required('Required')
});

export const ResetPassword = () => {
  const [resetPassword, { data, error }] = useResetPasswordMutation();
  const { pushMessage } = useSnackbar();
  const { project } = useProject();
  const navigate = useNavigate();

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
        {data && data.resetPassword ? (
          <>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Password reset succesfully
            </Typography>
            <Button
              onClick={() => {
                navigate('/');
              }}
              variant="contained"
            >
              Sign In
            </Button>
          </>
        ) : (
          <>
            <Formik
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={ResetPasswordValidation}
              initialValues={{ email: '', code: '', password: '' }}
              onSubmit={async ({ email, code, password }) => {
                await resetPassword({ variables: { email, code, password, projectId: project?.id || '' } });
              }}
            >
              <Form>
                <TextInput autoFocus fullWidth name="email" label="Email Address" type="email" autoComplete="email" margin="normal" required />
                <TextInput autoFocus fullWidth name="code" label="code" margin="normal" required />
                <PasswordInput name="password" label="Password" fullWidth autoComplete="current-password" required margin="normal" />

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
