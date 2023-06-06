import { Alert, Snackbar, Stack } from '@mui/material';
import React, { createContext, FC, useState } from 'react';

type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarContextProps {
  pushMessage: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextProps>({} as SnackbarContextProps);

export interface SnackbarProviderProps {
  children: React.ReactNode;
}

export interface SnackbarMessage {
  id: string;
  message: string;
  type: SnackbarType;
}

export const SnackbarProvider: FC<SnackbarProviderProps> = ({ children, ...props }) => {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const pushMessage = (message: string, type: SnackbarType = 'error') => {
    setMessages([
      ...messages,
      {
        message,
        type,
        id: Math.random().toString(36)
      }
    ]);
  };

  const handleClose = (id: string, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessages(messages.filter((message) => message.id !== id));
  };

  return (
    <SnackbarContext.Provider value={{ pushMessage }} {...props}>
      {children}
      <Stack spacing={2} sx={{ maxWidth: 600 }}>
        {messages.map((message) => (
          <Snackbar key={message.id} open={true} autoHideDuration={10000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={() => handleClose(message.id)}>
            <Alert variant="filled" severity={message.type} onClose={() => handleClose(message.id)} sx={{ width: '100%' }}>
              {message.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => React.useContext(SnackbarContext);
