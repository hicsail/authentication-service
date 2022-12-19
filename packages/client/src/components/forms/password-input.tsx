import { FC, useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { TextInput, TextInputProps } from './text-input';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const PasswordInput: FC<TextInputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      {...props}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} onMouseDown={(event) => event.preventDefault()} edge="end">
              {!!showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};
