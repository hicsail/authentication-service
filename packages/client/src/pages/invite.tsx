import { Alert, Avatar, Box, Button, Card, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@components/forms/text-input';
import { PasswordInput } from '@components/forms/password-input';
import { SubmitButton } from '@components/forms/submit-button';
import { useAcceptInviteMutation, useGetInviteQuery } from '@graphql/auth/invite';

import { FC, useEffect, useState } from 'react';
import { useProject } from '@context/project.context';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ProjectDisplay } from '@components/project-display';
import { InviteStatus } from '@graphql/graphql';
import { Paths } from '@constants/paths';
import { useSnackbar } from '@context/snackbar.context';

const SignUpValidation = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

export const Invite: FC = () => {
  const { inviteId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { inviteCode } = new URLSearchParams(location.search) as any;
  const { project, setProjectId } = useProject();
  const { pushMessage } = useSnackbar();

  const { data: inviteData, error: inviteError } = useGetInviteQuery({
    variables: {
      id: inviteId || ''
    },
    skip: !inviteId
  });

  const [acceptInvite, { data: acceptInviteData, error: acceptInviteError }] = useAcceptInviteMutation();

  // Update the project for the current invite
  useEffect(() => {
    if (inviteData?.invite) {
      if (inviteData.invite.projectId) {
        setProjectId(inviteData.invite.projectId);
      }
      switch (inviteData.invite.status) {
        case InviteStatus.Accepted:
          pushMessage('Invite has already been accepted');
          break;
        case InviteStatus.Expired:
          pushMessage('Invite has expired, please contact the project owner to resend the invite');
          break;
        case InviteStatus.Cancelled:
          pushMessage('Invite has been cancelled,  please contact the project owner if this is a mistake');
          break;
      }
    }
    if (inviteError) {
      pushMessage('Invite not found, please contact the project owner to resend the invite');
    }
  }, [inviteData, inviteError]);

  useEffect(() => {
    if (acceptInviteData && acceptInviteData.acceptInvite && acceptInviteData.acceptInvite.id) {
      // Successfully accepted invite, redirecting to log in
      navigate(Paths.LOGIN);
      pushMessage('Invite accepted, please log in', 'success');
    } else if (acceptInviteError) {
      pushMessage('Error accepting invite, please contact the project owner to resend the invite');
    }
  }, [acceptInviteData, acceptInviteError]);

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
        {inviteData?.invite && (
          <Formik
            validationSchema={SignUpValidation}
            initialValues={{ fullname: '', email: '', confirmPassword: '', password: '' }}
            onSubmit={async ({ email, password, fullname }) => {
              await acceptInvite({
                variables: {
                  input: {
                    email,
                    password,
                    fullname,
                    inviteCode,
                    projectId: inviteData.invite.projectId
                  }
                }
              });
            }}
          >
            <Form>
              <Card>
                <CardHeader title="Create Account" />
                <CardContent>
                  <TextInput autoFocus fullWidth name="fullname" label="Full Name" type="text" autoComplete="name" margin="normal" required />
                  <TextInput fullWidth name="email" label="Email Address" type="email" autoComplete="email" margin="normal" required />
                  <PasswordInput name="password" label="Password" fullWidth autoComplete="new-password" required margin="normal" />
                  <PasswordInput name="confirmPassword" label="Confirm Password" fullWidth autoComplete="new-password" required margin="normal" />
                </CardContent>
              </Card>
              <SubmitButton fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
                Accept Invite
              </SubmitButton>
            </Form>
          </Formik>
        )}
      </Box>
    </Container>
  );
};
