export type UserSignup = {
  projectId: string;
  username: string;
  email: string;
  method: string;
  password: string;
};

export type UsernameLogin = {
  projectId: string;
  username: string;
  password: string;
};

export type EmailLogin = {
  projectId: string;
  email: string;
  password: string;
};

export type AccessToken = {
  accessToken: string;
};

export type ValidatedUser = {
  id: string;
  projectId: string;
  role: string;
};
