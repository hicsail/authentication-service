import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

export interface Token {
  token: string;
}

export interface AuthContextProps {
  token: Token;
  decoded_token: any;
  setToken: (token: Token) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const [token, setToken] = useState<Token>(restoreToken());
  const [decoded_token, setDecodedToken] = useState({ token: '' });

  useEffect(() => {
    saveToken(token);
    setDecodedToken(jwt_decode(token.token));
  }, [token]);

  return <AuthContext.Provider value={{ token, decoded_token, setToken }} {...props} />;
};

const saveToken = (token: Token) => {
  localStorage.setItem('token', JSON.stringify(token));
};

const restoreToken = (): Token => {
  var token = localStorage.getItem('token');
  return token ? JSON.parse(token) : { token: '' };
};

export const useAuth = () => useContext(AuthContext);
