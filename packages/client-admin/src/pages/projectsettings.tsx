import { Card, CardContent, CardHeader, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, IconButton, Switch } from '@mui/material';
import { Formik, Form } from 'formik';
import { Icon as MuiIcon } from '@mui/material';
import { useState } from 'react';
import { Icon } from '@components/icon';
import { faCaretDown, faCircleXmark, faPen } from '@fortawesome/free-solid-svg-icons';
import { useGetProjectQuery, useUpdateProjectMutation, useUpdateProjectAuthMethodsMutation, useUpdateProjectSettingsMutation } from '@graphql/project/project';
import { useAuth } from '../context/auth.context';
import { TextInput } from '@components/forms/text-input';
import { LoadingButton } from '@mui/lab';
import { InputMaybe } from '@graphql/graphql';

const IconPreview = (props: any) => {
  const { icon, size, imageSize } = props;

  return (
    <MuiIcon fontSize={size}>
      <img src={icon} alt="icon" style={{ width: imageSize, height: imageSize }} />
    </MuiIcon>
  );
};

type Params = {
  id: string;
  displayProjectName?: InputMaybe<boolean> | undefined;
  allowSignup?: InputMaybe<boolean> | undefined;
  googleAuth?: InputMaybe<boolean> | undefined;
};

const ProjectAdditionalSettingsSwitch = () => {
  const { decoded_token } = useAuth();
  const projectId = decoded_token?.projectId || '';
  const { data: projectData, called, loading } = useGetProjectQuery({ variables: { id: projectId }, skip: !projectId });
  const [updateProjectAuthMethods] = useUpdateProjectAuthMethodsMutation();
  const [updateProjectSettings] = useUpdateProjectSettingsMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const params: Params = { id: projectId };
    switch (event?.target.name) {
      case 'displayProjectName':
        params.displayProjectName = event.target.checked;
        break;
      case 'allowSignup':
        params.allowSignup = event.target.checked;
        break;
      case 'googleAuth':
        params.googleAuth = event.target.checked;
        break;
    }
    try {
      switch (event?.target.name) {
        case 'displayProjectName':
          updateProjectSettings({ variables: params });
        case 'allowSignup':
          updateProjectSettings({ variables: params });
        case 'googleAuth':
          updateProjectAuthMethods({ variables: params });
      }
    } catch (error) {
      console.error(error);
      window.alert('Error in updating project');
    }
  };

  return (
    <FormControl component="fieldset" fullWidth>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormLabel component="legend">Additional Settings</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={projectData?.getProject.settings.displayProjectName || false} onChange={handleChange} name="displayProjectName" />}
              label="displayProjectName"
            />
            <FormControlLabel control={<Switch checked={projectData?.getProject.settings.allowSignup || false} onChange={handleChange} name="allowSignup" />} label="allowSignup" />
          </FormGroup>
        </Grid>
        <Grid item xs={6}>
          <FormLabel component="legend">Auth Methods</FormLabel>
          <FormGroup>
            <FormControlLabel control={<Switch checked={projectData?.getProject.authMethods.googleAuth || false} onChange={handleChange} name="googleAuth" />} label="googleAuth" />
          </FormGroup>
        </Grid>
      </Grid>
    </FormControl>
  );
};

export const ProjectSettings = () => {
  const { decoded_token } = useAuth();
  const projectId = decoded_token?.projectId || '';
  const [isEditing, setisEditing] = useState(true);
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
        setisEditing(true);
      }}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <Card>
            <CardHeader
              action={
                <IconButton onClick={() => setisEditing(false)}>
                  <Icon icon={isEditing ? faCircleXmark : faPen} />
                </IconButton>
              }
            />
            <CardContent>
              <TextInput disabled={isEditing} autoFocus fullWidth name="name" label="Name" type="text" margin="normal" required />
              <TextInput disabled={isEditing} autoFocus fullWidth name="description" label="Description" type="text" margin="normal" required />
              <TextInput disabled={isEditing} autoFocus fullWidth name="logo" label="Logo" type="text" margin="normal" required />
              <IconPreview icon={values.logo} size="large" imageSize={100} />
              <TextInput disabled={isEditing} autoFocus fullWidth name="homePage" label="HomePage" type="text" margin="normal" required />
              <TextInput disabled={isEditing} autoFocus fullWidth name="redirectUrl" label="RedirectUrl" type="text" margin="normal" required />
            </CardContent>
            <LoadingButton fullWidth variant="contained" color="primary" sx={{ my: 2 }} loading={isSubmitting} disabled={isEditing || isSubmitting} type="submit">
              Save
            </LoadingButton>
          </Card>

          <Card>
            <ProjectAdditionalSettingsSwitch />
          </Card>
        </Form>
      )}
    </Formik>
  );
};
