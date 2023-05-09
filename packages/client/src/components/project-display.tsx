import { FC } from 'react';
import { ProjectModel } from '@graphql/graphql';
import { Box, Typography } from '@mui/material';

export interface ProjectDisplayProps {
  project?: ProjectModel;
}

export const ProjectDisplay: FC<ProjectDisplayProps> = ({ project }) => {
  if (!project) {
    return null;
  }
  return (
    <>
      {project.logo && <Box component="img" alt="project logo" src={project.logo} sx={{ mb: 2, maxHeight: '15vh' }} />}
      {project.name && project.settings.displayProjectName && (
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {project?.name}
        </Typography>
      )}
    </>
  );
};
