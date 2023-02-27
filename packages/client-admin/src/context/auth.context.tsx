import React, { createContext, FC, useContext, useEffect, useState } from 'react';

export interface Token {
  token: string;
}

export interface AuthContextProps {
  token: Token;
  setToken: (token: Token) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const [token, setToken] = useState<Token>(restoreToken());

  useEffect(() => {
    saveToken(token);
  }, [token]);

  return <AuthContext.Provider value={{ token, setToken }} {...props} />;
};

const saveToken = (token: Token) => {
  localStorage.setItem('token', JSON.stringify(token));
};

const restoreToken = (): Token => {
  var token = localStorage.getItem('token');
  return token ? JSON.parse(token) : { token: '' };
};

export const useAuth = () => useContext(AuthContext);
