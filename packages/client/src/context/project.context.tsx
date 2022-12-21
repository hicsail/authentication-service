import { Backdrop, CircularProgress, ThemeProvider, createTheme, useTheme, Alert } from '@mui/material';
import React, { createContext, FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProjectModel } from '../graphql/graphql';
import { useGetProjectQuery } from '../graphql/project/project';

export interface ProjectContextProps {
  project?: ProjectModel;
}

const ProjectContext = createContext<ProjectContextProps>({} as ProjectContextProps);

export interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectProvider: FC<ProjectProviderProps> = ({ children, ...props }) => {
  const [project, setProject] = useState<ProjectModel>();
  const { search } = useLocation();
  const theme = useTheme();
  const id = new URLSearchParams(search).get('projectId') || '';
  const redirectUrl = new URLSearchParams(search).get('redirectUrl') || '';
  const { data, called, loading } = useGetProjectQuery({
    variables: {
      id
    },
    skip: !id
  });

  useEffect(() => {
    if (data && data.getProject) {
      setProject({
        ...data.getProject,
        redirectUrl: redirectUrl || data.getProject.redirectUrl
      } as ProjectModel);
    }
  }, [data]);

  return (
    <ProjectContext.Provider value={{ project }} {...props}>
      <Backdrop open={!project} sx={{ backgroundColor: (theme) => theme.palette.background.default, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        {loading && <CircularProgress color="primary" />}
        {!loading && !project && id && (
          <Alert severity="error" variant="outlined">
            Invalid Project Id
          </Alert>
        )}
        {!id && (
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
