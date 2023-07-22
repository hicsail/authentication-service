import { SubmitButton } from '@components/forms/submit-button';
import { TextInput } from '@components/forms/text-input';
import { Container, Box, Card, CardContent, CardHeader } from '@mui/material';
import { Formik, Form } from 'formik';

export const Password = () => {
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
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{ oldPassword: '', newPassword: '' }}
          onSubmit={async ({ oldPassword, newPassword }) => {
            console.log(oldPassword, newPassword);
          }}
        >
          {({ values }) => (
            <Form>
              <Card>
                <CardHeader title="Change Password" />
                <CardContent>
                  <TextInput autoFocus fullWidth name="oldPassword" label="Old Password" type="text" margin="normal" required value={values.oldPassword} />
                  <TextInput autoFocus fullWidth name="newPassword" label="New Password" type="text" margin="normal" required value={values.newPassword} />
                </CardContent>
              </Card>
              <SubmitButton fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
                Save
              </SubmitButton>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};
