import { FC } from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { useTheme } from '@mui/material';

export const Icon: FC<FontAwesomeIconProps> = ({ icon, ...props }) => {
  const { palette } = useTheme();
  return <FontAwesomeIcon icon={icon} color={palette.primary.main} {...props} />;
};
