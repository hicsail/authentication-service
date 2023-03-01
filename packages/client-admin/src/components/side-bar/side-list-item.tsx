import React, { FC } from 'react';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import { Paths } from '@constants/paths';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export type SideListItemProps = TreeItemProps & {
  label: string;
  info?: string;
  path?: Paths;
  icon?: React.ReactNode;
  color?: string;
};

export const SideListItem: FC<SideListItemProps> = ({ path, icon, label, info, color, ...others }) => {
  const navigate = useNavigate();

  return (
    <TreeItem
      onClick={() => {
        if (path) {
          navigate(path);
        }
      }}
      sx={(theme) => ({
        mr: theme.spacing(2),
        color: theme.palette.text.secondary,
        [`& .${treeItemClasses.content}`]: {
          color: theme.palette.text.secondary,
          borderTopRightRadius: theme.spacing(4),
          borderBottomRightRadius: theme.spacing(4),
          paddingRight: theme.spacing(1),
          fontWeight: theme.typography.fontWeightMedium,
          '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular
          },
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          },
          '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: theme.palette.action.selected,
            color: color || theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightBold
          },
          [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit'
          }
        },
        [`& .${treeItemClasses.group}`]: {
          marginLeft: 0,
          [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2)
          }
        }
      })}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, pr: 0 }}>
          <Box color="inherit" sx={{ mr: 1 }}>
            {icon}
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {label}
          </Typography>
          <Typography variant="caption" color="inherit">
            {info}
          </Typography>
        </Box>
      }
      {...others}
    />
  );
};
