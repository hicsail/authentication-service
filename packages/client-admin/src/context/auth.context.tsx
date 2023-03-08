import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

export interface DecodedToken {
  id: string;
  projectId: string;
  role: number;
}

export interface AuthContextProps {
  initialized: boolean;
  token?: string;
  decoded_token?: DecodedToken;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const [initialized, setInitialized] = useState(false);
  const [token, setToken] = useState<string>();
  const [decoded_token, setDecodedToken] = useState<DecodedToken>();

  useEffect(() => {
    const token = restoreToken();
    if (token) {
      setToken(token);
      setDecodedToken(jwt_decode(token));
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (token) {
      saveToken(token);
      setDecodedToken(jwt_decode(token));
    }
  }, [token]);

  return <AuthContext.Provider value={{ token, decoded_token, setToken, initialized }} {...props} />;
};

const saveToken = (token: string) => {
  localStorage.setItem('token', token);
};

const restoreToken = (): string | null => {
  return localStorage.getItem('token');
};

export const useAuth = () => useContext(AuthContext);
