export type UserSignup = {
  project_id: string;
  username: string;
  email: string;
  method: string;
  password: string;
};

export type UsernameLogin = {
  project_id: string;
  username: string;
  password: string;
};

export type EmailLogin = {
  project_id: string;
  email: string;
  password: string;
};

export type AccessToken = {
  access_token: string;
};

export type ValidatedUser = {
  userId: string;
  username: string;
};
