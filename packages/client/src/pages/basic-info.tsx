import { SubmitButton } from '@components/forms/submit-button';
import { TextInput } from '@components/forms/text-input';
import { Container, Box, Card, CardContent, CardHeader } from '@mui/material';
import { Form, Formik } from 'formik';

export const BasicInfo = () => {
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
          initialValues={{ name: 'Test User', email: 'sail@bu.edu' }}
          onSubmit={async ({ email, name }) => {
            console.log(email, name);
          }}
        >
          {({ values }) => (
            <Form>
              <Card>
                <CardHeader title="Basic Info" />
                <CardContent>
                  <TextInput autoFocus fullWidth name="name" label="Name" type="text" margin="normal" required value={values.name} />
                  <TextInput autoFocus fullWidth name="email" label="Email Address" type="email" autoComplete="email" margin="normal" required value={values.name} />
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
