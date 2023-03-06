import { Alert, Backdrop, CircularProgress, createTheme, ThemeProvider, useTheme } from '@mui/material';
import React, { createContext, FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProjectModel } from '@graphql/graphql';
import { useGetProjectQuery } from '@graphql/project/project';
import { useSettings } from '@context/settings.context';

export interface ProjectContextProps {
  project?: ProjectModel;
}

const ProjectContext = createContext<ProjectContextProps>({} as ProjectContextProps);

export interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectProvider: FC<ProjectProviderProps> = ({ children, ...props }) => {
  const { settings, setSettings } = useSettings();
  const [project, setProject] = useState<ProjectModel>();
  const [projectId, setProjectId] = useState('');
  const { search } = useLocation();
  const theme = useTheme();
  const redirectUrl = new URLSearchParams(search).get('redirectUrl') || '';
  const { data, loading, refetch } = useGetProjectQuery({
    variables: {
      id: projectId
    },
    skip: !projectId
  });

  useEffect(() => {
    const id = new URLSearchParams(search).get('projectId') || '';
    if (id) {
      setProjectId(id);
    } else if (settings.lastProject) {
      setProjectId(settings.lastProject);
    }
  }, [settings]);

  useEffect(() => {
    if (projectId) {
      refetch({
        id: projectId
      });
    }
  }, [projectId]);

  useEffect(() => {
    if (data && data.getProject) {
      setProject({
        ...data.getProject,
        redirectUrl: redirectUrl || data.getProject.redirectUrl
      } as ProjectModel);
      setSettings({
        lastProject: data.getProject.id,
        ...settings
      });
    }
  }, [data]);

  return (
    <ProjectContext.Provider value={{ project }} {...props}>
      <Backdrop open={!project} sx={{ backgroundColor: (theme) => theme.palette.background.default, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        {loading && <CircularProgress color="primary" />}
        {!loading && !project && projectId && (
          <Alert severity="error" variant="outlined">
            Invalid Project Id
          </Alert>
        )}
        {!projectId && (
          <Alert severity="error" variant="outlined">
            Missing Project Id
          </Alert>
        )}
      </Backdrop>
      <ThemeProvider
        theme={createTheme({
          ...theme,
          ...project?.muiTheme
        })}
      >
        {children}
      </ThemeProvider>
    </ProjectContext.Provider>
  );
};

export const useProject = () => React.useContext(ProjectContext);
