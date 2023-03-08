import { Avatar, Box, Button, Card, CardHeader, IconButton } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from '@mui/material';
import { useState } from 'react';

export const ProjectSettings = () => {
  const onSubmit = (value: any) => {
    console.log(value);
  };

  const initialValues = { name: 'Chris Cho', description: 'SAIL', logo: null, homePage: null, redirectUrl: null };
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <Box marginTop="100px">
      {' '}
      {/* Temporary margin */}
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <Field name="name">
            {({ field }: { field: any }) => (
              <Box>
                <Card>
                  <CardHeader avatar={<Avatar>U</Avatar>} action={<IconButton>{/* <MoreVert /> */}</IconButton>} title="Example Card" subheader="This is an example card" />
                  {/* other card content */}
                </Card>
                {/* <TextField label="Name" fullWidth {...field} disabled={isDisabled} />
                <Button>Edit value</Button> */}
              </Box>
            )}
          </Field>
          <Field name="description">{({ field }: { field: any }) => <TextField label="Description" fullWidth {...field} disabled={isDisabled} />}</Field>
          <Field name="logo">{({ field }: { field: any }) => <TextField label="Logo" fullWidth {...field} disabled={isDisabled} />}</Field>
          <Field name="homePage">{({ field }: { field: any }) => <TextField label="Homepage" fullWidth {...field} disabled={isDisabled} />}</Field>
          <Field name="redirectUrl">{({ field }: { field: any }) => <TextField label="Redirect URL" fullWidth {...field} disabled={isDisabled} />}</Field>
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </Box>
  );
};
