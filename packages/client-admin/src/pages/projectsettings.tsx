import { Box, Card, CardContent, CardHeader, FormLabel, IconButton } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField, Icon as MuiIcon } from '@mui/material';
import { useState } from 'react';
import { Icon } from '@components/icon';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useGetProjectQuery } from '@graphql/project/project';
import { useUpdateProjectMutation } from '@graphql/project/project';
import { useAuth } from '../context/auth.context';

const IconPreview = (props: any) => {
  const { icon, size, imageSize } = props;

  return (
    <MuiIcon fontSize={size}>
      <img src={icon} alt="icon" style={{ width: imageSize, height: imageSize }} />
    </MuiIcon>
  );
};

export const ProjectSettings = () => {
  const { token, decoded_token, setToken } = useAuth();
  const projectId = decoded_token?.projectId || '';
  const [isDisabled, setIsDisabled] = useState(true);
  const [updateProject] = useUpdateProjectMutation();
  const { data: projectData, called, loading } = useGetProjectQuery({ variables: { id: projectId }, skip: !projectId });

  const initialValues = {
    id: projectData?.getProject.id || '',
    name: projectData?.getProject.name || '',
    description: projectData?.getProject.description || '',
    logo: projectData?.getProject.logo || '',
    homePage: projectData?.getProject.homePage || '',
    redirectUrl: projectData?.getProject.redirectUrl || ''
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await updateProject({
            variables: { id: values.id, name: values.name, description: values.description, logo: values.logo, homePage: values.homePage, redirectUrl: values.redirectUrl }
          });

          window.alert('Project Settings have been updated');
        } catch (error) {
          console.error(error);
          window.alert('Error in updating project');
        }

        setSubmitting(false);
        setIsDisabled(true);
      }}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <Card>
            <CardHeader
              action={
                <IconButton disabled={isSubmitting} onClick={() => setIsDisabled(false)}>
                  Edit
                  <Icon icon={faCaretDown} />
                </IconButton>
              }
            />
            <CardContent>
              <FormLabel>Name</FormLabel>
              <Field name="name">{({ field }: { field: any }) => <TextField fullWidth {...field} disabled={isDisabled} />}</Field>
              <FormLabel>Description</FormLabel>
              <Field name="description">{({ field }: { field: any }) => <TextField fullWidth {...field} disabled={isDisabled} />}</Field>

              <FormLabel>Logo</FormLabel>

              <Field name="logo">
                {({ field }: { field: any }) => (
                  <Box display="flex" alignItems="center" gap={5}>
                    <TextField fullWidth {...field} disabled={isDisabled} />
                    <IconPreview icon={values.logo} size="large" imageSize={100} />
                  </Box>
                )}
              </Field>
              <FormLabel>Home Page</FormLabel>
              <Field name="homePage">{({ field }: { field: any }) => <TextField fullWidth {...field} disabled={isDisabled} />}</Field>
              <FormLabel>Redirect URL</FormLabel>
              <Field name="redirectUrl">{({ field }: { field: any }) => <TextField fullWidth {...field} disabled={isDisabled} />}</Field>
            </CardContent>
            <IconButton type="submit" disabled={isSubmitting || isDisabled}>
              Save
              <Icon icon={faCaretDown} />
            </IconButton>
          </Card>
        </Form>
      )}
    </Formik>
  );
};
